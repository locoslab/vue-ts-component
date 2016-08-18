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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnVlLXRzLWNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy92dWUtdHMtY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxJQUFZLFNBQVMsV0FBTSxLQVUzQixDQUFDLENBVitCO0FBRWhDOzs7Ozs7O0dBT0c7QUFDSCxJQUFpQixjQUFjLENBd0w5QjtBQXhMRCxXQUFpQixjQUFjLEVBQUMsQ0FBQztJQUdoQzs7O1VBR007SUFDSDtRQUFBO1FBNENBLENBQUM7UUE1Qkcsc0RBQXNEO1FBQ3RELHdCQUFJLEdBQUosVUFBSyxHQUFVLEVBQUUsR0FBTyxJQUFRLENBQUM7UUFDakMsNkJBQVMsR0FBVCxVQUFVLE9BQVksRUFBRSxXQUFxQixJQUFRLENBQUM7UUFDdEQsMEJBQU0sR0FBTixVQUFPLE1BQXlCLEVBQUUsRUFBVyxJQUFRLENBQUM7UUFDdEQsNkJBQVMsR0FBVCxVQUFVLE1BQXlCLEVBQUUsRUFBWSxJQUFRLENBQUM7UUFDMUQsMkJBQU8sR0FBUCxVQUFRLE1BQXlCLEVBQUUsRUFBWSxJQUFRLENBQUM7UUFDeEQsOEJBQVUsR0FBVixVQUFXLEtBQVk7WUFBRSxjQUFrQjtpQkFBbEIsV0FBa0IsQ0FBbEIsc0JBQWtCLENBQWxCLElBQWtCO2dCQUFsQiw2QkFBa0I7O1FBQVEsQ0FBQztRQUNwRCw0QkFBUSxHQUFSLFVBQVMsRUFBYyxJQUFhLE1BQU0sQ0FBQyxjQUFZLENBQUMsQ0FBQSxDQUFDLENBQUM7UUFDMUQsMkJBQU8sR0FBUCxVQUFRLEdBQVUsSUFBUSxDQUFDO1FBQzNCLDRCQUFRLEdBQVIsVUFBUyxNQUFjLElBQVEsQ0FBQztRQUNoQyw2QkFBUyxHQUFULFVBQVUsS0FBWTtZQUFFLGNBQWtCO2lCQUFsQixXQUFrQixDQUFsQixzQkFBa0IsQ0FBbEIsSUFBa0I7Z0JBQWxCLDZCQUFrQjs7UUFBUSxDQUFDO1FBQ25ELHlCQUFLLEdBQUwsVUFBTSxLQUFZO1lBQUUsY0FBa0I7aUJBQWxC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SSxDQUFDLEdBQUc7b0JBQ2IsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO2lCQUNoQixDQUFDO1lBR04sSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLEdBQUcsS0FBSyxVQUFVLENBQUM7Z0JBQ3BDLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQXBEZSw0QkFBYSxnQkFvRDVCLENBQUE7QUFDTCxDQUFDLEVBeExnQixjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQXdMOUI7QUFDRDtrQkFBZSxjQUFjLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0ICogYXMgVnVlU3RhdGljIGZyb20gJ3Z1ZSdcclxuXHJcbi8qKlxyXG4gKiBUaGlzIHBhY2thZ2UgY29udGFpbnMgdXRpbGl0aWVzIHRvIGNyZWF0ZSB2aWV3IGNvbXBvbmVudHMgdGhhdCBsb29rIGxpa2UgY2xhc3Nlcy5cclxuICogTm90ZSB0aGF0IHRoaXMgY29kZSByZWxpZXMgb24gdGhlIGRlY29yYXRvciBmZWF0dXJlIG9mIHR5cGVzY3JpcHQgdG8gcGVyZm9ybSB0aGUgY29udmVyc2lvbnMuIEF0IHRoZVxyXG4gKiB0aW1lIG9mIHdyaXRpbmcsIChKdWx5IDIwMTYpLCB0aGlzIGZlYXR1cmUgaXMgbWFya2VkIGV4cGVyaW1lbnRhbCBhbmQgcmVxdWlyZXMgYVxyXG4gKiBzcGVjaWFsIGNvbXBpbGVyIGZsYWcuXHJcbiAqXHJcbiAqIEBhdXRob3IgTHVrYXMgR2FtcGVyLCBNYXJjdXMgSGFuZHRlLCBTdGVwaGFuIFdhZ25lclxyXG4gKi9cclxuZXhwb3J0IG5hbWVzcGFjZSBWdWVUc0NvbXBvbmVudCB7XHJcblxyXG5cclxuIC8qKlxyXG4gICAgICogVGhlIGJhc2UgY2xhc3MgZm9yIHZ1ZSBjb21wb25lbnRzIHdpdGggcHJvcGVydHkgYW5kIG1ldGhvZCBkZWZpbml0aW9uc1xyXG4gICAgICogdGhhdCB3aWxsIGJlIGltcGxlbWVudGVkIGJ5IHRoZSB2dWUgZnJhbWV3b3JrLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgQ29tcG9uZW50IHtcclxuXHJcbiAgICAgICAgLy8gcHVibGljIHByb3BlcnRpZXM6IGh0dHA6Ly92dWVqcy5vcmcvYXBpL2luc3RhbmNlLXByb3BlcnRpZXMuaHRtbFxyXG4gICAgICAgICQ6YW55O1xyXG4gICAgICAgICQkOmFueTtcclxuICAgICAgICAkZGF0YTogYW55O1xyXG4gICAgICAgICRjaGlsZHJlbjogQXJyYXk8dnVlanMuVnVlPjtcclxuICAgICAgICAkZWw6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgICRvcHRpb25zOiBhbnk7XHJcbiAgICAgICAgJHBhcmVudDogdnVlanMuVnVlOyBcclxuICAgICAgICAkcm9vdDogdnVlanMuVnVlO1xyXG5cclxuICAgICAgICAvLyBhZGRpdGlvbmFsIHByb3BlcnRpZXMgZXhwb3NlZCBieSB2dWUtcm91dGVyOiBodHRwOi8vcm91dGVyLnZ1ZWpzLm9yZy9lbi9cclxuICAgICAgICAkcm91dGU6IHZ1ZWpzLiRyb3V0ZTxhbnksIGFueSwgYW55PjtcclxuICAgICAgICAkcm91dGVyOiB2dWVqcy5Sb3V0ZXI8YW55PjtcclxuXHJcbiAgICAgICAgLy8gbWV0aG9kczogaHR0cDovL3Z1ZWpzLm9yZy9hcGkvaW5zdGFuY2UtbWV0aG9kcy5odG1sXHJcbiAgICAgICAgJGFkZChrZXk6c3RyaW5nLCB2YWw6YW55KTp2b2lkIHt9XHJcbiAgICAgICAgJGFkZENoaWxkKG9wdGlvbnM/OmFueSwgY29uc3RydWN0b3I/OigpPT52b2lkKTp2b2lkIHt9XHJcbiAgICAgICAgJGFmdGVyKHRhcmdldDpIVE1MRWxlbWVudHxzdHJpbmcsIGNiOigpPT52b2lkKTp2b2lkIHt9XHJcbiAgICAgICAgJGFwcGVuZFRvKHRhcmdldDpIVE1MRWxlbWVudHxzdHJpbmcsIGNiPzooKT0+dm9pZCk6dm9pZCB7fVxyXG4gICAgICAgICRiZWZvcmUodGFyZ2V0OkhUTUxFbGVtZW50fHN0cmluZywgY2I/OigpPT52b2lkKTp2b2lkIHt9XHJcbiAgICAgICAgJGJyb2FkY2FzdChldmVudDpzdHJpbmcsIC4uLmFyZ3M6QXJyYXk8YW55Pik6dm9pZCB7fVxyXG4gICAgICAgICRjb21waWxlKGVsOkhUTUxFbGVtZW50KTpGdW5jdGlvbiB7IHJldHVybiAoKTp2b2lkID0+IHt9IH1cclxuICAgICAgICAkZGVsZXRlKGtleTpzdHJpbmcpOnZvaWQge31cclxuICAgICAgICAkZGVzdHJveShyZW1vdmU6Ym9vbGVhbik6dm9pZCB7fVxyXG4gICAgICAgICRkaXNwYXRjaChldmVudDpzdHJpbmcsIC4uLmFyZ3M6QXJyYXk8YW55Pik6dm9pZCB7fVxyXG4gICAgICAgICRlbWl0KGV2ZW50OnN0cmluZywgLi4uYXJnczpBcnJheTxhbnk+KTp2b2lkIHt9XHJcbiAgICAgICAgJGV2YWwodGV4dDpzdHJpbmcpOnZvaWQge31cclxuICAgICAgICAkZ2V0KGV4cDpzdHJpbmcpOnZvaWQge31cclxuICAgICAgICAkaW50ZXJwb2xhdGUodGV4dDpzdHJpbmcpOnZvaWQge31cclxuICAgICAgICAkbG9nKHBhdGg/OnN0cmluZyk6dm9pZCB7fVxyXG4gICAgICAgICRtb3VudChlbDpIVE1MRWxlbWVudHxzdHJpbmcpOnZvaWQge31cclxuICAgICAgICAkbmV4dFRpY2soZm46KCk9PnZvaWQpOnZvaWQge31cclxuICAgICAgICAkb2ZmKGV2ZW50OnN0cmluZywgZm46KC4uLmFyZ3M6QXJyYXk8YW55Pik9PnZvaWR8Ym9vbGVhbik6dm9pZCB7fVxyXG4gICAgICAgICRvbihldmVudDpzdHJpbmcsIGZuOiguLi5hcmdzOkFycmF5PGFueT4pPT52b2lkfGJvb2xlYW4pOnZvaWQge31cclxuICAgICAgICAkb25jZShldmVudDpzdHJpbmcsIGZuOiguLi5hcmdzOkFycmF5PGFueT4pPT52b2lkfGJvb2xlYW4pOnZvaWQge31cclxuICAgICAgICAkcmVtb3ZlKGNiPzooKT0+dm9pZCk6dm9pZCB7fVxyXG4gICAgICAgICRzZXQoZXhwOnN0cmluZywgdmFsOmFueSk6dm9pZCB7fVxyXG4gICAgICAgICR3YXRjaChcclxuICAgICAgICAgICAgZXhwOiBzdHJpbmd8KCgpPT5zdHJpbmcpLFxyXG4gICAgICAgICAgICBjYjogKHZhbDogYW55LCBvbGQ/OiBhbnkpPT5hbnksXHJcbiAgICAgICAgICAgIG9wdGlvbnM/OiB7IGRlZXA/OiBib29sZWFuOyBpbW1lZGlhdGU/OiBib29sZWFuIH1cclxuICAgICAgICApOnZvaWQge31cclxuICAgIH1cclxuXHJcblx0LyoqIFxyXG4gICAgICogQSBkZWNvcmF0b3IgdG8gcmVnaXN0ZXIgYSBtZXRob2QgYXMgYSBsaWZlY3ljbGUgaG9vay5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaG9vayBUaGUgaG9vayB0byByZWdpc3RlciBmb3IuIFNlZSBodHRwczovL3Z1ZWpzLm9yZy9hcGkvI09wdGlvbnMtTGlmZWN5Y2xlLUhvb2tzLlxyXG4gICAgICovXHJcblx0ZXhwb3J0IGZ1bmN0aW9uIGxpZmVjeWNsZShob29rOnN0cmluZykge1xyXG4gICAgICAgIHJldHVybiAoY2xzOmFueSwgbmFtZTpzdHJpbmcsIGRlc2M6UHJvcGVydHlEZXNjcmlwdG9yKTpQcm9wZXJ0eURlc2NyaXB0b3IgPT4ge1xyXG4gICAgICAgICAgICBpZiAoW1xyXG4gICAgICAgICAgICAgICAgJ2NyZWF0ZWQnLCAnYmVmb3JlQ29tcGlsZScsICdjb21waWxlZCcsICdyZWFkeScsICdhdHRhY2hlZCcsICdkZXRhY2hlZCcsICdiZWZvcmVEZXN0cm95JywgJ2Rlc3Ryb3llZCdcclxuICAgICAgICAgICAgXS5pbmRleE9mKGhvb2spID09IC0xKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIExpZmVjeWxlIEhvb2s6ICcgKyBob29rKTtcclxuICAgICAgICAgICAgaWYgKCFjbHMuaGFzT3duUHJvcGVydHkoJ19faG9va3NfXycpKVxyXG4gICAgICAgICAgICAgICAgY2xzLl9faG9va3NfXyA9IHt9O1xyXG4gICAgICAgICAgICBjbHMuX19ob29rc19fW2hvb2tdID0gY2xzW25hbWVdO1xyXG4gICAgICAgICAgICBkZXNjLnZhbHVlID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4gZGVzYztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cdC8qKlxyXG4gICAgICogQSBkZWNvcmF0b3IgdG8gcmVnaXN0ZXIgYSBtZXRob2QgYXMgYW4gZXZlbnQgaG9vay5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaG9vayBUaGUgZXZlbnQgdG8gcmVnaXN0ZXIuIFNlZSBodHRwOi8vdnVlanMub3JnL2FwaS9vcHRpb25zLmh0bWwjZXZlbnRzLlxyXG4gICAgICovXHJcblx0ZXhwb3J0IGZ1bmN0aW9uIGV2ZW50SG9vayhob29rOnN0cmluZykge1xyXG5cdFx0cmV0dXJuIChjbHM6YW55LCBuYW1lOnN0cmluZywgZGVzYzpQcm9wZXJ0eURlc2NyaXB0b3IpOlByb3BlcnR5RGVzY3JpcHRvciA9PiB7XHJcblx0XHRcdGlmICghY2xzLmhhc093blByb3BlcnR5KCdfX2V2ZW50c19fJykpXHJcblx0XHRcdFx0Y2xzLl9fZXZlbnRzX18gPSB7fTtcclxuXHRcdFx0Y2xzLl9fZXZlbnRzX19bbmFtZV0gPSBjbHNbbmFtZV07XHJcblx0XHRcdGRlc2MudmFsdWUgPSB2b2lkIDA7XHJcblx0XHRcdHJldHVybiBkZXNjO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0LyoqXHJcbiAgICAgKiBBIGRlY29yYXRvciBmb3IgbWVtYmVyIHZhcmlhYmxlcyB0aGF0IHNoYWxsIGJlIGV4cG9zZWQgYXNcclxuICAgICAqIHByb3BlcnRpZXMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG9wdGlvbnMgVGhlIG9wdGlvbnMuIFNlZSBodHRwOi8vdnVlanMub3JnL2FwaS8jcHJvcHMuXHJcbiAgICAgKi9cclxuXHRleHBvcnQgZnVuY3Rpb24gcHJvcChvcHRpb25zOmFueSkge1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGNsczphbnksIG5hbWU6c3RyaW5nKTp2b2lkIHtcclxuICAgICAgICAgICAgaWYgKCFjbHMuaGFzT3duUHJvcGVydHkoJ19fcHJvcHNfXycpKVxyXG4gICAgICAgICAgICAgICAgY2xzLl9fcHJvcHNfXyA9IHt9O1xyXG4gICAgICAgICAgICBjbHMuX19wcm9wc19fW25hbWVdID0gb3B0aW9ucztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cdC8qKlxyXG4gICAgICogQSBkZWNvcmF0b3IgZm9yIGNvbXBvbmVudCBjbGFzc2VzIHRoYXQgcmVnaXN0ZXJzIHRoZW0gYXNcclxuICAgICAqIHZ1ZSBjb21wb25lbnRzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBuYW1lIFRoZSBuYW1lIHRvIGFzc2lnbi5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGNvbXBvbmVudChuYW1lOnN0cmluZyk6KGNsczphbnkpPT52b2lkIHtcclxuICAgICAgICByZXR1cm4gKGNsczphbnkpOnZvaWQgPT4ge1xyXG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9IGNyZWF0ZU9wdGlvbnMoY2xzKTtcclxuICAgICAgICAgICAgLy8gY3JlYXRlIGEgVnVlIGNvbXBvbmVudFxyXG4gICAgICAgICAgICBWdWVTdGF0aWMuY29tcG9uZW50KG5hbWUsIG9wdGlvbnMpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQSBmdW5jdGlvbiB0aGF0IHByb3ZpZGVzIHRoZSBleHRlbmQgZnVuY3Rpb25hbGl0eSBvZiB2dWVqc1xyXG4gICAgICogZm9yIHRzIGNvbXBvbmVudHMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHQgVGhlIHR5cGUgb2YgdGhlIGNvbXBvbmVudC5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZCh0OmFueSk6dnVlanMuVnVlU3RhdGljIHtcclxuICAgICAgICByZXR1cm4gVnVlU3RhdGljLmV4dGVuZChjcmVhdGVPcHRpb25zKChuZXcgdCgpKS5jb25zdHJ1Y3RvcikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhbiBvcHRpb25zIG9iamVjdCBmcm9tIHRoZSBjb25zdHJ1Y3Rvci5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2xzIFRoZSBjb25zdHJ1Y3RvciBvZiBhIGNvbXBvbmVudC5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU9wdGlvbnMoY2xzOiBhbnkpOiB2dWVqcy5Db21wb25lbnRPcHRpb24ge1xyXG4gICAgICAgIGxldCBvcHRpb25zOiBhbnkgPSB7XHJcbiAgICAgICAgICAgIGRhdGE6ICgoKTogYW55ID0+IHsgcmV0dXJuIG5ldyBjbHMoKTsgfSksXHJcbiAgICAgICAgICAgIG1ldGhvZHM6IHt9LFxyXG4gICAgICAgICAgICBjb21wdXRlZDoge31cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBjaGVjayBmb3IgcmVwbGFjZSBhbmQgdGVtcGxhdGVcclxuICAgICAgICBpZiAoY2xzLmhhc093blByb3BlcnR5KCdyZXBsYWNlJykpXHJcbiAgICAgICAgICAgIG9wdGlvbnMucmVwbGFjZSA9IGNscy5yZXBsYWNlO1xyXG4gXHJcbiAgICAgICAgaWYgKGNscy5oYXNPd25Qcm9wZXJ0eSgndGVtcGxhdGUnKSlcclxuICAgICAgICAgICAgb3B0aW9ucy50ZW1wbGF0ZSA9IGNscy50ZW1wbGF0ZTtcclxuXHJcbiAgICAgICAgaWYgKGNscy5oYXNPd25Qcm9wZXJ0eSgnY29tcG9uZW50cycpKVxyXG4gICAgICAgICAgICBvcHRpb25zLmNvbXBvbmVudHMgPSBjbHMuY29tcG9uZW50cztcclxuXHJcbiAgICAgICAgLy8gY3JlYXRlIG9iamVjdCBhbmQgZ2V0IHByb3RvdHlwZVxyXG4gICAgICAgIGxldCBvYmo6IGFueSA9IG5ldyBjbHMoKTtcclxuICAgICAgICBsZXQgcHJvdG86IGFueSA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xyXG5cclxuICAgICAgICBpZiAocHJvdG9bJ19fcHJvcHNfXyddKVxyXG4gICAgICAgICAgICBvcHRpb25zLnByb3BzID0gcHJvdG8uX19wcm9wc19fO1xyXG4gICAgICAgIGlmIChwcm90b1snX19ldmVudHNfXyddKVxyXG4gICAgICAgICAgICBvcHRpb25zLmV2ZW50cyA9IHByb3RvLl9fZXZlbnRzX187XHJcbiAgICAgICAgaWYgKHByb3RvWydfX2hvb2tzX18nXSlcclxuICAgICAgICAgICAgVnVlU3RhdGljLnV0aWwuZXh0ZW5kKG9wdGlvbnMsIHByb3RvLl9faG9va3NfXyk7XHJcbiAgICAgICAgLy8gZ2V0IG1ldGhvZHNcclxuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90bykuZm9yRWFjaCgobWV0aG9kOiBzdHJpbmcpOiB2b2lkID0+IHtcclxuXHJcbiAgICAgICAgICAgIC8vIHNraXAgdGhlIGNvbnN0cnVjdG9yIGFuZCB0aGUgaW50ZXJuYWwgb3B0aW9uIGtlZXBlclxyXG4gICAgICAgICAgICBpZiAoWydjb25zdHJ1Y3RvciddLmluZGV4T2YobWV0aG9kKSA+IC0xKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgbGV0IGRlc2M6IFByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIG1ldGhvZCk7XHJcblxyXG4gICAgICAgICAgICAvLyBub3JtYWwgbWV0aG9kc1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGRlc2MudmFsdWUgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLm1ldGhvZHNbbWV0aG9kXSA9IHByb3RvW21ldGhvZF07XHJcblxyXG4gICAgICAgICAgICAvLyBpZiBnZXR0ZXIgYW5kIHNldHRlciBhcmUgZGVmaWVkLCBwYXNzIHRoZSBmdW5jdGlvbiBhcyBjb21wdXRlZCBwcm9wZXJ0eVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgZGVzYy5zZXQgPT09ICdmdW5jdGlvbicpXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLmNvbXB1dGVkW21ldGhvZF0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2V0OiBkZXNjLmdldCxcclxuICAgICAgICAgICAgICAgICAgICBzZXQ6IGRlc2Muc2V0XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy8gaWYgdGhlIG1ldGhvZCBvbmx5IGhhcyBhIGdldHRlciwganVzdCBwdXQgdGhlIGdldHRlciB0byB0aGUgY29tcG9uZW50XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBkZXNjLmdldCA9PT0gJ2Z1bmN0aW9uJylcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMuY29tcHV0ZWRbbWV0aG9kXSA9IGRlc2MuZ2V0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBkZWZhdWx0IFZ1ZVRzQ29tcG9uZW50OyJdfQ==