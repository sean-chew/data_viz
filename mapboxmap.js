mapboxgl.accessToken = 'pk.eyJ1Ijoic2NoZXcyIiwiYSI6ImNsOWVjNmd0ZDI3Y2gzcGw5aTVnMnNoMXMifQ.uYA52Qg_9j0JJD8nO7Y64w';
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/dark-v10', // custom style url from https://studio.mapbox.com/
	center: [-73.978,40.711], // starting position
	zoom: 10 // starting zoom
});

// This will be for the raster
//https://docs.mapbox.com/mapbox-gl-js/example/image-on-a-map/ 
// Unless...we actually just create it...!!
// https://docs.mapbox.com/help/tutorials/make-a-heatmap-with-mapbox-gl-js/ 

// 

//'mapbox://styles/mapbox/dark-v10'

map.on('load', () => {
	map.addSource('vacant_2020', {
	  type: 'geojson',
	  data: './intermediate/geo_2020.geojson'
	});
	// add heatmap layer here
	// add circle layer here
		map.addLayer(
			{
			  id: 'vacant_2020',
			  type: 'heatmap',
			  source: 'vacant_2020',
			  maxzoom: 15,
			  paint: {
				// increase weight as diameter breast height increases
				'heatmap-weight': {
				  property: 'dbh',
				  type: 'exponential',
				  stops: [
					[1, 0],
					[62, 1]
				  ]
				},
				// increase intensity as zoom level increases
				'heatmap-intensity': {
				  stops: [
					[11, 1],
					[15, 3]
				  ]
				},
				// assign color values be applied to points depending on their density
				'heatmap-color': [
				  'interpolate',
				  ['linear'],
				  ['heatmap-density'],
				  0,
				  'rgba(236,222,239,0)',
				  0.2,
				  'rgb(208,209,230)',
				  0.4,
				  'rgb(166,189,219)',
				  0.6,
				  'rgb(103,169,207)',
				  0.8,
				  'rgb(28,144,153)'
				],
				// increase radius as zoom increases
				'heatmap-radius': {
				  stops: [
					[10,3],
					[11, 7],
					
					[15, 20]
				  ]
				},
				// decrease opacity to transition into the circle layer
				'heatmap-opacity': {
				  default: 1,
				  stops: [
					[14, 1],
					[15, 0]
				  ]
				}
			  }
			},
			'waterway-label'
		  );
	
  });