# vuex 豆瓣电影项目实战

之前写过一个[Vue2.0 豆瓣电影项目实战](http://www.jianshu.com/p/e1ac266b3dfe)，项目地址[GitHub](https://github.com/chenwenjin888/vue-movie.git)。在此项目中使用了vue-router、axios、vue-cli等技术。最近学习了下Vuex，那就再用此技术吧这个项目做个改版。

## Vuex介绍
>Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。 简单的理解就是管理我们的**data共享给其他组件使用**。

术业有专攻，这样Vue只需负责页面以及交互，Vuex来操作数据。其它不做多介绍，自行[Vuex官网](https://vuex.vuejs.org)脑补,在附带个Disciple_D写的一篇关于Vuex介绍的文章[Vuex —— The core of Vue application](http://www.jianshu.com/p/4840131d87c9)。

## 项目结构
```
// src 目录
.
├── App.vue
├── main.js
├── api
│   └── movie.js          //抽取出API请求
├── components
│   └── ...
├── store
│   ├── index.js          //我们组装模块并导出 store 的地方
│   ├── mutation-types.js //根级别的 mutation 类型
│   └── modules
│       ├── movieList.js  //电影列表模块
│       └── movieDetail.js//电影详情模块
.
```


现在我们就把之前项目中关于请求的抽取出movie.js，放在API模块下

## API

```
// api/movie.js
import axios from 'axios'

export default {
  // 获取正在上映的电影
  getInTheatersMovie(start = 0, count = 18){
    return this.reqUrl(`/api/movie/in_theaters?start=${start}&count=${count}`)
  },
  // 电影搜索
  searchMovie(key, start = 0, count = 18){
    return this.reqUrl(`/api/movie/search?q=${key}&start=${start}&count=${count}`)
  },
  // 获取电影详情
  getMovieDetailById(id){
    return this.reqUrl(`/api/movie/subject/${id}`)
  },
  // axios 请求
  reqUrl(url){
    return new Promise((resolve, reject) => {
      axios.get(url).then(response => {
        resolve(response.data);
      })
    })
  }
}
```
>PS:我们这里使用了**Promise对象**，它是异步编程的一种解决方案，使用此对象可以将异步操作以同步操作的形式表达出来，比传统的解决方案——回调函数和事件——更合理和更强大。不熟悉的同学可以看下阮一峰ECMAScript6中关于[**Promise对象**](http://es6.ruanyifeng.com/#docs/promise)的介绍

## 模块
豆瓣电影项目我们只是实现了三个功能，首页（正在上映的电影）、搜索页、详情页，但是首页和搜索页都只是展示电影列表，所以就把它当做两个模块来实现：电影列表模块、电影详情模块。 首先我们在store中引入这两个模块：

```
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import movieList from './modules/movieList'
import movieDetail from './modules/movieDetail'

Vue.use(Vuex);

export default new Vuex.Store({
  modules:{
    movieList,
    movieDetail
  }
})
```
>如果我们的模块很多，推荐大家使用模块命名空间来实现，这里我们就直接引入

在新建两个模块类型

```
// store/mutation-types.js
export const MOVIE_LIST = 'MOVIE_LIST' // 电影列表
export const MOVIE_DETAIL = 'MOVIE_DETAIL' // 根据ID获取电影信息
```

## 电影列表模块

```
// store/modules/movieList.js
import * as types from '../mutation-types'
import movie from '../../api/movie'

const state = {
  loading: true,
  title: '',
  list: []
}

const getters = {
  loading: state => state.loading,
  list: state => state.list,
  title: state => state.title
}

const actions = {
  // 获取正在上映的电影
  getInTheaters({ commit }){
    state.loading = true;
    movie.getInTheatersMovie().then(data => {
      commit(types.MOVIE_LIST, data)
    })
  },
  // 搜索电影
  searchMovie({ commit }, key){
    state.loading = true;
    movie.searchMovie(key).then(data => {
      commit(types.MOVIE_LIST, data)
    })
  }
}

const mutations = {
  [types.MOVIE_LIST](state, data){
    state.title = data.title;
    state.list = data.subjects;
    state.loading = false;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
```
下面开始调整我们的想对应的组件MovieList.vue,只需修改script代码，调整如下。

```
// src/components/MovieList.vue
import {mapGetters, mapActions} from 'vuex'
  export default {
    // 这里也调整通过mapGetters获取数据
    computed: mapGetters({
      loading: 'loading',
      title: 'title',
      list: 'list'
    }),
    props: ['movieType'],// 接收父组件传过来的值 --in_theaters=正在上映的电影  --search==搜索电影
    mounted(){
      // 修改后只需通过dispatch分发到对应的actions
      if (this.movieType == 'search') {
        this.$store.dispatch('searchMovie', this.$route.params.searchKey);
      } else {
        this.$store.dispatch('getInTheaters');
      }
    },
    methods: mapActions([
      'searchMovie'
    ])
  }
```
在讲解此段代码前， 先放一个示意图给大家看下
![vuex.png](http://upload-images.jianshu.io/upload_images/5019151-34ec321745f1aaf6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

- 在MovieList.vue中我们通过store分发（dispatch）到movieList.js中的actions的方法getInTheaters，actions中的方法主要是获取后台的数据，所以我们通过movie.getInTheatersMovie()调用API
- 在得到数据后，提交（commit）到我们的Mutations，在Mutations中会改变（Mutate）我们的state（状态），也就是数据
- 数据改变后他会渲染到我们的组件（Render）,通过getters派生出一些状态（数据）
- MovieList.vue组件通过mapGetters获取数据

>PS:其它关于搜索和详情的代码就不贴出来了， 都是一样的实现步骤，详细的代码可在我的GitHub上查看[vuex **豆瓣电影项目实战**](https://github.com/chenwenjin888/vuex-movie)
