# Whispering Text Transformer Server

Servidor local compatible con OpenAI API para transformaciones de texto en Whispering.

## 🚀 Inicio rápido

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar servidor
```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000`

## 📝 Transformaciones disponibles

### Básicas
- **lowercase** - Convierte todo a minúsculas
  - Ejemplo: `"HOLA MUNDO"` → `"hola mundo"`
- **uppercase** - Convierte todo a MAYÚSCULAS
  - Ejemplo: `"hola mundo"` → `"HOLA MUNDO"`
- **capitalize** - Primera letra mayúscula, resto minúsculas
  - Ejemplo: `"HOLA MUNDO"` → `"Hola mundo"`
- **capitalize-words** - Capitaliza Cada Palabra
  - Ejemplo: `"hola mundo"` → `"Hola Mundo"`
- **remove-spaces** - Eliminatodoslosespacios
  - Ejemplo: `"hola mundo"` → `"holamundo"`
- **trim** - Elimina espacios al inicio y final
  - Ejemplo: `"  hola  "` → `"hola"`
- **reverse** - Invierte el texto
  - Ejemplo: `"hola"` → `"aloh"`

### Puntuación
- **remove-punctuation** - Elimina signos de puntuación manteniendo espacios entre palabras
  - Ejemplo: `"¡Hola, mundo! ¿Cómo estás?"` → `"Hola mundo Cómo estás"`
  - Reemplaza puntuaciones por espacios para evitar que las palabras se unan
  
### Combinadas
- **final** - Convierte a minúsculas Y elimina puntuaciones (todo en uno)
  - Ejemplo: `"¡HOLA, MUNDO!"` → `"hola mundo"`
  - Ideal para normalizar texto completamente

## ⚙️ Configuración en Whispering

### Paso 1: Crear una transformación
1. Abre Whispering
2. Ve a **Transformations** (📚)
3. Click en **"Create Transformation"**
4. Agregar paso tipo **"Prompt Transform"**

### Paso 2: Configurar el proveedor Custom
1. **Provider**: Selecciona `Custom`
2. **Base URL**: `http://localhost:3000/v1`
3. **Model**: `lowercase` (o cualquier otra transformación disponible)
4. **API Key**: Cualquier valor (no se valida)

### Paso 3: Configurar prompts
- **System Prompt**: (déjalo vacío o cualquier texto)
- **User Prompt**: `{{input}}`

## 🧪 Probar el servidor

### Forma rápida (script automático)
```bash
# Asegúrate de que el servidor esté corriendo primero
npm start

# En otra terminal, ejecuta las pruebas
./test.sh
```

### Forma manual (curl)

```bash
# Verificar estado
curl http://localhost:3000/health

# Listar transformaciones disponibles
curl http://localhost:3000/v1/models

# Probar transformación a minúsculas
curl -X POST http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "lowercase",
    "messages": [
      {"role": "user", "content": "HOLA MUNDO"}
    ]
  }'

# Probar eliminar puntuaciones
curl -X POST http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "remove-punctuation",
    "messages": [
      {"role": "user", "content": "¡Hola, mundo! ¿Cómo estás?"}
    ]
  }'

# Probar transformación final (minúsculas + sin puntuación)
curl -X POST http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "final",
    "messages": [
      {"role": "user", "content": "¡HOLA, MUNDO! ¿CÓMO ESTÁS?"}
    ]
  }'
```

## 🔧 Agregar nuevas transformaciones

Edita `server.js` y agrega funciones al objeto `transformations`:

```javascript
const transformations = {
  lowercase: (text) => text.toLowerCase(),
  // ... otras transformaciones
  'mi-transformacion': (text) => {
    // Tu lógica aquí
    return text;
  }
};
```

## 📦 Estructura del proyecto

```
whispering-text-transformer/
├── server.js       # Servidor principal
├── package.json    # Dependencias
└── README.md       # Este archivo
```

## 🛠️ Tecnologías

- **Express** - Framework web
- **CORS** - Permitir peticiones cross-origin desde Whispering
- **Node.js** - Runtime

## 📄 Licencia

MIT
