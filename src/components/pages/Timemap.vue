<template>
	<div>
		<div id="mapid"></div>
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
			map: undefined
		}),
		mounted() {
			this.initMap();

			request('/api/locations')
				.then((locations) => {
					this.locations = locations;

					const timeline = new MapTimeline(this.map, locations);

					let i = 0;

					// @todo: Use requestAnimationFrame
					setInterval(() => {
						timeline.setDay(i / 60);

						i++;
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
		}
	};
</script>

<style scoped>
	#mapid { height: calc(100vh - 30px); width: 100% }
</style>