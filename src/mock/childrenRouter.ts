const childrenRouter = [
  {	
    createTime:"2020-01-05 14:51:05",
    hasChild:false,
    id:1,
    name:"",
    parentId:1,
    remarks:"用户管理",
    router:"/user/list",
    title:"用户管理",
    type:"el-icon-user-solid",
    icon: "el-icon-folder-opened",
    leaf: false,
    children:[
      {
        children:[],
        createId:-10,
        createTime:"2020-01-05 14:51:05",
        hasChild:false,
        id:10,
        name:"",
        parentId:10,
        remarks:"用户列表",
        router:"/user/list",
        title:"用户列表",
        type:"ios-person",
        icon: "el-icon-folder",
        leaf: true,
        updateId:30,
        updateTime:"2020-01-13 15:53:17" },
        {
          children:[],
          createId:-10,
          createTime:"2020-01-05 14:51:05",
          hasChild:false,
          id:17,
          name:"",
          parentId:17,
          remarks:"等级列表",
          router:"/user/grade",
          title:"等级列表",
          type:"ios-person",
          icon: "el-icon-folder",
          leaf: true,
          updateId:30,
          updateTime:"2020-01-13 15:53:17" },
    ]
  },
  {	
    createTime:"2020-01-05 14:51:05",
    hasChild:false,
    id:2,
    name:"",
    parentId:2,
    remarks:"合约管理",
    router:"/contract/list",
    title:"合约管理",
    type:"el-icon-star-on",
    icon: "el-icon-folder-opened",
    leaf: false,
    children:[
      {
        children:[],
        createId:-10,
        createTime:"2020-01-05 14:51:05",
        hasChild:false,
        id:11,
        name:"",
        parentId:11,
        remarks:"合约列表",
        router:"/contract/list",
        title:"合约列表",
        type:"ios-person",
        icon: "el-icon-folder",
        leaf: true,
        updateId:30,
        updateTime:"2020-01-13 15:53:17" 
      }, {
        children:[],
        createId:-10,
        createTime:"2020-01-05 14:51:05",
        hasChild:false,
        id:12,
        name:"",
        parentId:12,
        remarks:"合约任务列表",
        router:"/contract/tack",
        title:"合约任务列表",
        type:"ios-person",
        icon: "el-icon-folder",
        leaf: true,
        updateId:30,
        updateTime:"2020-01-13 15:53:17"
        
      }, {
        children:[],
        createId:-10,
        createTime:"2020-01-05 14:51:05",
        hasChild:false,
        id:13,
        name:"",
        parentId:13,
        remarks:"合约限时折扣列表",
        router:"/contract/activity",
        title:"合约限时折扣列表",
        type:"ios-person",
        icon: "el-icon-folder",
        leaf: true,
        updateId:30,
        updateTime:"2020-01-13 15:53:17"
        
      }
    ]
  },
  {	
    createTime:"2020-01-05 14:51:05",
    hasChild:false,
    id:3,
    name:"",
    parentId:3,
    remarks:"优惠券管理",
    router:"/coupon/list",
    title:"优惠券管理",
    type:"el-icon-s-ticket",
    icon: "el-icon-folder-opened",
    leaf: false,
    children:[
      {
        children:[],
        createId:-10,
        createTime:"2020-01-05 14:51:05",
        hasChild:false,
        id:14,
        name:"",
        parentId:14,
        remarks:"优惠券列表",
        router:"/coupon/list",
        title:"优惠券列表",
        type:"ios-person",
        icon: "el-icon-folder",
        leaf: true,
        updateId:30,
        updateTime:"2020-01-13 15:53:17" },
    ]
  },
  {	
    createTime:"2020-01-05 14:51:05",
    hasChild:false,
    id:3,
    name:"",
    parentId:3,
    remarks:"推广图管理",
    router:"/extension",
    title:"推广图管理",
    type:"el-icon-share",
    icon: "el-icon-folder-opened",
    leaf: false,
    children:[
      {
        children:[],
        createId:-10,
        createTime:"2020-01-05 14:51:05",
        hasChild:false,
        id:14,
        name:"",
        parentId:14,
        remarks:"用户推广图",
        router:"/extension",
        title:"用户推广图",
        type:"ios-person",
        icon: "el-icon-folder",
        leaf: true,
        updateId:30,
        updateTime:"2020-01-13 15:53:17" },
    ]
  },
  {	
    createTime:"2020-01-05 14:51:05",
    hasChild:false,
    id:9,
    name:"",
    parentId:9,
    remarks:"权限管理",
    router:"/system/route",
    title:"权限管理",
    type:"el-icon-s-tools",
    icon: "el-icon-folder-opened",
    leaf: false,
    children:[
      {
        children:[],
        createId:-10,
        createTime:"2020-01-05 14:51:05",
        hasChild:false,
        id:15,
        name:"",
        parentId:15,
        remarks:"路由配置",
        router:"/system/route",
        title:"路由配置",
        type:"ios-person",
        icon: "el-icon-folder",
        leaf: true,
        updateId:30,
        updateTime:"2020-01-13 15:53:17" 
      },
      {
        children:[],
        createId:-10,
        createTime:"2020-01-05 14:51:05",
        hasChild:false,
        id:16,
        name:"",
        parentId:16,
        remarks:"管理员列表",
        router:"/system/user",
        title:"管理员列表",
        type:"ios-person",
        icon: "el-icon-folder",
        leaf: true,
        updateId:30,
        updateTime:"2020-01-13 15:53:17" 
      },
    ]
  }
]


export { childrenRouter };