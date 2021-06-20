/**
 *  @description:   本地路由配置
 *  @param parentId     -父ID
 *  @param router       -路由
 *  @param icon         -图标
 *  @param sort         -排序
 *  @param title /titleEn    -标题中英
 * 
 */
const childrenRouterMap = [
  {
    menuId: 1,
    code: "q9K6xf",
    router: "/user",
    icon: "el-icon-user-solid",
    title: "用户管理",
    titleEn: "User Management",
    type: 1,
    depth: 1,
    sort: null,
    parentId: 0,
    createTime: 1618382730831,
    updateTime: 1618459338214,
    createId: "536466902713573376",
    updateId: "542518030986289152",
    children: [
      {
        menuId: 2,
        code: "lJ3w30",
        router: "/user/list",
        icon: "el-icon-folder",
        title: "用户列表",
        titleEn: "User List",
        type: 1,
        depth: 2,
        sort: null,
        parentId: 1,
        createTime: 1618384989415,
        updateTime: 1618384989415,
        createId: "536466902713573376",
        updateId: "536466902713573376",
        children: []
      },
      {
        menuId: 3,
        code: "o0p402",
        router: "/user/audit",
        icon: "el-icon-folder",
        title: "用户审核列表",
        titleEn: "User Audit List",
        type: 1,
        depth: 2,
        sort: null,
        parentId: 1,
        createTime: 1618385386763,
        updateTime: 1618385386763,
        createId: "536466902713573376",
        updateId: "536466902713573376",
        children: []
      }
    ]
  },
  {
    menuId: 17,
    code: "17gHo1",
    router: "/system",
    icon: "el-icon-s-tools",
    title: "权限管理",
    titleEn: "Authority Management",
    type: 1,
    depth: 1,
    sort: null,
    parentId: 0,
    createTime: 1618385887310,
    updateTime: 1618385887310,
    createId: "536466902713573376",
    updateId: "536466902713573376",
    children: [
      {
        menuId: 18,
        code: "99p0W0",
        router: "/system/route",
        icon: "el-icon-folder",
        title: "路由配置列表",
        titleEn: "Routing List",
        type: 1,
        depth: 2,
        sort: null,
        parentId: 17,
        createTime: 1618385911048,
        updateTime: 1618389005480,
        createId: "536466902713573376",
        updateId: "536466902713573376",
        children: []
      },
      {
        menuId: 19,
        code: "0d8Ei0",
        router: "/system/role",
        icon: "el-icon-folder",
        title: "用户角色列表",
        titleEn: "User Role List",
        type: 1,
        depth: 2,
        sort: null,
        parentId: 17,
        createTime: 1618385950600,
        updateTime: 1618389015212,
        createId: "536466902713573376",
        updateId: "536466902713573376",
        children: []
      },
      {
        menuId: 21,
        code: "V46f07",
        router: "/system/user",
        icon: "el-icon-folder",
        title: "管理员列表",
        titleEn: "Administrator List",
        type: 1,
        depth: 2,
        sort: null,
        parentId: 17,
        createTime: 1618388986736,
        updateTime: 1618388986736,
        createId: "536466902713573376",
        updateId: "536466902713573376",
        children: []
      }
    ]
  },
  {
    menuId: 42,
    code: "3qh5VP",
    router: "/information",
    icon: "el-icon-s-comment",
    title: "资讯管理",
    titleEn: "Information management",
    type: 1,
    depth: 1,
    sort: null,
    parentId: 0,
    createTime: 1620116568150,
    updateTime: 1620116568150,
    createId: "542518030986289152",
    updateId: "542518030986289152",
    children: [
      {
        menuId: 43,
        code: "PP1PM8",
        router: "/information/notice",
        icon: "el-icon-folder",
        title: "公告列表",
        titleEn: "Announcement List",
        type: 1,
        depth: 2,
        sort: null,
        parentId: 42,
        createTime: 1620116602833,
        updateTime: 1620116602833,
        createId: "542518030986289152",
        updateId: "542518030986289152",
        children: []
      },
      {
        menuId: 45,
        code: "w0S9wK",
        router: "/information/banner",
        icon: "el-icon-folder",
        title: "轮播图列表",
        titleEn: "Carousel Chart List",
        type: 1,
        depth: 2,
        sort: null,
        parentId: 42,
        createTime: 1620126377620,
        updateTime: 1620126377620,
        createId: "542518030986289152",
        updateId: "542518030986289152",
        children: []
      }
    ]
  },
]

export { childrenRouterMap };