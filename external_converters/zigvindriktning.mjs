// Zigbee2MQTT external converter for the IKEA VINDRIKTNING air quality sensor
// flashed with the zigvindriktning ESP32-H2 firmware.
//
// Clusters exposed by the firmware on EP1:
//   mspm25Measurement (0x042A)  → PM2.5 µg/m³
//   msCO2             (0x040D)  → eCO2 ppm  (ZCL stores fraction; ZHC converts ×1 000 000)
//   genAnalogInput    (0x000C)  → TVOC ppb  (presentValue attribute)
//
// Install: copy this file into your Z2M data directory and add the path
// to configuration.yaml under `external_converters:`.

import * as exposes from 'zigbee-herdsman-converters/lib/exposes.js';
import * as fz from 'zigbee-herdsman-converters/converters/fromZigbee.js';
import * as reporting from 'zigbee-herdsman-converters/lib/reporting.js';

const e  = exposes.presets;
const ea = exposes.access;

// TVOC arrives via the generic Analog Input cluster (presentValue in ppb).
const fz_tvoc = {
    cluster: 'genAnalogInput',
    type: ['attributeReport', 'readResponse'],
    convert: (model, msg, publish, options, meta) => {
        const val = msg.data['presentValue'];
        if (val != null) return { tvoc: Math.round(val) };
    },
};

const definition = {
    fingerprint: [
        { modelID: 'VINDRIKTNING', manufacturerName: 'ESP32-H2' },
    ],
    model: 'VINDRIKTNING',
    vendor: 'ESP32-H2',
    description: 'IKEA VINDRIKTNING air quality sensor (PM2.5 + CCS811 eCO2/TVOC) — ESP32-H2 Zigbee firmware',
    fromZigbee: [fz.pm25, fz.co2, fz_tvoc],
    toZigbee: [],
    exposes: [
        e.pm25(),
        e.co2(),
        exposes.numeric('tvoc', ea.STATE).withUnit('ppb').withDescription('Total VOC concentration'),
    ],
    configure: async (device, coordinatorEndpoint) => {
        const endpoint = device.getEndpoint(1);
        await reporting.bind(endpoint, coordinatorEndpoint, [
            'mspm25Measurement',
            'msCO2',
            'genAnalogInput',
        ]);
        await reporting.pm25(endpoint, { min: 60, max: 300, change: 1 });
        await reporting.co2(endpoint, { min: 60, max: 300, change: 0.0001 });
        await endpoint.configureReporting('genAnalogInput', [{
            attribute: 'presentValue',
            minimumReportInterval: 60,
            maximumReportInterval: 300,
            reportableChange: 10,
        }]);
    },
};

export default definition;
