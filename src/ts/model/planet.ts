import * as THREE from 'three';
import {Ball} from './ball';

class Planet extends Ball {
    constructor(
        scene: THREE.Scene,
        material: THREE.MeshPhongMaterial,
        position: THREE.Vector3,
        radius: number,
        tilt: number,
        rotationSpeed: number,
        orbitSpeed: number
    ) {
        super(scene, material, position, radius, tilt, rotationSpeed, orbitSpeed);
    }

}

export {Planet};