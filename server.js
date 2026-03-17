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
  capitalize: (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
  'capitalize-words': (text) => text.replace(/\b\w/g, char => char.toUpperCase()),
  'remove-spaces': (text) => text.replace(/\s+/g, ''),
  'trim': (text) => text.trim(),
  'reverse': (text) => text.split('').reverse().join(''),
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

// Endpoint para listar modelos disponibles (opcional)
app.get('/v1/models', (req, res) => {
  res.json({
    object: 'list',
    data: Object.keys(transformations).map(name => ({
      id: name,
      object: 'model',
      created: Math.floor(Date.now() / 1000),
      owned_by: 'whispering-text-transformer'
    }))
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', transformations: Object.keys(transformations) });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de transformaciones ejecutándose en http://localhost:${PORT}`);
  console.log(`📝 Transformaciones disponibles: ${Object.keys(transformations).join(', ')}`);
  console.log(`\n💡 Para usar en Whispering:`);
  console.log(`   - Base URL: http://localhost:${PORT}/v1`);
  console.log(`   - Model: lowercase (o cualquier otra transformación)`);
  console.log(`   - API Key: (cualquier valor, no se valida)\n`);
});
