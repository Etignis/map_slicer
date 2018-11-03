//window.onload = function(){
/*
		var map = L.map('mapid').setView([30, -55], 4);

		L.tileLayer('tiles/alisterra/{z}/{x}-{y}.png',{
		minZoom: 3,
		maxZoom: 6,
		attribution: '',
		tms: false
		}).addTo(map);
*/		
		var geo_map = L.tileLayer('map/{z}/{y}_{x}.png', {
			id: 'mapid',
			minZoom: 2,
			maxZoom: 4			
		});
		var map = L.map('mapid', {
			center: [10, 0],
			zoom: 3,
			layers: [geo_map]
		})
    
    var oEvents = {};
    
  // editor
  // define toolbar options
  // https://github.com/codeofsumit/leaflet.pm
  var options = {  
    position: 'topleft', // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
    drawMarker: true, // adds button to draw markers
    drawPolyline: true, // adds button to draw a polyline
    drawRectangle: true, // adds button to draw a rectangle
    drawPolygon: true, // adds button to draw a polygon
    drawCircle: true, // adds button to draw a cricle
    cutPolygon: true, // adds button to cut a hole in a polygon
    editMode: true, // adds button to toggle edit mode for all layers
    removalMode: true, // adds a button to remove layers
    snappable: true,
  };

  // add leaflet.pm controls to the map
  map.pm.addControls(options);


		//map.zoomend();
		/*
		map.addEventListener("resize", function() {
			console.log("Границы карты изменились");
		});
		*/
		map.addEventListener("zoomend", function(e) {
      //debugger;
			//console.log("zoom?");
		//console.log("capital_Palzem: "+capital_Palzem.getLatLng());
		//console.log("capital_Horskur: "+capital_Horskur.getLatLng());
		//console.log("capital_Center: "+capital_Center.getLatLng());
		//console.log("capital_Maribis: "+capital_Maribis.getLatLng());
		//console.log("capital_Agadat: "+capital_Agadat.getLatLng());
		//console.log("capital_Uttar: "+capital_Uttar.getLatLng());
		//console.log("coord: "+coord.getLatLng());
		});
    
		map.addEventListener("click", function(e) {
      debugger;
      if(oEvents.startMarker) {
        // marker placed
        selectEditorTab("mark");
        oEvents.setNewMarker = true;
      }
    });
     map.on('pm:dragstart', function(e) {
      debugger;
      
    });
    map.on('pm:create', function(e) {
      debugger;
      if(oEvents.setNewMarker) {
        oEvents.setNewMarker = false;
        oEvents.oNewMarker = {
          coord: [
            e.marker._latlng.lat,
            e.marker._latlng.lng            
          ]
        };
      }
    });
    map.on('pm:drawstart', function(e) {
      debugger;
      switch(e.shape) {
        case "Marker": 
          oEvents.startMarker = true;
          break;
      }
    });
    map.on('pm:drawend', function(e) {
      debugger;
    });
    map.on('pm:edit', function(e) {
      debugger;
    });
    map.on('pm:drag', function(e) {
      debugger;
    });
    map.on('pm:dragend', function(e) {
      debugger;
    });
    map.on('pm:markerdragstart', function(e) {
      debugger;
    });
    map.on('pm:snap', function(e) {
      debugger;
    });
    map.on('pm:unsnap', function(e) {
      debugger;
    });
    
		/*[ Icons ]*/
    L.Icon.Default.prototype.options = {
      iconUrl: "img/village.png",
      iconSize: [29,47],
      iconAnchor:[14, 47]
      // ...etc, with all the L.Icon desired/needed options.
  }
    
    var LeafIcon = L.Icon.extend({
      options: {
          
      }
    });
    
    var oMarkers = {};
    for (var oIco in oMarkerTypes.obj) {
      
      
      oMarkers[oIco] = new LeafIcon({
        iconUrl: "img/"+oMarkerTypes.obj[oIco].ico.img,
        //shadowUrl: 'leaf-shadow.png',

        iconSize:     oMarkerTypes.obj[oIco].ico.size, // size of the icon
        //shadowSize:   [50, 64], // size of the shadow
        iconAnchor:   oMarkerTypes.obj[oIco].ico.anchor, // point of the icon which will correspond to marker's location
        //shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  oMarkerTypes.obj[oIco].ico.popupAnchor // point from which the popup should open relative to the iconAnchor
      });
    }
    
    /* Icons */
    
    function translateCoord(aCoord) {
      // var nK = 2.2,
      // nX = -70,
      // nY = 120;
      // function make(c) {
        // c[0] = c[0]*nK+nX;
        // c[1] = c[1]*nK+nY;
        // return c;
      // }
      // if(Array.isArray(aCoord) && aCoord.length == 2 &&
        // !isNaN(aCoord[0]) &&
        // !isNaN(aCoord[1])) {
          // return make(aCoord);
      // }
      // if(Array.isArray(aCoord)) {
        // return aCoord.map(i => make(i));
      // }
      return aCoord;
    }                            
    var oMapData = {};
    for(var key in oData){
      //var oMarker = L.marker().bindPopup();
      var aMarkers = [], sIco, oParams, oMarker;
      oData[key].list.forEach(function(item) {        
				if(item.coord.length == 2){
					sIco = oData[key].ico;
					oParams = sIco? {icon: oMarkers[sIco]} : {};
					oMarker = L.marker(translateCoord(item.coord), oParams).bindPopup(item.popup);
					// oMarker.on('click', function(e) {
						/*e.target.setIcon(selectedIcon);
						document.getElementById('someDiv').innerHTML = points[e.target.options.id][2];*/
						//debugger;
					// }); 
					aMarkers.push(oMarker);
				} else {
					aMarkers.push(L.polygon(translateCoord(item.coord), {color: item.color}).bindPopup(item.popup));
				}        
      });
      oMapData[oData[key].title] = L.layerGroup(aMarkers); 
    }
		
		var baseMaps = {
			"География": geo_map
		};
		var overlayMaps = oMapData;
				
		var lControl = L.control.layers(baseMaps, overlayMaps, {hideSingleBase: true});
        lControl.addTo(map);
   
		// if(String(window.location.hash)=="#DM"){
			// console.log("Are you really DM? (￢_￢)");
			// lControl.addOverlay(citi, "Города");
			// lControl.addOverlay(orgs, "Организации");
		// }
    


