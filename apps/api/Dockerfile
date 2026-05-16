# Stage 1: Build
FROM node:24-alpine AS builder

# Instalar pnpm
RUN npm install -g pnpm@11.1.1

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de workspace
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY tsconfig.json ./

# Copiar aplicación API
COPY apps/api ./apps/api

# Copiar paquetes compartidos
COPY packages ./packages

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Construir la aplicación
RUN pnpm run build --filter=api

# Stage 2: Run
FROM node:24-alpine

# Instalar pnpm
RUN npm install -g pnpm@11.1.1

# Establecer directorio de trabajo
WORKDIR /app

# Copiar node_modules y build del stage anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Exponer puerto (ajusta según tu aplicación)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["node", "dist/server.js"]

