import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {initEmptyScene, initEvents, initMenu, initLevel, initEnd} from "./util/init";
import {render} from "./frame/render";
import {animate} from "./frame/animate";
import {Level} from "./logic/level";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";
import {AI} from "./logic/ai";

class App {

    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    labelRenderer: CSS2DRenderer;
    composer: EffectComposer;
    line: THREE.Line;
    control: OrbitControls;
    level: Level;
    ai: AI;

    constructor() {
        this.level = new Level(0);
        initEmptyScene(this);
        initEvents(this);
        initMenu(this);
    }

    setLevel = (level: Level) => {
        this.scene.remove(this.level.mainGroup);
        level.dispatcher.addEventListener('end', (event: THREE.Event) => {
            initEnd(this, event.winner);
        });
        this.level = level
        this.scene.add(level.mainGroup);
    }

    restartLevel = () => {
        initLevel(this, this.level.num);
    }

    nextLevel = () => {
        initLevel(this, this.level.num + 1);
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
