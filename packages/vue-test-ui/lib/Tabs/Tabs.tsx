import { computed, defineComponent, ref, VNode, VNodeArrayChildren } from "vue";
import { TabVNode } from "./types";
import { useNamespace } from "@feutopia/vue-hooks";
import { TabPane } from "./TabPane";

const TAB_PANE_NAME = TabPane.name || "";

type VNodeArrayItem = VNodeArrayChildren[number];
type VNodeWithName = VNode & { type: { name: string } };

const isVnodeWithType = (vnode: VNodeArrayItem) =>
  vnode !== null && typeof vnode === "object" && "type" in vnode;

export const Tabs = defineComponent({
  name: "Tabs",
  props: {
    modelValue: {
      type: [String, Number],
    },
    headerClass: {
      type: String,
    },
    contentClass: {
      type: String,
    },
  },
  setup(props, { slots, emit }) {
    const { e, b, is } = useNamespace("tabs");
    const defaultSlots = computed(() => {
      const slotChildren = slots.default?.() || [];

      // 判断是否是具有 children 属性的 VNodeArrayChildren, 比如使用 v-for 渲染的组件
      const isVNodeWithChildren = (
        vnode: VNodeArrayItem
      ): vnode is VNodeArrayChildren & { children: VNodeArrayChildren } =>
        isVnodeWithType(vnode) && Array.isArray(vnode.children);

      // 判断是否是具有 name 属性的 VNode
      const isVNodeWithName = (
        vnode: VNodeArrayItem,
        name: string
      ): vnode is VNodeWithName =>
        isVnodeWithType(vnode) && (vnode as VNodeWithName).type?.name === name;

      // 获取所有具有 name 属性是 TAB_PANE_NAME 的 VNode
      const getTabPanes = (nodes: VNodeArrayChildren) => {
        const vnodes: VNode[] = [];
        for (const vnode of nodes) {
          if (isVNodeWithChildren(vnode)) {
            vnodes.push(...getTabPanes(vnode.children));
          } else {
            if (isVNodeWithName(vnode, TAB_PANE_NAME)) {
              vnodes.push(vnode);
            }
          }
        }
        return vnodes;
      };
      return getTabPanes(slotChildren);
    });
    const hasModelValue = computed(() => props.modelValue !== undefined);
    const activeIndex = ref(0);
    const getTabDisplay = computed(() => (vnode: TabVNode, index: number) => {
      if (hasModelValue.value) {
        return props.modelValue == vnode.props?.name;
      }
      return activeIndex.value === index;
    });
    return () => (
      <div class={b()}>
        <div class={[e("header"), props.headerClass]}>
          {defaultSlots.value?.map((vnode: TabVNode, index: number) => {
            const handleClick = () => {
              if (hasModelValue.value) {
                emit("update:modelValue", vnode.props?.name);
              } else {
                activeIndex.value = index;
              }
            };
            const labelContent = vnode.props?.label;
            const active = getTabDisplay.value(vnode, index);
            return (
              <div
                onClick={handleClick}
                class={[e("item"), active, is("active", active)]}
              >
                {labelContent ||
                  vnode.children?.label?.({
                    active,
                  })}
              </div>
            );
          })}
        </div>
        <div class={[e("content"), props.contentClass]}>
          {defaultSlots.value?.map((vnode: TabVNode, index: number) => ({
            ...vnode,
            props: {
              ...vnode.props,
              style: {
                ...vnode.props?.style,
                display: getTabDisplay.value(vnode, index) ? "block" : "none",
              },
            },
          }))}
        </div>
      </div>
    );
  },
});
