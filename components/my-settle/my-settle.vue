<template>
  <view class="my-settle-container">
    <!-- 全选区域 -->
    <label class="radio" @click="changeAllState">
      <radio color="#c00000" :checked="isFullCheck" /><text>全选</text>
    </label>

    <!-- 合计区域 -->
    <view class="amount-box">
      合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>

    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapState
  } from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {
        seconds: 3, // 倒计时的秒数
        timer: null, // 定时器的 Id
      };
    },
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      ...mapGetters('m_user', ['addstr']),
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart']),
      // 是否全选
      isFullCheck() {
        return this.checkedCount === this.total
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),
      changeAllState() {
        this.updateAllGoodsState(!this.isFullCheck);
      },
      // 点击了结算按钮
      settlement() {
        // 1. 先判断是否勾选了要结算的商品
        if (!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')
        // 2. 再判断用户是否选择了收货地址
        if (!this.addstr) return uni.$showMsg('请选择收货地址！')
        // 3. 最后判断用户是否登录了
        // if (!this.token) return uni.$showMsg('请先登录！')

        if (!this.token) return this.delayNavigate()

        // 实现微信支付功能
        this.payOrder()
      },
      async payOrder() {

        /* 微信支付的流程共3步：1.创建订单 2.订单预支付 3.发起微信支付 */
        /* 相应的代码已经写下来了，但因为后端接口的问题，就不执行了。 */
        uni.$showMsg('结算...')

        // // 1. 创建订单
        // // 1.1 组织订单的信息对象
        // const orderInfo = {
        //   // 开发期间，注释掉真实的订单价格，
        //   // order_price:this.checkedGoodsAmount,
        //   // 写死订单总价为 1 分钱
        //   order_price: 0.01,
        //   consignee_addr: this.addstr,
        //   goods: this.cart.filter(x => x.goods_state).map(x => ({
        //     goods_id: x.goods_id,
        //     goods_number: x.goods_count,
        //     goods_price: x.goods_price
        //   }))
        // }
        // // 1.2 发起请求创建订单
        // const {
        //   data: res
        // } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        // console.log(res);
        // if (res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
        // // 1.3 得到服务器响应的“订单编号”
        // const orderNumber = res.message.order_number
        // // console.log(orderNumber);

        // // 2. 订单预支付
        // // 2.1 发起请求获取订单的支付信息
        // const {
        //   data: res2
        // } = await uni.$http.get('/api/public/v1/my/orders/req_unifiedorder', {
        //   order_number: orderNumber
        // })
        // console.log(res2);
        // // 2.2 预付订单生成失败
        // if (res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！')
        // // 2.3 得到订单支付相关的必要参数
        // const payInfo = res2.message.pay
        // console.log(payInfo);

        // // 3. 发起微信支付
        // // 3.1 调用 uni.requestPayment() 发起微信支付
        // const [err, succ] = await uni.requestPayment(payInfo)
        // // 3.2 未完成支付
        // if (err) return uni.$showMsg('订单未支付！')
        // // 3.3 完成了支付，进一步查询支付的结果
        // const {
        //   data: res3
        // } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {
        //   order_number: orderNumber
        // })
        // // 3.4 检测到订单未支付
        // if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
        // // 3.5 检测到订单支付完成
        // uni.showToast({
        //   title: '支付完成！',
        //   icon: 'success'
        // })
      },
      // 延迟导航到 my 页面
      delayNavigate() {
        // 把 data 中的秒数重置成 3 秒
        this.seconds = 3
        this.showTip(this.seconds)

        this.timer = setInterval(() => {
          this.seconds--

          if (this.seconds <= 0) {
            clearInterval(this.timer)
            uni.switchTab({
              url: '/pages/my/my',
              // 页面跳转成功之后的回调函数
              success: () => {
                // 调用 vuex 的 updateRedirectInfo 方法，把跳转信息存储到 Store 中
                this.updateRedirectInfo({
                  openType: 'switchTab', // 跳转的方式
                  from: '/pages/cart/cart' // 从哪个页面跳转过去的
                })
              }
            })
            return
          }

          this.showTip(this.seconds)
        }, 1000)
      },
      // 展示倒计时的提示消息
      showTip(n) {
        uni.showToast({
          icon: 'none',
          title: '请登录后再结算！' + n + '秒之后自动跳转到登录页',
          mask: true, // 为页面添加透明遮罩，防止点击穿透
          duration: 1500
        })
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount-box {
      .amount {
        color: #c00000;
        font-weight: bold;
      }
    }

    .btn-settle {
      background-color: #c00000;
      height: 50px;
      color: white;
      line-height: 50px;
      padding: 0 10px;
      min-width: 100px;
      text-align: center;
    }
  }
</style>
