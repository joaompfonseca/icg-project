import * as THREE from 'three';
import {Owner} from "../logic/owner";

class Spaceship {

    owner: Owner;
    geometry: THREE.ConeGeometry;
    material: THREE.MeshPhongMaterial;
    mesh: THREE.Mesh;
    speed: number;

    constructor(owner: Owner) {
        this.owner = owner;

        this.geometry = new THREE.ConeGeometry(0.5, 2, 4);
        this.geometry.rotateX(Math.PI / 2);
        this.material = new THREE.MeshPhongMaterial({
            color: (this.owner === Owner.HUMAN) ? 0x00ff00 : 0xff0000,
            emissive: (this.owner === Owner.HUMAN) ? 0x00ff00 : 0xff0000,
            emissiveIntensity: 1,
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.speed = 0.5;
    }

    setPosition = (position: THREE.Vector3) => {
        this.mesh.position.copy(position);
    }

    setRotation = (rotation: THREE.Euler) => {
        this.mesh.rotation.copy(rotation);
    }

    lookAt = (position: THREE.Vector3) => {
        this.mesh.lookAt(position);
    }
}

export {Spaceship};