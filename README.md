# mpvue-zhuhu_daily

> 小程序仿知乎日报，以mpvuez框架整体实现

#####功能点
1. 首页上拉刷新页面 x
2. 首页下拉更新上一天内容 x
3. 详情页上拉返回上一页文章 x
4. 点赞效果 √
5.


#####体验bug
1. 进入详情页会出现行上一页的数据

*详情页内容部分乱是因为知乎日报文章详情这块是webview实现的。返回的内容有类型和css样式，故还没解决，请见谅，如果有哪位大佬知道怎么解决可以指点我。*

**详情页内容解析是用mpvue-wxparse，因为返回内容用v-html解析不了,有些页面没内容空的，是数据过大，超过了小程序的承受范围**


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
