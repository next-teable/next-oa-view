import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { NzFormatEmitEvent, NzFormatBeforeDropEvent } from 'ng-zorro-antd';
import { of } from 'rxjs';
import { ArrayService } from '@delon/util';
import { SystemProductEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-system-product',
  templateUrl: './product.component.html',
})
export class SystemProductComponent implements OnInit {
  searchValue: any;
  products = [];
  selectProductId = '';
  selectProductName = '';
  childProducts = [];

  searchSchema: SFSchema = {
    properties: {
      searchKeywords: {
        type: 'string',
        title: '关键字',
        ui: {
          placeholder: '请输入编码或描述',
        },
      },
    },
  };

  @ViewChild('bindUserSt', { static: false }) bindUserSt: STComponent;
  getUsersByRoleCols: STColumn[] = [
    { title: '名称', index: 'name' },
    { title: '编码', index: 'code' },
    { title: '类型', index: 'type' },
    { title: '型号', index: 'model' },
    { title: '单价', index: 'unitPrice' },
    { title: '重量', index: 'weight' },
    {
      title: '操作',
      buttons: [
        {
          text: '修改',
          type: 'link',
          click: (e: any) =>
            this.modal
              .createStatic(SystemProductEditComponent, {
                record: { id: e.id },
              })
              .subscribe(() => this.getProducts()),
        },
      ],
    },
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, private arrayService: ArrayService) {}

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.http.get('/productTypes/list').subscribe(orgData => {
      this.products = this.arrayService.arrToTreeNode(
        orgData.map(item => {
          return {
            title: '[' + item.code + ']' + item.name,
            ...item,
          };
        }),
        {
          idMapName: 'id',
          parentIdMapName: 'parentId',
        },
      );
    });
  }

  add() {
    this.modal.createStatic(SystemProductEditComponent, {}).subscribe(() => this.getProducts());
  }

  addProduct(event: NzFormatEmitEvent) {
    this.modal
      .createStatic(SystemProductEditComponent, {
        record: { parentId: this.selectProductId, parentName: this.selectProductName },
      })
      .subscribe(() => this.getProducts());
  }

  loadChild() {
    if (this.selectProductId) {
      this.http.get(`/productTypes/${this.selectProductId}/children`).subscribe(res => {
        this.childProducts = res;
      });
    }
  }

  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
  }

  nzClick(event: NzFormatEmitEvent): void {
    console.log(event);
    this.selectProductId = event.node.origin.id;
    this.selectProductName = event.node.origin.name;
    this.loadChild();
  }

  beforeDrop(arg: NzFormatBeforeDropEvent) {
    if (confirm('确定移动层级吗')) {
      return of(true);
    } else {
      return of(false);
    }
    // this.confirmServ.confirm({
    //   nzTitle: '<i></i>',
    //   nzOnOk: () => {
    //     return true;
    //   },
    //   nzOnCancel: () => {
    //     return false;
    //   },
    // });
  }

  moveOrgs(event: NzFormatEmitEvent) {
    console.log(event);
    const dragNode = event.dragNode;
    this.http.put(`/organizations/${dragNode.key}/move/${dragNode.parentNode.key}`, {}).subscribe(res => {
      // this.st.reload();
      // this.refreshUsers();
    });
  }
}
