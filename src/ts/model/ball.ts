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
    spaceships: Spaceship[];
    orbitSpeed: number;
    spaceshipGroup: THREE.Group;
    mainGroup: THREE.Group;

    constructor(
        scene: THREE.Scene,
        material: MeshPhongMaterial,
        position: THREE.Vector3,
        radius: number,
        tilt: number,
        rotationSpeed: number,
        orbitSpeed: number
    ) {
        this.scene = scene;
        this.material = material;
        this.position = position;
        this.radius = radius;
        this.tilt = tilt;
        this.rotationSpeed = rotationSpeed;
        this.orbitSpeed = orbitSpeed;

        // Mesh
        this.geometry = new THREE.SphereGeometry(radius, 2 * radius, 2 * radius);
        this.mesh = new THREE.Mesh(this.geometry, material);
        this.mesh.position.copy(position);
        this.mesh.rotateZ(tilt);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.add(new THREE.AxesHelper(2 * radius)); // TODO: remove

        // Spaceships
        this.spaceships = [];
        this.spaceshipGroup = new THREE.Group();

        // Label
        const div = document.createElement('div');
        div.className = 'label';
        this.label = new CSS2DObject(div);
        this.label.position.set(0, 1.2 * radius, 0);
        this.updateLabel();

        // Add nodes to scene
        this.mainGroup = new THREE.Group();
        this.mainGroup.add(this.mesh);
        this.mainGroup.add(this.spaceshipGroup);
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
        this.spaceships.push(spaceship);
        this.spaceshipGroup.add(spaceship.mesh);
        this.updateLabel();
    }

    remSpaceship = () => {
        if (this.spaceships.length === 0) {
            return null;
        }
        const removed = this.spaceships.pop()!;
        this.spaceshipGroup.remove(removed.mesh);
        this.updateLabel();
        return removed;
    }

    numSpaceships = () => {
        return this.spaceships.length;
    }

    updateLabel = () => {
        this.label.element.textContent = this.numSpaceships().toString();
    }

    animate = () => {
        this.mesh.rotation.y += this.rotationSpeed;
        this.spaceshipGroup.rotation.y += this.orbitSpeed;
    }
}

export {Ball};