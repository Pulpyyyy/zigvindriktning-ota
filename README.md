# zigvindriktning — Câblage, GPIO & Flashage

Firmware ESP32-H2 Zigbee pour le capteur IKEA VINDRIKTNING (PM2.5 + CCS811 eCO2/TVOC).

---

## GPIO utilisés (ESP32-H2 Super Mini)

| GPIO | Rôle | Sens |
|------|------|------|
| GPIO 4  | I²C SDA — CCS811 | IN/OUT |
| GPIO 5  | I²C SCL — CCS811 | OUT |
| GPIO 8  | LED RGB WS2812 (intégrée VINDRIKTNING) | OUT |
| GPIO 9  | Bouton BOOT — reset usine (maintenir 5 s) | IN |
| GPIO 11 | UART RX — pad ISPDA du PM1006 | IN |
| GPIO 6/7, 15–21 | Flash MSPI interne — ne pas utiliser | — |
| GPIO 26/27 | USB D−/D+ natif — ne pas utiliser | — |

---

## Schéma de câblage

### PM1006 (PM2.5) — déjà présent dans le VINDRIKTNING

```
VINDRIKTNING PCB            ESP32-H2 Super Mini
─────────────────           ───────────────────
  ISPDA pad       ─────────── GPIO 11   (RX)
  GND             ─────────── GND
  5 V             ─────────── 5 V  (pin VIN/5V du module)
```

> Soudure sur le pad ISPDA du PCB VINDRIKTNING. Pas de résistance nécessaire —
> le signal est 5 V mais GPIO 11 de l'H2 est 5 V-tolérant en entrée.

---

### CCS811 (eCO2 + TVOC) — module à ajouter

```
Module CCS811               ESP32-H2 Super Mini
─────────────────           ───────────────────
  VCC (3.3 V)    ─────────── 3.3 V
  GND            ─────────── GND
  SDA            ─────────── GPIO 4
  SCL            ─────────── GPIO 5
  nWAKE          ─────────── GND   (actif en permanence)
  INT            ─  (non connecté)
  RESET          ─  (non connecté)
  ADD            ─  (non connecté → adresse I²C 0x5A)
```

> Pull-ups internes activés dans le firmware (100 kΩ). Des résistances externes
> de 4,7 kΩ sont recommandées si la longueur du câble dépasse 10 cm.

---

## Adresses flash — ESP32-H2 (Flash 4 MB)

| Partition    | Offset      | Taille    | Fichier build |
|--------------|-------------|-----------|---------------|
| Bootloader   | `0x000000`  | —         | `build/bootloader/bootloader.bin` |
| Table parts  | `0x008000`  | —         | `build/partition_table/partition-table.bin` |
| NVS          | `0x009000`  | 24 Ko     | *(données runtime)* |
| PHY init     | `0x00F000`  | 4 Ko      | *(données RF)* |
| OTA data     | `0x010000`  | 8 Ko      | *(sélecteur de slot)* |
| zb_storage   | `0x012000`  | 64 Ko     | *(réseau Zigbee)* |
| zb_fct       | `0x022000`  | 4 Ko      | *(calibration Zigbee)* |
| **factory**  | **`0x030000`** | **768 Ko** | **`build/zigvindriktning.bin`** |
| ota_0        | `0x0F0000`  | 768 Ko    | *(slot OTA A)* |
| ota_1        | `0x1B0000`  | 768 Ko    | *(slot OTA B)* |

---

## Flashage initial

### Via idf.py (méthode recommandée)

```bash
idf.py -p /dev/ttyUSB0 flash
```

### Via esptool.py (binaires pré-compilés)

```bash
esptool.py --chip esp32h2 --port /dev/ttyUSB0 --baud 921600 \
    write_flash \
    0x000000 bootloader.bin \
    0x008000 partition-table.bin \
    0x030000 zigvindriktning.bin
```

Sur Windows, remplacer `/dev/ttyUSB0` par `COM3` (ou le port affiché dans le Gestionnaire de périphériques).

### Reset usine (Zigbee)

Maintenir le bouton BOOT (GPIO 9) pendant **5 secondes** → LED rouge clignotante → relâcher.
Cela efface les partitions `zb_storage`, `zb_fct` et `nvs`.

---

## Intégration Zigbee2MQTT

Copier `external_converters/vindriktning.mjs` dans le dossier de données Z2M,
puis ajouter dans `configuration.yaml` :

```yaml
external_converters:
  - vindriktning.mjs
```

Redémarrer Z2M. Le device expose : **pm25**, **co2** (ppm), **tvoc** (ppb).

## Intégration ZHA (Home Assistant)

Copier `zha_quirks/vindriktning.py` dans `<config>/custom_zha_quirks/`,
puis dans `configuration.yaml` :

```yaml
zha:
  custom_quirks_path: /config/custom_zha_quirks
```

Redémarrer HA puis supprimer/ré-appairer le device si déjà présent.
