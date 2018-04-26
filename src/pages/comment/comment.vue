<template>
  <div class="container">
    <div class="long-wrap" :style="{minHeight: maxHeight + 'px'}">
      <div class="title" v-show="longNum != 0">
        {{longNum}}条长评
      </div>
      <div class="comment-wrap">
        <div class="item-wrap" v-for="item in longComments">
          <div class="item-avatar">
            <img :src="item.avatar" alt="用户头像">
          </div>
          <div class="item-content">
            <div class="item-content-top">
              <p class="item.author">{{item.author}}</p>
              <div class="zan" v-show="false"></div>
            </div>
            <div class="item-content-center">
              {{item.content}}
            </div>
            <div class="item-content-bottom">
              <p class="reply-author">//{{item.reply_to.author}}：</p>
              <p class="reply=content">{{item.reply_to.content}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
      maxHeight: '' // 屏幕高度
    }
  },

  beforeMount () {
    this.id = this.$root.$mp.query.id
    let title = this.$root.$mp.query.comment + '条评论'
    wx.setNavigationBarTitle({ title })
    this.getLongComment()
    this.getShortComment()
    wx.getSystemInfo({
      success: (res) => {
        this.maxHeight = res.windowHeight
      }
    })
  },

  methods: {
    getLongComment () {
      wx.request({
        url: 'https://news-at.zhihu.com/api/4/story/' + this.id + '/long-comments',
        success: (res) => {
          if (res.statusCode === 200) {
            this.longNum = res.data.comments.length
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
    }
  }

}
</script>

<style scoped>
.container{
  padding: 0;
}

.long-wrap{
  width: 100%;
}

.title{
  padding: 0 24rpx;
  height: 60rpx;
  color: #333333;
  font-weight: 600;
  font-size: 30rpx;
  line-height: 60rpx;
  border-bottom: 2rpx solid #e5e7e8;
}

.comment-wrap{
  width: 100%;
  background: #ffffff;
}

.item-wrap{
  padding: 24rpx;
  border-bottom: 2rpx solid #e5e7e8;
  display: flex;
  flex-flow: row;
}

.item-avatar{
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  overflow: hidden;
}

.item-avatar img{
  width: 100%;
  height: 100%;
}

.item-content{
  width: 450rpx;
  margin-left: 24rpx;
}

.item-content-top{
  width: 100%;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item.author{
  font-size: 28rpx;
  color: #333333;
  font-weight: 600
}

.item-content-center{
  font-size: 28rpx;
  color: #666666;
}

.item-content-bottom{
  display: flex;
  flex-flow: row;
}

.reply-author{
  font-size: 28rpx;
  color: #333333;
  font-weight: 600;
}

.reply-content{
  font-size: 28rpx;
  color: #999999;
}
</style>
