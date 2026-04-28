const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Available transformations
const transformations = {
  lowercase: (text) => text.toLowerCase(),
  uppercase: (text) => text.toUpperCase(),
  capitalize: (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(),
  'capitalize-words': (text) => text.replace(/\b\w/g, char => char.toUpperCase()),
  'remove-spaces': (text) => text.replace(/\s+/g, ''),
  'trim': (text) => text.trim(),
  'trim-trailing-newlines': (text) => text.replace(/[\r\n]+$/, ''),
  'reverse': (text) => text.split('').reverse().join(''),

  // Remove punctuation but keep spaces between words
  'remove-punctuation': (text) => {
    // Replace unnecessary signs
    return text
      .replace(/[.,;]/g, ' ')
      // Normalize multiple spaces to one
      .replace(/\s+/g, ' ')
      // Trim leading and trailing spaces
      .trim();
  },

  'all-remove-punctuation': (text) => {
    // Replace all punctuation marks with a space
    return text
      .replace(/[.,;:!?¡¿"'`()[\]{}<>\/\\|@#$%^&*+=~_-]/g, ' ')
      // Normalize multiple spaces to one
      .replace(/\s+/g, ' ')
      // Trim leading and trailing spaces
      .trim();
  },

  // Remove trailing period
  'remove-trailing-period': (text) => text.replace(/\.\s*$/, ''),

  // Lowercase first two characters (handles ¿A, ¡A, or just A)
  'decapitalize': (text) => text[0].toLowerCase() + text[1].toLowerCase() + text.slice(2),

  // Replace misrecognized words: Gira→Jira, cómic/comic→commit, landa→lambda
  'replace-words': (text) => text
      .replace(/\bgira\b/gi, 'Jira')
      .replace(/\bc[óo]mic(s?)\b/gi, 'commit$1')
      .replace(/\blanda(s?)\b/gi, 'lambda$1')
  ,

  // Combo: trim trailing newlines + remove-trailing-period + decapitalize + replace-words
  'final': (text) => {
    let r = transformations['trim-trailing-newlines'](text);
    r = transformations['remove-trailing-period'](r);
    // TODO: lowercase after mid-sentence periods: "Algo. Luego" → "algo luego"
    r = transformations['decapitalize'](r);
    return transformations['replace-words'](r);
  }
};

// OpenAI Chat Completions compatible endpoint
app.post('/v1/chat/completions', (req, res) => {
  try {
    const { messages, model } = req.body;

    // Extract the user's message
    const userMessage = messages.find(msg => msg.role === 'user')?.content || '';

    // The "model" field indicates which transformation to apply
    const transformation = transformations[model] || transformations.lowercase;

    // Apply the transformation
    const result = transformation(userMessage);

    // Respond in OpenAI-compatible format
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

// List available models
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

const { execSync } = require('child_process');

function checkPort(port) {
  try {
    const result = execSync(`ss -tlnp sport = :${port} 2>/dev/null`, { encoding: 'utf8' });
    if (!result.trim()) return null;
    const procs = [];
    for (const m of result.matchAll(/"([^"]+)",pid=(\d+)/g)) {
      procs.push({ name: m[1], pid: m[2] });
    }
    return procs.length ? procs : null;
  } catch { return null; }
}

const portInfo = checkPort(PORT);
if (portInfo) {
  console.error(`Error: port ${PORT} is already in use:`);
  for (const p of portInfo) console.error(`${p.name} - PID ${p.pid}`);
  console.error("\nTo use another port:");
  console.error("PORT=<other> bun bs\n");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Available transformations:\n${Object.keys(transformations).join(', ')}`);
  console.log("\nWhispering setup:");
  console.log(`  Base URL: http://localhost:${PORT}/v1`);
  console.log(`  Model: any transformation name`);
  console.log(`  API Key: any value\n`);
});
