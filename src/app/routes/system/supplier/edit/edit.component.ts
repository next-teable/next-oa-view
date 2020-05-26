import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-system-supplier-edit',
  templateUrl: './edit.component.html',
})
export class SystemSupplierEditComponent implements OnInit {
  record: any = {};

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    if (this.record.id > 0) this.http.get(`/suppliers/${this.record.id}/detail`).subscribe(res => (this.record = res));
  }

  save(value: any) {
    if (this.record.id) {
      this.http.put(`/suppliers/${this.record.id}`, this.record).subscribe(res => {
        this.modal.close(true);
      });
    } else {
      this.http.post(`/suppliers`, this.record).subscribe(res => {
        this.modal.close(true);
      });
    }
  }

  close() {
    this.modal.destroy();
  }
}
