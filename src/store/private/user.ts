import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { sessionData } from '@/filters/storage';

@Module({ name: 'user', dynamic: true, namespaced: false, store })
export default class User extends VuexModule {
  public Token: any = null;
  public UserId: any = '';
  public MenuItem: any = [];
  public RouterMap: any = [];

  get getMessage() {
    return `${this.UserId}`;
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
  public getStoreMenuItem(item: any) {
    this.SET_StoreMenuItem(item);
  }
  @Action
  public getStoreRouterMap(item: any) {
    this.SET_StoreRouterMap(item);
  }

  @Mutation
  private SET_StoreToken(item: any) {
    this.Token = item;
    sessionData('set', 'HasSessionToken', item);
  }
  @Mutation
  private SET_StoreUserId(item: any) {
    this.UserId = item;
    sessionData('set', 'HasSessionUserId', item);
  }
  @Mutation
  private SET_StoreMenuItem(item: any) {
    this.MenuItem = item;
    sessionData('set', 'HasSessionMenuItem', item);
  }
  @Mutation
  private SET_StoreRouterMap(item: any) {
    this.RouterMap = item;
    sessionData('set', 'HasSessionRouterMap', item);
  }
}

export const UserStore = getModule(User);