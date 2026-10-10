<script lang="ts">
	import { resolve } from '$app/paths';
	import { getContext } from 'svelte';
	import {
		ArrowRight,
		Search,
		ShoppingBag,
		UserRound,
		Menu,
		X,
		Heart,
		Sparkles,
		ChevronRight
	} from '@lucide/svelte';

	import { products } from '../lib/data/products';
	import type { Cart } from '../lib/cart.svelte';
	import type { Wishlist } from '../lib/wishlist.svelte';

	const cart = getContext<Cart>('cart');
	const wishlist = getContext<Wishlist>('wishlist');
	let menuOpen = $state(false);
	let searchOpen = $state(false);
	let email = $state('');

	const categories = [
		{
			name: 'Cleansers',
			description: 'A fresh start for your skin',
			image:
				'https://images.unsplash.com/photo-1790156566837-537cf985254c?auto=format&fit=crop&w=800&q=85'
		},
		{
			name: 'Sun Care',
			description: 'Everyday protection',
			image:
				'https://images.unsplash.com/photo-1738721796993-5f42d9315689?auto=format&fit=crop&w=800&q=85'
		},
		{
			name: 'Masks',
			description: 'A little extra care',
			image:
				'https://images.unsplash.com/photo-1648203276014-20f97ba1f817?auto=format&fit=crop&w=800&q=85'
		},
		{
			name: 'Body Care',
			description: 'Softness from head to toe',
			image:
				'https://images.unsplash.com/photo-1703174323653-0455deaf7f11?auto=format&fit=crop&w=800&q=85'
		}
	];

	const featuredProducts = products.filter((product) => product.featured);

	const brands = ['CERAVE', 'THE ORDINARY', 'LA ROCHE-POSAY', 'COSRX', 'NEUTROGENA'];

	function addToBag(productId: number) {
		cart.add(productId);
	}

	function subscribe(event: SubmitEvent) {
		event.preventDefault();

		if (!email.trim()) return;

		alert('Thanks for your interest! Newsletter signup will be connected to our backend soon.');
		email = '';
	}

	function formatPrice(price: number) {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: 'NGN',
			maximumFractionDigits: 0
		}).format(price);
	}
</script>

<svelte:head>
	<title>DIVA PULCHRA — Your Skin, Your Ritual</title>
	<meta
		name="description"
		content="Discover your next skincare favourite at DIVA PULCHRA. Explore curated skincare essentials, beauty rituals and trusted brands."
	/>
	<meta name="theme-color" content="#fff8f3" />
</svelte:head>

