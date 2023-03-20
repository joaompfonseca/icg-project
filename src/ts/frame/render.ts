import {App} from "../main";

function render(app: App) {
    app.composer.render();
}

function resize(app: App) {
    app.camera.aspect = window.innerWidth / window.innerHeight;
    app.camera.updateProjectionMatrix();
    app.composer.renderer.setSize(window.innerWidth, window.innerHeight);
}

export {render, resize};