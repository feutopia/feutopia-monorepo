import { defineComponent } from "vue";
import { useNamespace } from "@/hooks";

export const TabPane = defineComponent({
	props: {
		name: {
			type: String,
			required: true,
		},
		label: {
			type: String,
		},
	},
	setup(_props, { slots }) {
		const { b } = useNamespace("tab");
		return () => <div class={b("pane")}>{slots.default?.()}</div>;
	},
});
