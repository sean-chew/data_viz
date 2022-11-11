mapboxgl.accessToken = 'pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ';
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/jjjiia123/ckvmekzmf39nz14o27lfiynwy', // custom style url from https://studio.mapbox.com/
	center: [-73.978,40.711], // starting position
	zoom: 14 // starting zoom
});