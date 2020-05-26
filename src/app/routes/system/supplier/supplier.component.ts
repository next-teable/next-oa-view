import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { SystemSupplierEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-system-supplier',
  templateUrl: './supplier.component.html',
})
export class SystemSupplierComponent implements OnInit {
  url = `/suppliers`;
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '名称',
      },
      code: {
        type: 'string',
        title: '编码',
      },
      contact: {
        type: 'string',
        title: '联系人',
      },
      phone: {
        type: 'string',
        title: '联系电话',
      },
    },
  };
  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    { title: '名称', index: 'name' },
    { title: '供应商编码', index: 'code' },
    { title: '联系人', index: 'contact' },
    { title: '联系电话', index: 'phone' },
    { title: '银行账号', index: 'bankAccount' },
    { title: '银行开户行', index: 'bankOpeningName' },
    { title: '联系地址', index: 'address' },
    {
      title: '操作',
      buttons: [
        // { text: '查看', click: (item: any) => `/form/${item.id}` },
        {
          text: '编辑',
          click: (item: any) =>
            this.modal.createStatic(SystemSupplierEditComponent, { record: item }).subscribe(() => this.st.reload()),
        },
      ],
    },
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper) {}

  ngOnInit() {}

  add() {
    this.modal.createStatic(SystemSupplierEditComponent, {}).subscribe(() => this.st.reload());
  }
}
