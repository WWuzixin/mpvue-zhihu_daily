<template>
  <div class="container" @click="showZan = false, zanImg = '/static/img/zan.png'">
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
      <div class="arrow" @click.stop="updateNews">
        <img src="/static/img/arrow.png" alt="">
      </div>
      <div class="zan" :class="{ press_zan: showZan }" @click.stop="clickZan">
        <img :src="zanImg" alt="">
        <span class="zan-num">{{articleExtra.popularity}}</span>
        <div class="zan-mask" v-show="showZan">
          {{articleExtra.popularity}}
        </div>
      </div>
      <div class="message" @click.stop="commentHref">
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
      allId: [], // 该日期所有文章id
      index: '', // 当前文章index
      article: [], // 文章内容
      articleExtra: [], // 文章额外信息
      showZan: false, // 点赞效果
      imgHeiht: 400, // 图片高度
      zanImg: '/static/img/zan.png' // 点赞图片
    }
  },

  onLoad () {
    this.id = this.$root.$mp.query.id
    this.allId = this.$root.$mp.query.allId.split(',')
    this.index = this.$root.$mp.query.index
  },

  onShow () {
    this.getArticle(this.id)
    this.getArticleInfo(this.id)
  },

  methods: {
    // 文章内容
    getArticle (id) {
      wx.showLoading({
        mask: true
      })
      wx.request({
        url: 'https://news-at.zhihu.com/api/4/news/' + id,
        success: (res) => {
          if (res.statusCode === 200) {
            this.article = res.data
            wx.hideLoading()
          }
        }
      })
    },

    // 文章额外信息
    getArticleInfo (id) {
      wx.request({
        url: 'https://news-at.zhihu.com/api/4/story-extra/' + id,
        success: (res) => {
          if (res.statusCode === 200) {
            this.articleExtra = res.data
          }
        }
      })
    },

    // 评论页面跳转
    commentHref () {
      let url = '../comment/main?id=' + this.id + '&comment=' + this.articleExtra.comments
      this.showZan = false
      wx.navigateTo({ url })
    },

    // 点赞效果
    clickZan () {
      this.showZan = !this.showZan
      if (this.showZan === true) {
        this.zanImg = '/static/img/zan-press.png'
      } else {
        this.zanImg = '/static/img/zan.png'
      }
    },

    // 下篇文章
    updateNews () {
      let nextIndex = Number(this.index) + 1
      if (nextIndex >= this.allId.length) {
        wx.showModal({
          title: '温馨提示',
          content: '这是最后一篇啦，不要点啦！',
          showCancel: false,
          confirmText: '好啦',
          confirmColor: '#1da1f2'
        })
      } else {
        // 这里的空赋值是页面体验
        this.title = ''
        this.img = ''
        this.content = ''
        this.image_source = ''
        this.allId.forEach((item, key) => {
          if (key === nextIndex) {
            this.id = item
            this.index = key
          }
        })
        this.getArticle(this.id)
        this.getArticleInfo(this.id)
        wx.pageScrollTo({
          scrollTop: 0
        })
      }
    }
  },

  beforeDestroy () {
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
  margin-left: 104rpx;
  width: 80rpx;
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

.press_zan{
  color: #1da1f2
}

.message{
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  margin-right: 104rpx;
  padding-right: 10rpx;
  width: 80rpx;
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

.press_zan .zan-num{
  color: #1da1f2
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
