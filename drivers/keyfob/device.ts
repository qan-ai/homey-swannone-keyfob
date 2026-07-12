import { ZigBeeDevice } from 'homey-zigbeedriver';
import { ZCLNode } from 'zigbee-clusters';
import { ArmCommandArgs, KeyFobBoundIasAceCluster } from '../../lib/ClusterIasAce';

// zigbee-clusters' enum8 parses to the ARM_MODES *key name* (e.g.
// "armNightSleepZones"), not its numeric value — hence keying by name here.
// Confirmed via raw-command logging on real hardware: this fob's Home
// button sends armMode="disarm", not "armDayHomeZones" as the ZCL naming
// would suggest.
const ARM_MODE_TRIGGER: Record<string, string> = {
  disarm: 'key_home',
  armNightSleepZones: 'key_sleep',
  armAllZones: 'key_away',
};

// Endpoint the fob sends its ssIasAce commands on. Single-endpoint device,
// so this is virtually always 1 — if pairing logs (via printNode() below)
// show otherwise, adjust here.
const IAS_ACE_ENDPOINT_ID = 1;

class SwannOneKeyFobDevice extends ZigBeeDevice {
  async onNodeInit({ zclNode }: { zclNode: ZCLNode }) {
    this.enableDebug();
    this.printNode();

    const bound = new KeyFobBoundIasAceCluster({
      onArm: (args: ArmCommandArgs) => this._onArm(args),
      onPanic: () => this._onPanic(),
    });

    zclNode.endpoints[IAS_ACE_ENDPOINT_ID].bind('iasACE', bound);
    this.log(`Bound iasACE on endpoint ${IAS_ACE_ENDPOINT_ID}`);
  }

  _onArm(args: ArmCommandArgs) {
    const triggerId = ARM_MODE_TRIGGER[args.armMode];
    if (!triggerId) {
      this.log('Received arm command with unhandled armMode', args.armMode);
      return;
    }
    this.log('Button pressed:', triggerId);
    this.homey.flow
      .getDeviceTriggerCard(triggerId)
      .trigger(this)
      .catch(this.error);
  }

  _onPanic() {
    this.log('Button pressed: key_panic');
    this.homey.flow
      .getDeviceTriggerCard('key_panic')
      .trigger(this)
      .catch(this.error);
  }
}

module.exports = SwannOneKeyFobDevice;
