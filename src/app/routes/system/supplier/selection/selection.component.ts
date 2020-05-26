import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { NzMessageService, NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-system-supplier-selection',
  templateUrl: './selection.component.html',
})
export class SystemSupplierSelectionComponent implements OnInit {
  url = `/suppliers`;
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
  selectSupplierId = '';
  selectSupplierName = '';

  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    { title: '#', index: 'id', type: 'radio' },
    { title: '客户名称', index: 'name' },
    { title: '供应商编码', index: 'code' },
    { title: '联系人', index: 'contact' },
    { title: '联系电话', index: 'phone' },
  ];

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    this.st.reload();
  }

  supplierSelect(ret: any): void {
    if (ret.radio) {
      this.selectSupplierId = ret.radio.id;
      this.selectSupplierName = ret.radio.name;
    }
    if (ret.click) {
      this.st.clearRadio();
      ret.click.item.checked = true;
      this.selectSupplierId = ret.click.item.id;
      this.selectSupplierName = ret.click.item.name;
    }
    if ('dblClick' === ret.type) {
      this.modal.close({ id: ret.dblClick.item.id, name: ret.dblClick.item.name });
    }
  }

  save() {
    this.modal.close({ id: this.selectSupplierId, name: this.selectSupplierName });
  }

  close() {
    this.modal.destroy();
  }
}
