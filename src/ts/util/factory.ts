import * as THREE from 'three';
import {Ball} from '../model/ball';
import {BallInterface} from './interface';
import {Planet} from '../model/planet';
import {Owner} from '../logic/owner';
import {Spaceship} from '../model/spaceship';
// Images
import earthMap from '../../jpg/balls/earth.jpg';
import marsMap from '../../jpg/balls/mars.jpg';
import moonMap from '../../jpg/balls/moon.jpg';
import defaultMap from '../../jpg/balls/default.jpg';

class Factory {
    static createBall = (ballData: BallInterface): Ball | null => {
        let res: Ball | null = null;
        let args = ballData.args;
        switch (ballData.class) {
            case 'Planet':
                // Create the planet
                res = new Planet(
                    new THREE.MeshPhongMaterial({
                        map: new THREE.TextureLoader().load((() => {
                                switch (args.material.map) {
                                    case 'earth':
                                        return earthMap;
                                    case 'mars':
                                        return marsMap;
                                    case 'moon':
                                        return moonMap;
                                    case 'default':
                                    default:
                                        return defaultMap;
                                }
                            }
                        )()),
                        shininess: args.material.shininess
                    }),
                    new THREE.Vector3(args.position.x, args.position.y, args.position.z),
                    args.radius,
                    THREE.MathUtils.degToRad(args.tilt),
                    args.rotationSpeed,
                    args.maxSpaceships,
                    args.orbitSpeed,
                    (() => {
                        switch (args.owner) {
                            case 'Human':
                                return Owner.HUMAN;
                            case 'Enemy':
                                return Owner.ENEMY;
                            case 'None':
                            default:
                                return Owner.NONE;
                        }
                    })());
                // Add the spaceships
                for (let i = 0; i < args.spaceships; i++) {
                    res.addSpaceship(new Spaceship((() => {
                        switch (args.owner) {
                            case 'Human':
                                return Owner.HUMAN;
                            case 'Enemy':
                                return Owner.ENEMY;
                            case 'None':
                            default:
                                return Owner.NONE;
                        }
                    })()));
                }
        }
        return res;
    }
}

export {Factory};