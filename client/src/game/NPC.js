import Phaser from 'phaser';

class NPC extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, texture, characterDescription, name, initialDialogue) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setScale(0.5);
    this.setImmovable(true);
    this.setInteractive();
    
    this.name = name;
    this.characterDescription = characterDescription;
    this.initialDialogue = initialDialogue || "Hola, ¿en qué puedo ayudarte?";
    this.chatLogId = `chatLog-${name.replace(/\s+/g, '-').toLowerCase()}`;
    this.nameBarContainer = null;
    
    // Set up the name bar
    this.createNameBar();
    
    // Make the NPC clickable
    this.on('pointerdown', () => {
      if (scene.playerInRange(this)) {
        scene.openChat(this);
      }
    });
  }
  
  createNameBar() {
    // Create a name bar above the NPC
    const nameBar = this.scene.add.graphics();
    nameBar.fillStyle(0x000000, 0.7);
    const nameWidth = Math.max(this.name.length * 12, 100);
    nameBar.fillRoundedRect(-nameWidth / 2, -125, nameWidth, 30, 15);
    
    const nameText = this.scene.add.bitmapText(0, -110, 'roboto', this.name, 20)
      .setOrigin(0.5);
    
    this.nameBarContainer = this.scene.add.container(this.x, this.y, [nameBar, nameText]);
  }
  
  updateNameBarPosition() {
    if (this.nameBarContainer) {
      this.nameBarContainer.setPosition(this.x, this.y);
    }
  }
  
  getInfo() {
    return {
      name: this.name,
      description: this.characterDescription,
      initialDialogue: this.initialDialogue
    };
  }
}

export { NPC };
