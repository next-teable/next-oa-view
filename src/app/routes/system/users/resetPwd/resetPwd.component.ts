import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { RSAEncrypt } from '@shared/utils/rsaEncrypt';

@Component({
  selector: 'app-user-resetpwd',
  template: `
    <div class="modal-header">
      <div class="modal-title">修改密码</div>
    </div>
    <form nz-form #f="ngForm" se-container="1" nzLayout="vertical">
      <se label="新密码" error="请填写" required>
        <input type="password" nz-input [(ngModel)]="changePwd.newPass" name="newPass" required />
      </se>
      <se label="确认新密码" error="请填写" required>
        <input type="password" nz-input [(ngModel)]="changePwd.newPassConfirm" name="newPassConfirm" required />
      </se>
      <se>
        <button nz-button nzType="primary" [disabled]="f.invalid" (click)="save(f.value)">保存</button>
      </se>
    </form>
  `,
  providers: [RSAEncrypt],
})
export class ResetPwdComponent implements OnInit {
  username: '';
  changePwd: any = {};

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private rsaEncrypt: RSAEncrypt,
  ) {}

  ngOnInit(): void {}

  save(value: any) {
    if (value.newPass !== value.newPassConfirm) {
      this.msgSrv.error('2次新密码输入不一致。');
      return;
    }
    this.http
      .post(`/sysusers/${this.username}/updatePassword`, {
        newPass: this.rsaEncrypt.encrypted(value.newPass),
      })
      .subscribe(res => {
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      });
  }

  close() {
    this.modal.destroy();
  }
}
