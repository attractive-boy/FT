import { Component, VNode } from "vue";

export type ActionSheetOptions = {
  // 是否显示 dialog defalut: true
  visible?: boolean;
  // dialog 的标题
  title?: string;
  // 是否允许关闭 defalut: true
  closeAbled?: boolean;
  props?: any;
  renderContent: () => VNode | Component;

  beforeSure?: (done, options: ActionSheetOptions) => void;
  beforeClose?: (done, options: ActionSheetOptions) => void;
  closeCallBack?: () => void;
};
