import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import {OutlinePass} from 'three/examples/jsm/postprocessing/OutlinePass';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {App} from '../app';
import {Level} from '../logic/level';
import {onLevelMouseClick, onLevelMouseMove, onLevelResize} from '../logic/event';
import {CSS2DRenderer} from 'three/examples/jsm/renderers/CSS2DRenderer';
import levels from './../../json/levels.json';
import {Factory} from './factory';
import {LevelInterface} from './interface';
// Images
import sbBack from '../../jpg/skybox/back.jpg';
import sbBottom from '../../jpg/skybox/bottom.jpg';
import sbFront from '../../jpg/skybox/front.jpg';
import sbLeft from '../../jpg/skybox/left.jpg';
import sbRight from '../../jpg/skybox/right.jpg';
import sbTop from '../../jpg/skybox/top.jpg';

function initEmptyScene(app: App) {
    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(75, 75, 75);
    camera.lookAt(0, 0, 0);

    // ILLUMINATION TODO
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);
    const spotlight = new THREE.SpotLight(0xffffff);
    spotlight.position.set(100, 300, 100);
    spotlight.castShadow = true;
    scene.add(spotlight);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setClearColor(new THREE.Color(0xffffff));
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
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
    document.querySelector('#level-0')!.addEventListener('click', () => initLevel(app, 0), false);
    document.querySelector('#level-1')!.addEventListener('click', () => initLevel(app, 1), false);
    document.querySelector('#level-2')!.addEventListener('click', () => initLevel(app, 2), false);
    document.querySelector('#level-3')!.addEventListener('click', () => initLevel(app, 3), false);
    document.querySelector('#level-4')!.addEventListener('click', () => initLevel(app, 4), false);
    document.querySelector('#level-5')!.addEventListener('click', () => initLevel(app, 5), false);
    document.querySelector('#level-6')!.addEventListener('click', () => initLevel(app, 6), false);
    document.querySelector('#level-7')!.addEventListener('click', () => initLevel(app, 7), false);
    document.querySelector('#level-8')!.addEventListener('click', () => initLevel(app, 8), false);
    document.querySelector('#level-9')!.addEventListener('click', () => initLevel(app, 9), false);

    // Level Events
    window.addEventListener('resize', (event: Event) => onLevelResize(event, app), false);
    window.addEventListener('mousemove', (event: MouseEvent) => onLevelMouseMove(event, app), false);
    window.addEventListener('click', (event: MouseEvent) => onLevelMouseClick(event, app), false);

    document.querySelector('#btn-menu')!.addEventListener('click', () => initMenu(app), false);
    document.querySelector('#btn-pause')!.addEventListener('click', () => app.togglePause(), false);

}

function initMenu(app: App) {
    // Delete all ball tables TODO: move this somewhere else, but it is needed if we go back and forth between menu and level
    app.level.balls.forEach(ball => {
        ball.mainGroup.remove(ball.table);
    })

    const level = new Level(); //TODO: can create a pretty bg

    app.setLevel(level);

    (<HTMLDivElement>document.querySelector('#menu')!).style.display = 'block';
    (<HTMLDivElement>document.querySelector('#output')!).style.display = 'none';
}

function initLevel(app: App, num: number) {
    const levelData: LevelInterface = levels[num];

    const level = new Level();

    // Balls
    for (let ballData of levelData.balls) {
        const ball = Factory.createBall(ballData);
        if (ball) {
            level.addBall(ball);
        }
    }

    // Skybox
    const skyboxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
    const skybox = new THREE.Mesh(skyboxGeometry,[
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sbRight), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sbLeft), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sbTop), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sbBottom), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sbFront), side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sbBack), side: THREE.BackSide}),
    ]);
    level.mainGroup.add(skybox);

    // Coordinate axes
    let axes = new THREE.AxesHelper(100);
    level.mainGroup.add(axes);

    // Set camera position
    app.camera.position.set(75, 75, 75);
    app.camera.lookAt(0, 0, 0);

    app.setLevel(level);

    (<HTMLDivElement>document.querySelector('#menu')!).style.display = 'none';
    (<HTMLDivElement>document.querySelector('#output')!).style.display = 'block';
}

export {initEmptyScene, initEvents, initMenu, initLevel};