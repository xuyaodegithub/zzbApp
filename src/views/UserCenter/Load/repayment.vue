<template>
  <section>
    <myHeader title="立即还款">
      <router-link
       slot="textright"
       :to="{name: 'UserCenter'}">我的
      </router-link>
    </myHeader>
    <div class="aurora-box-top ">
      <div class="mar-bottom15 repayment-box">
        <p class="tilte">应还金额({{paybackAmount}}元)</p>
        <div class="repayment-input-box">
          <!--  @focus="windowResize" @blur="windowResize" -->
          <input type="number" ref="repayAmoutRef" v-model="repayAmount" class="repayment-input"/>
        </div>
      </div>
      <div class="bank-box repayment-box">
        <p class="tilte">使用以下银行卡还款</p>
        <!-- :class="{'checked': checklist[bankIndex]}" -->
        <div
          class="bank-item"
          v-for="(bankItem, bankIndex) in banklist"
          :key="bankIndex"
          @click="handleCheck(bankIndex)">
          <div>
            <p class="bankname">{{bankItem.bankName}}</p>
              <span>
              {{bankItem.cardNo}}
            </span>
          </div>
          <span :class="{'checked': checklist[bankIndex]}"></span>
          <i class="van-icon van-icon-success bank-icon"></i>
        </div>
      </div>
    </div>
    <div class="aurora-area-15 mar-top-50">
      <button
        :disabled="alreadyPay"
        class="aurora-btn-box aurora-btn-unuse"
        :class="{'aurora-btn-active': canRepay}"
        @click="immeRepay">立即还款
      </button>
    </div>
    <van-popup class="aurora-full-pop" v-model="passwordVisi">
      <div class="aurora-pop dialog-password">
        <div class="aurora-pop-title border-bt-1px">
          <span>请输入验证码</span>
        </div>
        <span class="dialog-left-close van-icon van-icon-close" @click="passwordVisi = false"></span>
        <div class="aurora-dialog-content">
          <p class="text">还款需要短信确认，验证码已发送至您手机{{phoneNum | mobileFilter}}</p>
          <input type="text" class="validate-input" ref="validateRef" v-model="validateCode">
          <button class="aurora-btn-box aurora-btn-gray "
            :disabled="!isActive || alreadyClick"
            :class="{'aurora-btn-active': isActive}"
            @click="handleRepaymentSure">
            确认
          </button>
        </div>
      </div>
    </van-popup>
    <!-- 提交验证码之后返回结果 -->
    <van-popup v-model="resultVisi" class="aurora-pop" :close-on-click-overlay="false">
      <div class="aurora-area-15">
        <div class="aurora-pop-content">
          <i class="Icon-Loan popiconsize"
          :class="{'iconfail': !resultObj.playSatus, 'iconsuccess': resultObj.playSatus}"></i>
          <p class="info-text">{{resultObj.message}}</p>
        </div>
        <router-link
          tag="button"
          class="aurora-btn-box aurora-btn-active"
          :to="{name: 'Home'}"
          style="margin-top: 0;"
          @click.native="resultVisi = false">
          确定
        </router-link>
      </div>
    </van-popup>
    <van-popup v-model="showloadVisi" class="aurora-pop repay-load-box" :close-on-click-overlay="false">
        <van-loading v-show="showloadVisi"/>
        <p>订单正在处理中，请耐心等待...</p>
    </van-popup>
  </section>
</template>

