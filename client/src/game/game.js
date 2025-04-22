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
      debug: false
    }
  },
  dom: {
    createContainer: true
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

// Initialize the game when the window loads
window.addEventListener('load', () => {
  window.game = new Phaser.Game(config);
});

// Export the game instance for access in other modules
export default window.game;

// Listen for keydown events to handle input
window.addEventListener('keydown', function (e) {
  // Prevent space and arrow keys from scrolling the page
  if ([32, 37, 38, 39, 40].includes(e.keyCode)) {
    e.preventDefault();
  }
});
