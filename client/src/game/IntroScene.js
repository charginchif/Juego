import Phaser from 'phaser';

export class IntroScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'IntroScene'
        });
    }
    
    preload() {
        this.load.image('background', 'https://play.rosebud.ai/assets/cyberpunk_stage.png?uwiS');
        this.load.bitmapFont('roboto', 'https://play.rosebud.ai/assets/rosebud_roboto.png?NpJZ', 'https://play.rosebud.ai/assets/rosebud_roboto.xml?Xhre');
    }
    
    create() {
        // Add background
        this.add.image(550, 445, 'background').setScale(0.5).setAlpha(0.5);
        
        // Add title text
        const title = this.add.bitmapText(700, 300, 'roboto', 'KOKORO KIARA', 64)
            .setOrigin(0.5)
            .setTint(0xff00ff)
            .setAlpha(0);
        
        // Add subtitle
        const subtitle = this.add.bitmapText(700, 400, 'roboto', 'Una Aventura Cibernética', 32)
            .setOrigin(0.5)
            .setTint(0x00ffff)
            .setAlpha(0);
        
        // Add story text
        const storyText = this.add.bitmapText(700, 500, 'roboto', 
            'En un mundo donde la tecnología y lo espiritual se entrelazan,\n' +
            'te encuentras en una búsqueda para encontrar el misterioso "Kokoro"...\n' +
            'Una reliquia que se dice puede restaurar la humanidad a un mundo mecanizado.', 
            20)
            .setOrigin(0.5)
            .setTint(0xffffff)
            .setAlpha(0);
        
        // Add instruction text
        const instructionText = this.add.bitmapText(700, 650, 'roboto', 'Click para comenzar tu aventura', 24)
            .setOrigin(0.5)
            .setTint(0x00ffff)
            .setAlpha(0);
        
        // Fade in animation sequence
        this.tweens.add({
            targets: title,
            alpha: 1,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                this.tweens.add({
                    targets: subtitle,
                    alpha: 1,
                    duration: 2000,
                    ease: 'Power2',
                    onComplete: () => {
                        this.tweens.add({
                            targets: storyText,
                            alpha: 1,
                            duration: 2000,
                            ease: 'Power2',
                            onComplete: () => {
                                this.tweens.add({
                                    targets: instructionText,
                                    alpha: 1,
                                    duration: 1000,
                                    ease: 'Power2',
                                    yoyo: true,
                                    repeat: -1
                                });
                            }
                        });
                    }
                });
            }
        });
        
        // Add click handler to start game
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => {
                this.scene.start('ChatScene');
            });
        });
    }
}