<script>
import { myHeader } from 'components/index';
import { Dialog, PasswordInput, NumberKeyboard, Popup, Toast, Loading } from 'vant';
import { getBankList, handleRepayMes, getRepayment, getOrderInfo } from 'apis/index';
import { RESULTSUCCESS } from 'utils/match';
import { getStore } from 'utils/storage.js';
export default {
  components: {
    myHeader,
    [Dialog.name]: Dialog,
    [Toast.name]: Toast,
    [Popup.name]: Popup,
    [PasswordInput.name]: PasswordInput,
    [NumberKeyboard.name]: NumberKeyboard,
    [Loading.name]: Loading
  },
  computed: {
    orderId () {
      return this.$route.params.orderId;
    },
    selectCardIndex () {
      return this.checklist.indexOf(true);
    },
    phoneNum () {
      return getStore('phoneNum');
    },
    paybackAmountParam () {
      return this.$route.params.paybackAmount;
    },
    canRepay () {
      return +this.repayAmount > 0 && +this.repayAmount <= +this.paybackAmount;
    },
    isActive () {
      return /\d{6}/.test(this.validateCode);
    }
  },
  data () {
    return {
      RESULTSUCCESS,
      resultVisi: false,
      resultObj: {},
      showloadVisi: false,
      paybackAmount: '',
      repayAmount: +this.$route.params.paybackAmount,
      passwordVisi: false,
      validateCode: '',
      showKeyboard: false,
      payorderId: '',
      checklist: [true, false],
      banklist: [],
      cardNo: '',
      cardIdx: '',
      alreadyPay: false, // 立即还款是否点击过
      alreadyClick: false, // 确认还款是否点击过
      docmHeight: document.documentElement.clientHeight,
      showHeight: document.documentElement.clientHeight,
      isResize: false
    };
  },
  methods: {
    windowResize () {
      this.showHeight = document.documentElement.clientHeight;
      if (this.showHeight < this.docmHeight) {
        this.isResize = true;
      } else {
        this.isResize = false;
      }
    },
    // 获取还款信息
    async fetchRepayInfo () {
      let res = await getOrderInfo(this.orderId);
      if (!res.resultCode) {
        this.paybackAmount = res.data.paybackAmount;
      }
    },
    // 获取银行卡列表
    async fetchBankList () {
      let res = await getBankList();
      if (!res.resultCode) {
        this.banklist = res.data.bankCards;
        let len = this.banklist.length;
        this.checklist = new Array(len).fill(false);
        this.checklist[0] = true;
      }
    },
    // 立即还款
    async fetchRepayment () {
      this.alreadyPay = true;
      let cardIdx = this.banklist[this.selectCardIndex]['cardIdx'];
      let cardNo = this.banklist[this.selectCardIndex]['cardNo'];
      let res = await handleRepayMes(
        this.repayAmount,
        cardNo,
        cardIdx,
        this.orderId
      );
      if (!res.resultCode) {
        this.alreadyPay = false;
        let _this = this;
        this.payorderId = res.data.payorderId;
        this.passwordVisi = true;
        this.$nextTick(() => {
          _this.$refs.validateRef.focus();
        });
      } else {
        this.alreadyPay = false;
        Toast(`${res.resultMessage}`);
        this.passwordVisi = false;
      }
    },
    // 确认还款
    async handleRepaymentSure () {
      this.showloadVisi = true;
      this.alreadyClick = true;
      let res = await getRepayment(this.validateCode, this.payorderId);
      if (!res.resultCode) {
        this.showloadVisi = false;
        this.alreadyClick = false;
        this.passwordVisi = false;
        this.resultObj = res.data;
        this.resultVisi = true;
      } else {
        this.showloadVisi = false;
        this.alreadyClick = false;
        this.validateCode = '';
        Toast(`${res.resultMessage}`);
      }
    },
    handleCheck (index) {
      this.checklist = new Array(this.checklist.length).fill(false);
      this.checklist[index] = true;
    },
    immeRepay () {
      if (!this.canRepay) {
        Toast('金额不能大于还款金额，且不能为0');
        // this.repayAmount = this.$route.params.paybackAmount
        this.$refs.repayAmoutRef.focus();
        return;
      }
      this.fetchRepayment();
    }
  },
  mounted () {
    this.fetchRepayInfo();
    this.fetchBankList();
  },
  watch: {
    passwordVisi (newVal) {
      if (!newVal) {
        this.validateCode = '';
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
  section
    min-height 100%
.repay-load-box
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0,0,0,0.5);
  color: #fff;
  text-align: center;
.repayment-box
  background #fff
  padding 15px
  .tilte
    color #555555
    font-size 16px
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
  background #e81f1f
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
.dialog-left-close
  position absolute
  left 12px
  top 8px
  color #999
  font-size 20px
.validate-input
  position relative
  width 120px
  border none
  border-bottom 1px solid #797979
  padding 15px 0 10px
  text-align center
  margin-top 15px
  font-size 18px
.aurora-dialog-content
  padding 15px 12px
  .text
    line-height 2
.info-text
  margin-top 10px
  font-size 20px
.popiconsize
  font-size 30px
  color #e81f1f
  font-size 50px
  line-height 50px
.mar-top-50
  /*margin-top 50px*/
  position fixed
  bottom 0
  left 0
  width 100%
</style>
<style lang="stylus">
.dialog-password
  top 40%
  left 50%
  padding-bottom 10px
  position: fixed;
  transform: translate(-50%, -58%);
  .van-button
    width 90%
    margin-left 5%
    background #ff0000
    display inline-block
    color #fff
.aurora-full-pop
  width 100%
  height 100vh
  background transparent!important
  overflow hidden
</style>
<style lang="stylus">
.repay-load-box
  .van-loading
    display inline-block
    margin-bottom 10px
</style>
