import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { STComponent, STColumn } from '@delon/abc';

@Component({
  selector: 'app-system-users-single-selection',
  templateUrl: './single-selection.component.html',
})
export class SystemUsersSingleSelectionComponent implements OnInit {
  url = `/sysusers`;
  searchSchema: SFSchema = {
    properties: {
      searchKeywords: {
        type: 'string',
        title: '关键字',
        ui: {
          placeholder: '请输入名称或简称',
        },
      },
    },
  };
  selectUserId = '';
  selectUserName = '';

  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    { title: '名称', index: 'username' },
    { title: '简称', index: 'nickName' },
    { title: '电话', index: 'mobile' },
    { title: '邮箱', index: 'email' },
  ];

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    this.st.reload();
  }

  customerSelect(ret: any): void {
    if (ret.radio) {
      this.selectUserId = ret.radio.id;
      this.selectUserName = ret.radio.nickName;
    }
    if (ret.click) {
      this.st.clearRadio();
      ret.click.item.checked = true;
      this.selectUserId = ret.click.item.id;
      this.selectUserName = ret.click.item.nickName;
    }
    if ('dblClick' === ret.type) {
      this.modal.close({ id: ret.dblClick.item.id, name: ret.dblClick.item.nickName });
    }
  }

  save() {
    this.modal.close({ id: this.selectUserId, name: this.selectUserName });
  }

  close() {
    this.modal.destroy();
  }
}
