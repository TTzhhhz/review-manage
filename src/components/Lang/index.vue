<template>
  <el-dropdown @command="changeLanguage" trigger="click">
    <div>
      <svg-icon style="color: #fff; font-size: 20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="this.$i18n.locale === 'zh'"
        >中文</el-dropdown-item
      >
      <el-dropdown-item command="en" :disabled="this.$i18n.locale === 'en'"
        >en</el-dropdown-item
      >
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from "js-cookie";
export default {
  methods: {
    changeLanguage(command) {
      // 在cookie存入key为language的值为command
      Cookie.set("language", command);
      this.$i18n.locale = command; // 设置给本地的i18n插件
      this.$message.success("切换语言成功");
    },
  },
};
</script>

<style>
</style>