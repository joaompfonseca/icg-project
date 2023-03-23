import * as THREE from 'three';
import {Ball} from '../model/ball';
import {BallInterface} from './interface';
import {Planet} from '../model/planet';
import {Owner} from '../logic/owner';
import {Spaceship} from '../model/spaceship';

class Factory {
    static createBall = (ballData: BallInterface): Ball | null => {
        let res: Ball | null = null;
        let args = ballData.args;
        switch (ballData.class) {
            case 'Planet':
                // Create the planet
                res = new Planet(
                    new THREE.MeshPhongMaterial({"color": parseInt(args.material.color.replace(/^#/, ''), 16), "shininess": args.material.shininess}),
                    new THREE.Vector3(args.position.x, args.position.y, args.position.z),
                    args.radius,
                    args.tilt,
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
                    res.addSpaceship(new Spaceship(res.owner));
                }
        }
        return res;
    }
}

export {Factory};