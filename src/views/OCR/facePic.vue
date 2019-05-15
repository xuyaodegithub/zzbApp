<template>
  <section>
    <myHeader title="正面身份证识别">
      <router-link
       slot="textright"
       :to="{name: 'UserCenter'}">我的</router-link>
    </myHeader>
    <div class="aurora-box-top Id-box">
      <div class="card-box">
        <van-uploader :after-read="onReadFaceFile" accept="image/*" class="upload-box">
          <div class="ID-icon" v-if="!facePicUrl">
            <div class="mask"></div>
            <div class="icon-box">
              <van-loading color="white" v-if="faceLoading" />
              <template v-else>
                <i class="Icon-Loan iconID-cardpositive icon-idcard"></i>
                <p class="fs14">请上传正面身份证</p>
              </template>
            </div>
          </div>
          <img class="auro-upload-img" :src="facePicUrl" width="100%" v-else/>
        </van-uploader>
      </div>
      <button class="aurora-btn-box aurora-btn-gray "
      :disabled="!isActive || alreadyClick"
      :class="{'aurora-btn-active': facePicUrl}"
       @click="handerUpload">下一步</button>
    </div>
    <div class="load-box" v-if="showloadVisi">
      <van-loading v-show="showloadVisi"/>
      <p>正在进行身份验证...</p>
    </div>
  </section>
</template>

<script>
import { myHeader } from 'components/index';
import { Uploader, Popup, Button, Toast, Loading } from 'vant';
import HtmlImageCompress from 'html-image-compress';
import { handleIdentityScan } from 'apis/index';
import { RESULTSUCCESS } from 'utils/match';
const formdata = new FormData();
export default {
  components: {
    myHeader,
    [Uploader.name]: Uploader,
    [Popup.name]: Popup,
    [Button.name]: Button,
    [Toast.name]: Toast,
    [Loading.name]: Loading
  },
  computed: {
    productId () {
      return this.$route.query.productId;
    },
    isActive () {
      return this.facePicUrl;
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
      personalVisi: false,
      isLoading: false,
      alreadyClick: false,
      faceLoading: false
    };
  },
  methods: {
    // 上传凭证
    onReadFaceFile (fileObj) {
      // console.time('face')
      this.faceLoading = true;
      let vm = this;
      let size = fileObj.file.size / 1024;
      console.log(size);
      let quality = 0.7;
      if (size > 2048) {
        quality = 0.1;
      } else if (size > 1024) {
        quality = 0.2;
      } else if (size > 500) {
        quality = 0.3;
      } else {
        quality = 0.5;
      }
      const htmlImageCompress = new HtmlImageCompress(fileObj.file, {quality});
      htmlImageCompress.then(rst => {
        // console.timeEnd('face')
        this[`facePicUrl`] = rst.base64;
        this.faceLoading = false;
        formdata.set('picture', rst.file);
        console.log(rst.file.size / 1024);
      }).catch(err => {
        vm.$toast('服务器错误' || err);
      });
    },
    async handerUpload () {
      this.showloadVisi = true;
      this.alreadyClick = true;
      formdata.set('productId', this.productId);
      formdata.set('picType', 'F');
      let res = await handleIdentityScan(formdata);
      if (res === 'networkdisconnect' || res === 'timeout') {
        this.showloadVisi = false;
        this.alreadyClick = false;
        return;
      }
      if (!res.resultCode) {
        this.showloadVisi = false;
        this.$router.push({name: 'BACKPIC', query: {productId: this.productId}});
        this.alreadyClick = false;
      } else {
        this.showloadVisi = false;
        this.alreadyClick = false;
        Toast(`${res.resultMessage}`);
      }
      // this.personalVisi = true
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
      height calc(100vh - 250px)
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
    background-image url('./img/face.png')
    background-repeat no-repeat
    text-align center
    background-position 50%
    .auro-upload-img
      width 100%
      height 100%
  .mar-bt20
    margin-bottom 20px
  .ID-icon
    color #ffffff
    width 100%
    height 100%
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
