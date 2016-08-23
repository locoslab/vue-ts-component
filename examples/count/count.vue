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
