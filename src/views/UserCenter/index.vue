<template>
  <section>
    <myHeader title="我的">
      <router-link
       slot="textright"
       :to="{name: 'Home'}">首页</router-link>
    </myHeader>
    <div class="aurora-box-top">
      <div class="usercenter-top mar-bottom15">
        <div class="info">
          <p class="username">{{userInfo.name}} ({{userInfo.phone}}) </p>
          <span class="tag"> {{userInfo.grade}}</span>
        </div>
        <!-- <van-icon name="arrow" /> -->
      </div>

      <div class="userloan-box mar-bottom15">
        <div class="amount-box txt-cent">
          <p class="amount">{{userInfo.repaidAmount}} <span class="unit">元</span></p>
          <span class="text">待还款金额</span>
        </div>
        <div class="loan-number-box">
          <div class="number-item txt-cent">
            <p>{{userInfo.loanCount}}<span class="unit">笔</span></p>
            <span class="text">借款成功笔数</span>
          </div>
          <div class="number-item txt-cent">
            <p>{{userInfo.overdueCount}}<span class="unit">笔</span></p>
            <span class="text">逾期笔数</span>
          </div>
        </div>
      </div>

      <van-cell-group class="usercenter-list">
        <van-cell is-link :to="{name: 'LoadRecord'}">
          <template slot="title">
            <i class="Icon-Loan iconrecord user-icon"></i>
            <span class="custom-text">我的贷款</span>
          </template>
        </van-cell>
        <van-cell is-link :to="{name: 'UserBindCard'}">
          <template slot="title">
            <i class="Icon-Loan iconbankcard user-icon"></i>
            <span class="custom-text">绑定银行卡</span>
          </template>
        </van-cell>
        <router-link tag="div" to="/conact" class="van-cell van-cell--clickable">
          <div class="van-cell__title">
            <i class="Icon-Loan iconconact user-icon"></i>
            <span class="custom-text">联系客服</span>
          </div>
          <i data-v-485764bd="" class="van-icon van-icon-arrow van-cell__right-icon"></i>
        </router-link>
      </van-cell-group>
    </div>
  </section>
</template>

<script>
import { myHeader } from 'components/index';
import { Icon, CellGroup, Cell } from 'vant';
import { getUserHomeInfo } from 'apis/index';
import { RESULTSUCCESS } from 'utils/match';
export default {
  components: {
    myHeader,
    [Icon.name]: Icon,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell
  },
  data () {
    return {
      RESULTSUCCESS,
      userInfo: {}
    };
  },
  methods: {
    // 个人信息
    async getUserHomeInfo () {
      let res = await getUserHomeInfo();
      if (!res.resultCode) {
        this.userInfo = res.data;
      }
    }
  },
  mounted () {
    this.getUserHomeInfo();
  }
};
</script>

<style lang="stylus" scoped>
  section
    min-height 100%
.usercenter-top
  display flex
  justify-content space-between
  align-items center
  padding 30px 25px
  background #fff
  .username
    font-size 16px
    line-height 2
    margin-bottom 5px
  .tag
    border 1px solid rgb(241,60,56)
    color rgb(241,60,56)
    border-radius 4px
    padding 0 4px
    line-height 1.5

.userloan-box
  padding 30px 15px 15px
  background #ffffff
  .amount
    font-size 20px
    line-height 2
  .text
    color #999999
    font-size 12px
.unit
  font-size 16px
.loan-number-box
  margin-top 30px
  display flex
  justify-content space-around
  .number-item
    flex 1
    position relative
    &:not(:last-child):after
      content ''
      position absolute
      display inline-block
      height 80%
      width 1Px
      background #e0e0e0
      right 0
      top 10%
    p
      font-size 18px
      line-height 2

.usercenter-list
  .user-icon
    font-size 24px
    padding-right 10px
    color rgb(241,60,56)
    vertical-align middle
  .custom-text
    font-size 16px
    vertical-align middle
</style>
