import * as Vue from 'vue'

declare var require: any
var App = require('./App.vue')

/* eslint-disable no-new */

new Vue({
  el: 'body',
  components: { App },
  data:  {
		searchQuery: '',
		gridColumns: ['name', 'power'],
		gridData: [
			{name: 'Chuck Norris', power: Infinity},
			{name: 'Bruce Lee', power: 9000},
			{name: 'Jacky Chang', power: 7000},
			{name: 'Jet Li', power: 8000}
		]
	}
})
