mapboxgl.accessToken = 'pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ';
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/jjjiia123/ckvmekzmf39nz14o27lfiynwy', // custom style url from https://studio.mapbox.com/
	center: [-73.978,40.711], // starting position
	zoom: 14 // starting zoom
});

// This will be for the raster
//https://docs.mapbox.com/mapbox-gl-js/example/image-on-a-map/ 
// Unless...we actually just create it...!!
// https://docs.mapbox.com/help/tutorials/make-a-heatmap-with-mapbox-gl-js/ 

// 