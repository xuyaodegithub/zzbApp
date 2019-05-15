import Vue from 'vue';
import Main from './main.vue';

// 构建函数, 组件模板
let ToastConstructor = Vue.extend(Main);
let instance;

let types = ['success', 'error'];

const ToastTest = function (option) {
  instance = new ToastConstructor({
    data: option
  });
  document.body.appendChild(instance.$mount().$el);
};

types.forEach(type => {
  console.log(ToastTest[type]);
  ToastTest[type] = options => {
    options.type = type;
    return ToastTest(options);
  };
});
export default ToastTest;
