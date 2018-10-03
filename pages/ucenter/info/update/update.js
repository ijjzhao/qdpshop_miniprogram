// pages/ucenter/info/update/update.js
const util = require('../../../../utils/util.js')
const api = require('../../../../config/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_id: 0,
    index: 3,
    bottomTexts: [
      '基本的身高体重数据，是让搭配师了解你的第一步',
      '一些特殊的细节，可以主动告诉搭配师',
      '选出你最钟爱的颜色，让搭配师更加了解你',
      '每个人都有自己期望的样子',
      '哪种裁剪让你觉得更加舒适',
      '合身的衣服更加容易出效果哦'
      ],
    height:'',
    weight: '',
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
    colorChoise: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
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

    this.setData({
      user_id: options.user_id
    })

    this.showData()
  },

  showData() {
    let pages = getCurrentPages();
    let indexPage = pages[pages.length - 2]
    let userInfo = indexPage.data.userInfo
    if (userInfo.height) {
      this.setData({
        height: userInfo.height
      })
    }
    if (userInfo.weight) {
      this.setData({
        weight: userInfo.weight
      })
    }
    if (userInfo.age) {
      this.setData({
        age: userInfo.age
      })
    }
    if (userInfo.cut) {
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
      this.setData({
        styleChoice: JSON.parse(userInfo.style)
      })
    }
    if (userInfo.size) {
      this.setData({
        sizeStatus: JSON.parse(userInfo.size)
      })
    }
  },

  updateInfo(form) {
    let user_id = this.data.user_id
    util.request(api.UserInfoUpdate, {user_id, form}, 'POST')
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
    }
  },

  setIndex: function(e) {
    let index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      index: index
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

  bindinputWeight(e) {
    let value = e.detail.value;
    this.setData({
      weight: value
    })
    this.updateInfo({
      weight: value
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
      detail_info_choice: detail_info_choise
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
    let choise = colorChoise[colorPickShow - 1][index]
    colorChoise[colorPickShow - 1][index] = choise == 1 ? 0 : 1
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
      this.setData({
        styleIndex: index + 1
      })
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