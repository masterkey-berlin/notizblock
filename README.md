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


## docker-compose
## Anwendung starten 
1. Baue und starte die Anwendung:
   ```bash
   docker-compose up --build -d

2. ## Beenden  der Anwendung inklusive Löschen aller Container 
   docker-compose down

## **Datenbank-Integration**

Das Backend ist jetzt mit einer PostgreSQL-Datenbank verbunden. Die Datei-basierte Persistenz wurde durch Datenbank-Persistenz ersetzt. CRUD-Operationen werden über SQL-Abfragen durchgeführt.

### **Manuelle Schema-Erstellung**
1. Stelle sicher, dass der Datenbank-Container läuft:
   ```bash
   docker-compose up -d database
   ```
2. Führe die SQL-Datei aus, um das Schema zu erstellen:
   ```bash
   docker exec -i database psql -U myuser -d mydatabase < backend/initial_schema.sql
   ```

### **Stack starten**
1. Starte den gesamten Stack:
   ```bash
   docker-compose up --build -d
   ```
2. Greife auf das Frontend zu: [http://localhost:8080](http://localhost:8080).

### **Funktionalität testen**
- **Items hinzufügen**: Verwende das Frontend oder sende einen POST-Request an `/api/items`.
- **Items abrufen**: Sende einen GET-Request an `/api/items` oder überprüfe die Datenbank:
  ```bash
  docker exec -it database psql -U myuser -d mydatabase -c "SELECT * FROM items;"
  ```

## Reflexion

### **Prozessbeschreibung**
Da keine Teamarbeit stattgefunden hat, wurde der gesamte Prozess individuell durchgeführt. Der Fokus lag darauf, die Stabilität des Stacks, die Ende-zu-Ende-Datenbankintegration und die Implementierung der Healthchecks eigenständig sicherzustellen. Dies beinhaltete die Konfiguration der `docker-compose.yml`, die Implementierung der CRUD-Funktionalität und die Überprüfung der Datenbank- und Backend-Integration.

### **Technische Herausforderungen**
Die größten Herausforderungen waren:
1. **Datenbankverbindung**: Sicherstellen, dass das Backend korrekt mit der PostgreSQL-Datenbank kommuniziert. Dies wurde durch Debugging der Umgebungsvariablen und Testen der Verbindung mit `pg_isready` gelöst.
2. **Healthchecks**: Die Konfiguration der Healthchecks für die Datenbank und das Backend, um sicherzustellen, dass die Dienste korrekt starten und verfügbar sind.
3. **CRUD-Funktionalität**: Die Implementierung der parametrierten Abfragen im Backend, um SQL-Injection zu verhindern.

### **Parametrisierte Abfragen**
Ein Beispiel für eine parametrisierte Abfrage im Projekt:
```javascript
const result = await pool.query("SELECT * FROM items WHERE id = $1", [id]);
```
- **Warum notwendig?**: Parametrisierte Abfragen verhindern SQL-Injection, indem Benutzereingaben nicht direkt in die SQL-Statements eingefügt werden.

### **Implementierte Healthchecks**
- **Datenbank**: Der Healthcheck prüft mit `pg_isready`, ob die PostgreSQL-Datenbank verfügbar ist.
- **Backend**: Der Healthcheck sendet eine HTTP-Anfrage an `/health`, um sicherzustellen, dass der Server läuft.
- **Vorteil**: Diese Checks sind aussagekräftiger als nur zu prüfen, ob der Container läuft, da sie die tatsächliche Verfügbarkeit der Dienste testen.

### **Bedeutung von Healthchecks in Kubernetes**
- **Automatisierung**: Healthchecks ermöglichen es Kubernetes, fehlerhafte Container automatisch neu zu starten.
- **Zuverlässigkeit**: Sie stellen sicher, dass nur funktionierende Dienste im Cluster verfügbar sind.

### **Stabilität des lokalen Stacks**
Ein stabiler lokaler Stack mit funktionierender Datenbank-Persistenz und Healthchecks ist entscheidend, um Probleme frühzeitig zu erkennen. Ohne diese Stabilität könnten in Kubernetes folgende Probleme auftreten:
- **Fehlerhafte Dienste**: Container könnten als "healthy" markiert werden, obwohl sie nicht korrekt funktionieren.
- **Schwieriges Debugging**: Probleme, die lokal nicht gelöst wurden, würden in der orchestrierten Umgebung schwerer zu beheben sein.

## Stabilität und Fehlerbehandlung

### Prozess zur Verbesserung der Stabilität und Fehlerbehandlung
Unser Team hat verschiedene Fehlerfälle simuliert, um die Robustheit des Stacks zu testen. Dazu gehörten:
- **Datenbank-Ausfall**: Die Datenbank wurde gestoppt und neu gestartet, um sicherzustellen, dass das Backend korrekt darauf reagiert.
- **Ungültige Anfragen**: Es wurden absichtlich fehlerhafte API-Anfragen gesendet, um die Validierung und Fehlerbehandlung zu testen.
- **Netzwerkunterbrechungen**: Die Verbindung zwischen Frontend und Backend wurde unterbrochen, um die Reaktion des Frontends zu prüfen.

### Fehlerfall im Backend
Ein spezifischer Fehlerfall ist der Verlust der Datenbankverbindung. Im Backend wurde dies wie folgt behandelt:

```javascript
app.use((err, req, res, next) => {
    if (err.code === 'ECONNREFUSED') {
        console.error('Datenbankverbindung verloren:', err);
        res.status(503).json({ error: 'Service Unavailable: Datenbank nicht erreichbar' });
    } else {
        console.error('Unbekannter Fehler:', err);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});
```
- **HTTP-Statuscode 503**: Dieser Code signalisiert, dass der Dienst vorübergehend nicht verfügbar ist, was wichtig ist, um Clients korrekt zu informieren.

### Reaktion des Frontends auf Fehlermeldungen
Das Frontend zeigt bei Fehlern eine nutzerfreundliche Nachricht an und verhindert Abstürze. Beispiel:

```javascript
fetch(`${apiUrl}/items`)
    .then((response) => {
        if (!response.ok) {
            throw new Error('Fehler beim Laden der Notizen');
        }
        return response.json();
    })
    .catch((error) => {
        console.error('Fehler:', error);
        alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    });
```

### Nutzung von Healthchecks
Die implementierten Healthchecks prüfen die Verfügbarkeit der Datenbank und des Backends. Beispiel:
- **Datenbank-Healthcheck**: `pg_isready` wird verwendet, um die Erreichbarkeit der Datenbank zu prüfen.
- **Backend-Healthcheck**: Eine Anfrage an `/health` stellt sicher, dass der Server korrekt läuft.

Diese Healthchecks wurden genutzt, um Fehler wie das Stoppen und Starten der Datenbank zu simulieren. Sie sind aussagekräftiger, da sie die tatsächliche Verfügbarkeit der Dienste testen.

### Logging zur Fehleranalyse
Gezieltes Logging half, Stabilitätsprobleme zu identifizieren. Beispiel:
```javascript
console.error('Datenbankverbindung verloren:', err);
```
Diese Nachricht zeigte, dass die Datenbank nicht erreichbar war, und half, den Fehler schnell zu beheben.

### Bedeutung der heutigen Arbeit
Die Arbeit an Stabilität, Fehlerbehandlung und Healthchecks ist unerlässlich, um Risiken wie fehlerhafte Dienste oder schweres Debugging in produktiven Umgebungen zu reduzieren. Sie stellt sicher, dass die Anwendung robust und zuverlässig ist, bevor sie auf Plattformen wie Kubernetes ausgerollt wird.

### Bedeutung von sauberem Code
Eine klare Code-Struktur und das Entfernen von Altlasten erleichtern das Debugging und die Wartbarkeit, insbesondere bei komplexen Fehlerfällen. Dies ist entscheidend für die Zusammenarbeit im Team und die langfristige Stabilität der Anwendung.


## Kubernetes Einführung

Die Aufgabe zur Einrichtung eines lokalen Kubernetes Clusters und Reflexion befindet sich im Ordner [kubernetes/](kubernetes/).

### Lernziele
- Einrichtung eines lokalen Kubernetes Clusters.
- Verständnis der Control Plane und Worker Nodes.
- Nutzung von `kubectl` zur Interaktion mit dem Cluster.

## speicherot 

Die Reflexionsfragen und Antworten liegen im k8s-intro-reflection.md file im root-ordner des Stacks.
Das Cluster wurde aufgrund von technischen Problemen mit Docker-Desktop mit minikube erstellt. 

## Wichtige Hinweise zu Passwörtern

**Sicherheitswarnung:** Passwörter und sensible Daten sollten niemals in die `values.yaml` eingecheckt werden, insbesondere in öffentlichen Repositories.

### Empfohlene Vorgehensweise:
1. **Passwörter über die Kommandozeile setzen:**
   ```bash
   helm install my-release ./my-notizblock-app-chart --set database.password=YOUR_PASSWORD


   # Notizblock Helm Chart

Ein Helm Chart zur Bereitstellung einer containerisierten Notizblock-Anwendung mit Frontend, Backend und PostgreSQL-Datenbank in Kubernetes.

## Komponenten
- **Frontend:** React-Anwendung, bereitgestellt über NGINX.
- **Backend:** Node.js/Express-API mit PostgreSQL-Integration.
- **Datenbank:** PostgreSQL mit persistentem Speicher.

## Features
- **Ingress:** Zugriff über `my-app.local`.
- **Konfigurierbare Umgebungsvariablen:** Backend-URL und Datenbankzugang.
- **Datenpersistenz:** PostgreSQL mit Kubernetes-Secrets.

## Installation
1. **Hosts-Datei anpassen:**
   ```plaintext
   127.0.0.1 my-app.local

   helm install my-release ./my-notizblock-app-chart --namespace default \
     --set database.password=YOUR_PASSWORD

     helm install my-release ./my-notizblock-app-chart --namespace default -f values-secret.yaml

     helm upgrade my-release ./my-notizblock-app-chart --namespace default -f values-secret.yaml

     helm uninstall my-release --namespace default

     oder 

     kubectl delete secret -n default -l name=my-release

     ## Best Practices für values.yaml

1. **Keine sensiblen Daten speichern:**
   - Passwörter, API-Schlüssel und andere sensible Informationen sollten nicht direkt in der `values.yaml` gespeichert werden.
   - Verwende stattdessen Kubernetes-Secrets oder setze Werte zur Laufzeit mit `--set`.

2. **Strukturierte Werte verwenden:**
   - Organisiere die Werte in logischen Abschnitten (z. B. `frontend`, `backend`, `database`), um die Übersichtlichkeit zu erhöhen.

3. **Standardwerte bereitstellen:**
   - Definiere sinnvolle Standardwerte, um die Nutzung des Charts zu vereinfachen.

4. **Kommentare hinzufügen:**
   - Dokumentiere die Bedeutung der Werte direkt in der `values.yaml`, um die Konfiguration verständlicher zu machen.

---

## Anleitung: PostgreSQL Subchart einfügen

1. **Subchart hinzufügen:**
   - Füge das PostgreSQL-Chart als Abhängigkeit in die Datei `Chart.yaml` ein:
     ```yaml
     dependencies:
     - name: postgresql
       version: 16.7.8
       repository: https://charts.bitnami.com/bitnami
     ```

2. **Abhängigkeiten aktualisieren:**
   - Lade die Abhängigkeiten mit Helm:
     ```bash
     helm dependency update ./my-notizblock-app-chart
     ```

3. **Konfiguration anpassen:**
   - Passe die PostgreSQL-Einstellungen in der `values.yaml` an:
     ```yaml
     postgresql:
       auth:
         username: myuser
         password: mypassword
         database: mydatabase
     ```

4. **Chart installieren:**
   - Installiere das Chart mit den angepassten Werten:
     ```bash
     helm install my-release ./my-notizblock-app-chart --namespace default
     ```

     ![alt text](<Screenshot 2025-06-02 101626.png>) ![alt text](<Screenshot 2025-06-02 102837 - Kopie.png>) ![alt text](<Screenshot 2025-06-02 102837.png>) ![alt text](<Screenshot 2025-06-02 122956 - Kopie.png>) ![alt text](<Screenshot 2025-06-02 122956.png>) ![alt text](<Screenshot 2025-06-02 123434 - Kopie.png>) ![alt text](<Screenshot 2025-06-02 123434.png>) ![alt text](<Screenshot 2025-06-02 125111 - Kopie.png>) ![alt text](<Screenshot 2025-06-02 125111.png>) ![alt text](<Screenshot 2025-06-02 125352 - Kopie.png>) ![alt text](<Screenshot 2025-06-02 125352.png>) ![alt text](<Screenshot 2025-06-02 125400 - Kopie.png>) ![alt text](<Screenshot 2025-06-02 125400.png>) ![alt text](<Screenshot 2025-06-02 125758 - Kopie.png>) ![alt text](<Screenshot 2025-06-02 125758.png>) ![alt text](<Screenshot 2025-06-02 130507 - Kopie.png>) ![alt text](<Screenshot 2025-06-02 130507.png>) ![alt text](<Screenshot 2025-06-02 130514 - Kopie.png>) ![alt text](<Screenshot 2025-06-02 130514.png>) ![alt text](<Screenshot 2025-06-02 130527 - Kopie.png>) ![alt text](<Screenshot 2025-06-02 130527.png>) ![alt text](<Screenshot 2025-06-02 133727 - Kopie.png>) ![alt text](<Screenshot 2025-06-02 133727.png>) ![alt text](<Screenshot 2025-06-02 133845 - Kopie.png>) ![alt text](<Screenshot 2025-06-02 133845.png>) ![alt text](<Screenshot 2025-06-02 141615 - Kopie.png>) ![alt text](<Screenshot 2025-06-02 141615.png>) ![alt text](<Screenshot 2025-06-02 142428 - Kopie.png>) ![alt text](<Screenshot 2025-06-02 142428.png>) ![alt text](<Screenshot 2025-06-02 142437 - Kopie.png>) ![alt text](<Screenshot 2025-06-02 142437.png>) ![alt text](<Screenshot 2025-06-02 142857 - Kopie.png>) ![alt text](<Screenshot 2025-06-02 142857.png>) ![alt text](<Screenshot 2025-06-02 144823 - Kopie.png>) ![alt text](<Screenshot 2025-06-02 144823.png>) ![alt text](<Screenshot 2025-06-02 144833 - Kopie.png>) ![alt text](<Screenshot 2025-06-02 144833.png>) ![alt text](<Screenshot 2025-06-02 144845.png>) ![alt text](<Screenshot 2025-06-02 144857.png>) ![alt text](<Screenshot 2025-06-02 144907.png>) ![alt text](<Screenshot 2025-06-02 144916.png>) ![alt text](<Screenshot 2025-06-02 144926.png>) ![alt text](<Screenshot 2025-06-02 144936.png>) ![alt text](<Screenshot 2025-06-02 144946.png>) ![alt text](<Screenshot 2025-06-02 144955.png>) ![alt text](<Screenshot 2025-06-02 145005.png>) ![alt text](<Screenshot 2025-06-02 145013.png>) ![alt text](<Screenshot 2025-06-02 145021.png>) ![alt text](<Screenshot 2025-06-02 145027.png>) ![alt text](<Screenshot 2025-06-02 154151.png>) ![alt text](<Screenshot 2025-06-02 154524.png>) ![alt text](<Screenshot 2025-06-02 154608.png>) ![alt text](<Screenshot 2025-06-02 154735.png>) ![alt text](<Screenshot 2025-06-02 155328.png>) ![alt text](<Screenshot 2025-06-02 160418.png>) ![alt text](<Screenshot 2025-06-02 160500.png>) ![alt text](<Screenshot 2025-06-02 160537.png>) ![alt text](<Screenshot 2025-06-02 160937.png>) ![alt text](<Screenshot 2025-06-02 163344.png>)![alt text](<Screenshot 2025-06-02 170804.png>) ![alt text](<Screenshot 2025-06-02 170850.png>) ![alt text](<Screenshot 2025-06-02 170900.png>) ![alt text](<Screenshot 2025-06-02 170924.png>)

     ## Hinzufügen einer CI Pipline