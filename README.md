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

