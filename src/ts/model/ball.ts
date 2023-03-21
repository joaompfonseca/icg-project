import * as THREE from 'three';
import {MeshPhongMaterial} from "three";
import {Spaceship} from "./spaceship";

class Ball {

    // Ball
    scene: THREE.Scene;
    geometry: THREE.SphereGeometry;
    material: THREE.MeshPhongMaterial;
    mesh: THREE.Mesh;
    position: THREE.Vector3;
    radius: number;
    tilt: number;
    rotationSpeed: number;
    // Spaceships
    spaceshipOrbit: THREE.Group;
    spaceships: Spaceship[];

    constructor(scene: THREE.Scene, material: MeshPhongMaterial, position: THREE.Vector3, radius: number, tilt: number, rotationSpeed: number) {
        this.scene = scene;
        this.material = material;
        this.position = position;
        this.radius = radius;
        this.tilt = tilt;
        this.rotationSpeed = rotationSpeed;

        // TODO: add more options
        this.geometry = new THREE.SphereGeometry(radius, 2 * radius, 2 * radius);
        this.mesh = new THREE.Mesh(this.geometry, material);

        this.mesh.position.add(position);
        this.mesh.rotateZ(tilt);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        // For orbiting spaceships
        this.spaceshipOrbit = new THREE.Group();
        this.spaceshipOrbit.position.add(position);
        this.scene.add(this.spaceshipOrbit);
        this.spaceships = [];

        // TODO: remove
        this.mesh.add(new THREE.AxesHelper(2 * radius));
    }

    addSpaceship = (spaceship: Spaceship) => {
        // Assign random position on orbit
        const randAngle = Math.random() * 2 * Math.PI;
        const randRadius = (1.25 + 0.5 * Math.random()) * this.radius;
        spaceship.mesh.position.add(new THREE.Vector3(randRadius * Math.cos(randAngle), 0, randRadius * Math.sin(randAngle)));
        spaceship.mesh.rotation.set(0, Math.PI / 2 - randAngle, -Math.PI / 2);

        this.spaceships.push(spaceship);
        this.spaceshipOrbit.add(spaceship.mesh);
    }

    animate = () => {
        this.mesh.rotation.y += this.rotationSpeed;
        this.spaceshipOrbit.rotation.y += 0.025;
    }
}

export {Ball};