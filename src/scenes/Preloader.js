import { Scene } from 'phaser';

const BACKGROUND_IMAGE = 'background';
const BAR_WIDTH = 460;
const BAR_HEIGHT = 28;
const BAR_X = 512 - 230;
const BAR_Y = 384;
const PROGRESS_BAR_COLOR = 0xffffff;

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        this.add.image(512, 384, BACKGROUND_IMAGE);
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, PROGRESS_BAR_COLOR);

        const bar = this.add.rectangle(BAR_X, BAR_Y, 4, BAR_HEIGHT, PROGRESS_BAR_COLOR);
        this.load.on('progress', (progress) => {
            bar.width = 4 + (BAR_WIDTH * progress);
        });
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('loseMark', 'perder.jpg');
        this.load.image('ganar', 'win.png');
        this.load.image('logo', 'escudoCba.png');
        this.load.image('background2', 'Designer3.png'); 
    }

    create() {
        this.scene.start('MainMenu');
    }
}
