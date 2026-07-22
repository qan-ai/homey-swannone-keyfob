import Homey from 'homey';

class SwannOneApp extends Homey.App {
  async onInit() {
    this._registerWidgetSettings();
    this.log('SwannOne Key Fob app initialised');
  }

  _registerWidgetSettings() {
    // The widget's device picker: settings of type `autocomplete` are fed from
    // the app, not from the widget itself.
    const widget = (this.homey as any).dashboards?.getWidget?.('status');
    if (!widget) return;

    widget.registerSettingAutocompleteListener('device', async (query: string) => {
      const needle = (query || '').toLowerCase();
      return this.homey.drivers
        .getDriver('keyfob')
        .getDevices()
        .map((device) => ({
          name: device.getName(),
          // Zigbee devices carry no `id` in their device data, so key on the
          // whole data object instead — an undefined id silently vanishes when
          // Homey persists the chosen item.
          id: JSON.stringify(device.getData()),
        }))
        .filter((item) => item.name.toLowerCase().includes(needle));
    });
  }
}

module.exports = SwannOneApp;
