'use strict';

function findDevice(homey, id) {
  return homey.drivers
    .getDriver('keyfob')
    .getDevices()
    .find((d) => d.getData().id === id) || null;
}

module.exports = {
  async getStatus({ homey, query }) {
    const device = findDevice(homey, query.deviceId);
    if (!device) throw new Error('Device not found');

    return {
      name: device.getName(),
      history: device.getPressHistory(),
    };
  },
};
