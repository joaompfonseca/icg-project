import * as THREE from 'three';
import {MeshPhongMaterial} from "three";
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
    spaceships: Spaceship[];
    maxSpaceships: number;
    orbitSpeed: number;
    spaceshipGroup: THREE.Group;
    mainGroup: THREE.Group;
    owner: Owner;

    constructor(
        material: MeshPhongMaterial,
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
        this.owner = owner;

        // Mesh
        this.geometry = new THREE.SphereGeometry(radius, (1/(0.1 * radius)+2)*radius, (1/(0.1 * radius)+2)*radius);
        this.mesh = new THREE.Mesh(this.geometry, material);
        this.mesh.rotateZ(tilt);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.add(new THREE.AxesHelper(2 * radius)); // TODO: remove

        // Spaceships
        this.spaceships = [];
        this.spaceshipGroup = new THREE.Group();

        // Info table
        const elem = document.createElement('table');
        elem.style.color = 'white';
        const ownerRow = elem.insertRow(0);
        ownerRow.insertCell(0).innerHTML = '<b>Owner</b>';
        ownerRow.insertCell(1);
        const spaceshipsRow = elem.insertRow(1);
        spaceshipsRow.insertCell(0).innerHTML = '<b>Spaceships</b>';
        spaceshipsRow.insertCell(1);
        this.table = new CSS2DObject(elem);
        this.table.position.set(0, (1/(0.1 * radius)+1.5)*radius, 0);
        this.updateTable();

        // Add nodes to main group
        this.mainGroup = new THREE.Group();
        this.mainGroup.add(this.mesh);
        this.mainGroup.add(this.spaceshipGroup);
        this.mainGroup.add(this.table);
        this.mainGroup.position.copy(position);
    }

    addSpaceship = (spaceship: Spaceship) => {
        // Spaceship from enemy
        if (spaceship.owner !== this.owner) {
            // Enemy spaceship destroys one spaceship
            if (this.spaceships.length > 0) {
                this.remSpaceship();
                return;
            }
            // Start colonization TODO: timer
            else {
                this.owner = spaceship.owner;
                this.dispatcher.dispatchEvent({type: 'colonize', owner: this.owner});
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

    updateTable = () => {
        (<HTMLTableElement>this.table.element).rows[0].cells[1].innerHTML = this.owner.toString();
        (<HTMLTableElement>this.table.element).rows[0].cells[1].style.color = (this.owner === Owner.HUMAN) ? 'green' : ((this.owner === Owner.ENEMY) ? 'red' : 'white');
        (<HTMLTableElement>this.table.element).rows[1].cells[1].innerHTML = this.numSpaceships().toString() + '/' + this.maxSpaceships.toString();
    }

    animate = () => {
        this.mesh.rotation.y += this.rotationSpeed;
        this.spaceshipGroup.rotation.y += this.orbitSpeed;
    }
}

export {Ball};