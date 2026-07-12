import Homey from 'homey';

class SwannOneKeyFobDriver extends Homey.Driver {
  async onInit() {
    this.log('SwannOne Key Fob driver initialised');
  }
}

module.exports = SwannOneKeyFobDriver;
