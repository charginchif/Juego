import Phaser from 'phaser';

const baseStyle = `
    font-family: 'Trebuchet MS', serif;
    font-size: 20px;
    border: 2px solid #4e342e;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.9);
`;

const inputStyle = `
    ${baseStyle}
    width: 270px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.4);
    box-shadow: none;
`;

const sendButtonStyle = `
    ${baseStyle}
    width: 270px;
    height: 44px;
    color: #e0d7c5;
    background: linear-gradient(to bottom, #957d5f, #6c543e);
    box-shadow: none;
`;

export class TitleScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'TitleScene'
        });
    }
    
    preload() {
        this.load.image('background', 'https://play.rosebud.ai/assets/cyberpunk_stage.png?uwiS');
        this.load.bitmapFont('roboto', 'https://play.rosebud.ai/assets/rosebud_roboto.png?NpJZ', 'https://play.rosebud.ai/assets/rosebud_roboto.xml?Xhre');
    }
    
    create() {
        this.add.image(550, 445, 'background').setScale(0.5).setAlpha(0.5);
        
        const title = this.add.bitmapText(700, 200, 'roboto', 'KOKORO KIARA', 80)
            .setOrigin(0.5)
            .setTint(0xff00ff);
        
        // Add a subtle animation to the title
        this.tweens.add({
            targets: title,
            alpha: 0.7,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Username input
        const usernameInput = this.add.dom(700, 400).createFromHTML(`
            <input type="text" id="usernameInput" placeholder="Enter your username" style="${inputStyle}"/>`);
        
        const startButton = this.add.dom(700, 500).createFromHTML(`
            <button id="startButton" style="${sendButtonStyle}">Inicia la Aventura</button>`);
        
        startButton.addListener('click');
        startButton.on('click', () => {
            const input = document.getElementById('usernameInput');
            const username = input.value.trim();
            
            if (username) {
                window.gameUsername = username;
                this.cameras.main.fade(1000, 0, 0, 0);
                this.time.delayedCall(1000, () => {
                    this.scene.start('CreatorsScene');
                });
            } else {
                // Show error if no username entered
                const errorMsg = this.add.bitmapText(700, 450, 'roboto', 'Please enter a username', 24)
                    .setOrigin(0.5)
                    .setTint(0xff0000);
                
                this.time.delayedCall(2000, () => {
                    errorMsg.destroy();
                });
            }
        });
        
        // Add a glowing effect to the button
        this.tweens.add({
            targets: startButton,
            scale: 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}
