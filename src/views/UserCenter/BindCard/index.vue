<template>
  <section>
    <myHeader title="绑定银行卡"/>
    <div class="aurora-box-top">
      <div class="no-card" v-if="!(banklist && banklist.length)">
        <i class="Icon-Loan iconbankcard icon-size"></i>
        <p class="text">还未绑定银行卡</p>
      </div>
      <template v-else>
        <div class="bank-card-box aurora-content-area" v-for="(bankItem, bankIndex) in banklist" :key="bankIndex">
          <div class="bank-item">
            <div class="bank-info">
              <img class="bank-img" :src="bankItem.logo" alt="" @error="catchErrorImage($event)">
<!--              <div class="bank-text">-->
<!--                <p class="name">{{bankItem.bankName}}</p>-->
<!--                &lt;!&ndash; <span class="type">银行储蓄卡</span> &ndash;&gt;-->
<!--              </div>-->
            </div>
            <div class="bank-num">
<!--              {{bankItem.cardNo | bankFilter}}-->
                  {{bankItem.bankName}}（尾号 {{bankItem.cardNo | bankFilter}}）
            </div>
          </div>
        </div>
      </template>
      <div class="addBtn">
        <div class="btnSon" @click="bindNewCard()">+银行卡</div>
      </div>
    </div>
  </section>
</template>

<script>
import { myHeader } from 'components/index';
import { RESULTSUCCESS } from 'utils/match';
import { getBankList } from 'apis/index';
import { Toast } from 'vant';
export default {
  components: {
    myHeader,
    [Toast.name]: Toast
  },
  data () {
    return {
      RESULTSUCCESS,
      banklist: [
        { bankName: '杭州银行', cardNo: '123456789101111156', logo:'' },
        { bankName: '杭州银行', cardNo: '123456789101111164', logo:'' },
      ]
    };
  },
  methods: {
    catchErrorImage (e) {
      e.target.src = require('img/logo.png');
    },
    // 获取银行卡列表
    async fetchBankList () {
      let res = await getBankList();
      if (!res.resultCode) {
        this.banklist = res.data.bankCards;
        let len = this.banklist.length;
        this.checklist = new Array(len).fill(false);
        this.checklist[0] = true;
      } else {
        Toast(`${res.resultMessage}`);
      }
    },
    bindNewCard () {
      this.$router.push('/bindcard');
    }
  },
  mounted () {
    // this.fetchBankList();
  }
};
</script>

<style lang="stylus" scoped>
  section
    min-height 100%
.no-card
  padding 30px 0 20px
  color #999
  text-align center
  .icon-size
    font-size 45px
  .text
    font-size 14px
    line-height 2

.bank-item
  background #ffffff
  border-radius 7px
  box-shadow 0 5px 0 #e6e6e6
  /*padding-bottom 20px*/
  padding 30px
  .bank-info
    display flex
    justify-content flex-start
    align-item center
    /*padding 12px 20px*/
  .bank-img
    display block
    width 45px
    height 45px
    border-radius 50%
    /*margin-right 12px*/
    margin 0 auto
    background #fff
  .bank-text
    color #fff
    .name
      font-size 18px
      line-height 3
    .type
      font-size 12px
      line-height 20px
  .bank-num
    padding 20px 0
    text-align center
    color #333333
    font-size 16px
    background #fff
.addBtn
    position fixed
    left 0
    width 100%
    bottom 50px
    font-size 14px
    color #ffffff
    text-align center
    line-height 50px
  .btnSon
    width 90%
    background-color  #1989fa
    margin 0 auto
    border-radius 6px
</style>
