import Vue from 'vue'
import App from './comment'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    'navigationBarBackgroundColor': '#1da1f2',
    'navigationBarTitleText': '评论',
    'navigationBarTextStyle': 'white',
    'disableScroll': false
  }
}
