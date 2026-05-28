"""ZHA quirk for zigvindriktning — IKEA VINDRIKTNING with ESP32-H2 Zigbee firmware.

Clusters on EP1:
  IN  0x0000  Basic
  IN  0x000C  AnalogInput     (TVOC in ppb via presentValue — read-only sensor)
  IN  0x042A  PM25            (PM2.5 µg/m³)
  IN  0x040D  CarbonDioxideConcentration  (eCO2 as fraction 0-1)
  OUT 0x0019  Ota

Install:
  Place this file in <config>/custom_zha_quirks/
  and set custom_quirks_path in configuration.yaml:
    zha:
      custom_quirks_path: /config/custom_zha_quirks
"""

from zigpy.quirks.v2 import QuirkBuilder, ReportingConfig
from zigpy.quirks.v2.homeassistant.sensor import SensorDeviceClass, SensorStateClass
from zigpy.zcl.clusters.general import AnalogInput

(
    QuirkBuilder("ESP32-H2", "VINDRIKTNING")
    .sensor(
        attribute_name="present_value",
        cluster_id=AnalogInput.cluster_id,
        endpoint_id=1,
        state_class=SensorStateClass.MEASUREMENT,
        device_class=SensorDeviceClass.VOLATILE_ORGANIC_COMPOUNDS_PARTS,
        unit="ppb",
        reporting_config=ReportingConfig(
            min_interval=60,
            max_interval=300,
            reportable_change=10,
        ),
        fallback_name="TVOC",
    )
    .add_to_registry()
)
