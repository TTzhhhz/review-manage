<template>
  <div>
    <svg-icon
      icon-class="fullscreen"
      style="color: #fff; width: 20px; height: 20px"
      @click="changeScreen"
    ></svg-icon>
  </div>
</template>

<script>
// import ScreenFull from "screenfull";
import ScreenFull from "screenfull";

export default {
  methods: {
    changeScreen() {
      if (!ScreenFull.isEnabled) {
        // 表明全屏不可用
        this.$message.warning("全屏插件不可用");
        return;
      }
      ScreenFull.toggle();
    },
  },
};
</script>

<style>
</style>