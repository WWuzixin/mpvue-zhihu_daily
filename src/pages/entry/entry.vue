<template>
  <div class="container" @touchstart="touchS" @touchmove="touchM"  @touchend="touchE">
    <div class="updateing" v-show="updateing">
      请放手，我在聚集能量呢
    </div>
    <swiper class="top-story" autoplay="true" circular="true" indicator-dots="true" indicator-color="rgba(0,0,0,.3)" interval="4000" duration="500" indicator-active-color="#ffffff">
      <swiper-item v-for="(item,index) in topStory" :data-id="item.id" @click="newsHref">
        <div class="item-wrap" :style="{backgroundImage: 'url('+item.image+')'}">
          <p class="top-title">{{item.title}}</p>
        </div>
      </swiper-item>
    </swiper>
    <div class="time-wrap">{{dateTime}}</div>
    <div class="content">
      <div class="item-news" v-for="item in content" :data-id="item.id" :data-index="index" @click="newsHref">
        <div class="left-text">
          {{item.title}}
        </div>
        <div class="right-img">
          <img :src="item.images[0]" alt="">
        </div>
      </div>
    </div>

    <div class="loading" v-show="showLoading">
      请放手，我要释放之前的能量了！
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
      beforeDate: '000000', // 历史时间
      startY: '', // 拖动初始高度
      moveY: '', // 拖动距离
      endY: '',  // 拖动结束距离
      showLoading: false,
      updateing: false,
      dateTime: '' // 日期显示
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
            this.beforeDate = res.data.date
            this.content = res.data.stories
            this.getWeek(res.data.date)
          }
        }
      })
    },

    // 新闻页面跳转
    newsHref (e) {
      let id = e.currentTarget.dataset.id // 当前id
      let index = e.currentTarget.dataset.index // 当前index
      let allId = this.content.map(item => {
        let arr = []
        arr.push(item.id)
        return arr
      })
      let url = '../article/main?id=' + id + '&index=' + index + '&allId=' + allId
      wx.navigateTo({ url })
    },

    touchS (e) {
      this.startY = e.pageY
    },

    touchM (e) {
      if (this.startY - e.pageY > 150) {
        this.showLoading = true
      } else if (e.pageY - this.startY > 150) {
        this.updateing = true
      } else {
        this.showLoading = false
        this.updateing = false
      }
    },

    touchE (e) {
      console.log(e)
      let endY = e.mp.changedTouches[0].pageY
      if (this.startY - endY > 150) {
        this.showLoading = false
        this.getBeforeNews(this.beforeDate)
      } else if (endY - this.startY > 150) {
        this.updateing = false
        this.getTop()
      }
    },

    // 获取旧内容
    getBeforeNews (beforeDate) {
      let date = Number(beforeDate) - 1
      this.getWeek(date)
      this.beforeDate = date
      // https://news-at.zhihu.com/api/4/news/before/
      wx.request({
        url: 'https://news-at.zhihu.com/api/4/news/before/' + date,
        success: (res) => {
          this.content = res.data.stories
          wx.pageScrollTo({
            scrollTop: 0
          })
        }
      })
    },

    // 时间转换
    getWeek (date) {
      date = String(date)
      let time = `${date[0]}${date[1]}${date[2]}${date[3]}-${date[4]}${date[5]}-${date[6]}${date[7]}`
      let day = new Date(time).getDay()
      var week = ['日', '一', '二', '三', '四', '五', '六']
      for (let i = 0; i < week.length; i++) {
        if (i === day) {
          this.dateTime = `${date[4]}${date[5]}-${date[6]}${date[7]} 星期${week[i]}`
        }
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

.time-wrap{
  width: 100%;
  height: 70rpx;
  text-align: center;
  line-height: 70rpx;
  color: #ffffff;
  font-size: 28rpx;
  font-weight: 600;
  background-color: #1da1f2
}

.loading, .updateing{
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  color: #666666;
  font-weight: 500;
  font-size: 28rpx;
  text-align: center;
}
</style>
