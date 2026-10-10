import { products } from './data/products';

const STORAGE_KEY = 'diva-pulchra-recently-viewed';
const MAX_RECENT_PRODUCTS = 8;

export function getRecentlyViewedProductIds(): number[] {
	if (typeof localStorage === 'undefined') return [];

	const saved = localStorage.getItem(STORAGE_KEY);
	if (!saved) return [];

	const parsed: unknown = JSON.parse(saved);
	if (!Array.isArray(parsed)) {
		throw new Error('Recently viewed products have an invalid format.');
	}

	return parsed.filter(
		(id): id is number => Number.isInteger(id) && products.some((product) => product.id === id)
	);
}

export function recordRecentlyViewedProduct(productId: number): void {
	if (typeof localStorage === 'undefined') return;
	if (!products.some((product) => product.id === productId)) {
		throw new Error(`Unknown product id: ${productId}`);
	}

	const recent = getRecentlyViewedProductIds().filter((id) => id !== productId);
	localStorage.setItem(
		STORAGE_KEY,
		JSON.stringify([productId, ...recent].slice(0, MAX_RECENT_PRODUCTS))
	);
}
