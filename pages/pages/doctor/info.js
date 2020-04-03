var app = getApp()
var domain = app.globalData.host;
var util = require('../../../utils/util.js');
Page({
  data: {
    show:false,
    warnmsg: '',
    error: false,
    errmsg: '',
    /*需要提交的数据*/
    name: '',
    phone: '',
    goodAt: '',
    description: '',
    introduce: '',    
  },
  onLoad: function (option) {
    var unionid = app.globalData.unionid;
    console.log('info.js onload');
    var that = this;
    wx.request({
      url: domain + `/wxs/doctor/detail?unionid=` + unionid,
      method: 'get',
      success: function (result) {
        console.log(result);
        if (result.data.errcode == 0) {
          var doctor = result.data.data;
          that.setData({
            name: doctor.name,
            phone: doctor.phone,
            goodAt: doctor.goodAt,
            description: doctor.description,
            introduce: doctor.introduce,
          })
        } else {
          util.error(that, result.data.errmsg);
        }
      },
      error: function (res) {
        util.error(that, JSON.stringify(res));
      }
    })
  },
  cancel: function () {
    util.back();
  },
  back: function () {
    util.back();
  },   
  bindKeyInput: function (e) {
    console.log("bindKeyInput");
    var type = e.currentTarget.dataset.type;
    var val = e.detail.value;
    var set_type = '' + type + ''; 
    this.setData({
      [set_type]: val,      
    })
  },
  bindTextAreaBlur(e) {
    console.log(e.detail.value);
    this.setData({
      introduce: e.detail.value
    })
  },  
  formSubmit: function () {
    var unionid = app.globalData.unionid;
    var data = JSON.stringify({
      name: this.data.name,
      phone: this.data.phone,
      goodAt: this.data.goodAt,
      description: this.data.description,
      introduce: this.data.introduce,
    })
    var that = this;
    console.log(data)
    wx.request({
      url: domain + `/wxs/doctor/form?unionid=${unionid}`,
      data: data,
      method: 'POST',
      contentType: 'application/json;charset=UTF-8',
      header: {
        'content-type': 'application/json'
      },
      success: function (result) {
        if (result.data.errcode == 0) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else {
          util.prompt(that, result.data.errmsg);
        }
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '银屑病智能风险管理',
      imageUrl: '/pages/image/share_img.png',
      path: '/pages/index/index',
    }
  }
})
