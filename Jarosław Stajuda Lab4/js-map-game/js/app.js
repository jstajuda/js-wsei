import {initStartScreen} from './startScreen.js';
import {leavingGame} from './game.js';

window.addEventListener('load', initStartScreen);
window.addEventListener('beforeunload', leavingGame);

