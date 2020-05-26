import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STReq, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ArrayService } from '@delon/util';
import { NzFormatEmitEvent, NzMessageService, NzModalService, NzFormatBeforeDropEvent } from 'ng-zorro-antd';
import { SystemCustomersEditComponent } from './edit/edit.component';
import { SystemCustomersCreateComponent } from './create/create.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-system-customers',
  templateUrl: './customers.component.html',
})
export class SystemCustomersComponent implements OnInit {
  orgTreeData = [];
  searchValue = '';
  selectedOrgId = '';
  selectedOrgName = "";
  selectedOrgNode = {};

  getUsersByOrgUrl = `/customers/${this.selectedOrgId}/query`;
  searchSchema: SFSchema = {
    properties: {
      keyword: {
        type: 'string',
        title: '关键字',
        ui: {
          placeholder: '请输入编码或描述',
        },
      },
    },
  };
  getUsersByOrgReq: STReq = {
    lazyLoad: true,
  };

  @ViewChild('bindUserSt', { static: false }) bindUserSt: STComponent;
  getUsersByRoleCols: STColumn[] = [
    { title: '#', index: 'id', type: 'checkbox' },
    {
      title: '用户名',
      index: 'name',
    },
    { title: '名称', index: 'nickName' },
    { title: '手机', index: 'contactPhone' },
    {
      title: '操作',
      buttons: [
        {
          text: '修改',
          type: 'link',
          click: (e: any) => this.modal.createStatic(SystemCustomersEditComponent, { record: { "id": e.id, "parentCustomer": { "nickName": this.selectedOrgName } } }, { size: 'lg' }).subscribe(() => this.bindUserSt.reload()),
        },
        {
          text: '删除',
          type: 'link',
          click: (e: any) => this.confirmServ.confirm({
            nzTitle: '客户删除?',
            nzContent: '请确认是否删除',
            nzOnOk: () => {
              this.http.post('/customers/' + e.id + '/delete').subscribe(() => this.bindUserSt.reload());
            }
          })
        },
      ],
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private arrayService: ArrayService,
    public confirmServ: NzModalService,
  ) { }

  userSelect(ret: STChange) { }

  ngOnInit() {
    this.getOrgs();
  }

  getOrgs() {
    this.http.get('/customers/all').subscribe(orgData => {
      this.orgTreeData = this.arrayService.arrToTreeNode(
        orgData.map(item => {
          return {
            title: item.nickName,
            ...item,
          };
        }),
        {
          idMapName: 'id',
          parentIdMapName: 'parentId',
        },
      );
      console.log(` this.orgTreeData:${this.orgTreeData}`);
    });
  }

  addOrg(event: NzFormatEmitEvent) {
    if (this.selectedOrgId) {
      this.modal
        .createStatic(SystemCustomersCreateComponent, { parentId: this.selectedOrgId }, { size: 'md' })
        .subscribe(() => {
          this.getOrgs();
        });
    } else {
      this.msgSrv.warning('请选择客户类别');
    }
  }

  editOrg(event: NzFormatEmitEvent) {
    if (this.selectedOrgId) {
      this.modal
        .createStatic(SystemCustomersCreateComponent, { record: { "id": this.selectedOrgId } }, { size: 'md' })
        .subscribe(() => {
          this.getOrgs();
        });
    } else {
      this.msgSrv.warning('请选择客户类别');
    }
  }

  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
  }

  nzClick(event: NzFormatEmitEvent): void {
    console.log(event);
    this.selectedOrgId = event.node.origin.id;
    this.selectedOrgName = event.node.origin.nickName;
    this.selectedOrgNode = event.node.origin;
    this.getUsersByOrgUrl = `/customers/${this.selectedOrgId}/query`;
    this.bindUserSt.reload();
  }

  bindUsers() {
    if (this.selectedOrgId) {
      this.modal.createStatic(SystemCustomersEditComponent, { record: { "parentCustomer": { "nickName": this.selectedOrgName } }, orgId: this.selectedOrgId }, { size: 'lg' }).subscribe(() => this.bindUserSt.reload());
    } else {
      this.msgSrv.warning('请选定一个组织');
    }
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
    this.http.put(`/customerOrgs/${dragNode.key}/move/${dragNode.parentNode.key}`, {}).subscribe(res => {
      this.msgSrv.success('操作成功');
      // this.st.reload();
      // this.refreshUsers();
    });
  }

  refreshUsers() {
    this.bindUserSt.reload();
  }
}
