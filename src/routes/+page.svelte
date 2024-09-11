<script lang="ts">
	import CSS from './CSS.svelte';
	import Text from './Text.svelte';
	import { slide } from 'svelte/transition';

	let text = $state("You're Listening to Syntax");
	let min_viewport = $state(400);
	let max_viewport = $state(1080);

	// Base sizes
	let min_font_size = $state(14);
	let max_font_size = $state(20);

	let steps_below_base = $state(1);
	let steps_above_base = $state(6);

	let context: 'CONTAINER' | 'VIEWPORT' = $state('VIEWPORT');

	// 1rem = 16px
	let rem_size = $state(16);
	let min_ratio = $state(5 / 4);
	let max_ratio = $state(4 / 3);

	let min_viewport_rem = $derived(min_viewport / rem_size);
	let max_viewport_rem = $derived(max_viewport / rem_size);

	let min_font_size_rem = $derived(min_font_size / rem_size);
	let max_font_size_rem = $derived(max_font_size / rem_size);

	// Formulas
	// Your font size exists on a linear scale, to calculate this, you need to do math to find the slope and the intercept this gives you a value at any given point in the linear scale
	// slope = (max_font_size - min_font_size) / (max_viewport - min_viewport)
	// y-intercept is the x value when y hits 0
	// So, the y-intercept is just a fancy way of saying where your line starts on the y-axis before it begins its journey across the graph
	// y-intercept = min_font_size - slope * min_viewport
	// css for a linear scale
	// clamp(min_font_size, preferred, max_font_size)
	// to elaborate on preferred
	// clamp(min_font_size, (slope * 100vi) + y-intercept, max_font_size)
	// vi === viewport inline basically logical version of vw

	let steps = $derived(generate_steps_array(steps_above_base, steps_below_base));
	$inspect(steps);

	function generate_steps_array(stepsAbove: number, stepsBelow: number) {
		const result = [];

		// Add steps below the base data
		for (let i = stepsBelow; i > 0; i--) {
			result.push(i * -1);
		}

		// Add the base data
		result.push(0);

		// Add steps above the base data
		for (let i = 1; i <= stepsAbove; i++) {
			result.push(i);
		}

		return result;
	}
</script>

<div class="controls">
	<div>
		<h2 class="h3">Global</h2>
		<label for="scale">Min Size Scale</label>
		<select name="scale" id="scale" bind:value={min_ratio}>
			<option value={16 / 15}>Minor 2nd 16/15</option>
			<option value={9 / 8}>Major 2nd 9/8</option>
			<option value={5 / 4}>Major 3rd 5/4</option>
			<option value={4 / 3}>Perfect Fourth 4/3</option>
			<option value={7 / 5}>Augmented Fourth</option>
			<option value={3 / 2}>Perfect Fifth 3/2</option>
			<option value={1.618}>Golden Ratio</option>
		</select>
		<label for="scale">Max Size Scale</label>
		<select name="scale" id="scale" bind:value={max_ratio}>
			<option value={16 / 15}>Minor 2nd 16/15</option>
			<option value={9 / 8}>Major 2nd 9/8</option>
			<option value={5 / 4}>Major 3rd 5/4</option>
			<option value={4 / 3}>Perfect Fourth 4/3</option>
			<option value={7 / 5}>Augmented Fourth</option>
			<option value={3 / 2}>Perfect Fifth 3/2</option>
			<option value={1.618}>Golden Ratio</option>
		</select>
	</div>

	<div>
		<h2 class="h3">Mobile</h2>

		<div class="conts">
			<div>
				<label for="mobile_base_font">Base Font Size</label>
				<input id="mobile_base_font" class="number" type="number" bind:value={min_font_size} />px
			</div>

			<div>
				<label for="mobile_viewport">Viewport Size</label>
				<input id="mobile_viewport" class="viewport" type="number" bind:value={min_viewport} />px
			</div>
		</div>
	</div>
	<div>
		<h2 class="h3">Desktop</h2>
		<div class="conts">
			<div>
				<label for="base_font">Base Font Size</label>
				<input id="base_font" class="number" type="number" bind:value={max_font_size} />px
			</div>

			<div>
				<label for="viewport">Viewport Size</label>
				<input id="viewport" class="viewport" type="number" bind:value={max_viewport} />px
			</div>
		</div>
	</div>
</div>
<label for="container"
	><input
		type="checkbox"
		id="container"
		onchange={(e) => (context = e.target.checked ? 'CONTAINER' : 'VIEWPORT')}
	/> Preview Container</label
>
<div class="resize">
	<div class="add-remove">
		{#if steps_below_base > 0}
			<button onclick={() => steps_below_base--}>-</button>
		{/if}
		<button onclick={() => steps_below_base++}>+</button>
	</div>
	<div
		class="steps fluid"
		class:fluid-text-container={context === 'CONTAINER'}
		class:resize-container={context === 'CONTAINER'}
		style:--font-size-min={min_font_size}
		style:--font-size-max={max_font_size}
		style:--font-ratio-min={min_ratio}
		style:--font-ratio-max={max_ratio}
	>
		{#each steps as step (step + '-steps')}
			<div transition:slide>
				<Text {step} bind:text />
			</div>
		{/each}
	</div>
	<div class="add-remove">
		{#if steps_above_base > 0}
			<button onclick={() => steps_above_base--}>-</button>
		{/if}
		<button onclick={() => steps_above_base++}>+</button>
	</div>
</div>

<CSS {steps} {min_font_size} {max_font_size} {min_ratio} {max_ratio} />

<style>
	.resize {
		margin: 1rem 0;
	}

	.resize-container {
		resize: horizontal;
		overflow: hidden;
	}

	.controls {
		display: flex;
		gap: 30px;
		justify-content: center;
	}

	.conts {
		display: flex;
		gap: 10px;
	}

	label {
		display: block;
		margin-bottom: 5px;
		font-size: clamp(0.56rem, 0.658824vi + 0.4rem, 0.84rem);
	}

	.number {
		width: 40px;
	}

	.viewport {
		width: 55px;
	}

	.steps {
		margin: 1rem 0;
	}

	.add-remove {
		text-align: center;
		button {
			border-radius: 50%;
			text-align: center;
			width: 30px;
			height: 30px;
		}
	}

	h1,
	.h1 {
		--fl: 5;
	}
	h2,
	.h2 {
		--fl: 4;
	}
	h3,
	.h3 {
		--fl: 3;
	}
	h4,
	.h4 {
		--fl: 2;
	}
	h5,
	.h5 {
		--fl: 1;
	}
	h6,
	.h6 {
		--fl: 0;
	}
</style>
