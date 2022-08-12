<template>
  <view class="my-search-container" :style="{'background-color':bgColor}" @click="searchBoxHandler">
    <view class="my-search-box" :style="{'border-radius':radius+'px'}">
      <!-- 使用 uni-ui 提供的图标组件 -->
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-search",
    props: {
      // 背景颜色
      bgColor: {
        type: String,
        default: '#C00000'
      },
      // 圆角尺寸
      radius: {
        type: Number,
        // 单位是 px
        default: 18
      }
    },
    data() {
      return {

      };
    },
    methods: {
      searchBoxHandler() {
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
  .my-search-container {
    height: 50px;
    // 移除背景颜色，改由 props 属性控制
    // background-color: #C00000;
    display: flex;
    align-items: center;
    padding: 0 10px;

    .my-search-box {
      height: 36px;
      background-color: #fff;
      // 移除圆角尺寸，改由 props 属性控制
      // border-radius: 15px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .placeholder {
        font-style: 15px;
        margin-left: 5px;
      }
    }
  }
</style>
