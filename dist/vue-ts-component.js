"use strict";
var VueStatic = require('vue');
/**
 * This package contains utilities to create view components that look like classes.
 * Note that this code relies on the decorator feature of typescript to perform the
 * conversions. At time of writing, (August 2016), this feature is marked
 * experimental and requires the special compiler flag 'experimentalDecorators'.
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
        // handle methods
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLXRzLWNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy92dWUtdHMtY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFZLFNBQVMsV0FBTSxLQUMzQixDQUFDLENBRCtCO0FBR2hDOzs7Ozs7O0dBT0c7QUFDSCxJQUFpQixjQUFjLENBdUw5QjtBQXZMRCxXQUFpQixjQUFjLEVBQUMsQ0FBQztJQUU3Qjs7O09BR0c7SUFDSDtRQUFBO1FBNENBLENBQUM7UUE1Qkcsc0RBQXNEO1FBQ3RELHdCQUFJLEdBQUosVUFBSyxHQUFVLEVBQUUsR0FBTyxJQUFRLENBQUM7UUFDakMsNkJBQVMsR0FBVCxVQUFVLE9BQVksRUFBRSxXQUFxQixJQUFRLENBQUM7UUFDdEQsMEJBQU0sR0FBTixVQUFPLE1BQXlCLEVBQUUsRUFBVyxJQUFRLENBQUM7UUFDdEQsNkJBQVMsR0FBVCxVQUFVLE1BQXlCLEVBQUUsRUFBWSxJQUFRLENBQUM7UUFDMUQsMkJBQU8sR0FBUCxVQUFRLE1BQXlCLEVBQUUsRUFBWSxJQUFRLENBQUM7UUFDeEQsOEJBQVUsR0FBVixVQUFXLEtBQVk7WUFBRSxjQUFrQjtpQkFBbEIsV0FBa0IsQ0FBbEIsc0JBQWtCLENBQWxCLElBQWtCO2dCQUFsQiw2QkFBa0I7O1FBQVEsQ0FBQztRQUNwRCw0QkFBUSxHQUFSLFVBQVMsRUFBYyxJQUFhLE1BQU0sQ0FBQyxjQUFZLENBQUMsQ0FBQSxDQUFDLENBQUM7UUFDMUQsMkJBQU8sR0FBUCxVQUFRLEdBQVUsSUFBUSxDQUFDO1FBQzNCLDRCQUFRLEdBQVIsVUFBUyxNQUFjLElBQVEsQ0FBQztRQUNoQyw2QkFBUyxHQUFULFVBQVUsS0FBWTtZQUFFLGNBQWtCO2lCQUFsQixXQUFrQixDQUFsQixzQkFBa0IsQ0FBbEIsSUFBa0I7Z0JBQWxCLDZCQUFrQjs7UUFBUSxDQUFDO1FBQ25ELHlCQUFLLEdBQUwsVUFBTSxLQUFZO1lBQUUsY0FBa0I7aUJBQWxC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LE9BQU8sSUFBSSxDQUFDLEdBQUcsS0FBSyxVQUFVLENBQUM7Z0JBQ3BDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUc7b0JBQ3ZCLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztvQkFDYixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7aUJBQ2hCLENBQUM7WUFHTixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsR0FBRyxLQUFLLFVBQVUsQ0FBQztnQkFDcEMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO1FBQzVDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBbERlLDRCQUFhLGdCQWtENUIsQ0FBQTtBQUNMLENBQUMsRUF2TGdCLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBdUw5QjtBQUNEO2tCQUFlLGNBQWMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFZ1ZVN0YXRpYyBmcm9tICd2dWUnXG5pbXBvcnQgKiBhcyBWdWVSb3V0ZXIgZnJvbSAndnVlLXJvdXRlcidcblxuLyoqXG4gKiBUaGlzIHBhY2thZ2UgY29udGFpbnMgdXRpbGl0aWVzIHRvIGNyZWF0ZSB2aWV3IGNvbXBvbmVudHMgdGhhdCBsb29rIGxpa2UgY2xhc3Nlcy5cbiAqIE5vdGUgdGhhdCB0aGlzIGNvZGUgcmVsaWVzIG9uIHRoZSBkZWNvcmF0b3IgZmVhdHVyZSBvZiB0eXBlc2NyaXB0IHRvIHBlcmZvcm0gdGhlXG4gKiBjb252ZXJzaW9ucy4gQXQgdGltZSBvZiB3cml0aW5nLCAoQXVndXN0IDIwMTYpLCB0aGlzIGZlYXR1cmUgaXMgbWFya2VkXG4gKiBleHBlcmltZW50YWwgYW5kIHJlcXVpcmVzIHRoZSBzcGVjaWFsIGNvbXBpbGVyIGZsYWcgJ2V4cGVyaW1lbnRhbERlY29yYXRvcnMnLlxuICpcbiAqIEBhdXRob3IgTHVrYXMgR2FtcGVyLCBNYXJjdXMgSGFuZHRlLCBTdGVwaGFuIFdhZ25lclxuICovXG5leHBvcnQgbmFtZXNwYWNlIFZ1ZVRzQ29tcG9uZW50IHtcblxuICAgIC8qKlxuICAgICAqIFRoZSBiYXNlIGNsYXNzIGZvciB2dWUgY29tcG9uZW50cyB3aXRoIHByb3BlcnR5IGFuZCBtZXRob2QgZGVmaW5pdGlvbnNcbiAgICAgKiB0aGF0IHdpbGwgYmUgaW1wbGVtZW50ZWQgYnkgdGhlIHZ1ZSBmcmFtZXdvcmsuXG4gICAgICovXG4gICAgZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XG5cbiAgICAgICAgLy8gcHVibGljIHByb3BlcnRpZXM6IGh0dHA6Ly92dWVqcy5vcmcvYXBpL2luc3RhbmNlLXByb3BlcnRpZXMuaHRtbFxuICAgICAgICAkOmFueTtcbiAgICAgICAgJCQ6YW55O1xuICAgICAgICAkZGF0YTogYW55O1xuICAgICAgICAkY2hpbGRyZW46IEFycmF5PHZ1ZWpzLlZ1ZT47XG4gICAgICAgICRlbDogSFRNTEVsZW1lbnQ7XG4gICAgICAgICRvcHRpb25zOiBhbnk7XG4gICAgICAgICRwYXJlbnQ6IHZ1ZWpzLlZ1ZTtcbiAgICAgICAgJHJvb3Q6IHZ1ZWpzLlZ1ZTtcblxuICAgICAgICAvLyBhZGRpdGlvbmFsIHByb3BlcnRpZXMgZXhwb3NlZCBieSB2dWUtcm91dGVyOiBodHRwOi8vcm91dGVyLnZ1ZWpzLm9yZy9lbi9cbiAgICAgICAgJHJvdXRlOiB2dWVqcy4kcm91dGU8YW55LCBhbnksIGFueT47XG4gICAgICAgICRyb3V0ZXI6IHZ1ZWpzLlJvdXRlcjxhbnk+O1xuXG4gICAgICAgIC8vIG1ldGhvZHM6IGh0dHA6Ly92dWVqcy5vcmcvYXBpL2luc3RhbmNlLW1ldGhvZHMuaHRtbFxuICAgICAgICAkYWRkKGtleTpzdHJpbmcsIHZhbDphbnkpOnZvaWQge31cbiAgICAgICAgJGFkZENoaWxkKG9wdGlvbnM/OmFueSwgY29uc3RydWN0b3I/OigpPT52b2lkKTp2b2lkIHt9XG4gICAgICAgICRhZnRlcih0YXJnZXQ6SFRNTEVsZW1lbnR8c3RyaW5nLCBjYjooKT0+dm9pZCk6dm9pZCB7fVxuICAgICAgICAkYXBwZW5kVG8odGFyZ2V0OkhUTUxFbGVtZW50fHN0cmluZywgY2I/OigpPT52b2lkKTp2b2lkIHt9XG4gICAgICAgICRiZWZvcmUodGFyZ2V0OkhUTUxFbGVtZW50fHN0cmluZywgY2I/OigpPT52b2lkKTp2b2lkIHt9XG4gICAgICAgICRicm9hZGNhc3QoZXZlbnQ6c3RyaW5nLCAuLi5hcmdzOkFycmF5PGFueT4pOnZvaWQge31cbiAgICAgICAgJGNvbXBpbGUoZWw6SFRNTEVsZW1lbnQpOkZ1bmN0aW9uIHsgcmV0dXJuICgpOnZvaWQgPT4ge30gfVxuICAgICAgICAkZGVsZXRlKGtleTpzdHJpbmcpOnZvaWQge31cbiAgICAgICAgJGRlc3Ryb3kocmVtb3ZlOmJvb2xlYW4pOnZvaWQge31cbiAgICAgICAgJGRpc3BhdGNoKGV2ZW50OnN0cmluZywgLi4uYXJnczpBcnJheTxhbnk+KTp2b2lkIHt9XG4gICAgICAgICRlbWl0KGV2ZW50OnN0cmluZywgLi4uYXJnczpBcnJheTxhbnk+KTp2b2lkIHt9XG4gICAgICAgICRldmFsKHRleHQ6c3RyaW5nKTp2b2lkIHt9XG4gICAgICAgICRnZXQoZXhwOnN0cmluZyk6dm9pZCB7fVxuICAgICAgICAkaW50ZXJwb2xhdGUodGV4dDpzdHJpbmcpOnZvaWQge31cbiAgICAgICAgJGxvZyhwYXRoPzpzdHJpbmcpOnZvaWQge31cbiAgICAgICAgJG1vdW50KGVsOkhUTUxFbGVtZW50fHN0cmluZyk6dm9pZCB7fVxuICAgICAgICAkbmV4dFRpY2soZm46KCk9PnZvaWQpOnZvaWQge31cbiAgICAgICAgJG9mZihldmVudDpzdHJpbmcsIGZuOiguLi5hcmdzOkFycmF5PGFueT4pPT52b2lkfGJvb2xlYW4pOnZvaWQge31cbiAgICAgICAgJG9uKGV2ZW50OnN0cmluZywgZm46KC4uLmFyZ3M6QXJyYXk8YW55Pik9PnZvaWR8Ym9vbGVhbik6dm9pZCB7fVxuICAgICAgICAkb25jZShldmVudDpzdHJpbmcsIGZuOiguLi5hcmdzOkFycmF5PGFueT4pPT52b2lkfGJvb2xlYW4pOnZvaWQge31cbiAgICAgICAgJHJlbW92ZShjYj86KCk9PnZvaWQpOnZvaWQge31cbiAgICAgICAgJHNldChleHA6c3RyaW5nLCB2YWw6YW55KTp2b2lkIHt9XG4gICAgICAgICR3YXRjaChcbiAgICAgICAgICAgIGV4cDogc3RyaW5nfCgoKT0+c3RyaW5nKSxcbiAgICAgICAgICAgIGNiOiAodmFsOiBhbnksIG9sZD86IGFueSk9PmFueSxcbiAgICAgICAgICAgIG9wdGlvbnM/OiB7IGRlZXA/OiBib29sZWFuOyBpbW1lZGlhdGU/OiBib29sZWFuIH1cbiAgICAgICAgKTp2b2lkIHt9XG4gICAgfVxuXG5cdC8qKlxuICAgICAqIEEgZGVjb3JhdG9yIHRvIHJlZ2lzdGVyIGEgbWV0aG9kIGFzIGEgbGlmZWN5Y2xlIGhvb2suXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaG9vayBUaGUgaG9vayB0byByZWdpc3RlciBmb3IuIFNlZSBodHRwczovL3Z1ZWpzLm9yZy9hcGkvI09wdGlvbnMtTGlmZWN5Y2xlLUhvb2tzLlxuICAgICAqL1xuXHRleHBvcnQgZnVuY3Rpb24gbGlmZWN5Y2xlKGhvb2s6c3RyaW5nKSB7XG4gICAgICAgIHJldHVybiAoY2xzOmFueSwgbmFtZTpzdHJpbmcsIGRlc2M6UHJvcGVydHlEZXNjcmlwdG9yKTpQcm9wZXJ0eURlc2NyaXB0b3IgPT4ge1xuICAgICAgICAgICAgaWYgKFtcbiAgICAgICAgICAgICAgICAnY3JlYXRlZCcsICdiZWZvcmVDb21waWxlJywgJ2NvbXBpbGVkJywgJ3JlYWR5JywgJ2F0dGFjaGVkJywgJ2RldGFjaGVkJywgJ2JlZm9yZURlc3Ryb3knLCAnZGVzdHJveWVkJ1xuICAgICAgICAgICAgXS5pbmRleE9mKGhvb2spID09IC0xKVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBMaWZlY3lsZSBIb29rOiAnICsgaG9vayk7XG4gICAgICAgICAgICBpZiAoIWNscy5oYXNPd25Qcm9wZXJ0eSgnX19ob29rc19fJykpXG4gICAgICAgICAgICAgICAgY2xzLl9faG9va3NfXyA9IHt9O1xuICAgICAgICAgICAgY2xzLl9faG9va3NfX1tob29rXSA9IGNsc1tuYW1lXTtcbiAgICAgICAgICAgIGRlc2MudmFsdWUgPSB2b2lkIDA7XG4gICAgICAgICAgICByZXR1cm4gZGVzYztcbiAgICAgICAgfVxuICAgIH1cblxuXHQvKipcbiAgICAgKiBBIGRlY29yYXRvciB0byByZWdpc3RlciBhIG1ldGhvZCBhcyBhbiBldmVudCBob29rLlxuICAgICAqXG4gICAgICogQHBhcmFtIGhvb2sgVGhlIGV2ZW50IHRvIHJlZ2lzdGVyLiBTZWUgaHR0cDovL3Z1ZWpzLm9yZy9hcGkvb3B0aW9ucy5odG1sI2V2ZW50cy5cbiAgICAgKi9cblx0ZXhwb3J0IGZ1bmN0aW9uIGV2ZW50SG9vayhob29rOnN0cmluZykge1xuXHRcdHJldHVybiAoY2xzOmFueSwgbmFtZTpzdHJpbmcsIGRlc2M6UHJvcGVydHlEZXNjcmlwdG9yKTpQcm9wZXJ0eURlc2NyaXB0b3IgPT4ge1xuXHRcdFx0aWYgKCFjbHMuaGFzT3duUHJvcGVydHkoJ19fZXZlbnRzX18nKSlcblx0XHRcdFx0Y2xzLl9fZXZlbnRzX18gPSB7fTtcblx0XHRcdGNscy5fX2V2ZW50c19fW25hbWVdID0gY2xzW25hbWVdO1xuXHRcdFx0ZGVzYy52YWx1ZSA9IHZvaWQgMDtcblx0XHRcdHJldHVybiBkZXNjO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuICAgICAqIEEgZGVjb3JhdG9yIGZvciBtZW1iZXIgdmFyaWFibGVzIHRoYXQgc2hhbGwgYmUgZXhwb3NlZCBhc1xuICAgICAqIHByb3BlcnRpZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gb3B0aW9ucyBUaGUgb3B0aW9ucy4gU2VlIGh0dHA6Ly92dWVqcy5vcmcvYXBpLyNwcm9wcy5cbiAgICAgKi9cblx0ZXhwb3J0IGZ1bmN0aW9uIHByb3Aob3B0aW9uczphbnkpIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oY2xzOmFueSwgbmFtZTpzdHJpbmcpOnZvaWQge1xuICAgICAgICAgICAgaWYgKCFjbHMuaGFzT3duUHJvcGVydHkoJ19fcHJvcHNfXycpKVxuICAgICAgICAgICAgICAgIGNscy5fX3Byb3BzX18gPSB7fTtcbiAgICAgICAgICAgIGNscy5fX3Byb3BzX19bbmFtZV0gPSBvcHRpb25zO1xuICAgICAgICB9XG4gICAgfVxuXG5cdC8qKlxuICAgICAqIEEgZGVjb3JhdG9yIGZvciBjb21wb25lbnQgY2xhc3NlcyB0aGF0IHJlZ2lzdGVycyB0aGVtIGFzXG4gICAgICogdnVlIGNvbXBvbmVudHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSB0byBhc3NpZ24uXG4gICAgICovXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGNvbXBvbmVudChuYW1lOnN0cmluZyk6KGNsczphbnkpPT52b2lkIHtcbiAgICAgICAgcmV0dXJuIChjbHM6YW55KTp2b2lkID0+IHtcbiAgICAgICAgICAgIGxldCBvcHRpb25zID0gY3JlYXRlT3B0aW9ucyhjbHMpO1xuICAgICAgICAgICAgLy8gY3JlYXRlIGEgVnVlIGNvbXBvbmVudFxuICAgICAgICAgICAgVnVlU3RhdGljLmNvbXBvbmVudChuYW1lLCBvcHRpb25zKTtcbiAgICAgICAgfTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEEgZnVuY3Rpb24gdGhhdCBwcm92aWRlcyB0aGUgZXh0ZW5kIGZ1bmN0aW9uYWxpdHkgb2YgdnVlanNcbiAgICAgKiBmb3IgdHMgY29tcG9uZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB0IFRoZSB0eXBlIG9mIHRoZSBjb21wb25lbnQuXG4gICAgICovXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZCh0OmFueSk6dnVlanMuVnVlU3RhdGljIHtcbiAgICAgICAgcmV0dXJuIFZ1ZVN0YXRpYy5leHRlbmQoY3JlYXRlT3B0aW9ucygobmV3IHQoKSkuY29uc3RydWN0b3IpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIG9wdGlvbnMgb2JqZWN0IGZyb20gdGhlIGNvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNscyBUaGUgY29uc3RydWN0b3Igb2YgYSBjb21wb25lbnQuXG4gICAgICogQHBhcmFtIG9wdGlvbnMgU3RhcnRpbmcgb3B0aW9ucyB1c2VkIHRvIGNyZWF0ZSB0aGUgY29tcG9uZW50IG9wdGlvbnNcbiAgICAgKiAoc29tZSBmaWVsZHMgYXJlIGFsd2F5cyBvdmVyd3JpdHRlbilcbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gY3JlYXRlT3B0aW9ucyhjbHM6IGFueSwgb3B0aW9uczogYW55ID0ge30pOiB2dWVqcy5Db21wb25lbnRPcHRpb24ge1xuICAgICAgICBvcHRpb25zLmRhdGEgPSAoKCk6IGFueSA9PiB7IHJldHVybiBuZXcgY2xzKCk7IH0pXG4gICAgICAgIG9wdGlvbnMubWV0aG9kcyA9IG9wdGlvbnMubWV0aG9kcyB8fCB7fVxuICAgICAgICBvcHRpb25zLmNvbXB1dGVkID0gb3B0aW9ucy5jb21wdXRlZCB8fCB7fVxuXG4gICAgICAgIC8vIGNoZWNrIGZvciByZXBsYWNlIGFuZCB0ZW1wbGF0ZVxuICAgICAgICBpZiAoY2xzLmhhc093blByb3BlcnR5KCdyZXBsYWNlJykpXG4gICAgICAgICAgICBvcHRpb25zLnJlcGxhY2UgPSBjbHMucmVwbGFjZTtcblxuICAgICAgICBpZiAoY2xzLmhhc093blByb3BlcnR5KCd0ZW1wbGF0ZScpKVxuICAgICAgICAgICAgb3B0aW9ucy50ZW1wbGF0ZSA9IGNscy50ZW1wbGF0ZTtcblxuICAgICAgICBpZiAoY2xzLmhhc093blByb3BlcnR5KCdjb21wb25lbnRzJykpXG4gICAgICAgICAgICBvcHRpb25zLmNvbXBvbmVudHMgPSBjbHMuY29tcG9uZW50cztcblxuICAgICAgICAvLyBjcmVhdGUgb2JqZWN0IGFuZCBnZXQgcHJvdG90eXBlXG4gICAgICAgIGxldCBvYmo6IGFueSA9IG5ldyBjbHMoKTtcbiAgICAgICAgbGV0IHByb3RvOiBhbnkgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqKTtcblxuICAgICAgICBpZiAocHJvdG9bJ19fcHJvcHNfXyddKVxuICAgICAgICAgICAgb3B0aW9ucy5wcm9wcyA9IHByb3RvLl9fcHJvcHNfXztcbiAgICAgICAgaWYgKHByb3RvWydfX2V2ZW50c19fJ10pXG4gICAgICAgICAgICBvcHRpb25zLmV2ZW50cyA9IHByb3RvLl9fZXZlbnRzX187XG4gICAgICAgIGlmIChwcm90b1snX19ob29rc19fJ10pXG4gICAgICAgICAgICBWdWVTdGF0aWMudXRpbC5leHRlbmQob3B0aW9ucywgcHJvdG8uX19ob29rc19fKTtcblxuICAgICAgICAvLyBoYW5kbGUgbWV0aG9kc1xuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90bykuZm9yRWFjaCgobWV0aG9kOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICAgICAgICAgIC8vIHNraXAgdGhlIGNvbnN0cnVjdG9yIGFuZCB0aGUgaW50ZXJuYWwgb3B0aW9uIGtlZXBlclxuICAgICAgICAgICAgaWYgKFsnY29uc3RydWN0b3InXS5pbmRleE9mKG1ldGhvZCkgPiAtMSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIGxldCBkZXNjOiBQcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCBtZXRob2QpO1xuXG4gICAgICAgICAgICAvLyBub3JtYWwgbWV0aG9kc1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBkZXNjLnZhbHVlID09PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgICAgIG9wdGlvbnMubWV0aG9kc1ttZXRob2RdID0gcHJvdG9bbWV0aG9kXTtcblxuICAgICAgICAgICAgLy8gaWYgZ2V0dGVyIGFuZCBzZXR0ZXIgYXJlIGRlZmluZWQsIHBhc3MgdGhlIGZ1bmN0aW9uIGFzIGNvbXB1dGVkIHByb3BlcnR5XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZGVzYy5zZXQgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jb21wdXRlZFttZXRob2RdID0ge1xuICAgICAgICAgICAgICAgICAgICBnZXQ6IGRlc2MuZ2V0LFxuICAgICAgICAgICAgICAgICAgICBzZXQ6IGRlc2Muc2V0XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIG1ldGhvZCBvbmx5IGhhcyBhIGdldHRlciwganVzdCBwdXQgdGhlIGdldHRlciB0byB0aGUgY29tcG9uZW50XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZGVzYy5nZXQgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jb21wdXRlZFttZXRob2RdID0gZGVzYy5nZXQ7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBWdWVUc0NvbXBvbmVudDtcbiJdfQ==