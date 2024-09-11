<script lang="ts">
	let {
		min_font_size,
		max_font_size,
		min_ratio,
		max_ratio,
		steps
	}: {
		min_font_size: number;
		max_font_size: number;
		min_ratio: number;
		max_ratio: number;
		steps: number[];
	} = $props();

	let css =
		$derived(`body, h1, h2, h3, h4, h5, h6, p, li, .fluid, textarea, input, select, button, th, td {
	--fl: 0;
	--font-size-min: ${min_font_size};
	--font-size-max: ${max_font_size};
	--font-ratio-min: ${min_ratio};
	--font-ratio-max: ${max_ratio};
	--font-width-min: 320;
	--font-width-max: 1500;
	--fluid-min: calc(var(--font-size-min) * pow(var(--font-ratio-min), var(--fl, 0)));
	--fluid-max: calc(var(--font-size-max) * pow(var(--font-ratio-max), var(--fl, 0)));
	--fluid-preferred: calc((var(--fluid-max) - var(--fluid-min)) / (var(--font-width-max) - var(--font-width-min)));
	--fluid-type: clamp(
		(var(--fluid-min) / 16) * 1rem,
		((var(--fluid-min) / 16) * 1rem) -
			(((var(--fluid-preferred) * var(--font-width-min)) / 16) * 1rem) +
			(var(--fluid-preferred) * var(--variable-unit, 100vi)),
		(var(--fluid-max) / 16) * 1rem
	);
	font-size: var(--fluid-type);
}

/* This makes containers, with container queries use a cqi unit instead of vi */
.fluid-text-container {
	container-type: inline-size;
  --variable-unit: 100cqi;
}
h1, .h1 {
	--fl: 5;
}
h2, .h2 {
	--fl: 4;
}
h3, .h3 {
	--fl: 3;
}
h4, .h4 {
	--fl: 2;
}
h5, .h5 {
	--fl: 1;
}
h6, .h6 {
	--fl: 0;
}
p, li, body {
	--fl: 0;
}
${steps
	.map((step) => {
		return `.fs-${get_string_name(step)}{
	--fl: ${step};
}`;
	})
	.join('\n')}

`);

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
</script>

<div class="css">
	<h2>Code</h2>
	<textarea name="scale_css">{css}</textarea>
</div>

<style>
	h2 {
		margin-block: var(--vs-base);
	}
	textarea {
		height: 320px;
		width: 100%;
		background: #1b1b1b;
		border: none;
		border-radius: 4px;
		color: var(--fg);
		box-shadow: var(--input-shadow);
		line-height: 1.8;
		padding-inline: 10px;
		font-family: monospace;
		--fl: -1;
	}
</style>
