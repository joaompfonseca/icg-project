import * as THREE from 'three';
import {Ball} from '../model/ball';
import {Spaceship} from "../model/spaceship";

class Path {
    fromBall: Ball;
    targetBall: Ball;
    spaceship: Spaceship;
    direction: THREE.Vector3;
    totalDistance: number;
    travelDistance: number;

    constructor(fromBall: Ball, targetBall: Ball, spaceship: Spaceship) {
        this.fromBall = fromBall;
        this.targetBall = targetBall;
        this.spaceship = spaceship;

        this.direction = new THREE.Vector3();
        this.direction.subVectors(this.targetBall.position, this.fromBall.position);
        this.direction.normalize();

        this.spaceship.setPosition(this.fromBall.position.clone().addScaledVector(this.direction, 1.25 * this.fromBall.radius));
        this.spaceship.lookAt(this.targetBall.position);

        this.totalDistance = this.fromBall.position.distanceTo(this.targetBall.position)
            - 1.25 * this.fromBall.radius
            - 1.25 * this.targetBall.radius;
        this.travelDistance = 0;
    }

    isFinished = () => {
        return this.travelDistance >= this.totalDistance;
    }

    animate = () => {
        const displacement = this.direction.clone().multiplyScalar(this.spaceship.speed);
        this.spaceship.mesh.position.add(displacement);
        this.travelDistance += this.spaceship.speed;
        if (this.isFinished()) {
            this.targetBall.addSpaceship(this.spaceship);
        }
    }
}

export {Path};