<div class="min-h-screen bg-[#fffaf6] text-[#29211f]">
	<!-- Announcement bar -->
	<div class="bg-[#78394a] px-4 py-2.5 text-center text-xs tracking-[0.15em] text-white sm:text-sm">
		YOUR SKIN DESERVES THE EXTRAORDINARY
		<span class="mx-2 hidden sm:inline">·</span>
		<span class="hidden sm:inline">DISCOVER YOUR NEW RITUAL</span>
	</div>

	<!-- Header -->
	<header class="sticky top-0 z-40 border-b border-[#eaded8] bg-[#fffaf6]/95 backdrop-blur-md">
		<div
			class="mx-auto flex max-w-7xl items-center justify-between gap-1 px-4 py-4 sm:gap-4 sm:px-5 lg:px-8"
		>
			<button
				class="rounded-full p-1 transition hover:bg-[#f5e9e4] sm:p-2 md:hidden"
				onclick={() => (menuOpen = !menuOpen)}
				aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			>
				{#if menuOpen}
					<X size={22} />
				{:else}
					<Menu size={22} />
				{/if}
			</button>

			<a href="#home" class="shrink-0 text-center">
				<span class="block text-lg font-semibold tracking-[0.12em] sm:text-2xl sm:tracking-[0.16em]"
					>DIVA PULCHRA</span
				>
				<span
					class="mt-1 block text-[8px] tracking-[0.25em] text-[#827773] sm:text-[10px] sm:tracking-[0.36em]"
				>
					THE ART OF SKINCARE
				</span>
			</a>

			<nav class="hidden items-center gap-7 text-sm md:flex">
				<a href="#shop" class="transition hover:text-[#b85d72]">Shop all</a>
				<a href="#categories" class="transition hover:text-[#b85d72]">Categories</a>
				<a href="#brands" class="transition hover:text-[#b85d72]">Brands</a>
				<a href="#skin-guide" class="transition hover:text-[#b85d72]">Skin guide</a>
			</nav>

			<div class="flex items-center gap-0 sm:gap-3">
				<button
					class="rounded-full p-1 transition hover:bg-[#f5e9e4] sm:p-2"
					onclick={() => (searchOpen = !searchOpen)}
					aria-label="Toggle search"
				>
					<Search size={20} strokeWidth={1.6} />
				</button>

				<button
					class="hidden rounded-full p-2 transition hover:bg-[#f5e9e4] sm:block"
					aria-label="Account"
				>
					<UserRound size={20} strokeWidth={1.6} />
				</button>

				<a
					href={resolve('/wishlist')}
					class="relative rounded-full p-1 transition hover:bg-[#f5e9e4] sm:p-2"
					aria-label={`Wishlist, ${wishlist.count} saved products`}
				>
					<Heart size={20} strokeWidth={1.6} />
					{#if wishlist.count > 0}
						<span
							class="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b85d72] px-1 text-[10px] text-white"
						>
							{wishlist.count}
						</span>
					{/if}
				</a>

				<a
					href={resolve('/cart')}
					class="relative rounded-full p-1 transition hover:bg-[#f5e9e4] sm:p-2"
					aria-label={`Shopping bag, ${cart.itemCount} items`}
				>
					<ShoppingBag size={20} strokeWidth={1.6} />
					{#if cart.itemCount > 0}
						<span
							class="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#b85d72] px-1 text-[10px] text-white"
						>
							{cart.itemCount}
						</span>
					{/if}
				</a>
			</div>
		</div>

		{#if searchOpen}
			<div class="border-t border-[#eaded8] px-5 py-4">
				<form action="#shop" class="mx-auto flex max-w-2xl items-center gap-3">
					<Search size={19} class="text-[#827773]" />
					<input
						type="search"
						placeholder="Search skincare, brands and products..."
						class="w-full bg-transparent py-2 text-sm outline-none placeholder:text-[#a79a94]"
						aria-label="Search products"
					/>
					<button type="button" onclick={() => (searchOpen = false)} aria-label="Close search">
						<X size={19} />
					</button>
				</form>
			</div>
		{/if}

		{#if menuOpen}
			<nav class="border-t border-[#eaded8] px-6 py-5 md:hidden">
				<div class="flex flex-col gap-5 text-sm">
					<a href="#shop" onclick={() => (menuOpen = false)}>Shop all</a>
					<a href="#categories" onclick={() => (menuOpen = false)}>Categories</a>
					<a href="#brands" onclick={() => (menuOpen = false)}>Brands</a>
					<a href="#skin-guide" onclick={() => (menuOpen = false)}>Skin guide</a>
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

	<main>
		<!-- Hero -->
		<section
			id="home"
			class="mx-auto grid max-w-7xl items-center gap-8 px-5 py-10 sm:py-14 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20"
		>
			<div class="order-2 py-5 lg:order-1 lg:py-12">
				<div class="mb-6 flex items-center gap-2 text-xs tracking-[0.2em] text-[#b85d72]">
					<Sparkles size={16} />
					YOUR SKINCARE, ELEVATED
				</div>

				<h1
					class="max-w-xl font-serif text-5xl leading-[1.08] tracking-[-0.04em] sm:text-6xl lg:text-7xl"
				>
					Your skin.
					<br />
					Your ritual.
					<br />
					<span class="text-[#b85d72] italic">Your glow.</span>
				</h1>

				<p class="mt-6 max-w-md text-base leading-8 text-[#827773] sm:text-lg">
					Thoughtfully curated skincare for every complexion, every concern and every version of
					you.
				</p>

				<div class="mt-8 flex flex-wrap items-center gap-4">
					<a
						href="#shop"
						class="inline-flex items-center gap-3 bg-[#78394a] px-7 py-4 text-xs tracking-[0.15em] text-white transition hover:bg-[#572735]"
					>
						EXPLORE THE COLLECTION
						<ArrowRight size={17} />
					</a>

					<a
						href="#skin-guide"
						class="text-sm underline decoration-[#c9aaa2] underline-offset-4 hover:text-[#b85d72]"
					>
						Find your routine
					</a>
				</div>

				<div
					class="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-[#eaded8] pt-6 text-xs text-[#827773]"
				>
					<span>Thoughtfully selected</span>
					<span>Everyday essentials</span>
					<span>Beauty, made personal</span>
				</div>
			</div>

			<div
				class="relative order-1 min-h-[380px] overflow-hidden bg-[#f2e3dc] sm:min-h-[520px] lg:order-2 lg:min-h-[610px]"
			>
				<img
					src="https://images.unsplash.com/photo-1728727267814-792db55ce678?auto=format&fit=crop&w=1200&q=90"
					alt="A woman with a skincare mask applying cream to her face"
					class="absolute inset-0 h-full w-full object-cover"
				/>
				<div
					class="absolute right-5 bottom-5 left-5 bg-[#fffaf6]/90 p-5 backdrop-blur-sm sm:right-8 sm:bottom-8 sm:left-8 sm:p-7"
				>
					<p class="text-[10px] tracking-[0.22em] text-[#b85d72]">THE DIVA PULCHRA EDIT</p>
					<p class="mt-2 font-serif text-2xl sm:text-3xl">A little luxury, every day.</p>
					<a href="#categories" class="mt-3 inline-flex items-center gap-2 text-sm">
						Discover your essentials <ArrowRight size={16} />
					</a>
				</div>
			</div>
		</section>

		<!-- Brand promise -->
		<section class="border-y border-[#eaded8] bg-[#f8eee8]">
			<div class="mx-auto grid max-w-7xl gap-6 px-5 py-7 text-center sm:grid-cols-3 lg:px-8">
				<div>
					<p class="font-serif text-lg">Made for your ritual</p>
					<p class="mt-1 text-xs text-[#827773]">Find products that fit your routine.</p>
				</div>
				<div>
					<p class="font-serif text-lg">Curated with care</p>
					<p class="mt-1 text-xs text-[#827773]">Discover skincare worth knowing.</p>
				</div>
				<div>
					<p class="font-serif text-lg">Glow at your pace</p>
					<p class="mt-1 text-xs text-[#827773]">Build a routine that feels like you.</p>
				</div>
			</div>
		</section>

		<!-- Categories -->
		<section id="categories" class="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
			<div class="mb-8 flex items-end justify-between gap-4">
				<div>
					<p class="text-xs tracking-[0.2em] text-[#b85d72]">EXPLORE THE EDIT</p>
					<h2 class="mt-3 font-serif text-3xl sm:text-4xl">Shop by category</h2>
				</div>
				<a href="#shop" class="hidden items-center gap-2 text-sm sm:inline-flex">
					View everything <ArrowRight size={16} />
				</a>
			</div>

			<div class="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
				{#each categories as category (category.name)}
					<a href="#shop" class="group">
						<div class="aspect-[4/5] overflow-hidden bg-[#f2e3dc]">
							<img
								src={category.image}
								alt={category.name}
								loading="lazy"
								class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
							/>
						</div>
						<div class="flex items-start justify-between gap-2 pt-4">
							<div>
								<h3 class="font-serif text-xl">{category.name}</h3>
								<p class="mt-1 text-xs text-[#827773]">{category.description}</p>
							</div>
							<ChevronRight
								size={18}
								class="mt-1 shrink-0 text-[#b85d72] transition group-hover:translate-x-1"
							/>
						</div>
					</a>
				{/each}
			</div>
		</section>

		<!-- Products -->
		<section id="shop" class="bg-[#f8eee8] py-16 sm:py-20">
			<div class="mx-auto max-w-7xl px-5 lg:px-8">
				<div class="mb-8 flex items-end justify-between gap-4">
					<div>
						<p class="text-xs tracking-[0.2em] text-[#b85d72]">THE CURRENT OBSESSION</p>
						<h2 class="mt-3 font-serif text-3xl sm:text-4xl">Your next favourites</h2>
						<p class="mt-3 max-w-lg text-sm leading-6 text-[#827773]">
							Explore the essentials that make your daily skincare ritual feel special.
						</p>
					</div>
					<a href="#categories" class="hidden items-center gap-2 text-sm sm:inline-flex">
						Explore categories <ArrowRight size={16} />
					</a>
				</div>

				<div class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
					{#each featuredProducts as product (product.id)}
						<article class="group min-w-0">
							<div class="relative aspect-[4/5] overflow-hidden bg-[#f0e2dc]">
								<a
									href={resolve('/shop/[id]', { id: String(product.id) })}
									aria-label={`View ${product.name}`}
								>
									<img
										src={product.image}
										alt={product.name}
										loading="lazy"
										class="store-image h-full w-full object-cover transition duration-500 group-hover:scale-105"
									/>
								</a>
								<span
									class="absolute top-2 left-2 bg-[#fffaf6] px-2 py-1 text-[8px] tracking-[0.12em] sm:top-3 sm:left-3 sm:text-[9px]"
								>
									{product.category.toUpperCase()}
								</span>
								<button
									class="absolute top-2 right-2 rounded-full bg-[#fffaf6]/90 p-2 transition hover:bg-white sm:top-3 sm:right-3"
									aria-label={wishlist.has(product.id)
										? `Remove ${product.name} from wishlist`
										: `Save ${product.name} to wishlist`}
									aria-pressed={wishlist.has(product.id)}
									onclick={() => wishlist.toggle(product.id)}
								>
									<Heart
										size={16}
										strokeWidth={1.6}
										fill={wishlist.has(product.id) ? 'currentColor' : 'none'}
										class={wishlist.has(product.id) ? 'text-[#b85d72]' : ''}
									/>
								</button>
							</div>

							<div class="pt-4">
								<p class="text-[9px] tracking-[0.16em] text-[#b85d72] sm:text-[10px]">
									{product.brand.toUpperCase()}
								</p>
								<h3 class="mt-2 text-sm leading-5 transition hover:text-[#b85d72] sm:text-base">
									<a href={resolve('/shop/[id]', { id: String(product.id) })}>
										{product.name}
									</a>
								</h3>
								<p class="mt-2 text-sm font-medium">{formatPrice(product.price)}</p>
								<button
									class="mt-4 w-full border border-[#78394a] px-3 py-3 text-[10px] tracking-[0.13em] transition hover:bg-[#78394a] hover:text-white sm:text-xs"
									onclick={() => addToBag(product.id)}
								>
									ADD TO BAG
								</button>
							</div>
						</article>
					{/each}
				</div>

				<p class="mt-6 text-xs leading-5 text-[#827773]">
					Demo products and prices for the prototype. Final catalogue, stock and pricing will be
					configured later.
				</p>
			</div>
		</section>

		<!-- Brands -->
		<section id="brands" class="mx-auto max-w-7xl px-5 py-16 text-center sm:py-20 lg:px-8">
			<p class="text-xs tracking-[0.2em] text-[#b85d72]">BRANDS YOU KNOW, FINDS YOU'LL LOVE</p>
			<h2 class="mt-3 font-serif text-3xl sm:text-4xl">The names behind your glow</h2>
			<p class="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#827773]">
				Discover a considered selection of skincare brands, from everyday essentials to targeted
				treatments.
			</p>

			<div
				class="mt-10 grid grid-cols-2 items-center gap-6 border-y border-[#eaded8] py-8 sm:grid-cols-3 lg:grid-cols-5"
			>
				{#each brands as brand (brand)}
					<p class="text-xs font-semibold tracking-[0.12em] text-[#655652] sm:text-sm">{brand}</p>
				{/each}
			</div>
			<p class="mt-4 text-xs text-[#827773]">
				Brand names are illustrative catalogue placeholders for now.
			</p>
		</section>

		<!-- Skin guide -->
		<section
			id="skin-guide"
			class="mx-auto grid max-w-7xl gap-8 px-5 pb-16 sm:pb-20 lg:grid-cols-2 lg:gap-14 lg:px-8"
		>
			<div class="min-h-[320px] overflow-hidden bg-[#f2e3dc] sm:min-h-[440px]">
				<img
					src="https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1000&q=85"
					alt="A selection of skincare essentials"
					loading="lazy"
					class="h-full min-h-[320px] w-full object-cover sm:min-h-[440px]"
				/>
			</div>

			<div class="flex flex-col justify-center py-4 lg:py-10">
				<p class="text-xs tracking-[0.2em] text-[#b85d72]">A ROUTINE THAT FEELS LIKE YOU</p>
				<h2 class="mt-4 max-w-lg font-serif text-4xl leading-tight sm:text-5xl">
					Good skin days begin with a little knowledge.
				</h2>
				<p class="mt-5 max-w-lg text-sm leading-7 text-[#827773]">
					Skincare doesn't need to be complicated. Learn about your skin's needs, discover
					ingredient basics and build a routine one thoughtful step at a time.
				</p>

				<div class="mt-7 space-y-4">
					<div class="flex gap-4 border-b border-[#eaded8] pb-4">
						<span class="font-serif text-xl text-[#b85d72]">01</span>
						<div>
							<h3 class="text-sm font-medium">Understand your skin</h3>
							<p class="mt-1 text-xs leading-5 text-[#827773]">
								Explore common skin types and concerns.
							</p>
						</div>
					</div>
					<div class="flex gap-4 border-b border-[#eaded8] pb-4">
						<span class="font-serif text-xl text-[#b85d72]">02</span>
						<div>
							<h3 class="text-sm font-medium">Keep your routine balanced</h3>
							<p class="mt-1 text-xs leading-5 text-[#827773]">
								Start with cleansing, moisturising and sun protection.
							</p>
						</div>
					</div>
					<div class="flex gap-4">
						<span class="font-serif text-xl text-[#b85d72]">03</span>
						<div>
							<h3 class="text-sm font-medium">Discover products thoughtfully</h3>
							<p class="mt-1 text-xs leading-5 text-[#827773]">
								Choose products that suit your preferences and needs.
							</p>
						</div>
					</div>
				</div>

				<a href="#categories" class="mt-8 inline-flex items-center gap-3 text-sm">
					Explore skincare essentials <ArrowRight size={17} />
				</a>
			</div>
		</section>

		<!-- Newsletter -->
		<section class="bg-[#78394a] px-5 py-16 text-white sm:py-20">
			<div class="mx-auto max-w-2xl text-center">
				<Sparkles size={23} class="mx-auto text-[#f1c9c7]" />
				<p class="mt-4 text-xs tracking-[0.22em] text-[#f1c9c7]">A NOTE FROM DIVA PULCHRA</p>
				<h2 class="mt-4 font-serif text-3xl sm:text-4xl">A little glow in your inbox.</h2>
				<p class="mx-auto mt-4 max-w-md text-sm leading-7 text-white/75">
					Be first to discover new arrivals, skincare inspiration and the little things we're
					loving.
				</p>

				<form onsubmit={subscribe} class="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
					<input
						type="email"
						bind:value={email}
						required
						placeholder="Your email address"
						aria-label="Your email address"
						class="min-w-0 flex-1 border border-white/40 bg-white/10 px-4 py-4 text-sm text-white outline-none placeholder:text-white/60 focus:border-white"
					/>
					<button
						type="submit"
						class="inline-flex items-center justify-center gap-2 bg-[#fffaf6] px-6 py-4 text-xs tracking-[0.15em] text-[#78394a] transition hover:bg-[#f5e9e4]"
					>
						SIGN ME UP <ArrowRight size={16} />
					</button>
				</form>
				<p class="mt-4 text-[10px] text-white/60">
					Newsletter signup is a front-end demo; no email is stored or sent yet.
				</p>
			</div>
		</section>
	</main>

	<!-- Footer -->
	<footer class="bg-[#fffaf6]">
		<div class="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
			<div class="sm:col-span-2 lg:col-span-1">
				<a href="#home" class="inline-block">
					<span class="block text-xl font-semibold tracking-[0.14em]">DIVA PULCHRA</span>
					<span class="mt-1 block text-[9px] tracking-[0.3em] text-[#827773]"
						>THE ART OF SKINCARE</span
					>
				</a>
				<p class="mt-4 max-w-xs text-sm leading-7 text-[#827773]">
					Thoughtfully curated skincare for your everyday ritual. Your skin, your pace, your glow.
				</p>
				<a
					href="https://www.instagram.com/"
					target="_blank"
					rel="noreferrer"
					aria-label="Instagram"
					class="mt-5 inline-flex items-center gap-2 text-sm transition hover:text-[#b85d72]"
				>
					Instagram <ArrowRight size={15} />
				</a>
			</div>

			<div>
				<h3 class="text-xs font-semibold tracking-[0.15em]">EXPLORE</h3>
				<ul class="mt-5 space-y-3 text-sm text-[#827773]">
					<li><a href="#shop" class="hover:text-[#b85d72]">Shop all</a></li>
					<li><a href="#categories" class="hover:text-[#b85d72]">Categories</a></li>
					<li><a href="#brands" class="hover:text-[#b85d72]">Our brands</a></li>
					<li><a href="#skin-guide" class="hover:text-[#b85d72]">Skin guide</a></li>
				</ul>
			</div>

			<div>
				<h3 class="text-xs font-semibold tracking-[0.15em]">CUSTOMER CARE</h3>
				<ul class="mt-5 space-y-3 text-sm text-[#827773]">
					<li>
						<a href="mailto:hello@divapulchra.com" class="hover:text-[#b85d72]">Contact us</a>
					</li>
					<li><a href="#home" class="hover:text-[#b85d72]">Delivery information</a></li>
					<li><a href="#home" class="hover:text-[#b85d72]">Returns and refunds</a></li>
					<li><a href="#home" class="hover:text-[#b85d72]">FAQs</a></li>
				</ul>
			</div>

			<div>
				<h3 class="text-xs font-semibold tracking-[0.15em]">OUR PROMISE</h3>
				<p class="mt-5 text-sm leading-7 text-[#827773]">
					Skincare discovery should feel personal, considered and uncomplicated. We're here to help
					you explore.
				</p>
			</div>
		</div>

		<div class="border-t border-[#eaded8]">
			<div
				class="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-[#827773] sm:flex-row sm:items-center sm:justify-between lg:px-8"
			>
				<p>© {new Date().getFullYear()} DIVA PULCHRA. All rights reserved.</p>
				<p>Made for your skincare ritual.</p>
			</div>
		</div>
	</footer>
</div>
