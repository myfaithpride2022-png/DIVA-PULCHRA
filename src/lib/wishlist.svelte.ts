
import { products } from './data/products';

export function createWishlist() {
  let items = $state<number[]>([]);

  function load() {
    if (typeof localStorage === 'undefined') return;

    try {
      const saved = localStorage.getItem('diva-pulchra-wishlist');

      if (!saved) return;

      const parsed: unknown = JSON.parse(saved);

      if (!Array.isArray(parsed)) return;

      items = [
        ...new Set(
          parsed.filter(
            (id): id is number =>
              Number.isInteger(id) &&
              products.some((product) => product.id === id)
          )
        )
      ];
    } catch {
      items = [];
    }
  }

  function save() {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem('diva-pulchra-wishlist', JSON.stringify(items));
    } catch {
      // Keep the current session usable if browser storage is unavailable.
    }
  }

  function has(productId: number) {
    return items.includes(productId);
  }

  function toggle(productId: number) {
    if (!products.some((product) => product.id === productId)) return;

    if (has(productId)) {
      items = items.filter((id) => id !== productId);
    } else {
      items = [...items, productId];
    }

    save();
  }

  function remove(productId: number) {
    items = items.filter((id) => id !== productId);
    save();
  }

  function clear() {
    items = [];
    save();
  }

  return {
    get items() {
      return items;
    },
    get count() {
      return items.length;
    },
    has,
    toggle,
    remove,
    clear,
    load
  };
}

export type Wishlist = ReturnType<typeof createWishlist>;