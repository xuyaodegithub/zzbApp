const sendCodeMixin = {
  data () {
    return {
      countdown: 5, // 倒计时
      timer: null
    };
  },
  computed: {
    isSend () {
      if (this.countdown < 5) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    sendCode (mobile) {
      let regTest = this.PHONE.test(mobile);
      if (!regTest) {
        this.$toast('请输入正确格式的手机号');
        return;
      }
      // 发送短信
      if (!this.timer) {
        this.timer = setInterval(() => {
          console.log(this.countdown > 0 && this.countdown <= 5);
          if (this.countdown > 0 && this.countdown <= 5) {
            // this.isSend = true
            this.countdown--;
          } else {
            this.countdown = 5;
            // this.isSend = false
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    }
  }
};

export { sendCodeMixin };
