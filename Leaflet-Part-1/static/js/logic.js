//Url of the json file 
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// GET request to the query URL
d3.json(url).then(function (data) {

// Log the data retrieved 
console.log(data);

//Send the data.features object to the features function.

features(data.features);
});

// Function to determine marker size 
function marker_size(mag) {
    
    return mag * 10000; 
}

// Color circles based on depth
function pick_color(depth){
    
    var color;

    if (depth < 10) color =  "#00FF00";
    else if (depth < 30) color =  "greenyellow";
    else if (depth < 50) color =  "yellow";
    else if (depth < 70) color =  "orange";
    else if (depth < 90) color =  "red";
    else color =  "#FF0000";

    console.log(' depth : ', depth, ' color : ',color);
    return color;
    
  }
  

function features(earthquake_data) {

    // Define a function to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
  
    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    // Run onEachFeature once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquake_data, {
      onEachFeature: onEachFeature,
  
      // Pointtolayer used to alter markers
      pointToLayer: function(feature, latlng) {
  
        // Determine the style of markers based on properties
        var markers = {
          radius: marker_size(feature.properties.mag),
          fillColor: pick_color(feature.geometry.coordinates[2]),
          fillOpacity: 0.10,
          color: "black",
          stroke: true,
          weight: 0.5
        }
        return L.circle(latlng,markers);
      }
    });

      // Send our earthquakes layer to the createMap function/
  create_map(earthquakes);
}

function create_map(earthquakes) {

    // Create the tile layer as the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    // Create an overlay object to hold our overlay.
    var overlayMaps = {
    Earthquakes: earthquakes
    };
    // Create our map
    var map = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // Create a legend control object.
	var legend = L.control({position: "bottomright"});
	  
    // Add legend
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var depth = [-10, 10, 30, 50, 70, 90];
    
        div.innerHTML += "<h3 style='text-align: center'>Depth</h3>";
    
        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
                '<i style="background:' + pick_color(depth[i] + 1) + '; width: 20px; height: 20px; display: inline-block;"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
      legend.addTo(map)
      
     
  };