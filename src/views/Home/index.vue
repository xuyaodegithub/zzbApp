<template>
  <section class="Top">
    <myHeader :hasBack="false" title="周转宝">
      <router-link
       slot="textright"
       :to="{name: 'UserCenter'}">我的
      </router-link>
    </myHeader>
    <div class="home-loan-top aurora-box-top">
      <div class="loan-money">
        <p class="title">借款金额(元)</p>
        {{currentProduct.loanAmount}}
      </div>
      <van-row type="flex" class="loan-info" justify="space-between" align="center">
        <van-col class="loan-info-item">
          <p class="loan-info-amount">{{currentProduct.payAmount}}元</p>
          <span class="loan-info-title">应还金额</span>
        </van-col>
        <van-col class="loan-info-item">
          <p class="loan-info-amount">{{currentProduct.fee}}元</p>
          <span class="loan-info-title">服务费</span>
        </van-col>
        <van-col class="loan-info-item">
          <p class="loan-info-amount">{{currentProduct.deadLine}}</p>
          <span class="loan-info-title">借款期限</span>
        </van-col>
      </van-row>
    </div>

    <p class="describe-text">秒到账，申请门槛低，零利息。</p>

    <section class="home-loan">
      <div class="home-loan-item van-hairline--bottom">
        <p class="title">选择金融产品</p>
        <ul class="home-loan-ul">
          <li
            class="home-loan-li"
            :class="{'home-loan-li-active': checkList[loanIndex], 'invalid': !loanItem.available}"
            v-for="(loanItem, loanIndex) in loanproductList"
            :key="loanIndex"
            @click="handleCheck(loanItem, loanIndex)">
            <span class="amount">{{loanItem.loanAmount}} 元</span>
            <p class="day">({{loanItem.deadLine}})</p>
            <span
              v-if="!loanItem.available"
              class="Icon-Loan iconinvalid loadinvalid"
            ></span>
          </li>
        </ul>
      </div>
    </section>
    <div class="aurora-area-15">
      <button class="aurora-btn-box aurora-btn-active"
        @click="applyLoan">申请借款
      </button>
    </div>
  </section>
</template>

<script>
import { myHeader } from 'components/index';
import { CellGroup, Cell, Row, Col, Dialog } from 'vant';
import { getUserInfo, getProductList } from 'apis/index';
import { RESULTSUCCESS } from 'utils/match';
import { setStore } from 'utils/storage.js';
export default {
  components: {
    myHeader,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Row.name]: Row,
    [Col.name]: Col,
    [Dialog.name]: Dialog
  },
  data () {
    return {
      RESULTSUCCESS,
      hasaArrears: false, // 是否有欠款
      authStatus: '0',
      loanproductList: [],
      currentProduct: {}, // 展示的产品信息
      loanOrderStatus: '', // 存在未还的订单 不允许申请
      checkList: []
    };
  },
  methods: {
    // 个人信息
    async getUserInfo () {
      let res = await getUserInfo();
      if (!res.resultCode) {
        this.authStatus = res.data.authStatus;
        this.$store.commit('AUTHSTATUS', res.data.authStatus);
      }
    },
    // 产品列表
    async fetchProductList () {
      let res = await getProductList();
      if (!res.resultCode) {
        this.loanOrderStatus = res.data.loanOrderStatus;
        this.loanproductList = res.data.productList;
        this._initCheckList();
      }
    },
    // 初始化选中列表 目前选中的对象
    _initCheckList () {
      let _list = this.loanproductList;
      let _arr = [];
      _list.map((item, index) => {
        item.defaultShow ? _arr.push(true) : _arr.push(false);
        if (item.defaultShow) {
          this.currentProduct = {...item};
        }
      });
      this.checkList = _arr;
    },
    applyLoan () {
      let canApply = [0, 4].includes(this.loanOrderStatus);
      let waitExam = [1, 2].includes(this.loanOrderStatus);
      if (canApply) {
        setStore('productId', this.currentProduct.productId);
        if (this.authStatus !== '0') {
          this.$router.push({name: 'PersonalInfo'});
        } else {
          this.$router.push({name: 'ID', query: {productId: this.currentProduct.productId}});
        }
        return;
      }
      if (waitExam) {
        Dialog.alert({
          message: '您已申请借款,请耐心等待!'
        }).then(() => {
          this.$router.push({name: 'LoadRecord'});
        });
        return;
      }
      if (this.loanOrderStatus === 3) {
        Dialog.confirm({
          message: '您还有未还款的订单，请先还款之后，再次申请借款。',
          confirmButtonText: '去还款',
          cancelButtonText: '我知道了'
        }).then(() => {
          this.$router.push({name: 'LoadRecord'});
        }).catch(() => {
        });
      }
    },
    handleCheck (item, index) {
      if (!item.available) return;
      this.currentProduct = {...item};
      let len = this.checkList && this.checkList.length;
      let _arr = new Array(len).fill(false);
      _arr[index] = true;
      this.checkList = _arr;
    }
  },
  mounted () {
    this.getUserInfo();
    // 获取产品信息
    this.fetchProductList();
  }
};
</script>

<style lang="stylus" scoped>
$red = #f13c38
$gray = #a5a3a3
  section.Top
    min-height 100%

.home-loan-top
    padding 25px 0
    background rgb(241,60,56)
    text-align center
    color #ffffff

    .loan-money
      margin-bottom 25px
      font-size 40px
      line-height 1.5
    .title
      font-size 14px
      line-height 20px

    .loan-info
      padding 0 25px
      line-height 20px
      &-item
        text-align center
        line-height 25px
      &-amount
        font-family PingFangSC-Medium
        font-size 18px
      &-title
        font-size 14px

  .describe-text
    color #333
    line-height 3
    text-align center
    background #fcfcfc
    font-size 14px

  .home-loan
    margin-bottom 10px
    &-item
      padding 15px
      .title
        font-size 14px
        margin-bottom 15px
    &-ul
      width 100%
      list-style-type none
      display flex
      flex-wrap wrap
      justify-content space-between
      padding 0 4%
      box-sizing border-box
    &-li
      position relative
      display inline-block
      border 2px solid $gray
      color $gray
      border-radius 4px
      padding-bottom 8px
      width 46%
      text-align center
      margin-bottom 10px
      box-sizing border-box
      &:nth-child(2n)
        margin-right 0
      .amount
        line-height 2
        font-size 20px
      .day
        font-size 14px
    &-li-active
      position relative
      border 2px solid $red
      color $red
      &:before
        position absolute
        bottom 0
        right 0
        font-family "vant-icon"
        content "\F0C1"
        font-size 14px
        color #ffffff
        z-index 3
      &:after
        position absolute
        bottom -1px
        right -1px
        content ""
        font-size 0
        border-color $red transparent
        border-width 0 0 28px 28px
        border-style solid
    .invalid
      border 2px solid $gray
      .amount
        line-height 2
        font-size 18px
        color $gray
      .day
        color $gray
        font-size 14px
    .loadinvalid
      font-size 48px
      position absolute
      right 0
      bottom 0
  .btn-apply
    width 96%
    margin-left 2%
</style>
