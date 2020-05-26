import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STReq, STChange } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { ArrayService } from '@delon/util';
import { NzFormatEmitEvent, NzMessageService, NzModalService, NzFormatBeforeDropEvent } from 'ng-zorro-antd';
import { UsersSelectionComponent } from '../users/selection/selection.component';
import { SystemOrganizationsEditComponent } from './edit/edit.component';
import { SystemOrganizationsViewComponent } from './view/view.component';
import { of } from 'rxjs';

@Component({
  selector: 'app-system-organizations',
  templateUrl: './organizations.component.html',
})
export class SystemOrganizationsComponent implements OnInit {
  orgTreeData = [];
  searchValue = '';
  selectedOrgId = '';
  selectedOrgNode = {};

  getUsersByOrgUrl = `/organizations/${this.selectedOrgId}/getUsers`;
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
  getUsersByOrgReq: STReq = {
    lazyLoad: true,
  };

  @ViewChild('bindUserSt', { static: false }) bindUserSt: STComponent;
  getUsersByRoleCols: STColumn[] = [
    { title: '#', index: 'id', type: 'checkbox' },
    {
      title: '用户名',
      index: 'username',
    },
    { title: '名称', index: 'nickName' },
    { title: '手机', index: 'mobile' },
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private arrayService: ArrayService,
    public confirmServ: NzModalService,
  ) {}

  userSelect(ret: STChange) {}

  ngOnInit() {
    this.getOrgs();
  }

  getOrgs() {
    this.http.get('/organizations/all').subscribe(orgData => {
      this.orgTreeData = this.arrayService.arrToTreeNode(
        orgData.map(item => {
          return {
            title: item.name,
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
        .createStatic(SystemOrganizationsEditComponent, { parent: this.selectedOrgNode }, { size: 'md' })
        .subscribe(() => {
          this.getOrgs();
        });
    } else {
      this.msgSrv.warning('请选择组织机构');
    }
  }

  editOrg(event: NzFormatEmitEvent) {
    if (this.selectedOrgId) {
      this.modal
        .createStatic(SystemOrganizationsEditComponent, { record: this.selectedOrgNode }, { size: 'md' })
        .subscribe(() => {
          this.getOrgs();
        });
    } else {
      this.msgSrv.warning('请选择组织机构');
    }
  }

  viewOrg() {
    if (this.selectedOrgId) {
      this.modal
        .createStatic(SystemOrganizationsViewComponent, { record: this.selectedOrgNode }, { size: 'md' })
        .subscribe();
    } else {
      this.msgSrv.warning('请选择组织机构');
    }
  }

  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
  }

  nzClick(event: NzFormatEmitEvent): void {
    console.log(event);
    this.selectedOrgId = event.node.origin.id;
    this.selectedOrgNode = event.node.origin;
    this.getUsersByOrgUrl = `/organizations/${this.selectedOrgId}/getUsers`;
    this.bindUserSt.reload();
  }

  bindUsers() {
    if (this.selectedOrgId) {
      this.modal.createStatic(UsersSelectionComponent, { record: {} }, { size: 'lg' }).subscribe(data => {
        this.http.post(`/organizations/bindUsersByOrg/${this.selectedOrgId}`, { userIds: data }).subscribe(res => {
          this.msgSrv.success('操作成功');
          this.refreshUsers();
        });
      });
    } else {
      this.msgSrv.warning('请选定一个组织');
    }
  }

  unbindUsers() {
    if (this.selectedOrgId) {
      this.confirmServ.confirm({
        nzTitle: '<i>确定要解绑用户吗</i>',
        nzOnOk: () => {
          const checkedUserIds = [];
          this.bindUserSt._data.filter(user => {
            if (user.checked) {
              checkedUserIds.push(user.id);
            }
          });
          this.http
            .post(`/organizations/unBindUsersByOrg/${this.selectedOrgId}`, { userIds: checkedUserIds })
            .subscribe(res => {
              this.msgSrv.success('操作成功');
              // this.st.reload();
              this.refreshUsers();
            });
        },
      });
    } else {
      this.msgSrv.warning('请选定一个角色');
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
    this.http.put(`/organizations/${dragNode.key}/move/${dragNode.parentNode.key}`, {}).subscribe(res => {
      this.msgSrv.success('操作成功');
      // this.st.reload();
      // this.refreshUsers();
    });
  }

  refreshUsers() {
    this.bindUserSt.reload();
  }
}
