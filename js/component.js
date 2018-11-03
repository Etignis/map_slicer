
Vue.component('map', {
	props: {
		title: {
			type: String,
			default: ""
		},
		content: {
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

	template: `<div class='mapContainer'>
	
</div>`
});

	
  var app = new Vue({
    el: '#app',
    data: {
			
    },

		computed: {
			
			
		},
		mounted: function() {
			
		},
		methods: {
			
		}
  });