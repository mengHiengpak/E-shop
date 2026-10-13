type Listener = (...args: unknown[]) => void

const listeners = new Map<string, Set<Listener>>()

export function on(event: string, callback: Listener): () => void {
  if (!listeners.has(event)) listeners.set(event, new Set())
  listeners.get(event)!.add(callback)
  return () => off(event, callback)
}

export function off(event: string, callback: Listener): void {
  listeners.get(event)?.delete(callback)
}

export function emit(event: string, ...args: unknown[]): void {
  listeners.get(event)?.forEach((callback) => callback(...args))
}
