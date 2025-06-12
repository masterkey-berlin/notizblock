 ## Reflexionsfragen

## Zweck der zwei Stages (Builder/Runner):
Builder: Enthält alle Build-Tools und Abhängigkeiten (Node.js, npm, devDependencies). Erstellt das optimierte Produktions-Artefakt (den dist-Ordner).
## Runner: Eine minimale, schlanke Umgebung (Nginx) nur mit dem Produktions-Artefakt.
Vorteile für CI/CD:
Kleinere finale Images: Nur das Nötigste ist im Runner-Image, was Speicherplatz spart und die Angriffsfläche reduziert.
Schnellere Deployments: Kleinere Images werden schneller übertragen und gestartet.
Bessere Sicherheit: Keine Build-Tools oder unnötigen Abhängigkeiten im Produktions-Image.
Sauberere Build-Umgebung: Änderungen in der Runner-Umgebung beeinflussen den Build-Prozess nicht und umgekehrt.
Sichere Speicherung von Docker Hub Credentials:
Als Secrets in den GitHub Repository Settings (Actions Secrets).
Warum sicherer: Secrets werden verschlüsselt gespeichert und sind nicht direkt im Code oder in Logs sichtbar. Sie werden nur zur Laufzeit der Pipeline sicher in die Umgebungsvariablen der Runner injiziert. Direkt im Code wären sie für jeden mit Lesezugriff auf das Repo sichtbar.
Abfolge der vier Hauptschritte der Pipeline:
Code holen (actions/checkout@v4): Lädt den aktuellen Stand des Repository-Codes in die CI-Umgebung.
Image bauen (docker/build-push-action@v5 - Build-Teil): Verwendet das Dockerfile, um die React-Anwendung zu kompilieren und in ein Docker-Image zu packen.
Login (docker/login-action@v3): Authentifiziert sich sicher bei Docker Hub unter Verwendung der gespeicherten DOCKERHUB_USERNAME und DOCKERHUB_TOKEN Secrets.
Image pushen (docker/build-push-action@v5 - Push-Teil): Lädt das zuvor gebaute und getaggte Docker-Image in die Docker Hub Registry hoch.
Verwendete Image-Tags und Wichtigkeit eindeutiger Tags:
Verwendet: latest (für den aktuellen Stand des Hauptbranches) UND <git-commit-sha> (eindeutig für jeden Commit).
Wichtigkeit: Eindeutige Tags (wie der Commit SHA) ermöglichen es, exakt nachzuvollziehen, welcher Code-Stand zu welchem Image gehört. Das ist entscheidend für:
Rollbacks: Man kann bei Problemen gezielt zu einer älteren, funktionierenden Image-Version zurückkehren.
Reproduzierbarkeit: Man kann genau das Image für Tests oder Deployments verwenden, das zu einem bestimmten Zeitpunkt gebaut wurde.
Debugging: Erleichtert die Fehlersuche, wenn man weiß, welcher Code im fehlerhaften Image enthalten ist.
Vermeidung von Überschreibungen von "stabilen" Versionen durch latest.
Fehlersuche bei fehlgeschlagenem Push:
CI-Logs prüfen: Detaillierte Fehlermeldungen im Log des "Login to Docker Hub" oder "Build and push Docker image" Schritts ansehen.
Secrets überprüfen (in GitHub Settings):
Sind die Secret-Namen in der YAML-Datei korrekt geschrieben (${{ secrets.DOCKERHUB_USERNAME }}, ${{ secrets.DOCKERHUB_TOKEN }})?
Sind die Secret-Werte korrekt in GitHub hinterlegt (korrekter Username, gültiges und nicht abgelaufenes Token)? Ggf. Token neu generieren und Secret aktualisieren.
Hat das Access Token die notwendigen "Write"-Berechtigungen auf Docker Hub?
Docker Hub Repository-Name/Tags prüfen: Ist der Image-Name im tags-Feld korrekt formatiert (deinUsername/repoName:tag)?
Netzwerkprobleme/Docker Hub Status: Selten, aber möglich: Gibt es temporäre Probleme mit Docker Hub oder der Netzwerkverbindung des CI-Runners?
Build-Fehler: Schlägt vielleicht schon der docker build fehl, bevor es zum Push kommt? Dann die Build-Logs genauer ansehen.