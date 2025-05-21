## 1. Welche Methoden hast du gewählt und warum? 

Ich habe mich für Docker-Desktop entschieden, weil es einfach zu konfigurieren ist 
und Kubernetes direkt integriert hat. 

## 2. Was ist die Control-Plane eines Kubernetes-Clusters und ihre Rolle? 

Die Control-Plane verwaltet den Zustand des Clusters , orchestriert Deployments und überwacht die Nodes. 

## 3. Was ist die Rolle eines Worker Nodes?

Worker-Nodes führen die Container aus und stellen die Ressourcen für die Anwendung bereit. 

## 4.Mit welchem zentralen Bestandteil spricht Kubectl?

Kubectl kommuniziert direkt mit dem Api-Server der Control-Plane

## 5.

Was hast du überprüft, um zu sehen, ob Kubectl funktioniert?
Befehle:
-kubctl config current-context;
-kubctl get nodes;
-kubctl cluster-info

Erwartete Ausgaben:
Der aktuelle Kontext, Nodes mit Status Ready, Cluster Informationen; 

## 6.

Kernidee der deklarativen Philosophie von Kubernetes:
-Kubernetes verwaltet den gewünschten Zustand  (z.B. Anzahl der Pods) und 
paßt den aktuellen Zustand automatisch an. 

![alt text](<Screenshot 2025-05-21 214939.png>)
![alt text](<Screenshot 2025-05-21 214953.png>)

