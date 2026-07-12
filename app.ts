import Homey from 'homey';

class SwannOneApp extends Homey.App {
  async onInit() {
    this.log('SwannOne Key Fob app initialised');
  }
}

module.exports = SwannOneApp;
