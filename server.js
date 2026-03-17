const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Transformaciones disponibles
const transformations = {
  lowercase: (text) => text.toLowerCase(),
  uppercase: (text) => text.toUpperCase(),
};

// Endpoint compatible con OpenAI Chat Completions API
app.post('/v1/chat/completions', (req, res) => {
  try {
    const { messages, model } = req.body;

    // Extraer el último mensaje del usuario
    const userMessage = messages.find(msg => msg.role === 'user')?.content || '';

    // El "model" indica qué transformación aplicar
    const transformation = transformations[model] || transformations.lowercase;

    // Aplicar la transformación
    const result = transformation(userMessage);

    // Responder en formato compatible con OpenAI
    res.json({
      id: `txf-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: result
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: userMessage.length,
        completion_tokens: result.length,
        total_tokens: userMessage.length + result.length
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {});
