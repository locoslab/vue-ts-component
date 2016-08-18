import  VueTsComponent   from '../../src/vue-ts-component' 

// register the grid component
@VueTsComponent.component('demogrid')
export default class DemoGrid extends VueTsComponent.Component {

	static template:string = '#grid-template';
	static replace:boolean = true;

	@VueTsComponent.prop({
		type: Array,
		required: true
	})
	data:Array<{name:string, power:number }>;

	@VueTsComponent.prop({
		type: Array,
		required: true
	})
	columns:Array<string>;
 
	@VueTsComponent.prop({
		type: String,
		required: true
	})
	filterKey: string ;

	sortKey:string = '';

	reversed:{[key:string]: boolean} = {};

	@VueTsComponent.lifecycle('compiled')
	compiled():void {
		this.columns.forEach((key:string):void => {
			this.$set(`reversed.${key}`, false);
		});
	}

	sortBy(key:string):void {
		this.sortKey = key;
		this.reversed[key] = !this.reversed[key];
	}
}
