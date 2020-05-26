import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { zip, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MenuService, SettingsService, TitleService, ALAIN_I18N_TOKEN } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import { I18NService } from '../i18n/i18n.service';

import { NzIconService } from 'ng-zorro-antd/icon';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { ICONS } from '../../../style-icons';
import { AppInfo, APIs } from '@shared/api';
import { LoginService } from 'src/app/routes/passport/login/login.services';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private injector: Injector,
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  getUserInfo() {
    return this.httpClient.get(`${APIs.userInfo}`);
  }

  getMenus() {
    return this.httpClient.get(`${APIs.getMenus}`);
  }

  // private afterLogin(resolve: any, reject: any) {
  //   const app = AppInfo;
  //   const userInfoUrl = `${APIs.userInfo}`;
  //   zip(
  //     this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`),
  //     this.httpClient.get(userInfoUrl),
  //     this.getMenus(),
  //   )
  //     .pipe(
  //       catchError(([langData, userInfo, menusData]) => {
  //         resolve(null);
  //         return [langData, userInfo, menusData];
  //         // return res;
  //       }),
  //     )
  //     .subscribe(
  //       ([langData, userInfo, menusData]) => {
  //         // Setting language data
  //         this.translate.setTranslation(this.i18n.defaultLang, langData);
  //         this.translate.setDefaultLang(this.i18n.defaultLang);
  //         // Application data
  //         // const res: any = appData;
  //         // Application information: including site name, description, year
  //         this.settingService.setApp(app);
  //         this.aclService.setFull(true);
  //         // Menu data, https://ng-alain.com/theme/menu
  //         // this.menuService.add(res.menu);
  //         // Can be set page suffix title, https://ng-alain.com/theme/title
  //         this.titleService.suffix = app.name;
  //       },
  //       () => {},
  //       () => {
  //         resolve(null);
  //       },
  //     );
  // }

  private viaHttp(resolve: any, reject: any) {
    const app = AppInfo;
    const userRequests = [this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`)];
    if (this.tokenService.get().token) {
      userRequests.push(this.getUserInfo());
      userRequests.push(this.getMenus());
    }
    forkJoin(userRequests)
      .pipe(
        catchError(([langData, userInfo, menusData]) => {
          resolve(null);
          return [langData, userInfo, menusData];
          // return res;
        }),
      )
      .subscribe(
        ([langData, userInfo, menusData]) => {
          // Setting language data
          this.translate.setTranslation(this.i18n.defaultLang, langData);
          this.translate.setDefaultLang(this.i18n.defaultLang);
          // Application data
          // Application information: including site name, description, year
          this.settingService.setApp(app);
          if (userInfo) {
            this.settingService.setUser(userInfo);
            // this.settingService.setLayout('collapsed', true);
          }

          this.aclService.setFull(true);
          // Menu data, https://ng-alain.com/theme/menu
          if (menusData) {
            const topMenu = [
              {
                text: '导航',
                // group: true,
                hideInBreadcrumb: true,
                children: [],
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
                targetMenu.hideInBreadcrumb = true;
                menus.push(targetMenu);
              }
            });
            topMenu[0].children = menus;

            this.menuService.add(topMenu);
          }

          // Can be set page suffix title, https://ng-alain.com/theme/title
          this.titleService.suffix = app.name;
        },
        () => {},
        () => {
          resolve(null);
        },
      );
  }

  private transMenu(menu: any) {
    return { ...menu, text: menu.name, link: menu.route, icon: menu.icon, hideInBreadcrumb: false, children: [] };
  }

  private viaMockI18n(resolve: any, reject: any) {
    this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`).subscribe(langData => {
      this.translate.setTranslation(this.i18n.defaultLang, langData);
      this.translate.setDefaultLang(this.i18n.defaultLang);

      this.viaMock(resolve, reject);
    });
  }

  private viaMock(resolve: any, reject: any) {
    // const tokenData = this.tokenService.get();
    // if (!tokenData.token) {
    //   this.injector.get(Router).navigateByUrl('/passport/login');
    //   resolve({});
    //   return;
    // }
    // mock
    const app: any = {
      name: `ng-alain`,
      description: `Ng-zorro admin panel front-end framework`,
    };
    const user: any = {
      name: 'Admin',
      avatar: './assets/tmp/img/avatar.jpg',
      email: 'cipchk@qq.com',
      token: '123456789',
    };
    // Application information: including site name, description, year
    this.settingService.setApp(app);
    // User information: including name, avatar, email address
    this.settingService.setUser(user);
    // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
    this.aclService.setFull(true);
    // Menu data, https://ng-alain.com/theme/menu
    this.menuService.add([
      {
        text: 'Main',
        children: [
          {
            text: 'Dashboard',
            link: '/dashboard',
            icon: { type: 'icon', value: 'appstore' },
          },
          {
            text: 'Quick Menu',
            icon: { type: 'icon', value: 'rocket' },
            shortcutRoot: true,
          },
        ],
      },
    ]);
    // Can be set page suffix title, https://ng-alain.com/theme/title
    this.titleService.suffix = app.name;

    resolve({});
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      // this.viaHttp(resolve, reject);
      // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
      // this.viaMockI18n(resolve, reject);

      this.viaHttp(resolve, reject);
    });
  }

  // getAppInfo(): Promise<any> {
  //   // only works with promises
  //   // https://github.com/angular/angular/issues/15088
  //   return new Promise((resolve, reject) => {
  //     // http
  //     // this.viaHttp(resolve, reject);
  //     // mock：请勿在生产环境中这么使用，viaMock 单纯只是为了模拟一些数据使脚手架一开始能正常运行
  //     // this.viaMockI18n(resolve, reject);

  //     this.afterLogin(resolve, reject);
  //   });
  // }
}
