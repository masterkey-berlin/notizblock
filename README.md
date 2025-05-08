# Notizblock

Ein einfacher Notizblock, der mit React erstellt wurde. Die Anwendung ermöglicht es, Notizen hinzuzufügen und zu löschen. Die Notizen werden im Zustand der Anwendung gespeichert und gehen beim Neuladen der Seite verloren.

## Funktionen

- **Notizen hinzufügen:** Über ein Eingabefeld können neue Notizen erstellt werden.
- **Notizen löschen:** Jede Notiz kann über einen "Löschen"-Button entfernt werden.

## Technologien
React
JavaScript
HTML/CSS
Docker
GitHub

## HEALTHCHECK-Funktion

Die `HEALTHCHECK-FUNKTION` im Dockerfile überprüft regelmäßig, ob der Webserver im Container erreichbar ist. Es sendet eine Anfrage an `http://localhost/` und meldet den Container als "unhealthy", wenn keine Antwort erfolgt. Dies ist wichtig für die Orchestrierung (z. B. in Kubernetes oder Docker Swarm), um fehlerhafte Container automatisch neu zu starten.

## Mulit-Stage-Build

Das Dockerfile verwendet ein Multi-Stage Build, um die Anwendung effizient zu containerisieren:

1. **Builder-Stage**:
   - Baut die Anwendung mit Node.js.
   - Der `dist`-Ordner mit den statischen Dateien wird erstellt.

2. **Runtime-Stage**:
   - Nutzt ein schlankes Nginx-Image, um die statischen Dateien auszuliefern.
   - Der `dist`-Ordner wird aus der Builder-Stage kopiert, wodurch unnötige Dateien (z. B. `node_modules`) nicht im finalen Image enthalten sind.

**Vorteile**:
- Kleinere Image-Größe.
- Trennung von Build- und Laufzeitumgebung.
- Verbesserte Sicherheit und Performance.

## Vite-Konfiguration hinzugefügt

Die vite.config.js wurde eingerichtet, um die Anwendung mit React zu optimieren und Build-Argumente wie VITE_API_URL zu unterstützen.

## Umgebungsvariable für Backend-URL integriert

Die Backend-URL (VITE_API_URL) wird nun während des Builds als Argument injiziert, um dynamische API-URLs zu ermöglichen.

## React-Import und Fehlerbehebung

Fehlende React-Imports wurden hinzugefügt, um Fehler bei der JSX-Verarbeitung zu beheben.

## Dockerfile optimiert

Multi-Stage-Build verbessert, um sicherzustellen, dass nur Produktionsabhängigkeiten und der dist-Ordner im finalen Image enthalten sind.

## Fehlerbehebung bei Frontend-Container

## Browser- und Netzwerk-Debugging durchgeführt

Netzwerk- und Konsolenfehler wurden nicht identifiziert und konnten somit nicht behoben werde

1.  ## Projektstruktur beibehalten:** Die bestehende `frontend/` und `backend/` Struktur wurde beibehalten und das Root-Verzeichnis aufgeräumt.

2.  ## Backend-Anpassung für Persistenz:**

    *   Die Node.js/Express API wurde so modifiziert, dass Daten nicht mehr nur im Speicher gehalten werden.
    *   Das `fs` Modul wird genutzt, um Daten in einer JSON-Datei (`/app/data/items.json` innerhalb des Containers) zu speichern und von dort zu laden.
    *   Beim Serverstart werden Daten aus der Datei geladen. Existiert die Datei oder das Verzeichnis `/app/data/` nicht, wird es erstellt und mit einem leeren Datensatz initialisiert.
    *   Bei jeder Datenänderung (POST, DELETE) wird der gesamte Datensatz synchron in die Datei geschrieben.
3.  ## Dockerisierung:**
    *   Die Dockerfiles für Frontend und Backend aus der vorherigen Aufgabe wurden beibehalten.
    *   `.dockerignore` Dateien wurden in den jeweiligen Verzeichnissen und im Root-Verzeichnis überprüft und korrekt konfiguriert.
4.  **Datenpersistenz mit Docker Volume:**
    *  ## Ein Benanntes Volume (Named Volume) namens `my-backend-data` wurde gewählt, um das Verzeichnis `/app/data` des Backend-Containers persistent zu machen.
    *   Dies stellt sicher, dass die Daten auch nach dem Stoppen, Entfernen und Neustarten des Backend-Containers erhalten bleiben.
5.  ## Container-Management:**
    *   Das Backend-Image wurde neu gebaut (`my-backend-api:persistence`).
    *   Der Backend-Container wurde mit dem gemounteten Volume gestartet.
    *   Das Frontend-Image wurde gebaut und der Container gestartet, wobei die Kommunikation zum Backend über den Host-Port konfiguriert ist.
6.  ## Persistenztest:**
    *   Die Funktionalität wurde getestet, indem Daten hinzugefügt, der Backend-Container gestoppt/gestartet und auch entfernt/neu erstellt wurde (unter Wiederverwendung desselben Volumes), um die dauerhafte Speicherung der Daten zu überprüfen.

## Voraussetzungen

*   Docker muss installiert sein.

## Setup und Starten

1.  **Backend bauen und starten:**
    ```bash
    cd backend
    docker build -t my-backend-api:persistence .
    # Startet den Backend-Container mit einem Named Volume für Persistenz
    docker run -d -p 8081:3000 --name my-backend-persistent -v my-backend-data:/app/data my-backend-api:persistence
    cd ..
    ```

