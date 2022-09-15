// 管理所有的自定义指令
export const imagerror = {
  // 绑定指令的元素插入到节点后执行
  inserted(dom, options) {
    // dom为当前指令绑定的dom对象，options.value为传输的值
    // 避免头像的src为null不显示，也不会触发error事件
    // dom.src = dom.src || options.value
    dom.src = dom.src !== null ? dom.src : options.value
    // 当img标签的src属性加载失败会触发onerror事件
    dom.onerror = function () {
      dom.src = options.value
    }
  },
  // 当前指令作用的组件数据更新完毕后执行
  componentUpdated(dom, options) {
    // 已经监听了事件了不用再次监听
    dom.src = dom.src !== null ? dom.src : options.value
  }
}