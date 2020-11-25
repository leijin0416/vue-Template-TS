// 递归遍历
const TreeForeach =  (tree: any, func: any) => {
  if (!tree || typeof tree !== 'object') return null;
  tree.forEach((data: { children: any; }) => {
    if (typeof data.children === 'object' && data.children.length > 0) {
      TreeForeach(data.children, func);   // 函数调用函数自身
    } else {
      func(data);                         // 递归出口
    }
  });
};

// 去重
const FormatArrMapHas = (tree: any) => {
  let map = new Map();
  for (let item of tree) {
    if (!map.has(item.title)) {
      map.set(item.title, item);
    }
  }
  return [...map.values()];
};


export { TreeForeach, FormatArrMapHas };