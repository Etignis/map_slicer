var LeafIcon = L.Icon.extend({
	options: {
			
	}
});

Vue.component('m-layer', {
	props: {
		id: {
			type: String,
			default: ""
		}
	},
	data: function(){
		return {
			
		};
	},
	methods: {
		close: function(){
			this.$emit('close');
		}
	},
	computed: {
		
	}
});

Vue.component('m-mark', {
	props: {
		id: {
			type: String,
			default: ""
		}
	},
	data: function(){
		return {
			
		};
	},
	methods: {
		close: function(){
			this.$emit('close');
		}
	},
	computed: {
		
	}
});

Vue.component('maper', {
	props: {
		id: {
			type: String,
			default: ""
		}
	},
	data: function(){
		return {
			
		};
	},
	methods: {
		close: function(){
			this.$emit('close');
		}
	},
	computed: {
		
	},

	template: `<div class='mapContainer' :id="id">
	
</div>`
});

	
  var app = new Vue({
    el: '#app',
    data: {
			domId: "mapid",
			center: [10, 0],
			zoom: 3,
			layers: [],
			
			map: {},
			geo_map: {},
			
			options: {  
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
			},
			
			oMapData: {},
			lControl: {},
			oMarkers: {},
			oData: oData
    },

		computed: {			
			
		},
		
		mounted: function() {
			this.geo_map = L.tileLayer('map/{z}/{y}_{x}.png', {
				id: this.domId,
				minZoom: 2,
				maxZoom: 4			
			});
		
			this.map = L.map(this.domId, {
				center: this.center,
				zoom: this.zoom,
				layers: [this.geo_map]
			});
			
			this.map.pm.addControls(this.options);
			
			for (var oIco in oMarkerTypes.obj) {  
				this.oMarkers[oIco] = new LeafIcon({
					iconUrl: "img/"+oMarkerTypes.obj[oIco].ico.img,
					iconSize:     oMarkerTypes.obj[oIco].ico.size, // size of the icon
					iconAnchor:   oMarkerTypes.obj[oIco].ico.anchor, // point of the icon which will correspond to marker's location
					popupAnchor:  oMarkerTypes.obj[oIco].ico.popupAnchor // point from which the popup should open relative to the iconAnchor
				});
			}
			
			for(var key in oData){
				var aMarkers = [], sIco, oParams, oMarker, sMarkId;
				oData[key].list.forEach(function(item, i) {
					if(item.coord.length == 2){ // marker
						sMarkId = "mark_"+key+"_"+i;	
						sIco = oData[key].ico;
						oParams = sIco? {icon: this.oMarkers[sIco]} : {};
						oMarker = L.marker(this.translateCoord(item.coord), oParams).bindPopup(item.popup);
						
						oMarker.on('dragend', function(oEvent){
							let oMarker = oEvent.target;
							this.onMarkMoved(oMarker, sMarkId);							
						}.bind(this));
						
						aMarkers.push(oMarker);
					} else { // polygon
						aMarkers.push(L.polygon(this.translateCoord(item.coord), {color: item.color}).bindPopup(item.popup));
					}   					
				}.bind(this));
				this.oMapData[oData[key].title] = L.layerGroup(aMarkers); 
			}
			
			var baseMaps = {
				"География": this.geo_map
			};
			var overlayMaps = this.oMapData;
					
			this.lControl = L.control.layers(baseMaps, overlayMaps, {hideSingleBase: true});
			this.lControl.addTo(this.map);
			
		},
		
		methods: {
			onMarkMoved: function(oMarker, sId){
				var position = oMarker.getLatLng();
				console.log(position);
				oMarker.setLatLng(position/*,{id:uni,draggable:'true'}*/).bindPopup(position).update();
			},
			translateCoord: function(aCoord) {
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
		}
  });