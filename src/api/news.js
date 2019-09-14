import axios from '@/libs/api.request'

/**
 * 获取数据列表
 * @param pageData
 * @param searchConf
 * @returns {*}
 */
export const getList = (pageData, searchConf) => {
  return axios.request({
    url: 'News/getList',
    method: 'get',
    params: {
      'page': pageData.currentPage,
      'size': pageData.pageSize,
      'searchConf': searchConf
    }
  })
}

/**
 * 新增/更新数据
 * @param data
 * @returns {*}
 */
export const coruData = (data) => {
  return axios.request({
    url: 'News/coruData',
    method: 'post',
    data
  })
}
