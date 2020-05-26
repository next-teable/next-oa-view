import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema } from '@delon/form';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-business-goods',
  templateUrl: './goods.component.html',
})
export class BusinessGoodsComponent implements OnInit {
  url = `/goods`;

  inputValue: string;
  options: string[] = [];

  searchSchema: SFSchema = {
    properties: {
      no: {
        type: 'string',
        title: '编号'
      }
    }
  };

  @ViewChild('st', { static: false }) st: STComponent;
  columns: STColumn[] = [
    { title: '商品编码', index: 'code' },
    { title: '商品名称', index: 'name' },
    { title: '服务商名称', index: 'providerName' },
    { title: '商品类别', index: 'categoryName' },
    { title: '价格', index: 'price' },
    { title: '上下架', index: 'isSoldOut' },
    { title: '销量', index: 'salesVolume' },
    { title: '评价', index: 'star' },
    {
      title: '',
      buttons: [
        { text: '推送OpenSearch', click: (item: any) => {
          this.http.put(`/goods/${item.id}/pushToSearch`,{}).subscribe(res => {
            this.msgSrv.success('推送成功');
          });
        } },
        // { text: '编辑', type: 'static', component: FormEditComponent, click: 'reload' },
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, private msgSrv: NzMessageService) { }

  ngOnInit() { }

  pushAll() {
    this.http.put(`/goods/pushAll`,{}).subscribe(res => {
      this.msgSrv.success('推送成功');
    });
  }

  pushAllCategory() {
    this.http.put(`/goods/pushAllCategory`,{}).subscribe(res => {
      this.msgSrv.success('推送成功');
    });
  }


  onInput(value: string): void {
    console.log(`input value: ${value}`);
    if(value.length > 2){
      this.http.post(`/goods/opensearch`,{keyword:value}).subscribe(res => {
        const searchRes = []
        res.forEach(element => {
          searchRes.push(element.name);
        });
        console.log(`searchRes:${searchRes}`);
        this.options = searchRes;
      });
    }
  }

}
