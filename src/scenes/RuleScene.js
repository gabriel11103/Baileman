import { Scene } from 'phaser';

export class RulesScene extends Scene {
    constructor() {
        super('RulesScene');
    }

    create() {
        // Fondo de la escena
        this.add.image(512, 384, 'background2');

        // Título de las reglas
        this.add.text(512, 100, 'Reglas del Juego', {
            fontFamily: 'Arial Black',
            fontSize: 48,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Texto de las reglas
        this.add.text(512, 350, 
            '1. Llena el vaso con fernet y coca.\n' + 
            '\n' +
            '2. El objetivo es llegar al 70/30 \n (70% de coca y 30% de fernet).\n' +
            '\n' +
            '3. Si te pasas de los niveles, perdes.\n' +
            '\n' +
            '4. ¡Suerte! A ver qué tan buen preparador de fernet sos.', {
            fontFamily: 'Arial Black',
            fontSize: 30,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setPadding(20);

        // Botón para volver al menú principal
        const backButton = this.add.text(512, 600, 'Volver al Menú', {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}
