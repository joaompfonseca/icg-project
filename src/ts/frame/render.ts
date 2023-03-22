import {App} from "../app";

function render(app: App) {
    app.renderer.render(app.scene, app.camera);
    app.labelRenderer.render(app.scene, app.camera);
    app.composer.render();
}

function resize(app: App) {
    app.camera.aspect = window.innerWidth / window.innerHeight;
    app.camera.updateProjectionMatrix();
    app.renderer.setSize(window.innerWidth, window.innerHeight);
}

export {render, resize};