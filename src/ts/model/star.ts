import * as THREE from 'three';
import {Ball} from './ball';
import {Owner} from '../logic/owner';

class Star extends Ball {
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
        this.table.element.hidden = true;

        // Emit light
        const light = new THREE.PointLight(0xffffff, 1, 10000);
        this.mainGroup.add(light);
    }

}

export {Star};