2.  ## Frontend bauen und starten:**
    ```bash
    cd frontend
    docker build --build-arg VITE_API_URL=http://localhost:8081 -t my-frontend-app:latest .
    docker run -d -p 8080:80 --name my-frontend my-frontend-app:latest
    cd ..
    ```

3.  ## Anwendung öffnen:**
    *   Greife auf das Frontend im Browser zu: `http://localhost:8080`
    *   Die Backend API ist erreichbar unter: `http://localhost:8081/api/items`

## Persistenz Testen

1.  Füge einige Items über das Frontend (`http://localhost:8080`) hinzu.
2.  Stoppe den Backend-Container: `docker stop my-backend-persistent`
3.  Starte den Backend-Container neu: `docker start my-backend-persistent`
4.  Lade das Frontend neu. Die zuvor hinzugefügten Daten sollten weiterhin vorhanden sein.
5.  **Optional (robusterer Test):**
    *   Stoppe und entferne den Backend-Container:
        ```bash
        docker stop my-backend-persistent
        docker rm my-backend-persistent
        ```
    *   Starte den Backend-Container erneut mit dem *gleichen* `docker run`-Befehl wie oben (der das Volume `my-backend-data` verwendet).
    *   Lade das Frontend neu. Die Daten sollten immer noch vorhanden sein, da sie im Volume gespeichert wurden.

## Aufräumen

Um die erstellten Container und das Volume zu entfernen:
```bash
docker stop my-frontend my-backend-persistent
docker rm my-frontend my-backend-persistent
docker volume rm my-backend-data



2.  Frontend-Codeanpassung:**
    *   Die API-Aufrufe im React-Code wurden so angepasst, dass sie relativ zum Wert von `VITE_API_URL` erfolgen (z.B. `fetch(\${import.meta.env.VITE_API_URL}/items\`)`).
    *   Beim Build des Frontend-Containers wird `VITE_API_URL` nun auf einen relativen Pfad wie `/api` gesetzt.

3.  **Nginx Reverse Proxy Konfiguration (Frontend):**
    *   Eine `nginx.conf` wurde im `frontend/` Verzeichnis erstellt.
    *   Nginx wurde konfiguriert, um:
        *   Statische Frontend-Dateien für den Root-Pfad (`/`) auszuliefern.
        *   Alle Anfragen an den Pfad `/api/` als Reverse Proxy an den Backend-Container (`http://backend-service:3000/`) im Docker-Netzwerk weiterzuleiten.
    *   Das Frontend-Dockerfile wurde angepasst, um diese `nginx.conf` zu verwenden.

4.  **Docker Netzwerk:**
    *   Ein dediziertes Docker Bridge Netzwerk namens `my-app-network` wurde erstellt.

5.  **Containerisierte Ausführung im Netzwerk:**
    *   **Backend:**
        *   Das Backend-Image (`my-backend-api:network-proxy`) wurde gebaut.
        *   Der Backend-Container wurde im `my-app-network` mit dem Namen `backend-service` und dem persistenten Volume `my-backend-data` gestartet.
    *   **Frontend:**
        *   Das Frontend-Image (`my-frontend-app:network-proxy`) wurde mit `VITE_API_URL=/api` gebaut.
        *   Der Frontend-Container (`frontend-app`) wurde im `my-app-network` gestartet und Port `8080` des Hosts auf Port `80` des Containers gemappt.

6.  **Testen:**
    *   Die Anwendung wurde über `http://localhost:8080` aufgerufen.
    *   Die Kommunikation zwischen Frontend und Backend über den Nginx-Proxy wurde verifiziert.
    *   Die Datenpersistenz wurde erneut getestet.
    *   (Optional) Die Netzwerk-Tab-Analyse im Browser zeigte API-Aufrufe an `http://localhost:8080/api/...`.

## Voraussetzungen

*   Docker muss installiert sein.

## Setup und Starten

1.  **Docker Netzwerk erstellen (falls nicht vorhanden):**
    ```bash
    docker network create my-app-network
    ```

2.  **Backend bauen und starten:**
    ```bash
    cd backend
    docker build -t my-backend-api:network-proxy .
    docker run -d \
      --name backend-service \
      --network my-app-network \
      -v my-backend-data:/app/data \
      # -p 8081:3000 # Optional für direktes Debugging
      my-backend-api:network-proxy
    cd ..
    ```

3.  **Frontend bauen und starten:**
    ```bash
    cd frontend
    docker build --build-arg VITE_API_URL=/api -t my-frontend-app:network-proxy .
    docker run -d \
      --name frontend-app \
      --network my-app-network \
      -p 8080:80 \
      my-frontend-app:network-proxy
    cd ..
    ```

4.  **Anwendung öffnen:**
    *   Greife auf das Frontend im Browser zu: `http://localhost:8080`

## Aufräumen

Um die erstellten Container, das Netzwerk und das Volume zu entfernen:
```bash
docker stop frontend-app backend-service
docker rm frontend-app backend-service
docker network rm my-app-network
docker volume rm my-backend-data # Vorsicht, löscht persistente Daten


## Datenbank-Schema (Theoretische Ausarbeitung)

    Eine theoretische Ausarbeitung zum Datenbank-Schema (relationale Datenbank mit SQL) für eine Notizblock-Anwendung, inklusive CRUD-Abfragen ist in der Datei [backend/sql-schema.txt] zu finden.



