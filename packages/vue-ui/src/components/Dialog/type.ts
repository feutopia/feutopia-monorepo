import { CSSProperties } from "vue";

export interface DialogProps {
  modelValue?: boolean;
  destroyOnClose?: boolean;
  afterOpen?: () => void;
  afterClose?: () => void;
  mask?: boolean;
  maskClosable?: boolean;
  maskStyle?: CSSProperties;
  maskClass?: string;
  bodyStyle?: CSSProperties;
  bodyClass?: string;
}
