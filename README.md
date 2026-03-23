# Whispering Text Transformer

Local server compatible with OpenAI API for text transformations in Whispering.

## Quick start

```bash
# Node
npm install && npm start

# Bun
bun install && bun server.js
# or with script
bun run bs
```

The server will run at `http://localhost:3000` by default.

### Custom port

You can configure the port using the `PORT` environment variable:

```bash
# Node
PORT=8080 npm start

# Bun
PORT=8080 bun server.js
```

## Available transformations

| Transformation | Description | Example |
| --- | --- | --- |
| `lowercase` | Converts to lowercase | `"HELLO WORLD"` → `"hello world"` |
| `uppercase` | Converts to uppercase | `"hello world"` → `"HELLO WORLD"` |
| `capitalize` | First letter uppercase, rest lowercase | `"HELLO WORLD"` → `"Hello world"` |
| `capitalize-words` | Capitalizes each word | `"hello world"` → `"Hello World"` |
| `remove-spaces` | Removes all spaces | `"hello world"` → `"helloworld"` |
| `trim` | Removes leading and trailing spaces | `"  hello  "` → `"hello"` |
| `reverse` | Reverses the text | `"hello"` → `"olleh"` |
| `remove-punctuation` | Removes commas, periods and semicolons | `"Hello, world."` → `"Hello world"` |
| `all-remove-punctuation` | Removes all punctuation marks | `"Hello, world!"` → `"Hello world"` |
| `remove-trailing-period` | Removes the trailing period | `"Hello world."` → `"Hello world"` |
| `decapitalize` | Lowercases the first letter | `"Hello world"` → `"hello world"` |
| `final` | Removes trailing period + decapitalizes | `"Hello world."` → `"hello world"` |

## Whispering setup

1. Create transformation: **Transformations** > **Create Transformation** > **Prompt Transform** step
2. Configure provider:
   - **Provider**: `Custom`
   - **Base URL**: `http://localhost:3000/v1`
   - **Model**: transformation name (e.g. `final`)
   - **API Key**: any value
3. Prompts:
   - **System Prompt**: empty
   - **User Prompt**: `{{input}}`

## Testing

```bash
# Manual
curl http://localhost:3000/health
curl http://localhost:3000/v1/models
curl -X POST http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "final", "messages": [{"role": "user", "content": "Hello world."}]}'
```
