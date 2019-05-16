<template>
  <section>
    <myHeader :hasBack="hasback" title="周转宝">
      <router-link :to="{name: 'UserCenter'}" slot="textright">我的
      </router-link>
    </myHeader>
    <div class="aurora-box-top">
      <div class="order-status-box border-bt-1px">
          <span class="title">订单状态:</span>
          <span class="value">{{orderstatusMatch[orderInfo.orderStatus]}}</span>
      </div>
      <div
        class="loan-detail-box mar-bottom15"
        :class="['0', '1', '3', '4', '7', '8', '12'].includes(orderInfo.orderStatus) ? 'bg-red' : 'bg-white'">
        <div
          class="colorwhite"
          v-if="orderInfo.orderStatus === '1' || orderInfo.orderStatus === '2' || orderInfo.orderStatus === '4'">
            <i class="Icon-Loan iconsandglass icon-size" v-if="orderInfo.orderStatus === '4'"></i>
            <i class="Icon-Loan iconexamine icon-size" v-else></i>
            <p class="notice">
              {{orderInfo.orderStatus === '4' ? '订单已审核，请耐心等待放款':(orderInfo.orderStatus === '2' ? '订单未审核，请耐心等待': '订单审核中，请耐心等待')}}
            </p>
        </div>
        <div class="order-detail-box colorwhite mar-bottom15" v-else-if="orderInfo.orderStatus === '3' || orderInfo.orderStatus === '12'">
          <i class="Icon-Loan iconexamine-error icon-size"></i>
          <p class="notice">审核未通过</p>
        </div>
        <div class="order-detail-box" v-else-if="['5', '6', '9', '10', '11'].includes(orderInfo.orderStatus)">
          <p>应还金额<span class="obvious">{{orderInfo.paybackAmount}}</span>元</p>
          <p :class="{'mar-bottom15': +orderInfo.repaidAmount === 0}" v-if="+orderInfo.overdueDay">
            已逾期<span class="obvious">{{orderInfo.overdueDay}}</span>天，
            还款日<span class="obvious">{{orderInfo.repayDate}}</span>
          </p>
          <p :class="{'mar-bottom15': +orderInfo.repaidAmount === 0}" v-else>
            <template v-if="+orderInfo.deadline === 0">
              今天就是还款日
            </template>
            <template v-else>
              距还款日<span class="obvious">{{orderInfo.deadline}}</span>天，
              还款日<span class="obvious">{{orderInfo.repayDate}}</span>
            </template>
          </p>
          <p class="mar-bottom15" v-if="+orderInfo.repaidAmount > 0">
            已还款金额 <span class="obvious">{{orderInfo.repaidAmount}}</span> 元
          </p>
          <router-link
            tag="button"
            class="aurora-long-btn aurora-btn-active"
           :to="{name: 'Repayment', params:{orderId: orderInfo.orderNo, paybackAmount: orderInfo.paybackAmount}}">
           立即还款</router-link>
           <!-- <button v-if="orderInfo.isoverdue"
            class="aurora-long-btn aurora-btn-active mar-left15"
            @click="handleDelay">我要延期</button> -->
        </div>
        <div class="order-detail-box colorwhite" v-else-if="orderInfo.orderStatus === '7' || orderInfo.orderStatus === '8'">
          <i class="Icon-Loan iconontime icon-size"></i>
          <p>已还款金额<span class="enlarge">{{orderInfo.repaidAmount}}</span>元</p>
        </div>
      </div>

      <div class="loan-info-box">
        <div class="border-bt-1px loan-padding">
          <van-row class="loan-row" type="flex" justify="space-between">
            <van-col span="10" class="title">订单号</van-col>
            <van-col span="10" class="value">{{orderInfo.orderNo}}</van-col>
          </van-row>
          <van-row class="loan-row" type="flex" justify="space-between">
            <van-col span="10" class="title">申请日期</van-col>
            <van-col span="10" class="value">{{orderInfo.applyTime}}</van-col>
          </van-row>
          <van-row class="loan-row" type="flex" justify="space-between" v-if="orderInfo.repayDate">
            <van-col span="10" class="title">还款日</van-col>
            <van-col span="10" class="value">{{orderInfo.repayDate}}</van-col>
          </van-row>
        </div>
        <div class="loan-padding">
          <van-row class="loan-row" type="flex" justify="space-between">
            <van-col span="10" class="title">借款金额</van-col>
            <van-col span="10" class="value">{{orderInfo.loanAmount}}元</van-col>
          </van-row>
          <van-row class="loan-row" type="flex" justify="space-between">
            <van-col span="10" class="title">服务费</van-col>
            <van-col span="10" class="value">{{orderInfo.serviceFee}}元</van-col>
          </van-row>
          <van-row class="loan-row" type="flex" justify="space-between">
            <van-col span="10" class="title">应还金额</van-col>
            <van-col span="10" class="value">{{orderInfo.paybackAmount}}元</van-col>
          </van-row>
          <van-row class="loan-row" type="flex" justify="space-between">
            <van-col span="10" class="title">借款期限</van-col>
            <van-col span="10" class="value">{{orderInfo.loanPeriod}}天</van-col>
          </van-row>
        </div>
      </div>

      <div class="bank-box loan-padding">
        <van-row class="loan-row" type="flex" justify="space-between">
          <van-col span="10" class="title">到账银行卡号</van-col>
          <van-col span="10" class="value">{{orderInfo.backAccount}}</van-col>
        </van-row>
      </div>
    </div>
    <!-- 审核失败 -->
    <van-popup v-model="failVisi" class="aurora-pop">
      <div class="aurora-area-15">
        <div class="aurora-pop-content">
          <i class="Icon-Loan iconexamine-error errorsize"></i>
          <p class="fs16 line20">很遗憾，审核未通过，订单被拒绝</p>
        </div>
        <button
          tag="button"
          class="aurora-btn-box aurora-btn-active"
          @click="failVisi = false">
          确定
        </button>
      </div>
    </van-popup>
    <!-- 立即还款 -->
    <van-popup
     v-model="showDelayVisi"
     class="dialog-delay-box">
     <header class="dialog-header">
       <span class="dialog-left-close">x</span>
       <span class="dialog-head">支付延期手续费</span>
     </header>
      <div class="aurora-dialog-content">
        <p class="obvious-text">333.00</p>
        <p class="text mar-bottom15">
          延期还款需先支付延期手续费，需要短信确认，验证码已发送至您手机{{phoneNum | mobileFilter}}
          {{`${countdown}`}}s
        </p>
        <van-password-input
          :value="verifyCode"
          :mask="false"
          @focus="showKeyboard = true"
        />
        <button class="aurora-btn-box aurora-btn-gray"
          :class="{'aurora-btn-active': verifyCode.length === 6}"
          @click="handleDelaySure">
          确认
        </button>
      </div>
     </van-popup>

    <!-- 数字键盘 -->
    <van-number-keyboard
      class="aurora-keyboard"
      :show="showKeyboard"
      @input="onInput"
      @delete="onDelete"
      close-button-text="完成"
      @blur="showKeyboard = false"
    />
  </section>
