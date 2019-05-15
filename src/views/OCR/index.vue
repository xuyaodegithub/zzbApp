<template>
  <section>
    <myHeader title="身份证识别">
      <router-link
       slot="textright"
       :to="{name: 'UserCenter'}">我的
      </router-link>
    </myHeader>
    <div class="aurora-box-top Id-box">
      <div class="card-box mar-bt20">
        <van-uploader :after-read="onReadFaceFile" accept="image/*" class="upload-box">
          <div class="ID-icon" v-if="!facePicUrl">
            <template v-if="faceLoading">
              <van-loading color="white" class="display-line" />
              <p class="fs14 line20">正在上传...</p>
            </template>
            <template v-else>
              <i class="Icon-Loan iconID-cardpositive icon-idcard"></i>
              <p class="fs14">上传 正面(卡面完整，字体清晰)</p>
            </template>
          </div>
          <img class="auro-upload-img" :src="facePicUrl" width="100%" v-else/>
        </van-uploader>
      </div>
      <div class="card-box">
        <van-uploader :after-read="onReadBackFile" accept="image/*" class="upload-box">
          <div class="ID-icon" v-if="!backPicUrl">
            <template v-if="backLoading">
              <van-loading color="white" class="display-line" />
              <p class="fs14 line20">正在上传...</p>
            </template>
            <template v-else>
              <i class="Icon-Loan iconID-cardnegative icon-idcard"></i>
              <p class="fs14">上传 反面(卡面完整，字体清晰)</p>
            </template>
          </div>
          <img class="auro-upload-img" :src="backPicUrl" width="100%" v-else/>
        </van-uploader>
      </div>

      <button class="aurora-btn-box aurora-btn-gray "
        :disabled="!isActive || alreadyClick"
        :class="{'aurora-btn-active': isActive}"
        @click="handerUpload">下一步
      </button>
    </div>
    <div class="load-box" v-if="showloadVisi">
      <van-loading v-show="showloadVisi"/>
      <p>正在进行身份验证...</p>
    </div>

    <!-- 拍摄提醒 -->
    <van-popup v-model="cameraShow" class="aurora-pop van-dialog" :close-on-click-overlay="false">
      <div class="van-dialog__header">证件拍摄须知</div>
      <div class="van-dialog__content">
        <div class="van-dialog__message van-dialog__message--has-title notice-container">
          <div class="notice-box">
            <p class="title">边角完整</p>
            <p class="content">确认证件完全处于图片内</p>
          </div>
          <div class="notice-box">
            <p class="title">字体清晰</p>
            <p class="content">保证精准对焦，使证件上文字和照片清晰可见</p>
          </div>
          <div class="notice-box">
            <p class="title">亮度均匀</p>
            <p class="content">避免图片出现遮挡光线、反光等情况</p>
          </div>
        </div>
      </div>
      <div class="van-hairline--top van-dialog__footer">
        <button class="van-button van-button--default van-button--large van-dialog__confirm"
          @click="cameraShow = false">
          <span class="van-button__text">确认</span>
        </button>
      </div>
    </van-popup>

  </section>
</template>

<script>
import { myHeader } from 'components/index';
import { Uploader, Popup, Button, Toast, Loading, Dialog } from 'vant';
import HtmlImageCompress from 'html-image-compress';
import { handleOcrPrepare, handleOcrResult } from 'apis/index';
import { RESULTSUCCESS } from 'utils/match';

