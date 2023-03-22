import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {initEmptyScene, initEvents, initLevel} from "./util/init";
import {render, resize} from "./frame/render";
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
        initEmptyScene(this);
        initEvents(this);
        initLevel(this, 1);
    }

    run = () => {
        // TODO: do someting else here?
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
