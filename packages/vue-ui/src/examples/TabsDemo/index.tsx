import { defineComponent, ref } from "vue";
import { Tabs, TabPane } from "@/components";
import "./tabs.scss";

export default defineComponent({
	setup() {
		const activeTab = ref("tab1");

		return () => (
			<div style="padding: 20px">
				<h2>Basic Tabs Demo</h2>

				{/* 基础用法 */}
				<Tabs v-model={activeTab.value}>
					<TabPane name="tab1" label="Tab 1">
						Content of Tab 1
					</TabPane>
					<TabPane name="tab2" label="Tab 2">
						Content of Tab 2
					</TabPane>
					<TabPane name="tab3" label="Tab 3">
						Content of Tab 3
					</TabPane>
				</Tabs>

				{/* 自定义标签示例 */}
				<h2>Custom Label Demo</h2>
				<Tabs>
					<TabPane name="custom1">
						{{
							label: ({ active }: { active: boolean }) => (
								<div style={{ color: active ? "blue" : "black" }}>
									Custom Tab 1
								</div>
							),
							default: () => <div>Custom Content 1</div>,
						}}
					</TabPane>
					<TabPane name="custom2">
						{{
							label: ({ active }: { active: boolean }) => (
								<div style={{ color: active ? "blue" : "black" }}>
									Custom Tab 2
								</div>
							),
							default: () => <div>Custom Content 2</div>,
						}}
					</TabPane>
				</Tabs>
			</div>
		);
	},
});
