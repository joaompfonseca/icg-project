import * as THREE from 'three';
import {Ball} from '../model/ball';
import {Path} from './path';
import {Owner} from './owner';
import {Spaceship} from '../model/spaceship';
import {Star} from "../model/star";

class Level {
    num: number;
    dispatcher: THREE.EventDispatcher;
    balls: Ball[];
    stars: Star[];
    selected: Ball | null;
    paths: Path[];
    paused: boolean;
    ended: boolean;
    winner: Owner;
    pathGroup: THREE.Group;
    mainGroup: THREE.Group;

    constructor(num: number) {
        this.num = num;
        this.dispatcher = new THREE.EventDispatcher();
        this.balls = [];
        this.stars = [];
        this.selected = null;
        this.paused = false;
        this.ended = false;

        // Paths
        this.paths = [];
        this.pathGroup = new THREE.Group();

        // Generation of spaceships TODO: change location of this?
        setInterval(() => {
            if (!this.paused) {
                this.balls.forEach(ball => {
                    if (ball.colonization === 100 && ball.owner !== Owner.NONE && ball.numSpaceships() < ball.maxSpaceships) {
                        ball.addSpaceship(new Spaceship(ball.owner));
                    }
                });
            }
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

    addStar = (star: Star) => {
        this.stars.push(star);
        this.mainGroup.add(star.mainGroup);
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
        const winner = ballsOwners.has(Owner.HUMAN) ? Owner.HUMAN : Owner.ENEMY;
        // End of level
        this.dispatcher.dispatchEvent({
            type: 'end',
            winner: winner
        });
        this.ended = true;
        this.winner = winner;
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
        const spaceships: Spaceship[] = [];
        for (let i = 0; i < half; i++) {
            const spaceship = fromBall.remSpaceship();
            if (spaceship) {
                spaceships.push(spaceship);
            }
        }
        for (let spaceship of spaceships) {
            const path = new Path(fromBall, targetBall, spaceship);
            this.paths.push(path);
            this.pathGroup.add(spaceship.mesh);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    togglePause = () => {
        this.paused = !this.paused;
        this.balls.forEach(ball => ball.paused = this.paused);
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