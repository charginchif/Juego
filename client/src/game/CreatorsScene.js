import Phaser from 'phaser';

export class CreatorsScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'CreatorsScene'
        });
    }
    
    preload() {
        this.load.image('background', 'https://play.rosebud.ai/assets/cyberpunk_stage.png?uwiS');
        this.load.bitmapFont('roboto', 'https://play.rosebud.ai/assets/rosebud_roboto.png?NpJZ', 'https://play.rosebud.ai/assets/rosebud_roboto.xml?Xhre');
    }
    
    create() {
        this.add.image(550, 445, 'background').setScale(0.5).setAlpha(0.3);
        
        const title = this.add.bitmapText(700, 200, 'roboto', 'CREATORS', 64)
            .setOrigin(0.5)
            .setTint(0x00ffff);
        
        // Add creators information
        const creator = this.add.bitmapText(700, 300, 'roboto', '\nCreated by \nLuis Andre Gutierrez Zuñiga\nAlfredo Santos Gutierrez\nBryan Salazar\nAngel Yireh Garcia Jara', 32)
            .setOrigin(0.5)
            .setTint(0xff00ff);
        
        const continueText = this.add.bitmapText(700, 500, 'roboto', 'Click to continue', 32)
            .setOrigin(0.5)
            .setTint(0x00ffff);
        
        // Add a blinking effect to the continue text
        this.tweens.add({
            targets: continueText,
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Add click handler to proceed to the next scene
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => {
                this.scene.start('IntroScene');
            });
        });
        
        // Add some particle effects for visual interest
        const particles = this.add.particles(0, 0, 'background', {
            frame: 0,
            quantity: 1,
            frequency: 500,
            lifespan: 5000,
            gravityY: -50,
            scale: { start: 0.01, end: 0 },
            alpha: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            emitZone: {
                type: 'random',
                source: new Phaser.Geom.Rectangle(0, 800, 1400, 10)
            }
        });
    }
}
