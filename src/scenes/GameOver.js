import { Scene } from 'phaser';

const BACKGROUND_COLOR = 0xff0000;
const TEXT_STYLE_LARGE = {
    fontFamily: 'Arial Black',
    fontSize: 64,
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 8,
    align: 'center'
};
const TEXT_STYLE_SMALL = {
    fontFamily: 'Arial',
    fontSize: 24,
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 4,
    align: 'center'
};

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.message = data.message || 'Game Over';
    }

    create() {
        this.cameras.main.setBackgroundColor(BACKGROUND_COLOR);

        this.add.image(512, 384, 'background').setAlpha(0.5);
        this.add.image(500, 180, 'loseMark').setScale(0.4);

        this.add.text(512, 384, this.message, TEXT_STYLE_LARGE).setOrigin(0.5);
        this.add.text(512, 484, 'Haz clic para volver al Menú Principal', TEXT_STYLE_SMALL).setOrigin(0.5);

        this.input.once('pointerdown', () => this.scene.start('MainMenu'));
    }
}