const formdata = new FormData();
export default {
  components: {
    myHeader,
    [Uploader.name]: Uploader,
    [Popup.name]: Popup,
    [Button.name]: Button,
    [Toast.name]: Toast,
    [Loading.name]: Loading,
    [Dialog.name]: Dialog
  },
  computed: {
    productId () {
      return this.$route.query.productId;
    },
    isActive () {
      return this.facePicUrl && this.backPicUrl;
    },
    isLoad () {
      return this.countdown > 0;
    }
  },
  data () {
    return {
      RESULTSUCCESS,
      showloadVisi: false,
      facePicUrl: '',
      backPicUrl: '',
      alreadyClick: false,
      faceLoading: false,
      backLoading: false,
      cameraShow: false,
      timeouter: null
    };
  },
  methods: {
    // 超时请求验证
    handleTimeout (delay = 30000) {
      let self = this;
      this.timeouter = setTimeout(() => {
        self.faceLoading = false;
        self.backLoading = false;
        self.showloadVisi = false;
      }, delay);
    },
    clearTimer () {
      clearTimeout(this.timeouter);
      this.timeouter = null;
    },
    // 上传凭证
    onReadFaceFile (fileObj) {
      this.facePicUrl = '';
      this.faceLoading = true;
      let vm = this;
      let size = fileObj.file.size / 1024;
      let quality = 0.7;
      if (size > 2048) {
        quality = 0.1;
      } else if (size > 1024) {
        quality = 0.2;
      } else if (size > 200) {
        quality = 0.3;
      } else {
        quality = 1;
      }
      // 老是出错, 没办法了拿出绝招
      try {
        const htmlImageCompress = new HtmlImageCompress(fileObj.file, {quality});
        htmlImageCompress.then(rst => {
          this.fetchOcrPrepare('F', rst.file, 'faceLoading', rst.base64, 'facePicUrl');
        }).catch(err => {
          this.fetchOcrPrepare('F', fileObj.file, 'faceLoading', fileObj.content, 'facePicUrl');
          vm.$toast('服务器错误' || err);
        });
      } catch (err) {
        this.fetchOcrPrepare('F', fileObj.file, 'faceLoading', fileObj.content, 'facePicUrl');
      }
    },
    onReadBackFile (fileObj) {
      this.backPicUrl = '';
      this.backLoading = true;
      let vm = this;
      let size = fileObj.file.size / 1024;
      let quality = 0.7;
      if (size > 2048) {
        quality = 0.1;
      } else if (size > 1024) {
        quality = 0.2;
      } else if (size > 500) {
        quality = 0.3;
      } else {
        quality = 1;
      }
      try {
        const htmlImageCompress = new HtmlImageCompress(fileObj.file, {quality});
        htmlImageCompress.then(rst => {
          this.fetchOcrPrepare('B', rst.file, 'backLoading', rst.base64, 'backPicUrl');
        }).catch(err => {
          this.fetchOcrPrepare('B', fileObj.file, 'backLoading', fileObj.content, 'backPicUrl');
          vm.$toast('服务器错误' || err);
        });
      } catch (err) {
        this.fetchOcrPrepare('B', fileObj.file, 'backLoading', fileObj.content, 'backPicUrl');
      }
    },
    // 后台检测身份证
    async fetchOcrPrepare (picType, file, loadtype, base64, picurl) {
      this.handleTimeout();
      formdata.set('productId', this.productId);
      formdata.set('picType', picType);
      formdata.set('picture', file);
      let res = await handleOcrPrepare(formdata);
      console.time('pic');
      if (res === 'networkdisconnect' || res === 'timeout') {
        console.log('超时');
        console.timeEnd('pic');
        this[loadtype] = false;
        this.clearTimer(this.timeouter);
        return;
      }
      if (!res.resultCode && !res.data.status) {
        console.log('图片验证成功');
        console.timeEnd('pic');
        this[picurl] = base64;
      } else {
        Toast(`${res.data.message || res.data.resultMessage} || `);
      }
      this[loadtype] = false;
      this.clearTimer(this.timeouter);
    },
    async handerUpload () {
      this.handleTimeout();
      this.showloadVisi = true;
      this.alreadyClick = true;
      let res = await handleOcrResult();
      if (res === 'networkdisconnect' || res === 'timeout') {
        this.showloadVisi = false;
        this.alreadyClick = false;
        this.clearTimer(this.timeouter);
        return;
      }
      if (!res.resultCode) {
        this.showloadVisi = false;
        this.alreadyClick = false;
        this.$router.push({name: 'PersonalInfo'});
      } else {
        this.facePicUrl = '';
        this.backPicUrl = '';
        this.showloadVisi = false;
        this.alreadyClick = false;
        Toast(`${res.resultMessage}`);
      }
      this.clearTimer(this.timeouter);
    }
  },
  mounted () {
  },
  beforeDestroy () {
    if (this.timeouter) {
      this.clearTimer(this.timeouter);
    };
  },
  filters: {
    IDnumberFilter (value) {
      let number = value + '';
      if (!number) return;
      let reg = /^(.{6})(.{8})(.{4})/g;
      let result = number.replace(reg, '$1  $2  $3');
      return result;
    }
  }
};
</script>

<style lang="stylus" scoped>
  section
    min-height 100%
  .Id-box
    box-sizing border-box
    padding 20px 5% 0
    // margin 0 auto 15px
    background #fbfbfb
    .card-box
      height 220px
      background #bfbfbf
      border-radius 6px
      text-align center
      overflow hidden
  .upload-box
    display flex
    justify-content center
    align-items center
    width 100%
    height 100%
    .auro-upload-img
      width 100%
      height 100%
  .mar-bt20
    margin-bottom 20px
  .ID-icon
    color #ffffff
    .icon-idcard
      font-size 40px
      line-height 1.2

  .pop-idnum
    font-size 20px
    line-height 2
  .user-name-box
    margin 10px 0
    .pop-username
      width 70px
      display inline-block
      border-bottom 1px solid #888
      text-align center
      font-size 16px
  .btn-pop-box
    padding 0 15px 15px
    &:last-child
      margin-top 10px
</style>
