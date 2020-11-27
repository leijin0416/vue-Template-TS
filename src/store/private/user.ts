import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { sessionData } from '@/filters/storage';

@Module({ name: 'user', dynamic: true, namespaced: false, store })
export default class User extends VuexModule {
  public Token: any = null;
  public UserId: any = '';
  public MenuItemId: any = '';
  public MenuItem: any = [];
  public RouterMap: any = [];
  public TagListMap: any = [];

  get getMenuItem() {
    return `${this.MenuItemId}`;
  }

  @Action
  public getStoreToken(item: any) {
    this.SET_StoreToken(item);
  }
  @Action
  public getStoreUserId(item: any) {
    this.SET_StoreUserId(item);
  }
  @Action
  public getStoreTagsItem(item: any) {
    this.SET_StoreTagsItem(item);
  }
  @Action
  public getStoreMenuItem(item: string) {
    this.SET_StoreMenuItem(item);
  }
  @Action
  public getStoreMenuItemId(item: string) {
    this.SET_StoreMenuItemId(item);
  }
  @Action
  public getStoreRouterMap(item: any) {
    this.SET_StoreRouterMap(item);
  }

  @Mutation
  private SET_StoreToken(item: any) {
    this.Token = item;
    sessionData('set', 'HasSessionToken', item);
    console.log(`【缓存】用户TOKEN >>> ${true}`);
  }
  @Mutation
  private SET_StoreUserId(item: any) {
    this.UserId = item;
    sessionData('set', 'HasSessionUserId', item);
    console.log(`【缓存】用户ID >>> ${true}`);
  }
  @Mutation
  private SET_StoreMenuItem(item: string) {
    this.MenuItem = item;
    sessionData('set', 'HasSessionMenuItem', item);
    console.log(`【缓存】NAV左侧路由 >>> ${true}`);
  }
  @Mutation
  private SET_StoreMenuItemId(item: string) {
    this.MenuItemId = item;
    sessionData('set', 'HasSessionMenuItemId', item);
    console.log(`【缓存】NAV左侧路由INDEX >>> ${item}`);
  }
  @Mutation
  private SET_StoreRouterMap(item: any) {
    this.RouterMap = item;
    sessionData('set', 'HasSessionRouterMap', item);
    console.log(`【缓存】初次执行路由 >>> ${item}`);
  }
  @Mutation
  private SET_StoreTagsItem(item: any) {
    this.TagListMap = item;
    sessionData('set', 'HasSessionTagsMap', item);
    console.log(`【缓存】TAG数组标签 >>> ${item}`);
  }
}

export const UserStore = getModule(User);