import myHeader from './Header/index.vue';
import Collect from './Collect/index.vue';

const components = [
  myHeader,
  Collect
];

const install = function (Vue) {
  if (install.installed) return;
  components.map(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  myHeader,
  Collect
};
