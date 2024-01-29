import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlarmConfigService {
  apiURL = environment.baseUrl_AlarmManagement;
  constructor(private http: HttpClient) { }

  getAlarmConfig(id, organizationId): any {
    return this.http.get<any[]>(this.apiURL + "organizations/" + organizationId + "/alarm/" + id + "/alarm-configurations");
  }

  deleteAlarmConfig(id: number, userId: Number): any {
    return this.http.delete<any>(this.apiURL + 'alarmConfigWithNotificationDetails/' + id + '/' + userId);
  }

  getAlarmConfigById(id: number) {
    return this.http.get<any>(this.apiURL + "alarmConfig/" + id);
  }
}
