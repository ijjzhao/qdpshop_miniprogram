// pages/plan/canvas/canvas.js
const api = require('../../../config/api.js');
const util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    planid: '',
    planDetail: '',
    style: '',
    screenHeight: 0,
    screenWidth: 0,
    goodsArr: [],
    distance: 0,
    touchX: 0,
    touchY: 0,
    unit: 0,
    removeBtnShow: false,
    actionBarShow: false,
    canvasGoodsIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '制作方案'
    });
    let res = wx.getSystemInfoSync();
    this.setData({
      screenWidth: res.windowWidth,
      screenHeight: res.windowHeight,
      unit: 750 / res.windowWidth,
    });

    let style = options.style
    if (style) {
      this.setData({
        style: style
      })
    }

    let planid = options.planid;
    if (planid) {
      this.setData({
        planid: planid
      })
      this.getPlanDetail(planid)
    }
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
            let goodsArr = res.data.items;
            for (let i in goodsArr) {
              let goods = goodsArr[i];
              goods.scale = goods.w / 375;
              // console.log(goods.scale)
              // goods.picwidth = goods.w;
              // goods.picheight = goods.h;
              // that.getImgInfo(goods.url, `pic${i}`)
            }
            that.setData({
              planDetail: res.data.plan,
              goodsArr: res.data.items,
            });
          }
        }
        wx.hideLoading()
      });
  },

  toggleRemoveBtn() {
    this.setData({
      removeBtnShow: !this.data.removeBtnShow
    })
  },

  toggleActionBar(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      actionBarShow: !this.data.actionBarShow,
      canvasGoodsIndex: index
    })
  },

  /**
   * 商品缩略题点击之后 显示商品到画板，已显示的return
   */
  addToCanvas(e) {
    let index = e.currentTarget.dataset.index;
    let goodsArr = this.data.goodsArr;
    if (goodsArr[index].enabled == 0) {
      goodsArr[index].enabled = 1;
      this.setData({
        goodsArr: goodsArr,
      })
    }
    this.setData({
      actionBarShow: false,
      removeBtnShow: false
    })
  },

  removeFromCanvas() {
    let index = this.data.canvasGoodsIndex;
    let goodsArr = this.data.goodsArr;
    goodsArr[index].enabled = 0;
    this.setData({
      goodsArr: goodsArr,
      actionBarShow: false
    })
  },

  increaseZ() {
    let index = this.data.canvasGoodsIndex;
    let goodsArr = this.data.goodsArr;
    let z = goodsArr[index].z
    if (z == goodsArr.length - 1) return;
    for (let i in goodsArr) {
      let goods = goodsArr[i];
      if (goods.z == z + 1) {
        goods.z = z
        break
      }
    }
    goodsArr[index].z = z + 1;
    this.setData({
      goodsArr,
    })
  },

  decreaseZ() {
    let index = this.data.canvasGoodsIndex;
    let goodsArr = this.data.goodsArr;    
    let z = goodsArr[index].z
    if (z == 0) return;
    for (let i in goodsArr) {
      let goods = goodsArr[i];
      if (goods.z == z - 1) {
        goods.z = z
        break
      }
    }
    goodsArr[index].z = z - 1;
    this.setData({
      goodsArr,
    })
  },

  increaseScale() {
    console.log('increaseScale')
    let index = this.data.canvasGoodsIndex
    let goodsArr = this.data.goodsArr
    let goods = goodsArr[index]
    let newScale = goods.scale * 1.05
    // if (newScale > 2) return
    goods.scale = newScale
    goods.x = goods.x - 375 * 0.025
    goods.y = goods.y - 375 * 0.025
    console.log(goods.scale);
    this.setData({
      goodsArr: goodsArr,
    })
  },

  decreaseScale() {
    console.log('decreaseScale')
    let index = this.data.canvasGoodsIndex
    let goodsArr = this.data.goodsArr
    let goods = goodsArr[index]
    let newScale = goods.scale * 0.95
    // if (newScale < 0.5) return
    goods.scale = newScale
    goods.x = goods.x + 375 * 0.025
    goods.y = goods.y + 375 * 0.025
    this.setData({
      goodsArr: goodsArr,
    })
  },

  addGoods(goods) {
    let goodsArr = this.data.goodsArr;
    goods.w = 375
    goods.h = 375
    goods.x = parseInt(750 / 4 + 200)
    goods.y = parseInt(750 / 4 + 200)
    goods.scale = 1;
    goods.z = goodsArr.length;
    goods.enabled = 0;
    goods.scale = 1;
    goodsArr.push(goods);
    // this.getImgInfo(goods.url, `pic${goodsArr.length - 1}`)
    this.setData({
      goodsArr: goodsArr,
      removeBtnShow: false,
    })
  },

  removeGoods(e) {
    let index = e.currentTarget.dataset.index;
    let goodsArr = this.data.goodsArr;
    let removeZ = goodsArr[index].z;
    goodsArr.splice(index, 1);
    for (let i in goodsArr) {
      let goods = goodsArr[i];
      // 后面的z 全部减1
      if (goods.z > removeZ) {
        goods.z = goods.z - 1;
      }
      // 缓存的图片地址 改一下key
      if (i >= index) {
        let j = i;
        let picurl = wx.getStorageSync(`pic${++j}`)
        wx.setStorageSync(`pic${--j}`, picurl)
      }
    }
    this.setData({
      goodsArr
    })
  },

  getImgInfo: (netUrl, storageKeyUrl) => {
    let that = this;    
    return new Promise((resolve, reject) =>  {
      if (netUrl.indexOf('https') == -1) {
        netUrl = netUrl.replace('http', 'https')
      }
      wx.getImageInfo({
        src: netUrl,
        success: function (res) {
          // wx.setStorage({
          //   key: storageKeyUrl,
          //   data: res.path,
          // });
          resolve(res.path)
        },
        fail: function (res) {
          // wx.showToast({
          //   icon: 'none',
          //   title: '画布图片下载失败',
          // })
          reject('画布图片下载失败')
        }
      })
    })
  },

  saveCanvas() {
    if (this.data.goodsArr.length == 0) return;
    wx.showLoading({
      title: '图片绘制中',
    })
    var unit = this.data.unit;
    var _this = this;
    var ctx = wx.createCanvasContext('customCanvas');
    ctx.setFillStyle('white')
    ctx.fillRect(0, 0, 750, 750);
    let goodsArr = this.data.goodsArr
    // 排序 z小的在前
    goodsArr = goodsArr.sort(function (a, b) {
      if (a.z > b.z) {
        return 1;
      } else if (a.z < b.z) {
        return -1
      } else {
        return 0;
      }
    })

    for (let i in goodsArr) {
      let goods = goodsArr[i];
      if (goods.enabled == 1) {
        this.getImgInfo(goods.url, `pic${i}`).then(imgurl => {
          ctx.drawImage(imgurl, goodsArr[i].x - 200, goodsArr[i].y - 200, goodsArr[i].w, goodsArr[i].h);
          this.drawImageOK(i, ctx)
        }).catch(err => {
          this.drawImageFail()
          wx.showModal({
            title: '提示',
            content: '商品图片下载失败，请重试',
            showCancel: false
          })
        })
      }
    }
  },

  drawImageOK(i, ctx) {
    this.data.goodsArr[i].draw = true
    for (let i in this.data.goodsArr) {
      let goods = this.data.goodsArr[i]
      if (goods.enabled == 1) {
        if (!goods.draw) return
      }
    }
    this.saveCtx(ctx)
  },

  drawImageFail() {
    for (let i in this.data.goodsArr) {
      let goods = this.data.goodsArr[i]
      goods.draw = false
    }
  },

  saveCtx: function (ctx) {
    let _this = this
    ctx.draw(true, function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 750,
        height: 750,
        destWidth: 750,
        destHeight: 750,
        canvasId: 'customCanvas',
        success: function (res) {
          if (!res.tempFilePath) {
            wx.showModal({
              title: '提示',
              content: '图片绘制中，请稍后重试',
              showCancel: false
            })
          }
          wx.hideLoading();

          wx.navigateTo({
            url: `../add/add?planid=${_this.data.planid}&style=${_this.data.style}&tempFilePath=${res.tempFilePath}`,
          })

        }
      }, this)
    });
  },

  // es6
  /*
  saveCanvas_es6() {
    if (this.data.goodsArr.length == 0) return;
    wx.showLoading({
      title: '图片绘制中',
    })
    var unit = this.data.unit;
    var _this = this;
    var ctx = wx.createCanvasContext('customCanvas');
    ctx.setFillStyle('white')
    ctx.fillRect(0, 0, 750, 750);
    let goodsArr = this.data.goodsArr
    // 排序 z小的在前
    goodsArr = goodsArr.sort(function (a, b) {
      if (a.z > b.z) {
        return 1;
      } else if (a.z < b.z) {
        return -1
      } else {
        return 0;
      }
    })

    let grawImg = async () => {
      for (let i in goodsArr) {
        let goods = goodsArr[i];
        if (goods.enabled == 1) {
          let imgurl = await this.getImgInfo(goods.url, `pic${i}`)
          ctx.drawImage(imgurl, goodsArr[i].x - 200, goodsArr[i].y - 200, goodsArr[i].w, goodsArr[i].h);
        }
      }
      saveCtx()
    }

    let saveCtx = function() {
      ctx.draw(true, function () {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 750,
          height: 750,
          destWidth: 750,
          destHeight: 750,
          canvasId: 'customCanvas',
          success: function (res) {
            if (!res.tempFilePath) {
              wx.showModal({
                title: '提示',
                content: '图片绘制中，请稍后重试',
                showCancel: false
              })
            }
            wx.hideLoading();

            wx.navigateTo({
              url: `../add/add?planid=${_this.data.planid}&style=${_this.data.style}&tempFilePath=${res.tempFilePath}`,
            })
           
          }
        }, this)
      });
    }

    try {
      grawImg();
    } catch(err) {
      wx.showModal({
        title: '提示',
        content: '商品图片下载失败，请重试',
        showCancel: false
      })
    }
  },
  */

  handleChange(e) {
    let { x, y, source } = e.detail;
    let index = e.currentTarget.dataset.index;
    if (source == 'touch') {
      this.data.goodsArr[index].x = x * this.data.unit
      this.data.goodsArr[index].y = y * this.data.unit
    }
  },

  handleScale(e) {
    let { x, y, scale } = e.detail;
    let index = e.currentTarget.dataset.index;
    this.data.goodsArr[index].w = parseInt(375 * scale)
    this.data.goodsArr[index].h = parseInt(375 * scale)
    this.data.goodsArr[index].x = x * this.data.unit
    this.data.goodsArr[index].y = y * this.data.unit
    this.data.goodsArr[index].scale = scale
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 模拟数据
   */
  getTestData() {
    let goodsTestArr = [{
      id: 1,
      url: 'https://g-search1.alicdn.com/img/bao/uploaded/i4/i4/82523815/TB1bDJIeiMnBKNjSZFzXXc_qVXa_!!0-item_pic.jpg_360x360Q90.jpg',
    }, {
      id: 2,
      url: 'https://g-search3.alicdn.com/img/bao/uploaded/i4/i3/3864942132/TB2K_KssyQnBKNjSZFmXXcApVXa_!!3864942132-0-item_pic.jpg_360x360Q90.jpg'
    }, {
      id: 3,
      url: 'https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i3/96416556/TB2bvk2tCtYBeNjSspkXXbU8VXa_!!0-saturn_solar.jpg_360x360Q90.jpg'
    }, {
      id: 4,
      url: 'https://g-search3.alicdn.com/img/bao/uploaded/i4/i4/2055544716/TB2w3tlt29TBuNjy1zbXXXpepXa_!!2055544716-0-item_pic.jpg_360x360Q90.jpg'
    }];

    let goodsArr = this.data.goodsArr;
    for (let i in goodsTestArr) {
      let goods = goodsTestArr[i];
      this.addGoods(goods);
      // this.getImgInfo(goods.url, 'pic' + i);
    }
  },
})