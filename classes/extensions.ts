// Extend the Array prototype
declare global {
  interface Array<T> {
    firstOrDefault(defaultValue: T): T;
    firstOrNull(): T | null;
  }
}

// Implementation of firstOrDefault
Array.prototype.firstOrDefault = function <T>(defaultValue: T): T {
  return this.length > 0 ? this[0] : defaultValue;
};

// Implementation of firstOrNull
Array.prototype.firstOrNull = function <T>(): T | null {
  return this.length > 0 ? this[0] : null;
};
