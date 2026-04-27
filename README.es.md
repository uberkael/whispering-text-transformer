# Whispering Text Transformer

[![Whispering](https://img.shields.io/badge/Creado%20para-Whispering-7c3aed?logo=github&labelColor=1a1a2e)](https://github.com/EpicenterHQ/epicenter/tree/main/apps/whispering) [![OpenAI Compatible](https://img.shields.io/badge/API-OpenAI%20Compatible-10a37f?logo=openai&labelColor=1a1a2e)](https://platform.openai.com/docs/api-reference/chat)

Servidor local compatible con OpenAI API para transformaciones de texto en [Whispering](https://github.com/EpicenterHQ/epicenter/tree/main/apps/whispering).

## Inicio rápido

```bash
# Con node
npm install && npm start

# Con bun
bun install && bun server.js
# o con script
bun run bs
```

El servidor se ejecutará en `http://localhost:3000` por defecto.

### Puerto personalizado

Puedes configurar el puerto usando la variable de entorno `PORT`:

```bash
# Con node
PORT=8080 npm start

# Con bun
PORT=8080 bun server.js
```

## Transformaciones disponibles

| Transformación | Descripción | Ejemplo |
| --- | --- | --- |
| `lowercase` | Convierte a minúsculas | `"HOLA MUNDO"` → `"hola mundo"` |
| `uppercase` | Convierte a mayúsculas | `"hola mundo"` → `"HOLA MUNDO"` |
| `capitalize` | Primera letra mayúscula, resto minúsculas | `"HOLA MUNDO"` → `"Hola mundo"` |
| `capitalize-words` | Capitaliza cada palabra | `"hola mundo"` → `"Hola Mundo"` |
| `remove-spaces` | Elimina todos los espacios | `"hola mundo"` → `"holamundo"` |
| `trim` | Elimina espacios al inicio y final | `"  hola  "` → `"hola"` |
| `trim-trailing-newlines` | Elimina solo los saltos de línea del final | `"hola\n\n"` → `"hola"` |
| `reverse` | Invierte el texto | `"hola"` → `"aloh"` |
| `remove-punctuation` | Elimina comas, puntos y punto y coma | `"Hola, mundo."` → `"Hola mundo"` |
| `all-remove-punctuation` | Elimina todos los signos de puntuación | `"¡Hola, mundo!"` → `"Hola mundo"` |
| `remove-trailing-period` | Elimina el punto final | `"Hola mundo."` → `"Hola mundo"` |
| `decapitalize` | Primera letra a minúscula | `"Hola mundo"` → `"hola mundo"` |
| `final` | Elimina saltos de línea y punto final + decapitaliza | `"Hola mundo.\n"` → `"hola mundo"` |

## Configuración en Whispering

> **¿Aún no tienes [Whispering](https://github.com/EpicenterHQ/epicenter/tree/main/apps/whispering)?** Visita el repositorio para instrucciones de instalación.

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

---

Parte del ecosistema [Whispering](https://github.com/EpicenterHQ/epicenter/tree/main/apps/whispering).
