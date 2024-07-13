import Phaser from 'phaser';
import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { GameWin } from './scenes/GameWin';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { RulesScene } from './scenes/RuleScene';  // Importa la nueva escena de Reglas

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: 'game-container',
  backgroundColor: '#028af8',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Boot, Preloader, MainMenu, RulesScene, Game, GameOver, GameWin],  // Agrega RulesScene aquí
};

export default new Phaser.Game(config);


const context = new (window.AudioContext || window.webkitAudioContext)();
async function fetchAndPlay() {
  try {
    const response = await fetch('/sounds/LaMonaJimenez-RamitoDeVioletas.mp3');
    if (!response.ok) throw new Error('Network response was not ok.');
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await context.decodeAudioData(arrayBuffer);

    const source = context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(context.destination);
    source.start();

    console.log('Reproducción iniciada.');
  } catch (error) {
    console.error('Error al cargar y reproducir la canción:', error);
  }
}

fetchAndPlay();

