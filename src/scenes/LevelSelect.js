import { Scene } from 'phaser';

export class LevelSelect extends Scene {
    constructor() {
        super('LevelSelect');
    }

    create() {
        this.add.image(512, 384, 'background');

        // Título de la pantalla de selección de nivel
        this.add.text(512, 150, 'Selecciona el Nivel', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Botón para Nivel 1
        this.createButton(450, 250, 'Nivel 1', () => this.startGame(0.1));

        // Botón para Nivel 2
        this.createButton(450, 350, 'Nivel 2', () => this.startGame(0.05));

        // Botón para Nivel 3
        this.createButton(450, 450, 'Nivel 3', () => this.startGame(0.02));
    }

    createButton(x, y, label, callback) {
        const button = this.add.text(x, y, label, {
            fontFamily: 'Arial', fontSize: 32, color: '#000000', backgroundColor: '#ffffff', padding: { x: 10, y: 5 }
        }).setInteractive();

        const buttonBackground = this.add.graphics();
        buttonBackground.fillStyle(0xffffff, 1);
        buttonBackground.fillRoundedRect(x - 10, y - 5, button.width + 20, button.height + 10, 10);
        buttonBackground.lineStyle(2, 0x000000, 1);
        buttonBackground.strokeRoundedRect(x - 10, y - 5, button.width + 20, button.height + 10, 10);

        button.setDepth(1);

        button.on('pointerover', () => {
            button.setStyle({ backgroundColor: '#d3d3d3', color: '#000000' });
        });

        button.on('pointerout', () => {
            button.setStyle({ backgroundColor: '#ffffff', color: '#000000' });
        });

        button.on('pointerdown', callback);

        return button;
    }

    startGame(tolerance) {
        this.scene.start('Game', { tolerance });
    }
}
