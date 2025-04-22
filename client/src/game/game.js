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
      debug: true,  // Activamos el debug para ver los cuerpos físicos
      fps: 60       // Aseguramos 60fps para mejor rendimiento
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
    keyboard: true,  // Aseguramos que el teclado está habilitado
    mouse: true,     // Aseguramos que el ratón está habilitado
    activePointers: 1 // Número de punteros activos
  }
};

// Initialize the game when the window loads
window.addEventListener('load', () => {
  window.game = new Phaser.Game(config);
});

// Export the game instance for access in other modules
export default window.game;

// Manejar eventos de teclado de forma más directa
document.addEventListener('keydown', function(e) {
  // Prevenir comportamiento por defecto de las teclas de movimiento solo si no estamos en un campo de texto
  const activeElement = document.activeElement;
  const isInputFocused = activeElement && (
    activeElement.tagName === 'INPUT' || 
    activeElement.tagName === 'TEXTAREA' || 
    activeElement.isContentEditable
  );
  
  // Teclas de dirección y espacio
  const movementKeys = [32, 37, 38, 39, 40]; // Space, Left, Up, Right, Down
  
  if (movementKeys.includes(e.keyCode) && !isInputFocused) {
    e.preventDefault();
    
    // Imprimir información de diagnóstico
    console.log('Tecla presionada:', e.key, 'código:', e.keyCode);
  }
});
