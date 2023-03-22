import * as THREE from "three";
import {App} from "../main";
import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass";
import {Object3D} from "three";
import * as assert from "assert";
import {Spaceship} from "../model/spaceship";

function onResize(event: Event, app: App) {
    app.camera.aspect = window.innerWidth / window.innerHeight;
    app.camera.updateProjectionMatrix();
    app.composer.renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event: MouseEvent, app: App) {
    // Mouse position
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Cast a ray from camera to mouse
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, app.camera);
    const intersects = raycaster.intersectObjects(app.level.balls.map(ball => ball.mesh), true);

    // Highlight the first intersected ball
    const outline = app.composer.passes.find(pass => pass instanceof OutlinePass) as OutlinePass;
    if (intersects.length > 0) {
        console.log("MOVE: in ball; len=", outline.selectedObjects.length);
        if (app.level.selected === null) {
            outline.selectedObjects = [intersects[0].object];
        } else if (app.level.selected.mesh !== intersects[0].object) {
            outline.selectedObjects = [app.level.selected.mesh, intersects[0].object];
        }
    } else {
        console.log("MOVE: out ball; len=", outline.selectedObjects.length);
        if (app.level.selected === null) {
            outline.selectedObjects = [];
        } else {
            outline.selectedObjects = [app.level.selected.mesh];
        }
    }
}

function onMouseClick(event: MouseEvent, app: App) {
    // Mouse position
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Cast a ray from camera to mouse
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, app.camera);
    const intersects = raycaster.intersectObjects(app.level.balls.map(ball => ball.mesh), true);

    // Highlight the first intersected ball
    const outline = app.composer.passes.find(pass => pass instanceof OutlinePass) as OutlinePass;
    if (intersects.length > 0) {
        console.log("CLICK: in ball; len=", outline.selectedObjects.length);
        if (app.level.selected === null) {
            outline.selectedObjects = [intersects[0].object];
        }
        else if (app.level.selected.mesh !== intersects[0].object) {
            console.log("Sending spaceships");
            const fromBall = app.level.selected;
            const toBall = app.level.balls.find(ball => ball.mesh === intersects[0].object)!;
            const success = fromBall.remSpaceship();
            if (success)
                toBall.addSpaceship(new Spaceship());
        }
    } else {
        console.log("CLICK: out ball; len=", outline.selectedObjects.length);
        outline.selectedObjects = [];
    }

    // Find selected ball
    const ball = app.level.balls.find(ball => ball.mesh === outline.selectedObjects[0]);
    if (ball === undefined)
        app.level.selected = null;
    else
        app.level.selected = ball;
}

export {onResize, onMouseMove, onMouseClick};