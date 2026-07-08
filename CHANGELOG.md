# Changelog

Historique des évolutions du firmware. Chaque version correspond à une mise à jour
`vAAAAMMJJ-HHMM` (date et heure de build).

<!--
Note maintenance (dev) : remplir la section [Unreleased] ci-dessous en langage utilisateur.
La CI la publie comme notes de release et remplace "[Unreleased]" par le vrai numéro de
version (voir .github/workflows/build.yml). Ne pas éditer la copie du repo OTA : régénérée.
-->

## v20260708-1131

### Changements
- **Identifiant fabricant Zigbee dédié (`0x5098`)** : l'appareil partageait par erreur
  le code de ziglinky (`0x5097`). ⚠️ Les appareils déjà flashés avec une version
  précédente ne verront pas cette mise à jour en OTA (l'index OTA ne correspond plus) :
  cette version est à flasher une fois par USB, les suivantes repasseront par l'OTA.

### Nouveautés
- **Mises à jour OTA fiables** : la mise à jour du firmware par Zigbee (sans fil) va
  désormais jusqu'au bout, même quand le signal radio est faible ou perturbé — plus besoin
  de démonter l'appareil pour le brancher en USB. Les versions précédentes sont à flasher via USB.
