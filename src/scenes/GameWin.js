import { Scene } from 'phaser';

const SHOT_MESSAGES = [
    '¡Toma el de tu derecha!',
    '¡Toma el de tu izquierda!',
    '¡Elegí quién toma un shot!',
    '¡Toma quien esté al frente tuyo!',
    '¡Toman todos, excepto vos!',
    '¡Elegí dos que tomen un shot!'
];   

export class GameWin extends Scene {
    constructor() {
        super('GameWin');
    }

    create(data) {
        // Establece el color de fondo verde para la victoria
        this.cameras.main.setBackgroundColor(0x00ff00);

        // Agrega una imagen de fondo con transparencia
        this.add.image(512, 384, 'background').setAlpha(0.5);
        this.add.image(500, 200, 'ganar').setScale(0.5);

        // Muestra el mensaje pasado desde Game
        const winMessage = data.message || '¡Ganaste!';
        this.add.text(512, 384, winMessage, {
            fontFamily: 'Arial Black',
            fontSize: 64,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Mensaje de tomar un shot, seleccionado aleatoriamente
        const randomShotMessage = Phaser.Math.RND.pick(SHOT_MESSAGES);
        this.add.text(512, 480, randomShotMessage, {
            fontFamily: 'Arial',
            fontSize: 36,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        // Texto para instrucciones de reinicio
        this.add.text(512, 584, 'Haz clic para volver al Menú Principal', {
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
