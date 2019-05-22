<template>
  <section class="delay">
    <myHeader :hasBack="hasback" title="我要延期">
      <!--<router-link :to="{name: 'UserCenter'}" slot="textright">我的-->
      <!--</router-link>-->
    </myHeader>
    <div class="aurora-box-top">
      <van-cell-group>
        <van-cell title="订单号" value="2333333" />
        <van-cell title="借款金额" value="500元"  />
        <van-cell title="延期至" value="2019年10月10号"  />
      </van-cell-group>
      <!--应还金额-->
        <div class="mar-bottomNone repayment-box">
          <p class="tilte">延期手续费({{paybackAmount}}元)</p>
          <div class="repayment-input-box">
            <!--  @focus="windowResize" @blur="windowResize" -->
            <input type="number" ref="repayAmoutRef" v-model="repayAmount" class="repayment-input"/>
          </div>
        </div>
        <div class="bank-box repayment-box">
          <p class="tilte downCard">使用以下银行卡还款</p>
          <!--<div class="bank-listSelecd">-->
            <!--<div class="bank-item" v-for="(bankItem, bankIndex) in banklist" :key="bankIndex" @click="handleCheck(bankIndex)">-->
              <!--<div class="left" :class="{'active' : bankIndex==activeIndex }"></div>-->
              <!--<div class="right">{{bankItem | bankFilter}}</div>-->
            <!--</div>-->
          <!--</div>-->
          <div
            class="bank-item"
            v-for="(bankItem, bankIndex) in banklist"
            :key="bankIndex"
            @click="handleCheck(bankIndex)">
            <div>
              <p class="bankname">{{bankItem.bankName ? 1 : '工商银行'}}</p>
              <span>
              {{bankItem}}
            </span>
            </div>
            <span :class="{'checked': activeIndex==bankIndex}"></span>
            <i class="van-icon van-icon-success bank-icon"></i>
          </div>
        </div>
        <div class="pay-btn">
          <div @click="handleDelay()">立即支付</div>
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
     <!--立即还款-->
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
    <!--        <p class="yan-Qi">延期至：2019年10月10号</p>-->
    <p class="text mar-bottom15">
    延期需要短信确认，验证码已发送至您手机{{phoneNum | mobileFilter}}
    </p>
    <van-password-input
    :value="verifyCode"
    :mask="true"
    @focus="showKeyboard = true"
    />
    <button class="aurora-btn-box aurora-btn-gray"
    :class="{'aurora-btn-active': verifyCode.length === 6 && countdown<=0}"
    @click="handleDelaySure(1)" :disabled="verifyCode.length<6 || countdown>0">
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
    :zIndex="9999"
    close-button-text="完成"
    @blur="showKeyboard = false"
    />

    <van-popup
    v-model="showSuccess"
    class="successP"
    :close-on-click-overlay="false"
    >
    <div class="successT">
    <van-icon :name="icon" size="46px" :color="iconColor"/>
    <p class="s-p">延期手续费支付{{sucOPrfail ? '成功' : '失败'}}</p>
    <p class="s-p-t">{{msgMess}}</p>
    <van-button :type="btnType" size="small" block class="btn" @click="showSuccess=false">确定</van-button>
    </div>
    </van-popup >
  </section>
</template>

