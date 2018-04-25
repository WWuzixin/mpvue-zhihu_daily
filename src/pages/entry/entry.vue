<template>
  <div class="container">
    <swiper class="top-story" autoplay="true" circular="true" indicator-dots="true" indicator-color="rgba(0,0,0,.3)" interval="4000" duration="500" indicator-active-color="#ffffff">
      <swiper-item v-for="item in topStory" :data-id="item.id" @click="newsHref">
        <div class="item-wrap" :style="{backgroundImage: 'url('+item.image+')'}">
          <p class="top-title">{{item.title}}</p>
        </div>
      </swiper-item>
    </swiper>

    <div class="content" @touchstart="touchS" @touchmove="touchM"  @touchend="touchE">
      <div class="item-news" v-for="(item,index) in content" :data-id="item.id" :data-index="index" @click="newsHref">
        <div class="left-text">
          {{item.title}}
        </div>
        <div class="right-img">
          <img :src="item.images[0]" alt="">
        </div>
      </div>
    </div>
    <div class="loading" v-show="showLoading">
      ~~~~~~~~~~~~~
    </div>
  </div>
</template>

<script>
import card from '@/components/card'
export default {
  components: {
    card
  },
  data () {
    return {
      topStory: [], // 轮播图
      content: [], // 内容
      date: '000000',  // 时间，类似页码
      startY: '', // 拖动初始高度
      moveY: '', // 拖动距离
      endY: '',  // 拖动结束距离
      showLoading: false
    }
  },

  created () {
    // 获取轮播图
    this.getTop()
  },

  methods: {
    getTop () {
      wx.request({
        url: 'https://news-at.zhihu.com/api/4/news/latest',
        success: (res) => {
          if (res.statusCode === 200) {
            this.topStory = res.data.top_stories
            this.date = res.data.date
            this.content = res.data.stories
          }
        }
      })
    },

    // 新闻页面跳转
    newsHref (e) {
      let id = e.currentTarget.dataset.id
      let prevIndex = e.currentTarget.dataset.index - 1
      let nextIndex = e.currentTarget.dataset.index + 1
      let prevId = prevIndex > 0 ? this.content[prevIndex].id : 0 // 0即当前文章是最新的文章
      let nextId = nextIndex < this.content.length ? this.content[nextIndex].id : id // id即当前文章是最后的文章
      let url = '../article/main?id=' + id + '&prevId=' + prevId + '&nextId=' + nextId
      wx.navigateTo({ url })
    },

    touchS (e) {
      this.startY = e.pageY
    },

    touchM (e) {
      this.endY = e.pageY
      if (this.startY - e.pageY > 100) {
        this.showLoading = true
      } else {
        this.showLoading = false
      }
    },

    touchE (e) {
      if (this.startY - this.endY > 100) {
        this.showLoading = true
      } else {
        this.showLoading = false
      }
    }
  }
}
</script>

<style scoped>
.container{
  padding: 0;
}

.top-story{
  width: 100%;
  height: 400rpx;
}

.item-wrap{
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: 100%;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column-reverse;
}

.top-title{
  font-size: 36rpx;
  color: #ffffff;
  font-weight: 500;
  padding: 0 24rpx;
  margin-bottom: 40rpx;
}

.content{
  width: 100%;
}

.item-news{
  padding: 24rpx 0;
  margin: 0 24rpx;
  display: flex;
  justify-content: space-between;;
  align-items: center;
  border-bottom: 2rpx solid #e5e7e8;
}

.left-text{
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
  width: 500rpx;
  height: 120rpx;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.right-img{
  width: 150rpx;
  height: 120rpx;
}

.right-img img{
  width: 100%;
  height: 100%;
}
</style>
