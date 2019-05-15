<template>
  <div id="app">
    <transition name="van-slide-left">
      <router-view/>
    </transition>
    <Collect/>
  </div>
</template>
<script>
import {Collect} from '@/components';

export default {
  name: 'App',
  components: {
    Collect
  },
  mounted () {

  }
};
</script>
<style>
  #app{
    height: 100%;
  }
</style>
