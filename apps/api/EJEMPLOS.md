# 🐱 Ejemplos de Uso de la API de Gatos

Estos son ejemplos práticos para interactuar con la API usando `curl`.

## Obtener todos los gatos

```bash
curl http://localhost:3000/cat
```

**Respuesta:**

```json
[
  {
    "id": 1,
    "name": "Whiskers"
  }
]
```

---

## Crear un nuevo gato

```bash
curl -X POST http://localhost:3000/cat \
  -H "Content-Type: application/json" \
  -d '{"name": "Luna"}'
```

**Respuesta (201):**

```json
{
  "id": 2,
  "name": "Luna"
}
```

### Ejemplos de validación:

**Nombre vacío (400 Bad Request):**

```bash
curl -X POST http://localhost:3000/cat \
  -H "Content-Type: application/json" \
  -d '{"name": ""}'
```

**Body vacío (400 Bad Request):**

```bash
curl -X POST http://localhost:3000/cat \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## Actualizar un gato

```bash
curl -X PATCH http://localhost:3000/cat/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Whiskers Updated"}'
```

**Respuesta (200):**

```json
{
  "id": 1,
  "name": "Whiskers Updated"
}
```

### Casos de error:

**Gato no encontrado (404):**

```bash
curl -X PATCH http://localhost:3000/cat/999 \
  -H "Content-Type: application/json" \
  -d '{"name": "Nonexistent"}'
```

---

## Con jq (formato bonito)

Si tienes `jq` instalado, puedes formatear las respuestas:

```bash
# Obtener todos los gatos con formato bonito
curl http://localhost:3000/cat | jq .

# Crear un gato con formato bonito
curl -X POST http://localhost:3000/cat \
  -H "Content-Type: application/json" \
  -d '{"name": "Mittens"}' | jq .
```

---

## Con Postman

1. Abre Postman
2. Crea una nueva colección llamada "API Gatos"
3. Importa los siguientes requests:

### GET Todos los gatos

- **Método**: GET
- **URL**: `http://localhost:3000/cat`

### POST Crear gato

- **Método**: POST
- **URL**: `http://localhost:3000/cat`
- **Headers**: `Content-Type: application/json`
- **Body (raw JSON)**:

```json
{
  "name": "Felix"
}
```

### PATCH Actualizar gato

- **Método**: PATCH
- **URL**: `http://localhost:3000/cat/{{id}}`
- **Headers**: `Content-Type: application/json`
- **Body (raw JSON)**:

```json
{
  "name": "Felix Updated"
}
```

---

## Usando la documentación interactiva (Swagger)

La forma más fácil es usar Swagger UI directamente:

1. Abre tu navegador en `http://localhost:3000/api`
2. Verás todos los endpoints documentados
3. Haz clic en "Try it out" para probar cada endpoint
4. Completa los parámetros necesarios
5. Haz clic en "Execute"

---

## Notas importantes

- ⚠️ El servidor debe estar ejecutándose: `pnpm dev`
- 📍 Por defecto la API escucha en `http://localhost:3000`
- 🔍 Todos los requests deben incluir `Content-Type: application/json`
- ✅ El campo `name` es obligatorio y debe tener al menos 1 carácter
