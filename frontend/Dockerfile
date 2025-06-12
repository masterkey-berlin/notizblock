# Dockerfile im frontend/ Verzeichnis

# Stage 1: Builder - Baut die React App
FROM node:22-alpine AS builder
WORKDIR /app

# Kopiere package.json und package-lock.json (oder yarn.lock)
COPY package*.json ./

# Installiere nur Produktionsabhängigkeiten (oder alle, wenn Build-Skripte Dev-Deps benötigen)
# Für Vite-Builds werden oft Dev-Dependencies benötigt (z.B. Vite selbst)
# Daher ist 'npm ci' ohne '--production' hier meist besser.
RUN npm ci

# Kopiere den Rest des App-Codes
COPY . .

# Baue die App (Vite)
# Wenn du VITE_API_URL als Build-Argument nutzt:
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# Stage 2: Runner - Serviert die gebaute App mit Nginx
FROM nginx:stable-alpine AS runner
WORKDIR /usr/share/nginx/html

# Entferne Default Nginx-Inhalt
RUN rm -rf ./*

# Kopiere den Build-Output von der Builder-Stage
COPY --from=builder /app/dist .

# (Optional) Kopiere eine eigene Nginx-Konfiguration, falls nötig
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponiere Port 80
EXPOSE 80

# Starte Nginx
CMD ["nginx", "-g", "daemon off;"]