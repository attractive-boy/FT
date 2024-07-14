type MenuItems = {
  name?: string;
  subname?: string;
  color?: string;
  loading?: boolean;
  disable?: boolean;
};

export type ControlOptions = {
  visible?: boolean;
  // control 的标题，默认显示为操作
  title?: string;
  // 取消按钮的文本，默认显示为取消
  cancelTxt?: string;
  // 是否允许关闭 defalut: true
  closeAbled?: boolean;
  // 列表项
  menuItems?: MenuItems[];
  // 选中参数的回调 'center';
  selectCallBack: ({ item, index, done }) => void;
};
