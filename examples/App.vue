<template>
  <div id="app">
    <h1>Demo</h1>
    <h2>Count</h2>
    <count></count>
    <hr>

    <h2>Grid</h2>
    <div id="demo">
    <form id="search">
        Search <input name="gridfilter" v-model="searchQuery">
    </form>
    <demogrid
            :data=gridData
            :columns=gridColumns
            :filter-key=searchQuery>
    </demogrid>
    </div>
    <hr>

  </div>
</template>

<script>

import count from './count/count.vue'
import demogrid from './grid/grid.vue'

console.log('This is App.vue')

export default {
  components: {
    count,demogrid
  }, props: {
    gridColumns:{},
    gridData:{},
    searchQuery:{}
  }
}

</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
