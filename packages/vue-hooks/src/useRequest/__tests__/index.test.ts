import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick, ref } from "vue";
import { clearCache, useRequest } from "..";

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

  describe("Ready", () => {
    it("should send request when ready is true", async () => {
      const service = vi.fn().mockResolvedValue("success");
      const ready = ref(true);
      useRequest(service, { ready });

      expect(service).toHaveBeenCalledTimes(1);
      await vi.runAllTimersAsync();
    });

    it("should not send request when ready is false", async () => {
      const service = vi.fn().mockResolvedValue("success");
      const ready = ref(false);
      useRequest(service, { ready });

      expect(service).not.toHaveBeenCalled();
      await vi.runAllTimersAsync();
    });

    it("should trigger request when ready changes from false to true", async () => {
      const service = vi.fn().mockResolvedValue("success");
      const ready = ref(false);
      useRequest(service, { ready });

      expect(service).not.toHaveBeenCalled();

      ready.value = true;
      await nextTick();
      expect(service).toHaveBeenCalledTimes(1);
    });

    it("should not interrupt ongoing request when ready changes from true to false", async () => {
      const service = vi
        .fn()
        .mockImplementation(
          () =>
            new Promise((resolve) => setTimeout(() => resolve("success"), 1000))
        );
      const ready = ref(true);
      const { loading } = useRequest(service, { ready });

      expect(service).toHaveBeenCalledTimes(1);
      expect(loading.value).toBe(true);

      ready.value = false;
      await vi.advanceTimersByTimeAsync(500); // 请求还在进行中
      expect(loading.value).toBe(true); // 请求不会被中断

      await vi.advanceTimersByTimeAsync(500); // 完成请求
      expect(loading.value).toBe(false);
    });

    it("should do nothing when ready changes from true to false during idle state", async () => {
      const service = vi.fn().mockResolvedValue("success");
      const ready = ref(true);
      useRequest(service, { ready });

      await vi.runAllTimersAsync();
      expect(service).toHaveBeenCalledTimes(1);

      ready.value = false;
      await nextTick();
      expect(service).toHaveBeenCalledTimes(1); // 请求次数不变
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

    it("should return data from run", async () => {
      const service = vi.fn().mockResolvedValue("success data");
      const { run, loading } = useRequest(service, {
        manual: true,
      });
      const result = await run();
      expect(loading.value).toBe(false);
      expect(result?.data.value).toBe("success data");
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

    it("should execute run when ready is true", async () => {
      const service = vi.fn().mockResolvedValue("success");
      const ready = ref(true);
      const { run } = useRequest(service, {
        manual: true,
        ready,
      });

      expect(service).not.toHaveBeenCalled();
      run();
      expect(service).toHaveBeenCalledTimes(1);
    });

    it("should not execute run when ready is false", async () => {
      const service = vi.fn().mockResolvedValue("success");
      const ready = ref(false);
      const { run } = useRequest(service, {
        manual: true,
        ready,
      });

      expect(service).not.toHaveBeenCalled();
      run();
      expect(service).not.toHaveBeenCalled();
    });

    it("should not execute run when ready changes from true to false", async () => {
      const service = vi.fn().mockResolvedValue("success");
      const ready = ref(true);
      const { run } = useRequest(service, {
        manual: true,
        ready,
      });

      ready.value = false;
      await nextTick();
      run();
      expect(service).not.toHaveBeenCalled();
    });

    it("should execute run when ready changes from false to true", async () => {
      const service = vi.fn().mockResolvedValue("success");
      const ready = ref(false);
      const { run } = useRequest(service, {
        manual: true,
        ready,
      });

      run();
      expect(service).not.toHaveBeenCalled();

      ready.value = true;
      await nextTick();
      run();
      expect(service).toHaveBeenCalledTimes(1);
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
      await vi.advanceTimersByTimeAsync(1000);
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

    it("should handle polling interval changes correctly", async () => {
      const service = vi.fn().mockResolvedValue("success");
      const pollingInterval = ref(1000);
      const { cancel } = useRequest(service, {
        pollingInterval,
      });

      expect(service).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(500); // 等待500ms
      pollingInterval.value = 2000; // 在轮询过程中改变间隔

      const waitTime = 500;
      await vi.advanceTimersByTimeAsync(waitTime); // 再等待500ms，此时原来的1000ms轮询应该被取消
      expect(service).toHaveBeenCalledTimes(1); // 仍然是1次，因为原来的轮询被取消了

      await vi.advanceTimersByTimeAsync(2000 - waitTime); // 等待新的间隔时间
      expect(service).toHaveBeenCalledTimes(2); // 按新的间隔触发了请求

      // 清理：停止轮询
      cancel();
    });

    it("should stop polling when interval is set to 0", async () => {
      const service = vi.fn().mockResolvedValue("success");
      const pollingInterval = ref(1000);
      const { cancel } = useRequest(service, {
        pollingInterval,
      });

      expect(service).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(1000);
      expect(service).toHaveBeenCalledTimes(2);

      pollingInterval.value = 0; // 设置为0应该停止轮询
      await vi.advanceTimersByTimeAsync(2000);
      expect(service).toHaveBeenCalledTimes(2); // 调用次数不应该增加

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

  describe("Refresh", () => {
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
    it("should return data from refresh", async () => {
      const service = vi
        .fn()
        .mockResolvedValueOnce("first call")
        .mockResolvedValueOnce("refreshed data");
      const { refresh, loading } = useRequest(service);

      await vi.runAllTimersAsync(); // 等待首次请求完成
      const result = await refresh();
      expect(loading.value).toBe(false);
      expect(result?.data.value).toBe("refreshed data");
    });
  });

  describe("useCache", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      clearCache("testKey");
    });

    describe("Basic Cache Features", () => {
      it("should share the same request when multiple calls use the same cacheKey", async () => {
        const service = vi
          .fn()
          .mockImplementation(
            () =>
              new Promise((resolve) =>
                setTimeout(() => resolve("success"), 100)
              )
          );

        // First request
        const { data: data1 } = useRequest(service, {
          cacheKey: "testKey",
        });

        // Second request with same cacheKey before first one completes
        const { data: data2 } = useRequest(service, {
          cacheKey: "testKey",
        });

        expect(service).toHaveBeenCalledTimes(1);

        await vi.advanceTimersByTimeAsync(100);

        expect(data1.value).toBe("success");
        expect(data2.value).toBe("success");
      });

      it("should make new request when cache is expired", async () => {
        const service = vi.fn().mockResolvedValue("success");

        // First request
        const { data: data1 } = useRequest(service, {
          cacheKey: "testKey",
        });

        await vi.runAllTimersAsync();
        expect(service).toHaveBeenCalledTimes(1);
        expect(data1.value).toBe("success");

        // Second request after first one completes
        const { data: data2 } = useRequest(service, {
          cacheKey: "testKey",
        });

        await vi.runAllTimersAsync();
        expect(service).toHaveBeenCalledTimes(2);
        expect(data2.value).toBe("success");
      });
    });

    describe("Cache Time", () => {
      it("should respect cacheTime and make new request after cache expires", async () => {
        const service = vi.fn().mockResolvedValue("success");
        const cacheTime = 1000; // 1 second cache

        // First request
        const { data: data1 } = useRequest(service, {
          cacheKey: "testKey",
          cacheTime,
        });

        // 注意这里不能使用 runAllTimersAsync(), 因为它会执行所有的计时器, 包括缓存的过期定时器
        await vi.advanceTimersByTimeAsync(0);
        expect(service).toHaveBeenCalledTimes(1);
        expect(data1.value).toBe("success");

        // Request within cache time
        const { data: data2 } = useRequest(service, {
          cacheKey: "testKey",
          cacheTime,
        });

        await vi.advanceTimersByTimeAsync(0);
        expect(service).toHaveBeenCalledTimes(1); // Should use cached result
        expect(data2.value).toBe("success");

        // Advance time beyond cache duration, because there is a time discrepancy, so add 5ms
        await vi.advanceTimersByTimeAsync(cacheTime);

        // Request after cache expires
        const { data: data3 } = useRequest(service, {
          cacheKey: "testKey",
          cacheTime,
        });

        await vi.runAllTimersAsync();
        expect(service).toHaveBeenCalledTimes(2); // Should make new request
        expect(data3.value).toBe("success");
      });

      it("should update cache time when cacheTime changes", async () => {
        const service = vi.fn().mockResolvedValue("success");
        const cacheTime = ref(1000);

        useRequest(service, {
          cacheKey: "testKey",
          cacheTime,
        });

        await vi.advanceTimersByTimeAsync(0);
        expect(service).toHaveBeenCalledTimes(1);

        // Change cache time before original cache expires
        cacheTime.value = 2000;
        await vi.advanceTimersByTimeAsync(1000);

        // Should still use cached result after original cache time
        const { data: data2 } = useRequest(service, {
          cacheKey: "testKey",
          cacheTime: cacheTime.value,
        });

        await vi.advanceTimersByTimeAsync(0);
        expect(service).toHaveBeenCalledTimes(1);
        expect(data2.value).toBe("success");

        // Advance beyond new cache time
        await vi.advanceTimersByTimeAsync(1000);

        // Should make new request
        const { data: data3 } = useRequest(service, {
          cacheKey: "testKey",
          cacheTime: cacheTime.value,
        });

        await vi.advanceTimersByTimeAsync(0);
        expect(service).toHaveBeenCalledTimes(2);
        expect(data3.value).toBe("success");
      });
    });
  });
});
