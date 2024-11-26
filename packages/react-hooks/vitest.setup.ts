import "@testing-library/jest-dom";

// 将测试函数设置为全局变量
declare global {
  var describe: (typeof import("vitest"))["describe"];
  var it: (typeof import("vitest"))["it"];
  var expect: (typeof import("vitest"))["expect"];
  var vi: (typeof import("vitest"))["vi"];
  var beforeEach: (typeof import("vitest"))["beforeEach"];
  var afterEach: (typeof import("vitest"))["afterEach"];
  var beforeAll: (typeof import("vitest"))["beforeAll"];
  var afterAll: (typeof import("vitest"))["afterAll"];
}
