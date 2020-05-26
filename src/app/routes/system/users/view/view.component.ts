import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-users-curd-view',
  templateUrl: './view.component.html',
})
export class UsersCurdViewComponent implements OnInit {
  record: any = {};
  i: any;

  constructor(private modal: NzModalRef, public msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    this.http.get(`/sysusers/${this.record.id}`).subscribe(res => (this.i = res));
  }

  close() {
    this.modal.destroy();
  }
}
