<script lang="ts">
	import { resolve } from '$app/paths';
	import { getContext } from 'svelte';
	import { Heart, ShoppingBag, Trash2 } from '@lucide/svelte';

	import { products } from '../../lib/data/products';
	import type { Cart } from '../../lib/cart.svelte';
	import type { Wishlist } from '../../lib/wishlist.svelte';

	const cart = getContext<Cart>('cart');
	const wishlist = getContext<Wishlist>('wishlist');

	const savedProducts = $derived(products.filter((product) => wishlist.items.includes(product.id)));

	function formatPrice(price: number) {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			maximumFractionDigits: 0
		}).format(price);
	}

	function addToBag(productId: number) {
		cart.add(productId);
	}
</script>

<svelte:head>
	<title>My Wishlist | DIVA PULCHRA</title>
	<meta name="description" content="Your saved skincare favourites at DIVA PULCHRA." />
</svelte:head>

<div class="min-h-screen bg-[#fffaf6] text-[#29211f]">
	<div class="bg-[#78394a] px-4 py-2.5 text-center text-xs tracking-[0.15em] text-white">
		YOUR SKIN DESERVES THE EXTRAORDINARY
	</div>

	<header class="border-b border-[#eaded8]">
		<div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 lg:px-8">
			<a href={resolve('/')} class="shrink-0">
				<span class="block text-xl font-semibold tracking-[0.14em] sm:text-2xl">
					DIVA PULCHRA
				</span>
				<span class="mt-1 block text-[9px] tracking-[0.3em] text-[#827773]">
					THE ART OF SKINCARE
				</span>
			</a>

			<nav class="flex items-center gap-3 text-sm sm:gap-4">
				<a href={resolve('/shop')} class="hidden hover:text-[#b85d72] sm:inline">Shop</a>
				<a
					href={resolve('/wishlist')}
					class="flex items-center gap-2 text-[#b85d72]"
					aria-label={`Wishlist, ${wishlist.count} saved products`}
					aria-current="page"
				>
					<Heart size={18} />
					<span class="hidden sm:inline">Wishlist ({wishlist.count})</span>
				</a>
				<a href={resolve('/cart')} class="flex items-center gap-2 hover:text-[#b85d72]">
					<ShoppingBag size={18} />
					<span class="hidden sm:inline">Bag ({cart.itemCount})</span>
					<span class="sm:hidden">{cart.itemCount}</span>
				</a>
			</nav>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-5 py-10 sm:py-14 lg:px-8">
		<p class="text-xs tracking-[0.2em] text-[#b85d72]">SAVED WITH LOVE</p>
		<h1 class="mt-3 font-serif text-4xl sm:text-5xl">Your wishlist.</h1>
		<p class="mt-3 text-sm text-[#827773]">Your favourites, ready whenever you are.</p>

		{#if savedProducts.length === 0}
			<section class="mt-10 border-t border-[#eaded8] py-20 text-center sm:py-28">
				<Heart size={32} class="mx-auto text-[#b85d72]" />

				<h2 class="mt-5 font-serif text-3xl">Nothing saved just yet.</h2>
				<p class="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#827773]">
					Explore the collection and save the skincare products you love. They'll be waiting here
					when you return.
				</p>

				<a
					href={resolve('/shop')}
					class="mt-8 inline-flex items-center gap-2 bg-[#78394a] px-7 py-4 text-xs tracking-[0.15em] text-white transition hover:bg-[#572735]"
				>
					DISCOVER THE COLLECTION
				</a>
			</section>
		{:else}
			<div class="mt-10 mb-6 flex items-center justify-between border-b border-[#eaded8] pb-4">
				<p class="text-sm">
					<strong>{savedProducts.length}</strong>
					{savedProducts.length === 1 ? 'favourite' : 'favourites'}
				</p>

				<button
					class="text-xs text-[#827773] underline underline-offset-4 hover:text-[#b85d72]"
					onclick={() => wishlist.clear()}
				>
					Clear wishlist
				</button>
			</div>

			<div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
				{#each savedProducts as product (product.id)}
					<article class="group min-w-0">
						<a href={resolve('/shop/[id]', { id: String(product.id) })} class="block">
							<div class="aspect-[4/5] overflow-hidden bg-[#f2e3dc]">
								<img
									src={product.image}
									alt={product.name}
									loading="lazy"
									class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
								/>
							</div>

							<div class="pt-4">
								<p class="text-[10px] tracking-[0.15em] text-[#b85d72] uppercase">
									{product.brand}
								</p>
								<h2 class="mt-2 text-sm leading-5 sm:text-base">
									{product.name}
								</h2>
								<p class="mt-2 text-sm font-medium">
									{formatPrice(product.price)}
								</p>
							</div>
						</a>

						<button
							class="mt-4 flex w-full items-center justify-center gap-2 bg-[#78394a] px-3 py-3 text-[10px] tracking-[0.1em] text-white transition hover:bg-[#572735] sm:text-xs"
							onclick={() => addToBag(product.id)}
						>
							<ShoppingBag size={15} />
							ADD TO BAG
						</button>

						<button
							class="mt-3 flex w-full items-center justify-center gap-2 border border-[#eaded8] px-3 py-3 text-xs text-[#827773] transition hover:border-[#b85d72] hover:text-[#b85d72]"
							onclick={() => wishlist.remove(product.id)}
						>
							<Trash2 size={15} />
							REMOVE FROM WISHLIST
						</button>
					</article>
				{/each}
			</div>
		{/if}
	</main>

	<footer class="mt-12 border-t border-[#eaded8] px-5 py-8 text-center text-xs text-[#827773]">
		© {new Date().getFullYear()} DIVA PULCHRA · THE ART OF SKINCARE
	</footer>
</div>
