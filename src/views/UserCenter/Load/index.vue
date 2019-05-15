<template>
  <section>
    <myHeader title="我的贷款"/>
    <div class="aurora-box-top">
      <p class="no-content" v-if="!loanList.length">暂无数据~</p>
      <template v-else>
        <div class="order-list">
          <router-link
            class="order-item"
            tag="div"
            :to="{name: 'LoadRecordDetail', params: {orderId: loadItem.orderNo}}"
            v-for="(loadItem, loadIndex) in loanList"
            :key="loadIndex">
            <div class="border-bt-1px order-item-top">
              <span class="top-title">订单: {{loadItem.orderNo}}</span>
              <span class="colorred fr">
                {{orderstatusMatch[loadItem.orderStatus]}}
              </span>
            </div>
            <div class="order-item-content">
              <div class="order-item-info border-bt-1px">
                <div class="info-item txt-cent">
                  <span class="text">到账金额</span>
                  <p class="amount">{{loadItem.receivedAmount}}<span class="unit">元</span></p>
                </div>
                <div class="info-item txt-cent">
                  <span class="text">应还金额</span>
                  <p class="amount">{{loadItem.paybackAmount}}<span class="unit">元</span></p>
                </div>
                <div class="info-item txt-cent">
                  <span class="text">借款期限</span>
                  <p class="amount">{{loadItem.loanPeriod}} <span class="unit">天</span></p>
                </div>
              </div>
              <div class="detail-box" :class="{'border-bt-1px': isShowRepay(loadItem.orderStatus)}">
                <p class="detail-date">
                  <span class="title">申请日期: </span>
                  {{loadItem.applyTime}}
                </p>
                <p class="detail-date" v-if="loadItem.repayDate">
                  <span class="title">还款日: </span>
                  {{loadItem.repayDate}}
                </p>
                <p class="detail-date" v-if="loadItem.actualTime">
                  <span class="title">实际还款日期: </span>
                  {{loadItem.actualTime}}
                </p>
              </div>
              <div class="detail-box border-bt-1px line15" v-if="['9', '10'].includes(loadItem.orderStatus)">
                周转宝已关联<span class="colorred">央行征信系统、互联网金融黑名单和银行体系欺诈名单</span>，长时间逾期将影响你的个人信用，进一步影响你正常生活及工作。
              </div>
              <van-row
                class="loan-btn-box"
                type="flex"
                justify="end"
                v-if="isShowRepay(loadItem.orderStatus)">
                <van-col span="8">
                  <button
                   class="aurora-long-btn aurora-btn-active"
                   @click.stop="getLoanDetail(loadItem.orderNo, loadItem.paybackAmount)"
                  >
                    立即还款
                  </button>
                </van-col>
              </van-row>
            </div>
          </router-link>
        </div>
      </template>
    </div>
  </section>
</template>

<script>
import { myHeader } from 'components/index';
import { orderstatusMatch } from 'utils/match';
import { Row, Col, Button, Toast } from 'vant';
import { getLoanList } from 'apis/index';
export default {
  components: {
    myHeader,
    [Row.name]: Row,
    [Col.name]: Col,
    [Button.name]: Button,
    [Toast.name]: Toast
  },
  data () {
    return {
      orderstatusMatch,
      loanList: []
    };
  },
  methods: {
    // 获取贷款列表
    async fetchLoanInfo () {
      let res = await getLoanList();
      if (!res.resultCode) {
        this.loanList = res.data;
      } else {
        Toast(`${res.resultMessage}`);
      }
    },
    // 展示 立即还款按钮
    isShowRepay (num) {
      let whiteList = ['5', '6', '9', '10', '11'];
      return whiteList.includes(num);
    },
    getLoanDetail (orderNo, paybackAmount) {
      this.$router.push({name: 'Repayment', params: {orderId: orderNo, paybackAmount: paybackAmount}});
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
$red=#ff0000
.order-item
  background #fff
  margin-bottom 15px
  &-top
    padding 12px 15px
  .top-title
    color #999999
    font-size 14px

.order-item-content
  padding 0 12px
  .order-item-info
    display flex
    justify-content space-around
    padding 20px 0 10px
    .text
      color #999999
      font-size 14px
    .unit
      font-size 16px
    .amount
      font-size 20px
      line-height 2
      color $red
  .detail-box
    padding 12px 0 12px 10px
  .detail-date
    line-height 1.8
    color #999999
    font-size 14px
    // .title
    //   width 90px
    //   display inline-block
    // .ls1
    //   letter-spacing 5px
    // .ls2
    //   letter-spacing 5px
  .loan-btn-box
    padding 12px 0
</style>
