import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { Tabs, TabPane } from "@/components/Tabs";
import { nextTick, ref } from "vue";

describe("Tabs", () => {
	// 测试场景1：默认选中第一项
	it("should render default tabs and switch correctly", async () => {
		const wrapper = mount(() => (
			<Tabs>
				<TabPane label="Tab 1" name="1">
					Content 1
				</TabPane>
				<TabPane label="Tab 2" name="2">
					Content 2
				</TabPane>
			</Tabs>
		));

		// 验证默认渲染
		expect(wrapper.text()).toContain("Tab 1");
		expect(wrapper.text()).toContain("Tab 2");
		expect(wrapper.text()).toContain("Content 1");
		expect(wrapper.find(".fe-tabs__content div").isVisible()).toBe(true);

		// 点击第二个tab
		await wrapper.findAll(".fe-tabs__item")[1].trigger("click");
		expect(wrapper.findAll(".fe-tabs__content div")[1].isVisible()).toBe(true);
	});

	// 测试场景2：v-model绑定，默认选中第二项
	it("should work with v-model binding", async () => {
		const activeTab = ref("2");
		const wrapper = mount(() => (
			<Tabs v-model={activeTab.value}>
				<TabPane label="Tab 1" name="1">
					Content 1
				</TabPane>
				<TabPane label="Tab 2" name="2">
					Content 2
				</TabPane>
			</Tabs>
		));

		// 验证默认选中第二项
		expect(wrapper.findAll(".fe-tabs__content div")[1].isVisible()).toBe(true);

		// 点击第一个tab
		await wrapper.findAll(".fe-tabs__item")[0].trigger("click");
		expect(activeTab.value).toBe("1");
	});

	// 测试场景3：插槽用法
	it("should work with slot and active status", async () => {
		const activeTab = ref("2");
		const wrapper = mount(() => (
			<Tabs v-model={activeTab.value}>
				<TabPane
					name="1"
					v-slots={{
						label: ({ active }: { active: boolean }) =>
							`Tab 1 ${active ? "active" : ""}`,
					}}
				>
					Content 1
				</TabPane>
				<TabPane label="Tab 2" name="2">
					Content 2
				</TabPane>
			</Tabs>
		));

		// 验证插槽渲染
		expect(wrapper.text()).toContain("Tab 1");
		expect(wrapper.text()).not.toContain("Tab 1 active");

		// 点击第一个tab，验证active状态
		await wrapper.findAll(".fe-tabs__item")[0].trigger("click");
		expect(wrapper.text()).toContain("Tab 1 active");
	});

	// 边界情况：空 TabPane
	it("should handle empty tabs gracefully", () => {
		const wrapper = mount(() => <Tabs></Tabs>);
		expect(wrapper.find(".fe-tabs__header").exists()).toBe(true);
		expect(wrapper.find(".fe-tabs__content").exists()).toBe(true);
		expect(wrapper.findAll(".fe-tabs__item").length).toBe(0);
	});

	// 动态添加/删除 TabPane
	it("should handle dynamic tabs", async () => {
		const showSecondTab = ref(true);
		const wrapper = mount(() => (
			<Tabs>
				<TabPane label="Tab 1" name="1">
					Content 1
				</TabPane>
				{showSecondTab.value && (
					<TabPane label="Tab 2" name="2">
						Content 2
					</TabPane>
				)}
			</Tabs>
		));

		expect(wrapper.findAll(".fe-tabs__item").length).toBe(2);

		showSecondTab.value = false;
		await nextTick();
		expect(wrapper.findAll(".fe-tabs__item").length).toBe(1);
	});

	// 样式类测试
	it("should apply correct active classes", async () => {
		const wrapper = mount(() => (
			<Tabs>
				<TabPane label="Tab 1" name="1">
					Content 1
				</TabPane>
				<TabPane label="Tab 2" name="2">
					Content 2
				</TabPane>
			</Tabs>
		));

		const firstTab = wrapper.findAll(".fe-tabs__item")[0];
		expect(firstTab.classes()).toContain("is-active");

		await wrapper.findAll(".fe-tabs__item")[1].trigger("click");
		expect(wrapper.findAll(".fe-tabs__item")[1].classes()).toContain(
			"is-active"
		);
		expect(firstTab.classes()).not.toContain("is-active");
	});

	// 异步内容加载
	it("should handle async content", async () => {
		const asyncContent = ref("Loading...");
		setTimeout(() => {
			asyncContent.value = "Loaded Content";
		}, 100);

		const wrapper = mount(() => (
			<Tabs>
				<TabPane label="Async Tab" name="1">
					{asyncContent.value}
				</TabPane>
			</Tabs>
		));

		expect(wrapper.text()).toContain("Loading...");

		await new Promise((resolve) => setTimeout(resolve, 100));
		await nextTick();

		expect(wrapper.text()).toContain("Loaded Content");
	});

	// 禁用状态测试
	// it("should handle disabled tabs", async () => {
	// 	const wrapper = mount(() => (
	// 		<Tabs>
	// 			<TabPane label="Tab 1" name="1">
	// 				Content 1
	// 			</TabPane>
	// 			<TabPane label="Tab 2" name="2" disabled>
	// 				Content 2
	// 			</TabPane>
	// 		</Tabs>
	// 	));

	// 	const disabledTab = wrapper.findAll(".fe-tabs__item")[1];
	// 	expect(disabledTab.classes()).toContain("is-disabled");

	// 	await disabledTab.trigger("click");
	// 	// 确保内容没有切换
	// 	expect(wrapper.findAll(".fe-tabs__content div")[0].isVisible()).toBe(true);
	// });
});
