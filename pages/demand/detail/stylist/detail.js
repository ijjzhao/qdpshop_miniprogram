// pages/demand/detail/stylist/detail.js
var util = require('../../../../utils/util.js');
var api = require('../../../../config/api.js');
const app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    index: 3, // tab index
    id: 10,
    user_id: 0,
    demand_user_id: 0,
    demand: {},
    userInfo: {},
    planMap: {},
    colors: [
      { color: '#000000', name: '黑色' },
      { color: '#FFFFFF', name: '白色' },
      { color: '#C0C0C0', name: '灰色' },
      { color: '#082E54', name: '藏青色' },
      { color: '#A39480', name: '米色' },
      { color: '#8B4513', name: '棕色' },
      { color: '#F8F8FF', name: '米白色' },
      { color: '#FFFF00', name: '黄色' },
      { color: '#6B8E23', name: '军绿色' },
      { color: '#4169E1', name: '深蓝色' },
      { color: '#FF0000', name: '红色' },
      { color: '#9013FE', name: '紫色' }
    ],
    colorChoise: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    stylePics: [
      { url: 'https://img.qingdapei.net/brief-deepColor.png', description: '简约' },
      { url: 'https://img.qingdapei.net/brief-sampleColor.png', description: '简约' },
      { url: 'https://img.qingdapei.net/fashion-HK-warmColor.png', description: '轻时尚' },
      { url: 'https://img.qingdapei.net/fashion-simpleColor.png', description: '轻时尚' },
      { url: 'https://img.qingdapei.net/light-deepColor.png', description: '休闲' },
      { url: 'https://img.qingdapei.net/light-middleColor.png', description: '休闲' },
      { url: 'https://img.qingdapei.net/light-sampleColor.png', description: '休闲' },
    ],
    styleArr: [
      [],
      [],
      []
    ],
    pics: ['', ''],
    showBigImg: false,
    bigImgUrl: [],
    bigImgIndex: 0,
    notes: [],
    note2Add: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id
      })
    }
    let user_id = app.globalData.userInfo.id;
    if (!user_id) {
      return
    } else {
      this.setData({
        user_id
      })
    }

    this.getDemand();
  },

  getDemand() {
    wx.showLoading({
      title: '加载中...',
    })
    util.request(api.DemandGet, {
      id: this.data.id
    }).then((res) => {
      let demand = res.data.demand;
      demand.plans = JSON.parse(demand.plans)
      for (let i in demand.plans) {
        this.getPlan(demand.plans[i])
      }
      this.setData({
        demand: demand,
        demand_user_id: demand.user_id
      })
      this.getUserInfo(demand.user_id)
      this.getUserNote()
    })
  },

  getPlan(planid) {
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
            let imageUrl = `${api.cdnImgUrl}${planDetail.id}.png?v=${planDetail.v}`;
            planDetail.imageUrl = imageUrl
            let planMap = that.data.planMap
            planMap[planid] = planDetail
            that.setData({
              planMap,
            });
          }
        }
        // wx.hideLoading()
      });
  },

  getUserInfo(user_id) {
    util.request(api.UserInfoGet, { user_id }).then((res) => {
      let userInfo = res.data
      if (userInfo.color) {
        this.setData({
          colorChoise: JSON.parse(userInfo.color)
        })
      }

      if (userInfo.style) {
        let styleChoice = JSON.parse(userInfo.style)
        while (this.data.stylePics.length - styleChoice.length > 0) {
          styleChoice.push(0)
        }
        let styleArr = [
          [], [], []
        ]
        for (let i in styleChoice) {
          let choice = styleChoice[i]
          if (choice != 0) {
            styleArr[choice - 1].push(this.data.stylePics[i].url)
          }
        }
        this.setData({
          styleArr
        })
      }
      if (userInfo.pics) {
        this.setData({
          pics: JSON.parse(userInfo.pics)
        })
      }
      this.setData({
        userInfo
      })
      wx.hideLoading()
    }) 
  },

  getUserNote() {
    let that = this;
    util.request(api.UserNoteList, {
      user_id: this.data.demand_user_id,
    })
      .then(function (res) {
        console.log(res.data)
        if (res.errno === 0) {
          that.setData({
            notes: res.data
         })
        }
        // wx.hideLoading()
      });
  },

  setIndexByNavigation: function (e) {
    let index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      index: index
    })
  },

  switchTab(e) {
    this.setData({
      index: e.detail.current
    })
  },

  switchBigImgTab(e) {
    this.setData({
      bigImgIndex: e.detail.current
    })
  },

  showBigBodyImg(e) {
    let index = e.currentTarget.dataset.index
    let bigImgUrl = this.data.pics[index]
    if (!bigImgUrl) return
    this.setData({
      showBigImg: true,
      bigImgUrl: [bigImgUrl]
    })
  },

  showBigStyleImg(e) {
    let index = e.currentTarget.dataset.index
    let bigImgUrl = this.data.styleArr[index]
    if (bigImgUrl.length == 0) return
    this.setData({
      showBigImg: true,
      bigImgUrl: bigImgUrl
    })
  },

  hideBigImg() {
    this.setData({
      showBigImg: false,
      bigImgIndex: 0,
      bigImgUrl: []
    })
  },

  sendPlan() {
    console.log(`sendPlan`)
  },

  sendNote() {
    let note = this.data.note
    
    if (!note) return
    wx.showLoading({
      title: '提交中',
    })
    
    util.request(api.UserNoteAdd, {
      form: {
        user_id: this.data.demand_user_id,
        note: note,
        stylist_user_id: this.data.user_id
      }
    }, 'POST').then((res) => {
      if (res.errno == 0) {
        this.getUserNote(this.data.demand_user_id)
        this.setData({
          note: ''
        })
      }
      wx.hideLoading()
    })
  },

  deleteNote(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否确认删除',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '删除中',
          })
          util.request(api.UserNoteDelete, {
            id
          }, 'POST').then((res) => {
            if (res.errno == 0) {
              let notes = that.data.notes;
              notes.splice(index, 1)
              that.setData({
                notes
              })
            }
            wx.hideLoading()
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })


  },

  handleNoteInput(e) {
    let note = e.detail.value
    this.setData({
      note
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})