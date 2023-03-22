import * as THREE from 'three';
import {MeshPhongMaterial} from "three";
import {Spaceship} from "./spaceship";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";

class Ball {
    scene: THREE.Scene;
    geometry: THREE.SphereGeometry;
    material: THREE.MeshPhongMaterial;
    mesh: THREE.Mesh;
    position: THREE.Vector3;
    radius: number;
    tilt: number;
    rotationSpeed: number;
    label: CSS2DObject;
    spaceships: THREE.Group;
    mainGroup: THREE.Group;

    constructor(scene: THREE.Scene, material: MeshPhongMaterial, position: THREE.Vector3, radius: number, tilt: number, rotationSpeed: number) {
        this.scene = scene;
        this.material = material;
        this.position = position;
        this.radius = radius;
        this.tilt = tilt;
        this.rotationSpeed = rotationSpeed;

        // Mesh
        this.geometry = new THREE.SphereGeometry(radius, 2 * radius, 2 * radius);
        this.mesh = new THREE.Mesh(this.geometry, material);
        this.mesh.position.copy(position);
        this.mesh.rotateZ(tilt);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.add(new THREE.AxesHelper(2 * radius)); // TODO: remove

        // Spaceships
        this.spaceships = new THREE.Group();

        // Label
        const div = document.createElement('div');
        div.className = 'label';
        div.textContent = this.spaceships.children.length.toString();
        this.label = new CSS2DObject(div);
        this.label.position.set(0, 1.2 * radius, 0);

        // Add nodes to scene
        this.mainGroup = new THREE.Group();
        this.mainGroup.add(this.mesh);
        this.mainGroup.add(this.spaceships);
        this.mainGroup.add(this.label);
        this.mainGroup.position.copy(position);
        this.scene.add(this.mainGroup);
    }

    addSpaceship = (spaceship: Spaceship) => {
        // Assign random position on orbit
        const randAngle = Math.random() * 2 * Math.PI;
        const randRadius = (1.25 + 0.5 * Math.random()) * this.radius;
        spaceship.mesh.position.add(new THREE.Vector3(randRadius * Math.cos(randAngle), 0, randRadius * Math.sin(randAngle)));
        spaceship.mesh.rotation.set(0, Math.PI / 2 - randAngle, -Math.PI / 2);
        // Add spaceship to ball
        this.spaceships.add(spaceship.mesh);
        this.label.element.textContent = this.spaceships.children.length.toString();
    }

    remSpaceship = () => {
        const success = this.spaceships.children.pop() !== undefined;
        this.label.element.textContent = this.spaceships.children.length.toString();
        return success;
    }

    animate = () => {
        this.mesh.rotation.y += this.rotationSpeed;
        this.spaceships.rotation.y += 0.025;
    }
}

export {Ball};