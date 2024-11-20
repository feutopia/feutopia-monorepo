<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  shallowRef,
  watch,
  WatchStopHandle,
} from "vue";

import { DialogProps } from "./type";

// 定义 Props
const props = withDefaults(defineProps<DialogProps>(), {
  modelValue: undefined, // 这里需要显示的指定 undefined，否则会被识别为 false
  mask: true,
  maskClosable: true,
});

// 定义事件
const emit = defineEmits(["update:modelValue", "onOpen", "onClose"]);

// 内部可见状态
const internalVisible = ref(false);

// 统一的可见状态
const visible = computed({
  get: () => {
    return props.modelValue ?? internalVisible.value;
  },
  set: (val) => {
    if (props.modelValue !== undefined) {
      emit("update:modelValue", val); // 外部管理
    } else {
      internalVisible.value = val; // 内部管理
    }
  },
});

// 打开对话框
const open = () => {
  visible.value = true;
};

// 关闭对话框
const close = () => {
  visible.value = false;
};

const isRendered = ref(false);
const isVisible = ref(false);

const dialogElement = shallowRef<HTMLElement | null>(null);
const contentElement = shallowRef<HTMLElement | null>(null);

// 监听点击 mask
const onDialogClick = (e: MouseEvent) => {
  if (e.target === contentElement.value && props.maskClosable) {
    close();
  }
};

// 打开对话框
const handleOpen = async (dialog: HTMLElement) => {
  isVisible.value = true;
  await nextTick();
  dialog.offsetHeight; // 强制重绘
  dialog.classList.add("visible");
  emit("onOpen");
  props.afterOpen?.();
};

// 关闭对话框
let transitionController: AbortController | null = null;
const handleClose = (dialog: HTMLElement) => {
  transitionController = new AbortController();
  dialog.addEventListener(
    "transitionend",
    () => {
      isVisible.value = false;
      if (props.destroyOnClose) {
        isRendered.value = false;
      }
      emit("onClose");
      props.afterClose?.();
    },
    { once: true, signal: transitionController.signal }
  );
  dialog.classList.remove("visible");
};

// 动态监听对话框元素变化
let stopWatch: WatchStopHandle | null = null;
const watchDialogElement = () => {
  stopWatch = watch(
    () => dialogElement.value,
    (dialog) => {
      if (dialog) {
        handleOpen(dialog);
      }
    },
    {
      once: true,
    }
  );
};

const updateDialogVisibility = (isVisible: boolean) => {
  const dialog = dialogElement.value;
  if (isVisible) {
    if (dialog) {
      handleOpen(dialog);
    } else {
      isRendered.value = true;
      watchDialogElement();
    }
  } else if (dialog) {
    handleClose(dialog);
  }
};

// 清理资源
const clearResources = () => {
  if (transitionController) {
    transitionController.abort();
    transitionController = null;
  }
  if (stopWatch) {
    stopWatch();
    stopWatch = null;
  }
};

// 监听 visible 变化
watch(
  visible,
  (newVal) => {
    clearResources();
    updateDialogVisibility(newVal);
  },
  {
    immediate: true,
  }
);

// 卸载时清理资源
onBeforeUnmount(() => {
  clearResources();
});

// 暴露打开和关闭对话框的函数
defineExpose({
  open,
  close,
});
</script>

<!-- Dialog.vue -->
<template>
  <Teleport to="body">
    <div
      class="fe-dialog"
      ref="dialogElement"
      @click="onDialogClick"
      v-if="isRendered"
      v-show="isVisible"
    >
      <div
        class="fe-dialog-mask"
        v-if="mask"
        :style="maskStyle"
        :class="maskClass"
      ></div>
      <div class="fe-dialog-content" ref="contentElement">
        <div class="fe-dialog-body" :style="bodyStyle" :class="bodyClass">
          <slot :close="close"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
$Z_INDEX: 1000;

.fe-dialog {
  position: absolute;
  left: 0;
  top: 0;
  z-index: $Z_INDEX;
  opacity: 0;
  transition: opacity 0.3s ease;
  &.visible {
    opacity: 1;
  }
}

.fe-dialog-content {
  position: fixed;
  inset: 0;
  overflow: auto;
  display: flex;
}

.fe-dialog-body {
  margin: auto;
}

.fe-dialog-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}
</style>
