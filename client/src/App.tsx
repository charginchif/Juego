import { useEffect } from 'react';
import './game/game';

function App() {
  useEffect(() => {
    // Initialize the game on component mount
    const gameScript = document.createElement('script');
    gameScript.src = '/src/game/game.js';
    gameScript.type = 'module';
    document.body.appendChild(gameScript);

    return () => {
      // Clean up on component unmount
      document.body.removeChild(gameScript);
    };
  }, []);

  return (
    <div id="game-container"></div>
  );
}

export default App;
