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
