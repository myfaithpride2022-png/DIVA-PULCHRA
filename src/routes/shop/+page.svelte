<script lang="ts">
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { getContext } from 'svelte';
	import {
		Search,
		ShoppingBag,
		Heart,
		Clock3,
		SlidersHorizontal,
		Menu,
		X,
		ArrowUpDown
	} from '@lucide/svelte';

	import { products } from '../../lib/data/products';
	import type { Cart } from '../../lib/cart.svelte';
	import type { Wishlist } from '../../lib/wishlist.svelte';
	import { getRecentlyViewedProductIds } from '../../lib/recently-viewed';

	const cart = getContext<Cart>('cart');
	const wishlist = getContext<Wishlist>('wishlist');

	let menuOpen = $state(false);
	let searchTerm = $state('');
	let selectedCategory = $state('All');
	let selectedSkinType = $state('All skin types');
	let selectedConcern = $state('All concerns');
	let sortBy = $state('featured');
	let maxPrice = $state(100000);
	let recentlyViewedIds = $state<number[]>([]);
	let recentProductsError = $state('');

	const categories = ['All', ...new Set(products.map((product) => product.category))];
	const skinTypes = [
		...new Set(['All skin types', ...products.flatMap((product) => product.skinTypes)])
	];
	const concerns = [
		...new Set(['All concerns', ...products.flatMap((product) => product.concerns)])
	];

	onMount(() => {
		try {
			recentlyViewedIds = getRecentlyViewedProductIds();
		} catch (error) {
			console.error('Could not load recently viewed products.', error);
			recentProductsError = 'Recently viewed products could not be loaded on this device.';
		}
	});

	const recentlyViewedProducts = $derived(
		recentlyViewedIds
			.map((id) => products.find((product) => product.id === id))
			.filter((product) => product !== undefined)
	);

	let filteredProducts = $derived.by(() => {
		const query = searchTerm.trim().toLowerCase();

		let result = products.filter((product) => {
			const matchesSearch =
				!query ||
				product.name.toLowerCase().includes(query) ||
				product.brand.toLowerCase().includes(query) ||
				product.category.toLowerCase().includes(query);

			const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

			const matchesSkinType =
				selectedSkinType === 'All skin types' || product.skinTypes.includes(selectedSkinType);

			const matchesConcern =
				selectedConcern === 'All concerns' || product.concerns.includes(selectedConcern);

			const matchesPrice = product.price <= maxPrice;

			return matchesSearch && matchesCategory && matchesSkinType && matchesConcern && matchesPrice;
		});

		if (sortBy === 'price-low') {
			result = [...result].sort((a, b) => a.price - b.price);
		} else if (sortBy === 'price-high') {
			result = [...result].sort((a, b) => b.price - a.price);
		} else if (sortBy === 'name') {
			result = [...result].sort((a, b) => a.name.localeCompare(b.name));
		} else if (sortBy === 'featured') {
			result = [...result].sort((a, b) => Number(b.featured) - Number(a.featured));
		}

		return result;
	});

	function formatPrice(price: number) {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			maximumFractionDigits: 0
		}).format(price);
	}

	function resetFilters() {
		searchTerm = '';
		selectedCategory = 'All';
		selectedSkinType = 'All skin types';
		selectedConcern = 'All concerns';
		sortBy = 'featured';
		maxPrice = 100000;
	}

	function addToBag(productId: number) {
		cart.add(productId);
	}
</script>

