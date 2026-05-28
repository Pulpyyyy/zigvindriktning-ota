"""ZHA quirk for zigvindriktning — IKEA VINDRIKTNING with ESP32-H2 Zigbee firmware.

Clusters on EP1:
  IN  0x0000  Basic
  IN  0x000C  AnalogInput     (TVOC in ppb via presentValue)
  IN  0x042A  PM25            (PM2.5 µg/m³)
  IN  0x040D  CarbonDioxideConcentration  (eCO2 as fraction 0-1)
  OUT 0x0019  Ota

Install:
  Place this file in <config>/custom_zha_quirks/
  and set custom_quirks_path in configuration.yaml:
    zha:
      custom_quirks_path: /config/custom_zha_quirks
"""

from zhaquirks import CustomDevice
from zhaquirks.const import (
    ENDPOINTS,
    INPUT_CLUSTERS,
    MODELS_INFO,
    OUTPUT_CLUSTERS,
    PROFILE_ID,
    DEVICE_TYPE,
)
from zigpy.profiles import zha
from zigpy.zcl.clusters.general import Basic, Ota, AnalogInput
from zigpy.zcl.clusters.measurement import (
    PM25,
    CarbonDioxideConcentration,
)


class Vindriktning(CustomDevice):
    """IKEA VINDRIKTNING (PM2.5 + CCS811 eCO2/TVOC) — zigvindriktning ESP32-H2 firmware."""

    signature = {
        MODELS_INFO: [("ESP32-H2", "VINDRIKTNING")],
        ENDPOINTS: {
            1: {
                PROFILE_ID: zha.PROFILE_ID,
                DEVICE_TYPE: 0x0302,
                INPUT_CLUSTERS: [
                    Basic.cluster_id,                       # 0x0000
                    AnalogInput.cluster_id,                 # 0x000C — TVOC ppb
                    PM25.cluster_id,                        # 0x042A
                    CarbonDioxideConcentration.cluster_id,  # 0x040D
                ],
                OUTPUT_CLUSTERS: [
                    Ota.cluster_id,  # 0x0019
                ],
            }
        },
    }

    replacement = {
        ENDPOINTS: {
            1: {
                PROFILE_ID: zha.PROFILE_ID,
                DEVICE_TYPE: 0x0302,
                INPUT_CLUSTERS: [
                    Basic.cluster_id,
                    AnalogInput.cluster_id,
                    PM25.cluster_id,
                    CarbonDioxideConcentration.cluster_id,
                ],
                OUTPUT_CLUSTERS: [
                    Ota.cluster_id,
                ],
            }
        },
    }
