import {Ball} from './ball';

class Planet extends Ball {
    constructor(position: THREE.Vector3, radius: number, tilt: number, rotationSpeed: number) {
        super(position, radius, tilt, rotationSpeed);
    }

}

export {Planet};