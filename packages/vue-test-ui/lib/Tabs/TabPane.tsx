import { defineComponent } from "vue";
import { useNamespace } from "@feutopia/vue-hooks";

export const TabPane = defineComponent({
  name: "TabPane",
  props: {
    name: {
      type: [String, Number],
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
