<script lang="ts">
	import { round } from '../utils';

	// what's up
	let {
		steps
	}: {
		steps: {
			min: number;
			max: number;
			slope: number;
			y_intercept: number;
			step: number;
		}[];
	} = $props();

	function repeatLetter(letter, i) {
		return letter.repeat(i);
	}

	function get_string_name(step) {
		if (step === 0) {
			return 'base';
		} else {
			if (step < 0) {
				return `${repeatLetter('x', step * -1)}s`;
			} else {
				if (step === 1) {
					return 's';
				} else if (step === 2) {
					return 'm';
				} else if (step === 3) {
					return 'l';
				} else if (step >= 4) {
					return `${repeatLetter('x', step - 3)}l`;
				}
			}
		}
	}

	const css = $derived(
		steps
			.map((step) => {
				return `--fs-${get_string_name(step.step)}: clamp(${step.min}rem, ${round(step.slope * 100, 6)}vi + ${step.y_intercept}rem, ${step.max}rem);`;
			})
			.join('\n') +
			'\n' +
			'\n' +
			'--line-height: calc(2px + 2ex + 2px));'
	);
</script>

<div class="css">
	<h2>Code</h2>
	<textarea name="scale_css">{css}</textarea>
</div>

<style>
	textarea {
		height: 320px;
		width: 100%;
		background: #1b1b1b;
		border: none;
		border-radius: 4px;
		color: var(--fg);
		box-shadow: var(--input-shadow);
		line-height: 2.3;
		padding-inline: 10px;
	}
</style>
