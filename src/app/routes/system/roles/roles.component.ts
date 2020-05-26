import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent, STReq, STRes, STChange, STRequestOptions } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { SystemRolesEditComponent } from './edit/edit.component';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { NzTreeNode } from 'ng-zorro-antd/core/tree/nz-tree-base-node';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UsersSelectionComponent } from '../users/selection/selection.component';
@Component({
  selector: 'app-system-roles',
  templateUrl: './roles.component.html',
})
export class SystemRolesComponent implements OnInit {
  @ViewChild('menuTree', { static: false }) menuTree: NzTreeComponent;
  selectedTabIndex = 0;
  selectedRoleId = '';
  menusTreeData = [];

  permissionsData = [];

  url = `/roles`;

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
  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    { title: '#', index: 'id', type: 'radio' },
    { title: '编码', index: 'name' },
    { title: '描述', index: 'remark' },
    {
      title: '',
      buttons: [
        {
          type: 'static',
          text: '编辑',
          click: record => {
            this.modal
              .createStatic(SystemRolesEditComponent, { record }, { size: 'sm' })
              .subscribe(() => this.st.reload());
          },
        },
      ],
    },
  ];

  getUsersByRoleUrl = `/roles/getUsersByRole/${this.selectedRoleId}`;
  getUsersByRoleReq: STReq = {
    lazyLoad: true,
  };

  @ViewChild('bindUserSt', { static: false }) bindUserSt: STComponent;
  getUsersByRoleCols: STColumn[] = [
    { title: '#', index: 'id', type: 'checkbox' },
    {
      title: '用户名',
      index: 'username',
    },
    { title: '联系电话', index: 'mobile' },
    { title: '电子邮箱', index: 'email' },
  ];

  constructor(
    private http: _HttpClient,
    private msgSrv: NzMessageService,
    private modal: ModalHelper,
    public confirmServ: NzModalService,
  ) {}

  ngOnInit() {}

  roleSelect(ret: STChange) {
    if (ret.radio) {
      this.selectedRoleId = ret.radio.id;
      this.reloadResouce();
    }
  }

  userSelect(ret: STChange) {
    if (ret.radio) {
    }
  }

  tabChange(ret) {
    this.selectedTabIndex = ret;
    this.reloadResouce();
  }

  add() {
    this.modal.createStatic(SystemRolesEditComponent, { record: {} }, { size: 'sm' }).subscribe(() => this.st.reload());
  }

  reloadResouce() {
    if (this.selectedRoleId) {
      if (this.selectedTabIndex === 0) {
        this.getUsersByRoleUrl = `/roles/getUsersByRole/${this.selectedRoleId}`;
        this.bindUserSt.reload();
      }
      if (this.selectedTabIndex === 1) {
        // load bound menu trees
        console.log('load bound menu trees');
        this.http.get(`/roles/getMenusByRole/${this.selectedRoleId}`).subscribe(menusData => {
          const topMenu = [
            {
              title: '导航',
              key: '-1',
              children: [],
              disableCheckbox: false,
            },
          ];
          const menusChildren = {};
          menusData.forEach(menu => {
            if (menu.mpid) {
              if (menusChildren[menu.mpid]) {
                menusChildren[menu.mpid].push(this.transMenu(menu));
              } else {
                menusChildren[menu.mpid] = [this.transMenu(menu)];
              }
            }
          });

          const menus = [];
          menusData.forEach(menu => {
            const targetMenu = this.transMenu(menu);
            if (!menu.mpid && menusChildren[menu.id]) {
              targetMenu.children = menusChildren[menu.id];
              targetMenu.isLeaf = false;
              targetMenu.checked = false;
              menus.push(targetMenu);
            }
          });
          topMenu[0].children = menus;

          this.menusTreeData = topMenu;
        });
      }
      if (this.selectedTabIndex === 2) {
        this.http.get(`/roles/getPermissionsByRole/${this.selectedRoleId}`).subscribe(permissionData => {
          this.permissionsData = permissionData;
        });
      }
    }
  }

  private transMenu(menu: any) {
    return {
      key: menu.id,
      title: menu.name,
      selectable: false,
      isLeaf: true,
      checked: menu.checked,
      children: [],
    };
  }

  bindMenus() {
    const checkedMenus = [];
    this.getCheckedNodes(this.menuTree.getTreeNodes()[0].children, checkedMenus);
    console.log(`checkedMenus:${checkedMenus}`);
    this.http.post(`/roles/bindMenusByRole/${this.selectedRoleId}`, { menuIds: checkedMenus }).subscribe(res => {
      this.msgSrv.success('操作成功');
    });
  }

  getCheckedNodes(menus: NzTreeNode[], checkedMenus) {
    menus.forEach(menu => {
      if (menu.isChecked || menu.isHalfChecked) {
        checkedMenus.push(menu.key);
      }
      if (!menu.isLeaf) {
        this.getCheckedNodes(menu.children, checkedMenus);
      }
    });
  }

  bindUsers() {
    if (this.selectedRoleId) {
      this.modal.create(UsersSelectionComponent, { record: {} }, { size: 'lg' }).subscribe(selectedKeys => {
        console.log(`keys:${selectedKeys}`);
        this.http.post(`/roles/bindUsersByRole/${this.selectedRoleId}`, { userIds: selectedKeys }).subscribe(res => {
          this.msgSrv.success('操作成功');
          // this.st.reload();
          this.refreshUsers();
        });
      });
    } else {
      this.msgSrv.warning('请选定一个角色');
    }
  }

  unbindUsers() {
    if (this.selectedRoleId) {
      this.confirmServ.confirm({
        nzTitle: '<i>确定要解绑用户吗</i>',
        nzOnOk: () => {
          const checkedUserIds = [];
          this.bindUserSt._data.filter(user => {
            if (user.checked) {
              checkedUserIds.push(user.id);
            }
          });
          console.log(`checkedMenus:${checkedUserIds}`);
          this.http
            .post(`/roles/unBindUsersByRole/${this.selectedRoleId}`, { userIds: checkedUserIds })
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

  refreshUsers() {
    this.reloadResouce();
  }

  bindPermissions() {}

  checkPermissionsAll(value: boolean) {}
}
