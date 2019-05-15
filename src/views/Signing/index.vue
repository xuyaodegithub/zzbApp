<template>
  <section>
    <myHeader title="周转宝">
      <router-link
       slot="textright"
       :to="{name: 'UserCenter'}">我的
      </router-link>
    </myHeader>
    <div class="signing-box aurora-box-top">
      <div class="big-title">
        <h1 class="Icon-Loan iconqianyue icon-title"></h1>
        签约
      </div>
      <van-cell-group>
        <van-cell title="借款金额" :value="productInfo.loanAmount" />
        <van-cell title="服务费" :value="productInfo.serviceFee" />
        <van-cell title="还款金额" :value="productInfo.loanAmount" />
        <van-cell title="借款期限" :value="productInfo.loanPeriod" />
        <van-cell title="申请日期" :value="productInfo.applyTime" />
      </van-cell-group>
    </div>

    <div class="agreement-box">
      <h3 class="title">请确认您的借款金额后签约</h3>
      <van-row type="flex" class="mar-bottom15">
        <van-col span="2">
          <van-checkbox
            checked-color="#f13c38"
            class="btn-radio display-line fl"
            v-model="agreementArr[0]"/>
        </van-col>
        <van-col span="22" class="line20">
          本人承诺已认真阅读并将遵守
          <em class="colorblue" @click="readAgree('0')">《本金借款协议》</em>
          <em class="colorblue" @click="readAgree('1')">《贷款用户确认书》</em>
        </van-col>
      </van-row>
      <van-row type="flex" class="mar-bottom15">
        <van-col span="2">
          <van-checkbox checked-color="#f13c38" class="btn-checkbox display-line fl" v-model="agreementArr[1]"/>
        </van-col>
        <van-col span="22">
          本人同意平台获取第三方征信数据
        </van-col>
      </van-row>
      <p class="content mar-bottom15">
        本人自愿购买一下产品及服务，本人勾选同意的行为为本人自愿签订勾选的合同，本人已充分了解并完全理解本人勾选的全部合同条款以及合同条款的全部内容。本人一旦勾选并签订以下合同即意味着本人愿意承担一切法律后果。
      </p>
    </div>
    <div class="over-hidden">
      <van-row class="aurora-area-15" gutter="10">
        <van-col span="12">
          <button
            class="aurora-btn-box aurora-btn-gray"
            @click="cancelFn">取消订单
          </button>
        </van-col>
        <van-col span="12">
          <button
            :disabled="isAbleSign || alreadyClick"
            class="aurora-btn-box aurora-btn-unuse"
            :class="{'aurora-btn-active': !isAbleSign}"
            @click="fetchLoanPerform">签约
          </button>
        </van-col>
      </van-row>
    </div>
  </section>
</template>

<script>
import { myHeader } from 'components/index';
import { CellGroup, Cell, Button, Checkbox, Row, Col, Dialog, Toast } from 'vant';
import { loanPerform, loanPostDetail } from 'apis/index';
import { getStore } from 'utils/storage';
import { RESULTSUCCESS } from 'utils/match';
export default {
  components: {
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    [Row.name]: Row,
    [Col.name]: Col,
    [Dialog.name]: Dialog,
    [Toast.name]: Toast,
    myHeader
  },
  computed: {
    productId () {
      return getStore('productId');
    },
    loanPurpose () {
      return getStore('loanPurpose');
    },
    agreementTempId () {
      let agree = this.agreementInfo;
      let _arr = [];
      agree.map(item => {
        _arr.push(item.id);
      });
      return _arr;
    },
    isAbleSign () {
      return this.agreementArr.includes(false);
    },
    accountAmount () {
      let loanAmount = this.productInfo.loanAmount.substr(0, this.productInfo.loanAmount.length - 1);
      let serviceFee = this.productInfo.serviceFee.substr(0, this.productInfo.serviceFee.length - 1);
      return `${Math.round((loanAmount - serviceFee) * 100) / 100}元`;
    },
    uninque () {
      return new Date().getTime();
    }
  },
  data () {
    return {
      RESULTSUCCESS,
      alreadyClick: false,
      productInfo: {
        loanAmount: '',
        totalRepayAmt: '',
        serviceFee: '',
        loanPeriod: '',
        applyTime: ''
      },
      agreementArr: [false, false],
      agreementInfo: []
    };
  },
  methods: {
    // 获取下单信息
    async fetchLoanPostDetail () {
      let res = await loanPostDetail(this.productId);
      if (!res.resultCode) {
        this.agreementInfo = res.data.agreements;
        this.productInfo = res.data;
      }
    },
    // 已绑卡借款下单
    async fetchLoanPerform () {
      if (!this.productInfo.loanAmount) {
        Toast('未获取贷款信息，无法签约');
        return;
      }
      if (!this.agreementArr[0]) {
        Toast('请认真阅读并同意签约协议');
        return;
      }
      if (!this.agreementArr[1]) {
        Toast('请勾选同意平台获取第三方征信数据');
        return;
      }
      this.alreadyClick = true;
      let res = await loanPerform(this.agreementTempId, this.productId, this.loanPurpose, this.uninque);
      if (!res.resultCode) {
        this.orderNo = res.data.orderNo;
        this.$router.replace({name: 'LoadRecordDetail', params: {orderId: this.orderNo}, query: {hasBack: false}});
        this.alreadyClick = false;
      } else {
        this.alreadyClick = false;
        Toast(`${res.resultMessage}`);
      }
    },
    // 查看协议
    readAgree (index) {
      let agreementObj = this.agreementInfo[+index];
      Dialog.alert({
        title: `${agreementObj.name}`,
        messageAlign: 'left',
        closeOnClickOverlay: true,
        message: `${agreementObj.content}`
      });
    },
    cancelFn () {
      Dialog.confirm({
        message: '您是否要取消订单？',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$router.replace({name: 'Home'});
      }).catch(() => {
      });
    }
  },
  mounted () {
    this.fetchLoanPostDetail();
  }
};
</script>

<style lang="stylus" scoped>
.big-title
  padding 20px 0
  text-align center
  font-size 20px
  color #fff
  background #ff0000
  .icon-title
    font-size 60px
    line-height 70px

.agreement-box
  margin-top 15px
  background #fff
  padding 8px 12px
  .title
    line-height 3
    text-align center
  .content
    color #999
    line-height 21px

</style>
