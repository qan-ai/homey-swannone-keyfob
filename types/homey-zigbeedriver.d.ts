// homey-zigbeedriver ships no type declarations of its own; this is a
// minimal shim covering only what this app actually uses.
declare module 'homey-zigbeedriver' {
  import Homey from 'homey';
  import { ZCLNode } from 'zigbee-clusters';

  export class ZigBeeDevice extends Homey.Device {
    onNodeInit(args: { zclNode: ZCLNode; node: unknown }): Promise<void> | void;
    enableDebug(): void;
    printNode(): void;
    [key: string]: any;
  }

  export class ZigBeeDriver extends Homey.Driver {
    [key: string]: any;
  }
}
