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
