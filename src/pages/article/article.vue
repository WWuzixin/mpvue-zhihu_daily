<template>
  <div class="container" @touchstart="touchS" @touchmove="touchM" @touchend="touchE"
   :style="{animation: updateAnimation +'.5s 1'}">
    <div class="top-img" :style="{backgroundImage: 'url('+article.image+')', height: imgHeiht + 'rpx'}">
      <div class="item-wrap">
        <div class="image-source">
          图片：{{article.image_source}}
        </div>
        <div class="img-title">
          {{article.title}}
        </div>
      </div>
    </div>
    <div class="top-content">
      <wxParse :content="article.body" />
    </div>

    <div class="foot-nav">
      <div class="arrow" @click="updateNews">
        <img src="/static/img/arrow.png" alt="">
      </div>
      <div class="zan" @click="clickZan">
        <img src="/static/img/zan.png" alt="">
        <span class="zan-num">{{articleExtra.popularity}}</span>
        <div class="zan-mask" v-show="showZan">
          {{articleExtra.popularity}}
        </div>
      </div>
      <div class="message" @click="commentHref">
        <img src="/static/img/message.png" alt="">
        <span class="message-num">{{articleExtra.comments}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import wxParse from 'mpvue-wxparse'
export default {
  components: {
    wxParse
  },
  data () {
    return {
      id: '', // 文章id
      prevId: '', // 上一篇文章id
      nextId: '', // 下一篇文章id
      article: [], // 文章内容
      articleExtra: [], // 文章额外信息
      showZan: false, // 点赞效果
      imgHeiht: 400, // 图片高度
      updateAnimation: ''
    }
  },

  beforeMount () {
    this.id = this.$root.$mp.query.id
    this.prevId = this.$root.$mp.query.prevId
    this.getArticle(this.id)
    this.getArticleInfo()
  },
  onPullDownRefresh (e) {
    console.log(e)
  },
  methods: {
    // 文章内容
    getArticle (id) {
      wx.request({
        url: 'https://news-at.zhihu.com/api/4/news/' + id,
        success: (res) => {
          if (res.statusCode === 200) {
            this.article = res.data
          }
        }
      })
    },

    // 文章额外信息
    getArticleInfo () {
      wx.request({
        url: 'https://news-at.zhihu.com/api/4/story-extra/' + this.id,
        success: (res) => {
          if (res.statusCode === 200) {
            this.articleExtra = res.data
          }
        }
      })
    },

    // 评论页面跳转
    commentHref () {
      let url = '../comment/main?id=' + this.id
      this.showZan = false
      wx.navigateTo({ url })
    },

    // 点赞效果
    clickZan () {
      this.showZan = !this.showZan
    },

    // 下篇文章
    updateNews () {
      this.updateAnimation = 'updateNews'
    }
  },

  onUnload () {
    this.title = ''
    this.img = ''
    this.content = ''
    this.image_source = ''
  }
}
</script>

<style scoped>
.container{
  padding: 0;
  position: fixed;
  transition: all .3s;
}

@keyframes updateNews {
  0% {
    top: 0%;
  },
  100% {
    top: -100%;
  }
}

.top-img{
  width: 100%;
  height: 400rpx;
  background-position: center;
  background-size: 100%;
  background-repeat: no-repeat;
}

.item-wrap{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  color: #ffffff;
}

.image-source{
  font-size: 24rpx;
  text-align: right;
  padding: 0 24rpx;
  margin-bottom: 20rpx;
  background-color: rgba(0,0,0,.3)
}

.img-title{
  font-size: 36rpx;
  font-weight: 500;
  padding: 0 24rpx;
  background-color: rgba(0,0,0,.3)
}

.top-content{
  width: 94%;
  margin-bottom: 100rpx;
}

.foot-nav{
  width: 100%;
  height: 80rpx;
  position: fixed;
  bottom: 0;
  background-color: #ffffff;
  box-shadow: 0 -4rpx 4rpx rgba(0,0,0,.1);
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.arrow{
  display: flex;
  align-items: center;
  margin-left: 24rpx;
  width: 200rpx;
  height: 100%;
}

.zan{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180rpx;
  height: 100%;
  padding-right: 20rpx;
  position: relative;
}

.message{
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  margin-right: 24rpx;
  padding-right: 10rpx;
  width: 190rpx;
  position: relative;
}

.foot-nav img{
  width: 48rpx;
  height: 48rpx;
}

.zan-num{
  font-size: 20rpx;
  color: #cdcdcd;
  position: absolute;
  width: 40rpx;
  top: 0;
  right: 40rpx;
}

.message-num{
  font-size: 16rpx;
  color: #ffffff;
  background-color: #1da1f2;
  width: 40rpx;
  height: 20rpx;
  position: absolute;
  top: 0;
  right: -10rpx;
  text-align: center;
}

.zan-mask{
  position: absolute;
  width: 120rpx;
  height: 60rpx;
  font-size: 30rpx;
  color: #ffffff;
  background-color: #1da1f2;
  text-align:center;
  line-height:60rpx;
  border-radius:10rpx;
  transition: all .5s;
  animation: showZan .5s 1 forwards;
  z-index: -1;
}

@keyframes showZan {
  0% {
    top: 0rpx
  },
  100% {
    top:-80rpx;
  }
}
</style>
