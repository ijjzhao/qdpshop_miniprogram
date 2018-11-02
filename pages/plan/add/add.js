// pages/plan/add/add.js
const api = require('../../../config/api.js');

Page({

  /**
   * Page initial data
   */
  data: {
    planid: '',
    styles: ['简约', '时尚', '休闲', '运动', '商务'],
    cuts: ['修身', '适中', '宽松'],
    feels: ['舒适', '透气', '有型', '正常'],
    
    name: '',
    // style: -1,
    // cut: -1,
    // feel: -1,
    values: [-1 , -1, [0, 0, 0, 0]],
    // desc: '',
    v: '',
    tempFilePath: '',
    btnDisable: true,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    let planid = options.planid;
    // let style = options.style == '' ? this.data.styles[0] : options.style ;
    // 有planid 就是修改 没有就是新建
    if (planid) {
      let pages = getCurrentPages();
      let canvasPage = pages[pages.length - 2];
      let planDetail = canvasPage.data.planDetail;
      this.setData({
        planid: planid,
        name: planDetail.name,
        values: [planDetail.style, planDetail.cut, JSON.parse(planDetail.feel)],
        // style: planDetail.style,
        // fit_group: planDetail.fit_group,
        // fit_scene: planDetail.fit_scene,
        // desc: planDetail.desc,
        v: planDetail.v
      })
      this.checkBtnValidation();
    }

    // if (style) {
    //   this.setData({
    //     style: style
    //   })
    // }
    this.setData({
      tempFilePath: options.tempFilePath
    });
  },

  handleNameChange(e) {
    this.setData({
      name: e.detail.value
    });
    console.log(this.data.name)
    this.checkBtnValidation()
  },

  itemTapped(e) {
    let key = e.currentTarget.dataset.key
    let index = e.currentTarget.dataset.index
    // console.log(key)
    // console.log(index)
    let values = this.data.values
    // let values = this.data.values
    if (key != 2) {
      values[key] = index
    } else {
      if (values[2][index] == 1) {
        values[2][index] = 0
      } else {
        if (this.getSum(values[2]) != 2) {
          values[2][index] = 1
        }
      }
    }
    this.setData({
      values
    })
    this.checkBtnValidation()
  },

  getSum(arr) {
    let sum = 0
    for(let i in arr) {
      sum += parseInt(arr[i])
    }
    return sum
  },

  checkBtnValidation() {
    if (this.data.name != '' &&
      this.data.values[0] != -1 &&
      this.data.values[1] != -1 &&
      this.getSum(this.data.values[2]) != 0
    ) {
      this.setData({
        btnDisable: false
      })
    } else {
      this.setData({
        btnDisable: true
      })
    }

    // console.log(this.data.btnDisable)
  },

  savePlan() {
    if (this.data.btnDisable) return
    wx.showLoading({
      title: '保存中...',
    })
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2] // canvas page
    let _this = this;
    console.log(JSON.stringify(_this.data.values[2]))
    
    wx.uploadFile({
      url: api.PlanSave,
      filePath: this.data.tempFilePath,
      name: 'image',
      formData: {
        goodsArr: JSON.stringify(prePage.data.goodsArr), //带上参数
        name: _this.data.name,
        style: _this.data.values[0],
        cut: _this.data.values[1],
        feel: JSON.stringify(_this.data.values[2]),
        // fit_group: _this.data.fit_group,
        // fit_scene: _this.data.fit_scene,
        // desc: _this.data.desc
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading()
        if (res.statusCode === 200) {
          let planListPage = pages[pages.length - 3];
          planListPage.onPullDownRefresh();
          wx.navigateBack({
            delta: 2
          })
        }
        wx.hideLoading();
      }
    })
  },

  updatePlan() {
    if (this.data.btnDisable) return
    wx.showLoading({
      title: '更新中...',
    })
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2] // canvas page
    let _this = this;
    console.log(JSON.stringify(_this.data.values[2]))
    wx.uploadFile({
      url: api.PlanUpdate,
      filePath: this.data.tempFilePath,
      name: 'image',
      formData: {
        goodsArr: JSON.stringify(prePage.data.goodsArr), //带上参数
        name: _this.data.name,
        style: _this.data.values[0],
        cut: _this.data.values[1],
        feel: JSON.stringify(_this.data.values[2]),
        // style: _this.data.style,
        // fit_group: _this.data.fit_group,
        // fit_scene: _this.data.fit_scene,
        // desc: _this.data.desc,
        id: _this.data.planid,
        v: _this.data.v
      },
      success: function (res) {
        console.log(res);
        wx.hideLoading()
        if (res.statusCode === 200) {
          let planListPage = pages[pages.length - 4]
          planListPage.onPullDownRefresh();
          let planDetailPage = pages[pages.length - 3]
          planDetailPage.getPlanDetail(planDetailPage.data.planDetail.id);
          wx.navigateBack({
            delta: 2
          })
        }
        wx.hideLoading();
      }
    })
  },
  
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  }
})