<template>
  <div>
  </div>
</template>

<script>
export default {
  name: 'delay',
  data () {
    return {

    }
  },
  computed: {
    orderNo () {
      return this.$route.query.orderId;
    }
  },
  methods: {},
  mounted () {}
};
</script>

<style scoped lang="stylus">

</style>
