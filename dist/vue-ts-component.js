"use strict";
var VueStatic = require('vue');
/**
 * This package contains utilities to create view components that look like classes.
 * Note that this code relies on the decorator feature of typescript to perform the conversions. At the
 * time of writing, (July 2016), this feature is marked experimental and requires a
 * special compiler flag.
 *
 * @author Lukas Gamper, Marcus Handte, Stephan Wagner
 */
var VueTsComponent;
(function (VueTsComponent) {
    /**
        * The base class for vue components with property and method definitions
        * that will be implemented by the vue framework.
        */
    var Component = (function () {
        function Component() {
        }
        // methods: http://vuejs.org/api/instance-methods.html
        Component.prototype.$add = function (key, val) { };
        Component.prototype.$addChild = function (options, constructor) { };
        Component.prototype.$after = function (target, cb) { };
        Component.prototype.$appendTo = function (target, cb) { };
        Component.prototype.$before = function (target, cb) { };
        Component.prototype.$broadcast = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
        };
        Component.prototype.$compile = function (el) { return function () { }; };
        Component.prototype.$delete = function (key) { };
        Component.prototype.$destroy = function (remove) { };
        Component.prototype.$dispatch = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
        };
        Component.prototype.$emit = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
        };
        Component.prototype.$eval = function (text) { };
        Component.prototype.$get = function (exp) { };
        Component.prototype.$interpolate = function (text) { };
        Component.prototype.$log = function (path) { };
        Component.prototype.$mount = function (el) { };
        Component.prototype.$nextTick = function (fn) { };
        Component.prototype.$off = function (event, fn) { };
        Component.prototype.$on = function (event, fn) { };
        Component.prototype.$once = function (event, fn) { };
        Component.prototype.$remove = function (cb) { };
        Component.prototype.$set = function (exp, val) { };
        Component.prototype.$watch = function (exp, cb, options) { };
        return Component;
    }());
    VueTsComponent.Component = Component;
    /**
     * A decorator to register a method as a lifecycle hook.
     *
     * @param hook The hook to register for. See https://vuejs.org/api/#Options-Lifecycle-Hooks.
     */
    function lifecycle(hook) {
        return function (cls, name, desc) {
            if ([
                'created', 'beforeCompile', 'compiled', 'ready', 'attached', 'detached', 'beforeDestroy', 'destroyed'
            ].indexOf(hook) == -1)
                throw new Error('Unknown Lifecyle Hook: ' + hook);
            if (!cls.hasOwnProperty('__hooks__'))
                cls.__hooks__ = {};
            cls.__hooks__[hook] = cls[name];
            desc.value = void 0;
            return desc;
        };
    }
    VueTsComponent.lifecycle = lifecycle;
    /**
     * A decorator to register a method as an event hook.
     *
     * @param hook The event to register. See http://vuejs.org/api/options.html#events.
     */
    function eventHook(hook) {
        return function (cls, name, desc) {
            if (!cls.hasOwnProperty('__events__'))
                cls.__events__ = {};
            cls.__events__[name] = cls[name];
            desc.value = void 0;
            return desc;
        };
    }
    VueTsComponent.eventHook = eventHook;
    /**
     * A decorator for member variables that shall be exposed as
     * properties.
     *
     * @param options The options. See http://vuejs.org/api/#props.
     */
    function prop(options) {
        return function (cls, name) {
            if (!cls.hasOwnProperty('__props__'))
                cls.__props__ = {};
            cls.__props__[name] = options;
        };
    }
    VueTsComponent.prop = prop;
    /**
     * A decorator for component classes that registers them as
     * vue components.
     *
     * @param name The name to assign.
     */
    function component(name) {
        return function (cls) {
            var options = createOptions(cls);
            // create a Vue component
            VueStatic.component(name, options);
        };
    }
    VueTsComponent.component = component;
    /**
     * A function that provides the extend functionality of vuejs
     * for ts components.
     *
     * @param t The type of the component.
     */
    function extend(t) {
        return VueStatic.extend(createOptions((new t()).constructor));
    }
    VueTsComponent.extend = extend;
    /**
     * Creates an options object from the constructor.
     *
     * @param cls The constructor of a component.
     * @param options Starting options used to create the component options
     * (some fields are always overwritten)
     */
    function createOptions(cls, options) {
        if (options === void 0) { options = {}; }
        options.data = (function () { return new cls(); });
        options.methods = options.methods || {};
        options.computed = options.computed || {};
        // check for replace and template
        if (cls.hasOwnProperty('replace'))
            options.replace = cls.replace;
        if (cls.hasOwnProperty('template'))
            options.template = cls.template;
        if (cls.hasOwnProperty('components'))
            options.components = cls.components;
        // create object and get prototype
        var obj = new cls();
        var proto = Object.getPrototypeOf(obj);
        if (proto['__props__'])
            options.props = proto.__props__;
        if (proto['__events__'])
            options.events = proto.__events__;
        if (proto['__hooks__'])
            VueStatic.util.extend(options, proto.__hooks__);
        // get methods
        Object.getOwnPropertyNames(proto).forEach(function (method) {
            // skip the constructor and the internal option keeper
            if (['constructor'].indexOf(method) > -1)
                return;
            var desc = Object.getOwnPropertyDescriptor(proto, method);
            // normal methods
            if (typeof desc.value === 'function')
                options.methods[method] = proto[method];
            else if (typeof desc.set === 'function')
                options.computed[method] = {
                    get: desc.get,
                    set: desc.set
                };
            else if (typeof desc.get === 'function')
                options.computed[method] = desc.get;
        });
        return options;
    }
    VueTsComponent.createOptions = createOptions;
})(VueTsComponent = exports.VueTsComponent || (exports.VueTsComponent = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VueTsComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLXRzLWNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy92dWUtdHMtY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFZLFNBQVMsV0FBTSxLQUMzQixDQUFDLENBRCtCO0FBR2hDOzs7Ozs7O0dBT0c7QUFDSCxJQUFpQixjQUFjLENBd0w5QjtBQXhMRCxXQUFpQixjQUFjLEVBQUMsQ0FBQztJQUdoQzs7O1VBR007SUFDSDtRQUFBO1FBNENBLENBQUM7UUE1Qkcsc0RBQXNEO1FBQ3RELHdCQUFJLEdBQUosVUFBSyxHQUFVLEVBQUUsR0FBTyxJQUFRLENBQUM7UUFDakMsNkJBQVMsR0FBVCxVQUFVLE9BQVksRUFBRSxXQUFxQixJQUFRLENBQUM7UUFDdEQsMEJBQU0sR0FBTixVQUFPLE1BQXlCLEVBQUUsRUFBVyxJQUFRLENBQUM7UUFDdEQsNkJBQVMsR0FBVCxVQUFVLE1BQXlCLEVBQUUsRUFBWSxJQUFRLENBQUM7UUFDMUQsMkJBQU8sR0FBUCxVQUFRLE1BQXlCLEVBQUUsRUFBWSxJQUFRLENBQUM7UUFDeEQsOEJBQVUsR0FBVixVQUFXLEtBQVk7WUFBRSxjQUFrQjtpQkFBbEIsV0FBa0IsQ0FBbEIsc0JBQWtCLENBQWxCLElBQWtCO2dCQUFsQiw2QkFBa0I7O1FBQVEsQ0FBQztRQUNwRCw0QkFBUSxHQUFSLFVBQVMsRUFBYyxJQUFhLE1BQU0sQ0FBQyxjQUFZLENBQUMsQ0FBQSxDQUFDLENBQUM7UUFDMUQsMkJBQU8sR0FBUCxVQUFRLEdBQVUsSUFBUSxDQUFDO1FBQzNCLDRCQUFRLEdBQVIsVUFBUyxNQUFjLElBQVEsQ0FBQztRQUNoQyw2QkFBUyxHQUFULFVBQVUsS0FBWTtZQUFFLGNBQWtCO2lCQUFsQixXQUFrQixDQUFsQixzQkFBa0IsQ0FBbEIsSUFBa0I7Z0JBQWxCLDZCQUFrQjs7UUFBUSxDQUFDO1FBQ25ELHlCQUFLLEdBQUwsVUFBTSxLQUFZO1lBQUUsY0FBa0I7aUJBQWxC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QU8sSUFBSSxDQUFDLEdBQUcsS0FBSyxVQUFVLENBQUM7Z0JBQ3BDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUc7b0JBQ3ZCLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztvQkFDYixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7aUJBQ2hCLENBQUM7WUFHTixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxLQUFLLFVBQVUsQ0FBQztnQkFDcEMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBbERlLDRCQUFhLGdCQWtENUIsQ0FBQTtBQUNMLENBQUMsRUF4TGdCLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBd0w5QjtBQUNEO2tCQUFlLGNBQWMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFZ1ZVN0YXRpYyBmcm9tICd2dWUnXG5pbXBvcnQgKiBhcyBWdWVSb3V0ZXIgZnJvbSAndnVlLXJvdXRlcidcblxuLyoqXG4gKiBUaGlzIHBhY2thZ2UgY29udGFpbnMgdXRpbGl0aWVzIHRvIGNyZWF0ZSB2aWV3IGNvbXBvbmVudHMgdGhhdCBsb29rIGxpa2UgY2xhc3Nlcy5cbiAqIE5vdGUgdGhhdCB0aGlzIGNvZGUgcmVsaWVzIG9uIHRoZSBkZWNvcmF0b3IgZmVhdHVyZSBvZiB0eXBlc2NyaXB0IHRvIHBlcmZvcm0gdGhlIGNvbnZlcnNpb25zLiBBdCB0aGVcbiAqIHRpbWUgb2Ygd3JpdGluZywgKEp1bHkgMjAxNiksIHRoaXMgZmVhdHVyZSBpcyBtYXJrZWQgZXhwZXJpbWVudGFsIGFuZCByZXF1aXJlcyBhXG4gKiBzcGVjaWFsIGNvbXBpbGVyIGZsYWcuXG4gKlxuICogQGF1dGhvciBMdWthcyBHYW1wZXIsIE1hcmN1cyBIYW5kdGUsIFN0ZXBoYW4gV2FnbmVyXG4gKi9cbmV4cG9ydCBuYW1lc3BhY2UgVnVlVHNDb21wb25lbnQge1xuXG5cbiAvKipcbiAgICAgKiBUaGUgYmFzZSBjbGFzcyBmb3IgdnVlIGNvbXBvbmVudHMgd2l0aCBwcm9wZXJ0eSBhbmQgbWV0aG9kIGRlZmluaXRpb25zXG4gICAgICogdGhhdCB3aWxsIGJlIGltcGxlbWVudGVkIGJ5IHRoZSB2dWUgZnJhbWV3b3JrLlxuICAgICAqL1xuICAgIGV4cG9ydCBjbGFzcyBDb21wb25lbnQge1xuXG4gICAgICAgIC8vIHB1YmxpYyBwcm9wZXJ0aWVzOiBodHRwOi8vdnVlanMub3JnL2FwaS9pbnN0YW5jZS1wcm9wZXJ0aWVzLmh0bWxcbiAgICAgICAgJDphbnk7XG4gICAgICAgICQkOmFueTtcbiAgICAgICAgJGRhdGE6IGFueTtcbiAgICAgICAgJGNoaWxkcmVuOiBBcnJheTx2dWVqcy5WdWU+O1xuICAgICAgICAkZWw6IEhUTUxFbGVtZW50O1xuICAgICAgICAkb3B0aW9uczogYW55O1xuICAgICAgICAkcGFyZW50OiB2dWVqcy5WdWU7XG4gICAgICAgICRyb290OiB2dWVqcy5WdWU7XG5cbiAgICAgICAgLy8gYWRkaXRpb25hbCBwcm9wZXJ0aWVzIGV4cG9zZWQgYnkgdnVlLXJvdXRlcjogaHR0cDovL3JvdXRlci52dWVqcy5vcmcvZW4vXG4gICAgICAgICRyb3V0ZTogdnVlanMuJHJvdXRlPGFueSwgYW55LCBhbnk+O1xuICAgICAgICAkcm91dGVyOiB2dWVqcy5Sb3V0ZXI8YW55PjtcblxuICAgICAgICAvLyBtZXRob2RzOiBodHRwOi8vdnVlanMub3JnL2FwaS9pbnN0YW5jZS1tZXRob2RzLmh0bWxcbiAgICAgICAgJGFkZChrZXk6c3RyaW5nLCB2YWw6YW55KTp2b2lkIHt9XG4gICAgICAgICRhZGRDaGlsZChvcHRpb25zPzphbnksIGNvbnN0cnVjdG9yPzooKT0+dm9pZCk6dm9pZCB7fVxuICAgICAgICAkYWZ0ZXIodGFyZ2V0OkhUTUxFbGVtZW50fHN0cmluZywgY2I6KCk9PnZvaWQpOnZvaWQge31cbiAgICAgICAgJGFwcGVuZFRvKHRhcmdldDpIVE1MRWxlbWVudHxzdHJpbmcsIGNiPzooKT0+dm9pZCk6dm9pZCB7fVxuICAgICAgICAkYmVmb3JlKHRhcmdldDpIVE1MRWxlbWVudHxzdHJpbmcsIGNiPzooKT0+dm9pZCk6dm9pZCB7fVxuICAgICAgICAkYnJvYWRjYXN0KGV2ZW50OnN0cmluZywgLi4uYXJnczpBcnJheTxhbnk+KTp2b2lkIHt9XG4gICAgICAgICRjb21waWxlKGVsOkhUTUxFbGVtZW50KTpGdW5jdGlvbiB7IHJldHVybiAoKTp2b2lkID0+IHt9IH1cbiAgICAgICAgJGRlbGV0ZShrZXk6c3RyaW5nKTp2b2lkIHt9XG4gICAgICAgICRkZXN0cm95KHJlbW92ZTpib29sZWFuKTp2b2lkIHt9XG4gICAgICAgICRkaXNwYXRjaChldmVudDpzdHJpbmcsIC4uLmFyZ3M6QXJyYXk8YW55Pik6dm9pZCB7fVxuICAgICAgICAkZW1pdChldmVudDpzdHJpbmcsIC4uLmFyZ3M6QXJyYXk8YW55Pik6dm9pZCB7fVxuICAgICAgICAkZXZhbCh0ZXh0OnN0cmluZyk6dm9pZCB7fVxuICAgICAgICAkZ2V0KGV4cDpzdHJpbmcpOnZvaWQge31cbiAgICAgICAgJGludGVycG9sYXRlKHRleHQ6c3RyaW5nKTp2b2lkIHt9XG4gICAgICAgICRsb2cocGF0aD86c3RyaW5nKTp2b2lkIHt9XG4gICAgICAgICRtb3VudChlbDpIVE1MRWxlbWVudHxzdHJpbmcpOnZvaWQge31cbiAgICAgICAgJG5leHRUaWNrKGZuOigpPT52b2lkKTp2b2lkIHt9XG4gICAgICAgICRvZmYoZXZlbnQ6c3RyaW5nLCBmbjooLi4uYXJnczpBcnJheTxhbnk+KT0+dm9pZHxib29sZWFuKTp2b2lkIHt9XG4gICAgICAgICRvbihldmVudDpzdHJpbmcsIGZuOiguLi5hcmdzOkFycmF5PGFueT4pPT52b2lkfGJvb2xlYW4pOnZvaWQge31cbiAgICAgICAgJG9uY2UoZXZlbnQ6c3RyaW5nLCBmbjooLi4uYXJnczpBcnJheTxhbnk+KT0+dm9pZHxib29sZWFuKTp2b2lkIHt9XG4gICAgICAgICRyZW1vdmUoY2I/OigpPT52b2lkKTp2b2lkIHt9XG4gICAgICAgICRzZXQoZXhwOnN0cmluZywgdmFsOmFueSk6dm9pZCB7fVxuICAgICAgICAkd2F0Y2goXG4gICAgICAgICAgICBleHA6IHN0cmluZ3woKCk9PnN0cmluZyksXG4gICAgICAgICAgICBjYjogKHZhbDogYW55LCBvbGQ/OiBhbnkpPT5hbnksXG4gICAgICAgICAgICBvcHRpb25zPzogeyBkZWVwPzogYm9vbGVhbjsgaW1tZWRpYXRlPzogYm9vbGVhbiB9XG4gICAgICAgICk6dm9pZCB7fVxuICAgIH1cblxuXHQvKipcbiAgICAgKiBBIGRlY29yYXRvciB0byByZWdpc3RlciBhIG1ldGhvZCBhcyBhIGxpZmVjeWNsZSBob29rLlxuICAgICAqXG4gICAgICogQHBhcmFtIGhvb2sgVGhlIGhvb2sgdG8gcmVnaXN0ZXIgZm9yLiBTZWUgaHR0cHM6Ly92dWVqcy5vcmcvYXBpLyNPcHRpb25zLUxpZmVjeWNsZS1Ib29rcy5cbiAgICAgKi9cblx0ZXhwb3J0IGZ1bmN0aW9uIGxpZmVjeWNsZShob29rOnN0cmluZykge1xuICAgICAgICByZXR1cm4gKGNsczphbnksIG5hbWU6c3RyaW5nLCBkZXNjOlByb3BlcnR5RGVzY3JpcHRvcik6UHJvcGVydHlEZXNjcmlwdG9yID0+IHtcbiAgICAgICAgICAgIGlmIChbXG4gICAgICAgICAgICAgICAgJ2NyZWF0ZWQnLCAnYmVmb3JlQ29tcGlsZScsICdjb21waWxlZCcsICdyZWFkeScsICdhdHRhY2hlZCcsICdkZXRhY2hlZCcsICdiZWZvcmVEZXN0cm95JywgJ2Rlc3Ryb3llZCdcbiAgICAgICAgICAgIF0uaW5kZXhPZihob29rKSA9PSAtMSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gTGlmZWN5bGUgSG9vazogJyArIGhvb2spO1xuICAgICAgICAgICAgaWYgKCFjbHMuaGFzT3duUHJvcGVydHkoJ19faG9va3NfXycpKVxuICAgICAgICAgICAgICAgIGNscy5fX2hvb2tzX18gPSB7fTtcbiAgICAgICAgICAgIGNscy5fX2hvb2tzX19baG9va10gPSBjbHNbbmFtZV07XG4gICAgICAgICAgICBkZXNjLnZhbHVlID0gdm9pZCAwO1xuICAgICAgICAgICAgcmV0dXJuIGRlc2M7XG4gICAgICAgIH1cbiAgICB9XG5cblx0LyoqXG4gICAgICogQSBkZWNvcmF0b3IgdG8gcmVnaXN0ZXIgYSBtZXRob2QgYXMgYW4gZXZlbnQgaG9vay5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBob29rIFRoZSBldmVudCB0byByZWdpc3Rlci4gU2VlIGh0dHA6Ly92dWVqcy5vcmcvYXBpL29wdGlvbnMuaHRtbCNldmVudHMuXG4gICAgICovXG5cdGV4cG9ydCBmdW5jdGlvbiBldmVudEhvb2soaG9vazpzdHJpbmcpIHtcblx0XHRyZXR1cm4gKGNsczphbnksIG5hbWU6c3RyaW5nLCBkZXNjOlByb3BlcnR5RGVzY3JpcHRvcik6UHJvcGVydHlEZXNjcmlwdG9yID0+IHtcblx0XHRcdGlmICghY2xzLmhhc093blByb3BlcnR5KCdfX2V2ZW50c19fJykpXG5cdFx0XHRcdGNscy5fX2V2ZW50c19fID0ge307XG5cdFx0XHRjbHMuX19ldmVudHNfX1tuYW1lXSA9IGNsc1tuYW1lXTtcblx0XHRcdGRlc2MudmFsdWUgPSB2b2lkIDA7XG5cdFx0XHRyZXR1cm4gZGVzYztcblx0XHR9XG5cdH1cblxuXHQvKipcbiAgICAgKiBBIGRlY29yYXRvciBmb3IgbWVtYmVyIHZhcmlhYmxlcyB0aGF0IHNoYWxsIGJlIGV4cG9zZWQgYXNcbiAgICAgKiBwcm9wZXJ0aWVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIG9wdGlvbnMgVGhlIG9wdGlvbnMuIFNlZSBodHRwOi8vdnVlanMub3JnL2FwaS8jcHJvcHMuXG4gICAgICovXG5cdGV4cG9ydCBmdW5jdGlvbiBwcm9wKG9wdGlvbnM6YW55KSB7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGNsczphbnksIG5hbWU6c3RyaW5nKTp2b2lkIHtcbiAgICAgICAgICAgIGlmICghY2xzLmhhc093blByb3BlcnR5KCdfX3Byb3BzX18nKSlcbiAgICAgICAgICAgICAgICBjbHMuX19wcm9wc19fID0ge307XG4gICAgICAgICAgICBjbHMuX19wcm9wc19fW25hbWVdID0gb3B0aW9ucztcbiAgICAgICAgfVxuICAgIH1cblxuXHQvKipcbiAgICAgKiBBIGRlY29yYXRvciBmb3IgY29tcG9uZW50IGNsYXNzZXMgdGhhdCByZWdpc3RlcnMgdGhlbSBhc1xuICAgICAqIHZ1ZSBjb21wb25lbnRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgdG8gYXNzaWduLlxuICAgICAqL1xuICAgIGV4cG9ydCBmdW5jdGlvbiBjb21wb25lbnQobmFtZTpzdHJpbmcpOihjbHM6YW55KT0+dm9pZCB7XG4gICAgICAgIHJldHVybiAoY2xzOmFueSk6dm9pZCA9PiB7XG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9IGNyZWF0ZU9wdGlvbnMoY2xzKTtcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBhIFZ1ZSBjb21wb25lbnRcbiAgICAgICAgICAgIFZ1ZVN0YXRpYy5jb21wb25lbnQobmFtZSwgb3B0aW9ucyk7XG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBBIGZ1bmN0aW9uIHRoYXQgcHJvdmlkZXMgdGhlIGV4dGVuZCBmdW5jdGlvbmFsaXR5IG9mIHZ1ZWpzXG4gICAgICogZm9yIHRzIGNvbXBvbmVudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdCBUaGUgdHlwZSBvZiB0aGUgY29tcG9uZW50LlxuICAgICAqL1xuICAgIGV4cG9ydCBmdW5jdGlvbiBleHRlbmQodDphbnkpOnZ1ZWpzLlZ1ZVN0YXRpYyB7XG4gICAgICAgIHJldHVybiBWdWVTdGF0aWMuZXh0ZW5kKGNyZWF0ZU9wdGlvbnMoKG5ldyB0KCkpLmNvbnN0cnVjdG9yKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBvcHRpb25zIG9iamVjdCBmcm9tIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjbHMgVGhlIGNvbnN0cnVjdG9yIG9mIGEgY29tcG9uZW50LlxuICAgICAqIEBwYXJhbSBvcHRpb25zIFN0YXJ0aW5nIG9wdGlvbnMgdXNlZCB0byBjcmVhdGUgdGhlIGNvbXBvbmVudCBvcHRpb25zXG4gICAgICogKHNvbWUgZmllbGRzIGFyZSBhbHdheXMgb3ZlcndyaXR0ZW4pXG4gICAgICovXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU9wdGlvbnMoY2xzOiBhbnksIG9wdGlvbnM6IGFueSA9IHt9KTogdnVlanMuQ29tcG9uZW50T3B0aW9uIHtcbiAgICAgICAgb3B0aW9ucy5kYXRhID0gKCgpOiBhbnkgPT4geyByZXR1cm4gbmV3IGNscygpOyB9KVxuICAgICAgICBvcHRpb25zLm1ldGhvZHMgPSBvcHRpb25zLm1ldGhvZHMgfHwge31cbiAgICAgICAgb3B0aW9ucy5jb21wdXRlZCA9IG9wdGlvbnMuY29tcHV0ZWQgfHwge31cblxuICAgICAgICAvLyBjaGVjayBmb3IgcmVwbGFjZSBhbmQgdGVtcGxhdGVcbiAgICAgICAgaWYgKGNscy5oYXNPd25Qcm9wZXJ0eSgncmVwbGFjZScpKVxuICAgICAgICAgICAgb3B0aW9ucy5yZXBsYWNlID0gY2xzLnJlcGxhY2U7XG5cbiAgICAgICAgaWYgKGNscy5oYXNPd25Qcm9wZXJ0eSgndGVtcGxhdGUnKSlcbiAgICAgICAgICAgIG9wdGlvbnMudGVtcGxhdGUgPSBjbHMudGVtcGxhdGU7XG5cbiAgICAgICAgaWYgKGNscy5oYXNPd25Qcm9wZXJ0eSgnY29tcG9uZW50cycpKVxuICAgICAgICAgICAgb3B0aW9ucy5jb21wb25lbnRzID0gY2xzLmNvbXBvbmVudHM7XG5cbiAgICAgICAgLy8gY3JlYXRlIG9iamVjdCBhbmQgZ2V0IHByb3RvdHlwZVxuICAgICAgICBsZXQgb2JqOiBhbnkgPSBuZXcgY2xzKCk7XG4gICAgICAgIGxldCBwcm90bzogYW55ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XG5cbiAgICAgICAgaWYgKHByb3RvWydfX3Byb3BzX18nXSlcbiAgICAgICAgICAgIG9wdGlvbnMucHJvcHMgPSBwcm90by5fX3Byb3BzX187XG4gICAgICAgIGlmIChwcm90b1snX19ldmVudHNfXyddKVxuICAgICAgICAgICAgb3B0aW9ucy5ldmVudHMgPSBwcm90by5fX2V2ZW50c19fO1xuICAgICAgICBpZiAocHJvdG9bJ19faG9va3NfXyddKVxuICAgICAgICAgICAgVnVlU3RhdGljLnV0aWwuZXh0ZW5kKG9wdGlvbnMsIHByb3RvLl9faG9va3NfXyk7XG4gICAgICAgIC8vIGdldCBtZXRob2RzXG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvKS5mb3JFYWNoKChtZXRob2Q6IHN0cmluZyk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICAvLyBza2lwIHRoZSBjb25zdHJ1Y3RvciBhbmQgdGhlIGludGVybmFsIG9wdGlvbiBrZWVwZXJcbiAgICAgICAgICAgIGlmIChbJ2NvbnN0cnVjdG9yJ10uaW5kZXhPZihtZXRob2QpID4gLTEpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICBsZXQgZGVzYzogUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgbWV0aG9kKTtcblxuICAgICAgICAgICAgLy8gbm9ybWFsIG1ldGhvZHNcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGVzYy52YWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICBvcHRpb25zLm1ldGhvZHNbbWV0aG9kXSA9IHByb3RvW21ldGhvZF07XG5cbiAgICAgICAgICAgIC8vIGlmIGdldHRlciBhbmQgc2V0dGVyIGFyZSBkZWZpZWQsIHBhc3MgdGhlIGZ1bmN0aW9uIGFzIGNvbXB1dGVkIHByb3BlcnR5XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZGVzYy5zZXQgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jb21wdXRlZFttZXRob2RdID0ge1xuICAgICAgICAgICAgICAgICAgICBnZXQ6IGRlc2MuZ2V0LFxuICAgICAgICAgICAgICAgICAgICBzZXQ6IGRlc2Muc2V0XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIG1ldGhvZCBvbmx5IGhhcyBhIGdldHRlciwganVzdCBwdXQgdGhlIGdldHRlciB0byB0aGUgY29tcG9uZW50XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZGVzYy5nZXQgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jb21wdXRlZFttZXRob2RdID0gZGVzYy5nZXQ7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBWdWVUc0NvbXBvbmVudDsiXX0=