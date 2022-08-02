# Walking And Sponsoring (version 2)

## Setup

### 1. Herunterladen
Entweder mit [git](https://git-scm.com/downloads) clonen
```sh
git clone https://github.com/semklauke/was-v2.git 
```
Oder mit dem Grünen Knopf "clone or download" klicken und dann auf "Download ZIP"

### 2. Installieren
Um den Server laufen zu lassen braucht man
- node.js, npm, python3 (min 3.6), c++ compiler

Der beste weg für Windows das alles zu installeren ist:
1. Node.JS von hier https://nodejs.org/en/download/ installieren.
2. Dann die commandline prompt (Cmd.exe) als **Administrator** ausführen und in den Ordner von diesem Projekt gehen (default was-v2)
3. Ausführen:
```sh
npm install --global --production windows-build-tools
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Das kann gerne 5 minuten oder mehr brauchen. Also abwarten, auch wenn scheinbar nix passiert.

4. Ausführen, der reihe nach:
```sh
npm install
npm run ssl
npm run frontend-setup
```

### 3. Konfiguration
Die Voreingestellten Settings sollten passen, aber gerade für die IP Addressen sollte in die Config geschaut werden.
 Die Config kann angepasst werden in der Datei *src/includes/config.ts*

Alternative kann man interaktiv die config bearbeiten mit dem Befehl
```sh
npm run config
```
Siehe **Settings** für eine Erklärung der einzelnen Einstellungen.


### 4. Routing

Die default IP Adresse ist `0.0.0.0` bzw. IPv6 `[::]`<br />
Damit ist es möglich, dass Rechner inerhlab des lokalen netzwerk auf die webseite zugreifen.<br />
Dazu müssen sie die IP (v4 oder v6) Adresse des Rechners eingeben, auf dem der Server läuft.<br />
(Mit dem Befehl `ipconfig` auf windows kann man seine IP Adresse herausfinden)<br />
Im Browser muss dann eingegeben werden:  [https://IP_ADRESSE](https://IPADRESSE)<br />
WICHTIG hierbei ist das *https* und nicht *http* ( bzw. geht auch http wenn das in der config so eingestellt wurde)<br /><br />
##### Lokal
Auf dem Rechner wo der Server läuft muss auch seine IP Adresse angegeben werden.<br />
Um die Webseite nur lokal auf seinem eignen rechner verfügbar zu machen, muss man in der config die ipv4 Adresse auf `127.0.0.1` und die ipv6 Adresse auf `::1` setzten.<br />
Dann kann man darauf mit [https://localhost](https://localhost) zugreifen.



### 5. Starten
Mit
```sh
npm start
```
Wird der Server gestartet und man Sieht den log Output in der Konsole. Nicht schließen!!! 
Um zu stopen, die Cmd.exe schließen oder CTRL+C sollte auch funktionieren (evtl mehr als einmal drücken)


## Settings

In der Datein `src/includes/config.ts` stehen schon gute Kommentare, die die Funktion der Einstellungen erklären.

`db`<br />
Die Daten werden in einer Sqlite3 Datenbank gespeichert. Diese besteht aus einer Datei.
Hier wird der name dieser Datei eingegeben<br />
*Default:* laeufer.db

`log_folder`<br />
Alles was auf dem Server passiert wird gespeichert um im Nachhinein Fehler vom Server oder der Bediehung zu indentifizieren und zu beheben. Hier wird der Ordner eingestellt, in dem diese 'log *Default:* log


## Bediehung

TODO :)

Hier sollen ein paar Bedien Tipps stehen, aber eigentlich sollte alles selbserklärend sein.

## Rollback funktion.

Jede aktion die im System von einem Benutzer ausgeführt wird, wird mitgespeichert.
Dies ermöglicht es jede Veränderung wieder restlos rückgängig zu machen.
Sollte z.B bei einem Läufer richtige Daten mit falschen Daten überschrieben worden sein, und man weiß nicht mehr was die richtigen Daten sind, kann man ganz einfach mit einem rollback die Daten dieses einen Läufers auf diesen Zeitpunkt zurücksetzen (rollback).  <br />

Die Aktionen können auch nach Auslöser gefiltert werden. Weiß man z.B das User1234 nur blödsinn gemacht hat, kann man all seine Aktionen rückgängig machen

## Development Enviorment

TODO :)

Ich möchte hier ein paar dinge zu der Entwicklungsumgebung sagen und was man können muss, um dieses Projekt zu erweitern.


## Database schema

Die Datenbank ist eine SQLite3 Datenbank. Das schema kann in dem Orderner **migrations** naschgeschlagen werden. 
Wichtig ist vor allem `001-init.sql`, die anderen Dateien kümmern sich um das interne logging und Rollback.