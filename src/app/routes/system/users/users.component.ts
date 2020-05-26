import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { UsersCurdEditComponent } from './edit/edit.component';
import { UsersCurdViewComponent } from './view/view.component';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';
import { RoleSelectionComponent } from './bindRoles/selection.component';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ResetPwdComponent } from './resetPwd/resetPwd.component';

@Component({
  selector: 'app-users-curd',
  templateUrl: './users.component.html',
})
export class UsersCurdComponent implements OnInit {
  selectedValue = '';
  url = `/sysusers`;
  searchSchema: SFSchema = {
    properties: {
      keyword: {
        type: 'string',
        title: '关键字',
        ui: {
          placeholder: '请输入名称或电话',
        },
      },
    },
  };
  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    {
      title: '用户名',
      type: 'link',
      index: 'username',
      width: '10%',
      click: record => {
        this.modal.createStatic(UsersCurdViewComponent, { record }, { size: 'sm' }).subscribe();
      },
    },
    { title: '名称', index: 'nickName', width: '10%' },
    { title: '联系电话', index: 'mobile', width: '10%' },
    { title: '电子邮箱', index: 'email', width: '10%' },
    { title: '创建时间', type: 'date', index: 'createdAt', width: '10%' },
    {
      title: '状态',
      type: 'badge',
      index: 'enabled',
      width: '10%',
      badge: {
        true: { text: '已启用', color: 'success' },
        false: { text: '已禁用', color: 'error' },
      },
    },
    {
      title: '操作',
      className: 'text-left',
      width: '10%',
      buttons: [
        // { text: '查看', click: (item: any) => `/form/${item.id}` },
        {
          icon: 'edit',
          type: 'static',
          component: null,
          tooltip: '编辑',
          click: record => {
            this.modal
              .createStatic(UsersCurdEditComponent, { user: record }, { size: 'md' })
              .subscribe(() => this.st.reload());
          },
        },
        {
          icon: 'usergroup-add',
          type: 'static',
          component: null,
          tooltip: '绑定角色',
          click: record => {
            this.modal
              .createStatic(RoleSelectionComponent, { userId: record.id }, { size: 'md' })
              .subscribe(selectedKeys => {
                this.http.post(`/sysusers/bindRolesByUser/${record.id}`, { roleIds: selectedKeys }).subscribe(res => {
                  this.msgSrv.success('操作成功');
                });
              });
          },
        },
        {
          icon: 'key',
          type: 'static',
          component: null,
          tooltip: '重置密码',
          click: record => {
            this.modal
              .createStatic(ResetPwdComponent, { username: record.username }, { size: 'sm' })
              .subscribe(res => this.st.reload());
          },
        },
        {
          icon: 'lock',
          iif: record => record.enabled === true,
          type: 'static',
          component: null,
          tooltip: '锁定',
          click: record => {
            this.confirmServ.confirm({
              nzTitle: '确定要锁定用户么',
              nzOnOk: () => {
                this.http.post(`/sysusers/${record.id}/disable`, {}).subscribe(res => {
                  this.msgSrv.success('操作成功');
                  this.st.reload();
                });
              },
            });
          },
        },
        {
          icon: 'unlock',
          iif: record => record.enabled === false,
          type: 'static',
          component: null,
          tooltip: '解锁',
          click: record => {
            this.confirmServ.confirm({
              nzTitle: '确定要解锁用户么',
              nzOnOk: () => {
                this.http.post(`/sysusers/${record.id}/enable`, {}).subscribe(res => {
                  this.msgSrv.success('操作成功');
                  this.st.reload();
                });
              },
            });
          },
        },
      ],
    },
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    private confirmServ: NzModalService,
  ) {}

  ngOnInit() {}

  add() {
    this.modal.createStatic(UsersCurdEditComponent, { user: {} }, { size: 'md' }).subscribe(() => this.st.reload());
    // this.editModal.show();
  }
}
