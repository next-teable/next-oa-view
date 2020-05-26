import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-system-customers-edit',
  templateUrl: './edit.component.html',
})
export class SystemCustomersEditComponent implements OnInit {
  record: any = {};
  organizationName = "";
  orgId = "";
  showDis = false;
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) { }

  ngOnInit(): void {
    if (this.record.id) {
      this.http.get(`/customers/${this.record.id}/detail`).subscribe(res => (this.record = res));
    }
  }

  save(value: any) {
    if (this.record.id) {
      this.http.post(`/customers/${this.record.id}/update`, value).subscribe(res => {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      });
    } else {
      value.parentId = this.orgId;
      this.http.post(`/customers/create`, value).subscribe(res => {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      });
    }

  }

  close() {
    this.modal.destroy();
  }
}
