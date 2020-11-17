// 递归遍历
const TreeForeach =  (tree: any, func: any) => {
  if (!tree || typeof tree !== 'object') return null;
  tree.forEach((data: { children: any; }) => {
    if (typeof data.children === 'object') {
      TreeForeach(data.children, func);   // 函数调用函数自身
    } else {
      func(data);                         // 递归出口
    }
  });
};

export { TreeForeach };