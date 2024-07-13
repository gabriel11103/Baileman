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


let audioCtx;
let source;
let audioBuffer;
let isPlaying = false;
let currentSongIndex = 0;
let playlist = [];

const songs = [
  { src: '/sounds/LaMonaJimenez-RamitoDeVioletas.MP3', title: 'Ramito de Violetas' },
  { title: "Song 2", src: "./public/sounds/LaMonaJimenez-Elenamorado.MP3" },
  { title: "Song 3", src: "./public/sounds/LaMonaJimenez-TeVasACasar.MP3" },
  { title: "Song 4", src: "./public/sounds/LaMona-LoQueHaPasadoAnoche.MP3" },
  { title: "Song 5", src: "./public/sounds/LaMona-Amordecomprayventa.MP3" },
  { title: "Song 6", src: "./public/sounds/Q'Lokura-ClaroAbsurdo.MP3" },
  { title: "Song 7", src: "./public/sounds/Q'Lokura-Buscateunhombrequetequiera-Poliamor.MP3" },
  { title: "Song 8", src: "./public/sounds/Q'Lokura-NoPachangaNaninga.MP3" },
  { title: "Song 9", src: "./public/sounds/Q'LokuraFtEugeQuevedo-Amigos.MP3" },
  { title: "Song 10", src: "./public/sounds/WALTEROLMOSENGANCHADOS.MP3" },
  { title: "Song 11", src: "./public/sounds/LBC-Queseio.MP3" },
  { title: "Song 12", src: "./public/sounds/LBC-OlvidarteDeMiJamasPodras.MP3" },
  { title: "Song 13", src: "./public/sounds/MONADA-MIHABITACION.MP3" },
  { title: "Song 14", src: "./public/sounds/Monada-La gaita de la caña.MP3" },
  { title: "Song 15", src: "./public/sounds/Monada-enganchados.MP3" },
  { title: "Song 16", src: "./public/sounds/LAFIESTA-ESELOBO.MP3" },
  { title: "Song 17", src: "./public/sounds/EnganchadosDamianCordoba.MP3" },
  { title: "Song 18", src: "./public/sounds/Ulises Bueno-AhoraMirame.MP3" },
  { title: "Song 18", src: "./public/sounds/UlisesBueno-YaNoVolvera.MP3" },
  { title: "Song 18", src: "./public/sounds/UlisesBueno-Loco.MP3" },
  { title: "Song 18", src: "./public/sounds/SoyCordobes.MP3"}
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

// Función para cargar y reproducir la canción actual
async function loadAndPlaySong(index) {
  try {
    // Crear un nuevo contexto de audio
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Cargar el archivo de audio
    const response = await fetch(playlist[index].src);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    // Decodificar el archivo de audio
    audioBuffer = await response.arrayBuffer();
    const decodedBuffer = await audioCtx.decodeAudioData(audioBuffer);

    if (source) {
      source.disconnect();
    }

    // Reproducir la canción
    source = audioCtx.createBufferSource();
    source.buffer = decodedBuffer;
    source.connect(audioCtx.destination);
    source.loop = true;
    source.start();

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
    audioCtx.suspend().then(() => {
      playPauseButton.innerHTML = '<i class="material-icons">play_arrow</i>';
      isPlaying = false;
    });
  } else {
    audioCtx.resume().then(() => {
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

// Iniciar la reproducción cuando la ventana se carga
async function startPlayback() {
  try {
    // Mezclar las canciones restantes, excluyendo la primera
    const remainingSongs = songs.slice(1);
    shuffleArray(remainingSongs);

    // La primera canción es fija, el resto es aleatorio
    playlist = [songs[0], ...remainingSongs]; 

    // Cargar y reproducir la primera canción
    await loadAndPlaySong(currentSongIndex);

    // Asegurarse de que el contexto no esté en estado 'suspended'
    if (audioCtx.state === 'suspended') {
      await new Promise(resolve => {
        document.body.addEventListener('click', () => {
          if (audioCtx.state === 'suspended') {
            audioCtx.resume().then(() => resolve());
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

// Event listeners para los botones
playPauseButton.addEventListener("click", playPauseSong);
prevButton.addEventListener("click", prevSong);
nextButton.addEventListener("click", nextSong);

// Asegurarse de que la música comienza automáticamente cuando la página se carga
window.addEventListener("load", startPlayback);
