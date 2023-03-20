import * as THREE from "three";
import {App} from "../main";
import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass";
import {Object3D} from "three";
import * as assert from "assert";

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

    // Highlight the first intersected object
    const outline = app.composer.passes.find(pass => pass instanceof OutlinePass) as OutlinePass;
    outline.selectedObjects = (intersects.length > 0) ? [intersects[0].object] : [];
}

function onMouseClick(event: MouseEvent, app: App) {
    // Check if a ball was clicked
    const outline = app.composer.passes.find(pass => pass instanceof OutlinePass) as OutlinePass;
    if (outline.selectedObjects.length == 0)
        return;

    // Find selected ball
    const ball = app.level.balls.find(ball => ball.mesh === outline.selectedObjects[0]);
    if (ball === undefined)
        return;

    // TODO: Select ball
}

export {onResize, onMouseMove, onMouseClick};