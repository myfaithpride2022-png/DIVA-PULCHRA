<script lang="ts">
	import { resolve } from '$app/paths';
	import { getContext } from 'svelte';
	import { ArrowLeft, Heart, Minus, Plus, ShoppingBag, Trash2, X } from '@lucide/svelte';

	import { products } from '../../lib/data/products';
	import type { Cart } from '../../lib/cart.svelte';
	import type { Wishlist } from '../../lib/wishlist.svelte';

	const cart = getContext<Cart>('cart');
	const wishlist = getContext<Wishlist>('wishlist');

	function formatPrice(price: number) {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			maximumFractionDigits: 0
		}).format(price);
	}

	const cartProducts = $derived(
		cart.items.flatMap((item) => {
			const product = products.find((entry) => entry.id === item.productId);
			return product ? [{ ...product, quantity: item.quantity }] : [];
		})
	);

	const subtotal = $derived(
		cartProducts.reduce((total, item) => total + item.price * item.quantity, 0)
	);
</script>

<svelte:head>
	<title>Your Shopping Bag | DIVA PULCHRA</title>
	<meta
		name="description"
		content="Review your skincare selections in your DIVA PULCHRA shopping bag."
	/>
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

			<nav class="flex items-center gap-3 text-sm sm:gap-5">
				<a
					href={resolve('/wishlist')}
					class="flex items-center gap-2 hover:text-[#b85d72]"
					aria-label={`Wishlist, ${wishlist.count} saved products`}
				>
					<Heart size={18} />
					<span class="hidden sm:inline">Wishlist ({wishlist.count})</span>
					<span class="sm:hidden">{wishlist.count}</span>
				</a>
				<a href={resolve('/shop')} class="flex items-center gap-2 transition hover:text-[#b85d72]">
					<ArrowLeft size={16} class="sm:hidden" />
					<span class="hidden sm:inline">Continue shopping</span>
				</a>
			</nav>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-5 py-10 sm:py-14 lg:px-8">
		<div class="mb-10">
			<p class="text-xs tracking-[0.2em] text-[#b85d72]">YOUR SELECTION</p>
			<h1 class="mt-3 font-serif text-4xl sm:text-5xl">Your shopping bag.</h1>
			<p class="mt-3 text-sm text-[#827773]">Your skincare favourites, gathered in one place.</p>
		</div>

		{#if cartProducts.length === 0}
			<section class="border-t border-[#eaded8] py-20 text-center sm:py-28">
				<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f2e3dc]">
					<ShoppingBag size={27} class="text-[#78394a]" />
				</div>

				<h2 class="mt-6 font-serif text-3xl">Your bag is waiting.</h2>
				<p class="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#827773]">
					You haven't added anything yet. Explore the collection and discover something special for
					your skincare ritual.
				</p>

				<a
					href={resolve('/shop')}
					class="mt-8 inline-flex items-center gap-2 bg-[#78394a] px-7 py-4 text-xs tracking-[0.15em] text-white transition hover:bg-[#572735]"
				>
					EXPLORE THE COLLECTION
					<ArrowLeft size={16} class="rotate-180" />
				</a>
			</section>
		{:else}
			<div class="grid gap-10 lg:grid-cols-[1fr_350px] lg:gap-14">
				<section>
					<div class="mb-5 flex items-center justify-between border-b border-[#eaded8] pb-4">
						<h2 class="text-sm font-semibold">
							YOUR ITEMS ({cart.itemCount})
						</h2>

						<button
							class="flex items-center gap-1.5 text-xs text-[#827773] transition hover:text-[#b85d72]"
							onclick={() => cart.clear()}
						>
							<X size={15} />
							Clear bag
						</button>
					</div>

					<div class="divide-y divide-[#eaded8]">
						{#each cartProducts as item (item.id)}
							<article class="flex gap-4 py-6 sm:gap-6">
								<a
									href={resolve('/shop/[id]', { id: String(item.id) })}
									class="h-32 w-28 shrink-0 overflow-hidden bg-[#f2e3dc] sm:h-40 sm:w-32"
								>
									<img
										src={item.image}
										alt={item.name}
										class="h-full w-full object-cover transition duration-300 hover:scale-105"
									/>
								</a>

								<div class="flex min-w-0 flex-1 flex-col">
									<div class="flex items-start justify-between gap-3">
										<div class="min-w-0">
											<p class="text-[10px] tracking-[0.15em] text-[#b85d72] uppercase">
												{item.brand}
											</p>
											<a
												href={resolve('/shop/[id]', { id: String(item.id) })}
												class="mt-2 block text-sm leading-5 transition hover:text-[#b85d72] sm:text-base"
											>
												{item.name}
											</a>
											<p class="mt-2 text-sm font-medium">
												{formatPrice(item.price)}
											</p>
										</div>

										<button
											class="shrink-0 p-1 text-[#827773] transition hover:text-red-700"
											aria-label={`Remove ${item.name}`}
											title="Remove item"
											onclick={() => cart.remove(item.id)}
										>
											<Trash2 size={17} />
										</button>
									</div>

									<div class="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
										<div class="inline-flex items-center border border-[#eaded8]">
											<button
												class="p-2.5 transition hover:bg-[#f2e3dc] disabled:opacity-40"
												aria-label={`Decrease quantity of ${item.name}`}
												disabled={item.quantity <= 1}
												onclick={() => cart.updateQuantity(item.id, item.quantity - 1)}
											>
												<Minus size={14} />
											</button>

											<span class="min-w-9 text-center text-sm">
												{item.quantity}
											</span>

											<button
												class="p-2.5 transition hover:bg-[#f2e3dc] disabled:opacity-40"
												aria-label={`Increase quantity of ${item.name}`}
												disabled={item.quantity >= 99}
												onclick={() => cart.updateQuantity(item.id, item.quantity + 1)}
											>
												<Plus size={14} />
											</button>
										</div>

										<p class="text-sm font-semibold">
											{formatPrice(item.price * item.quantity)}
										</p>
									</div>
								</div>
							</article>
						{/each}
					</div>

					<a
						href={resolve('/shop')}
						class="mt-6 inline-flex items-center gap-2 text-sm text-[#78394a] transition hover:text-[#b85d72]"
					>
						<ArrowLeft size={16} />
						Continue shopping
					</a>
				</section>

				<aside class="h-fit border border-[#eaded8] bg-white/50 p-5 sm:p-7 lg:sticky lg:top-6">
					<h2 class="font-serif text-2xl">Order summary</h2>

					<div class="mt-6 space-y-4 border-b border-[#eaded8] pb-5 text-sm">
						<div class="flex justify-between gap-4">
							<span class="text-[#827773]">Subtotal</span>
							<span class="font-medium">{formatPrice(subtotal)}</span>
						</div>

						<div class="flex justify-between gap-4">
							<span class="text-[#827773]">Delivery</span>
							<span class="text-right text-xs text-[#827773]"> Calculated later </span>
						</div>
					</div>

					<div class="flex items-center justify-between gap-4 py-5">
						<span class="text-sm font-semibold">Estimated total</span>
						<span class="text-lg font-semibold">{formatPrice(subtotal)}</span>
					</div>

					<button
						type="button"
						disabled
						class="w-full cursor-not-allowed bg-[#78394a]/60 px-5 py-4 text-xs tracking-[0.15em] text-white"
					>
						CHECKOUT — COMING SOON
					</button>

					<p class="mt-4 text-center text-xs leading-5 text-[#827773]">
						Checkout and payment are not connected yet. No payment will be taken.
					</p>

					<div class="mt-6 border-t border-[#eaded8] pt-5">
						<p class="text-xs leading-6 text-[#827773]">
							Catalogue entries and prices are sample development data. Delivery fees have not been
							calculated.
						</p>
					</div>
				</aside>
			</div>
		{/if}
	</main>

	<footer class="mt-12 border-t border-[#eaded8] px-5 py-8 text-center text-xs text-[#827773]">
		© {new Date().getFullYear()} DIVA PULCHRA · THE ART OF SKINCARE
	</footer>
</div>
