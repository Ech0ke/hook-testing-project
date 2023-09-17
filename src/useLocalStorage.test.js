import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import { useLocalStorage } from "./useLocalStorage";

describe("#useLocalStorage", () => {
  function renderUseLocalStorageHook(key, initialValue) {
    return renderHook(
      ({ key, initialValue }) => useLocalStorage(key, initialValue),
      { initialProps: { key, initialValue } }
    );
  }
  // clear local storage after each test to avoid using same values already stored in local storage as initialValue
  afterEach(() => {
    localStorage.clear();
  });

  it("should use the initialValue passed to the hook and save it in localStorage", () => {
    const key = "name";
    const initialValue = "Test1";

    // destructuring result returned from hook is needed because renderHook returns multiple properties
    const { result } = renderUseLocalStorageHook(key, initialValue);

    // need to use array index, because hook returns array instead of object
    expect(result.current[0]).toBe(initialValue);
    // assert that initial value was saved into local storage as a stringified version
    expect(localStorage.getItem(key)).toBe(JSON.stringify(initialValue));
  });

  it("should use the initialValue (function) passed to the hook and save it in localStorage", () => {
    const key = "name";
    const initialValue = "Test2";

    const { result } = renderUseLocalStorageHook(key, () => initialValue);

    expect(result.current[0]).toBe(initialValue);
    // assert that initial value was saved into local storage as a stringified version
    expect(localStorage.getItem(key)).toBe(JSON.stringify(initialValue));
  });

  it("should should update localStorage when setValue is called", () => {
    const key = "name";
    const initialValue = "Test3";

    const { result } = renderUseLocalStorageHook(key, initialValue);

    const newValue = "New Test3";
    // when modifying the state, must wrap it inside act block
    act(() => result.current[1](newValue));

    expect(result.current[0]).toBe(newValue);
    expect(localStorage.getItem(key)).toBe(JSON.stringify(newValue));
  });

  it("should should clear localStorage when setValue is called with undefined", () => {
    const key = "name";
    const initialValue = "Test4";

    const { result } = renderUseLocalStorageHook(key, initialValue);

    act(() => result.current[1](undefined));

    expect(result.current[0]).toBeUndefined();
    expect(localStorage.getItem(key)).toBeNull();
  });

  it("should use the value in local storage if there is one set there", () => {
    const key = "name";
    const initialValue = "Test2";
    const existingValue = "existing";
    localStorage.setItem(key, JSON.stringify(existingValue));

    const { result } = renderUseLocalStorageHook(key, initialValue);

    expect(result.current[0]).toBe(existingValue);
    // assert that initial value was saved into local storage as a stringified version
    expect(localStorage.getItem(key)).toBe(JSON.stringify(existingValue));
  });
});