// listen to changes
// polygonLayer.on('pm:edit', function(e) {});
// polygonLayer.on('pm:dragstart', function(e) {
  // debugger;
// });
// polygonLayer.on('pm:drag', function(e) {});
// polygonLayer.on('pm:dragend', function(e) {});
		
// Custom Edit Pane
/*/
  <input> // title
          //marker type ?
          // color ?
          // layer
/**/

// редактор точек
var oMarkerName = "<div>Название: <input id='markTitle'></div>";
var aTypes = [];
for(var item in oMarkerTypes.obj) {
  var sTitle = oMarkerTypes.obj[item].title;
  var sImg = "img/"+oMarkerTypes.obj[item].ico.img;
  aTypes.push("<label><input name='typeRadio' type='radio' value='"+item+"'><img width='29' src='"+sImg+"'>"+sTitle+"</label>");
}
var oTypeSelect = "<div>Тип: <form id='typeSelect'>"+aTypes+"</form></div>";

var aOptions=[];
for (var item in oData) {
  var sTitle = oData[item].title;
  aOptions.push("<option value='"+item+"'>"+sTitle+"</option>")
}
var oLayerSelect = "<div>Слой: <select id='layerSelect'>"+aOptions+"</select></div>";

var oMarkerEditor = "<div  class='tab' id='markerEditor'>"+oMarkerName+oTypeSelect+oLayerSelect+"</div>";

// редактор областей
var oPolyName = "<div>Название: <input id='polyTitle'></div>";
var oColorSelect = "<div>Цвет: <input type='color' id='polyColor'></div>";
var oPolyEditor = "<div class='tab' id='polyEditor'>"+oPolyName+oColorSelect+oLayerSelect+"</div>";

// база данных
var oCodeDB = "<div  class='tab' id='codeDB'></div>";

var oPane = "<div id='editorPane'>"+oMarkerEditor+oPolyEditor+oCodeDB+"</div>";
$("#mapid").append(oPane);
selectEditorTab("mark");
function selectEditorTab(sKey){
  $("#editorPane .tab").hide();
  switch(sKey) {
    case "mark": $("#markerEditor").show(); break;
    case "poly": $("#polyEditor").show(); break;
    case "code": $("#codeDB").show(); break;
  }
}
//}