<template>
  <div class="container">
    <div class="canvas" v-show="loading">
      <div class="spinner"></div>
    </div>
    <div v-show="!loading">
      <h2>{{movie.title}}({{movie.year}})</h2>
      <div class="box">
        <div class="left">
          <img :src="movie.images.large">
        </div>
        <div class="main">
          <div>导演：{{getDirectors}}</div>
          <div>主演：{{getCasts}}</div>
          <div>评分：{{movie.rating.average}}</div>
          <div>
            <h3>{{movie.title}}剧情介绍</h3>
            {{movie.summary}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters({
        loading: 'loading1',
        movie: 'movie'
      }),
      // 获取导演
      getDirectors(){
        return this.getFilterData(this.movie.directors);
      },
      // 获取主演
      getCasts(){
        return this.getFilterData(this.movie.casts);
      }
    },
    mounted(){
      // 获取电影详情
      this.$store.dispatch('getMovieDetailById', this.$route.params.id);
    },
    watch: {
      // 监听路由，搜索页重复搜索的时候改变路由状态，页面重新加载，不监听的话组件实例会被复用
      '$route'(to, from){
        // 防止返回重复调用
        if (to.path.indexOf('/detail/') == 0) {
          this.$store.dispatch('getMovieDetailById', this.$route.params.id);
        }
      }
    },
    methods: {
      // 过滤数据
      getFilterData(obj){
        let arr = [];
        if (!obj || obj.length == 0)return '';

        for (let i = 0; i < obj.length; i++) {
          arr.push(obj[i].name)
        }
        return arr.join('/');
      },
    }
  }
</script>

<style scoped>
  .box {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
  }

  .left {
    width: 200px;
    height: 300px;
  }

  .left img {
    width: 100%;
    height: 100%;
  }

  .main {
    margin-left: 20px;
    flex: 1;
  }
</style>
