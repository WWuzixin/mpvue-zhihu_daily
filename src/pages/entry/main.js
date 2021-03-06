import Vue from 'vue'
import App from './entry'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    'navigationBarBackgroundColor': '#1da1f2',
    'navigationBarTitleText': '今日热闻',
    'navigationBarTextStyle': 'white',
    'disableScroll': false
  }
}
