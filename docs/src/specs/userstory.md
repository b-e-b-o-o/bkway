# User story

## 1. Algoritmus módosítása

| 1    | USER      | STORY                                                        |
| ---  | ---       |  ---                                                         |
|      | AS A      | Felhasználó                                                  |
|      | I WANT TO | Megváltoztatni a használt algoritmust                        |
|      | SO THAT   | Más algoritmusok vizualizációját tekintsem meg               |
|------|-----------|--------------------------------------------------------------|
| 1    | GIVEN     | Az "algoritmus" fül van kiválasztva                          |
|      | WHEN      | A legördülő menüben a **BFS algoritmust** választom          |
|      | THEN      | Az útvonaltervezés a **BFS algoritmussal** fog történni      |
| 1    | GIVEN     | Az "algoritmus" fül van kiválasztva                          |
|      | WHEN      | A legördülő menüben a **mohó algoritmust** választom         |
|      | THEN      | Az útvonaltervezés a **mohó algoritmussal** fog történni     |
| 1    | GIVEN     | Az "algoritmus" fül van kiválasztva                          |
|      | WHEN      | A legördülő menüben az **A\* algoritmust** választom          |
|      | THEN      | Az útvonaltervezés **A\* algoritmussal** fog történni         |
| 1    | GIVEN     | Az "algoritmus" fül van kiválasztva                          |
|      | WHEN      | A legördülő menüben a **Dijkstra algoritmust** választom     |
|      | THEN      | Az útvonaltervezés a **Dijkstra algoritmussal** fog történni |

| 2    | USER      | STORY                                                        |
| ---  | ---       |  ---                                                         |
|      | AS A      | Felhasználó                                                  |
|      | I WANT TO | Megváltoztatni a használt algoritmus paramétereit            |
|      | SO THAT   | Más paraméterekkel tekintsem meg az útvonaltervezést         |
|------|-----------|--------------------------------------------------------------|
| 1    | GIVEN     | Az "algoritmus" fül van kiválasztva                          |
|      | AND       | Az A\* algoritmus van kiválasztva                             |
|      | WHEN      | A "heuristika súlya" mezőben módosítom a súlyt               |
|      | THEN      | Az útvonaltervezés a választott súlyt fogja használni        |

<br>
<br>
<br>

## 2. Útvonal választása

| 2    | USER      | STORY                                                        |
| ---  | ---       |  ---                                                         |
|      | AS A      | Felhasználó                                                  |
|      | I WANT TO | Kiválasztani az tervezendő útvonalat                         |
|      | SO THAT   | Megtekinthetem az útvonaltervezést a választott útvonalon    |
|------|-----------|--------------------------------------------------------------|
| 1    | GIVEN     | Az "útvonal" fül van kiválasztva                             |
|      | WHEN      | Az "indulási idő" mezőben kiválasztok egy időt               |
|      | THEN      | Az induló járat a kiválasztott idő után fog indulni          |
| 2    | GIVEN     | Az "útvonal" fül van kiválasztva                             |
|      | WHEN      | Az "indulási állomás" mezőbe beírom egy állomás nevét        |
|      | THEN      | Az útvonaltervezés a kiválasztott állomástól fog indulni     |
| 3    | GIVEN     | Az "útvonal" fül van kiválasztva                             |
|      | WHEN      | Az "érkezési állomás" mezőbe beírom egy állomás nevét        |
|      | THEN      | Az útvonaltervezés a kiválasztott állomást fogja megkeresni  |

<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>

## 3. Tervezés animálása

| 3    | USER      | STORY                                                        |
| ---  | ---       |  ---                                                         |
|      | AS A      | Felhasználó                                                  |
|      | I WANT TO | Interaktívan megtekinteni a tervezett útvonalat              |
|      | SO THAT   | Láthatom az útvonaltervezés lépéseit                         |
|------|-----------|--------------------------------------------------------------|
| 1    | GIVEN     | A "tervezés" fül van kiválasztva                             |
|      | AND       | Válaszottam útvonalat és indulási időt                       |
|      | AND       | Az algoritmusnak még van hátralévő lépése                    |
|      | WHEN      | A "következő lépés" gombra kattintok                         |
|      | THEN      | Az algoritmus elvégzi a következő lépését                    |
| 2    | GIVEN     | A "tervezés" fül van kiválasztva                             |
|      | AND       | Válaszottam útvonalat és indulási időt                       |
|      | AND       | Az algoritmusnak még van hátralévő lépése                    |
|      | WHEN      | Az "animáció indítása" gombra kattintok                      |
|      | THEN      | Az algoritmus addig fut, amíg nem találja meg a cél állomást |
| 3    | GIVEN     | A "tervezés" fül van kiválasztva                             |
|      | AND       | A tervezés animációja folyamatban van                        |
|      | WHEN      | Az "animáció szüneteltetése" gombra kattintok                |
|      | THEN      | Az program további interakció nélkül nem végez több lépést   |
