import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-system-audit-logs-view',
  templateUrl: './view.component.html',
})
export class SystemAuditLogsViewComponent implements OnInit {
  record: any = {};

  constructor(private modal: NzModalRef, public msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    this.http.get(`/auditLogs/${this.record.id}`).subscribe(res => (this.record = res));
  }

  close() {
    this.modal.destroy();
  }
}
