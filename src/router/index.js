import Vue from 'vue';
import Router from 'vue-router';

// const Login = r => require(['@/views/Login/index'], r);
// const Home = r => require(['@/views/Home/index'], r);
// const ID = r => require(['@/views/OCR/index'], r);
// const PersonalInfo = r => require(['@/views/PersonalInfo/index'], r);
// const BindCard = r => require(['@/views/BindCard/index'], r);
// const Signing = r => require(['@/views/Signing/index'], r);
// const UserCenter = r => require(['@/views/UserCenter/index'], r);
// const UserBindCard = r => require(['@/views/UserCenter/BindCard/index'], r);
// const Conact = r => require(['@/views/UserCenter/Conact/index'], r);
// const LoadRecord = r => require(['@/views/UserCenter/Load/index'], r);
// const LoadRecordDetail = r => require(['@/views/UserCenter/Load/detail'], r);
// const Repayment = r => require(['@/views/UserCenter/Load/repayment'], r);
// const Seting = r => require(['@/views/Seting/index'], r);

Vue.use(Router);

const myRouter = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import(/* webpackChunkName: "Home" */'@/views/Home/index')
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "Login" */'@/views/Login/index'),
      name: 'Login'
    },
    {
      path: '/idcard',
      component: () => import(/* webpackChunkName: "OCR" */'@/views/OCR/index'),
      name: 'ID'
    },
    {
      path: '/personalinfo',
      component: () => import(/* webpackChunkName: "PersonalInfo" */'@/views/PersonalInfo/index'),
      name: 'PersonalInfo'
    },
    {
      path: '/bindcard',
      component: () => import(/* webpackChunkName: "BindCard" */'@/views/BindCard/index'),
      name: 'BindCard'
    },
    {
      path: '/signing',
      component: () => import(/* webpackChunkName: "Signing" */'@/views/Signing/index'),
      name: 'Signing'
    },
    {
      path: '/usercenter',
      component: () => import(/* webpackChunkName: "UserCenter" */'@/views/UserCenter/index'),
      name: 'UserCenter'
    },
    {
      path: '/userbindcard',
      component: () => import(/* webpackChunkName: "BindCard" */'@/views/UserCenter/BindCard/index'),
      name: 'UserBindCard'
    },
    {
      path: '/conact',
      component: () => import(/* webpackChunkName: "Conact" */'@/views/UserCenter/Conact/index'),
      name: 'Conact'
    },
    {
      path: '/userload',
      component: () => import(/* webpackChunkName: "Load" */'@/views/UserCenter/Load/index'),
      name: 'LoadRecord'
    },
    {
      path: '/userloaddetail/:orderId',
      component: () => import(/* webpackChunkName: "Loaddetail" */'@/views/UserCenter/Load/detail'),
      name: 'LoadRecordDetail'
    },
    {
      path: '/repayment/:orderId/:paybackAmount',
      component: () => import(/* webpackChunkName: "repayment" */'@/views/UserCenter/Load/repayment'),
      name: 'Repayment'
    },
    {
      path: '/seting',
      component: () => import(/* webpackChunkName: "Seting" */'@/views/Seting/index'),
      name: 'Seting'
    },
    {
      path: '/updataCard',
      component: () => import(/* webpackChunkName: "Seting" */'@/views/UserCenter/updataCard/detail'),
      name: 'Seting'
    }
  ]
});

export default myRouter;