</template>

<script>
import { myHeader } from 'components/index';
import { orderstatusMatch } from 'utils/match';
import { Row, Col, PasswordInput, NumberKeyboard, Popup, Dialog, Toast } from 'vant';
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
    [Toast.name]: Toast
  },
  data () {
    return {
      failVisi: false,
      show: true,
      orderstatusMatch,
      orderInfo: {
        // orderStatus:"1",
        // paybackAmount:1000,
        // overdueDay:10,
        // repayDate:'2019-05-20',
        // deadline:1

      },
      showDelayVisi: false,
      verifyCode: '',
      showKeyboard: false,
      examineVisi: true,
      countdown: 60
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
      this.mesCode = (this.mesCode + value).slice(0, 6);
    },
    onDelete () {
      this.mesCode = this.mesCode.slice(0, this.mesCode.length - 1);
    },
    handleDelaySure (bool) {
      if (bool) {
        Dialog.alert({
          title: '延期手续费支付成功',
          message: `延期至：2019年10月10号 ，请于延期时间按时还款，以免影响征信。谢谢`
        }).then(() => {
          this.showDelayVisi = false;
        });
      } else {
        Dialog.alert({
          title: '延期手续费支付失败',
          message: `该银行卡余额不足`
        }).then(() => {
          this.showDelayVisi = false;
        });
      }
    }
  },
  mounted () {
    this.fetchLoanInfo();
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
  font-size 16px

.aurora-dialog-content
  padding 15px 12px
  .obvious-text
    text-align center
    font-size 18px
    line-height 2
  .text
    line-height 1.5
    color #999
</style>

<style lang="stylus">
.dialog-delay-box
  width 90%
  top 40%
  .dialog-header
    position relative
    padding 12px
    text-align center
    font-size 14px
.aurora-keyboard
  z-index 2006!important
</style>
