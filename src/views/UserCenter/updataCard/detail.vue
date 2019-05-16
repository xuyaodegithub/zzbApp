<template>
  <section>
    <!-- 立即还款 -->
    <van-popup
      :close-on-click-overlay="false"
     v-model="showDelayVisi"
     class="dialog-delay-box">
     <header class="dialog-header">
       <van-icon name="cross"  class="dialog-left-close" @click="showDelayVisi=false"/>
       <span class="dialog-head">支付延期手续费</span>
     </header>
      <div class="aurora-dialog-content">
        <p class="obvious-text">333.00</p>
        <p class="yan-Qi">延期至：2019年10月10号</p>
        <p class="text mar-bottom15">
          延期还款需先支付延期手续费，需要短信确认，验证码已发送至您手机{{phoneNum | mobileFilter}}
        </p>
        <van-password-input
          :value="verifyCode"
          :mask="true"
          @focus="showKeyboard = true"
        />
        <button class="aurora-btn-box aurora-btn-gray"
          :class="{'aurora-btn-active': verifyCode.length === 6 && countdown<=0}"
          @click="handleDelaySure(0)" :disabled="verifyCode.length<6 || countdown>0">
          {{countdown > 0 ? `${countdown}秒` : '确定'}}
        </button>
      </div>
     </van-popup>

    <!-- 数字键盘 -->
    <van-number-keyboard
      class="aurora-keyboard"
      :show="showKeyboard"
      @input="onInput"
      @delete="onDelete"
      :z-index="9999"
      close-button-text="完成"
      @blur="showKeyboard = false"
    />

    <van-popup
      v-model="showSuccess"
      class="successP"
      :close-on-click-overlay="false"
    >
    <div class="successT">
      <van-icon :name="icon" size="46px" color="#07c160"/>
      <p>延期手续费支付{{sucOPrfail ? '成功' : '失败'}}</p>
      <p>{{msgMess}}</p>
      <van-button type="primary" size="small" block class="btn" @click="showSuccess=false">确定</van-button>
    </div>
    </van-popup >
  </section>
</template>

