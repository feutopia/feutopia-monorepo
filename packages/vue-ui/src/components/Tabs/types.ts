import { RendererElement, RendererNode, VNode } from "vue";
import type { CSSProperties } from "vue";

export type TabVNode = VNode<
	RendererNode,
	RendererElement,
	{
		label?: string;
		name?: string;
		style?: CSSProperties;
	}
> & {
	children?: {
		label?: (props: { active?: boolean }) => VNode;
	} | null;
};
