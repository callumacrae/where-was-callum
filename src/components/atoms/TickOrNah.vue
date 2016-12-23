<template>
	<span v-if="tick" class="tick">✔</span>
	<span v-else class="nah">✘</span>
</template>

<script>
	export default {
		props: {
			tick: {
				type: Boolean,
				required: true
			}
		}
	};
</script>

<style>
	.tick {
		color: green;
	}

	.nah {
		color: red;
	}
</style>