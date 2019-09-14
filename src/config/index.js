export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: 'ApiAdmin身边的接口管理专家',
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    // dev: 'https://api.our-dream.cn/admin/',
    // pro: 'https://pet.apiadmin.net/admin/'
    dev: 'http://localhost:8001/admin/',
    pro: 'http://localhost:8001/admin/'
  },
  /**
   * @description 需要加载的插件
   */
  plugin: {

  }
}