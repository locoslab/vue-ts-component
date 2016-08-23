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
