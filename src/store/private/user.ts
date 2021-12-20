import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { sessionData } from '@/filters/storage';

export interface ResponseData {
  code: number;
  data?: any;
  message: string;
}

@Module({ name: 'user', dynamic: true, namespaced: false, store })
export default class User extends VuexModule {
  public Token: any = null;
  public UserName: string = '';
  public UserId: any = '';
  public MenuItemId: any = '';
  public MenuItem: any = [];
  public RouterMap: any = [];
  public TagListMap: any = [];
  public getExportExcelsMap: any = [];
  public getUserHomeEchartsPiesMap: any = {};   // 首页用户统计
  public getUserHomeEchartsLinesMap: any = [];  // 首页用户注册统计

  get getUserName() {
    return `${this.UserName}`;
  }
  get getExportExcelsList() {
    return this.getExportExcelsMap;
  }
  get getStoreUserHomeEchartsPiesMap() {
    return this.getUserHomeEchartsPiesMap;
  }
  get getStoreUserHomeEchartsLinesMap() {
    return this.getUserHomeEchartsLinesMap;
  }

  @Action
  public storeActionToken(item: any) {
    this.SET_StoreToken(item);
  }
  @Action
  public storeActionUserId(item: any) {
    this.SET_StoreUserId(item);
  }
  @Action
  public storeActionUserName(item: string) {
    this.SET_StoreUserName(item);
  }
  @Action
  public storeActionTagsListMap(item: any) {
    this.SET_StoreTagsItem(item);
  }
  @Action
  public storeActionMenuMap(item: string) {
    this.SET_StoreMenuItem(item);
  }
  @Action
  public storeActionLeftMenuMapId(item: string) {
    this.SET_StoreMenuItemId(item);
  }
  @Action
  public storeActionRouterMap(item: any) {
    this.SET_StoreRouterMap(item);
  }

  @Action
  public storeUserHomeEchartsPiesMap(item: any) {  // 首页用户统计 饼状图
    this.SET_StoreUserHomeEchartsPiesMap(item);
    // console.log(item);
  }
  @Action
  public storeUserHomeEchartsLinesMap(item: any) {  // 首页用户注册统计 走势图
    this.SET_StoreUserHomeEchartsLinesMap(item);
    // console.log(item);
  }
  @Action
  public storeExportExcelsMap(item: any) {  // 导出表格状态
    this.SET_StoreExportExcelsMap(item);
  }

  @Mutation
  private SET_StoreToken(item: any) {
    this.Token = item;
    sessionData('set', 'HasSessionToken', item);
    console.log(`【缓存】___用户TOKEN___${true}`);
  }
  @Mutation
  private SET_StoreUserId(item: any) {
    this.UserId = item;
    sessionData('set', 'HasSessionUserId', item);
    console.log(`【缓存】___用户ID___${true}`);
  }
  @Mutation
  private SET_StoreUserName(item: string) {
    this.UserName = item;
    sessionData('set', 'HasSessionUserName', item);
    console.log(`【缓存】___用户名___${item}`);
  }
  @Mutation
  private SET_StoreMenuItem(item: string) {
    this.MenuItem = item;
    sessionData('set', 'HasSessionMenuItem', item);
    console.log(`【缓存】___Navs左侧路菜单___${true}`);
  }
  @Mutation
  private SET_StoreMenuItemId(item: string) {
    this.MenuItemId = item;
    sessionData('set', 'HasSessionMenuItemId', item);
    console.log(`【缓存】___Navs左侧路菜单INDEX___${item}`);
  }
  @Mutation
  private SET_StoreRouterMap(item: any) {
    this.RouterMap = item;
    sessionData('set', 'HasSessionRouterMap', item);
    console.log(`【缓存】___初次执行路由___${item}`);
  }
  @Mutation
  private SET_StoreTagsItem(item: any) {
    this.TagListMap = item;
    sessionData('set', 'HasSessionTagsMap', item);
    console.log(`【缓存】___Tags标签数组___${item}`);
  }

  @Mutation
  private SET_StoreUserHomeEchartsPiesMap(item: any) {
    this.getUserHomeEchartsPiesMap = item;
    console.log(`【缓存】___饼状图___${item}`);
  }
  @Mutation
  private SET_StoreUserHomeEchartsLinesMap(item: any) {
    // console.log(item);
    this.getUserHomeEchartsLinesMap = item;
  }
  @Mutation
  private SET_StoreExportExcelsMap(item: any) {
    this.getExportExcelsMap = item;
  }
}

export const UserStore = getModule(User);