class ChatManager {
  constructor() {
    this.conversations = new Map();
    this.currentNPC = null;
    this.onMessageCallback = null;
    this.apiURL = 'https://api.example.com/chat'; // Replace with actual API endpoint
  }

  setOnMessageCallback(callback) {
    this.onMessageCallback = callback;
  }

  startConversation(npc) {
    this.currentNPC = npc;
    
    if (!this.conversations.has(npc.name)) {
      this.conversations.set(npc.name, []);
    }
    
    return this.conversations.get(npc.name);
  }

  async sendMessage(message, username) {
    if (!this.currentNPC) {
      console.error('No current NPC in conversation');
      return {
        sender: 'System',
        text: 'Error: No character selected for conversation.',
        timestamp: new Date().toISOString()
      };
    }
    
    try {
      // Add user message to conversation
      const userMessage = { 
        sender: username || 'Player', 
        text: message, 
        timestamp: new Date().toISOString() 
      };
      
      const conversation = this.conversations.get(this.currentNPC.name);
      if (!conversation) {
        console.error('No conversation found for NPC:', this.currentNPC.name);
        return {
          sender: 'System',
          text: 'Error: Conversation not found.',
          timestamp: new Date().toISOString()
        };
      }
      
      conversation.push(userMessage);
      
      if (this.onMessageCallback) {
        this.onMessageCallback(userMessage);
      }
      
      // In a real implementation, this would call an API
      // For now, we'll simulate a response
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const npcMessage = { 
        sender: this.currentNPC.name, 
        text: this.generateResponse(message, this.currentNPC.characterDescription), 
        timestamp: new Date().toISOString() 
      };
      
      conversation.push(npcMessage);
      
      if (this.onMessageCallback) {
        this.onMessageCallback(npcMessage);
      }
      
      return npcMessage;
    } catch (error) {
      console.error('Error generating response:', error);
      
      const errorMessage = { 
        sender: 'System', 
        text: 'Error communicating with the character. Please try again.', 
        timestamp: new Date().toISOString() 
      };
      
      if (this.currentNPC) {
        const conversation = this.conversations.get(this.currentNPC.name);
        if (conversation) {
          conversation.push(errorMessage);
        }
      }
      
      if (this.onMessageCallback) {
        this.onMessageCallback(errorMessage);
      }
      
      return errorMessage;
    }
  }

  generateResponse(message, characterDescription) {
    // Simple response generation based on character description and message content
    // In a real implementation, this would use an actual AI system
    
    const lowerMessage = message.toLowerCase();
    const description = characterDescription.toLowerCase();
    
    // Check for greetings
    if (lowerMessage.includes('hola') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      if (description.includes('robot')) {
        return '¡Saludos humano! *bzzzt* Mi nombre es Circuit Whiskers. ¿En qué puedo asistirte hoy? *parpadeo digital*';
      } else if (description.includes('mujer')) {
        return '¡Hola! Soy Luna Trickshot. ¿Qué te trae por aquí? *guiño*';
      } else if (description.includes('pícaro')) {
        return '*mirada intensa* Zephyr Shadowblade a tu servicio. No confío en muchos, pero puedo hacer una excepción contigo.';
      }
    }
    
    // Check for questions about identity
    if (lowerMessage.includes('quién eres') || lowerMessage.includes('who are you') || lowerMessage.includes('tu nombre')) {
      if (description.includes('robot')) {
        return 'Soy Circuit Whiskers, un robot con una cabeza de gato porque... ¿por qué no? *movimientos erráticos* Los humanos tienen mascotas, los robots tenemos... partes de animales, supongo. *sarcástico*';
      } else if (description.includes('mujer')) {
        return 'Luna Trickshot, especialista en diversión y engaños. ¡Mi pelo turquesa no es lo único brillante en mí! *risita traviesa*';
      } else if (description.includes('pícaro')) {
        return 'Zephyr Shadowblade. Mi espada es tan afilada como mi pasado. *ajusta su parche* El mundo cibernético no perdona a los débiles.';
      }
    }
    
    // Check for help requests
    if (lowerMessage.includes('ayuda') || lowerMessage.includes('help') || lowerMessage.includes('qué hago')) {
      if (description.includes('robot')) {
        return '¿Ayuda? *mecánicamente* ¿Has intentado reiniciarte? Funciona para nosotros los robots. *ruido de engranajes* En serio, explora la ciudad y habla con todos. Hay secretos en cada esquina.';
      } else if (description.includes('mujer')) {
        return '¿Necesitas ayuda? *sonrisa astuta* Deberías explorar los distritos de la ciudad. Hay rumores sobre un tesoro escondido en el sector norte. ¡Pero no le digas a nadie que te lo dije!';
      } else if (description.includes('pícaro')) {
        return '*suspira* En este mundo necesitamos aliados. Busca a los rebeldes en el distrito este. Te recomiendo que mejores tu equipo antes. La noche es peligrosa.';
      }
    }
    
    // Default responses
    if (description.includes('robot')) {
      return '01001000 01101101 01101101... Perdón, a veces mi procesador se confunde. *ajusta patas* Lo que quería decir es que deberíamos seguir hablando. Los humanos son fascinantes.';
    } else if (description.includes('mujer')) {
      return '*juega con su cabello* ¿Sabes? Hay muchos secretos en esta ciudad. Quizás te muestre algunos si me caes bien. *sonríe misteriosamente*';
    } else if (description.includes('pícaro')) {
      return '*mirada sombría* El silencio a veces dice más que las palabras. *afila su espada* Pero estoy dispuesto a compartir mi conocimiento con quienes lo merecen.';
    }
    
    return 'Hmm, interesante. Cuéntame más.';
  }

  endConversation() {
    this.currentNPC = null;
  }

  getConversationHistory(npcName) {
    return this.conversations.get(npcName) || [];
  }
}

export default new ChatManager();
