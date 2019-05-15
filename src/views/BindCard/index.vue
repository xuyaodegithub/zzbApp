<template>
  <section>
     <myHeader title="绑定银行卡">
      <router-link
       slot="textright"
       :to="{name: 'UserCenter'}">我的
      </router-link>
    </myHeader>
    <div class="aurora-box-top">
       <van-cell-group>
        <van-field
          class="aurora-input"
          v-model="username"
          label="姓名"
        />
        <van-field
          class="aurora-input"
          :value="idNum"
          label="身份证号"
        />
        <van-field
          ref='refBank'
          class="aurora-input"
          type="number"
          v-model="personal.bankNo"
          label="银行卡号"
          placeholder="请输入银行卡号"
        />
        <div class="input-box border-bt-1px">
          <van-field
            type="number"
            v-model="personal.mobile"
            :readonly="true"
            class="auro-input-box"
            maxlength="11">
            <van-button
              class="aurora-btn"
              slot="button"
              size="small"
              type="primary"
              :disabled="isSend || !ableMobile"
              @click="fetchpreBindCard"
            >
              {{isSend ? `${countdown}S` : '发送验证码'}}
            </van-button>
          </van-field>
        </div>
        <van-field
          class="aurora-input"
          type="number"
          v-model="personal.mesCode"
          label="验证码"
          placeholder="请输入验证码"
        />
       </van-cell-group>
    </div>
    <div class="aurora-area-15">
      <button class="aurora-btn-box aurora-btn-active" :disabled="alreadySubmit"
        @click="fetchConfirmCardMsg">提交
      </button>
    </div>
    <div class="notice-box">
      <p>1.请绑定本人名下的有效银行卡;</p>
      <p>2.请绑定银行预留手机号码为注册手机号码的银行卡;</p>
      <p>3.请绑定储蓄卡，不支持信用卡;</p>
    </div>
  </section>
</template>

<script>
import { myHeader } from 'components/index';
import { CellGroup, Cell, Field, NumberKeyboard, Button, Toast } from 'vant';
import { PHONE } from 'utils/regex.js';
import { preBindCard, confirmCardMsg, getUserInfo } from 'apis/index';
import { RESULTSUCCESS } from 'utils/match';
const COUNTTIME = 60;
export default {
  components: {
    myHeader,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Field.name]: Field,
    [NumberKeyboard.name]: NumberKeyboard,
    [Button.name]: Button,
    [Toast.name]: Toast
  },
  computed: {
    isSend () {
      return this.countdown < COUNTTIME;
    },
    ableMobile () {
      return this.PHONE.test(this.personal.mobile);
    }
  },
  data () {
    return {
      PHONE,
      RESULTSUCCESS,
      username: '',
      alreadySubmit: false,
      idNum: '',
      personal: {
        bankNo: '',
        mesCode: '',
        mobile: ''
      },
      keyboardShow: false,
      countdown: 60, // 倒计时
      timer: null
    };
  },
  methods: {
    // 个人信息
    async getUserInfo () {
      let res = await getUserInfo();
      if (!res.resultCode) {
        this.username = res.data.name;
        this.idNum = res.data.idCardNo;
        this.personal.mobile = res.data.phone;
      }
    },
    async fetchpreBindCard () {
      let bankNo = this.personal.bankNo.replace(/\s+/g, '');
      if (!bankNo) {
        Toast(`请输入银行卡号`);
        return;
      }
      let res = await preBindCard(
        bankNo,
        this.username,
        this.personal.mobile
      );
      if (!res.resultCode) {
        if (res.data.sendStatus === '1') {
          Toast('短信已发送');
          // 发送短信
          if (!this.timer) {
            this.timer = setInterval(() => {
              if (this.countdown > 0 && this.countdown <= COUNTTIME) {
                this.countdown--;
              } else {
                this.countdown = COUNTTIME;
                // this.isSend = false
                clearInterval(this.timer);
                this.timer = null;
              }
            }, 1000);
          }
        } else {
          Toast(`${res.data.sendMsg}`);
        }
      } else {
        Toast(`${res.resultMessage}`);
      }
    },
    async fetchConfirmCardMsg () {
      this.alreadySubmit = true;
      let bankNo = this.personal.bankNo.replace(/\s+/g, '');
      let res = await confirmCardMsg(
        this.personal.mesCode,
        bankNo,
        this.username,
        this.personal.mobile);
      if (!res.resultCode) {
        this.alreadySubmit = false;
        if (res.data.bindStatus) {
          Toast(`${res.data.bindMsg}`);
          this.$router.replace({name: 'Signing'});
        } else {
          Toast(`${res.data.bindMsg}`);
        }
      } else {
        this.alreadySubmit = false;
        Toast(`${res.resultMessage}`);
      }
    }
  },
  mounted () {
    this.getUserInfo();
  },
  watch: {
  }
};
</script>

<style lang="stylus" scoped>
  .notice-box
    padding 0 15px
    color #999
    line-height 1.5
</style>
