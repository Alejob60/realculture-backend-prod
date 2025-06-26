# Etapa 1: build de la app
FROM node:18-alpine as builder

WORKDIR /app

# Copia los paquetes y instala todas las dependencias (dev incluidas)
COPY package*.json ./
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila el proyecto (requiere tsconfig y Nest CLI)
RUN npm run build

# Etapa 2: imagen de producción limpia
FROM node:18-alpine

WORKDIR /app

# Solo copias lo necesario para producción
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Configura entorno
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# Inicia el backend
CMD ["node", "dist/main"]
