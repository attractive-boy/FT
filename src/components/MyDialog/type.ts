import { VNode } from "vue";

export type DialogOptions = {
  // 是否显示 dialog defalut: true
  visible?: boolean;
  // dialog 的标题
  title?: string;
  // dialog 的宽度, 通过当前屏幕宽度计算，默认90%, 计算法为：屏幕宽度100% - width px
  width?: number;
  // 内容，支持 HTML 和组件
  content?: string | VNode;
  // 指定挂载节点 defalut: "body"
  teleport?: string;
  // 是否隐藏底部按钮 defalut: false
  noFooter?: boolean;
  // 是否隐藏确定按钮 defalut: false
  noOkBtn?: boolean;
  // 是否隐藏取消按钮 defalut: false
  noCancelBtn?: boolean;
  // 取消按钮文字 default: ”取消“
  cancelText?: string;
  // 确认按钮文字 default: ”确定“
  okText?: string;
  // 内容 VNode
  component?: () => VNode;
  // 点击遮罩层是否关闭 dialog defalut: true
  closeOnClickOverlay?: boolean;
  // 是否在页面回退时自动关闭 defalut: false
  closeOnPopstate?: boolean;
  // 背景是否锁定 defalut: true
  lockScroll?: boolean;
  // 使用横纵方向 可选值 horizontal、vertical defalut: "horizontal"
  footerDirection?: "horizontal" | "vertical";
  // 文字对齐方向，可选值同 css 的 text-align  defalut: "center"
  textAlign?: string;
  // 动画持续时间（默认 200ms）
  duration?: number;
  // 点击选项后是否关闭 dialog
  closeOnClickAction?: boolean;
  // 点击取消按钮的回调
  beforeCancel?: (done: () => void) => void;
  //   // 关闭后的回调
  //   closeCallback?: () => void;
  //   // 确认之前的回调
  //   beforeSure?: (done: () => void) => void;
  // 点击确认按钮的回调
  beforeSure?: (done: () => void) => void;
  closeCallback?: () => void;
};
