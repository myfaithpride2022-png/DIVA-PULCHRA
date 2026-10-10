<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { getContext } from 'svelte';
	import {
		ArrowLeft,
		ShoppingBag,
		Minus,
		Plus,
		Check,
		Heart,
		Star,
		ZoomIn,
		X,
		Clock3
	} from '@lucide/svelte';

	import { products } from '../../../lib/data/products';
	import type { Cart } from '../../../lib/cart.svelte';
	import type { Wishlist } from '../../../lib/wishlist.svelte';
	import {
		getRecentlyViewedProductIds,
		recordRecentlyViewedProduct
	} from '../../../lib/recently-viewed';

	type Review = {
		id: string;
		rating: number;
		title: string;
		comment: string;
		createdAt: string;
	};

	const cart = getContext<Cart>('cart');
	const wishlist = getContext<Wishlist>('wishlist');

	let quantity = $state(1);
	let addedToBag = $state(false);
	let selectedImage = $state(0);
	let zoomDialog = $state<HTMLDialogElement>();
	let reviews = $state<Review[]>([]);
	let recentlyViewedIds = $state<number[]>([]);
	let selectedRating = $state(0);
	let reviewTitle = $state('');
	let reviewComment = $state('');
	let reviewStorageError = $state('');
	let recentProductsError = $state('');

	const product = $derived(products.find((item) => item.id === Number(page.params.id)));

	const averageRating = $derived(
		reviews.length
			? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
			: 0
	);

	const relatedProducts = $derived.by(() => {
		if (!product) return [];

		const routineCategories: Record<string, string[]> = {
			Cleansers: ['Toners', 'Serums', 'Moisturisers', 'Sun Care'],
			Toners: ['Serums', 'Moisturisers', 'Sun Care'],
			Serums: ['Moisturisers', 'Sun Care', 'Cleansers'],
			Moisturisers: ['Sun Care', 'Cleansers', 'Serums'],
			'Sun Care': ['Cleansers', 'Serums', 'Moisturisers'],
			Masks: ['Cleansers', 'Moisturisers', 'Serums'],
			'Eye Care': ['Cleansers', 'Serums', 'Moisturisers'],
			'Body Care': ['Cleansers', 'Moisturisers']
		};
		const preferredCategories = routineCategories[product.category] ?? [];

		return products
			.filter((candidate) => candidate.id !== product.id)
			.sort((a, b) => {
				const aIndex = preferredCategories.indexOf(a.category);
				const bIndex = preferredCategories.indexOf(b.category);
				return (
					(aIndex < 0 ? Number.MAX_SAFE_INTEGER : aIndex) -
					(bIndex < 0 ? Number.MAX_SAFE_INTEGER : bIndex)
				);
			})
			.slice(0, 4);
	});

	const recentlyViewedProducts = $derived(
		recentlyViewedIds
			.filter((id) => id !== product?.id)
			.map((id) => products.find((entry) => entry.id === id))
			.filter((entry) => entry !== undefined)
			.slice(0, 4)
	);

	$effect(() => {
		const currentProduct = product;
		if (!currentProduct) return;

		selectedImage = 0;
		reviews = [];
		reviewStorageError = '';
		selectedRating = 0;
		reviewTitle = '';
		reviewComment = '';

		try {
			recordRecentlyViewedProduct(currentProduct.id);
			recentlyViewedIds = getRecentlyViewedProductIds();
			recentProductsError = '';
		} catch (error) {
			console.error('Could not update recently viewed products.', error);
			recentProductsError = 'Recently viewed products could not be saved on this device.';
		}

		try {
			const saved = localStorage.getItem(`diva-pulchra-reviews-${currentProduct.id}`);
			const parsed: unknown = saved ? JSON.parse(saved) : [];
			if (!Array.isArray(parsed) || !parsed.every(isReview)) {
				throw new Error('Stored reviews have an invalid format.');
			}
			reviews = parsed;
		} catch (error) {
			console.error('Could not load product reviews.', error);
			reviewStorageError = 'Reviews could not be loaded or saved on this device.';
		}
	});

	function isReview(value: unknown): value is Review {
		if (typeof value !== 'object' || value === null) return false;

		const review = value as Partial<Review>;
		return (
			typeof review.id === 'string' &&
			Number.isInteger(review.rating) &&
			Number(review.rating) >= 1 &&
			Number(review.rating) <= 5 &&
			typeof review.title === 'string' &&
			typeof review.comment === 'string' &&
			typeof review.createdAt === 'string' &&
			!Number.isNaN(Date.parse(review.createdAt))
		);
	}

	function formatPrice(price: number) {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			maximumFractionDigits: 0
		}).format(price);
	}

	function addToBag() {
		if (!product) return;

		cart.add(product.id, quantity);
		addedToBag = true;
	}

	function submitReview(event: SubmitEvent) {
		event.preventDefault();
		if (!product || selectedRating < 1) return;

		const review: Review = {
			id: crypto.randomUUID(),
			rating: selectedRating,
			title: reviewTitle.trim(),
			comment: reviewComment.trim(),
			createdAt: new Date().toISOString()
		};
		const updatedReviews = [review, ...reviews];

		try {
			localStorage.setItem(`diva-pulchra-reviews-${product.id}`, JSON.stringify(updatedReviews));
			reviews = updatedReviews;
			reviewTitle = '';
			reviewComment = '';
			selectedRating = 0;
			reviewStorageError = '';
		} catch (error) {
			console.error('Could not save product review.', error);
			reviewStorageError = 'Your review could not be saved on this device. Please try again.';
		}
	}

	function openImageZoom() {
		zoomDialog?.showModal();
	}
