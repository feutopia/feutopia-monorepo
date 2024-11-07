import { defineComponent, nextTick, onMounted, ref } from "vue";
import { Tabs, TabPane } from "@/components";
import "./tabs.scss";

export default defineComponent({
	setup() {
		const activeTab = ref("tab1");
		const list = ref([
			{ name: "1", label: "Tab 1", content: "Content 1" },
			{ name: "2", label: "Tab 2", content: "Content 2" },
			{ name: "3", label: "Tab 3", content: "Content 3" },
		]);
		const addTab = async () => {
			list.value.push({
				name: "4",
				label: "Tab 4",
				content: "Content 4",
			});
			await nextTick();
			console.log(document.querySelectorAll(".fe-tabs__item").length);
		};

		// 如果需要自动添加，可以使用 onMounted
		onMounted(() => {
			addTab();
		});

		return () => (
			<div style="padding: 20px">
				<h2>Basic Tabs Demo</h2>

				{/* 基础用法 */}
				<Tabs v-model={activeTab.value}>
					<TabPane name="tab1" label="Tab 1">
						Content 1
					</TabPane>
					<TabPane name="tab2" label="Tab 2">
						Content 2
					</TabPane>
					<TabPane name="tab3" label="Tab 3">
						Content 3
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

				{/* 动态添加标签 */}
				<h2>Dynamic Add Tab Demo</h2>
				<Tabs>
					{list.value.map((item) => (
						<TabPane name={item.name} label={item.label}>
							{item.content}
						</TabPane>
					))}
				</Tabs>
			</div>
		);
	},
});
