# vue-ts-component
Decorators to transform a TypeScript class to a Vue component

## Use
Please see the provided example for a complete setup with browserify & vueify
that supports hot module reloading.

We recommend placing the TypeScript code in a separate file referenced by the
vue file to enable editor support and typemaps.

The vue file (cf. [`count.vue`](examples/count/count.vue))
```html
<template>
  <div class="hello">
    <h3>Counter</h3>
    {{counter}}
    <a href="#" v-on:click.stop="incCounter">Inc</a>
    <a href="#" v-on:click.stop="decCounter">Dec</a>
  </div>
</template>
<script>
    import Count from './count.ts';
    import VueTsComponent from '../../src/vue-ts-component';
    export default VueTsComponent.createOptions(Count);
</script>
```

The actual typescript class (cf. [`count.ts`](examples/count/count.ts))
```typescript
import VueTsComponent from '../../src/vue-ts-component'  

// transform the class Count to a vue component called count
@VueTsComponent.component("count")
// the VueComponent.Component provides all the declarations, Vue provieds to the component, the makes sure
// TypeScript support type checking and autocomplete
export default class Count extends VueTsComponent.Component {
    // the @props decorator transforms a property to an attribute
    // for the supported options see http://vuejs.org/api/options.html#props
    @VueTsComponent.prop({
        type: Boolean,  
        required: false
    })
    option:boolean;

    // normal properties, pass through the data options are declared as normal properties
    counter:number = 1

    decCounter() {
        this.counter--
    }

    incCounter() {
        this.counter++
    }

    // computed properties are defined as getter and setter
    get computed():number {
        return 1
    }

    set computed(arg:number) {
        // ...
    }
}
```

## Install
While the package is currently not in the npm registry you can include it as a dependency within your development projects by specifying it as a file dependency in package.json or directly from github using:

	npm install locoslab/vue-ts-component --save-dev

## Develop
``` bash
# once: install dependencies
npm install

# run the examples with hot reload served at localhost:8080
npm start

# build for production with minification
npm run prepare
```

## License

[MIT](http://opensource.org/licenses/MIT)
