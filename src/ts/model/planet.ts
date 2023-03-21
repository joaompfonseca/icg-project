import * as THREE from 'three';
import {Ball} from './ball';
import {MeshPhongMaterial} from "three";

class Planet extends Ball {
    constructor(radius: number, material: MeshPhongMaterial, tilt: number, rotationSpeed: number, position: THREE.Vector3) {
        super(radius, material, tilt, rotationSpeed, position);
    }

}

export {Planet};