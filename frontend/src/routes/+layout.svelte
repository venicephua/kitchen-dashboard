<script>
    import '@fontsource/caveat-brush';
    import '../app.css'; 
	import { page } from '$app/state';
	let { children } = $props();
</script>

<div class="header-title">
	<h1>Kitchen Orders</h1>
	<span class="noto--pot-of-food"></span>
</div>

<nav>
	<a href="/" aria-current={page.url.pathname === '/'}>
		Pending Orders
	</a>

	<a href="/completed" aria-current={page.url.pathname === '/completed'}>
		Completed Orders
	</a>
</nav>

{@render children()}