<script>
  import { myHeader } from 'components/index';
  import { orderstatusMatch } from 'utils/match';
  import { PasswordInput, NumberKeyboard, Popup, Dialog, Toast, Icon, Button, Cell, CellGroup, RadioGroup, Radio } from 'vant';
  import { getOrderInfo, loanPostpone } from 'apis/index';
  import { getStore } from 'utils/storage.js';
  export default {
    components: {
      myHeader,
      [PasswordInput.name]: PasswordInput,
      [NumberKeyboard.name]: NumberKeyboard,
      [Popup.name]: Popup,
      [Dialog.name]: Dialog,
      [Toast.name]: Toast,
      [Icon.name]: Icon,
      [Button.name]: Button,
      [Cell.name]: Cell,
      [CellGroup.name]: CellGroup,
      [RadioGroup.name]: RadioGroup,
      [Radio.name]: Radio,
    },
    name:'delay.vue',
    data () {
      return {
        activeIndex:0,//默认第一张卡
        paybackAmount: '',//延期手续费
        banklist: ['12345678910121314','12345678910121314','12345678910121314','12345678910121314','12345678910121314',],//银行卡
        repayAmount: '',//输入框费用
        iconColor: '#07c160',
        btnType: 'primary',
        failVisi: false,
        showSuccess: false,
        icon: 'passed',
        sucOPrfail: true,
        msgMess: '延期至：2019年10月10号 ，请于延期时间按时还款，以免影响征信。谢谢！',
        show: true,
        orderstatusMatch,
        orderInfo: {

        },
        showDelayVisi: false,
        verifyCode: '',
        showKeyboard: false,
        examineVisi: true,
        countdown: 0
      };
    },
    computed: {
      orderNo () {
        return this.$route.params.orderNo;
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
      handleCheck (index) {
        this.activeIndex=index
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
        // this.setCountDown();
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
        let _self = this;
        this.countdown = 60;
        let timer = setInterval(() => {
          if (_self.countdown > 0) _self.countdown -= 1;
          else clearInterval(timer);
        }, 1000);
        if (bool) {
          // Dialog.alert({
          //   title: '延期手续费支付成功',
          //   message: `延期至：2019年10月10号 ，请于延期时间按时还款，以免影响征信。谢谢`
          // }).then(() => {
          // this.showDelayVisi = false;
          this.showSuccess = true;
          this.sucOPrfail = true;
          this.icon = 'passed';
          this.iconColor = '#07c160';
          this.btnType = 'primary';
          this.msgMess = '延期至：2019年10月10号 ，请于延期时间按时还款，以免影响征信。谢谢！';
          // });
        } else {
          // Dialog.alert({
          //   title: '延期手续费支付失败',
          //   message: `该银行卡余额不足`
          // }).then(() => {
          //   this.showDelayVisi = false;
          // });
          this.iconColor = '#f44';
          this.btnType = 'danger';
          this.showSuccess = true;
          this.sucOPrfail = false;
          this.msgMess = '该银行卡余额不足';
          this.icon = 'close';
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
    background-color #ffffff
  .aurora-box-top
    padding0 15px 15px 15px
    .pay-btn
      width 100%
      padding 15px
      position fixed
      color #ffffff
      left 0
      bottom 0
      text-align center
      font-size 16px
      line-height 42px
      z-index 99
    .pay-btn div
      background-color #e81f1f
  .aurora-box-top
    font-size 14px
    color #333333
  .repayment-box
    background #fff
    padding 15px
  .bank-box
    padding-bottom 75px
  .tilte
    color #555555
    font-size 16px
  .downCard
    margin-bottom 30px
  .repayment-input-box
    margin 20px 15px 0
    border-bottom 2px solid #eeeeee
    .repayment-input
      font-size 35px
      line-height 1.5
      width 100%
      text-align center
  .bank-item
    position relative
    display flex
    justify-content space-between
    align-items center
    background #f13c38
    margin-top 12px
    padding 15px
    font-size 16px
    border-radius 4px
    color #fff
    .bankname
      line-height 1.5
    .bank-icon
      position absolute
      bottom 2px
      right 2px
      font-size 16px
      color #e81f1f
      z-index 9
  .checked
    content ''
    position absolute
    border 15px solid #fff
    border-left 15px solid transparent
    border-top 15px solid transparent
    bottom 1px
    right 1px
    z-index 1
    border-bottom-right-radius 4px

  /* background-color rgba(242, 242, 242, 1)*/
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
    z-index 9999!important
  .successP
    width 80%
    border-radius 15px
  & .btn
    height 40px
  .successT
    padding 28px 25px 25px
    text-align center
    color #999
    font-size 14px
    line-height 18px
  & p.s-p
    margin 15px
  & p.s-p-t
    margin-bottom 20px
  .order-detail-box .i-to
    font-size 13px
    color #169BD5
    text-align center
    padding-top 10px

</style>
