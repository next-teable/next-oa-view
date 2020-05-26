import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-system-product-edit',
  templateUrl: './edit.component.html',
})
export class SystemProductEditComponent implements OnInit {
  record: any = {};
  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    if (this.record.id) {
      this.http.get(`/productTypes/${this.record.id}/detail`).subscribe(res => (this.record = res));
    }
  }

  save(value: any) {
    if (this.record.id) {
      this.http.put(`/productTypes/${this.record.id}/update`, this.record).subscribe(res => {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      });
    } else {
      this.http.post(`/productTypes/create`, this.record).subscribe(res => {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      });
    }
  }

  close() {
    this.modal.destroy();
  }
}
