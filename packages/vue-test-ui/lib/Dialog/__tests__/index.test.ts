import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import Dialog from "../index.vue";
import { nextTick } from "vue";

// Mock the transition end event
const mockTransitionEnd = () => {
  const event = new Event("transitionend");
  document.querySelector(".fe-dialog")?.dispatchEvent(event);
};

describe("Dialog Component", () => {
  beforeEach(() => {
    // Clear body before each test
    document.body.innerHTML = "";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly when visible", async () => {
    mount(Dialog, {
      props: {
        modelValue: true,
      },
    });

    await nextTick();
    expect(document.querySelector(".fe-dialog")).toBeTruthy();
    expect(document.querySelector(".fe-dialog-mask")).toBeTruthy();
  });

  it("should not render when modelValue is false", () => {
    mount(Dialog, {
      props: {
        modelValue: false,
      },
    });

    expect(document.querySelector(".fe-dialog")).toBeFalsy();
  });

  it("should emit update:modelValue when mask is clicked and maskClosable is true", async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        maskClosable: true,
      },
    });

    await nextTick();
    const content = document.querySelector(".fe-dialog-content") as HTMLElement;
    content.click();

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
  });

  it("should not emit update:modelValue when mask is clicked and maskClosable is false", async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        maskClosable: false,
      },
    });

    await nextTick();
    const content = document.querySelector(".fe-dialog-content") as HTMLElement;
    content.click();

    expect(wrapper.emitted("update:modelValue")).toBeFalsy();
  });

  it("should call afterOpen when dialog opens", async () => {
    const afterOpen = vi.fn();
    mount(Dialog, {
      props: {
        modelValue: true,
        afterOpen,
      },
    });

    await nextTick();

    const dialog = document.querySelector(".fe-dialog");
    expect(dialog).toBeTruthy();

    // 验证 visible class 被添加
    await nextTick();
    expect(dialog?.classList.contains("visible")).toBe(true);

    // 验证 afterOpen 被调用
    expect(afterOpen).toHaveBeenCalled();
  });

  it("should call afterClose when dialog closes", async () => {
    const afterClose = vi.fn();
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        afterClose,
      },
    });

    await nextTick();
    await wrapper.setProps({ modelValue: false });
    mockTransitionEnd();

    expect(afterClose).toHaveBeenCalled();
  });

  it("should destroy content when destroyOnClose is true", async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
        destroyOnClose: true,
      },
      slots: {
        default: "<div class='test-content'>Test Content</div>",
      },
    });

    await nextTick();
    expect(document.querySelector(".test-content")).toBeTruthy();

    await wrapper.setProps({ modelValue: false });
    mockTransitionEnd();
    await nextTick();

    expect(document.querySelector(".test-content")).toBeFalsy();
  });

  it("should apply custom styles and classes (using normalization)", async () => {
    mount(Dialog, {
      props: {
        modelValue: true,
        maskStyle: { backgroundColor: "rgba(0,0,0,0.8)" },
        maskClass: "custom-mask",
        bodyStyle: { padding: "20px" },
        bodyClass: "custom-body",
      },
    });

    await nextTick();
    const mask = document.querySelector(".fe-dialog-mask");
    const body = document.querySelector(".fe-dialog-body");

    expect(mask?.classList.contains("custom-mask")).toBe(true);
    expect(body?.classList.contains("custom-body")).toBe(true);

    // 标准化颜色值（移除所有空格）
    const normalizeColor = (color: string) => color.replace(/\s+/g, "");
    expect(normalizeColor((mask as HTMLElement).style.backgroundColor)).toBe(
      normalizeColor("rgba(0,0,0,0.8)")
    );
    expect((body as HTMLElement).style.padding).toBe("20px");
  });

  it("should work with exposed methods", async () => {
    const wrapper = mount(Dialog);
    const dialog = wrapper.vm;

    // Test open method
    dialog.open();
    await nextTick();
    expect(document.querySelector(".fe-dialog")).toBeTruthy();

    // Test close method
    dialog.close();
    await nextTick();
    mockTransitionEnd();
    expect(
      document.querySelector(".fe-dialog")?.classList.contains("visible")
    ).toBe(false);
  });

  describe("Dialog visibility control", () => {
    it("should work with v-model", async () => {
      const wrapper = mount(Dialog, {
        props: {
          modelValue: false,
        },
      });

      await wrapper.setProps({ modelValue: true });
      await nextTick();
      await nextTick();
      expect(
        document.querySelector(".fe-dialog")?.classList.contains("visible")
      ).toBe(true);

      await wrapper.setProps({ modelValue: false });
      await nextTick();
      mockTransitionEnd();
      await nextTick();
      expect(
        document.querySelector(".fe-dialog")?.classList.contains("visible")
      ).toBe(false);
    });

    it("should work with internal state", async () => {
      const wrapper = mount(Dialog);
      const dialog = wrapper.vm;

      // Test opening
      dialog.open();
      await nextTick();
      await nextTick();
      expect(
        document.querySelector(".fe-dialog")?.classList.contains("visible")
      ).toBe(true);

      // Test closing
      dialog.close();
      mockTransitionEnd();
      await nextTick();
      expect(
        document.querySelector(".fe-dialog")?.classList.contains("visible")
      ).toBe(false);
    });
  });

  it("should provide close method to slot content", async () => {
    const wrapper = mount(Dialog, {
      props: {
        modelValue: true,
      },
      slots: {
        default: `
          <template #default="{ close }">
            <button class="close-btn" @click="close">Close</button>
          </template>
        `,
      },
    });

    await nextTick();

    // 验证对话框已打开
    expect(document.querySelector(".fe-dialog")).toBeTruthy();

    // 点击关闭按钮
    const closeBtn = document.querySelector(".close-btn") as HTMLElement;
    await closeBtn.click();

    // 验证 update:modelValue 事件被触发
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
  });

  it("should handle rapid open/close transitions correctly", async () => {
    const afterOpen = vi.fn();
    const afterClose = vi.fn();
    const onOpen = vi.fn();
    const onClose = vi.fn();

    const wrapper = mount(Dialog, {
      props: {
        modelValue: false,
        afterOpen,
        afterClose,
      },
      // 正确的事件监听方式
      attrs: {
        onOnOpen: onOpen, // 注意这里的命名，Vue会自动处理
        onOnClose: onClose,
      },
    });

    // 打开对话框
    await wrapper.setProps({ modelValue: true });
    await nextTick();

    // 在transition完成之前立即关闭
    await wrapper.setProps({ modelValue: false });
    await nextTick();

    // 在关闭过程中又打开
    await wrapper.setProps({ modelValue: true });
    await nextTick();

    // 验证元素状态
    const dialog = document.querySelector(".fe-dialog");
    expect(dialog).toBeTruthy();
    expect(dialog?.classList.contains("visible")).toBe(true);

    // 验证回调函数调用次数
    expect(afterOpen).toHaveBeenCalledTimes(2); // 两次打开
    expect(onOpen).toHaveBeenCalledTimes(2);
    expect(afterClose).toHaveBeenCalledTimes(0); // close 被打断，没有触发
    expect(onClose).toHaveBeenCalledTimes(0);
  });

  it("should cleanup resources properly during interruption", async () => {
    const wrapper = mount(Dialog);
    const vm = wrapper.vm;

    // 打开对话框
    vm.open();
    await nextTick();
    await nextTick();

    // 验证元素状态
    let dialog = document.querySelector(".fe-dialog");
    expect(dialog?.classList.contains("visible")).toBe(true);

    // 在transition进行中时关闭
    vm.close();
    await nextTick();

    // 立即再次打开
    vm.open();
    await nextTick();
    await nextTick(); // 等待新的 visible class 添加

    // 验证最终状态
    dialog = document.querySelector(".fe-dialog");
    expect(dialog?.classList.contains("visible")).toBe(true);

    // 验证事件监听器是否被正确移除
    const listeners = (dialog as any)._vei?.transitionend?.length ?? 0;
    expect(listeners).toBeLessThanOrEqual(1); // 应该只有当前的监听器
  });

  it("should handle multiple rapid state changes", async () => {
    const wrapper = mount(Dialog);
    const vm = wrapper.vm;

    // 快速切换状态
    for (let i = 0; i < 5; i++) {
      vm.open();
      await nextTick();
      vm.close();
      await nextTick();
    }

    // 最后打开状态
    vm.open();
    await nextTick();
    await nextTick();

    const dialog = document.querySelector(".fe-dialog");
    expect(dialog?.classList.contains("visible")).toBe(true);
  });

  it("should not leak event listeners during rapid state changes", async () => {
    const wrapper = mount(Dialog);
    const vm = wrapper.vm;

    // 快速切换状态多次
    for (let i = 0; i < 3; i++) {
      vm.open();
      await nextTick();
      await nextTick();

      vm.close();
      await nextTick();

      // 在关闭动画完成前打开
      vm.open();
      await nextTick();
      await nextTick();
    }

    const dialog = document.querySelector(".fe-dialog");
    // 检查是否只有一个 transitionend 监听器
    const listeners = (dialog as any)._vei?.transitionend?.length ?? 0;
    expect(listeners).toBeLessThanOrEqual(1);
  });
});
