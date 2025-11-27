// tests/hooks/useModules.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useModules } from "../../src/hooks/useModules";
import { apiFetch } from "../../src/utils/api";

vi.mock("../../src/utils/api");

describe("useModules", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with loading state", () => {
    apiFetch.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useModules(vi.fn()));

    expect(result.current.loading).toBe(true);
    expect(result.current.modules).toEqual([]);
  });

  it("should load modules and call onInitialized", async () => {
    const mockModules = [
      { key: "module1", label: "Module 1", end_month: 6, content: ["Topic 1"] },
      {
        key: "module2",
        label: "Module 2",
        end_month: 12,
        content: ["Topic 2"],
      },
    ];

    apiFetch.mockResolvedValue({ modules: mockModules });

    const onInitialized = vi.fn();
    const { result } = renderHook(() => useModules(onInitialized));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.modules).toEqual(mockModules);
    expect(result.current.error).toBe(null);
    expect(onInitialized).toHaveBeenCalledTimes(1);

    // Check that initial message was constructed
    const initialMessages = onInitialized.mock.calls[0][0];
    expect(initialMessages).toHaveLength(1);
    expect(initialMessages[0].content).toContain("Module 1");
    expect(initialMessages[0].content).toContain("juin");
  });

  it("should handle empty modules array", async () => {
    apiFetch.mockResolvedValue({ modules: [] });

    const onInitialized = vi.fn();
    const { result } = renderHook(() => useModules(onInitialized));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.modules).toEqual([]);
    expect(onInitialized).toHaveBeenCalled();
  });

  it("should handle API errors gracefully", async () => {
    apiFetch.mockRejectedValue(new Error("Network error"));

    const onInitialized = vi.fn();
    const { result } = renderHook(() => useModules(onInitialized));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.modules).toEqual([]);
    expect(result.current.error).toBe("Network error");
    // Should still call onInitialized with default messages
    expect(onInitialized).toHaveBeenCalled();
  });

  it("should handle invalid response format", async () => {
    apiFetch.mockResolvedValue({ invalid: "data" });

    const onInitialized = vi.fn();
    const { result } = renderHook(() => useModules(onInitialized));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.modules).toEqual([]);
    expect(onInitialized).toHaveBeenCalled();
  });

  it("should clear modules", async () => {
    const mockModules = [
      { key: "module1", label: "Module 1", end_month: 6, content: [] },
    ];

    apiFetch.mockResolvedValue({ modules: mockModules });

    const { result } = renderHook(() => useModules(vi.fn()));

    await waitFor(() => {
      expect(result.current.modules).toEqual(mockModules);
    });

    act(() => {
      result.current.clearModules();
    });

    expect(result.current.modules).toEqual([]);
  });

  it("should cleanup on unmount", async () => {
    apiFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ modules: [] }), 100)
        )
    );

    const onInitialized = vi.fn();
    const { unmount } = renderHook(() => useModules(onInitialized));

    unmount();

    await new Promise((resolve) => setTimeout(resolve, 150));

    // onInitialized should not have been called after unmount
    expect(onInitialized).not.toHaveBeenCalled();
  });
});
