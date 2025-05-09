FROM node:22-alpine

# Setze das Arbeitsverzeichnis
WORKDIR /app

# Kopiere die package.json und package-lock.json
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm ci

# Kopiere den gesamten Code ins Image
COPY . .

# Starte die Anwendung
CMD ["node", "index.js"]