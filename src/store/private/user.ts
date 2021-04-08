import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { sessionData } from '@/filters/storage';

@Module({ name: 'user', dynamic: true, namespaced: false, store })
export default class User extends VuexModule {
  public Token: any = null;
  public UserName: string = '';
  public UserId: any = '';
  public MenuItemId: any = '';
  public MenuItem: any = [];
  public RouterMap: any = [];
  public TagListMap: any = [];

  get getUserName() {
    return `${this.UserName}`;
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
    console.log(`【缓存】___NAVs左侧路由___${true}`);
  }
  @Mutation
  private SET_StoreMenuItemId(item: string) {
    this.MenuItemId = item;
    sessionData('set', 'HasSessionMenuItemId', item);
    console.log(`【缓存】___NAVs左侧路由INDEX___${item}`);
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
    console.log(`【缓存】___TAGs数组标签___${item}`);
  }
}

export const UserStore = getModule(User);