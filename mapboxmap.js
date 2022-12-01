mapboxgl.accessToken = 'pk.eyJ1Ijoic2NoZXcyIiwiYSI6ImNsOWVjNmd0ZDI3Y2gzcGw5aTVnMnNoMXMifQ.uYA52Qg_9j0JJD8nO7Y64w';
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/schew2/clamscjyc002115pfk7bevz9a', // custom style url from https://studio.mapbox.com/
	center: [-73.978,40.711], // starting position
	zoom: 10 // starting zoom
});

// This will be for the raster
//https://docs.mapbox.com/mapbox-gl-js/example/image-on-a-map/ 
// Unless...we actually just create it...!!
// https://docs.mapbox.com/help/tutorials/make-a-heatmap-with-mapbox-gl-js/ 

// 

//'mapbox://styles/mapbox/dark-v10'
