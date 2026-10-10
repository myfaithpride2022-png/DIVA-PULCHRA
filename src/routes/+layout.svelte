
<script lang="ts">
  import '../app.css';
  import { onMount, setContext } from 'svelte';
  import { createCart } from '../lib/cart.svelte';
  import { createWishlist } from '../lib/wishlist.svelte';

  let { children } = $props();

  const cart = createCart();
  const wishlist = createWishlist();

  setContext('cart', cart);
  setContext('wishlist', wishlist);

  onMount(() => {
    cart.load();
    wishlist.load();
  });
</script>

{@render children()}