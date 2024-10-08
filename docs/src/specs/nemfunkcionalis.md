# Nem funkcionális követelmények

## Termék követelmények

### Hatékonyság

- A szoftver kezdeti megnyitásakor legkésőbb 5 másodperc alatt teljesen betöltődik és használhatóvá válik
- A szoftver általános használat közben folyatosan, megakadás közben fut egy középkategóriás számítógépen, egy modern böngészőben
  - Kivétel ez alól az animált útvonaltervezés, amelynek a futása közben a szoftver akadozhat, de nem annyira, hogy használhatatlanná váljon, vagy megakadályozza az animáció leállítását
- A backend válaszideje API hívásokra gyors (pl. helyi) kapcsolat esetén nem több, mint 500 ezredmásodperc (bármilyen lehetséges, érvényes API hívásra)
- A szoftver felhasználói bevitelre adott válasz ideje nem több, mint 100 ezredmásodperc
  - Ebbe beleértendő a betöltést jelző válasz, amíg az alkalmazás API hívásokra várakozik
- A szoftver nem használ a szükségesnél több processzorkapacitást (pl. nem használja processzortól függetlenül az összes elérhető teljesítményt)

### Megbízhatóság

- A szoftverben ne legyen olyan egyszerűen előidézhető vagy gyakran bekövetkező hibajelenség, ami előfordulása esetén ellehetetleníti vagy jelentősen megnehezíti a szoftver használatát

### Biztonság

- Nem releváns, a szoftver nem kezel személyes vagy védett adatot

### Hordozhatóság

- A szoftver kliens oldala bármilyen WebGL-t támogató modern böngészőben fut, különös tekintettel a Chromium alapú böngészőkre
- A szoftver a kliens oldalon állandó, stabil internetkapcsolatot és a szerverrel való kapcsolatatot igényel
- A szoftver szerver oldala az adatok letöltéséhez stabil internetkapcsolatot igényel, ezt követően csak a klienssel szükséges kommunikálnia

### Felhasználhatóság

- A szoftver kliens oldalának a használatához nem szükséges külön telepítés, komoly számítógépes tapasztalattal nem rendelkező felhasználók számára is egyértelmű
- A weboldal felülete egy átlagos számítógéphasználó számára külső segítség nélkül elsajátítható, amennyiben ismerik a szoftver által bemutatott útkereső algoritmusokat
- A szoftver szerver oldalának az üzemeltetése hálózati és Docker-compose ismeretségeket igényel

## Menedzselési követelmények

### Környezeti

- A szoftver kliens oldalon egy egeret és egy billentyűzetet igényel
- A szoftver szerver oldalának a futtatásához legalább egy középkategóriás számítógépnek megfelelő harver szükséges, eltekintve a perifériáktól

### Működési

- A szoftver legfeljebb egy órás összefüggő időtartamokban lesz használva a kliens oldalon
- A szerver oldalon a szoftver folyamatosan fut, legfeljebb 4-5 naponta lehet szükséges karbantartási műveleteket végezni rajta, pl. a szoftver újraindítása (eltekintve az adatforrások frissítésétől)

### Fejlesztési

- Frontenden Node.js, React, TypeScript
  - Térkép és adatok megjelenítéséhez deck.gl, react-map-gl
- Backenden Node.js, Express, TypeScript
  - REST API szerver
  - SQLite adatbázis
  - Adatok importálásához node-GTFS
- Visual Studio Code fejlesztői környezet
- Docker
- 64-bit architektúra
- Verziókezeléshez Git kliens

### Fenntartási

- Minden API végpont teljes mértékben dokumentálva és tesztelve van

## Külső követelmények

- A szoftverhez felhasznált külső forrásból származó médiafájlok jogtiszták
- A szoftver nem tartalmaz erkölcsileg megkérdőjelezhető, sértő tartalmat
