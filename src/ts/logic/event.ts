import * as THREE from 'three';
import {App} from '../app';
import {OutlinePass} from 'three/examples/jsm/postprocessing/OutlinePass';
import {Owner} from './owner';
import {initMenu, toggleInfo} from '../util/init';

function onLevelResize(event: Event, app: App) {
    app.camera.aspect = window.innerWidth / window.innerHeight;
    app.camera.updateProjectionMatrix();
    app.composer.renderer.setSize(window.innerWidth, window.innerHeight);
}

function onLevelMouseMove(event: MouseEvent, app: App) {
    // Mouse position
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Cast ray from camera to mouse
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, app.camera);
    const intersects = raycaster.intersectObjects(app.level.balls.map(ball => ball.mesh), true)
        .filter(intersect => intersect.object instanceof THREE.Mesh);

    // Post-processing outline
    const outline = app.composer.passes.find(pass => pass instanceof OutlinePass) as OutlinePass;

    if (intersects.length === 0 || app.level.isBallSelected() && app.level.selected!.colonizationOwner !== Owner.HUMAN) {
        if (app.level.isBallSelected()) {
            outline.selectedObjects = [app.level.selected!.mesh];
        } else {
            outline.selectedObjects = [];
        }
    } else {
        const targetMesh = <THREE.Mesh>intersects[0].object;
        const targetBall = app.level.findBall(targetMesh)!;
        if (app.level.isBallSelected() && app.level.selected !== targetBall) {
            outline.selectedObjects = [app.level.selected!.mesh, targetMesh];
        } else {
            outline.selectedObjects = [targetMesh]
        }
    }

    // Draw line from selected ball to mouse
    app.scene.remove(app.line);
    if (app.level.isBallSelected()) {
        const selectedPosition = app.level.selected!.mainGroup.position;
        const mousePosition = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(app.camera);
        const points = [selectedPosition, mousePosition];
        app.line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(points),
            new THREE.LineBasicMaterial({color: 0xffffff})
        );
        app.scene.add(app.line);
    }
}

function onLevelLeftMouseClick(event: MouseEvent, app: App) {
    // Mouse position
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Cast ray from camera to mouse
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, app.camera);
    const intersects = raycaster.intersectObjects(app.level.balls.map(ball => ball.mesh), true)
        .filter(intersect => intersect.object instanceof THREE.Mesh);

    // Post-processing outline
    const outline = app.composer.passes.find(pass => pass instanceof OutlinePass) as OutlinePass;

    if (intersects.length === 0 || app.level.isBallSelected() && app.level.selected!.colonizationOwner !== Owner.HUMAN) {
        app.level.setSelected(null);
        outline.selectedObjects = [];
        app.scene.remove(app.line);
    } else {
        const targetMesh = <THREE.Mesh>intersects[0].object;
        const targetBall = app.level.findBall(targetMesh)!;
        if (app.level.isBallSelected() && app.level.selected !== targetBall) {
            const fromBall = app.level.selected!;
            // Send half of the spaceships from fromBall to targetBall
            app.level.sendHalfSpaceships(fromBall, targetBall);
        } else if (targetBall.owner === Owner.HUMAN || targetBall.colonizationOwner === Owner.HUMAN) {
            app.level.setSelected(targetBall);
            outline.selectedObjects = [targetMesh];
        }
    }
}

function onLevelRightMouseClick(event: MouseEvent, app: App) {
    // Mouse position
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Cast ray from camera to mouse
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, app.camera);
    const intersects = raycaster.intersectObjects(app.level.balls.map(ball => ball.mesh), true)
        .filter(intersect => intersect.object instanceof THREE.Mesh);

    // Post-processing outline
    const outline = app.composer.passes.find(pass => pass instanceof OutlinePass) as OutlinePass;

    if (intersects.length === 0 || app.level.isBallSelected() && app.level.selected!.colonizationOwner !== Owner.HUMAN) {
        app.level.setSelected(null);
        outline.selectedObjects = [];
        app.scene.remove(app.line);
    } else {
        const targetMesh = <THREE.Mesh>intersects[0].object;
        const targetBall = app.level.findBall(targetMesh)!;
        if (app.level.isBallSelected() && app.level.selected !== targetBall) {
            const fromBall = app.level.selected!;
            // Send one of the spaceships from fromBall to targetBall
            app.level.sendSpaceship(fromBall, targetBall);
        } else if (targetBall.owner === Owner.HUMAN || targetBall.colonizationOwner === Owner.HUMAN) {
            app.level.setSelected(targetBall);
            outline.selectedObjects = [targetMesh];
        }
    }
}

function onKeyDown(event: KeyboardEvent, app: App) {
    switch (event.key) {
        case 'i':
            toggleInfo();
            break;
        case 'm':
            initMenu(app);
            break;
        case 'n':
            if (app.level.ended && app.level.winner == Owner.HUMAN) {
                app.nextLevel();
            }
            break;
        case 'p':
            app.togglePause();
            break;
        case 'r':
            app.restartLevel();
            break;
        default:
            break;
    }
}

export {onLevelResize, onLevelMouseMove, onLevelLeftMouseClick, onLevelRightMouseClick, onKeyDown};