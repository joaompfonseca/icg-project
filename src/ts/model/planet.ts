import * as THREE from 'three';
import {Ball} from './ball';
import {Player} from '../logic/player';

class Planet extends Ball {
    constructor(
        scene: THREE.Scene,
        material: THREE.MeshPhongMaterial,
        position: THREE.Vector3,
        radius: number,
        tilt: number,
        rotationSpeed: number,
        orbitSpeed: number,
        owner: Player
    ) {
        super(scene, material, position, radius, tilt, rotationSpeed, orbitSpeed, owner);
    }

}

export {Planet};