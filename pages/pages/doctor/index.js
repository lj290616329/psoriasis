var app = getApp();
var domain = app.globalData.host;
var util = require('../../../utils/util.js');
var api = require('../../../utils/api.js');
Page({
  data: {
    imgheight: 150,
    nickName: '',
    headImg: '/pages/image/headimg.png',
    headImgHeight: '190rpx',
    topMargin: '80rpx',
    error: false,
    errmsg: '', prompt: false,
    promptMsg: ''        
  },
  prompt: function (msg) {
    this.setData({
      show: true,
      warnmsg: msg
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        show: false,
        warnmsg: ""
      })
    }, 1500);
  },
  onLoad: function () {
    console.log("doctor-index.js----onload");
    var width = wx.getSystemInfoSync().windowWidth;
    console.log(width);
    var userInfo = app.globalData.userInfo;
    var doctor = app.globalData.doctor;
    console.log(doctor)
    this.setData({
      imgheight: width * 0.64,
      nickName: doctor ? (doctor.name ? userInfo.name : doctor.name) ? doctor.name : userInfo.name: "",
      headImg: userInfo.headimgurl ? userInfo.headimgurl : "/pages/image/headimg.png",
      headImgHeight: width * 0.24,
      topMargin: width * 0.12,
      des: doctor.description ? doctor.description : "暂未填写个人简介",
    })
  },
  go(){
    wx.reLaunch({
      url: '/pages/pages/personal/index'
    })
  },
  info: function () {
    wx.navigateTo({
      url: '/pages/pages/doctor/info'
    })
  },
  my_patient: function () {
    wx.navigateTo({
      url: '/pages/pages/doctor/patient'
    })
  },
  my_list: function () {
    wx.navigateTo({
      url: '/pages/pages/doctor/list?ifEnd=0'
    })
  },
  geren:function(){
    app.globalData.if_information =true;
    wx.navigateTo({
      url: '/pages/pages/personal/index'
    })
  },
  scan: function () {
    var that = this;

    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        var result = res.result;
        console.log(result)
        var token = result;
        console.log(token)

        util.request(api.EvaluationBind,{token:token},"GET").then(function(result){
          console.log(result);
          if (result.errcode == 0) {
            wx.navigateTo({
              url: '/pages/pages/doctor/evaluation_detail?id=' + result.data.id,
            })
          } else {
            util.prompt(that, result.data.errmsg);
          }
        }).catch((err) => {
          if(err.data.status==500){
            util.prompt(that, "请扫描病人出示的二维码!"); 
          }else{
            util.prompt(that, "扫描失败,请稍后再试!"); 
          }
        })        
      }
    })
  },
  map() {
    wx.navigateTo({
      url: '/pages/pages/map/index'
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