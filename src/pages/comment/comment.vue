<template>
  <div class="container">
    <div class="long-wrap" :style="{height: maxHeight + 'px'}">
      <div class="title" v-show="longNum != 0">
        {{longNum}}条长评
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
      longContent: [], // 长评内容
      shortContent: [], // 短评内容
      maxHeight: '' // 屏幕高度
    }
  },

  beforeMount () {
    this.id = this.$root.$mp.query.id
    this.getLongComment()
    this.getShortComment()
    wx.getSystemInfo({
      success: (res) => {
        this.maxHeight = res.windowHeight
      }
    })
    let allComment = this.longNum + this.shortNum
    let title = allComment + '条评论'
    wx.setNavigationBarTitle({ title })
  },

  methods: {
    getLongComment () {
      wx.request({
        url: 'https://news-at.zhihu.com/api/4/story/' + this.id + '/long-comments',
        success: (res) => {
          if (res.statusCode === 200) {
            this.longNum = res.data.comments.length
            this.longContent = res.data.comments
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
            this.shortContent = res.data.comments
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
  border-bottom: 2rpx solid #999999;
}
</style>
