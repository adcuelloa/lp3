# 📚 Documentación de la API de Gatos

## 🚀 Inicio Rápido

La API se ejecuta en `http://localhost:3000` y la documentación interactiva de Swagger está disponible en:

```
http://localhost:3000/api
```

## 📋 Descripción General

Esta es una API REST para la gestión de gatos. Proporciona operaciones CRUD (Create, Read, Update) para administrar registros de gatos.

## 🔌 Endpoints Disponibles

### 1. Obtener todos los gatos

```http
GET /cat
```

**Respuesta exitosa (200):**

```json
[
  {
    "id": 1,
    "name": "Whiskers"
  },
  {
    "id": 2,
    "name": "Luna"
  }
]
```

---

### 2. Crear un nuevo gato

```http
POST /cat
Content-Type: application/json

{
  "name": "Whiskers"
}
```

**Parámetros del body:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|--------|-----------|-------------|
| `name` | string | Sí | Nombre del gato (mínimo 1 carácter) |

**Respuesta exitosa (201):**

```json
{
  "id": 1,
  "name": "Whiskers"
}
```

**Posibles errores:**

- `400 Bad Request`: Datos inválidos (nombre vacío o tipo incorrecto)
- `500 Internal Server Error`: Error del servidor

---

### 3. Actualizar un gato

```http
PATCH /cat/:id
Content-Type: application/json

{
  "name": "Whiskers Updated"
}
```

**Parámetros de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|--------|-------------|
| `id` | number | ID del gato a actualizar |

**Parámetros del body:**
| Parámetro | Tipo | Requerido | Descripción |
|-----------|--------|-----------|-------------|
| `name` | string | Sí | Nuevo nombre del gato |

**Respuesta exitosa (200):**

```json
{
  "id": 1,
  "name": "Whiskers Updated"
}
```

**Posibles errores:**

- `400 Bad Request`: Datos inválidos
- `404 Not Found`: El gato con ese ID no existe
- `500 Internal Server Error`: Error del servidor

---

## 🔐 Validaciones

La API valida automáticamente los datos de entrada:

- ✅ El campo `name` es obligatorio
- ✅ El campo `name` debe ser un texto
- ✅ El campo `name` debe tener al menos 1 carácter

## 📦 Estructura de Respuestas

Todas las respuestas son en formato JSON.

### Objeto Gato

```typescript
{
  id: number; // ID único (autogenerado)
  name: string; // Nombre del gato
}
```

## 🛠️ Desarrollo

Para iniciar el servidor en modo desarrollo:

```bash
pnpm dev
```

El servidor se ejecutará en `http://localhost:3000`

Para ver la documentación Swagger abierta automáticamente, visita:

```
http://localhost:3000/api
```

## 📊 Base de Datos

La API utiliza PostgreSQL con Drizzle ORM. El esquema del gato se define en:

```
packages/db/src/schema/core/cat.ts
```

### Tabla: `cat`

| Columna | Tipo    | Propiedades                 |
| ------- | ------- | --------------------------- |
| `id`    | integer | PRIMARY KEY, AUTO INCREMENT |
| `name`  | text    | NOT NULL                    |

## 🔍 Recursos Adicionales

- **Swagger UI**: Documentación interactiva en `/api`
- **OpenAPI Spec**: Disponible en `/api-json` (formato OpenAPI 3.0)

---

**Versión API**: 1.0.0  
**Última actualización**: Mayo 2026
