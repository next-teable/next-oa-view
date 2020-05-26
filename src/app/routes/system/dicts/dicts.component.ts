import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STChange, STReq } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { SystemDictsEditComponent } from './edit/edit.component';
import { SystemDictsItemEditComponent } from './item-edit/item-edit.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-system-dicts',
  templateUrl: './dicts.component.html',
})
export class SystemDictsComponent implements OnInit {
  selectedDictName = '';
  selectedDictId = '';
  dictUrl = `/dicts`;
  dictItemUrl = `/dictItems/getByDict`;

  dictSearchSchema: SFSchema = {
    properties: {
      searchKeywords: {
        type: 'string',
        title: '关键字',
      },
    },
  };
  dictItemSearchSchema: SFSchema = {
    properties: {
      searchKeywords: {
        type: 'string',
        title: '关键字',
      },
    },
  };

  @ViewChild('dictSt', { static: false }) dictSt: STComponent;
  dictColumns: STColumn[] = [
    { title: '#', index: 'id', type: 'radio' },
    { title: '名称', index: 'name' },
    { title: '描述', index: 'remark' },
    {
      title: '#',
      buttons: [
        {
          text: '编辑',
          type: 'static',
          component: null,
          click: record => {
            this.modal
              .createStatic(SystemDictsEditComponent, { record }, { size: 'sm' })
              .subscribe(() => this.dictSt.reload());
          },
        },
        {
          text: '删除',
          type: 'static',
          component: null,
          click: record => {
            this.confirmServ.confirm({
              nzTitle: '<i>确定要删除字典吗？</i>',
              nzOnOk: () => {
                this.http.delete(`/dicts/${record.id}`).subscribe(res => {
                  this.msgSrv.success('操作成功');
                  this.dictSt.reload();
                });
              },
            });
          },
        },
      ],
    },
  ];

  @ViewChild('dictItemSt', { static: false }) dictItemSt: STComponent;
  dictItemColumns: STColumn[] = [
    { title: '标签', index: 'label' },
    { title: '值', index: 'value' },
    { title: '排序', index: 'sort' },
    {
      title: '#',
      buttons: [
        {
          text: '编辑',
          type: 'static',
          component: null,
          click: record => {
            this.modal
              .createStatic(SystemDictsItemEditComponent, { record }, { size: 'sm' })
              .subscribe(() => this.reloadDictItems());
          },
        },
        {
          text: '删除',
          type: 'static',
          component: null,
          click: record => {
            this.confirmServ.confirm({
              nzTitle: '<i>确定要删除字典项吗？</i>',
              nzOnOk: () => {
                this.http.delete(`/dictItems/${record.id}`).subscribe(res => {
                  this.msgSrv.success('操作成功');
                  this.dictItemSt.reload();
                });
              },
            });
          },
        },
      ],
    },
  ];

  dictItemsReq: STReq = {
    lazyLoad: true,
  };

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private confirmServ: NzModalService,
  ) {}

  ngOnInit() {}

  dictSearch(value: any) {
    this.dictSt.reset({
      ...this.dictSt.req.params,
      ...value,
    });
  }

  resetDictSearch(value: any) {
    this.dictSt.reset({
      ...value,
    });
  }

  dictSelect(ret: STChange) {
    if (ret.radio) {
      this.selectedDictName = ret.radio.name;
      this.selectedDictId = ret.radio.id;
      this.reloadDictItems();
    }
  }

  reloadDictItems() {
    this.dictItemSt.reset({
      ...this.dictItemSt.req.params,
      dictName: this.selectedDictName,
    });
  }

  addDict() {
    this.modal.createStatic(SystemDictsEditComponent, {}, { size: 'sm' }).subscribe(() => this.dictSt.reload());
  }

  addDictItem() {
    if (this.selectedDictName) {
      this.modal
        .createStatic(
          SystemDictsItemEditComponent,
          {
            record: {
              dictId: this.selectedDictId,
            },
          },
          { size: 'sm' },
        )
        .subscribe(() => this.reloadDictItems());
    } else {
      this.msgSrv.warning('请选定一个字典');
    }
  }
}
