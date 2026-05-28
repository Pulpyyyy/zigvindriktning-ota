// Zigbee2MQTT external converter for the IKEA VINDRIKTNING air quality sensor
// flashed with the zigvindriktning ESP32-H2 firmware.
//
// Clusters exposed by the firmware:
//   EP1 — pm25Measurement   (0x042A)  → PM2.5 µg/m³
//         msCO2             (0x040D)  → eCO2 ppm  (ZCL fraction × 1 000 000 → ppm)
//         genAnalogInput    (0x000C)  → TVOC ppb  (presentValue attribute)

import * as m from 'zigbee-herdsman-converters/lib/modernExtend';
import * as exposes from 'zigbee-herdsman-converters/lib/exposes';

const ea = exposes.access;

export default {
    fingerprint: [
        { modelID: 'VINDRIKTNING', manufacturerName: 'ESP32-H2' },
    ],
    model: 'VINDRIKTNING',
    vendor: 'ESP32-H2',
    description: 'IKEA VINDRIKTNING air quality sensor (PM2.5 + CCS811 eCO2/TVOC) — ESP32-H2 Zigbee firmware',
    ota: true,
    extend: [
        m.pm25(),
        m.co2(),
        m.numeric({
            name: 'voc_parts',
            cluster: 'genAnalogInput',
            attribute: 'presentValue',
            unit: 'ppb',
            description: 'Total VOC concentration',
            access: ea.STATE,
            reporting: { min: 60, max: 300, change: 10 },
        }),
    ],
};
