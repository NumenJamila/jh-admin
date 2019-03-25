<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <!-- <Badge :dot="!!messageUnreadCount"> -->
      <Badge>
        <Avatar :src="userAvatar"/>
        <span style="padding: 0 8px;" >{{nickName}}</span>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="personal">
          个人信息<Badge style="margin-left: 10px"></Badge>
        </DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvatar: {
      type: String,
      default: '@/assets/images/wx_photot.jpg'
    },
    nickName: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    personal () {
      this.$router.push({
        name: 'personal'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'personal': this.personal()
          break
      }
    }
  }
}
</script>
