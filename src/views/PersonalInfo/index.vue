<template>
  <section>
    <myHeader title="填写个人信息">
      <router-link
       slot="textright"
       :to="{name: 'UserCenter'}">我的
      </router-link>
    </myHeader>
    <div class="aurora-box-top">
      <van-cell-group>
        <van-field
          class="aurora-input"
          v-model="userInfo.name"
          label="姓名"
          :readonly="true"
        />
        <van-field
          class="aurora-input"
          :value="userInfo.idNum"
          label="身份证号"
          :readonly="true"
        />
        <van-cell
          class="aurora-cell"
          title="借款用途"
          is-link
          required
          arrow-direction="down"
          :value="personal.text || '请选择'"
          @click="showPicker('loanPurposeOps', 'usage')">
        </van-cell>
      </van-cell-group>

      <van-cell-group class="mar-top20">
        <van-field
          v-model="familyMember.name"
          class="aurora-input"
          label="直系亲属姓名"
          placeholder="请输入"
          required
        />
        <van-cell
          class="aurora-cell"
          title="关系"
          is-link
          arrow-direction="down"
          :value="familyMember.relationText || '请选择'"
          @click="showPicker('relativeTypes', 'family')"/>
        <van-field
          v-model="familyMember.contacts"
          class="aurora-input"
          label="手机号"
          placeholder="请输入"
          required
        />
      </van-cell-group>

      <van-cell-group class="mar-top20" v-for="(urgent, urgentInd) in urgentArr" :key="urgentInd">
        <van-field
         v-if="urgentInd === 0"
          v-model="urgent.name"
          class="aurora-input"
          label='紧急联系人1'
          required
        />
        <van-field
         v-else-if="urgentInd === 1"
          v-model="urgent.name"
          class="aurora-input"
          label='紧急联系人2'
          required
        />
        <van-cell
          class="aurora-cell"
          title="关系"
          is-link
          arrow-direction="down"
          :value="urgent.urgentUserText || '请选择'"
          @click="showPicker(`userTypes`, `urgent${urgentInd}`)"/>
        <van-field
          v-model="urgent.contacts"
          class="aurora-input"
          label="手机号"
          placeholder="请输入"
          required
        />
      </van-cell-group>
    </div>
    <div class="aurora-area-15">
      <button class="aurora-btn-box aurora-btn-active"
        @click="submitPersonForm">提交
      </button>
    </div>

    <van-popup v-model="showUsage" position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        :value-key="purpose"
        :visible-item-count="3"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>

    <van-popup v-model="examineVisi" class="aurora-pop">
      <div class="aurora-area-15">
        <div class="aurora-pop-content">
          <i class="Icon-Loan iconexamine-error errorsize"></i>
          <p class="fs16 line20">很遗憾，审核未通过，订单被拒绝</p>
        </div>
        <router-link
          tag="button"
          class="aurora-btn-box aurora-btn-active"
          :to="{name: 'Home'}"
          @click.native="examineVisi = false">
          确定
        </router-link>
      </div>
    </van-popup>
  </section>
</template>

<script>
import { myHeader } from 'components/index';
import { PHONE } from 'utils/regex';
import { CellGroup, Cell, Field, Picker, Popup, Loading, Toast } from 'vant';
import { setUserInfo, queryUserInfo, getUserInfo } from 'apis/index';
import { RESULTSUCCESS } from 'utils/match';
import { setStore } from 'utils/storage';

