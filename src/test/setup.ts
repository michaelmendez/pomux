import '@testing-library/jest-dom'

if (globalThis.requestAnimationFrame === undefined) {
  globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0)
  globalThis.cancelAnimationFrame = (id) => clearTimeout(id)
}
