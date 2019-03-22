import CommonIcon from '_c/common-icon'
import { showTitle } from '@/libs/util'
export default {
  components: {
    CommonIcon
  },
  methods: {
    showTitle (item) {
      return showTitle(item, this)
    },
    // showChildren (item) {
    //   return item.children && (item.children.length > 1 || (item.meta && item.meta.showAlways))
    // },
    // 子菜单只有一个时也显示父菜单
    showChildren (item) {
      return item.children && (item.children.length >= 1 || (item.meta && item.meta.showAlways))
    },
    getNameOrHref (item, children0) {
      return item.href ? `isTurnByHref_${item.href}` : (children0 ? item.children[0].name : item.name)
    }
  }
}
