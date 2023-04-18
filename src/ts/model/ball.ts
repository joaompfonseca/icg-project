import * as THREE from 'three';
import {Spaceship} from "./spaceship";
import {CSS2DObject} from "three/examples/jsm/renderers/CSS2DRenderer";
import {Owner} from "../logic/owner";

class Ball {
    dispatcher: THREE.EventDispatcher;
    geometry: THREE.SphereGeometry;
    material: THREE.MeshPhongMaterial;
    mesh: THREE.Mesh;
    position: THREE.Vector3;
    radius: number;
    tilt: number;
    rotationSpeed: number;
    table: CSS2DObject;
    progress: CSS2DObject;
    spaceships: Spaceship[];
    maxSpaceships: number;
    orbitSpeed: number;
    spaceshipGroup: THREE.Group;
    mainGroup: THREE.Group;
    owner: Owner;
    colonization: number;
    colonizationOwner: Owner;
    colonizationTimer: NodeJS.Timer | null;

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
        this.dispatcher = new THREE.EventDispatcher();
        this.material = material;
        this.position = position;
        this.radius = radius;
        this.tilt = tilt;
        this.rotationSpeed = rotationSpeed;
        this.maxSpaceships = maxSpaceships;
        this.orbitSpeed = orbitSpeed;
        this.owner = Owner.NONE;
        this.colonization = 0;
        this.colonizationOwner = Owner.NONE;
        this.colonizationTimer = null;

        // Mesh
        this.geometry = new THREE.SphereGeometry(radius, (1 / (0.1 * radius) + 2) * radius, (1 / (0.1 * radius) + 2) * radius);
        this.mesh = new THREE.Mesh(this.geometry, material);
        this.mesh.rotateZ(tilt);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.add(new THREE.AxesHelper(2 * radius)); // TODO: remove

        // Spaceships
        this.spaceships = [];
        this.spaceshipGroup = new THREE.Group();

        // Info table
        const table = document.createElement('table');
        table.style.color = 'white';
        const ownerRow = table.insertRow(0);
        ownerRow.insertCell(0).innerHTML = '<b>Owner</b>';
        ownerRow.insertCell(1);
        const spaceshipsRow = table.insertRow(1);
        spaceshipsRow.insertCell(0).innerHTML = '<b>Spaceships</b>';
        spaceshipsRow.insertCell(1);
        this.table = new CSS2DObject(table);
        this.table.position.set(0, (1 / (0.1 * radius) + 1.5) * radius, 0);
        this.updateTable();

        // Colonization progress bar
        const progress = document.createElement('progress');
        progress.value = 0;
        progress.max = 100;
        progress.hidden = true;
        this.progress = new CSS2DObject(progress);
        this.colonize(owner);

        // Add nodes to main group
        this.mainGroup = new THREE.Group();
        this.mainGroup.add(this.mesh);
        this.mainGroup.add(this.spaceshipGroup);
        this.mainGroup.add(this.table);
        this.mainGroup.add(this.progress);
        this.mainGroup.position.copy(position);
    }

    addSpaceship = (spaceship: Spaceship) => {
        // Start colonization if ball has no owner
        if (this.owner === Owner.NONE && this.colonizationOwner === Owner.NONE) {
            this.colonize(spaceship.owner);
        }
        // Spaceship from enemy
        else if ((spaceship.owner !== this.owner && this.owner !== Owner.NONE) || (spaceship.owner !== this.colonizationOwner)) {
            // Enemy spaceship destroys one spaceship
            if (this.spaceships.length > 0) {
                this.remSpaceship();
                return;
            }
            // Start colonization if no spaceships are left
            else {
                this.colonize(spaceship.owner);
            }
        }
        // Assign random position on orbit
        const randAngle = Math.random() * 2 * Math.PI;
        const randRadius = (1.25 + 0.5 * Math.random()) * this.radius;
        spaceship.setPosition(new THREE.Vector3(randRadius * Math.cos(randAngle), 0, randRadius * Math.sin(randAngle)));
        spaceship.setRotation(new THREE.Euler(0, Math.PI - randAngle, 0, 'XYZ'));
        // Add spaceship to ball
        this.spaceships.push(spaceship);
        this.spaceshipGroup.add(spaceship.mesh);
        this.updateTable();
    }

    remSpaceship = () => {
        if (this.spaceships.length === 0) {
            return null;
        }
        const removed = this.spaceships.pop()!;
        this.spaceshipGroup.remove(removed.mesh);
        this.updateTable();
        return removed;
    }

    numSpaceships = () => {
        return this.spaceships.length;
    }

    colonize = (colonizationOwner: Owner) => {
        // Colonizer is already owner
        if (colonizationOwner === this.owner) {
            return;
        }
        // Colonizer is already colonizing
        if (colonizationOwner === this.colonizationOwner) {
            return;
        }
        // Clear previous colonization by different colonizer
        if (this.colonizationTimer !== null && colonizationOwner !== this.colonizationOwner) {
            this.updateProgress(0);
            clearInterval(this.colonizationTimer);
        }
        this.owner = Owner.NONE;
        this.colonizationOwner = colonizationOwner;

        this.colonizationTimer = setInterval(() => {
            // Reset colonization if no spaceships are in ball
            if (this.numSpaceships() === 0) {
                this.colonization = 0;
                this.colonizationOwner = Owner.NONE;
                this.updateProgress(0);
                if (this.colonizationTimer !== null) {
                    clearInterval(this.colonizationTimer);
                }
                return;
            }
            this.updateProgress(this.colonization + 1);
            // Colonize if colonization is complete
            if (this.colonization == 100) {
                this.owner = this.colonizationOwner;
                this.updateTable();
                if (this.colonizationTimer !== null) {
                    clearInterval(this.colonizationTimer);
                }
                this.dispatcher.dispatchEvent({type: 'colonize', owner: this.colonizationOwner});
                return;
            }
        }, 1000);
    }

    updateTable = () => {
        (<HTMLTableElement>this.table.element).rows[0].cells[1].innerHTML = this.owner.toString();
        (<HTMLTableElement>this.table.element).rows[0].cells[1].style.color = (this.owner === Owner.HUMAN) ? 'green' : ((this.owner === Owner.ENEMY) ? 'red' : 'white');
        (<HTMLTableElement>this.table.element).rows[1].cells[1].innerHTML = this.numSpaceships().toString() + '/' + this.maxSpaceships.toString();
    }

    updateProgress = (colonization: number) => {
        this.colonization = colonization;
        (<HTMLProgressElement>this.progress.element).hidden = !(this.colonization > 0 && this.colonization < 100);
        (<HTMLProgressElement>this.progress.element).value = this.colonization;
    }

    animate = () => {
        this.mesh.rotation.y += this.rotationSpeed;
        this.spaceshipGroup.rotation.y += this.orbitSpeed;
    }
}

export {Ball};