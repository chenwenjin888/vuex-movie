import * as types from '../mutation-types'
import movie from '../../api/movie'

const state = {
  loading1: true,
  movie: {
    images: {
      large: ''
    },
    rating: {
      average: 0
    }
  }
}

const getters = {
  loading1: state => state.loading1,
  movie: state => state.movie
}

const actions = {
  // 根据ID获取电影信息
  getMovieDetailById({ commit }, id){
    state.loading1 = true;
    movie.getMovieDetailById(id).then(data => {
      commit(types.MOVIE_DETAIL, data)
    })
  }
}

const mutations = {
  [types.MOVIE_DETAIL](state, data){
    state.movie = data;
    state.loading1 = false;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
