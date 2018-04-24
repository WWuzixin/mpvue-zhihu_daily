import Vue from 'vue'
import App from './entry'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    'navigationBarBackgroundColor': '#4876FF',
    'navigationBarTitleText': '今日热闻',
    'navigationBarTextStyle': 'white',
    'disableScroll': false
  }
}
