import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalRef, TransferChange, NzTransferComponent } from 'ng-zorro-antd';

@Component({
  selector: 'app-role-selection',
  templateUrl: './selection.component.html',
})
export class RoleSelectionComponent implements OnInit {
  userId = '';

  rolesData = [];

  @ViewChild('roleTransfer', { static: false }) roleTransfer: NzTransferComponent;

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit() {
    this.http.get(`/sysusers/getRolesByUser/${this.userId}`).subscribe(res => {
      const roleArr = res.map(role => {
        role.key = role.id;
        role.title = role.name;
        role.direction = role.checked === true ? 'right' : 'left';
        role.checked = false;
        return role;
      });

      this.rolesData = roleArr;
    });
  }

  close() {
    this.modal.destroy();
  }

  save() {
    const selectedKeys = this.roleTransfer.rightDataSource.map(item => item.id);
    this.modal.close(selectedKeys);
  }
}
