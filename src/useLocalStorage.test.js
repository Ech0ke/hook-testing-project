import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useCount } from "./useCount";

describe("#useLocalStorage", () => {
  it("should increment/decrement the count when functions are called", () => {
    // destructuring result returned from hook is needed because renderHook returns multiple properties
    const { result } = renderHook(
      ({ initialCount }) => useCount(initialCount),
      { initialProps: { initialCount: 0 } }
    );
    expect(result.current.count).toBe(0);
    // wrapping function in act tells that there is state involved and it will wait for the function to finish, then proceed to assertion
    act(() => result.current.incrementCount());
    expect(result.current.count).toBe(1);

    act(() => result.current.decrementCount());
    expect(result.current.count).toBe(0);
  });
});
