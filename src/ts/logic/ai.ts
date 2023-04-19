import {Level} from "./level";
import {Owner} from "./owner";
import {Ball} from "../model/ball";

class AI {
    level: Level;
    owner: Owner;
    timeout: NodeJS.Timeout;

    constructor(level: Level, owner: Owner) {
        this.level = level;
        this.owner = owner;
    }

    getMyBalls = () => {
        return this.level.balls.filter(ball => ball.owner === this.owner);
    }

    getEmptyBalls = () => {
        return this.level.balls.filter(ball => ball.owner === Owner.NONE);
    }

    getEnemyBalls = () => {
        return this.level.balls.filter(ball => ball.owner !== this.owner && ball.owner !== Owner.NONE);
    }

    getMostSpaceshipsBall = (balls: Ball[]) => {
        return balls.sort((a, b) => b.numSpaceships() - a.numSpaceships())[0];
    }

    getLeastSpaceshipsBall = (balls: Ball[], target: Ball) => {
        return balls.sort((a, b) => a.numSpaceships() - b.numSpaceships())[0];
    }

    getClosestBall = (balls: Ball[], target: Ball) => {
        return balls.sort((a, b) => a.position.distanceTo(target.position) - b.position.distanceTo(target.position))[0];
    }

    decide = () => {
        if (!this.level.paused) {
            const myBalls = this.getMyBalls();
            const emptyBalls = this.getEmptyBalls();
            const enemyBalls = this.getEnemyBalls();

            // Needs to own at least one ball
            if (myBalls.length > 0) {
                // Preference 1. Use ball with most spaceships
                const ball = this.getMostSpaceshipsBall(myBalls);
                // Preference 2. Colonize empty balls
                if (emptyBalls.length > 0) {
                    // Preference 2.1. Closest empty ball
                    const closest = this.getClosestBall(emptyBalls, ball);
                    // Send half of the spaceships
                    this.level.sendHalfSpaceships(ball, closest);
                }
                // Preference 3. Attack enemy balls
                else if (enemyBalls.length > 0) {
                    // Preference 3.1. Least spaceships enemy ball
                    const least = this.getLeastSpaceshipsBall(enemyBalls, ball);
                    // Send half of the spaceships
                    this.level.sendHalfSpaceships(ball, least);
                }
            }
        }
        this.timeout = setTimeout(this.decide, 15000);
    }

    run = () => {
        this.decide();
    }

    stop = () => {
        clearTimeout(this.timeout);
    }
}

export {AI};