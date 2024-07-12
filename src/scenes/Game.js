import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.liquid1Level = 0;  // Nivel de fernet
        this.liquid2Level = 0;  // Nivel de coca
        this.liquid1Limit = 200; // Límite de fernet en el vaso
        this.liquid2Limit = 300; // Límite de coca en el vaso
        this.baseWidth = 100;  // Ancho de la barra de líquido
        this.maxHeight = 300;  // Altura máxima de la barra blanca
        this.totalLimit = 380; // Capacidad total del vaso, un clic menos que el 100%
        this.halfLimit = this.totalLimit / 2; // Límite de la mitad del vaso
    }

    preload() {
        // Cargar las imágenes
        this.load.image('vaso', 'assets/vaso.png');
        this.load.image('liquid1', 'assets/fernet.png');
        this.load.image('liquid2', 'assets/coca.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('hielo', 'assets/hielo.png');
    }

    create() {
        this.resetGame();  // Reiniciar el juego al crear la escena

        // Agregar la imagen de fondo
        this.add.image(512, 384, 'background');

        // Agregar la imagen del vaso
        this.add.image(600, 500, 'vaso').setScale(0.8);

        // Agregar las imágenes de los líquidos
        this.add.image(130, 400, 'liquid1').setScale(0.8);
        this.add.image(890, 400, 'liquid2').setScale(0.9);

        // Crear botones de texto
        this.createButton(30, 500, 'Poner Fernet', this.addLiquid1.bind(this));
        this.createButton(800, 500, 'Poner Coca', this.addLiquid2.bind(this));
        this.createButton(490, 300, 'Poner Hielo', this.addHielo.bind(this));
        this.createButton(500, 600, 'Entregar Fernet', this.checkForWin.bind(this));

        // Crear los líquidos como gráficos con fondo blanco
        this.liquid1Background = this.createLiquidBackground(412, 690, this.baseWidth);
        this.liquid2Background = this.createLiquidBackground(412, 690, this.baseWidth);

        this.liquid1 = this.add.rectangle(412, 690, this.baseWidth, 0, 0x000000).setOrigin(0.5, 1); // Inicialmente vacío
        this.liquid2 = this.add.rectangle(412, 690, this.baseWidth, 0, 0x7A534B).setOrigin(0.5, 1); // Inicialmente vacío

        // Imagen de hielo inicial en una posición fuera de vista
        this.hielo = this.add.image(-100, -100, 'hielo').setScale(0.1);
    }

    createButton(x, y, label, callback) {
        const button = this.add.text(x, y, label, {
            fontFamily: 'Arial', fontSize: 32, color: '#000000', backgroundColor: '#ffffff', padding: { x: 10, y: 5 }
        }).setInteractive();

        // Crear un fondo redondeado para el botón
        const buttonBackground = this.add.graphics();
        buttonBackground.fillStyle(0xffffff, 1);
        buttonBackground.fillRoundedRect(x - 10, y - 5, button.width + 20, button.height + 10, 10);
        buttonBackground.lineStyle(2, 0x000000, 1);
        buttonBackground.strokeRoundedRect(x - 10, y - 5, button.width + 20, button.height + 10, 10);

        // Colocar el texto del botón sobre el fondo
        button.setDepth(1);

        // Eventos de interacción para el botón
        button.on('pointerover', () => {
            button.setStyle({ backgroundColor: '#d3d3d3', color: '#000000' });
        });

        button.on('pointerout', () => {
            button.setStyle({ backgroundColor: '#ffffff', color: '#000000' });
        });

        button.on('pointerdown', callback);

        return button;
    }

    createLiquidBackground(x, y, width) {
        // Crear un fondo blanco con borde negro para la barra de líquido
        const background = this.add.graphics();
        background.fillStyle(0xffffff, 1);
        background.fillRoundedRect(x - width / 2, y - this.maxHeight, width, this.maxHeight, 10);
        background.lineStyle(2, 0x000000, 1);
        background.strokeRoundedRect(x - width / 2, y - this.maxHeight, width, this.maxHeight, 10);
        return background;
    }

    addLiquid1() {
        if (this.liquid1Level < this.liquid1Limit) {
            this.liquid1Level += 10;
            // Actualiza la altura del líquido 1
            this.liquid1.height = this.liquid1Level;
            this.liquid1.y = 690 - this.liquid1Level; // Actualiza la posición Y del líquido 1 para que llene de abajo hacia arriba
        }
    }

    addLiquid2() {
        const maxLiquid2Height = this.maxHeight - this.liquid1.height;
        if (this.liquid2Level < this.liquid2Limit && this.liquid2.height < maxLiquid2Height) {
            this.liquid2Level += 10;
            // Actualiza la altura del líquido 2 y lo posiciona encima del fernet
            this.liquid2.height = Math.min(this.liquid2Level, maxLiquid2Height);
            this.liquid2.y = 690 - this.liquid1.height - this.liquid2.height; // Actualiza la posición Y del líquido 2 para que llene de abajo hacia arriba

            // Verifica si la coca ha llegado al límite superior de la barra blanca
            if (this.liquid2.height >= maxLiquid2Height) {
                this.gameOver('Se revalso el vaso');
            }
        } else {
            this.gameOver('Se revalso el vaso');
        }
    }

    addHielo() {
        // Coloca la imagen de hielo en una posición visible dentro del vaso
        this.hielo.setPosition(600, 600).setAlpha(1);
    }

    checkForWin() {
        const totalLiquid = this.liquid1Level + this.liquid2Level;

        // Verifica si el vaso está lleno lo suficiente
        if (totalLiquid >= this.halfLimit) {
            const fernetPercentage = (this.liquid1Level / totalLiquid) * 100;
            const cocaPercentage = (this.liquid2Level / totalLiquid) * 100;

            if (Math.abs(fernetPercentage - 30) <= 5 && Math.abs(cocaPercentage - 70) <= 5) {
                this.scene.start('GameWin', { message: 'Ganaste está ricaso' });
            } else {
                if (cocaPercentage > 70) {
                    this.gameOver('Perdiste, esto está coqueado');
                } else if (fernetPercentage > 30) {
                    this.gameOver('Perdiste, esto está puraso');
                } else {
                    this.gameOver('No llenaste \n el vaso correctamente');
                }
            }
        } else {
            this.gameOver('No llenaste \n suficiente el vaso');
        }
    }

    gameOver(message = 'Game Over') {
        this.scene.start('GameOver', { message });
    }

    resetGame() {
        this.liquid1Level = 0;
        this.liquid2Level = 0;

        if (this.liquid1) {
            this.liquid1.height = 0;
            this.liquid1.y = 690;
        }

        if (this.liquid2) {
            this.liquid2.height = 0;
            this.liquid2.y = 690;
        }

        if (this.hielo) {
            this.hielo.setPosition(-100, -100).setAlpha(0);
        }
    }

    startGame() {
        this.resetGame();
        this.scene.restart();
    }
}

export class GameWin extends Scene {
    constructor() {
        super('GameWin');
    }

    init(data) {
        this.message = data.message || '¡Ganaste!';
    }

    create() {
        this.cameras.main.setBackgroundColor(0x00ff00); // Color de fondo verde para la victoria

        // Agrega una imagen de fondo con algo de transparencia
        this.add.image(512, 384, 'background').setAlpha(0.5);

        // Imagen de marca de victoria
        this.add.image(600, 300, 'winMark').setScale(0.5);

        // Texto de victoria
        this.add.text(512, 384, this.message, {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Texto para instrucciones de reinicio
        this.add.text(512, 484, 'Haz clic para volver al Menú Principal', {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        // Maneja el clic del ratón para volver al menú principal
        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}
