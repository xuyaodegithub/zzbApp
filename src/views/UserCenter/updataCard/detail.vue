<template>
  <section>
    <myHeader title="绑定银行卡"/>
    <div class="item">
      <div class="item-card" :style="style">
          <div class="flex">
            <img :src="banklist.logo" alt="" @error="catchErrorImage($event)">
            <div class="title">
              <p>{{banklist.bankName}}</p>
              <p>{{banklist.type}}</p>
            </div>
          </div>
        <div class="card-num">
          <span>{{banklist.cardNo | bankFilter}}</span>
        </div>
      </div>
    </div>
    <div class="flex btn">
      <div style="display:flex;align-items: center;">
        <span style="margin-right: 10px;">设为默认卡</span>
        <van-switch
          @change="open()"
          v-model="checked"
          size="20px"
          active-color="rgb(7, 193, 96)"
        /></div>
      <div @click="Unbind()">解除绑定</div>
    </div>
  </section>
</template>

<script>
import { myHeader } from 'components/index';
// import { orderstatusMatch } from 'utils/match';
import { Row, Col, PasswordInput, NumberKeyboard, Popup, Dialog, Toast, Icon, Button, Switch } from 'vant';
// import { getOrderInfo, loanPostpone } from 'apis/index';
// import { getStore } from 'utils/storage.js';
import back from 'img/back.png';
export default {
  components: {
    myHeader,
    [Row.name]: Row,
    [Col.name]: Col,
    [PasswordInput.name]: PasswordInput,
    [NumberKeyboard.name]: NumberKeyboard,
    [Popup.name]: Popup,
    [Dialog.name]: Dialog,
    [Toast.name]: Toast,
    [Icon.name]: Icon,
    [Button.name]: Button,
    [Switch.name]: Switch
  },
  data () {
    return {
      banklist: { bankName: '中国工商银行', cardNo: '123456789101111156', logo: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=4168182961,2938928117&fm=27&gp=0.jpg', type: '借记卡' },
      checked: false,
      style: {
        'backgroundImage': `url(${back})`
      }

    };
  },
  computed: {

  },
  methods: {
    catchErrorImage (e) {
      e.target.src = require('img/bank.jpg');
    },
    Unbind () {
      let _self = this;
      Dialog.confirm({
        title: '提示',
        message: '确定要解除绑定此银行卡么？'
      }).then(() => {
        // on confirm
        _self.$router.go(-1);
      }).catch(() => {
        // on cancel
      });
    },
    open () {
      if (this.checked) Toast({duration: 500, message: '设置默认成功'});
      else Toast({duration: 500, message: '取消默认成功'});
    }
  },
  mounted () {
    // this.fetchLoanInfo();
  }
};
</script>

<style lang="stylus" scoped>
  section
    min-height 100%
    background-color rgba(242, 242, 242, 1)
  .item
    padding 15px
  .item-card
    padding 30px
    font-size 16px
    background-color #fff
    border-radius 10px
    line-height 30px
    background-repeat no-repeat
    background-size cover
    background-position center
  .item-card img
    width 60px
    height 60px
    border-radius 50%
    margin-right 20px
  .item-card .flex
    display flex
    align-items center
  .card-num
    margin-top 25px
    font-size 24px
    text-align center
    color #ffffff
    padding-bottom 20px
  .btn.flex
    display flex
    align-items center
    justify-content space-between
    padding 15px 30px
    font-size 16px
    color #169BD5
</style>

<style lang="stylus">

</style>
