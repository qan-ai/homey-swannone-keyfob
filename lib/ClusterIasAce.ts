import { Cluster, BoundCluster, ZCLDataTypes } from 'zigbee-clusters';

/**
 * The SwannOne Key Fob implements the client role of the IAS Ancillary Control
 * Equipment (ssIasAce / cluster 0x0501) cluster: it sends `arm` and `panic`
 * commands to whatever acts as the security panel (here: Homey), it never
 * receives commands. zigbee-clusters ships a stub for this cluster (no
 * commands defined), so it is redefined here with the two commands this
 * device actually uses. Re-registering under the same ID/NAME overwrites the
 * stub (last registration wins, see zigbee-clusters' Cluster.addCluster).
 *
 * Verified against zigbee-herdsman-converters' `swann.ts` definition for
 * SWO-KEF1PA, which decodes the same two ssIasAce commands and (like this
 * driver) never sends an ArmResponse back to the fob.
 */
export const ARM_MODES = {
  disarm: 0x00,
  armDayHomeZones: 0x01,
  armNightSleepZones: 0x02,
  armAllZones: 0x03,
} as const;

const COMMANDS = {
  // The spec also defines a trailing `code` and `zoneId`, but this driver
  // doesn't use either, so they're left unparsed.
  arm: {
    id: 0x00,
    direction: Cluster.DIRECTION_CLIENT_TO_SERVER,
    args: {
      armMode: ZCLDataTypes.enum8(ARM_MODES),
    },
  },
  panic: {
    id: 0x04,
    direction: Cluster.DIRECTION_CLIENT_TO_SERVER,
  },
};

class IASACECluster extends Cluster {
  static get ID() {
    return 1281;
  }

  static get NAME() {
    return 'iasACE';
  }

  static get COMMANDS() {
    return COMMANDS;
  }
}

Cluster.addCluster(IASACECluster);

// zigbee-clusters' enum8 parses to the matching ARM_MODES key name, not the
// underlying numeric value.
export interface ArmCommandArgs {
  armMode: keyof typeof ARM_MODES;
}

interface KeyFobBoundIasAceHandlers {
  onArm: (args: ArmCommandArgs) => void;
  onPanic: () => void;
}

/**
 * Homey-side implementation of the ssIasAce cluster: this is what actually
 * receives the fob's `arm`/`panic` commands once bound to the node's
 * endpoint (see device.ts). Method names must match the COMMANDS keys above.
 */
export class KeyFobBoundIasAceCluster extends BoundCluster {
  private readonly _onArm: (args: ArmCommandArgs) => void;
  private readonly _onPanic: () => void;

  constructor({ onArm, onPanic }: KeyFobBoundIasAceHandlers) {
    super();
    this._onArm = onArm;
    this._onPanic = onPanic;
  }

  arm(args: ArmCommandArgs) {
    this._onArm(args);
  }

  panic() {
    this._onPanic();
  }
}
