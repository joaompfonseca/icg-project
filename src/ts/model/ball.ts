import * as THREE from 'three';
import {MeshPhongMaterial} from "three";

class Ball {

    geometry: THREE.SphereGeometry;
    material: THREE.MeshPhongMaterial;
    mesh: THREE.Mesh;
    radius: number;
    tilt: number;
    rotationSpeed: number;

    constructor(radius: number, material: MeshPhongMaterial, tilt: number, rotationSpeed: number, position: THREE.Vector3) {
        this.radius = radius;
        this.tilt = tilt;
        this.rotationSpeed = rotationSpeed;

        // TODO: add more options
        this.geometry = new THREE.SphereGeometry(radius, 2*radius, 2*radius);
        this.material = material
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.add(position);
        this.mesh.rotateZ(tilt);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        // TODO: remove
        this.mesh.add(new THREE.AxesHelper(2 * radius));
    }

    animate = () => {
        this.mesh.rotation.y += this.rotationSpeed;
    }
}

export {Ball};