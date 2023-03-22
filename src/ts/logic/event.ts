import * as THREE from "three";
import {App} from "../app";
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

    // Cast ray from camera to mouse
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, app.camera);
    const intersects = raycaster.intersectObjects<THREE.Mesh>(app.level.balls.map(ball => ball.mesh), true);

    // Post-processing outline
    const outline = app.composer.passes.find(pass => pass instanceof OutlinePass) as OutlinePass;

    if (intersects.length === 0) {
        if (app.level.isBallSelected()) {
            outline.selectedObjects = [app.level.selected!.mesh];
        }
        else {
            outline.selectedObjects = [];
        }
    }
    else {
        const targetMesh = intersects[0].object;
        const targetBall = app.level.findBall(targetMesh)!;
        if (app.level.isBallSelected() && app.level.selected !== targetBall) {
            outline.selectedObjects = [app.level.selected!.mesh, targetMesh];
        }
        else {
            outline.selectedObjects = [targetMesh]
        }
    }
}

function onMouseClick(event: MouseEvent, app: App) {
    // Mouse position
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Cast ray from camera to mouse
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, app.camera);
    const intersects = raycaster.intersectObjects<THREE.Mesh>(app.level.balls.map(ball => ball.mesh), true);

    // Post-processing outline
    const outline = app.composer.passes.find(pass => pass instanceof OutlinePass) as OutlinePass;

    if (intersects.length === 0) {
        app.level.setSelected(null);
        outline.selectedObjects = [];
    }
    else {
        const targetMesh = intersects[0].object;
        const targetBall = app.level.findBall(targetMesh)!;
        console.log(targetBall)
        if (app.level.isBallSelected() && app.level.selected !== targetBall) {
            const fromBall = app.level.selected!;
            // Send one spaceship from fromBall to targetBall
            app.level.sendSpaceship(fromBall, targetBall);
        }
        else {
            app.level.setSelected(targetBall);
            outline.selectedObjects = [targetMesh];
        }
    }
}

export {onResize, onMouseMove, onMouseClick};