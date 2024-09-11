<script lang="ts">
	let {
		step,
		text = $bindable()
	}: {
		step: number;
		text: string;
	} = $props();
</script>

<div class="row">
	<span>
		{#if step === 0}
			Base
		{/if}
	</span>
	<p
		contenteditable
		bind:innerText={text}
		style:--font-level={step}
		style="font-weight: {step > 0 ? 'bold' : 'normal'};"
	></p>
</div>

<style>
	.row {
		border-bottom: 1px solid var(--fg);
		display: flex;
		position: relative;
	}
	span {
		font-size: clamp(0.56rem, 0.006588vi + 39.53rem, 0.84rem);
		position: absolute;
		rotate: -90deg;
		left: -30px;
		top: 5px;
	}

	p {
		line-height: calc(2px + 2ex + 2px);
		margin: 0;
		--fluid-min: calc(var(--font-size-min) * pow(var(--font-ratio-min), var(--font-level, 0)));
		--fluid-max: calc(var(--font-size-max) * pow(var(--font-ratio-max), var(--font-level, 0)));
		--fluid-preferred: calc(
			(var(--fluid-max) - var(--fluid-min)) / (var(--font-width-max) - var(--font-width-min))
		);
		--fluid-type: clamp(
			(var(--fluid-min) / 16) * 1rem,
			((var(--fluid-min) / 16) * 1rem) -
				(((var(--fluid-preferred) * var(--font-width-min)) / 16) * 1rem) +
				(var(--fluid-preferred) * var(--variable-unit, 100vi)),
			(var(--fluid-max) / 16) * 1rem
		);
		font-size: var(--fluid-type);
	}
</style>
