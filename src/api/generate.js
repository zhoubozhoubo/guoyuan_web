import axios from '@/libs/api.request'

/**
 * 获取数据库表
 * @returns {*}
 */
export const getTableList = () => {
  return axios.request({
    url: 'DbTable/getTableList',
    method: 'get'
  })
}

/**
 * 获取数据表所有字段
 * @returns {*}
 */
export const getTableFullFields = (tableName) => {
  return axios.request({
    url: 'DbTable/getTableFullFields',
    method: 'get',
    params: {
      'tableName': tableName
    }
  })
}

/**
 * 一键生成
 * @param tableName
 * @param baseConfig
 * @param searchData
 * @param searchComponentsData
 * @param searchMatchingTypeData
 * @param searchSelectOptionsData
 * @param columnsData
 * @param columnsComponentsData
 * @param itemData
 * @param itemShowData
 * @param itemComponentsData
 * @param itemRuleValidateData
 * @param fileList
 * @returns {AxiosPromise<any>}
 */
// export const oneTouch = (
//     tableName,
//     baseConfig,
//     searchData,
//     searchComponentsData,
//     searchMatchingTypeData,
//     searchSelectOptionsData,
//     columnsData,
//     columnsComponentsData,
//     itemData,
//     itemShowData,
//     itemComponentsData,
//     itemRuleValidateData,
//     fileList) => {
//     searchData = searchData.filter((item) => {return item.key !== ''})
//     searchComponentsData = searchComponentsData.filter((item) => {return item.key !== ''})
//     searchMatchingTypeData = searchMatchingTypeData.filter((item) => {return item.key !== ''})
//     searchSelectOptionsData = searchSelectOptionsData.filter((item) => {return item.key !== ''})
//     columnsData = columnsData.filter((item) => {return item.key !== ''})
//     columnsComponentsData = columnsComponentsData.filter((item) => {return item.key !== ''})
//     itemData = itemData.filter((item) => {return item.key !== ''})
//     // itemShowData = itemShowData.filter((item) => {return item.key !== ''})
//     return axios.post('DbTable/index',{
//         tableName: tableName,
//         baseConfig: baseConfig,
//         searchData: searchData,
//         searchComponentsData: searchComponentsData,
//         searchMatchingTypeData: searchMatchingTypeData,
//         searchSelectOptionsData: searchSelectOptionsData,
//         columnsData: columnsData,
//         columnsComponentsData: columnsComponentsData,
//         itemData: itemData,
//         itemShowData: itemShowData,
//         itemComponentsData: itemComponentsData,
//         itemRuleValidateData: itemRuleValidateData,
//         fileList: fileList
//     })
// }
export const oneTouch = (
  tableName,
  baseConfig,
  searchData,
  searchComponentsData,
  searchMatchingTypeData,
  searchSelectOptionsData,
  columnsData,
  columnsComponentsData,
  itemData,
  itemShowData,
  itemComponentsData,
  itemRuleValidateData,
  fileList) => {
  searchData = searchData.filter((item) => {return item.key !== ''})
  searchComponentsData = searchComponentsData.filter((item) => {return item.key !== ''})
  searchMatchingTypeData = searchMatchingTypeData.filter((item) => {return item.key !== ''})
  searchSelectOptionsData = searchSelectOptionsData.filter((item) => {return item.key !== ''})
  columnsData = columnsData.filter((item) => {return item.key !== ''})
  columnsComponentsData = columnsComponentsData.filter((item) => {return item.key !== ''})
  itemData = itemData.filter((item) => {return item.key !== ''})
  return axios.request({
    url: 'DbTable/index',
    method: 'post',
    data: {
      tableName: tableName,
      baseConfig: baseConfig,
      searchData: searchData,
      searchComponentsData: searchComponentsData,
      searchMatchingTypeData: searchMatchingTypeData,
      searchSelectOptionsData: searchSelectOptionsData,
      columnsData: columnsData,
      columnsComponentsData: columnsComponentsData,
      itemData: itemData,
      itemShowData: itemShowData,
      itemComponentsData: itemComponentsData,
      itemRuleValidateData: itemRuleValidateData,
      fileList: fileList
    }
  })
}
