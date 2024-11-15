type WeakMapParam<K extends WeakKey, V> = Iterable<[K, V]>;

class WeakMapClass<K extends WeakKey, V> {
  #wm;
  constructor(init?: WeakMapParam<K, V>) {
    this.#wm = new WeakMap(init ?? []);
  }
  clear() {
    this.#wm = new WeakMap();
  }
  delete(key: K) {
    return this.#wm.delete(key);
  }
  get(key: K) {
    return this.#wm.get(key);
  }
  has(key: K) {
    return this.#wm.has(key);
  }
  set(key: K, value: V) {
    this.#wm.set(key, value);
    return this;
  }
}

const CreateWeakMap = <K extends WeakKey, V>(init?: WeakMapParam<K, V>) =>
  new WeakMapClass<K, V>(init);

export { CreateWeakMap };
