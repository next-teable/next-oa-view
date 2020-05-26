import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-system-roles-edit',
  templateUrl: './edit.component.html',
})
export class SystemRolesEditComponent implements OnInit {
  record: any = {};
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '编码', maxLength: 50 },
      remark: { type: 'string', title: '描述', maxLength: 50 },
    },
    required: ['name', 'remark'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 70,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    if (this.record != null && this.record.id != null) {
      this.schema.properties.name.readOnly = true;
    }
  }

  save(value: any) {
    if (this.record.id) {
      this.http.put(`/roles/${this.record.id}`, value).subscribe(res => {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      });
    } else {
      this.http.post(`/roles`, value).subscribe(res => {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      });
    }
  }

  close() {
    this.modal.destroy();
  }
}
