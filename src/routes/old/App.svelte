<script lang="ts">
	import Text from './Text.svelte';
	import CSS from './CSS.svelte';
	import { round } from '../utils';
	import { slide } from 'svelte/transition';

	let text = $state("You're Listening to Syntax");
	let min_viewport = $state(400);
	let max_viewport = $state(1080);

	// Base sizes
	let min_font_size = $state(16);
	let max_font_size = $state(24);

	let steps_below_base = $state(1);
	let steps_above_base = $state(6);

	// 1rem = 16px
	let rem_size = $state(16);
	let ratio = $state(4 / 3);

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

	function get_font_size_from_ratio(size: number, step: number) {
		let final_size = size;
		if (step < 0) {
			final_size = size / Math.pow(ratio, step * -1);
		} else {
			if (step === 0) {
				final_size = size;
			} else {
				final_size = size * Math.pow(ratio, step);
			}
		}
		return round(final_size);
	}

	function create_css(step: number = 0) {
		let local_max_font_size = get_font_size_from_ratio(max_font_size_rem, step);
		let local_min_font_size = get_font_size_from_ratio(min_font_size_rem, step);

		let local_slope =
			(local_max_font_size - local_min_font_size) / (max_viewport_rem - min_viewport_rem);

		let local_y_intercept = round(local_min_font_size - local_slope * min_viewport_rem);

		return {
			min: local_min_font_size,
			max: local_max_font_size,
			slope: local_slope,
			y_intercept: local_y_intercept,
			step
		};

		// return `font-size: clamp(${local_min_font_size}rem, ${local_slope}vi + ${local_y_intercept}rem, ${local_max_font_size}rem);`;
	}

	function generate_steps_array(stepsAbove: number, stepsBelow: number) {
		const result = [];

		// Add steps below the base data
		for (let i = stepsBelow; i > 0; i--) {
			result.push(create_css(i * -1));
		}

		// Add the base data
		result.push(create_css());

		// Add steps above the base data
		for (let i = 1; i <= stepsAbove; i++) {
			result.push(create_css(i));
		}

		return result;
	}
</script>

<div class="controls">
	<div>
		<h2>Global</h2>
		<label for="scale">Scale</label>
		<select name="scale" id="scale" bind:value={ratio}>
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
		<h2>Mobile</h2>

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
		<h2>Desktop</h2>
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

<div class="resize">
	<div class="add-remove">
		{#if steps_below_base > 0}
			<button onclick={() => steps_below_base--}>-</button>
		{/if}
		<button onclick={() => steps_below_base++}>+</button>
	</div>
	<div class="steps">
		{#each steps as step (step.step)}
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

<CSS {steps} />

<style>
	.resize {
		margin: 1rem 0;
	}
	h2 {
		font-size: clamp(1.33rem, 1.576471vi + 0.94rem, 2rem);
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
		width: 16px;
	}

	.viewport {
		width: 30px;
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
</style>
