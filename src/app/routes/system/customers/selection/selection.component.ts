import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema } from '@delon/form';
import { STComponent, STColumn, STChange, STPage } from '@delon/abc';

@Component({
  selector: 'app-system-customers-selection',
  templateUrl: './selection.component.html',
})
export class SystemCustomersSelectionComponent implements OnInit {
  url = `/customers`;
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
  selectCustomerId = '';
  selectCustomerName = '';

  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    { title: '#', index: 'id', type: 'radio' },
    { title: '客户名称', index: 'name' },
    { title: '客户简称', index: 'nickName' },
  ];

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    this.st.reload();
  }

  customerSelect(ret: any): void {
    if (ret.radio) {
      this.selectCustomerId = ret.radio.id;
      this.selectCustomerName = ret.radio.name;
    }
    if (ret.click) {
      this.st.clearRadio();
      ret.click.item.checked = true;
      this.selectCustomerId = ret.click.item.id;
      this.selectCustomerName = ret.click.item.name;
    }
    if ('dblClick' === ret.type) {
      this.modal.close({ id: ret.dblClick.item.id, name: ret.dblClick.item.name });
    }
  }

  save() {
    this.modal.close({ id: this.selectCustomerId, name: this.selectCustomerName });
  }

  close() {
    this.modal.destroy();
  }
}
