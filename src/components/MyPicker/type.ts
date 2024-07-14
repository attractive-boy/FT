import { VNode } from "vue";

export type PickerOptions = {
  // 是否显示 Picker defalut: true
  visible?: boolean;
  // Picker 的标题
  title?: string;
  // 默认选中项
  modelValue?: any;
  // 自定义 columns 中的字段 default: { text: 'text', value: 'value', children: 'children', className: 'className' }
  fieldNames?: object;
  // Picker 的数据源，格式为 { text: string, value: any }[] defalut: []
  columns?: PickerOption[] | PickerOption[][];
  // 取消按钮文案
  cancelText?: string;
  // 确定按钮文案
  okText?: string;
  // 惯性滚动时长 default: 1000ms
  swipeDuration?: number | string;
  // 可见的选项个数 default: 7
  visibleOptionNum?: number | string;
  // option-height default: 36
  optionHeight?: number | string;
  // 是否显示顶部栏 defalut: true
  showToolbar?: boolean;
  // 点击确认事件
  onConfirm?: (evt: {
    selectedValue: any;
    selectedOptions: any;
    done: () => void;
  }) => void;
  // 点击取消事件 defalut: () => {}
  onCancel?: (evt: {
    selectedValue: any;
    selectedOptions: any;
    done: () => void;
  }) => void;
  // 选项发生改变时触发 defalut: () => {}
  onChange?: (evt: {
    columnIndex: any;
    selectedValue: any;
    selectedOptions: any;
    done: () => void;
  }) => void;
};
