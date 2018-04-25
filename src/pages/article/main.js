import Vue from 'vue'
import App from './article'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    'navigationBarBackgroundColor': '#1da1f2',
    'navigationBarTitleText': '新闻详知',
    'navigationBarTextStyle': 'white',
    'disableScroll': false,
    'enablePullDownRefresh': true
  }
}
