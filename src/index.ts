import {App} from './ts/main';

window.onload = () => {
    let app = new App();
    app.run();
    window.addEventListener('resize', app.onResize, false);
};