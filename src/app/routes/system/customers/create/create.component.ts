import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-system-customers-create',
  templateUrl: './create.component.html',
})
export class SystemCustomersCreateComponent implements OnInit {
  record: any = {};
  parentId = "";
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
      this.http.post(`/customers/${this.record.id}/update`, this.record).subscribe(res => {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      });
    } else {
      value.parentId = this.parentId;
      value.name = value.nickName;
      value.isCategory = true;
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
