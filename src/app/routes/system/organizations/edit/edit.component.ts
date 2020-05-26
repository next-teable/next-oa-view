import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-system-organizations-edit',
  templateUrl: './edit.component.html',
})
export class SystemOrganizationsEditComponent implements OnInit {
  parent: any = {};
  record: any = {};
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '组织机构名称', maxLength: 15 },
      code: { type: 'string', title: '组织机构编码', maxLength: 15 },
      description: { type: 'string', title: '描述', maxLength: 140 },
    },
    required: ['name', 'code'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
    $description: {
      widget: 'textarea',
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    this.parent = this.parent;
    console.log(`parent:${JSON.stringify(this.parent)}`);
    // if (this.record.id > 0) this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
  }

  save(value: any) {
    if (this.record.id) {
      this.http
        .put(`/organizations/${this.record.id}`, {
          parentId: this.record.parentId,
          ...value,
        })
        .subscribe(res => {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        });
    } else {
      this.http
        .post(`/organizations`, {
          parentId: this.parent.id,
          ...value,
        })
        .subscribe(res => {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        });
    }
  }

  close() {
    this.modal.destroy();
  }
}
