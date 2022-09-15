// 负责所有全局自定义组件的注册
import PageTools from './PageTools/index.vue'
import UploadExcel from './UploadExcel/index.vue'
import ImageUpload from './ImageUpload/index.vue'
import Print from 'vue-print-nb'
import Screenfull from './Screenfull/index.vue'
import ThemePicker from './ThemePicker/index.vue'
import LangSelect from './Lang/index.vue'
import TagsView from './TagsView/index.vue'

export default {
  install(Vue) {
    Vue.component("PageTools", PageTools)
    Vue.component("UploadExcel", UploadExcel)
    Vue.component("ImageUpload", ImageUpload)
    Vue.component("Screenfull", Screenfull)
    Vue.component("ThemePicker", ThemePicker)
    Vue.component("LangSelect", LangSelect)
    Vue.component("TagsView", TagsView)
    Vue.use(Print) // 注册打印插件
  }
}