<svelte:head>
	<title>Shop Skincare | DIVA PULCHRA</title>
	<meta
		name="description"
		content="Explore skincare essentials, discover new favourites and shop the DIVA PULCHRA collection."
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

			<button
				type="button"
				class="rounded-full p-2 transition hover:bg-[#f5e9e4] md:hidden"
				aria-label={menuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={menuOpen}
				onclick={() => (menuOpen = !menuOpen)}
			>
				{#if menuOpen}
					<X size={20} />
				{:else}
					<Menu size={20} />
				{/if}
			</button>

			<nav class="hidden items-center gap-6 text-sm md:flex">
				<a href={resolve('/')} class="hover:text-[#b85d72]">Home</a>
				<a href={resolve('/shop')} class="font-medium text-[#b85d72]">Shop</a>
				<a href={resolve('/#brands')} class="hover:text-[#b85d72]">Brands</a>
				<a href={resolve('/#skin-guide')} class="hover:text-[#b85d72]">Skin guide</a>
			</nav>

			<div class="flex items-center gap-3">
				<a
					href={resolve('/wishlist')}
					class="flex items-center gap-2 text-sm hover:text-[#b85d72]"
					aria-label={`Wishlist, ${wishlist.count} saved products`}
				>
					<Heart size={19} />
					<span class="hidden sm:inline">Wishlist ({wishlist.count})</span>
					<span class="sm:hidden">{wishlist.count}</span>
				</a>
				<a href={resolve('/cart')} class="flex items-center gap-2 text-sm">
					<ShoppingBag size={19} />
					<span class="hidden sm:inline">Bag ({cart.itemCount})</span>
					<span class="sm:hidden">{cart.itemCount}</span>
				</a>
			</div>
		</div>
		{#if menuOpen}
			<nav class="border-t border-[#eaded8] px-5 py-4 md:hidden">
				<div class="flex flex-col gap-4 text-sm">
					<a href={resolve('/')} onclick={() => (menuOpen = false)}>Home</a>
					<a href={resolve('/shop')} onclick={() => (menuOpen = false)}>Shop all</a>
					<a href={resolve('/#brands')} onclick={() => (menuOpen = false)}>Brands</a>
					<a href={resolve('/#skin-guide')} onclick={() => (menuOpen = false)}>Skin guide</a>
					<a href={resolve('/wishlist')} onclick={() => (menuOpen = false)}>
						Wishlist ({wishlist.count})
					</a>
					<a href={resolve('/cart')} onclick={() => (menuOpen = false)}>
						Shopping bag ({cart.itemCount})
					</a>
				</div>
			</nav>
		{/if}
	</header>

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-14 lg:px-8">
		<div class="mb-10 border-b border-[#eaded8] pb-8 sm:mb-12">
			<p class="text-xs tracking-[0.2em] text-[#b85d72]">THE DIVA PULCHRA COLLECTION</p>
			<h1 class="mt-3 font-serif text-4xl sm:text-6xl">The skincare edit.</h1>
			<p class="mt-4 max-w-xl text-sm leading-7 text-[#827773] sm:text-base">
				Explore everyday essentials, discover new favourites and find products for your personal
				skincare ritual.
			</p>
		</div>

		<div class="grid gap-6 lg:grid-cols-[230px_1fr] lg:gap-8">
			<aside>
				<div class="mb-5 flex items-center gap-2">
					<SlidersHorizontal size={18} />
					<h2 class="text-sm font-semibold">Refine your search</h2>
				</div>

				<div class="mb-7">
					<h3 class="mb-3 text-xs font-semibold tracking-[0.12em]">CATEGORIES</h3>

					<div class="flex flex-wrap gap-2 lg:flex-col lg:items-start">
						{#each categories as category (category)}
							<button
								class={`px-3 py-2 text-left text-sm transition ${
									selectedCategory === category
										? 'bg-[#78394a] text-white'
										: 'border border-[#eaded8] hover:border-[#b85d72]'
								}`}
								onclick={() => (selectedCategory = category)}
							>
								{category}
							</button>
						{/each}
					</div>
				</div>

				<div class="mb-7 border-t border-[#eaded8] pt-5">
					<label for="skin-type" class="mb-3 block text-xs font-semibold tracking-[0.12em]">
						SKIN TYPE
					</label>
					<select
						id="skin-type"
						bind:value={selectedSkinType}
						class="w-full border border-[#eaded8] bg-transparent px-3 py-3 text-sm"
					>
						{#each skinTypes as skinType (skinType)}
							<option value={skinType}>{skinType}</option>
						{/each}
					</select>
				</div>

				<div class="mb-7 border-t border-[#eaded8] pt-5">
					<label for="skin-concern" class="mb-3 block text-xs font-semibold tracking-[0.12em]">
						SKIN CONCERN
					</label>
					<select
						id="skin-concern"
						bind:value={selectedConcern}
						class="w-full border border-[#eaded8] bg-transparent px-3 py-3 text-sm"
					>
						{#each concerns as concern (concern)}
							<option value={concern}>{concern}</option>
						{/each}
					</select>
				</div>

				<div class="border-t border-[#eaded8] pt-5">
					<div class="mb-3 flex items-center justify-between">
						<h3 class="text-xs font-semibold tracking-[0.12em]">MAXIMUM PRICE</h3>
						<span class="text-xs text-[#827773]">
							{formatPrice(maxPrice)}
						</span>
					</div>

					<input
						type="range"
						min="1000"
						max="100000"
						step="1000"
						bind:value={maxPrice}
						class="w-full accent-[#78394a]"
						aria-label="Maximum product price"
					/>

					<div class="mt-2 flex justify-between text-xs text-[#827773]">
						<span>₦1,000</span>
						<span>₦100,000</span>
					</div>
				</div>

				<button
					class="mt-6 text-sm text-[#b85d72] underline underline-offset-4 hover:text-[#78394a]"
					onclick={resetFilters}
				>
					Reset all filters
				</button>
			</aside>

			<section>
				<div
					class="flex flex-col gap-4 border-b border-[#eaded8] pb-5 sm:flex-row sm:items-center sm:justify-between"
				>
					<p class="text-sm">
						<strong>{filteredProducts.length}</strong>
						{filteredProducts.length === 1 ? 'product' : 'products'} found
					</p>

					<div class="flex min-w-0 flex-col gap-3 sm:flex-row">
						<label class="flex min-w-0 items-center gap-2 border border-[#eaded8] px-3">
							<Search size={17} class="shrink-0 text-[#827773]" />
							<input
								type="search"
								bind:value={searchTerm}
								placeholder="Search products or brands..."
								class="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[#a79a94] sm:w-56 sm:flex-initial"
								aria-label="Search products or brands"
							/>

							{#if searchTerm}
								<button onclick={() => (searchTerm = '')} aria-label="Clear search">
									<X size={16} />
								</button>
							{/if}
						</label>

						<label class="flex min-w-0 items-center gap-2 border border-[#eaded8] px-3">
							<ArrowUpDown size={16} class="text-[#827773]" />
							<select
								bind:value={sortBy}
								class="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none sm:flex-initial"
								aria-label="Sort products"
							>
								<option value="featured">Featured</option>
								<option value="price-low">Price: low to high</option>
								<option value="price-high">Price: high to low</option>
								<option value="name">Name: A–Z</option>
							</select>
						</label>
					</div>
				</div>

				{#if filteredProducts.length > 0}
					<div class="grid grid-cols-2 gap-x-3 gap-y-7 pt-6 sm:gap-6 xl:grid-cols-3">
						{#each filteredProducts as product (product.id)}
							<article class="group min-w-0">
								<div class="relative aspect-[4/5] overflow-hidden bg-[#f2e3dc]">
									<a href={resolve('/shop/[id]', { id: String(product.id) })} class="block h-full">
										<img
											src={product.image}
											alt={product.name}
											loading="lazy"
											class="store-image h-full w-full object-cover transition duration-500 group-hover:scale-105"
										/>

										{#if product.featured}
											<span
												class="absolute top-2 left-2 bg-[#fffaf6] px-2 py-1 text-[9px] tracking-[0.1em] sm:top-3 sm:left-3"
											>
												FEATURED
											</span>
										{/if}
									</a>
									<button
										type="button"
										class="absolute top-2 right-2 rounded-full bg-[#fffaf6]/90 p-2 transition hover:bg-white"
										aria-label={wishlist.has(product.id)
											? `Remove ${product.name} from wishlist`
											: `Save ${product.name} to wishlist`}
										aria-pressed={wishlist.has(product.id)}
										onclick={() => wishlist.toggle(product.id)}
									>
										<Heart
											size={16}
											fill={wishlist.has(product.id) ? 'currentColor' : 'none'}
											class={wishlist.has(product.id) ? 'text-[#b85d72]' : ''}
										/>
									</button>
								</div>

								<a href={resolve('/shop/[id]', { id: String(product.id) })} class="block">
									<div class="pt-3 sm:pt-4">
										<p class="text-[10px] tracking-[0.15em] text-[#b85d72] uppercase">
											{product.brand}
										</p>
										<h3 class="mt-2 text-sm leading-5 sm:text-base">
											{product.name}
										</h3>
										<p class="mt-2 text-sm font-medium">
											{formatPrice(product.price)}
										</p>
									</div>
								</a>

								<button
									class="mt-4 w-full border border-[#78394a] px-3 py-3 text-[10px] tracking-[0.12em] transition hover:bg-[#78394a] hover:text-white sm:text-xs"
									onclick={() => addToBag(product.id)}
								>
									ADD TO BAG
								</button>
							</article>
						{/each}
					</div>
				{:else}
					<div class="py-20 text-center">
						<Search size={30} class="mx-auto text-[#b85d72]" />
						<h2 class="mt-5 font-serif text-2xl">No products found</h2>
						<p class="mt-3 text-sm text-[#827773]">
							Try another search, select a different category or adjust your price limit.
						</p>
						<button
							class="mt-6 bg-[#78394a] px-6 py-3 text-sm text-white hover:bg-[#572735]"
							onclick={resetFilters}
						>
							Clear filters
						</button>
					</div>
				{/if}

				<p class="mt-8 text-xs leading-5 text-[#827773]">
					Catalogue entries and prices are sample development data, not confirmation of actual stock
					or official brand pricing. Skin-type and concern tags are illustrative only; confirm
					suitability with verified product information.
				</p>

				{#if recentProductsError}
					<p class="mt-3 text-xs text-[#9b394d]" role="status">{recentProductsError}</p>
				{/if}

				{#if recentlyViewedProducts.length > 0}
					<section
						class="mt-14 border-t border-[#eaded8] pt-8"
						aria-labelledby="recently-viewed-title"
					>
						<div class="mb-5 flex items-center gap-2">
							<Clock3 size={17} class="text-[#b85d72]" />
							<h2 id="recently-viewed-title" class="font-serif text-2xl">Recently viewed</h2>
						</div>
						<div class="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
							{#each recentlyViewedProducts.slice(0, 4) as product (product.id)}
								<a href={resolve('/shop/[id]', { id: String(product.id) })} class="group min-w-0">
									<div class="aspect-[4/5] overflow-hidden bg-[#f2e3dc]">
										<img
											src={product.image}
											alt={product.name}
											loading="lazy"
											class="store-image h-full w-full object-cover transition duration-500 group-hover:scale-105"
										/>
									</div>
									<p class="mt-3 text-xs text-[#827773]">{product.brand}</p>
									<p class="mt-1 text-sm">{product.name}</p>
									<p class="mt-1 text-sm font-medium">{formatPrice(product.price)}</p>
								</a>
							{/each}
						</div>
					</section>
				{/if}
			</section>
		</div>
	</main>

	<footer class="border-t border-[#eaded8] px-5 py-8 text-center text-xs text-[#827773]">
		© {new Date().getFullYear()} DIVA PULCHRA · THE ART OF SKINCARE
		<p class="mt-2">
			<a href={resolve('/')} class="underline underline-offset-4 hover:text-[#b85d72]">
				Back to homepage
			</a>
		</p>
	</footer>
</div>
