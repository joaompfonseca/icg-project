import * as THREE from 'three';
import {Ball} from './ball';
import {Owner} from '../logic/owner';

class Planet extends Ball {
    constructor(
        material: THREE.MeshPhongMaterial,
        position: THREE.Vector3,
        radius: number,
        tilt: number,
        rotationSpeed: number,
        maxSpaceships: number,
        orbitSpeed: number,
        owner: Owner
    ) {
        super(material, position, radius, tilt, rotationSpeed, maxSpaceships, orbitSpeed, owner);
    }

}

export {Planet};