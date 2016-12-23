<template>
	<div>
		<h1>Services</h1>

		<ul v-if="statuses.length">
			<li v-for="status of statuses">
				<tick-or-nah :tick="status.authed"></tick-or-nah> {{ status.service }}
				<a v-if="!status.authed" :href="status.authUrl">(authenticate)</a>
			</li>
		</ul>

		<p v-else>Loading…</p>

		<router-link :to="{ name: 'map' }" v-if="linkViewable">View map</router-link>
		<router-link :to="{ name: 'heatmap' }" v-if="linkViewable">View heatmap</router-link>
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
		computed: {
			linkViewable() {
				return this.statuses.length && this.statuses.every((status) => status.authed);
			}
		},
		components: {
			TickOrNah
		}
	};
</script>