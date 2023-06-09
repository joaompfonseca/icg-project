import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import {OutlinePass} from 'three/examples/jsm/postprocessing/OutlinePass';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {App} from '../app';
import {Level} from '../logic/level';
import {onLevelResize, onLevelMouseMove, onLevelLeftMouseClick, onLevelRightMouseClick, onKeyDown} from '../logic/event';
import {CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer';
import levels from './../../json/levels.json';
import {Factory} from './factory';
import {LevelInterface} from './interface';
import {Owner} from '../logic/owner';
import {AI} from '../logic/ai';
import {Star} from '../model/star';
// Images
import sbBack from '../../jpg/skybox/back.jpg';
import sbBottom from '../../jpg/skybox/bottom.jpg';
import sbFront from '../../jpg/skybox/front.jpg';
import sbLeft from '../../jpg/skybox/left.jpg';
import sbRight from '../../jpg/skybox/right.jpg';
import sbTop from '../../jpg/skybox/top.jpg';
import starMap from '../../jpg/balls/star.jpg';

function initEmptyScene(app: App) {
    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(75, 75, 75);
    camera.lookAt(0, 0, 0);

    // ILLUMINATION
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setClearColor(new THREE.Color(0xffffff));
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.enabled = true;
    document.querySelector('#output')!.appendChild(renderer.domElement);

    // LABEL RENDERER
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.querySelector('#output')!.appendChild(labelRenderer.domElement);

    // POST PROCESSING
    const composer = new EffectComposer(renderer);
    const render = new RenderPass(scene, camera);
    composer.addPass(render);
    const outline = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    composer.addPass(outline);

    // CONTROLS
    const control = new OrbitControls(camera, labelRenderer.domElement);
    control.maxDistance = 500;
    control.enablePan = false;

    app.scene = scene;
    app.camera = camera;
    app.renderer = renderer;
    app.labelRenderer = labelRenderer;
    app.composer = composer;
    app.control = control;
}

function initEvents(app: App) {
    // Menu Events
    document.querySelector('#level-1')!.addEventListener('click', () => initLevel(app, 1), false);
    document.querySelector('#level-2')!.addEventListener('click', () => initLevel(app, 2), false);
    document.querySelector('#level-3')!.addEventListener('click', () => initLevel(app, 3), false);
    document.querySelector('#level-4')!.addEventListener('click', () => initLevel(app, 4), false);
    document.querySelector('#level-5')!.addEventListener('click', () => initLevel(app, 5), false);
    document.querySelector('#level-6')!.addEventListener('click', () => initLevel(app, 6), false);

    // Level Events
    window.addEventListener('resize', (event: Event) => onLevelResize(event, app), false);
    window.addEventListener('mousemove', (event: MouseEvent) => onLevelMouseMove(event, app), false);
    window.addEventListener('click', (event: MouseEvent) => onLevelLeftMouseClick(event, app), false);
    window.addEventListener('contextmenu', (event: MouseEvent) => onLevelRightMouseClick(event, app), false);

    // Navbar Events
    document.querySelector('#btn-navbar-menu')!.addEventListener('click', () => initMenu(app), false);
    document.querySelector('#btn-navbar-restart')!.addEventListener('click', () => app.restartLevel(), false);
    document.querySelector('#btn-navbar-pause')!.addEventListener('click', () => app.togglePause(), false);
    document.querySelector('#btn-navbar-info')!.addEventListener('click', () => app.toggleInfo(), false);

    // End Events
    document.querySelector('#btn-end-menu')!.addEventListener('click', () => initMenu(app), false);
    document.querySelector('#btn-end-restart')!.addEventListener('click', () => app.restartLevel(), false);
    document.querySelector('#btn-end-next')!.addEventListener('click', () => app.nextLevel(), false);

    // Keyboard Events
    document.addEventListener('keydown', (event: KeyboardEvent) => onKeyDown(event, app),false);
}

function initMenu(app: App) {
    // Delete all ball tables TODO: move this somewhere else, but it is needed if we go back and forth between menu and level
    app.level.balls.forEach(ball => {
        ball.mainGroup.remove(ball.table);
        ball.mainGroup.remove(ball.progress);
        ball.colonizationTimeout && clearTimeout(ball.colonizationTimeout);
    });
    app.ai?.stop();
    if (app.level.paused) {
        app.togglePause();
    }

    const level = new Level(0);

    app.setLevel(level);

    (<HTMLDivElement>document.querySelector('#menu')!).style.display = '';
    (<HTMLDialogElement>document.querySelector('#end')!).style.display = 'none';
    (<HTMLDivElement>document.querySelector('#output')!).style.display = 'none';
}

function initLevel(app: App, num: number) {
    // Delete all ball tables TODO: move this somewhere else, but it is needed if we go back and forth between menu and level
    app.level.balls.forEach(ball => {
        ball.mainGroup.remove(ball.table);
        ball.mainGroup.remove(ball.progress);
        ball.colonizationTimeout && clearTimeout(ball.colonizationTimeout);
    });
    app.ai?.stop();
    if (app.level.paused) {
        app.togglePause();
    }

    // Level is not available
    if (levels.length < num) {
        initMenu(app);
        return;
    }
    const levelData: LevelInterface = levels[num - 1];

    const level = new Level(num);

    // Balls
    for (let ballData of levelData.balls) {
        const ball = Factory.createBall(ballData);
        if (ball) {
            level.addBall(ball);
        }
    }

    // Star
    const star = new Star(
        new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load(starMap), shininess: 1, emissive: 0xFFA500, emissiveIntensity: 0.7}),
        new THREE.Vector3(0, 100, 1000), 100, 0, 0, 0, 0, Owner.NONE);
    level.addStar(star);

    // Skybox
    const skyboxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
    const skybox = new THREE.Mesh(skyboxGeometry, [
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sbRight), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sbLeft), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sbTop), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sbBottom), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sbFront), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sbBack), side: THREE.BackSide}),
    ]);
    level.mainGroup.add(skybox);

    // Set camera position
    app.camera.position.set(150, 150, 150);
    app.camera.lookAt(0, 0, 0);

    app.setLevel(level);

    // Create the enemy AI
    app.ai = new AI(level, Owner.ENEMY);
    app.ai.run();

    (<HTMLDivElement>document.querySelector('#menu')!).style.display = 'none';
    (<HTMLHeadingElement>document.querySelector('#title')!).textContent = `${num}. ${levelData.title}`;
    (<HTMLDialogElement>document.querySelector('#end')!).style.display = 'none';
    (<HTMLDivElement>document.querySelector('#output')!).style.display = '';
}

function initEnd(app: App, winner: Owner) {
    (<HTMLHeadingElement>document.querySelector('#winner')!).textContent = (winner === Owner.HUMAN) ? 'You win!' : 'You lose!';
    (<HTMLDialogElement>document.querySelector('#end')!).style.display = '';
    (<HTMLButtonElement>document.querySelector('#btn-end-next')!).style.display = (winner === Owner.ENEMY) ? 'none' : '';
}

function togglePause() {
    (<HTMLDivElement>document.querySelector('#pause')!).style.display = (<HTMLDivElement>document.querySelector('#pause')!).style.display === '' ? 'none' : '';
}

function toggleInfo() {
    (<HTMLDivElement>document.querySelector('#info')!).style.display = (<HTMLDivElement>document.querySelector('#info')!).style.display === '' ? 'none' : '';
}

export {initEmptyScene, initEvents, initMenu, initLevel, initEnd, togglePause, toggleInfo};