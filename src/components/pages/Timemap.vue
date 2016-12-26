<template>
	<div>
		<div id="mapid"></div>
		<p v-if="status && status.location">{{ status.time | formatTime }} {{ status.location.place }} (from {{ status.location.service }})</p>
	</div>
</template>

<script>
	import chroma from 'chroma-js';
	import L from 'leaflet';

	import request from '../../lib/api';
	import MapTimeline from '../../lib/MapTimeline';

	export default {
		data: () => ({
			locations: [],
			map: undefined,
			status: undefined
		}),
		mounted() {
			this.initMap();

			request('/api/locations')
				.then((locations) => {
					this.locations = locations;

					const timeline = new MapTimeline(this.map, locations);

					this.status = timeline.current;
					timeline.setDay(0);

					let i = 0;

					// @todo: Use requestAnimationFrame
					setInterval(() => {
						i++;
						timeline.setDay(i / 240);
					}, 1000 / 60);
				});
		},
		methods: {
			initMap() {
				if (this.map) {
					return;
				}

				this.map = L.map('mapid').setView([51.505, -0.09], 13);

				L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
					attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
					maxZoom: 18,
					id: 'mapbox.satellite',
					accessToken: 'pk.eyJ1IjoiY2FsbHVtYWNyYWUiLCJhIjoiY2l4MXpoM2ZlMDAwbDJvbnU2eW5iMnl5biJ9.kVAEMOrxWvwBoY6MvI8KzQ'
				}).addTo(this.map);
			}
		},
		filters: {
			formatTime(timestamp) {
				const date = new Date(timestamp);

				const month = [
					'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'October', 'November', 'December'
				][date.getMonth()];

				const f = (n) => n < 10 ? `0${n}` : n;

				return `${f(date.getDate())} ${month} ${date.getFullYear()} ${f(date.getHours())}:${f(date.getMinutes())}:${f(date.getSeconds())}`;
			}
		}
	};
</script>

<style scoped>
	#mapid { height: calc(100vh - 60px); width: 100% }
</style>