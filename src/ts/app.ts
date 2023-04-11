import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {initEmptyScene, initEvents, initMenu} from "./util/init";
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
        level.dispatcher.addEventListener('end', (event: THREE.Event) => {
            alert(`Game over! Winner: ${event.winner}`);
            initMenu(this);
        });
        this.level = level
        this.scene.add(level.mainGroup);
    }

    togglePause = () => {
        this.level.togglePause();
        this.nextFrame();
    }

    run = () => {
        this.nextFrame();
    }

    nextFrame = () => {
        if (this.level.paused) {
            return;
        }
        animate(this);
        render(this);
        this.control.update();
        requestAnimationFrame(this.nextFrame);
    }
}

export {App};
