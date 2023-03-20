import {App} from "../main";

function render(app: App) {
    app.renderer.render(app.scene, app.camera);
}

function resize(app: App) {
    app.camera.aspect = window.innerWidth / window.innerHeight;
    app.camera.updateProjectionMatrix();
    app.renderer.setSize(window.innerWidth, window.innerHeight);
}

export {render, resize};