import { computed, defineComponent, ref } from "vue";
import { TabVNode } from "./types";
import { useNamespace } from "@/hooks";
import "./style/index.scss";

export const Tabs = defineComponent({
	props: {
		modelValue: {
			type: [String, Number],
		},
	},
	setup(props, { slots, emit }) {
		const { e, b, is } = useNamespace("tabs");
		const defaultSlots = computed(() => {
			const slotsList = slots.default?.() || [];
			// 过滤掉条件渲染的节点, 如 v-if
			return slotsList.filter((vnode) => typeof vnode.type !== "symbol");
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
				<div class={[e("header")]}>
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
				<div class={e("content")}>
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
