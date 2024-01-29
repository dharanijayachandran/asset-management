import { AlarmConfig } from './AlarmConfig';
import { AlarmStateNotificationConfig } from './alarmStateNotificationConfig';

export class AlarmNotificationConfig {
    id: number;
    alarmConfigId: number;
    notificationMediaId: number;
    notificationGroupId: number;
    // NotificationMedia notificationMedia;
    alarmConfig: AlarmConfig;
    alarmStateNotificationConfigs: AlarmStateNotificationConfig[];
    status: string;
    createdBy: number;
    updatedBy:number;
    isAssign: boolean;
    notificationMediaName: string;
    notificationGroupName: string;
}