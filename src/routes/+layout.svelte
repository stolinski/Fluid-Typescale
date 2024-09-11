<script lang="ts">
	import './style.css';
	let { children } = $props();
</script>

<div class="layout">
	<h1>Fluid Type Calculator</h1>
</div>
<main class="layout">
	{@render children()}
</main>

<style>
	h1 {
		margin-block: var(--vs-l);
	}
</style>
