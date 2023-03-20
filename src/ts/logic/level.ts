import {Ball} from "../model/ball";

class Level {

    balls: Ball[];

    constructor() {
        this.balls = [];
    }

    addBall = (ball: Ball) => {
        this.balls.push(ball);
    }

    animate = () => {
        this.balls.forEach(ball => ball.animate());
    }
}

export {Level};