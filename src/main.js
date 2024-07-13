import Phaser from 'phaser';
import { Boot } from './scenes/Boot';
import { Preloader } from './scenes/Preloader';
import { MainMenu } from './scenes/MainMenu';
import { RulesScene } from './scenes/RuleScene';  
import { LevelSelect } from './scenes/LevelSelect';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { GameWin } from './scenes/GameWin';

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
    scene: [Boot, Preloader, MainMenu, RulesScene, LevelSelect, Game, GameOver, GameWin], 
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
  { src: '/sounds/LaMonaJimenez-Elenamorado.MP3', title: 'El enamorado' },
  { src: '/sounds/LaMonaJimenez-TeVasACasar.MP3', title: 'Te Vas A Casar' },
  { src: '/sounds/LaMona-LoQueHaPasadoAnoche.MP3', title: 'Lo Que Ha Pasado Anoche' },
  { src: '/sounds/LaMona-Amordecomprayventa.MP3', title: 'Amor de Compra y Venta' },
  { src: '/sounds/QLokura-ClaroAbsurdo.MP3', title: 'Claro Absurdo' },
  { src: '/sounds/QLokura-Buscateunhombrequetequiera-Poliamor.MP3', title: 'Búscate un Hombre que te Quiera - Poliamor' },
  { src: '/sounds/QLokura-NoPachangaNaninga.MP3', title: 'No Pachanga Naninga' },
  { src: '/sounds/QLokuraFtEugeQuevedo-Amigos.MP3', title: 'Amigos' },
  { src: '/sounds/WALTEROLMOSENGANCHADOS.MP3', title: 'Enganchados Walter Olmos' },
  { src: '/sounds/LBC-Queseio.MP3', title: 'Que Se io' },
  { src: '/sounds/LBC-OlvidarteDeMiJamasPodras.MP3', title: 'Olvidarte De Mí Jamás Podrás' },
  { src: '/sounds/MONADA-MIHABITACION.MP3', title: 'Mi Habitación' },
  { src: '/sounds/Monada-Lagaitadelacaña.MP3', title: 'La Gaita de la Caña' },
  { src: '/sounds/Monada-enganchados.MP3', title: 'Enganchados' },
  { src: '/sounds/LAFIESTA-ESELOBO.MP3', title: 'Ese Lobo' },
  { src: '/sounds/EnganchadosDamianCordoba.MP3', title: 'Enganchados con Damián Córdoba' },
  { src: '/sounds/Ulises Bueno-AhoraMirame.MP3', title: 'Ahora Mírame' },
  { src: '/sounds/UlisesBueno-YaNoVolvera.MP3', title: 'Ya No Volverá' },
  { src: '/sounds/UlisesBueno-Loco.MP3', title: 'Loco' },
  { src: '/sounds/SoyCordobes.MP3', title: 'Soy Cordobés' }
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
    // Crear un nuevo contexto de audio si no existe
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
    source.loop = false; // No repetir el audio en loop

    // Manejar el evento cuando termina la canción
    source.onended = () => {
      nextSong(); // Avanzar a la siguiente canción
    };

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