</script>

<svelte:head>
	<title>
		{product ? `${product.name} | DIVA PULCHRA` : 'Product Not Found | DIVA PULCHRA'}
	</title>
	<meta
		name="description"
		content={product?.description ?? 'Explore skincare essentials at DIVA PULCHRA.'}
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

			<nav class="flex items-center gap-3 sm:gap-5">
				<a
					href={resolve('/wishlist')}
					class="flex items-center gap-2 text-sm hover:text-[#b85d72]"
					aria-label={`Wishlist, ${wishlist.count} saved products`}
				>
					<Heart size={18} />
					<span class="hidden sm:inline">Wishlist ({wishlist.count})</span>
				</a>
				<a href={resolve('/cart')} class="flex items-center gap-2 text-sm">
					<ShoppingBag size={19} />
					<span class="hidden sm:inline">Bag ({cart.itemCount})</span>
					<span class="sm:hidden">{cart.itemCount}</span>
				</a>
			</nav>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-5 py-8 sm:py-12 lg:px-8">
		<a
			href={resolve('/shop')}
			class="inline-flex items-center gap-2 text-sm text-[#827773] transition hover:text-[#b85d72]"
		>
			<ArrowLeft size={17} />
			Back to shop
		</a>

		{#if product}
			<div class="grid gap-8 pt-8 md:grid-cols-2 md:gap-12 lg:gap-16">
				<div>
					<div class="group relative overflow-hidden bg-[#f2e3dc]">
						<button
							type="button"
							class="block w-full cursor-zoom-in"
							aria-label={`Zoom in on ${product.name}`}
							onclick={openImageZoom}
						>
							<img
								src={product.gallery[selectedImage]}
								alt={`${product.name}, image ${selectedImage + 1} of ${product.gallery.length}`}
								class="store-image aspect-[4/5] w-full object-cover"
							/>
						</button>
						<button
							type="button"
							class="absolute right-3 bottom-3 inline-flex items-center gap-2 bg-[#fffaf6]/95 px-3 py-2 text-xs shadow-sm transition hover:text-[#b85d72]"
							aria-label="Zoom product image"
							onclick={openImageZoom}
						>
							<ZoomIn size={15} />
							Zoom
						</button>
					</div>

					<div class="mt-3 grid grid-cols-2 gap-3 sm:gap-4">
						{#each product.gallery as image, index (image)}
							<button
								type="button"
								class={`overflow-hidden border-2 transition ${
									selectedImage === index
										? 'border-[#78394a]'
										: 'border-transparent hover:border-[#b85d72]'
								}`}
								aria-label={`View product image ${index + 1}`}
								aria-pressed={selectedImage === index}
								onclick={() => (selectedImage = index)}
							>
								<img
									src={image}
									alt={`${product.name} thumbnail ${index + 1}`}
									loading="lazy"
									class="aspect-[4/3] w-full object-cover"
								/>
							</button>
						{/each}
					</div>
				</div>

				<section class="flex flex-col justify-center">
					<p class="text-xs tracking-[0.2em] text-[#b85d72] uppercase">
						{product.brand}
					</p>

					<h1 class="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
						{product.name}
					</h1>

					<a
						href="#reviews"
						class="mt-4 inline-flex w-fit items-center gap-2 text-sm text-[#827773] transition hover:text-[#b85d72]"
						aria-label={reviews.length
							? `${averageRating.toFixed(1)} out of 5 stars from ${reviews.length} local reviews`
							: 'No reviews yet, be the first to review'}
					>
						{#if reviews.length > 0}
							<span class="flex text-[#b85d72]" aria-hidden="true">
								{#each [1, 2, 3, 4, 5] as star (star)}
									<Star
										size={15}
										fill={star <= Math.round(averageRating) ? 'currentColor' : 'none'}
									/>
								{/each}
							</span>
							<span
								>{averageRating.toFixed(1)} · {reviews.length}
								{reviews.length === 1 ? 'review' : 'reviews'}</span
							>
						{:else}
							<span>No reviews yet · Be the first</span>
						{/if}
					</a>

					<p class="mt-5 text-xl font-medium">
						{formatPrice(product.price)}
					</p>

					<div class="my-7 border-t border-[#eaded8]"></div>

					<h2 class="text-xs font-semibold tracking-[0.15em]">PRODUCT DETAILS</h2>

					<p class="mt-4 text-sm leading-7 text-[#827773]">
						{product.description}
					</p>

					<p class="mt-5 text-sm text-[#827773]">
						Category: {product.category}
					</p>

					<div class="mt-8">
						<label for="quantity" class="mb-3 block text-xs font-semibold tracking-[0.12em]">
							QUANTITY
						</label>

						<div class="inline-flex items-center border border-[#eaded8]">
							<button
								type="button"
								class="p-3 transition hover:bg-[#f2e3dc]"
								aria-label="Decrease quantity"
								disabled={quantity <= 1}
								onclick={() => (quantity = Math.max(1, quantity - 1))}
							>
								<Minus size={16} />
							</button>

							<input
								id="quantity"
								type="number"
								min="1"
								max="99"
								bind:value={quantity}
								onblur={() => {
									quantity = Math.max(1, Math.min(99, Math.floor(Number(quantity) || 1)));
								}}
								class="w-14 bg-transparent text-center text-sm outline-none"
							/>

							<button
								type="button"
								class="p-3 transition hover:bg-[#f2e3dc]"
								aria-label="Increase quantity"
								disabled={quantity >= 99}
								onclick={() => (quantity = Math.min(99, quantity + 1))}
							>
								<Plus size={16} />
							</button>
						</div>
					</div>

					<button
						type="button"
						class="mt-7 flex w-full items-center justify-center gap-3 bg-[#78394a] px-6 py-4 text-xs tracking-[0.15em] text-white transition hover:bg-[#572735]"
						onclick={addToBag}
					>
						<ShoppingBag size={17} />
						ADD TO BAG · {formatPrice(product.price * quantity)}
					</button>

					<button
						type="button"
						class="mt-3 flex w-full items-center justify-center gap-2 border border-[#eaded8] px-5 py-4 text-xs tracking-[0.12em] transition hover:border-[#b85d72] hover:text-[#b85d72]"
						aria-pressed={wishlist.has(product.id)}
						onclick={() => wishlist.toggle(product.id)}
					>
						<Heart size={17} fill={wishlist.has(product.id) ? 'currentColor' : 'none'} />
						{wishlist.has(product.id) ? 'SAVED TO WISHLIST' : 'SAVE TO WISHLIST'}
					</button>

					{#if addedToBag}
						<p class="mt-4 flex items-center gap-2 text-sm text-[#52744c]" role="status">
							<Check size={17} />
							Added to your bag successfully.
							<a href={resolve('/cart')} class="underline underline-offset-4">View bag</a>
						</p>
					{/if}

					<p class="mt-6 text-xs leading-6 text-[#827773]">
						Product descriptions, catalogue entries and prices are sample development data. Confirm
						actual product details and availability before selling.
					</p>
				</section>
			</div>

			<section
				id="reviews"
				class="mt-16 grid gap-10 border-t border-[#eaded8] py-12 lg:grid-cols-[1fr_360px]"
				aria-labelledby="reviews-title"
			>
				<div>
					<p class="text-xs tracking-[0.18em] text-[#b85d72]">CUSTOMER NOTES</p>
					<h2 id="reviews-title" class="mt-3 font-serif text-3xl">
						Reviews {#if reviews.length}({reviews.length}){/if}
					</h2>
					{#if reviews.length === 0}
						<div
							class="mt-6 border border-dashed border-[#d9c6be] bg-white/40 px-5 py-8 text-center sm:px-8"
						>
							<Star size={22} class="mx-auto text-[#b85d72]" />
							<p class="mt-3 text-sm">No reviews yet. Share your experience with this product.</p>
						</div>
					{:else}
						<div class="mt-6 divide-y divide-[#eaded8]">
							{#each reviews as review (review.id)}
								<article class="py-5">
									<div
										class="flex items-center gap-1 text-[#b85d72]"
										aria-label={`${review.rating} out of 5 stars`}
									>
										{#each [1, 2, 3, 4, 5] as star (star)}
											<Star size={14} fill={star <= review.rating ? 'currentColor' : 'none'} />
										{/each}
									</div>
									<h3 class="mt-2 text-sm font-semibold">{review.title || 'Customer review'}</h3>
									<p class="mt-2 text-sm leading-6 text-[#827773]">{review.comment}</p>
									<time class="mt-2 block text-xs text-[#a79a94]" datetime={review.createdAt}>
										{new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(
											new Date(review.createdAt)
										)}
									</time>
								</article>
							{/each}
						</div>
					{/if}
				</div>

				<form class="h-fit border border-[#eaded8] bg-white/50 p-5 sm:p-7" onsubmit={submitReview}>
					<h3 class="font-serif text-2xl">Write a review</h3>
					<p class="mt-2 text-xs leading-5 text-[#827773]">
						Reviews in this preview are saved only in this browser and are not verified or shared
						with the store.
					</p>

					<fieldset class="mt-5">
						<legend class="mb-2 text-xs font-semibold tracking-[0.1em]">YOUR RATING</legend>
						<div class="flex gap-1">
							{#each [1, 2, 3, 4, 5] as star (star)}
								<button
									type="button"
									class="p-1 text-[#b85d72] transition hover:scale-110"
									aria-label={`Rate ${star} out of 5 stars`}
									aria-pressed={selectedRating === star}
									onclick={() => (selectedRating = star)}
								>
									<Star size={22} fill={selectedRating >= star ? 'currentColor' : 'none'} />
								</button>
							{/each}
						</div>
					</fieldset>

					<label class="mt-5 block text-xs font-semibold tracking-[0.1em]" for="review-title">
						TITLE
					</label>
					<input
						id="review-title"
						bind:value={reviewTitle}
						maxlength="80"
						class="mt-2 w-full border border-[#eaded8] bg-transparent px-3 py-3 text-sm outline-none focus:border-[#b85d72]"
						placeholder="Sum up your experience"
					/>

					<label class="mt-5 block text-xs font-semibold tracking-[0.1em]" for="review-comment">
						YOUR REVIEW
					</label>
					<textarea
						id="review-comment"
						bind:value={reviewComment}
						required
						minlength="5"
						maxlength="1000"
						rows="4"
						class="mt-2 w-full resize-y border border-[#eaded8] bg-transparent px-3 py-3 text-sm outline-none focus:border-[#b85d72]"
						placeholder="What would you like others to know?"></textarea>

					{#if reviewStorageError}
						<p class="mt-3 text-xs text-[#9b394d]" role="alert">{reviewStorageError}</p>
					{/if}

					<button
						type="submit"
						disabled={selectedRating === 0}
						class="mt-5 w-full bg-[#78394a] px-5 py-4 text-xs tracking-[0.12em] text-white transition hover:bg-[#572735] disabled:cursor-not-allowed disabled:opacity-50"
					>
						SUBMIT REVIEW
					</button>
				</form>
			</section>

			{#if relatedProducts.length > 0}
				<section class="border-t border-[#eaded8] py-12" aria-labelledby="routine-title">
					<p class="text-xs tracking-[0.18em] text-[#b85d72]">A THOUGHTFUL PAIRING</p>
					<h2 id="routine-title" class="mt-3 font-serif text-3xl">Complete your routine</h2>
					<p class="mt-2 text-sm text-[#827773]">A few other steps you might like to explore.</p>
					<div class="mt-7 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
						{#each relatedProducts as related (related.id)}
							<a href={resolve('/shop/[id]', { id: String(related.id) })} class="group min-w-0">
								<div class="aspect-[4/5] overflow-hidden bg-[#f2e3dc]">
									<img
										src={related.image}
										alt={related.name}
										loading="lazy"
										class="store-image h-full w-full object-cover transition duration-500 group-hover:scale-105"
									/>
								</div>
								<p class="mt-3 text-[10px] tracking-[0.13em] text-[#b85d72] uppercase">
									{related.category}
								</p>
								<h3 class="mt-1 text-sm">{related.name}</h3>
								<p class="mt-1 text-sm font-medium">{formatPrice(related.price)}</p>
							</a>
						{/each}
					</div>
				</section>
			{/if}

			{#if recentlyViewedProducts.length > 0}
				<section class="border-t border-[#eaded8] py-12" aria-labelledby="detail-recent-title">
					<div class="flex items-center gap-2">
						<Clock3 size={17} class="text-[#b85d72]" />
						<h2 id="detail-recent-title" class="font-serif text-2xl">Recently viewed</h2>
					</div>
					{#if recentProductsError}
						<p class="mt-3 text-xs text-[#9b394d]" role="status">{recentProductsError}</p>
					{/if}
					<div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
						{#each recentlyViewedProducts as recent (recent.id)}
							<a href={resolve('/shop/[id]', { id: String(recent.id) })} class="group min-w-0">
								<div class="aspect-[4/5] overflow-hidden bg-[#f2e3dc]">
									<img
										src={recent.image}
										alt={recent.name}
										loading="lazy"
										class="store-image h-full w-full object-cover transition duration-500 group-hover:scale-105"
									/>
								</div>
								<p class="mt-3 text-sm">{recent.name}</p>
								<p class="mt-1 text-sm font-medium">{formatPrice(recent.price)}</p>
							</a>
						{/each}
					</div>
				</section>
			{/if}

			<dialog
				bind:this={zoomDialog}
				class="m-auto max-h-[90dvh] max-w-[min(92vw,900px)] overflow-hidden bg-[#fffaf6] p-2 backdrop:bg-[#1b1514]/85"
				aria-label={`Zoomed ${product.name} image`}
			>
				<div class="relative">
					<button
						type="button"
						class="absolute top-2 right-2 z-10 rounded-full bg-[#fffaf6] p-2 shadow"
						aria-label="Close zoomed image"
						onclick={() => zoomDialog?.close()}
					>
						<X size={20} />
					</button>
					<img
						src={product.gallery[selectedImage]}
						alt={`${product.name}, enlarged`}
						class="max-h-[85dvh] w-full object-contain"
					/>
				</div>
			</dialog>
		{:else}
			<section class="py-24 text-center">
				<h1 class="font-serif text-3xl">Product not found</h1>
				<p class="mt-4 text-sm text-[#827773]">
					This product may have been removed or the link may be incorrect.
				</p>
				<a
					href={resolve('/shop')}
					class="mt-7 inline-block bg-[#78394a] px-6 py-3 text-sm text-white transition hover:bg-[#572735]"
				>
					Browse all products
				</a>
			</section>
		{/if}
	</main>

	<footer class="mt-12 border-t border-[#eaded8] px-5 py-8 text-center text-xs text-[#827773]">
		© {new Date().getFullYear()} DIVA PULCHRA · THE ART OF SKINCARE
	</footer>
</div>
