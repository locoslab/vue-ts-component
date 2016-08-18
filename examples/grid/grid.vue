<template>
      <div>  
      <table>
        <thead>
        <tr>
            <template v-for="key in columns">
                <th v-on:click="sortBy(key)"> {{key | capitalize}}</th>
            </template>
            
        </tr>
        </thead>
        <tbody>
            <template v-for="entry in data | filterBy filterKey | orderBy sortKey reversed[sortKey]">
              <tr> <template v-for="key in columns">
                <td > {{entry[key]}}</td>
                </template> </tr>
            </template>
        </tbody>
    </table>
    </div>
</template>

<script lang='ts'>
    import DemoGrid from './grid.ts';
    import VueComponent from '../../src/vue-ts-component' ;
    export default VueComponent.createOptions(new DemoGrid().constructor);
</script>