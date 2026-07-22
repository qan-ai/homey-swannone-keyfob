'use strict';

function findDevice(homey, deviceId, deviceName) {
  const devices = homey.drivers.getDriver('keyfob').getDevices();

  if (deviceId) {
    const byId = devices.find((d) => JSON.stringify(d.getData()) === deviceId);
    if (byId) return byId;
  }

  // Fallback for widgets configured before the id was stored, and for the
  // case where Homey only persisted the item's name.
  if (deviceName) {
    const byName = devices.find((d) => d.getName() === deviceName);
    if (byName) return byName;
  }

  return null;
}

module.exports = {
  async getStatus({ homey, query, body }) {
    // Depending on how the widget frontend passes them, these land in either
    // the query string or the body.
    const source = { ...(query || {}), ...(body || {}) };

    const device = findDevice(homey, source.deviceId, source.deviceName);
    if (!device) throw new Error(homey.__('device_missing'));

    return {
      name: device.getName(),
      history: device.getPressHistory(),
    };
  },
};
