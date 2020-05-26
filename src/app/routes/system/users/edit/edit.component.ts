import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-users-curd-edit',
  templateUrl: './edit.component.html',
})
export class UsersCurdEditComponent implements OnInit {
  user: any = {};
  schema: SFSchema = {
    properties: {
      username: { type: 'string', title: '用户名' },
      nickName: { type: 'string', title: '昵称', maxLength: 15 },
      email: { type: 'string', title: '电子邮箱', format: 'email' },
      mobile: { type: 'string', title: '手机', format: 'phone' },
    },
    required: ['username', 'nickName', 'email', 'mobile'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
  };

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    if (this.user != null && this.user.id != null) {
      this.schema.properties.username.readOnly = true;
      this.http.get(`/sysusers/${this.user.id}`).subscribe(res => {
        this.user = res;
      });
    }
  }

  save(value: any) {
    if (this.user.id) {
      this.http.put(`/sysusers/${this.user.id}`, value).subscribe(res => {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      });
    } else {
      this.http.post(`/sysusers`, value).subscribe(res => {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      });
    }
  }

  close() {
    this.modal.destroy();
  }
}
