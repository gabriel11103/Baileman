import { Scene } from 'phaser';

export class GameWin extends Scene {
    constructor () {
        super('GameWin');
    }

    create () {
        // Establece el color de fondo verde para la victoria
        this.cameras.main.setBackgroundColor(0x00ff00);

        // Agrega una imagen de fondo con transparencia
        this.add.image(512, 384, 'background').setAlpha(0.5);
        this.add.image(500, 200, 'ganar').setScale(0.5);

        // Texto de victoria
        this.add.text(512, 384, '¡Ganaste está ricaso!', {
            fontFamily: 'Arial Black',
            fontSize: 64,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Texto para instrucciones de reinicio
        this.add.text(512, 484, 'Haz clic para volver al Menú Principal', {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        // Maneja el clic del ratón para volver al menú principal
        this.input.once('pointerdown', () => this.scene.start('MainMenu'));
    }
}

