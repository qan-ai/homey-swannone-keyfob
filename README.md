# SwannOne Key Fob

Homey app for the Swann SwannOne Key Fob (SWO-KEF1PA) — a Zigbee 4-button
remote (Home, Sleep, Away, Panic) originally sold as part of the SwannOne
security system. This app lets you use it as a standalone Zigbee remote in
Homey, with no SwannOne hub required.

There is no official Homey integration for this device. This app was built
by reverse-engineering the Zigbee IAS Ancillary Control Equipment (`ssIasAce`,
cluster `0x0501`) commands the fob sends.

## Features

- Pair the fob directly to Homey over Zigbee.
- Four flow triggers, one per button:
  - Home button pressed
  - Sleep button pressed
  - Away button pressed
  - Panic button pressed

## Pairing

1. In the Homey app: **Devices → Add device → SwannOne Key Fob**.
2. Hold the pairing button on the back of the fob until the LED flashes,
   then release. Keep the fob close to Homey while it's discovered.

## Technical notes

The fob acts as the Zigbee **client** of the `ssIasAce` cluster — it sends
`Arm` and `Panic` commands to whatever plays the security-panel role (here:
Homey), rather than exposing readable state. This app implements the
Homey-side (server) half of that cluster via a
[`BoundCluster`](https://github.com/athombv/node-zigbee-clusters), since
Homey's `zigbee-clusters` library ships only an empty stub for `ssIasAce`.

One quirk found on real hardware: the **Home** button sends
`armMode="disarm"`, not `armMode="armDayHomeZones"` as the Zigbee HA command
naming would suggest. The Sleep and Away buttons map to `armNightSleepZones`
and `armAllZones` as expected.

## License

MIT
