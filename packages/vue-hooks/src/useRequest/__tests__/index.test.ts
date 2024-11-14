import { describe, it, expect, vi, beforeEach } from "vitest";
import { useRequest } from "../core/useRequest";
import { nextTick, ref } from "vue";

describe("useRequest", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe("Basic Features", () => {
    it("should make successful request and return data", async () => {
      const successService = vi.fn().mockResolvedValue("success");
      const { data, loading } = useRequest(successService);
      expect(loading.value).toBe(true);
      expect(data.value).toBeUndefined();
      await vi.runAllTimersAsync();
      expect(loading.value).toBe(false);
      expect(data.value).toBe("success");
      expect(successService).toHaveBeenCalledTimes(1);
    });
    it("should handle request error", async () => {
      const error = new Error("test error");
      const errorService = vi.fn().mockRejectedValue(error);
      const { error: errorRef, loading } = useRequest(errorService);
      expect(loading.value).toBe(true);
      await vi.runAllTimersAsync();
      expect(loading.value).toBe(false);
      expect(errorRef.value).toBe(error);
    });
  });

  describe("Manual Control", () => {
    it("should not auto-run in manual mode", async () => {
      const service = vi.fn().mockResolvedValue("success");
      const { loading, run } = useRequest(service, { manual: true });

      expect(loading.value).toBe(false);
      expect(service).not.toHaveBeenCalled();

      run();
      expect(loading.value).toBe(true);

      await vi.runAllTimersAsync();
      expect(service).toHaveBeenCalledTimes(1);
    });

    it("should support cancel request", async () => {
      // 这里 service 必须使用微任务, 否则 cancel 会失效
      const service = vi
        .fn()
        .mockImplementation(() => Promise.resolve().then(() => "success"));
      const { loading, run, cancel, cancelled } = useRequest(service, {
        manual: true,
      });

      run();
      expect(loading.value).toBe(true);
      cancel();

      await vi.runAllTimersAsync();
      expect(loading.value).toBe(false);
      expect(cancelled.value).toBe(true);
    });
  });

  describe("Polling", () => {
    it("should poll at specified interval", async () => {
      const service = vi.fn().mockResolvedValue("success");
      const { cancel } = useRequest(service, { pollingInterval: 1000 });

      expect(service).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(1000);
      expect(service).toHaveBeenCalledTimes(2);

      await vi.advanceTimersByTimeAsync(1000);
      expect(service).toHaveBeenCalledTimes(3);

      // 清理：停止轮询
      cancel();
    });

    it("should pause polling when ready is false", async () => {
      const ready = ref(true);
      const service = vi.fn().mockResolvedValue("success");
      const { cancel } = useRequest(service, {
        pollingInterval: 1000,
        ready,
      });

      expect(service).toHaveBeenCalledTimes(1);

      ready.value = false;
      await vi.advanceTimersByTimeAsync(2000);
      expect(service).toHaveBeenCalledTimes(1);

      ready.value = true;
      await nextTick();
      // ready 从 false 变为 true 时会立即触发一次请求
      expect(service).toHaveBeenCalledTimes(2);

      await vi.advanceTimersByTimeAsync(1000);
      expect(service).toHaveBeenCalledTimes(3);

      // 清理：停止轮询
      cancel();
    });
  });

  describe("Refresh Dependencies", () => {
    it("should refresh when dependencies change", async () => {
      const dep = ref(0);
      const service = vi.fn().mockResolvedValue("success");
      useRequest(service, {
        refreshDeps: [dep],
      });

      expect(service).toHaveBeenCalledTimes(1);

      dep.value++;
      await nextTick();
      expect(service).toHaveBeenCalledTimes(2);
    });
  });

  describe("Callbacks", () => {
    it("should trigger all callbacks correctly", async () => {
      const onBefore = vi.fn();
      const onSuccess = vi.fn();
      const onError = vi.fn();
      const onFinally = vi.fn();

      const service = vi.fn().mockResolvedValue("success");
      useRequest(service, {
        onBefore,
        onSuccess,
        onError,
        onFinally,
      });

      expect(onBefore).toHaveBeenCalledTimes(1);

      await vi.runAllTimersAsync();

      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith("success", []);
      expect(onError).not.toHaveBeenCalled();
      expect(onFinally).toHaveBeenCalledTimes(1);
    });
  });

  describe("Parameters", () => {
    it("should handle reactive parameters correctly", async () => {
      const param = ref("test");
      const service = vi.fn().mockResolvedValue("success");
      const { run } = useRequest(service, {
        manual: true,
        params: [param],
      });

      run(param);
      expect(service).toHaveBeenCalledWith("test");

      param.value = "updated";
      run(param);
      expect(service).toHaveBeenCalledWith("updated");
    });
  });

  it("should handle refresh correctly", async () => {
    const service = vi
      .fn()
      .mockResolvedValueOnce("first call")
      .mockResolvedValueOnce("refreshed data");
    const { data, refresh } = useRequest(service);
    expect(service).toHaveBeenCalledTimes(1);
    await vi.runAllTimersAsync();
    expect(data.value).toBe("first call");
    // 执行刷新
    await refresh();
    expect(data.value).toBe("refreshed data");
    expect(service).toHaveBeenCalledTimes(2);
    // 验证两次调用使用了相同的参数
    expect(service.mock.calls[0]).toEqual(service.mock.calls[1]);
  });
});