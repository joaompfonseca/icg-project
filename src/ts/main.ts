import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {initEmptyScene, initLevel} from "./util/init";
import {render, resize} from "./frame/render";
import {animate} from "./frame/animate";
import {Level} from "./logic/level";

class App {

    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.Renderer;
    control: OrbitControls;
    level: Level;

    constructor() {
        initEmptyScene(this);
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

    onResize = () => {
        resize(this);
    }
}

export {App};
