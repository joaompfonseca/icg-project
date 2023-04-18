import * as THREE from 'three';
import {Ball} from '../model/ball';
import {Path} from './path';
import {Owner} from './owner';
import {Spaceship} from '../model/spaceship';

class Level {
    dispatcher: THREE.EventDispatcher;
    balls: Ball[];
    selected: Ball | null;
    paths: Path[];
    paused: boolean;
    pathGroup: THREE.Group;
    mainGroup: THREE.Group;

    constructor() {
        this.dispatcher = new THREE.EventDispatcher();
        this.balls = [];
        this.selected = null;
        this.paused = false;

        // Paths
        this.paths = [];
        this.pathGroup = new THREE.Group();

        // Generation of spaceships TODO: change location of this?
        setInterval(() => {
            this.balls.forEach(ball => {
                if (ball.colonization === 100 && ball.owner !== Owner.NONE && ball.numSpaceships() < ball.maxSpaceships && !this.paused) {
                    ball.addSpaceship(new Spaceship(ball.owner));
                }
            });
        }, 1000);

        // Add nodes to main group
        this.mainGroup = new THREE.Group();
        this.mainGroup.add(this.pathGroup);
    }

    addBall = (ball: Ball) => {
        ball.dispatcher.addEventListener('colonize', () => {
            this.isEndLevel();
        });
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

    isEndLevel = () => {
        const ballsOwners = new Set(this.balls.map(ball => ball.owner));
        // No unique owner of all balls or unique owner is NONE
        if (ballsOwners.size !== 1 || ballsOwners.has(Owner.NONE)) {
            return;
        }
        // End of level
        this.dispatcher.dispatchEvent({type: 'end', winner: ballsOwners.has(Owner.HUMAN) ? Owner.HUMAN : Owner.ENEMY});
    }

    sendSpaceship = (fromBall: Ball, targetBall: Ball) => {
        const spaceship = fromBall.remSpaceship();
        if (spaceship !== null) {
            const path = new Path(fromBall, targetBall, spaceship);
            this.paths.push(path);
            this.pathGroup.add(spaceship.mesh);
        }
    }

    sendHalfSpaceships = async (fromBall: Ball, targetBall: Ball) => {
        const half = Math.floor(fromBall.numSpaceships() / 2);
        for (let i = 0; i < half; i++) {
            this.sendSpaceship(fromBall, targetBall);
            await new Promise(resolve => setTimeout(resolve, 50)); // TODO: maybe change this
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