import * as THREE from 'three';

class Spaceship {

    geometry: THREE.ConeGeometry;
    material: THREE.MeshPhongMaterial;
    mesh: THREE.Mesh;

    constructor() {
        this.geometry = new THREE.ConeGeometry(0.5, 2, 4);
        this.material = new THREE.MeshPhongMaterial({color: 0x00ff00});
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }
}

export {Spaceship};