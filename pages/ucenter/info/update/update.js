// pages/ucenter/info/update/update.js
const util = require('../../../../utils/util.js')
const api = require('../../../../config/api.js')

let canSetIndexByNavigation = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id: 0,
    index: 0,
    bottomTexts: [
      '基本的身高体重数据，是让搭配师了解你的第一步',
      '一些特殊的细节，可以主动告诉搭配师',
      '选出你最钟爱的颜色，让搭配师更加了解你',
      '每个人都有自己期望的样子',
      '哪种裁剪让你觉得更加舒适',
      '合身的衣服更加容易出效果哦'
      ],
    height: '请选择您的身高',
    heightIndex: 30,
    heightRange: [],
    weight: '请选择您的体重',
    weightIndex: 10,
    weightRange: [],
    age: '',
    detail_infos: [
      [
        '肤色黑', '脸大', '肩宽', '屁股大', '大粗腿'
      ],
      [
        '肤色白', '脖子短', '啤酒肚', '腰粗', '腿短'
      ]
    ],
    detail_info_choice: [
      [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]
    ],
    detailArr: [],
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
    colorChoise: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    colorPickShow: 0,
    colorPickTitle: '',
    stylePics:[
      { url: 'http://collocate.qingdapei.net/img/planTest/81.png', status: 0 },
      { url: 'http://collocate.qingdapei.net/img/planTest/81.png', status: 0 },
      { url: 'http://collocate.qingdapei.net/img/planTest/81.png', status: 0 },
      { url: 'http://collocate.qingdapei.net/img/planTest/81.png', status: 0 },
    ],
    styleIndex: 0,
    styleChoice: [0, 0, 0, 0],
    cutStatus: -1,
    upwareSizeStatus: 0,
    downwareSizeStatus: 0,
    sizes: [
      { name: 'S', value: '165' },
      { name: 'M', value: '170' },
      { name: 'L', value: '175' },
      { name: 'XL', value: '180' },
      { name: 'XXL', value: '185' },
      { name: 'XXXL', value: '190' }
    ],
    sizeStatus: [-1, -1]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.index) {
      this.setData({
        index: parseInt(options.index)
      })
    }

    if (options.user_id) {
      this.setData({
        user_id: options.user_id
      })
    }

    let heightRange = []
    for (let i = 140; i <= 200; i++) {
      heightRange.push(i)
    }
    let weightRange = []
    for (let i = 50; i <= 100; i++) {
      weightRange.push(i)
    }
    this.setData({
      heightRange, weightRange
    })

    this.showData()
  },

  showData() {
    let pages = getCurrentPages();
    let indexPage = pages[pages.length - 2]
    let userInfo = indexPage.data.userInfo
    if (userInfo.height) {
      this.setData({
        height: userInfo.height,
        heightIndex: this.data.heightRange.indexOf(parseInt(userInfo.height))
      })
    }
    if (userInfo.weight) {
      this.setData({
        weight: userInfo.weight,
        weightIndex: this.data.weightRange.indexOf(parseInt(userInfo.weight))
      })
    }
    if (userInfo.age) {
      this.setData({
        age: userInfo.age
      })
    }
    if (userInfo.cut != undefined) {
      this.setData({
        cutStatus: userInfo.cut
      })
    }
    if (userInfo.detail) {
      this.setDetailInfoChoice(JSON.parse(userInfo.detail))
    }
    if (userInfo.color) {
      this.setData({
        colorChoise: JSON.parse(userInfo.color)
      })
    }
    if (userInfo.style) {
      // 如果遇到图片增加的情况，原数据库存入的数组长度会不够，这个时候补0
      let styleChoice = JSON.parse(userInfo.style)
      while (this.data.stylePics.length - styleChoice.length > 0) {
        styleChoice.push(0)
      }
      this.setData({
        styleChoice: styleChoice
      })
    }
    if (userInfo.size) {
      this.setData({
        sizeStatus: JSON.parse(userInfo.size)
      })
    }
  },

  updateInfo(form) {
    return
    let user_id = this.data.user_id
    util.request(api.UserInfoUpdate, {user_id, form}, 'POST')
  },

  saveInfo() {
    let form = {}
    if (this.data.height == '请选择您的身高') {
      wx.showModal({
        title: '提示',
        content: '请正确选择您的身高',
        showCancel: false
      })
      return
    } else {
      form.height = this.data.height
    }

    if (this.data.weight == '请选择您的体重') {
      wx.showModal({
        title: '提示',
        content: '请正确选择您的体重',
        showCancel: false
      })
      return
    } else {
      form.weight = this.data.weight
    }

    if (!this.data.age) {
      wx.showModal({
        title: '提示',
        content: '请正确填写您的年龄',
        showCancel: false
      })
      return
    } else {
      form.age = this.data.age
    }


    if (this.data.cutStatus == -1) {
      wx.showModal({
        title: '提示',
        content: '请正确选择您的裁剪',
        showCancel: false
      })
      return
    } else {
      form.cut = this.data.cutStatus
    }

    if (this.data.detailArr.length != 0) {
      form.detail = JSON.stringify(this.data.detailArr)
    }

    if (this.data.colorChoise.join('') != '000000000000') {
      form.color = JSON.stringify(this.data.colorChoise)
    }

    if (this.data.styleChoice.join('') != '0000') {
      form.style = JSON.stringify(this.data.styleChoice)
    }

    if (this.data.sizeStatus[0] != -1 || this.data.sizeStatus[1] != -1) {
      form.size = JSON.stringify(this.data.sizeStatus)
    }

    wx.showLoading({
      title: '保存中',
    })

    let user_id = this.data.user_id
    util.request(api.UserInfoUpdate, { user_id, form }, 'POST').then((res) => {
      if (res.errno == 0) {
        wx.navigateBack({
          delta: 1
        })
      }
      wx.hideLoading()
    })
  },

  prePageBtnTapped: function () {
    let index = this.data.index;
    if (index != 0) {
      index -= 1
      this.setData({
        index: index
      })
    }
  },

  nextPageBtnTapped: function () {
    let index = this.data.index;
    if (index != this.data.bottomTexts.length - 1) {
      index += 1
      this.setData({
        index: index
      })
    } else {
      // wx.navigateBack({
      //   delta: 1,
      // })
    }
  },

  setIndexByNavigation: function(e) {
    if (canSetIndexByNavigation) {
      let index = parseInt(e.currentTarget.dataset.index);
      this.setData({
        index: index
      })
    }
  },

  switchTab(e) {
    this.setData({
      index: e.detail.current
    })
  },

  bindinputHeight(e) {
    let value = e.detail.value;
    this.setData({
      height: value
    })
    this.updateInfo({
      height: value
    })
  },

  bindHeightPickerChange(e) {
    let height = this.data.heightRange[e.detail.value]
    this.setData({
      height: height,
      heightIndex: e.detail.value
    })
    this.updateInfo({
      height
    })
  },

  bindinputWeight(e) {
    let value = e.detail.value;
    this.setData({
      weight: value
    })
    this.updateInfo({
      weight: value
    })
  },

  bindWeightPickerChange(e) {
    let weight = this.data.weightRange[e.detail.value]    
    this.setData({
      weight: weight,
      weightIndex: e.detail.value
    })
    this.updateInfo({
      weight
    })
  },

  bindinputAge(e) {
    let value = e.detail.value;
    this.setData({
      age: value
    })
    this.updateInfo({
      age: value
    })
  },

  checkboxChange(e) {
    this.setDetailInfoChoice(e.detail.value)
    this.updateInfo({
      detail: JSON.stringify(e.detail.value)
    })
  },

  setDetailInfoChoice(data) {
    let detail_infos = this.data.detail_infos
    let detail_info_choise = [
      [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]
    ]
    if (!data) {
      return detail_info_choise
    }
    for (let i in data) {
      let info = data[i]
      let index0 = detail_infos[0].indexOf(info)
      let index1 = detail_infos[1].indexOf(info)
      if (index0 != -1) {
        detail_info_choise[0][index0] = 1
      }
      if (index1 != -1) {
        detail_info_choise[1][index1] = 1
      }
    }
    this.setData({
      detail_info_choice: detail_info_choise,
      detailArr: data
    })
  },

  toggleColorPicker(e) {
    let show = e.currentTarget.dataset.show
    if (show != 0) {
      let title = e.currentTarget.dataset.title;
      this.setData({
        colorPickTitle: title
      })
    }
    this.setData({
      colorPickShow: show
    })
  },

  colorPick(e) {
    let index = e.currentTarget.dataset.index
    let colorPickShow = this.data.colorPickShow
    let colorChoise = this.data.colorChoise;
    if (colorPickShow == 0) return
    let choise = colorChoise[index]
    colorChoise[index] = choise != colorPickShow ? parseInt(colorPickShow) : 0
    this.setData({
      colorChoise
    })
    this.updateInfo({
      color: JSON.stringify(colorChoise)
    })
  },

  cutStatusSet: function(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      cutStatus: index
    })
    this.updateInfo({
      cut: index
    })
  },

  sizeStatusSet: function(e) {
    let index = e.currentTarget.dataset.index;
    let key = e.currentTarget.dataset.key;
    let sizeStatus = this.data.sizeStatus;
    sizeStatus[key] = index;
    this.setData({
      sizeStatus
    })
    this.updateInfo({
      size: JSON.stringify(sizeStatus)
    })
  },

  styleImgTapped: function(e) {
    let key = e.currentTarget.dataset.key;
    let styleIndex = this.data.styleIndex;
    switch (key) {
      case 'left': {
        this.setData({
          styleIndex: styleIndex - 1,
        })
        break
      }
      case 'middle': {
        break
      }
      case 'right': {
        this.setData({
          styleIndex: styleIndex + 1,       
        })
        break
      }
    }
  },
  
  styleBtnTapped: function(e) {
    let choice = parseInt(e.currentTarget.dataset.choice)
    let styleChoice = this.data.styleChoice
    let index = this.data.styleIndex
    styleChoice[index] = choice
    this.setData({
      styleChoice
    })

    if (index != this.data.stylePics.length - 1) {
      let that = this
      setTimeout(function () {
        that.setData({
          styleIndex: index + 1
        })
      }, 500) 
    }

    this.updateInfo({
      style: JSON.stringify(styleChoice)
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
  
  }
})