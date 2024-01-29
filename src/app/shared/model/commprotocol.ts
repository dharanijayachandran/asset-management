import { CommProtocolParamGroup } from './commProtocolParamGroup';

export class CommProtocol {
    id: number;
    name: string;
    status: String;
    description: String;
    commProtocolLevel: String;
    commProtocolParamGroups: CommProtocolParamGroup[];
}