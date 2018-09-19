// pages/plan/detail/detail.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    planDetail: '',
    goodsArr: [],
    forCustomer: false,
    imageUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // todo： 如何确定入口是用户 还是搭配师
    let planid = parseInt(options.planid);
    this.setData({
      forCustomer: options.forCustomer == 1 ? true : false, // true, //
      cdnImgUrl: api.cdnImgUrl
    })
    this.getPlanDetail(planid);
  },

  getPlanDetail(planid) {
    wx.showLoading({
      title: '加载中...',
    })

    let that = this;
    util.request(api.PlanGet, {
      id: planid,
    })
      .then(function (res) {
        if (res.errno === 0) {
          if (res.data.length == 0) {
            wx.showModal({
              title: '提示',
              content: '未找到相关方案',
              showCancel: false
            })
          } else {
            let planDetail = res.data.plan
            imageUrl = `${that.data.cdnImgUrl}${planDetail.id}.png?v=${planDetail.v}`;
            let goodsArr = res.data.items
            for (let i in goodsArr) {
              let goods = goodsArr[i]
              goods.checked = true
            }
            that.setData({
              planDetail: planDetail,
              goodsArr: goodsArr,
              imageUrl: imageUrl
            });
            wx.setNavigationBarTitle({
              title: planDetail.name,
            })
          }
        }
        wx.hideLoading()
      });
  },

  itemTapped(e) {
    let index = e.currentTarget.dataset.index;
    console.log(this.data.forCustomer);
    if (this.data.forCustomer) {
      this.checkItem(index);
    } else {
      let goods_id = this.data.goodsArr[index].goods_id;
      wx.navigateTo({
        url: `../../goods/goods?id=${goods_id}`,
      })
    }
  },

  checkItem(index) {
    let goodsArr = this.data.goodsArr;
    let checkStutas = goodsArr[index].checked
    if (checkStutas == undefined || !checkStutas) {
      goodsArr[index].checked = true
    } else {
      goodsArr[index].checked = false
    }
    this.setData({
      goodsArr: goodsArr
    })
  },

  bottomBtnTapped() {
    if (this.data.forCustomer) {
      this.addToCart();
    } else {
      wx.navigateTo({
        url: `../canvas/canvas?planid=${this.data.planDetail.id}`,
      })
    }
  },

  addToCart() {
    let hasGoods = false
    for (let i in this.data.goodsArr) {
      let goods = this.data.goodsArr[i];
      if (goods.checked) {
        hasGoods = true
        break
      }
    }
    // 如果一项没选
    if (!hasGoods) {
      wx.showModal({
        title: '提示',
        content: '您尚未选择宝贝',
        showCancel: false
      })
      return
    }

    wx.showLoading({
      title: '添加中',
    })

    let asyncRequest = async () => {
      try {
        for (let i in this.data.goodsArr) {
          let goods = this.data.goodsArr[i];
          if (goods.checked) {
            await this.addCartRequest(goods);
          }
        }
        wx.switchTab({
          url: '/pages/cart/cart',
        })
      } catch (err) {
        console.log(err);
      }

      wx.hideLoading()
    }

    asyncRequest();
  },

  addCartRequest(goods) {
    return new Promise((resolve, reject) => {
      util.request(api.CartAdd, {
        goodsId: goods.goods_id,
        number: 1,
        productId: goods.product_id
      }, "POST").then((res) => {
        console.log(res)
        if (res.errno === 0) {
          console.log('添加购物车成功')
          resolve(res);
        } else {
          reject(res);
        }
      })
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this
    return {
      title: '帮你搭配了一套服饰，打开看看吧',
      desc: that.data.planDetail.name,
      path: `/pages/plan/detail/detail?planid=${that.data.planDetail.id}&forCustomer=1`,
      imageUrl: `${that.data.cdnImgUrl}${that.data.planDetail.id}.png?v=${that.data.planDetail.v}`
      // imageUrl: '../../image/CorporateData/bbg_share_logo.png',
    }
  }
})