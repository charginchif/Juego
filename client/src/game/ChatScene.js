import Phaser from 'phaser';
import { NPC } from './NPC';
import ChatManager from './ChatManager';

const baseStyle = `
    font-family: 'Trebuchet MS', serif;
    font-size: 20px;
    border: 2px solid #4e342e;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.9);
`;

const chatLogStyle = `
    ${baseStyle}
    width: 240px;
    height: 570px;
    background-color: rgba(0, 0, 0, 0.0);
    padding: 10px;
    direction: ltr;
    box-shadow: none;
    border: none;
    overflow-y: auto;
    max-width: 90%;
    max-height: 60vh;
    position: relative;
    box-sizing: border-box;
`;

const inputStyle = `
    ${baseStyle}
    width: 270px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.4);
    box-shadow: none;
    max-width: 90%;
    box-sizing: border-box;
`;

const sendButtonStyle = `
    ${baseStyle}
    width: 270px;
    height: 44px;
    color: #e0d7c5;
    background: linear-gradient(to bottom, #957d5f, #6c543e);
    box-shadow: none;
`;

const closeButtonStyle = `
    ${baseStyle}
    width: 30px;
    height: 30px;
    border-radius: 30px;
    color: #fff;
    background-color: #ff6347;
    font-size: 30px;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
`;

