# Changelog

Historique des évolutions du firmware. Chaque version correspond à une mise à jour
`vAAAAMMJJ-HHMM` (date et heure de build).

<!--
Note maintenance (dev) : remplir la section [Unreleased] ci-dessous en langage utilisateur.
La CI la publie comme notes de release et remplace "[Unreleased]" par le vrai numéro de
version (voir .github/workflows/build.yml). Ne pas éditer la copie du repo OTA : régénérée.
-->

## v20260708-1143

### Changements
- **Code fabricant Zigbee : retour à `0x5097`** (c'est ziglinky qui bascule sur `0x5098`).
  Le parc existant, flashé en `0x5097`, retrouve donc l'OTA normalement — rien à faire.
  ⚠️ Seule exception : un appareil flashé avec l'éphémère release `v20260708-1130`
  (passée en `0x5098`) doit être reflashé une fois par USB avec cette version.

### Nouveautés
- **Mises à jour OTA fiables** : la mise à jour du firmware par Zigbee (sans fil) va
  désormais jusqu'au bout, même quand le signal radio est faible ou perturbé — plus besoin
  de démonter l'appareil pour le brancher en USB. Les versions précédentes sont à flasher via USB.
