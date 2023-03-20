import * as THREE from 'three';

class Ball {

    geometry: THREE.SphereGeometry;
    material: THREE.MeshPhongMaterial;
    mesh: THREE.Mesh;
    radius: number;
    tilt: number;
    rotationSpeed: number;

    constructor(position: THREE.Vector3, radius: number, tilt: number, rotationSpeed: number) {
        this.radius = radius;
        this.tilt = tilt;
        this.rotationSpeed = rotationSpeed;

        // TODO: add more options
        this.geometry = new THREE.SphereGeometry(radius, 3*radius, 3*radius);
        this.material = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            shininess: 1,
            specular: 0xffffff
        });
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