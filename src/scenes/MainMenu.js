import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        this.add.image(512, 384, 'background');
        this.add.image(512, 400, 'logo');

        // Botón de Inicio
        const startButton = this.add.text(512, 460, 'Inicio', {
            fontFamily: 'Arial Black',
            fontSize: 38,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('Game');
        });

        // Botón de Reglas
        const rulesButton = this.add.text(512, 530, 'Reglas', {
            fontFamily: 'Arial Black',
            fontSize: 38,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        rulesButton.on('pointerdown', () => {
            this.scene.start('RulesScene');
        });
    }
}