export default {
  components: {
    myHeader,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [Field.name]: Field,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [Loading.name]: Loading,
    [Toast.name]: Toast
  },
  computed: {
    query () {
      return this.$route.query;
    }
  },
  data () {
    return {
      purpose: 'type',
      RESULTSUCCESS,
      PHONE,
      loanPurposeOps: [], // 贷款用途
      relativeTypes: [], // 直系联系人关系数组
      userTypes: [], // 紧急联系人关系数组
      userInfo: {},
      personal: {
        text: '',
        value: ''
      },
      relatives: [], // 关系数组总和
      familyMember: {
        name: '',
        relationText: '',
        relativeType: 1,
        contacts: ''
      },
      urgentArr: [
        {
          name: '',
          urgentUserText: '',
          urgentUserType: 5,
          contacts: ''
        },
        {
          name: '',
          urgentUserText: '',
          urgentUserType: 5,
          contacts: ''
        }
      ],
      selectType: '',
      showUsage: false,
      columns: [],
      bankCardCount: 0, // 银行卡数量
      examineVisi: false
    };
  },
  methods: {
    onCancel () {
      this.showUsage = false;
    },
    onConfirm (obj, index) {
      let type = this.selectType;
      switch (type) {
        case 'usage':
          this.personal.text = obj.type;
          this.personal.value = obj.id;
          break;
        case 'family':
          this.familyMember.relationText = obj.type;
          this.familyMember.relativeType = obj.id;
          break;
        case 'urgent0':
          this.urgentArr[0].urgentUserText = obj.type;
          this.urgentArr[0].urgentUserType = obj.id;
          break;
        case 'urgent1':
          this.urgentArr[1].urgentUserText = obj.type;
          this.urgentArr[1].urgentUserType = obj.id;
          break;
        default:
          this.personal.usage = obj.type;
      }
      this.showUsage = false;
    },
    showPicker (columnsName, selectType) {
      this.selectType = selectType;
      this.showUsage = true;
      this.columns = this[`${columnsName}`];
    },

    checkMobile (value, message) {
      let flag = true;
      if (!PHONE.test(value)) {
        Toast(`${message}`);
        return false;
      }
      return flag;
    },
    // 验证是否含有空值
    paramsValidate (params, paramnull, message) {
      let flag = true;

      for (let key in params) {
        if (params[key] !== 0 && !params[key] && key !== paramnull && key !== 'userId') {
          Toast(`${message}`);
          return false;
        }
      }
      return flag;
    },
    // 提交
    submitPersonForm () {
      if (!this.userInfo.name ||
          !this.userInfo.idNum ||
          !this.personal.text) {
        Toast('请完善个人信息');
        return;
      }
      let familyhasNull = this.paramsValidate(this.familyMember, 'urgentUserType', '请完善直系亲属信息');
      if (!familyhasNull) return;
      let urgent1hasNull = this.paramsValidate(this.urgentArr[0], 'relativeType', '请完善紧急联系人信息');
      if (!urgent1hasNull) return;
      let urgent2hasNull = this.paramsValidate(this.urgentArr[1], 'relativeType', '请完善紧急联系人信息');
      if (!urgent2hasNull) return;
      // 手机号码验证
      let familyMob = this.checkMobile(this.familyMember.contacts, '直系亲属手机号输入有误');
      if (!familyMob) return;
      let urgent1Mob = this.checkMobile(this.urgentArr[0].contacts, '紧急联系人手机号输入有误');
      if (!urgent1Mob) return;
      let urgent2Mob = this.checkMobile(this.urgentArr[1].contacts, '紧急联系人手机号输入有误');
      if (!urgent2Mob) return;

      this.setUserInfo();
    },
    // 获取个人基本信息
    async fetchUserInfo () {
      let res = await queryUserInfo();
      if (!res.resultCode) {
        let data = res.data;
        this.userInfo = data.userInfo;
        this.loanPurposeOps = data.loanPurposeOps;
        this.relativeTypes = data.relativeTypes;
        this.userTypes = data.userTypes;
        this.relatives = data.relatives;
        this._initData();
      }
    },
    // 个人信息
    async getUserInfo () {
      let res = await getUserInfo();
      if (!res.resultCode) {
        this.bankCardCount = res.data.bankCardCount;
        this.$store.commit('AUTHSTATUS', res.data.ocrStatus);
      }
    },
    // 初始化数据
    _initData () {
      let userInfo = this.userInfo;
      let purposeOptions = this.loanPurposeOps;
      let relativeTypes = this.relativeTypes;
      let userTypes = this.userTypes;
      let urgentArr = [];
      this.personal.value = userInfo.loanPurpose;
      // 借款用途 获取文字
      if (!!this.personal.value) { // eslint-disable-line
        let purposeText = purposeOptions.filter((item) => {
          return item.id === this.personal.value;
        })[0]['type'];
        this.personal.text = purposeText;
      }
      if (this.relatives) {
        this.relatives.map((relItem, index) => {
          // 直系
          if (relItem.relativeType !== '0') {
            this.familyMember = relItem;
            this.familyMember['relationText'] = relativeTypes.filter((item) => {
              return item.id === relItem.relativeType;
            })[0]['type'];
          }

          if (relItem.urgentUserType !== '0') {
            relItem['urgentUserText'] = userTypes.filter((item) => {
              return item.id === relItem.urgentUserType;
            })[0]['type'];
            urgentArr.push(relItem);
          }
        });
        this.urgentArr = urgentArr.slice(0, 2);
      }
    },
    // 组合relativesparam
    _orgRelative () {
      let _family = {...this.familyMember};
      let urgentArr = [...this.urgentArr];
      delete _family.urgentUserType;
      urgentArr.map(item => {
        delete item.relativeType;
      });
      urgentArr.unshift(_family);
      this.relatives = urgentArr;
    },
    // 提交个人基本信息
    async setUserInfo () {
      this._orgRelative();
      // debugger
      let {idNum, name} = this.userInfo;
      // 本地存储 loanPurpose
      setStore('loanPurpose', this.personal.value);
      let res = await setUserInfo(
        idNum,
        name,
        this.personal.value,
        this.relatives
      );
      if (!res.resultCode) {
        // 判断银行卡数量
        if (this.bankCardCount) {
          this.$router.replace({name: 'Signing'}); // 签约页面
        } else {
          this.$router.replace({name: 'BindCard'}); // 绑卡页面
        }
      } else {
        Toast(`${res.resultMessage}`);
      }
    }
  },
  mounted () {
    this.fetchUserInfo();
    this.getUserInfo();
  }
};
</script>

<style lang="stylus" scoped>
  section
    min-height 100%
.input-date
  width 80px
  text-align center
  color #323233
</style>
