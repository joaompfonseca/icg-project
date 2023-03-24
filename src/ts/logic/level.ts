import * as THREE from 'three';
import {Ball} from '../model/ball';
import {Path} from './path';
import {Owner} from "./owner";
import {Spaceship} from "../model/spaceship";

class Level {
    balls: Ball[];
    selected: Ball | null;
    paths: Path[];
    paused: boolean;
    pathGroup: THREE.Group;
    mainGroup: THREE.Group;

    constructor() {
        this.balls = [];
        this.selected = null;
        this.paused = false;

        // Paths
        this.paths = [];
        this.pathGroup = new THREE.Group();

        // Generation of spaceships TODO: change location of this?
        setInterval(() => {
            this.balls.forEach(ball => {
                if (ball.owner !== Owner.NONE && ball.numSpaceships() < ball.maxSpaceships && !this.paused) {
                    ball.addSpaceship(new Spaceship(ball.owner));
                }
            });
        }, 1000);

        // Add nodes to main group
        this.mainGroup = new THREE.Group();
        this.mainGroup.add(this.pathGroup);
    }

    addBall = (ball: Ball) => {
        this.balls.push(ball);
        this.mainGroup.add(ball.mainGroup);
    }

    findBall = (mesh: THREE.Mesh) => {
        const ball = this.balls.find(ball => ball.mesh === mesh);
        return (ball !== undefined) ? ball : null;
    }

    setSelected = (ball: Ball | null) => {
        this.selected = ball;
    }

    isBallSelected = () => {
        return this.selected !== null;
    }

    sendSpaceship = (fromBall: Ball, targetBall: Ball) => {
        const spaceship = fromBall.remSpaceship();
        if (spaceship !== null) {
            const path = new Path(fromBall, targetBall, spaceship);
            this.paths.push(path);
            this.pathGroup.add(spaceship.mesh);
        }
    }

    togglePause = () => {
        this.paused = !this.paused;
    }

    animate = () => {
        this.balls.forEach(ball => ball.animate());
        this.paths.forEach(path => path.animate());
        // Remove finished paths
        const finished = this.paths.filter(path => path.isFinished());
        finished.forEach(path => {
            this.paths = this.paths.filter(p => p !== path);
            this.pathGroup.remove(path.spaceship.mesh);
        });
    }
}

export {Level};