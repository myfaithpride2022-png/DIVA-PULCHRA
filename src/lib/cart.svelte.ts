
import { products } from './data/products';

export type CartItem = {
  productId: number;
  quantity: number;
};

export function createCart() {
  let items = $state<CartItem[]>([]);

  function load() {
    if (typeof localStorage === 'undefined') return;

    try {
      const saved = localStorage.getItem('diva-pulchra-cart');
      if (!saved) return;

      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed)) return;

      items = parsed.filter((item): item is CartItem =>
        item !== null &&
        typeof item === 'object' &&
        Number.isInteger(item.productId) &&
        products.some((product) => product.id === item.productId) &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1 &&
        item.quantity <= 99
      );
    } catch {
      items = [];
    }
  }

  function save() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('diva-pulchra-cart', JSON.stringify(items));
    }
  }

  function add(productId: number, quantity = 1) {
    if (!products.some((product) => product.id === productId)) return;

    const existing = items.find((item) => item.productId === productId);

    if (existing) {
      existing.quantity = Math.min(99, existing.quantity + quantity);
    } else {
      items.push({
        productId,
        quantity: Math.max(1, Math.min(99, quantity))
      });
    }

    save();
  }

  function remove(productId: number) {
    items = items.filter((item) => item.productId !== productId);
    save();
  }

  function updateQuantity(productId: number, quantity: number) {
    if (quantity < 1) {
      remove(productId);
      return;
    }

    const item = items.find((entry) => entry.productId === productId);
    if (!item) return;

    item.quantity = Math.min(99, Math.floor(quantity));
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
    get itemCount() {
      return items.reduce((total, item) => total + item.quantity, 0);
    },
    add,
    remove,
    updateQuantity,
    clear,
    load
  };
}

export type Cart = ReturnType<typeof createCart>;