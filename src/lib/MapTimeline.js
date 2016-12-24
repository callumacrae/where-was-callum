import chroma from 'chroma-js';
import L from 'leaflet';

export default function MapTimeline(map, locations) {
	this.map = map;
	this.locations = locations.map((location) => {
		return Object.assign({}, location, {
			time: new Date(location.time).getTime()
		});
	});

	this.current = {
		time: 0
	};
}

const scale = chroma.scale(['red', 'blue']).mode('lab');

MapTimeline.prototype.setTime = function setTimelineTime(time) {
	let lastLocation;

	this.locations.forEach((location) => {
		if (location.time <= time) {
			lastLocation = location;

			if (!location.point) {
				location.point = L.circle([location.location.lat, location.location.lng], {
					color: scale(0),
					fillColor: scale(0),
					fillOpacity: 1,
					radius: 50
				}).bindPopup(JSON.stringify(location)).addTo(this.map);

				this.map.panTo(new L.LatLng(location.location.lat, location.location.lng));
			} else {
				const daysToChangeColor = 2;
				const daysToChangeOpacity = 15;

				const color = scale(Math.min((time - location.time) / 1000 / 3600 / 24 / daysToChangeColor, 1));
				const opacity = Math.max(1 - ((time - location.time) / 1000 / 3600 / 24 / daysToChangeOpacity), 0.2);

				location.point.setStyle({
					color: color,
					fillColor: color,
					opacity: opacity,
					fillOpacity: opacity
				});
			}
		} else {
			// @todo: hide existing ones so we can pan backwards
		}
	});

	this.current.time = time;
	this.current.location = lastLocation;
};

const start2016 = new Date(2016, 0, 1).getTime();
const start2017 = new Date(2017, 0, 1).getTime();

// a number between 0 and 366 (1st jan 2017)
MapTimeline.prototype.setDay = function setTimelineDay(day) {
	const timestamp = start2016 + (start2017 - start2016) / 366 * day;
	return this.setTime(timestamp);
};