import Phaser from 'phaser';
import { TitleScene } from './TitleScene';
import { CreatorsScene } from './CreatorsScene';
import { IntroScene } from './IntroScene';
import { ChatScene } from './ChatScene';

// Game configuration
const config = {
  type: Phaser.AUTO,
  width: 1400,
  height: 900,
  parent: 'game-container',
  backgroundColor: '#000000',
  scene: [TitleScene, CreatorsScene, IntroScene, ChatScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true,  // Mostramos los cuerpos físicos para mejor debug
      fps: 60,      // Aseguramos 60fps para mejor rendimiento
      tileBias: 32  // Mejor detección de colisiones
    }
  },
  dom: {
    createContainer: true
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  input: {
    keyboard: {
      capture: [
        // NO capturamos WASD para permitir su uso en el chat
        Phaser.Input.Keyboard.KeyCodes.UP,
        Phaser.Input.Keyboard.KeyCodes.DOWN,
        Phaser.Input.Keyboard.KeyCodes.LEFT,
        Phaser.Input.Keyboard.KeyCodes.RIGHT
      ]
    },
    mouse: true,
    activePointers: 1
  }
};

// Initialize the game when the window loads
window.addEventListener('load', () => {
  window.game = new Phaser.Game(config);
});

// Export the game instance for access in other modules
export default window.game;

// SOLUCIONANDO PROBLEMAS DE TECLADO
// Solo prevenir el comportamiento por defecto de las teclas de flecha, pero permitir espacio
document.addEventListener('keydown', function(e) {
  // Comprobar si estamos en un campo de texto
  const activeElement = document.activeElement;
  const isInputFocused = activeElement && (
    activeElement.tagName === 'INPUT' || 
    activeElement.tagName === 'TEXTAREA' || 
    activeElement.isContentEditable
  );
  
  // Teclas de dirección (NO incluimos espacio aquí para que funcione en chat)
  const arrowKeys = [37, 38, 39, 40]; // Left, Up, Right, Down
  
  // Prevenir el comportamiento predeterminado solo para las teclas de flecha cuando no estamos en un campo de texto
  if (arrowKeys.includes(e.keyCode) && !isInputFocused) {
    e.preventDefault();
    console.log('Flecha presionada:', e.key);
  }
  
  // Si es espacio (32), solo prevenimos el comportamiento por defecto si NO estamos en un input
  // Esto permite usar espacios en campos de texto pero evita el scroll
  if (e.keyCode === 32 && !isInputFocused) {
    e.preventDefault();
    console.log('Espacio presionado, no en input');
  } else if (e.keyCode === 32 && isInputFocused) {
    // No prevenimos nada, dejamos que el espacio funcione normalmente en los inputs
    console.log('Espacio en input, permitido');
  }
});
