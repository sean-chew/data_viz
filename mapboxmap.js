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
	map.addSource('vacant_2021', {
		type: 'geojson',
		data: './intermediate/geo_2021.geojson'
	  });
	// add heatmap layer here
	// add circle layer here
	
	// Toggle - on or off, it sets one layer to true or faalse:
	// Add layer information to the popup (true or false)
	// IF the year is on, style it different 
	//drawmap('vacant_2020');
	drawmap('vacant_2021');

	map.addSource('nta_changes',{
		type: 'geojson',
		data: './intermediate/nta_storefront_change.geojson'
	});

	map.addLayer({
		id:'nta_change_polygon_fill',
		source:'nta_changes',
		type: 'fill',
		paint: {
			'fill-color':'transparent',
			'fill-outline-color': '#FFFFFF'
		}

	});

/*
	map.on('click', 'nta_change_polygon_fill', (event) => {
	new mapboxgl.Popup()
		  .setLngLat(event.features[0].geometry.coordinates)
		  .setHTML(`<strong>NTA:</strong> ${event.features[0].properties.ntaname}`+ `\n`+ 
		  `<strong>Vacant in 2020:</strong> ${event.features[0].properties.vacant_2020}`+ `\n`+ 
		  `<strong>Vacant in 2021:</strong> ${event.features[0].properties.vacant_2021}`)
		  .addTo(map);
	  });

*/
var popup = new mapboxgl.Popup({
    closeButton: false
});

//https://docs.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/ 
map.on('mouseover', 'nta_change_polygon_fill', function(e) {
	// Change the cursor style as a UI indicator.
	map.getCanvas().style.cursor = 'pointer';

	// Single out the first found feature.
	var feature = e.features[0];
	console.log(e)

	// Display a popup with the name of the county
	popup.setLngLat(e.lngLat)
		.setText(`NTA Name:${e.feature.properties.ntaname}\nChange:${e.feature.properties.change})`)
		.addTo(map);
});

map.on('mouseleave', 'nta_change_polygon_fill', function() {
	map.getCanvas().style.cursor = '';
	popup.remove();
});
  });

  function drawmap(source) {
	map.addLayer(
		{
		  id: source,
		  type: 'heatmap',
		  source: source,
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
			'heatmap-color': [// Change the Thresholds - It's doing it on the fly
			  'interpolate', //Book end, half it, half it, etc. - TRY BRINGING IT INTO mapbox studio
			  ['linear'],
			  ['heatmap-density'],
			  0,
			  'rgba(236,222,239,0)',
			  0.7,
			  '#caf0f8',
			  .9999999999,
			  '#FFFFFF',
			  1,
			  '#03045e'
			],
			// increase radius as zoom increases
			'heatmap-radius': {
			  stops: [
				[10,2],
				[11, 5],
				[15, 15]
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

	  map.addLayer(
		{
		  id: source + '-point',
		  type: 'circle',
		  source: source,
		  minzoom: 14,
		  paint: {
			// increase the radius of the circle as the zoom level and dbh value increases
			'circle-radius': {
			  property: 'dbh',
			  type: 'exponential',
			  stops: [
				[{ zoom: 15, value: 1 }, 5],
				[{ zoom: 15, value: 62 }, 10],
				[{ zoom: 22, value: 1 }, 20],
				[{ zoom: 22, value: 62 }, 50]
			  ]
			},
			'circle-color': {
			  property: 'dbh',
			  type: 'exponential',
			  stops: [
				[0, 'rgba(236,222,239,0)'],
				[10, 'rgb(236,222,239)'],
				[20, 'rgb(208,209,230)'],
				[30, 'rgb(166,189,219)'],
				[40, 'rgb(103,169,207)'],
				[50, 'rgb(28,144,153)'],
				[60, 'rgb(1,108,89)']
			  ]
			},
			'circle-stroke-color': 'white',
			'circle-stroke-width': 1,
			'circle-opacity': {
			  stops: [
				[14, 0],
				[15, 1]
			  ]
			}
		  }
		},
		'waterway-label'
	  );
	  map.on('click', source + '-point', (event) => {
		new mapboxgl.Popup()
		  .setLngLat(event.features[0].geometry.coordinates)
		  .setHTML(`<strong>Year:</strong> ${event.features[0].properties.reporting_year}`+ `\n`+ 
		  `<strong>Address:</strong> ${event.features[0].properties.property_street_address_or_storefront_address}`+ `\n`+ 
		  `<strong>Neighborhood:</strong> ${event.features[0].properties.nbhd}`)
		  .addTo(map);
	  });
  }