<template>
<div class="container">
  <div class="long-wrap" :style="{minHeight: maxHeight + 'px'}">
    <div class="title" v-show="longNum != 0">
      {{longNum}}条长评
    </div> <!-- title -->
    <div class="comment-wrap">
      <div class="item-wrap" v-for="item in longComments">
        <div class="item-avatar">
          <img :src="item.avatar" alt="用户头像">
        </div> <!-- item-avatar -->
        <div class="item-content">
          <div class="item-content-top">
            <p class="item-author">{{item.author}}</p>
            <div class="zan" v-show="false"></div>
          </div> <!-- item-content-top -->

          <div class="item-content-center">
            {{item.content}}
          </div> <!-- item-content-center -->

          <div class="item-content-bottom" v-if="item.reply_to">
            <span class="reply-author">//{{item.reply_to.author}}：</span>
            <span class="reply-content">{{item.reply_to.content}}</span>
          </div> <!-- item-content-bottom -->

        </div> <!-- item-content -->

        <div class="item-time">
          <p>{{item.time}}</p>
          <p class="see-more" v-if="item.reply_to">展开</p>
        </div> <!-- item-time -->
      </div> <!-- item-wrap -->
    </div> <!-- comment-wrap -->


  </div> <!-- long-wrap -->

  <div class="short-wrap">
    <div class="short-title" v-show="shortNum != 0">
      {{shortNum}}条短评
      <p @click="clickShow" class="icon-comments" :style="{transform: 'rotate('+rotate+'deg)'}">
        <img src="/static/img/comments.png" alt="">
      </p>
    </div> <!-- title -->
    <div class="comment-wrap" v-show="showShort">
      <div class="item-wrap" v-for="item in shortComments">
        <div class="item-avatar">
          <img :src="item.avatar" alt="用户头像">
        </div> <!-- item-avatar -->
        <div class="item-content">
          <div class="item-content-top">
            <p class="item-author">{{item.author}}</p>
            <div class="zan" v-show="false"></div>
          </div> <!-- item-content-top -->

          <div class="item-content-center">
            {{item.content}}
          </div> <!-- item-content-center -->

          <div class="item-content-bottom" v-if="item.reply_to">
            <span class="reply-author">//{{item.reply_to.author}}：</span>
            <span class="reply-content">{{item.reply_to.content}}</span>
          </div> <!-- item-content-bottom -->

        </div> <!-- item-content -->

        <div class="item-time">
          <p>{{item.time}}</p>
          <p class="see-more" v-if="item.reply_to">展开</p>
        </div> <!-- item-time -->
      </div> <!-- item-wrap -->
    </div> <!-- comment-wrap -->
  </div> <!-- short-wrap -->
</div> <!-- container -->
</template>

<script>
export default {
  data () {
    return {
      id: '', // 文章id
      longNum: 0, // 长评数量
      shortNum: 0, // 短评数量
      longComments: [], // 长评内容
      shortComments: [], // 短评内容
      maxHeight: '', // 屏幕高度
      rotate: 90, // 短片图片旋转样式
      showShort: false, // 显示短评
      scrollTop: 0 // 显示短评滚动距离
    }
  },

  beforeMount () {
    this.id = this.$root.$mp.query.id
    let title = this.$root.$mp.query.comment + '条评论'
    wx.setNavigationBarTitle({
      title
    })
    this.getLongComment()
    this.getShortComment()
    wx.getSystemInfo({
      success: (res) => {
        this.maxHeight = res.windowHeight
      }
    })
  },

  updated () {
    wx.createSelectorQuery().select('.long-wrap').boundingClientRect((rect) => {
      this.scrollTop = rect.height
    }).exec()
  },

  methods: {
    getLongComment () {
      wx.request({
        url: 'https://news-at.zhihu.com/api/4/story/' + this.id + '/long-comments',
        success: (res) => {
          if (res.statusCode === 200) {
            this.longNum = res.data.comments.length
            res.data.comments.forEach((item, key) => {
              res.data.comments[key].time = this.getTime(item.time)
            })
            this.longComments = res.data.comments
          }
        }
      })
    },

    getShortComment () {
      wx.request({
        url: 'https://news-at.zhihu.com/api/4/story/' + this.id + '/short-comments',
        success: (res) => {
          if (res.statusCode === 200) {
            this.shortNum = res.data.comments.length
            this.shortComments = res.data.comments
          }
        }
      })
    },

    // 时间转码
    getTime (times) {
      let date = new Date(times)
      let month = date.getMonth() + 1
      let day = date.getDate()
      let hour = date.getHours()
      let minute = date.getMinutes()
      return `${month}-${day} ${hour}:${minute}`
    },

    // 显示短评内容
    clickShow () {
      this.showShort = !this.showShort
      if (this.showShort) {
        this.rotate = 270
      } else {
        this.rotate = 90
      }
    }
  },

  onUnload () {
    this.showShort = false
    this.rotate = 90
  }
}
</script>

<style scoped>
.container {
  padding: 0;
}

.long-wrap, .short-wrap{
  width: 100%;
}

.title {
  padding: 0 24rpx;
  height: 60rpx;
  color: #333333;
  font-weight: 600;
  font-size: 30rpx;
  line-height: 60rpx;
  border-bottom: 2rpx solid #e5e7e8;
}

.short-title{
  padding: 0 24rpx;
  height: 70rpx;
  border-top: 2rpx solid #999999;
  color: #333333;
  font-weight: 600;
  font-size: 30rpx;
  border-bottom: 2rpx solid #e5e7e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-wrap {
  width: 100%;
  background: #ffffff;
}

.item-wrap {
  padding: 24rpx;
  border-bottom: 2rpx solid #e5e7e8;
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
}

.item-avatar {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  overflow: hidden;
}

.item-avatar img {
  width: 100%;
  height: 100%;
}

.item-content {
  width: 620rpx;
  margin-left: 24rpx;
}

.item-content-top {
  width: 100%;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.item-author {
  font-size: 28rpx;
  color: #333333;
  font-weight: 600
}

.item-content-center {
  font-size: 28rpx;
  color: #666666;
}

.item-content-bottom {
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  color: #999999;
}

.reply-author {
  font-size: 28rpx;
  color: #333333;
  font-weight: 600;
}

.reply-content {
  font-size: 28rpx;
  color: #999999;
}

.item-time{
  width: 620rpx;
  margin-left: 70rpx;
  font-size: 24rpx;
  color: #999999;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.see-more{
  width: 90rpx;
  height: 45rpx;
  text-align: center;
  line-height: 45rpx;
  color: #666666;
  font-size: 30rpx;
  background-color: #dae3f2;
}

.icon-comments{
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  transition: all .3s
}

.icon-comments img{
  width: 100%;
  height: 100%;
}
</style>