export class ChatScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'ChatScene'
        });
    }
    
    preload() {
        this.load.image('background', 'https://play.rosebud.ai/assets/cyberpunk_stage.png?uwiS');
        this.load.image('player', 'https://play.rosebud.ai/assets/character_02.png?gJTZ');
        this.load.image('npc01', 'https://play.rosebud.ai/assets/character_03.png?licH');
        this.load.image('npc02', 'https://play.rosebud.ai/assets/character_01.png?Ssl0');
        this.load.image('npc03', 'https://play.rosebud.ai/assets/character_04.png?w4oc');
        this.load.image('scroll', `https://play.rosebud.ai/assets/scroll_bg.png?UXx3`);
        this.load.bitmapFont('roboto', 'https://play.rosebud.ai/assets/rosebud_roboto.png?NpJZ', 'https://play.rosebud.ai/assets/rosebud_roboto.xml?Xhre');
        this.load.image('handIcon', 'https://play.rosebud.ai/assets/touch_indicator.png?AzVe');
    }

    create() {
        // Add background and UI elements
        this.add.image(550, 445, 'background').setScale(0.5);
        this.add.image(1225, 445, 'scroll');
        
        // Add player character con físicas más simples
        this.player = this.physics.add.image(360, 300, 'player');
        this.addPlayerBreathingAnimation(this.player);
        this.player.setScale(0.5);
        this.player.setCollideWorldBounds(true);
        
        // Ajustamos el tamaño del cuerpo físico para evitar problemas
        this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.5);
        
        // Configurar las físicas del jugador
        this.player.setDamping(true);
        this.player.setDrag(0.95);
        
        // Add NPCs
        this.npc01 = new NPC(
            this, 600, 500, 'npc01', 
            'Eres un pícaro cyberpunk masculino de pelo negro y ojos verdes con ropa oscura. Tienes una espada de alta tecnología y un parche en el ojo derecho. Eres oscuro y melancólico pero una buena persona. Tu nombre es Zephyr Shadowblade. Responde siempre en español.', 
            'Zephyr Shadowblade'
        );
        this.addNPC01BreathingAnimation(this.npc01);
        this.npc01.setScale(0.5);
        
        this.npc02 = new NPC(
            this, 900, 400, 'npc02', 
            'Eres una mujer con coletas y pelo color turquesa brillante vestida con ropa deportiva. Eres engañosa y divertida. Tu nombre es Luna Trickshot. Responde siempre en español.', 
            'Luna Trickshot'
        );
        this.addNPC02BreathingAnimation(this.npc02);
        this.npc02.setScale(0.5);
        
        this.npc03 = new NPC(
            this, 200, 250, 'npc03', 
            'Eres un robot humanoide cuadrado con una gran cabeza de gato adorable. Tienes grandes puños de construcción y eres algo errático y sarcástico al hablar. Tu nombre es Circuit Whiskers. Responde siempre en español.', 
            'Circuit Whiskers'
        );
        this.addNPC03BreathingAnimation(this.npc03);
        this.npc03.setScale(0.5);
        
        // Set up physics collisions
        this.physics.add.collider(this.player, [this.npc01, this.npc02, this.npc03]);
        
        // REGISTRO Y CONFIGURACIÓN DE CONTROLES DE TECLADO
        // Configuración más explícita para los controles
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Añadir manejo manual de teclas WASD con un enfoque más directo
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        
        // Configuración específica para evitar comportamiento predeterminado del navegador
        this.input.keyboard.addCapture([
            Phaser.Input.Keyboard.KeyCodes.UP,
            Phaser.Input.Keyboard.KeyCodes.DOWN,
            Phaser.Input.Keyboard.KeyCodes.LEFT,
            Phaser.Input.Keyboard.KeyCodes.RIGHT,
            Phaser.Input.Keyboard.KeyCodes.W,
            Phaser.Input.Keyboard.KeyCodes.A,
            Phaser.Input.Keyboard.KeyCodes.S,
            Phaser.Input.Keyboard.KeyCodes.D
        ]);
        
        // Registro para diagnóstico
        console.log("Controles de teclado inicializados con captura:", {
            cursors: this.cursors, 
            wasd: { w: this.keyW, a: this.keyA, s: this.keyS, d: this.keyD },
            captured: "Flechas + WASD"
        });
        
        // Initialize chat system
        this.isChatOpen = false;
        this.chatDialogs = new Map();
        
        // Set up NPC interaction
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            if (gameObject instanceof NPC && this.playerInRange(gameObject)) {
                this.openChat(gameObject);
                if (this.handIcon) {
                    this.handIcon.destroy();
                    this.handIcon = null;
                }
            }
        });
        
        // Add hovering hand icon over a random NPC to guide the player
        const randomNPC = Phaser.Math.RND.pick([this.npc01, this.npc02, this.npc03]);
        this.handIcon = this.add.image(randomNPC.x, randomNPC.y + 50, 'handIcon').setScale(0.20);
        this.tweens.add({
            targets: this.handIcon,
            y: randomNPC.y + 30,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Add instruction text
        this.instructionText = this.add.bitmapText(700, 100, 'roboto', 'Use arrow keys to move and click on characters to chat', 24)
            .setOrigin(0.5)
            .setTint(0xffffff);
        
        // Fade out the instruction text after a few seconds
        this.time.delayedCall(5000, () => {
            this.tweens.add({
                targets: this.instructionText,
                alpha: 0,
                duration: 1000,
                ease: 'Power2'
            });
        });
        
        // Add welcome message
        this.showWelcomeMessage();
    }
    
    showWelcomeMessage() {
        const welcomeBox = this.add.rectangle(700, 400, 600, 300, 0x000000, 0.7)
            .setOrigin(0.5);
        
        const welcomeTitle = this.add.bitmapText(700, 300, 'roboto', `¡Bienvenido, ${window.gameUsername || 'Aventurero'}!`, 32)
            .setOrigin(0.5)
            .setTint(0xff00ff);
        
        const welcomeText = this.add.bitmapText(700, 350, 'roboto', 
            'Has llegado a Neo-Kiara, una ciudad donde la tecnología\n' +
            'y lo espiritual coexisten. Explora y habla con los habitantes\n' +
            'para descubrir los secretos del misterioso "Kokoro".', 
            20)
            .setOrigin(0.5)
            .setTint(0xffffff);
        
        const startText = this.add.bitmapText(700, 450, 'roboto', 'Click para comenzar', 24)
            .setOrigin(0.5)
            .setTint(0x00ffff);
        
        // Make the start text blink
        this.tweens.add({
            targets: startText,
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Add click handler to dismiss welcome message
        this.input.once('pointerdown', () => {
            this.tweens.add({
                targets: [welcomeBox, welcomeTitle, welcomeText, startText],
                alpha: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    welcomeBox.destroy();
                    welcomeTitle.destroy();
                    welcomeText.destroy();
                    startText.destroy();
                }
            });
        });
    }

    update() {
        // SOLUCIÓN EXTREMA: Sistema de movimiento con posición directa
        // Comprobando si el chat está abierto
        if (this.isChatOpen) {
            // Permitir cerrar el chat con teclas
            if (this.cursors.up.isDown || this.cursors.down.isDown || 
                this.cursors.left.isDown || this.cursors.right.isDown ||
                this.keyW.isDown || this.keyA.isDown || this.keyS.isDown || this.keyD.isDown) {
                this.closeChat();
                console.log('Chat cerrado mediante teclas');
            }
            return;
        }

        // Variables para detectar movimiento
        let movX = 0;
        let movY = 0;
        const velocidad = 5; // Velocidad aumentada
        
        // Comprobar las teclas de dirección y WASD
        if (this.cursors.left.isDown || this.keyA.isDown) {
            movX = -velocidad;
            console.log('Moviendo a la izquierda');
        } 
        else if (this.cursors.right.isDown || this.keyD.isDown) {
            movX = velocidad;
            console.log('Moviendo a la derecha');
        }
        
        if (this.cursors.up.isDown || this.keyW.isDown) {
            movY = -velocidad;
            console.log('Moviendo arriba');
        } 
        else if (this.cursors.down.isDown || this.keyS.isDown) {
            movY = velocidad;
            console.log('Moviendo abajo');
        }
        
        // Aplicar movimiento directo
        if (movX !== 0 || movY !== 0) {
            // Movemos directamente la posición
            this.player.x += movX;
            this.player.y += movY;
            
            // Manejar la dirección del sprite
            if (movX < 0) this.player.setFlipX(true);
            if (movX > 0) this.player.setFlipX(false);
            
            // Mantener dentro de los límites de la pantalla
            this.player.x = Phaser.Math.Clamp(this.player.x, 50, this.sys.game.config.width - 50);
            this.player.y = Phaser.Math.Clamp(this.player.y, 50, this.sys.game.config.height - 50);
            
            console.log('Nueva posición:', this.player.x, this.player.y);
        }

        // Actualizar posición de los nombres de NPC
        this.npc01.updateNameBarPosition();
        this.npc02.updateNameBarPosition();
        this.npc03.updateNameBarPosition();
    }

    addBreathingAnimation(sprite, duration, scale) {
        this.tweens.add({
            targets: sprite,
            scaleX: sprite.scaleX * scale,
            scaleY: sprite.scaleY * scale,
            duration: duration,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    addPlayerBreathingAnimation(sprite) {
        this.addBreathingAnimation(sprite, 1000, 0.55);
    }

    addNPC01BreathingAnimation(sprite) {
        this.addBreathingAnimation(sprite, 1100, 0.54);
    }

    addNPC02BreathingAnimation(sprite) {
        this.addBreathingAnimation(sprite, 950, 0.56);
    }

    addNPC03BreathingAnimation(sprite) {
        this.addBreathingAnimation(sprite, 1050, 0.53);
    }

    playerInRange(npc) {
        const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
        return distance < 230;
    }

    openChat(npc) {
        if (this.isChatOpen) return;
        this.isChatOpen = true;

        const uniqueIdSuffix = npc.characterDescription.replace(/\s+/g, '-').toLowerCase();

        if (this.chatDialogs.has(npc)) {
            const dialog = this.chatDialogs.get(npc);
            dialog.chatLog.setVisible(true);
            dialog.chatInput.setVisible(true);
            dialog.sendButton.setVisible(true);
            dialog.closeButton.setVisible(true);
            dialog.chatInput.node.focus();
        } else {
            // Start conversation with the NPC
            const conversation = ChatManager.startConversation(npc);
            
            // Create chat UI elements
            const chatLog = this.add.dom(1230, 400).createFromHTML(`
                <div id="${npc.chatLogId}" style="${chatLogStyle}"></div>`);

            const chatInputId = `chatInput-${uniqueIdSuffix}`;
            const chatInput = this.add.dom(1220, 720).createFromHTML(`
                <input type="text" id="${chatInputId}" style="${inputStyle}" />`);

            const sendButtonId = `sendButton-${uniqueIdSuffix}`;
            const sendButton = this.add.dom(1220, 770).createFromHTML(`
                <button id="${sendButtonId}" style="${sendButtonStyle}">Send</button>`);
                
            const closeButton = this.add.dom(1325, 250).createFromHTML(`
                <button id="closeButton-${uniqueIdSuffix}" style="${closeButtonStyle}">×</button>`);
                
            // Add NPC name to the chat window
            const npcNameElement = document.createElement('div');
            npcNameElement.style.color = '#ff00ff';
            npcNameElement.style.fontWeight = 'bold';
            npcNameElement.style.fontSize = '24px';
            npcNameElement.style.textAlign = 'center';
            npcNameElement.style.marginBottom = '10px';
            npcNameElement.textContent = npc.name;
            
            const chatLogElement = document.getElementById(npc.chatLogId);
            chatLogElement.appendChild(npcNameElement);
            
            // Add initial greeting from NPC
            const initialMessage = {
                sender: npc.name,
                text: npc.initialDialogue || "Hola, ¿en qué puedo ayudarte?",
                timestamp: new Date().toISOString()
            };
            
            this.appendMessageToChat(npc.chatLogId, initialMessage);
            
            // Set up event listeners
            sendButton.addListener('click');
            sendButton.on('click', () => this.sendChatMessage(chatInputId, npc));
            
            chatInput.addListener('keydown');
            chatInput.on('keydown', (event) => {
                if (event.key === 'Enter') {
                    this.sendChatMessage(chatInputId, npc);
                }
            });
            
            closeButton.addListener('click');
            closeButton.on('click', () => this.closeChat());
            
            // Focus the input field
            chatInput.node.focus();
            
            // Store dialog elements for this NPC
            this.chatDialogs.set(npc, {
                chatLog,
                chatInput,
                sendButton,
                closeButton
            });
            
            // Make the chat elements fade in
            this.tweens.add({
                targets: [chatLog, chatInput, sendButton, closeButton],
                alpha: {
                    from: 0,
                    to: 1
                },
                duration: 300,
                ease: 'Power2'
            });
        }
    }
    
    sendChatMessage(inputId, npc) {
        const inputElement = document.getElementById(inputId);
        const message = inputElement.value.trim();
        
        if (message) {
            // Display player message
            const playerMessage = {
                sender: window.gameUsername || 'Player',
                text: message,
                timestamp: new Date().toISOString()
            };
            
            this.appendMessageToChat(npc.chatLogId, playerMessage);
            
            // Clear input field
            inputElement.value = '';
            
            // Generate NPC response
            ChatManager.sendMessage(message, window.gameUsername)
                .then(npcResponse => {
                    if (npcResponse) {
                        this.appendMessageToChat(npc.chatLogId, npcResponse);
                    } else {
                        // Handle the case where there's no response
                        this.appendMessageToChat(npc.chatLogId, {
                            sender: 'System',
                            text: 'No response received from character.',
                            timestamp: new Date().toISOString()
                        });
                    }
                })
                .catch(error => {
                    console.error('Error in chat response:', error);
                    this.appendMessageToChat(npc.chatLogId, {
                        sender: 'System',
                        text: 'Error communicating with the character. Please try again.',
                        timestamp: new Date().toISOString()
                    });
                });
        }
    }

    appendMessageToChat(chatLogId, message) {
        const chatLogElement = document.getElementById(chatLogId);
        
        if (!chatLogElement) return;
        
        const messageElement = document.createElement('div');
        messageElement.style.marginBottom = '10px';
        
        const senderElement = document.createElement('div');
        senderElement.style.fontWeight = 'bold';
        
        // Check if message is properly formed
        if (!message || typeof message !== 'object') {
            console.error('Invalid message object:', message);
            return;
        }
        
        if (message.sender === window.gameUsername || message.sender === 'Player') {
            senderElement.style.color = '#4CAF50';
        } else if (message.sender === 'System') {
            senderElement.style.color = '#FF5722';
        } else {
            senderElement.style.color = '#2196F3';
        }
        
        senderElement.textContent = message.sender || 'Unknown';
        
        const textElement = document.createElement('div');
        textElement.style.color = '#FFFFFF';
        textElement.style.overflowWrap = 'break-word';
        textElement.textContent = message.text || 'No message content';
        
        messageElement.appendChild(senderElement);
        messageElement.appendChild(textElement);
        chatLogElement.appendChild(messageElement);
        
        // Scroll to bottom of chat
        chatLogElement.scrollTop = chatLogElement.scrollHeight;
    }

    closeChat() {
        if (!this.isChatOpen) return;
        
        this.isChatOpen = false;
        ChatManager.endConversation();
        
        // Hide all chat dialogs
        this.chatDialogs.forEach(dialog => {
            dialog.chatLog.setVisible(false);
            dialog.chatInput.setVisible(false);
            dialog.sendButton.setVisible(false);
            dialog.closeButton.setVisible(false);
        });
    }
}
