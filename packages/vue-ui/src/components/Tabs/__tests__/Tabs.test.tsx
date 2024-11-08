import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { Tabs, TabPane } from "@/components/Tabs";
import { nextTick, ref } from "vue";

describe("Tabs", () => {
	// 默认选中第一项
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

	// v-model绑定string，初始选中第二项
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

	// v-model绑定number，初始选中第二项
	it("should work with v-model binding number", async () => {
		const activeTab = ref(2);
		const wrapper = mount(() => (
			<Tabs v-model={activeTab.value}>
				<TabPane label="Tab 1" name={1}>
					Content 1
				</TabPane>
				<TabPane label="Tab 2" name={2}>
					Content 2
				</TabPane>
			</Tabs>
		));

		// 验证默认选中第二项
		expect(wrapper.findAll(".fe-tabs__content div")[1].isVisible()).toBe(true);

		// 点击第一个tab
		await wrapper.findAll(".fe-tabs__item")[0].trigger("click");
		expect(activeTab.value).toBe(1);
	});

	// 插槽用法
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

	// 循环渲染 TabPane
	it("should work with v-for rendered TabPanes", async () => {
		const list = ref([
			{ name: "1", label: "Tab 1", content: "Content 1" },
			{ name: "2", label: "Tab 2", content: "Content 2" },
			{ name: "3", label: "Tab 3", content: "Content 3" },
		]);
		const activeTab = ref("1");

		const wrapper = mount({
			setup() {
				return () => (
					<Tabs v-model={activeTab.value}>
						{{
							default: () =>
								list.value.map((item) => (
									<TabPane key={item.name} name={item.name} label={item.label}>
										{item.content}
									</TabPane>
								)),
						}}
					</Tabs>
				);
			},
		});

		expect(wrapper.findAll(".fe-tabs__item").length).toBe(3);
		list.value.push({ name: "4", label: "Tab 4", content: "Content 4" });
		await nextTick();
		expect(wrapper.findAll(".fe-tabs__item").length).toBe(4);
	});

	// 测试 headerClass 和 contentClass props
	it("should apply custom classes via headerClass and contentClass props", () => {
		const wrapper = mount(() => (
			<Tabs headerClass="custom-header" contentClass="custom-content">
				<TabPane label="Tab 1" name="1">
					Content 1
				</TabPane>
				<TabPane label="Tab 2" name="2">
					Content 2
				</TabPane>
			</Tabs>
		));

		expect(wrapper.find(".fe-tabs__header").classes()).toContain(
			"custom-header"
		);
		expect(wrapper.find(".fe-tabs__content").classes()).toContain(
			"custom-content"
		);
	});

	// 测试动态 class 绑定
	it("should handle dynamic class bindings", async () => {
		const headerClass = ref("header-1");
		const contentClass = ref("content-1");

		const wrapper = mount(() => (
			<Tabs headerClass={headerClass.value} contentClass={contentClass.value}>
				<TabPane label="Tab 1" name="1">
					Content 1
				</TabPane>
			</Tabs>
		));

		expect(wrapper.find(".fe-tabs__header").classes()).toContain("header-1");
		expect(wrapper.find(".fe-tabs__content").classes()).toContain("content-1");

		headerClass.value = "header-2";
		contentClass.value = "content-2";
		await nextTick();

		expect(wrapper.find(".fe-tabs__header").classes()).toContain("header-2");
		expect(wrapper.find(".fe-tabs__content").classes()).toContain("content-2");
	});

	// 测试默认插槽内容不被渲染的情况
	it("should not render non-TabPane default slot content", () => {
		const wrapper = mount(() => (
			<Tabs>
				<TabPane label="Tab 1" name="1">
					Content 1
				</TabPane>
				<div class="non-tab-content">This should not be rendered</div>
				<span>This should also not be rendered</span>
			</Tabs>
		));

		expect(wrapper.find(".non-tab-content").exists()).toBe(false);
		expect(wrapper.text()).not.toContain("This should not be rendered");
		expect(wrapper.text()).not.toContain("This should also not be rendered");
		expect(wrapper.text()).toContain("Content 1");
	});
});
