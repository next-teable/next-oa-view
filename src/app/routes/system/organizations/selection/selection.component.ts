import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, NzFormatEmitEvent } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { STComponent, STColumn } from '@delon/abc';
import { ArrayService } from '@delon/util';

@Component({
  selector: 'app-system-organizations-selection',
  templateUrl: './selection.component.html',
})
export class SystemOrganizationsSelectionComponent implements OnInit {
  orgTreeData = [];
  searchValue = '';
  selectedOrgId = '';
  selectedOrgName = '';
  selectedOrgNode = {};

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private arrayService: ArrayService,
  ) {}

  ngOnInit(): void {
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

  save() {
    this.modal.close({ id: this.selectedOrgId, name: this.selectedOrgName });
  }

  close() {
    this.modal.destroy();
  }

  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event);
  }

  nzClick(event: NzFormatEmitEvent): void {
    console.log(event);
    this.selectedOrgId = event.node.origin.id;
    this.selectedOrgName = event.node.origin.name;
    this.selectedOrgNode = event.node.origin;
  }
}
