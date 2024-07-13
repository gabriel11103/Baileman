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


let currentSongIndex = 0;
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioSource = null;
let audioBuffer = null;
let isPlaying = false;
let playlist = [
  { src: './public/sounds/LaMonaJimenez-RamitoDeVioletas.mp3' },
  // otras canciones
];

const playPauseButton = document.getElementById("play-pause");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

// Función para mezclar el array de canciones 
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Cargar y reproducir la canción actual
async function loadAndPlaySong(index) {
  try {
    const response = await fetch(playlist[index].src);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    if (audioSource) {
      audioSource.disconnect();
    }

    audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.connect(audioContext.destination);
    audioSource.start();

    // Cambiar ícono según el estado de reproducción
    playPauseButton.innerHTML = '<i class="material-icons">pause</i>';
    isPlaying = true;
  } catch (error) {
    console.error("Error al cargar y reproducir la canción:", error);
  }
}

// Reproducir o pausar la canción
function playPauseSong() {
  if (isPlaying) {
    audioContext.suspend().then(() => {
      playPauseButton.innerHTML = '<i class="material-icons">play_arrow</i>';
      isPlaying = false;
    });
  } else {
    audioContext.resume().then(() => {
      playPauseButton.innerHTML = '<i class="material-icons">pause</i>';
      isPlaying = true;
    });
  }
}

// Cambiar a la canción anterior
function prevSong() {
  currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
  loadAndPlaySong(currentSongIndex);
}

// Cambiar a la siguiente canción
function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % playlist.length;
  loadAndPlaySong(currentSongIndex);
}

// Manejar el cambio del estado de la canción
audioContext.addEventListener("statechange", () => {
  if (audioContext.state === "suspended" && isPlaying) {
    nextSong();
  }
});

// Event listeners para los botones
playPauseButton.addEventListener("click", playPauseSong);
prevButton.addEventListener("click", prevSong);
nextButton.addEventListener("click", nextSong);

// Iniciar la reproducción cuando la ventana se carga
async function startPlayback() {
  try {
    // Asegurarse de que el contexto está en estado 'running'
    await audioContext.resume();

    // Mezclar las canciones restantes, excluyendo la primera
    const remainingSongs = playlist.slice(1);
    shuffleArray(remainingSongs);

    // La primera canción es fija, el resto es aleatorio
    playlist = [playlist[0], ...remainingSongs]; 

    // Cargar y reproducir la primera canción
    await loadAndPlaySong(currentSongIndex);

    // Asegurarse de que el contexto no esté en estado 'suspended'
    if (audioContext.state === 'suspended') {
      await new Promise(resolve => {
        document.body.addEventListener('click', () => {
          if (audioContext.state === 'suspended') {
            audioContext.resume().then(() => resolve());
          } else {
            resolve();
          }
        });
      });
    }
  } catch (error) {
    console.error("Error al iniciar la reproducción automática:", error);
  }
}

// Asegurarse de que la música comienza automáticamente cuando la página se carga
window.addEventListener("load", startPlayback);
