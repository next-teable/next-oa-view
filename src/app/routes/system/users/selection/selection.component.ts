import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalRef, TransferChange, NzTransferComponent } from 'ng-zorro-antd';

@Component({
  selector: 'app-users-selection',
  templateUrl: './selection.component.html',
})
export class UsersSelectionComponent implements OnInit {
  pageIndex = 0;
  pageSize = 15;
  usersData = {
    content: [],
    totalElements: '0',
  };

  @ViewChild('userTransfer', { static: false }) userTransfer: NzTransferComponent;

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit() {
    this.searchData();
  }

  searchData(): void {
    this.http
      .get(`/sysusers`, { page: this.pageIndex - 1, size: this.pageSize, enabled: true, sort: 'createdAt,desc' })
      .subscribe(res => {
        this.usersData = res;
        this.usersData.content.forEach(user => {
          user.key = user.id;
          user.title = user.username;
        });
      });
  }

  close() {
    this.modal.destroy();
  }

  change(ret: TransferChange) {
    const isDisabled = ret.to === 'right';
  }

  select(ret) {}

  save() {
    const selectedKeys = this.userTransfer.rightDataSource.map(item => item.id);

    this.modal.close(selectedKeys);
  }
}
