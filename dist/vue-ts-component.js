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
     */
    function createOptions(cls) {
        var options = {
            data: (function () { return new cls(); }),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLXRzLWNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy92dWUtdHMtY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxJQUFZLFNBQVMsV0FBTSxLQUMzQixDQUFDLENBRCtCO0FBR2hDOzs7Ozs7O0dBT0c7QUFDSCxJQUFpQixjQUFjLENBd0w5QjtBQXhMRCxXQUFpQixjQUFjLEVBQUMsQ0FBQztJQUdoQzs7O1VBR007SUFDSDtRQUFBO1FBNENBLENBQUM7UUE1Qkcsc0RBQXNEO1FBQ3RELHdCQUFJLEdBQUosVUFBSyxHQUFVLEVBQUUsR0FBTyxJQUFRLENBQUM7UUFDakMsNkJBQVMsR0FBVCxVQUFVLE9BQVksRUFBRSxXQUFxQixJQUFRLENBQUM7UUFDdEQsMEJBQU0sR0FBTixVQUFPLE1BQXlCLEVBQUUsRUFBVyxJQUFRLENBQUM7UUFDdEQsNkJBQVMsR0FBVCxVQUFVLE1BQXlCLEVBQUUsRUFBWSxJQUFRLENBQUM7UUFDMUQsMkJBQU8sR0FBUCxVQUFRLE1BQXlCLEVBQUUsRUFBWSxJQUFRLENBQUM7UUFDeEQsOEJBQVUsR0FBVixVQUFXLEtBQVk7WUFBRSxjQUFrQjtpQkFBbEIsV0FBa0IsQ0FBbEIsc0JBQWtCLENBQWxCLElBQWtCO2dCQUFsQiw2QkFBa0I7O1FBQVEsQ0FBQztRQUNwRCw0QkFBUSxHQUFSLFVBQVMsRUFBYyxJQUFhLE1BQU0sQ0FBQyxjQUFZLENBQUMsQ0FBQSxDQUFDLENBQUM7UUFDMUQsMkJBQU8sR0FBUCxVQUFRLEdBQVUsSUFBUSxDQUFDO1FBQzNCLDRCQUFRLEdBQVIsVUFBUyxNQUFjLElBQVEsQ0FBQztRQUNoQyw2QkFBUyxHQUFULFVBQVUsS0FBWTtZQUFFLGNBQWtCO2lCQUFsQixXQUFrQixDQUFsQixzQkFBa0IsQ0FBbEIsSUFBa0I7Z0JBQWxCLDZCQUFrQjs7UUFBUSxDQUFDO1FBQ25ELHlCQUFLLEdBQUwsVUFBTSxLQUFZO1lBQUUsY0FBa0I7aUJBQWxC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SSxDQUFDLEdBQUc7b0JBQ2IsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO2lCQUNoQixDQUFDO1lBR04sSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsS0FBSyxVQUFVLENBQUM7Z0JBQ3BDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQXBEZSw0QkFBYSxnQkFvRDVCLENBQUE7QUFDTCxDQUFDLEVBeExnQixjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQXdMOUI7QUFDRDtrQkFBZSxjQUFjLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBWdWVTdGF0aWMgZnJvbSAndnVlJ1xuaW1wb3J0ICogYXMgVnVlUm91dGVyIGZyb20gJ3Z1ZS1yb3V0ZXInXG5cbi8qKlxuICogVGhpcyBwYWNrYWdlIGNvbnRhaW5zIHV0aWxpdGllcyB0byBjcmVhdGUgdmlldyBjb21wb25lbnRzIHRoYXQgbG9vayBsaWtlIGNsYXNzZXMuXG4gKiBOb3RlIHRoYXQgdGhpcyBjb2RlIHJlbGllcyBvbiB0aGUgZGVjb3JhdG9yIGZlYXR1cmUgb2YgdHlwZXNjcmlwdCB0byBwZXJmb3JtIHRoZSBjb252ZXJzaW9ucy4gQXQgdGhlXG4gKiB0aW1lIG9mIHdyaXRpbmcsIChKdWx5IDIwMTYpLCB0aGlzIGZlYXR1cmUgaXMgbWFya2VkIGV4cGVyaW1lbnRhbCBhbmQgcmVxdWlyZXMgYVxuICogc3BlY2lhbCBjb21waWxlciBmbGFnLlxuICpcbiAqIEBhdXRob3IgTHVrYXMgR2FtcGVyLCBNYXJjdXMgSGFuZHRlLCBTdGVwaGFuIFdhZ25lclxuICovXG5leHBvcnQgbmFtZXNwYWNlIFZ1ZVRzQ29tcG9uZW50IHtcblxuXG4gLyoqXG4gICAgICogVGhlIGJhc2UgY2xhc3MgZm9yIHZ1ZSBjb21wb25lbnRzIHdpdGggcHJvcGVydHkgYW5kIG1ldGhvZCBkZWZpbml0aW9uc1xuICAgICAqIHRoYXQgd2lsbCBiZSBpbXBsZW1lbnRlZCBieSB0aGUgdnVlIGZyYW1ld29yay5cbiAgICAgKi9cbiAgICBleHBvcnQgY2xhc3MgQ29tcG9uZW50IHtcblxuICAgICAgICAvLyBwdWJsaWMgcHJvcGVydGllczogaHR0cDovL3Z1ZWpzLm9yZy9hcGkvaW5zdGFuY2UtcHJvcGVydGllcy5odG1sXG4gICAgICAgICQ6YW55O1xuICAgICAgICAkJDphbnk7XG4gICAgICAgICRkYXRhOiBhbnk7XG4gICAgICAgICRjaGlsZHJlbjogQXJyYXk8dnVlanMuVnVlPjtcbiAgICAgICAgJGVsOiBIVE1MRWxlbWVudDtcbiAgICAgICAgJG9wdGlvbnM6IGFueTtcbiAgICAgICAgJHBhcmVudDogdnVlanMuVnVlO1xuICAgICAgICAkcm9vdDogdnVlanMuVnVlO1xuXG4gICAgICAgIC8vIGFkZGl0aW9uYWwgcHJvcGVydGllcyBleHBvc2VkIGJ5IHZ1ZS1yb3V0ZXI6IGh0dHA6Ly9yb3V0ZXIudnVlanMub3JnL2VuL1xuICAgICAgICAkcm91dGU6IHZ1ZWpzLiRyb3V0ZTxhbnksIGFueSwgYW55PjtcbiAgICAgICAgJHJvdXRlcjogdnVlanMuUm91dGVyPGFueT47XG5cbiAgICAgICAgLy8gbWV0aG9kczogaHR0cDovL3Z1ZWpzLm9yZy9hcGkvaW5zdGFuY2UtbWV0aG9kcy5odG1sXG4gICAgICAgICRhZGQoa2V5OnN0cmluZywgdmFsOmFueSk6dm9pZCB7fVxuICAgICAgICAkYWRkQ2hpbGQob3B0aW9ucz86YW55LCBjb25zdHJ1Y3Rvcj86KCk9PnZvaWQpOnZvaWQge31cbiAgICAgICAgJGFmdGVyKHRhcmdldDpIVE1MRWxlbWVudHxzdHJpbmcsIGNiOigpPT52b2lkKTp2b2lkIHt9XG4gICAgICAgICRhcHBlbmRUbyh0YXJnZXQ6SFRNTEVsZW1lbnR8c3RyaW5nLCBjYj86KCk9PnZvaWQpOnZvaWQge31cbiAgICAgICAgJGJlZm9yZSh0YXJnZXQ6SFRNTEVsZW1lbnR8c3RyaW5nLCBjYj86KCk9PnZvaWQpOnZvaWQge31cbiAgICAgICAgJGJyb2FkY2FzdChldmVudDpzdHJpbmcsIC4uLmFyZ3M6QXJyYXk8YW55Pik6dm9pZCB7fVxuICAgICAgICAkY29tcGlsZShlbDpIVE1MRWxlbWVudCk6RnVuY3Rpb24geyByZXR1cm4gKCk6dm9pZCA9PiB7fSB9XG4gICAgICAgICRkZWxldGUoa2V5OnN0cmluZyk6dm9pZCB7fVxuICAgICAgICAkZGVzdHJveShyZW1vdmU6Ym9vbGVhbik6dm9pZCB7fVxuICAgICAgICAkZGlzcGF0Y2goZXZlbnQ6c3RyaW5nLCAuLi5hcmdzOkFycmF5PGFueT4pOnZvaWQge31cbiAgICAgICAgJGVtaXQoZXZlbnQ6c3RyaW5nLCAuLi5hcmdzOkFycmF5PGFueT4pOnZvaWQge31cbiAgICAgICAgJGV2YWwodGV4dDpzdHJpbmcpOnZvaWQge31cbiAgICAgICAgJGdldChleHA6c3RyaW5nKTp2b2lkIHt9XG4gICAgICAgICRpbnRlcnBvbGF0ZSh0ZXh0OnN0cmluZyk6dm9pZCB7fVxuICAgICAgICAkbG9nKHBhdGg/OnN0cmluZyk6dm9pZCB7fVxuICAgICAgICAkbW91bnQoZWw6SFRNTEVsZW1lbnR8c3RyaW5nKTp2b2lkIHt9XG4gICAgICAgICRuZXh0VGljayhmbjooKT0+dm9pZCk6dm9pZCB7fVxuICAgICAgICAkb2ZmKGV2ZW50OnN0cmluZywgZm46KC4uLmFyZ3M6QXJyYXk8YW55Pik9PnZvaWR8Ym9vbGVhbik6dm9pZCB7fVxuICAgICAgICAkb24oZXZlbnQ6c3RyaW5nLCBmbjooLi4uYXJnczpBcnJheTxhbnk+KT0+dm9pZHxib29sZWFuKTp2b2lkIHt9XG4gICAgICAgICRvbmNlKGV2ZW50OnN0cmluZywgZm46KC4uLmFyZ3M6QXJyYXk8YW55Pik9PnZvaWR8Ym9vbGVhbik6dm9pZCB7fVxuICAgICAgICAkcmVtb3ZlKGNiPzooKT0+dm9pZCk6dm9pZCB7fVxuICAgICAgICAkc2V0KGV4cDpzdHJpbmcsIHZhbDphbnkpOnZvaWQge31cbiAgICAgICAgJHdhdGNoKFxuICAgICAgICAgICAgZXhwOiBzdHJpbmd8KCgpPT5zdHJpbmcpLFxuICAgICAgICAgICAgY2I6ICh2YWw6IGFueSwgb2xkPzogYW55KT0+YW55LFxuICAgICAgICAgICAgb3B0aW9ucz86IHsgZGVlcD86IGJvb2xlYW47IGltbWVkaWF0ZT86IGJvb2xlYW4gfVxuICAgICAgICApOnZvaWQge31cbiAgICB9XG5cblx0LyoqXG4gICAgICogQSBkZWNvcmF0b3IgdG8gcmVnaXN0ZXIgYSBtZXRob2QgYXMgYSBsaWZlY3ljbGUgaG9vay5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBob29rIFRoZSBob29rIHRvIHJlZ2lzdGVyIGZvci4gU2VlIGh0dHBzOi8vdnVlanMub3JnL2FwaS8jT3B0aW9ucy1MaWZlY3ljbGUtSG9va3MuXG4gICAgICovXG5cdGV4cG9ydCBmdW5jdGlvbiBsaWZlY3ljbGUoaG9vazpzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIChjbHM6YW55LCBuYW1lOnN0cmluZywgZGVzYzpQcm9wZXJ0eURlc2NyaXB0b3IpOlByb3BlcnR5RGVzY3JpcHRvciA9PiB7XG4gICAgICAgICAgICBpZiAoW1xuICAgICAgICAgICAgICAgICdjcmVhdGVkJywgJ2JlZm9yZUNvbXBpbGUnLCAnY29tcGlsZWQnLCAncmVhZHknLCAnYXR0YWNoZWQnLCAnZGV0YWNoZWQnLCAnYmVmb3JlRGVzdHJveScsICdkZXN0cm95ZWQnXG4gICAgICAgICAgICBdLmluZGV4T2YoaG9vaykgPT0gLTEpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIExpZmVjeWxlIEhvb2s6ICcgKyBob29rKTtcbiAgICAgICAgICAgIGlmICghY2xzLmhhc093blByb3BlcnR5KCdfX2hvb2tzX18nKSlcbiAgICAgICAgICAgICAgICBjbHMuX19ob29rc19fID0ge307XG4gICAgICAgICAgICBjbHMuX19ob29rc19fW2hvb2tdID0gY2xzW25hbWVdO1xuICAgICAgICAgICAgZGVzYy52YWx1ZSA9IHZvaWQgMDtcbiAgICAgICAgICAgIHJldHVybiBkZXNjO1xuICAgICAgICB9XG4gICAgfVxuXG5cdC8qKlxuICAgICAqIEEgZGVjb3JhdG9yIHRvIHJlZ2lzdGVyIGEgbWV0aG9kIGFzIGFuIGV2ZW50IGhvb2suXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaG9vayBUaGUgZXZlbnQgdG8gcmVnaXN0ZXIuIFNlZSBodHRwOi8vdnVlanMub3JnL2FwaS9vcHRpb25zLmh0bWwjZXZlbnRzLlxuICAgICAqL1xuXHRleHBvcnQgZnVuY3Rpb24gZXZlbnRIb29rKGhvb2s6c3RyaW5nKSB7XG5cdFx0cmV0dXJuIChjbHM6YW55LCBuYW1lOnN0cmluZywgZGVzYzpQcm9wZXJ0eURlc2NyaXB0b3IpOlByb3BlcnR5RGVzY3JpcHRvciA9PiB7XG5cdFx0XHRpZiAoIWNscy5oYXNPd25Qcm9wZXJ0eSgnX19ldmVudHNfXycpKVxuXHRcdFx0XHRjbHMuX19ldmVudHNfXyA9IHt9O1xuXHRcdFx0Y2xzLl9fZXZlbnRzX19bbmFtZV0gPSBjbHNbbmFtZV07XG5cdFx0XHRkZXNjLnZhbHVlID0gdm9pZCAwO1xuXHRcdFx0cmV0dXJuIGRlc2M7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG4gICAgICogQSBkZWNvcmF0b3IgZm9yIG1lbWJlciB2YXJpYWJsZXMgdGhhdCBzaGFsbCBiZSBleHBvc2VkIGFzXG4gICAgICogcHJvcGVydGllcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvcHRpb25zIFRoZSBvcHRpb25zLiBTZWUgaHR0cDovL3Z1ZWpzLm9yZy9hcGkvI3Byb3BzLlxuICAgICAqL1xuXHRleHBvcnQgZnVuY3Rpb24gcHJvcChvcHRpb25zOmFueSkge1xuXHRcdHJldHVybiBmdW5jdGlvbihjbHM6YW55LCBuYW1lOnN0cmluZyk6dm9pZCB7XG4gICAgICAgICAgICBpZiAoIWNscy5oYXNPd25Qcm9wZXJ0eSgnX19wcm9wc19fJykpXG4gICAgICAgICAgICAgICAgY2xzLl9fcHJvcHNfXyA9IHt9O1xuICAgICAgICAgICAgY2xzLl9fcHJvcHNfX1tuYW1lXSA9IG9wdGlvbnM7XG4gICAgICAgIH1cbiAgICB9XG5cblx0LyoqXG4gICAgICogQSBkZWNvcmF0b3IgZm9yIGNvbXBvbmVudCBjbGFzc2VzIHRoYXQgcmVnaXN0ZXJzIHRoZW0gYXNcbiAgICAgKiB2dWUgY29tcG9uZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIHRvIGFzc2lnbi5cbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gY29tcG9uZW50KG5hbWU6c3RyaW5nKTooY2xzOmFueSk9PnZvaWQge1xuICAgICAgICByZXR1cm4gKGNsczphbnkpOnZvaWQgPT4ge1xuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSBjcmVhdGVPcHRpb25zKGNscyk7XG4gICAgICAgICAgICAvLyBjcmVhdGUgYSBWdWUgY29tcG9uZW50XG4gICAgICAgICAgICBWdWVTdGF0aWMuY29tcG9uZW50KG5hbWUsIG9wdGlvbnMpO1xuICAgICAgICB9O1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQSBmdW5jdGlvbiB0aGF0IHByb3ZpZGVzIHRoZSBleHRlbmQgZnVuY3Rpb25hbGl0eSBvZiB2dWVqc1xuICAgICAqIGZvciB0cyBjb21wb25lbnRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHQgVGhlIHR5cGUgb2YgdGhlIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gZXh0ZW5kKHQ6YW55KTp2dWVqcy5WdWVTdGF0aWMge1xuICAgICAgICByZXR1cm4gVnVlU3RhdGljLmV4dGVuZChjcmVhdGVPcHRpb25zKChuZXcgdCgpKS5jb25zdHJ1Y3RvcikpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gb3B0aW9ucyBvYmplY3QgZnJvbSB0aGUgY29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gY2xzIFRoZSBjb25zdHJ1Y3RvciBvZiBhIGNvbXBvbmVudC5cbiAgICAgKi9cbiAgICBleHBvcnQgZnVuY3Rpb24gY3JlYXRlT3B0aW9ucyhjbHM6IGFueSk6IHZ1ZWpzLkNvbXBvbmVudE9wdGlvbiB7XG4gICAgICAgIGxldCBvcHRpb25zOiBhbnkgPSB7XG4gICAgICAgICAgICBkYXRhOiAoKCk6IGFueSA9PiB7IHJldHVybiBuZXcgY2xzKCk7IH0pLFxuICAgICAgICAgICAgbWV0aG9kczoge30sXG4gICAgICAgICAgICBjb21wdXRlZDoge31cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBjaGVjayBmb3IgcmVwbGFjZSBhbmQgdGVtcGxhdGVcbiAgICAgICAgaWYgKGNscy5oYXNPd25Qcm9wZXJ0eSgncmVwbGFjZScpKVxuICAgICAgICAgICAgb3B0aW9ucy5yZXBsYWNlID0gY2xzLnJlcGxhY2U7XG5cbiAgICAgICAgaWYgKGNscy5oYXNPd25Qcm9wZXJ0eSgndGVtcGxhdGUnKSlcbiAgICAgICAgICAgIG9wdGlvbnMudGVtcGxhdGUgPSBjbHMudGVtcGxhdGU7XG5cbiAgICAgICAgaWYgKGNscy5oYXNPd25Qcm9wZXJ0eSgnY29tcG9uZW50cycpKVxuICAgICAgICAgICAgb3B0aW9ucy5jb21wb25lbnRzID0gY2xzLmNvbXBvbmVudHM7XG5cbiAgICAgICAgLy8gY3JlYXRlIG9iamVjdCBhbmQgZ2V0IHByb3RvdHlwZVxuICAgICAgICBsZXQgb2JqOiBhbnkgPSBuZXcgY2xzKCk7XG4gICAgICAgIGxldCBwcm90bzogYW55ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iaik7XG5cbiAgICAgICAgaWYgKHByb3RvWydfX3Byb3BzX18nXSlcbiAgICAgICAgICAgIG9wdGlvbnMucHJvcHMgPSBwcm90by5fX3Byb3BzX187XG4gICAgICAgIGlmIChwcm90b1snX19ldmVudHNfXyddKVxuICAgICAgICAgICAgb3B0aW9ucy5ldmVudHMgPSBwcm90by5fX2V2ZW50c19fO1xuICAgICAgICBpZiAocHJvdG9bJ19faG9va3NfXyddKVxuICAgICAgICAgICAgVnVlU3RhdGljLnV0aWwuZXh0ZW5kKG9wdGlvbnMsIHByb3RvLl9faG9va3NfXyk7XG4gICAgICAgIC8vIGdldCBtZXRob2RzXG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvKS5mb3JFYWNoKChtZXRob2Q6IHN0cmluZyk6IHZvaWQgPT4ge1xuXG4gICAgICAgICAgICAvLyBza2lwIHRoZSBjb25zdHJ1Y3RvciBhbmQgdGhlIGludGVybmFsIG9wdGlvbiBrZWVwZXJcbiAgICAgICAgICAgIGlmIChbJ2NvbnN0cnVjdG9yJ10uaW5kZXhPZihtZXRob2QpID4gLTEpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICBsZXQgZGVzYzogUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgbWV0aG9kKTtcblxuICAgICAgICAgICAgLy8gbm9ybWFsIG1ldGhvZHNcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGVzYy52YWx1ZSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICBvcHRpb25zLm1ldGhvZHNbbWV0aG9kXSA9IHByb3RvW21ldGhvZF07XG5cbiAgICAgICAgICAgIC8vIGlmIGdldHRlciBhbmQgc2V0dGVyIGFyZSBkZWZpZWQsIHBhc3MgdGhlIGZ1bmN0aW9uIGFzIGNvbXB1dGVkIHByb3BlcnR5XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZGVzYy5zZXQgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jb21wdXRlZFttZXRob2RdID0ge1xuICAgICAgICAgICAgICAgICAgICBnZXQ6IGRlc2MuZ2V0LFxuICAgICAgICAgICAgICAgICAgICBzZXQ6IGRlc2Muc2V0XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIG1ldGhvZCBvbmx5IGhhcyBhIGdldHRlciwganVzdCBwdXQgdGhlIGdldHRlciB0byB0aGUgY29tcG9uZW50XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZGVzYy5nZXQgPT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jb21wdXRlZFttZXRob2RdID0gZGVzYy5nZXQ7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9XG59XG5leHBvcnQgZGVmYXVsdCBWdWVUc0NvbXBvbmVudDsiXX0=