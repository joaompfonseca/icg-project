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

function initEmptyScene(app: App) {
    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
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
    // Level Events
    window.addEventListener('resize', (event: Event) => onLevelResize(event, app), false);
    window.addEventListener('mousemove', (event: MouseEvent) => onLevelMouseMove(event, app), false);
    window.addEventListener('click', (event: MouseEvent) => onLevelMouseClick(event, app), false);
}

function initMenu(app: App) {
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

    // Ground plane
    const planeGeometry = new THREE.PlaneGeometry(1000, 1000);
    const planeMaterial = new THREE.MeshPhongMaterial({color: 0xcccccc});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, -100, 0);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    level.mainGroup.add(plane);

    // Coordinate axes
    let axes = new THREE.AxesHelper(100);
    level.mainGroup.add(axes);

    app.setLevel(level);

    (<HTMLDivElement>document.querySelector('#menu')!).style.display = 'none';
    (<HTMLDivElement>document.querySelector('#output')!).style.display = 'block';
}

export {initEmptyScene, initEvents, initMenu, initLevel};