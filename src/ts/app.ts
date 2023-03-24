import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {initEmptyScene, initLevel, initEvents, initMenu} from "./util/init";
import {render} from "./frame/render";
import {animate} from "./frame/animate";
import {Level} from "./logic/level";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";

class App {

    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    labelRenderer: CSS2DRenderer;
    composer: EffectComposer;
    control: OrbitControls;
    level: Level;

    constructor() {
        this.level = new Level();
        initEmptyScene(this);
        initEvents(this);
        initMenu(this);
    }

    setLevel = (level: Level) => {
        this.scene.remove(this.level.mainGroup);
        this.level = level
        this.scene.add(level.mainGroup);
    }

    run = () => {
        this.nextFrame();
    }

    nextFrame = () => {
        animate(this);
        render(this);
        this.control.update();
        requestAnimationFrame(this.nextFrame);
    }
}

export {App};
