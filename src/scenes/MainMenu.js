import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    preload() {
        // Asegúrate de que los recursos estén cargados
        this.load.image('background', 'assets/background.png');
        this.load.image('logo', 'assets/logo.png');
    }

    create() {
        this.add.image(512, 384, 'background');
        this.add.image(512, 200, 'logo').setScale(0.5);

        // Botón de Inicio
        const startButton = this.add.text(512, 400, 'Inicio', {
            fontFamily: 'Arial Black',
            fontSize: 38,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerdown', () => {
            this.scene.start('LevelSelect');
        });

        // Botón de Reglas
        const rulesButton = this.add.text(512, 500, 'Reglas', {
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
