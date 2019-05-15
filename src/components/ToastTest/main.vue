<template>
  <div class="toast" :class="type ? `toast--${type}` : ''">
    <p>{{content}}</p>
  </div>
</template>

<script>
export default {
  name: 'Main',
  data () {
    return {
      type: '',
      content: '',
      duration: 3000
    };
  },
  mounted () {
    setTimeout(() => {
      // 3s 通过父级移除子元素
      this.$el.parentNode.removeChild(this.$el);
    }, this.duration);
  }
};
</script>

<style lang="stylus" scoped>
.toast
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  color: #fff;
  z-index: 9999;
  background: transparent;
  > p
    padding: 12px 22px;
    font-size: 18px;
    border-radius: 4px;
    background: rgba(17, 17, 17, 0.7);
  &--error p
    background: rgba(255, 0, 0, 0.5);
  &--success p
    background: rgba(0, 255, 100, 0.5);

</style>
