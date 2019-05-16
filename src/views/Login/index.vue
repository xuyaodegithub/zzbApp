<template>
  <section>
    <myHeader :hasBack="false" title="登录"/>
    <div class="login-box">
      <div class="logo-img-box">
        <img class="logo-img" src="../../assets/image/logo.png" alt="">
      </div>
      <div>
        <div class="input-box">
          <van-field
            v-model="loginForm.mobile"
            placeholder="请输入手机号"
            class="auro-input-box"
            maxlength="11"
            clearable
            autofocus>
            <!-- <span slot="label" class="iconfont icon-user">
            </span> -->
          </van-field>
        </div>
        <div class="input-box">
          <van-field
           type="number"
           v-model="loginForm.mescode"
           placeholder="请输入验证码"
           clearable
           class="auro-input-box"
           maxlength="10">
            <van-button
              class="aurora-btn"
              slot="button"
              size="small"
              type="primary"
              :disabled="isSend || !ableMobile || alreadyClick"
              @click="sendCode"
              >
              {{isSend ? `${countdown}S` : '发送验证码'}}
              </van-button>
          </van-field>
        </div>
      </div>
      <!-- <span class="color999 fr">忘记密码</span> -->
      <!-- <p class="login-text">
        登录即表示您同意<span class="colorblue" @click="readAgree">《周转宝服务协议》</span>
      </p> -->
      <button class="aurora-btn-box aurora-btn-gray"
        :class="{'aurora-btn-active': canActive}"
        :disabled="isablelogin && !canActive"
        @click="handleLoginIn">登录
      </button>
    </div>
  </section>
</template>

<script>
import { myHeader } from 'components/index';
import { Toast, Button, Field, Dialog } from 'vant';
import { setCookie, setStore, getStore } from 'utils/storage.js';
import { PHONE } from 'utils/regex.js';
import { RESULTSUCCESS } from 'utils/match';
import { loginIn, sendMsg } from 'apis/index';
const COUNTTIME = 60;
export default {
  components: {
    myHeader,
    [Toast.name]: Toast,
    [Button.name]: Button,
    [Field.name]: Field,
    [Dialog.name]: Dialog
  },
  data () {
    return {
      RESULTSUCCESS,
      PHONE,
      countdown: 60, // 倒计时
      timer: null,
      isablelogin: true,
      alreadyClick: false, // 点击发送验证码
      loginForm: {
        mobile: '',
        mescode: ''
      }
    };
  },
  computed: {
    ableMobile () {
      return this.PHONE.test(this.loginForm.mobile);
    },
    canActive () {
      return this.loginForm.mobile && this.loginForm.mescode.length >= 6;
    },
    isSend () {
      return this.countdown < COUNTTIME;
    }
  },
  methods: {
    async handleLoginIn () {
      this.isablelogin = false;
      if (!this.canActive) return;
      let res = await loginIn(this.loginForm.mobile, this.loginForm.mescode);
      if (!res.resultCode) {
        this.isablelogin = true;
        this.$router.push({name: 'Home'});
        setCookie('Token', res.data.token);
        setStore('name', res.data.name);
        setStore('phoneNum', this.loginForm.mobile);
      } else {
        this.isablelogin = true;
        Toast(`${res.resultMessage}`);
      }
    },
    readAgree () {
      Dialog.alert({
        title: `${this.agreementObj.name}`,
        messageAlign: 'left',
        closeOnClickOverlay: true,
        message: `${this.agreementObj.conent}`
      });
    },

    getCookieMob () {
      let phoneNum = getStore('phoneNum');
      this.loginForm['mobile'] = phoneNum || this.loginForm.mobile;
    },
    async sendCode () {
      let mobileval = this.loginForm.mobile;
      let regTest = this.PHONE.test(mobileval);
      if (!regTest) {
        Toast('请输入正确格式的手机号');
        return;
      }
      this.alreadyClick = true;
      let res = await sendMsg(this.loginForm.mobile);
      if (!res.resultCode) {
        this.alreadyClick = false;
        Toast(`已发送短信`);
        // 发送短信
        if (!this.timer) {
          this.timer = setInterval(() => {
            if (this.countdown > 0 && this.countdown <= COUNTTIME) {
              this.countdown--;
            } else {
              this.countdown = COUNTTIME;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000);
        }
      } else {
        this.alreadyClick = false;
        Toast(`${res.resultMessage}`);
      }
    }
  },
  mounted () {
    this.getCookieMob();
  }
};
</script>

<style lang="stylus" scoped>
  section
    height 100%
    display flex
    flex-direction column
  .login-box
    display flex
    flex-direction column
    padding 5px 38px 0
    flex 1
    /*padding 55px 38px 0*/
    /*height 100vh*/
    background #fff
    box-sizing border-box

  .logo-img-box
    margin 100px 0 100px
    text-align center
    .logo-img
      display inline-block
      // width 60px
      height 40px

  .input-box
    margin-bottom 20px
    display flex
    justify-content flex-start
    align-items center
    border-bottom 1px solid #ECECEC

    &:last-child
      margin-bottom 10px

    .input-style
      // border-bottom 1px solid #d6d6d6
      padding 10px 0
      font-size 14px
      flex 1
      color #222
      // margin-bottom 20px
      padding-left 10px

    .input-btn-getcode
      margin-bottom 12px
      display inline-block
      width 80px
      height 30px
      line-height 30px
      background #F7B62D
      border-radius 19px
      color #fff
      text-align center
      font-size 12px

  .login-text
    height 18px
    font-size 13px
    line-height 18px
    overflow hidden

</style>
