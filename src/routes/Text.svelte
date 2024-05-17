<script lang="ts">
	import { round } from './utils';

	let {
		step,
		text = $bindable()
	}: {
		step: {
			min: number;
			max: number;
			slope: number;
			y_intercept: number;
			step: number;
		};
		text: string;
	} = $props();
</script>

<div class="row">
	<span>
		{#if step.step === 0}
			Base
		{/if}
	</span>
	<p
		contenteditable
		bind:innerText={text}
		style={`font-weight: ${step.step > 0 ? 'bold' : 'normal'}; font-size: clamp(${step.min}rem, ${round(step.slope * 100, 6)}vi + ${step.y_intercept}rem, ${step.max}rem);`}
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
	}
</style>
