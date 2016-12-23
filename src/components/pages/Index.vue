<template>
	<div>
		<h1>Services</h1>

		<ul v-if="statuses">
			<li v-for="status of statuses">
				<tick-or-nah :tick="status.authed"></tick-or-nah> {{ status.service }}
				<a v-if="!status.authed" :href="status.authUrl">(authenticate)</a>
			</li>
		</ul>

		<p v-else>Loading…</p>
	</div>
</template>

<script>
	import request from '../../lib/api';

	import TickOrNah from '../atoms/TickOrNah.vue';

	export default {
		data: () => ({
			statuses: []
		}),
		mounted() {
			request('/oauth/status/all')
				.then((statuses) => {
					this.statuses = statuses;
				});
		},
		components: {
			TickOrNah
		}
	};
</script>