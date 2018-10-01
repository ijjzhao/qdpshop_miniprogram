// pages/ucenter/info/update/update.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
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
      [ 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0 ]
    ],
    colors: [
      { color: '#000000', name: '黑色', like: false, dislike: false },
      { color: '#FFFFFF', name: '白色', like: false, dislike: false },
      { color: '#C0C0C0', name: '灰色', like: false, dislike: false },
      { color: '#082E54', name: '藏青色', like: false, dislike: false },
      { color: '#A39480', name: '米色', like: false, dislike: false },
      { color: '#8B4513', name: '棕色', like: false, dislike: false },
      { color: '#F8F8FF', name: '米白色', like: false, dislike: false },
      { color: '#FFFF00', name: '黄色', like: false, dislike: false },
      { color: '#6B8E23', name: '军绿色', like: false, dislike: false },
      { color: '#4169E1', name: '深蓝色', like: false, dislike: false },
      { color: '#FF0000', name: '红色', like: false, dislike: false },
      { color: '#9013FE', name: '紫色', like: false, dislike: false }
    ],
    colorPickShow: 0,
    colorPickTitle: '',
    style:[
      { url: 'http://collate.qingdapei.net/img/plan/1.png', status: 0 },
      { url: 'http://collate.qingdapei.net/img/plan/2.png', status: 0 },
      { url: 'http://collate.qingdapei.net/img/plan/3.png', status: 0 },
      { url: 'http://collate.qingdapei.net/img/plan/4.png', status: 0 },
    ],
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
        index: options.index
      })
    }
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

  updateValue() {
    console.log(this.data.height)
    console.log(this.data.weight)
    console.log(this.data.age)
  },

  bindinputHeight(e) {
    let value = e.detail.value;
    this.setData({
      height: value
    })
  },

  bindinputWeight(e) {
    let value = e.detail.value;
    this.setData({
      weight: value
    })
  },

  bindinputAge(e) {
    let value = e.detail.value;
    this.setData({
      age: value
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
    let colors = this.data.colors;

    if (colorPickShow == 0) return
    if (colorPickShow == 1) {
      colors[index].like = !colors[index].like
    } else {
      colors[index].dislike = !colors[index].dislike
    }

    this.setData({
      colors
    })
  },

  cutStatusSet: function(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      cutStatus: index
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