<script>
import { myHeader } from 'components/index';
import { orderstatusMatch } from 'utils/match';
import { Row, Col, PasswordInput, NumberKeyboard, Popup, Dialog, Toast, Icon, Button  } from 'vant';
import { getOrderInfo, loanPostpone } from 'apis/index';
import { getStore } from 'utils/storage.js';
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
  },
  data () {
    return {
      failVisi: false,
      showSuccess:false,
      icon:'passed',
      sucOPrfail:true,
      msgMess:'延期至：2019年10月10号 ，请于延期时间按时还款，以免影响征信。谢谢！',
      show: true,
      orderstatusMatch,
      orderInfo: {
        // orderStatus:"1",
        // paybackAmount:1000,
        // overdueDay:10,
        // repayDate:'2019-05-20',
        // deadline:1

      },
      showDelayVisi: true,
      verifyCode: '',
      showKeyboard: false,
      examineVisi: true,
      countdown: 0,
    };
  },
  computed: {
    orderNo () {
      return this.$route.params.orderId;
    },
    hasback () {
      if (String(this.$route.query.hasBack) === 'false') {
        return false;
      }
      return true;
    },
    phoneNum () {
      return getStore('phoneNum');
    }
  },
  methods: {
    // 贷款订单信息
    async fetchLoanInfo () {
      let res = await getOrderInfo(this.orderNo);
      if (!res.resultCode) {
        this.orderInfo = res.data;
        this.failVisi = res.data.orderStatus === 3;
      }
    },
    // 延期操作
    async handleLoanPost () {
      let res = await loanPostpone(
        this.orderNo,
        this.orderInfo.paybackAmount,
        this.verifyCode
      );
      if (!res.resultCode) {
        let _this = this;
        Dialog.alert({
          title: `${res.data.opMessage}`,
          message: `${res.data.opResult}`
        }).then(() => {
          _this.showDelayVisi = false;
          _this.fetchLoanInfo(); // 重新请求订单状态
        });
      } else {
        Toast.fail(`${res.resultMessage}`);
      }
    },
    handleDelay () {
      this.showDelayVisi = true;
      // 发送短信验证码
      this.setCountDown();
    },
    // 倒计时
    setCountDown () {
      let _this = this;
      let times = this.countdown;
      let timer;
      if (times > 0) {
        --this.countdown;
        timer = setTimeout(function () {
          _this.setCountDown();
        }, 1000);
      } else {
        this.countdown = 0;
        clearTimeout(timer);
      }
    },
    onInput (value) {
      this.verifyCode = (this.verifyCode + value).slice(0, 6);
    },
    onDelete () {
      this.verifyCode = this.verifyCode.slice(0, this.verifyCode.length - 1);
    },
    handleDelaySure (bool) {
      let _self=this
      this.countdown=60
      let timer=setInterval(()=>{
        if(_self.countdown>0) _self.countdown-=1
        else clearInterval(timer)
      },1000)
      if (bool) {
        // Dialog.alert({
        //   title: '延期手续费支付成功',
        //   message: `延期至：2019年10月10号 ，请于延期时间按时还款，以免影响征信。谢谢`
        // }).then(() => {
          // this.showDelayVisi = false;
          this.showSuccess = true;
          this.sucOPrfail = true;
          this.icon = 'passed';
          this.msgMess = '延期至：2019年10月10号 ，请于延期时间按时还款，以免影响征信。谢谢！';
        // });
      } else {
        // Dialog.alert({
        //   title: '延期手续费支付失败',
        //   message: `该银行卡余额不足`
        // }).then(() => {
        //   this.showDelayVisi = false;
        // });
        this.showSuccess = true;
        this.sucOPrfail = false;
        this.msgMess = '该银行卡余额不足';
        this.icon = 'close';
      }
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
.order-status-box
  padding 8px 12px
  background #fff
  font-size 14px
  color #858585

.loan-detail-box
  padding 25px 15px
  text-align center
  .icon-size
    font-size 40px
    line-height 1.5
.order-detail-box
  text-align center
  font-size 14px
  .enlarge
    font-size 18px
    line-height 1.5
    padding 0 2px
  .obvious
    font-size 18px
    line-height 1.5
    color #f13c38
    padding 0 2px
.loan-info-box
  background #fff
  margin-bottom 10px
.bank-box
  background #fff

.loan-row
  padding 8px 12px
  line-height 1.5
  .title
    color #999999
  .value
    color #333333
    text-align right
.loan-padding
  padding 8px 0

.loan-detail-row
  margin-bottom 15px
  .title
    font-size 12px
    line-height 25px
  p
    font-size 14px
  .number-tag
    font-size 18px
    line-height 35px
.delay-text
  line-height 3
  text-decoration underline
  font-size 12px
.dialog-left-close
  position absolute
  left 7px
  top 7px
  color #999
  font-size 24px

.aurora-dialog-content
  padding 0   12px 35px 12px
  .yan-Qi
    font-size 14px
    color: deepskyblue
    text-align center
    margin-bottom 12px
   .mar-bottom15
      font-size 14px
      padding 0 25px
  .obvious-text
    text-align center
    font-size 18px
    line-height 2
    margin-bottom 12px
  .text
    line-height 1.5
    color #999

</style>

<style lang="stylus">
.dialog-delay-box
  width 90%
  top 45%
  .dialog-header
    position relative
    padding 12px
    text-align center
    font-size 16px
    line-height 26px
.aurora-keyboard
  z-index 2006!important
 .successP
   width 80%
   border-radius 15px
 & .btn
   height 40px
.successT
    padding 35px 25px 25px
    text-align center
    color #999
    font-size 14px
    line-height 18px
 & p:nth-child(2)
  margin 20px
& p:nth-child(3)
  margin-bottom 15px
</style>
