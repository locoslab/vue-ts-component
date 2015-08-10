/// <reference path="vue.d.ts" />

module VueComponent {
	export class Base {

		// public properties: http://vuejs.org/api/instance-properties.html
		$:any;
		$$:any;
		$data: any;
		$children: Array<Vue>;
		$el: HTMLElement;
		$options: any;
		$parent: Vue;
		$root: Vue;

		// methods: http://vuejs.org/api/instance-methods.html
		$add(key:string, val:any):void {}
		$addChild(options?:any, constructor?:()=>void):void {}
		$after(target:HTMLElement|string, cb:()=>void):void {}
		$appendTo(target:HTMLElement|string, cb?:()=>void):void {}
		$before(target:HTMLElement|string, cb?:()=>void):void {}
		$broadcast(event:string, ...args:Array<any>):void {}
		$compile(el:HTMLElement):Function { return ():void => {} }
		$delete(key:string):void {}
		$destroy(remove:boolean):void {}
		$dispatch(event:string, ...args:Array<any>):void {}
		$emit(event:string, ...args:Array<any>):void {}
		$eval(text:string):void {}
		$get(exp:string):void {}
		$interpolate(text:string):void {}
		$log(path?:string):void {}
		$mount(el:HTMLElement|string):void {}
		$nextTick(fn:()=>void):void {}
		$off(event:string, fn:(...args:Array<any>)=>void|boolean):void {}
		$on(event:string, fn:(...args:Array<any>)=>void|boolean):void {}
		$once(event:string, fn:(...args:Array<any>)=>void|boolean):void {}
		$remove(cb?:()=>void):void {}
		$set(exp:string, val:any):void {}
		$watch(
			exp: string|(()=>string),
			cb: (val: any, old?: any)=>any,
			options?: { deep?: boolean; immediate?: boolean }
		):void {}
	}

	// register a lifecycl hook, http://vuejs.org/api/options.html#Lifecycle
	export function lifecycleHook(hook:string) {
		return (cls:any, name:string):void => {
			if ([
				'created', 'beforeCompile', 'compiled', 'ready', 'attached', 'detached', 'beforeDestroy', 'destroyed'
			].indexOf(hook) == -1)
				throw new Error('Unknown Lifecyle Hook: ' + hook);
			if (!cls.hasOwnProperty('__options__'))
				cls.__options__ = { ignore: {}, props: {}, hooks: {} };
			cls.__options__.hooks[name] = function() { this[hook] = cls[name]; };
		}
	}

	// register an event, http://vuejs.org/api/options.html#events
	export function eventHook(hook:string) {
		return (cls:any, name:string):void => {
			if (!cls.hasOwnProperty('__options__'))
				cls.__options__ = { ignore: {}, props: {}, hooks: {} };
			cls.__options__.hooks[name] = function() { this.events[hook] = cls[name]; };
		}
	}

	// expose the property as attribute
	export function prop(options) {
		return function(cls:any, name:string) {
			if (!cls.hasOwnProperty('__options__'))
				cls.__options__ = { ignore: {}, props: {}, hooks: {} };
			cls.__options__.props[name] = options;
		}
	}

	// register a class as component in vue
	export function createComponent(name:string):(cls:any)=>void {
		return (cls:any):void => {

			let data:any = {};
			let options:any = {
				props: {},
				data: (():any => { return Vue.util.extend({}, data); }),
				methods: {},
				events: {},
				computed: {}
			};

			// check for replace and template
			if (cls.hasOwnProperty('replace'))
				options.replace = cls.replace;

			if (cls.hasOwnProperty('template'))
				options.template = cls.template;

			// create object and get prototype
			let obj:any = new cls();
			let proto:any = Object.getPrototypeOf(obj);

			// get data
			Object.getOwnPropertyNames(obj).forEach((prop:string):void => {
				data[prop] = obj[prop];
			});

			if (proto.hasOwnProperty('__options__'))
				Object.getOwnPropertyNames(proto.__options__.props).forEach((prop:string):void => {
					options.props[prop] = proto.__options__.props[prop];
				});

			// get methods
			Object.getOwnPropertyNames(proto).forEach((method:string):void => {

				// skip the constructor and the internal option keeper
				if (['constructor', '__options__'].indexOf(method) > -1)
					return;

				// decoreated functions
				if (proto.hasOwnProperty('__options__') && proto.__options__.hooks.hasOwnProperty(method))
					proto.__options__.hooks[method].call(options);

				else {

					let desc:PropertyDescriptor = Object.getOwnPropertyDescriptor(proto, method);

					// normal methods
					if (typeof desc.value === 'function')
						options.methods[method] = proto[method];

					// if getter and setter are defied, pass the function as computed property
					else if(desc.hasOwnProperty('set'))
						options.computed[method] = {
							get: desc.get,
							set: desc.set
						};

					// if the method only has a getter, just put the getter to the component
					else
						options.computed[method] = desc.get;
				}
			});

			// create a Vue component
			Vue.component(name, options);
		};
	}
}