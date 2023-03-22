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
import {Player} from "../logic/player";

function initEmptyScene(app: App) {
    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(50, 50, 50);
    camera.lookAt(0, 0, 0);

    // ILLUMINATION TODO
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);
    const spotlight = new THREE.SpotLight(0xffffff);
    spotlight.position.set(0, 100, 100);
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
    // TODO: Use number to load the correct level
    let level = new Level(app.scene);

    // Planet TODO
    let planet1 = new Planet(app.scene, new THREE.MeshPhongMaterial({color: 0xff0000, shininess: 1}),
        new THREE.Vector3(-30, 30, 0), 10, 0, 0.01, 0.025, Player.HUMAN);
    level.addBall(planet1);
    app.scene.add(planet1.mesh);
    let planet2 = new Planet(app.scene, new THREE.MeshPhongMaterial({color: 0x00ff00, shininess: 0.5}),
        new THREE.Vector3(30, 40, -10), 7.5, Math.PI / 16, 0.05, 0.025, Player.ENEMY);
    level.addBall(planet2);
    app.scene.add(planet2.mesh);

    // Spaceship TODO
    for (let i = 0; i < 10; i++) {
        let spaceship = new Spaceship(Player.HUMAN);
        planet1.addSpaceship(spaceship);
    }
    let spaceship2 = new Spaceship(Player.ENEMY);
    planet2.addSpaceship(spaceship2);

    // Ground plane
    let planeGeometry = new THREE.PlaneGeometry(1000, 1000);
    let planeMaterial = new THREE.MeshPhongMaterial({color: 0xcccccc});
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true;
    app.scene.add(plane);

    // Coordinate axes
    let axes = new THREE.AxesHelper(100);
    app.scene.add(axes);

    app.level = level;
}

export {initEmptyScene, initEvents, initLevel};