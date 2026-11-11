export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(`omnicampus_${key}`);
    if (item) {
      return JSON.parse(item);
    }
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
  }
  return defaultValue;
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`omnicampus_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

export function clearOmniCampusStorage(): void {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('omnicampus_')) {
      localStorage.removeItem(key);
    }
  });
}

