<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#afafaf"></uni-icons>
    <!-- 登录按钮 -->
    <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
    <!-- 登录提示 -->
    <text class="tips-text">登录后尽享更多权益</text>
    <!-- <image :src="avatarUrl"></image> -->
  </view>
</template>

<script>
  import {
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-login",
    data() {
      return {};
    },
    computed: {
      ...mapState('m_user', ['redirectInfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateUserinfo', 'updateToken', 'updateRedirectInfo']),
      // 获取微信用户的基本信息
      async getUserProfile() {
        // 调用微信小程序API获取用户信息
        const res = await uni.getUserProfile({
          desc: "登录"
        })
        // 判断是否获取用户信息成功
        if (res[1] === undefined) return uni.$showMsg('您取消了登录授权！')
        // 获取用户信息成功， res[1].userInfo 就是用户的基本信息
        // console.log(res[1].userInfo)
        // console.log(res[1])

        // // 将用户的基本信息存储到 vuex 中  
        this.updateUserinfo(res[1].userInfo)

        // // 获取登录成功后的 Token 字符串
        this.getToken(res[1])
      },
      // 调用登录接口，换取永久的 token
      async getToken(info) {
        // 调用微信登录接口
        const [err, res] = await uni.login().catch(err => err)
        if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')

        // 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }

        /* 因为获取 token 的接口已失效了，所以后面直接使用一个固定有效的token */

        // 换取 token
        // const {
        //   data: loginResult
        // } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        // if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
        uni.$showMsg('登录成功')

        /* 因为获取 token 的接口已失效了，所以直接使用一个固定有效的token */

        // 新 vuex 中的 token
        // this.updateToken(loginResult.message.token)
        this.updateToken(
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjI0LCJpYXQiOjE2MjI5NjE5MDAsImV4cCI6MTAwMTYyMjk2MTg5OX0.2IvKll9Hi71pCUJjDYZzny_qqQy6fnk-N4YRKs3sn6Y'
        )

        // 判断 vuex 中的 redirectInfo 是否为 null
        // 如果不为 null，则登录成功之后，需要重新导航到对应的页面
        this.navigateBack()
      },
      // 返回登录之前的页面
      navigateBack() {
        // redirectInfo 不为 null，并且导航方式为 switchTab
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url: this.redirectInfo.from,
            complete: () => {
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    &::after {
      content: ' ';
      display: block;
      width: 100%;
      height: 40px;
      background-color: white;
      position: absolute;
      bottom: 0;
      left: 0;
      border-radius: 100%;
      transform: translateY(50%);
    }

    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #c00000;
    }

    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>
