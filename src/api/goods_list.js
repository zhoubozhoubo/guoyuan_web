import axios from '@/libs/api.request'

/**
 * 获取列表
 * @param pageData
 * @param searchConf
 * @returns {*}
 */
export const getDataList = (pageData, searchConf) => {
    return axios.request({
        url: 'Goods/getList',
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
        url: 'Goods/coruData',
        method: 'post',
        data
    })
}

export const getTagList = () => {
  return axios.request({
    url: 'Tag/getList',
    method: 'get'
  })
}
