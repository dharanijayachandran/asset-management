import { CommProtocol } from './commprotocol';
import { CommProtocolParam } from './commProtocolParam';

export class CommProtocolParamGroup {
    id: number;
    commProtocolId: number;
    commProtocolParamLevel: string;
    name: string;
    description: string;
    displayOrder: number;
    status: string;
    commProtocolParams: CommProtocolParam[];
    commProtocol: CommProtocol;
}