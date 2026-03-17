# Whispering Text Transformer

Servidor local compatible con OpenAI API para transformaciones de texto en Whispering.

## Inicio rápido

```bash
# Con node
npm install && npm start

# Con bun
bun install && bun server.js
# o con script
bun run bs
```

El servidor se ejecutará en `http://localhost:3000`

## Transformaciones disponibles

| Transformación | Descripción | Ejemplo |
| --- | --- | --- |
| `lowercase` | Convierte a minúsculas | `"HOLA MUNDO"` → `"hola mundo"` |
| `uppercase` | Convierte a mayúsculas | `"hola mundo"` → `"HOLA MUNDO"` |
| `capitalize` | Primera letra mayúscula, resto minúsculas | `"HOLA MUNDO"` → `"Hola mundo"` |
| `capitalize-words` | Capitaliza cada palabra | `"hola mundo"` → `"Hola Mundo"` |
| `remove-spaces` | Elimina todos los espacios | `"hola mundo"` → `"holamundo"` |
| `trim` | Elimina espacios al inicio y final | `"  hola  "` → `"hola"` |
| `reverse` | Invierte el texto | `"hola"` → `"aloh"` |
| `remove-punctuation` | Elimina comas, puntos y punto y coma | `"Hola, mundo."` → `"Hola mundo"` |
| `all-remove-punctuation` | Elimina todos los signos de puntuación | `"¡Hola, mundo!"` → `"Hola mundo"` |
| `remove-trailing-period` | Elimina el punto final | `"Hola mundo."` → `"Hola mundo"` |
| `decapitalize` | Primera letra a minúscula | `"Hola mundo"` → `"hola mundo"` |
| `final` | Elimina punto final + decapitaliza | `"Hola mundo."` → `"hola mundo"` |

## Configuración en Whispering

1. Crear transformación: **Transformations** > **Create Transformation** > paso **Prompt Transform**
2. Configurar proveedor:
   - **Provider**: `Custom`
   - **Base URL**: `http://localhost:3000/v1`
   - **Model**: nombre de la transformación (ej. `final`)
   - **API Key**: cualquier valor
3. Prompts:
   - **System Prompt**: vacío
   - **User Prompt**: `{{input}}`

## Probar

```bash
# Script automático (servidor debe estar corriendo)
./test.sh

# Manual
curl http://localhost:3000/health
curl http://localhost:3000/v1/models
curl -X POST http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "final", "messages": [{"role": "user", "content": "Hola mundo."}]}'
```
