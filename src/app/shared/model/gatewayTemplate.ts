import { DataProtocol } from './dataProtocol';
import { GatewayModel } from './gateway-model';
import { GatewayCommProtocol } from './gatewayCommProtocol';
import { GatewayType } from './gatewayType';

export class GatewayTemplate {

    id: any;
    businessEntityId: number;
    name: string;
    created_by: string;
    createdOn: any;
    updated_by: number;
    gatewayModelId: number
    gatewayTypeId: number;
    timeZoneId: string;
    dataProtocolId: number;
    gatewayModel: GatewayModel;
    dataProtocol: DataProtocol;
    gatewayCommProtocols: GatewayCommProtocol[];
    gatewayType: GatewayType;
    status: string;
}