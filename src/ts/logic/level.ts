import {Ball} from "../model/ball";

class Level {

    balls: Ball[];
    selected: Ball | null;

    constructor() {
        this.balls = [];
        this.selected = null;
    }

    addBall = (ball: Ball) => {
        this.balls.push(ball);
    }

    animate = () => {
        this.balls.forEach(ball => ball.animate());
    }
}

export {Level};