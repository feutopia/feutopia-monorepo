import { computed, defineComponent, ref, VNode, VNodeArrayChildren } from "vue";
import { TabVNode } from "./types";
import { useNamespace } from "@/hooks";

export const Tabs = defineComponent({
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
			const children = slots.default?.() || [];
			// 判断是否是具有 children 属性的 VNodeArrayChildren, 比如使用 v-for 渲染的组件
			const isVNodeWithChildren = (
				vnode: VNode | VNodeArrayChildren[number]
			): vnode is VNodeArrayChildren & { children: VNodeArrayChildren[] } =>
				Boolean(
					vnode &&
						typeof vnode === "object" &&
						"type" in vnode &&
						vnode.type.toString() === "Symbol(v-fgt)" &&
						Array.isArray(vnode.children)
				);
			const flattenVNodes = (
				children: VNode[] | VNodeArrayChildren
			): (VNode | VNode[])[] => {
				return children.map((vnode) => {
					if (isVNodeWithChildren(vnode)) {
						return flattenVNodes(vnode.children).flat();
					}
					return vnode as VNode;
				});
			};
			return flattenVNodes(children)
				.flat()
				.filter((vnode) => typeof vnode.type !== "symbol");
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
