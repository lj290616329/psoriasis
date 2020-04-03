const app = getApp();
var domain = app.globalData.host;
Page({
  data: {
    imgheight:200,
    headImgHeight: '190rpx',
    topMargin: '80rpx',
    top:350,
    height:'100%',
    warnmsg: '',
    show:false,
    showmodal:false
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
    console.log("test-result.js----onload");
    var width = wx.getSystemInfoSync().windowWidth;
    var height = wx.getSystemInfoSync().windowHeight;
    console.log(width);
    this.setData({
      imgheight: width * 0.62,
      headImgHeight: width * 0.24,
      topMargin: width * 0.12,
      height: (height - width*1.2)+"px"
    })     
  },
  onReady:function(){

  },
  showbutton:function(){
    this.setData({
      showmodal:true
    })
  },
  cancel:function(){
    wx.reLaunch({
      url: '/pages/index/main',
    })
  },
  getDatas: function (e) {
    var that = app;
    var domain = app.globalData.host;
    this.setData({
      show: false
    });
    console.log(e);
    //表示获取成功同意获取用户信息
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.globalData.userInfo = e.detail.userInfo;
      wx.getSetting({
        success: resp => {
          console.log(resp);
          if (resp.authSetting['scope.userInfo']) {
            //获取用户信息
            wx.login({
              success: function (date) {
                if (date.code) {
                  wx.getUserInfo({
                    success: res => {
                      console.log(res);
                      //发起网络请求
                      wx.request({
                        url: domain + '/wxs/rest/sign',
                        data: JSON.stringify({
                          code: date.code,
                          encryptedData: res.encryptedData,
                          iv: res.iv,
                          signature: res.signature,
                          rawData: res.rawData
                        }),
                        method: 'POST',
                        contentType: 'application/json;charset=UTF-8',
                        header: {
                          'content-type': 'application/json'
                        },
                        success: function (response) {
                          console.log(response);
                          console.log(response.data.status);
                          console.log(response.data.status != undefined)
                          if (response.data.status != undefined) {
                            that.prompt("授权失败,请再试一次");
                            return;
                          }
                          console.log(response.data.if_doctor);
                          console.log(response.data.if_information);
                          //这里需要 if_information==true 的时候才会有返回


                          var result = response.data;
                          if (result.errcode == 0) {
                            app.globalData.unionid = result.unionid;
                            app.globalData.userInfo = result.userInfo;
                            console.log(app.globalData)
                            //是否医生
                            if (result.if_doctor) {
                              app.globalData.doctor = result.doctor;
                              //app.getStorageSync.if_doctor = true;
                              wx.reLaunch({
                                url: '/pages/pages/doctor/index',
                              })
                            } else {
                              app.globalData.if_information = result.if_information;
                              wx.reLaunch({
                                url: '/pages/pages/personal/index'
                              })
                            }
                          }
                        }
                      })
                    }
                  })
                } else {
                  console.log('登录失败！' + date.errMsg)
                }
              }
            })
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
          } else if (resp.authSetting['scope.userInfo'] === false) { // 授权弹窗被拒绝
            wx.clearStorage()
          }
        }
      });
    } else {
      this.prompt("您取消授权了");
    }
  },
  onShareAppMessage: function () {
    return {
      title: '银屑病智能风险管理',
      imageUrl: '/pages/image/share_img.png',
      path: '/pages/index/index',
    }
  }
})