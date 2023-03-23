import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {App} from "../app";
import {Planet} from "../model/planet";
import {Level} from "../logic/level";
import {onMouseClick, onMouseMove, onResize} from "../logic/event";
import {Spaceship} from "../model/spaceship";
import {CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";
import {Owner} from "../logic/owner";
import levels from './../../json/levels.json';
import {Factory} from "./factory";
import {LevelInterface} from "./interface";

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
    window.addEventListener('resize', (event: Event) => onResize(event, app), false);
    window.addEventListener('mousemove', (event: MouseEvent) => onMouseMove(event, app), false);
    window.addEventListener('click', (event: MouseEvent) => onMouseClick(event, app), false);
}

function initLevel(app: App, num: number) {
    const levelData: LevelInterface = levels[num];

    let level = new Level(app.scene);

    // Balls
    for (let ballData of levelData.balls) {
        let ball = Factory.createBall(ballData);
        if (ball) {
            level.addBall(ball);
        }
    }

    // Ground plane
    let planeGeometry = new THREE.PlaneGeometry(1000, 1000);
    let planeMaterial = new THREE.MeshPhongMaterial({color: 0xcccccc});
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(0, -100, 0);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    app.scene.add(plane);

    // Coordinate axes
    let axes = new THREE.AxesHelper(100);
    app.scene.add(axes);

    app.level = level;
}

export {initEmptyScene, initEvents, initLevel};