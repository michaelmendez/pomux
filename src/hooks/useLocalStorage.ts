import { useCallback, useState } from "react";

export default function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.error(`Error reading localStorage key "${key}":`, err);
      return initialValue;
    }
  });

  const setValue = useCallback((newValue: T | ((prev: T) => T)) => {
    try {
      setStoredValue((prev) => {
        const valueToStore = typeof newValue === "function" ? (newValue as (prev: T) => T)(prev) : newValue;
        localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (err) {
      console.error(`Error writing localStorage key "${key}":`, err);
    }
  }, [key]);

  const removeValue = () => {
    localStorage.removeItem(key);
  }

  return [storedValue, setValue, removeValue] as const;
}
