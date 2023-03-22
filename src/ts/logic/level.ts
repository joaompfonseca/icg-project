import * as THREE from 'three';
import {Ball} from '../model/ball';
import {Path} from './path';

class Level {
    scene: THREE.Scene;
    balls: Ball[];
    selected: Ball | null;
    paths: Path[];
    pathGroup: THREE.Group;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.balls = [];
        this.selected = null;
        this.paths = [];
        this.pathGroup = new THREE.Group();
        this.scene.add(this.pathGroup);
    }

    addBall = (ball: Ball) => {
        this.balls.push(ball);
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