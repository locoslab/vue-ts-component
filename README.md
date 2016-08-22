# vue-ts-component
Decorators to transform a TypeScript class to a Vue component

### Setup
To setup the package you can install the npm dependencies by:

    npm install

You can run the examples by:

	npm run examples

To compile the source please run the build script

	npm run build

While the package is currently not in the npm registry you can include it as a dependency within your development projects by specifying it as a file dependency in package.json or directly from github using:

	npm install locoslab/vue-ts-component --save-dev


### Usage

```typescript
// load the decorators
import VueTsComponent from 'vue-ts-component'

// transform the class Demo to a vue component called demo
@createComponent('demo')
// The Vue typings contain the definitions that are needed to enable
// TypeScript support for type checking and autocomplete
class Demo extends VueTsComponent.Component {

	// transforms to option.template
	static template:string = '#demo-template';

	// transforms to option.replace
	static replace:boolean = true;

	// the @props decorator transforms a property to an attribute
	// for the supported options see http://vuejs.org/api/options.html#props
	@prop({
		type: Boolean,
		required: true
	})
	option:boolean;

	// normal properties, pass through the data options are declared as normal properties
	property:string = 'foo';

	// the @lifecycleHook decorator supports the following hooks:
	// created, beforeCompile, compiled, ready, attached, detached, beforeDestroy, destroyed
	@lifecycleHook('compiled')
	compiled():void {
		// ...
	}

	// the @eventHook decorator registers the decorated method as event listener
	@eventHook('listen.to.event')
	eventListenToEvent():boolean {
		// ...
	}

	// normal methods are declared as class members
	method(arg:string):void {
		// ...
	}

	// computed properties are defined as getter and setter
	get computed():number {
		// ...
	}
	set computed(arg:number) {
		// ...
	}
}
```


## License

[MIT](http://opensource.org/licenses/MIT)
