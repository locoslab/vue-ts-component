
import * as VueStatic from 'vue'

/**
 * This package contains utilities to create view components that look like classes.
 * Note that this code relies on the decorator feature of typescript to perform the conversions. At the
 * time of writing, (July 2016), this feature is marked experimental and requires a
 * special compiler flag.
 *
 * @author Lukas Gamper, Marcus Handte, Stephan Wagner
 */
export namespace VueTsComponent {


 /**
     * The base class for vue components with property and method definitions
     * that will be implemented by the vue framework.
     */
    export class Component {

        // public properties: http://vuejs.org/api/instance-properties.html
        $:any;
        $$:any;
        $data: any;
        $children: Array<vuejs.Vue>;
        $el: HTMLElement;
        $options: any;
        $parent: vuejs.Vue; 
        $root: vuejs.Vue;

        // additional properties exposed by vue-router: http://router.vuejs.org/en/
        $route: vuejs.$route<any, any, any>;
        $router: vuejs.Router<any>;

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

	/** 
     * A decorator to register a method as a lifecycle hook.
     *
     * @param hook The hook to register for. See https://vuejs.org/api/#Options-Lifecycle-Hooks.
     */
	export function lifecycle(hook:string) {
        return (cls:any, name:string, desc:PropertyDescriptor):PropertyDescriptor => {
            if ([
                'created', 'beforeCompile', 'compiled', 'ready', 'attached', 'detached', 'beforeDestroy', 'destroyed'
            ].indexOf(hook) == -1)
                throw new Error('Unknown Lifecyle Hook: ' + hook);
            if (!cls.hasOwnProperty('__hooks__'))
                cls.__hooks__ = {};
            cls.__hooks__[hook] = cls[name];
            desc.value = void 0;
            return desc;
        }
    }

	/**
     * A decorator to register a method as an event hook.
     *
     * @param hook The event to register. See http://vuejs.org/api/options.html#events.
     */
	export function eventHook(hook:string) {
		return (cls:any, name:string, desc:PropertyDescriptor):PropertyDescriptor => {
			if (!cls.hasOwnProperty('__events__'))
				cls.__events__ = {};
			cls.__events__[name] = cls[name];
			desc.value = void 0;
			return desc;
		}
	}

	/**
     * A decorator for member variables that shall be exposed as
     * properties.
     *
     * @param options The options. See http://vuejs.org/api/#props.
     */
	export function prop(options:any) {
		return function(cls:any, name:string):void {
            if (!cls.hasOwnProperty('__props__'))
                cls.__props__ = {};
            cls.__props__[name] = options;
        }
    }

	/**
     * A decorator for component classes that registers them as
     * vue components.
     *
     * @param name The name to assign.
     */
    export function component(name:string):(cls:any)=>void {
        return (cls:any):void => {
            let options = createOptions(cls);
            // create a Vue component
            VueStatic.component(name, options);
        };
    }


    /**
     * A function that provides the extend functionality of vuejs
     * for ts components.
     *
     * @param t The type of the component.
     */
    export function extend(t:any):vuejs.VueStatic {
        return VueStatic.extend(createOptions((new t()).constructor));
    }

    /**
     * Creates an options object from the constructor.
     *
     * @param cls The constructor of a component.
     */
    export function createOptions(cls: any): vuejs.ComponentOption {
        let options: any = {
            data: ((): any => { return new cls(); }),
            methods: {},
            computed: {}
        };

        // check for replace and template
        if (cls.hasOwnProperty('replace'))
            options.replace = cls.replace;
 
        if (cls.hasOwnProperty('template'))
            options.template = cls.template;

        if (cls.hasOwnProperty('components'))
            options.components = cls.components;

        // create object and get prototype
        let obj: any = new cls();
        let proto: any = Object.getPrototypeOf(obj);

        if (proto['__props__'])
            options.props = proto.__props__;
        if (proto['__events__'])
            options.events = proto.__events__;
        if (proto['__hooks__'])
            VueStatic.util.extend(options, proto.__hooks__);
        // get methods
        Object.getOwnPropertyNames(proto).forEach((method: string): void => {

            // skip the constructor and the internal option keeper
            if (['constructor'].indexOf(method) > -1)
                return;

            let desc: PropertyDescriptor = Object.getOwnPropertyDescriptor(proto, method);

            // normal methods
            if (typeof desc.value === 'function')
                options.methods[method] = proto[method];

            // if getter and setter are defied, pass the function as computed property
            else if (typeof desc.set === 'function')
                options.computed[method] = {
                    get: desc.get,
                    set: desc.set
                };

            // if the method only has a getter, just put the getter to the component
            else if (typeof desc.get === 'function')
                options.computed[method] = desc.get;
        });
        return options;
    }
}
export default VueTsComponent;