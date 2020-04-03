//main.js
//获取应用实例
const app = getApp();
var log = require('../../utils/log.js');
Page({
  data:{
    height:'30%',
    show: false,
    warnmsg: '',
    showerr:false
  },
  prompt: function (msg) {
    var that = this;
    that.setData({
      showerr: true,
      warnmsg: msg
    })
    
    setTimeout(function () {
      that.setData({
        show: false,
        warnmsg: ""
      })
    }, 2500);
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function(options) {
    console.log("main.js----onload");
    var unionid = app.globalData.unionid;  
    var that = this;
    var domain = app.globalData.host;
    //根据code获取openid等信息
    wx.login({
      success: function (res) {
        console.log(res);
        var code = res.code; //返回code
        wx.request({
          url: domain + '/wxs/rest/code2Session?code=' + code,
          method: 'get',
          dataType: 'json',
          success: function (response) {
            console.log(response);
            var result = response.data;
            if (result.errcode == 0) {
              app.globalData.unionid = result.unionid;
              app.globalData.userInfo = result.userInfo;
              app.globalData.if_doctor = result.if_doctor;
              app.globalData.if_information = result.if_information;
              console.log(app.globalData);
              //是否医生
              if (result.if_doctor) {
                app.globalData.doctor = result.doctor;
                wx.reLaunch({
                  url: '/pages/pages/doctor/index'
                  //url: '/pages/pages/personal/index'
                })
                // app.globalData.if_information = result.if_information;
                // wx.reLaunch({
                //   url: '/pages/pages/error/error'
                // })
              } else {
                app.globalData.doctor = result.information;
                wx.reLaunch({
                  url: '/pages/pages/personal/index'
                })
              }
            }
          },
          fail: function (e) {
            that.prompt("授权失败,请再试一次!");
          }
        })
      }, fail: function () {
        console.log("失败");
      }
    })
  },  
  showAuthorize:function (){
    this.setData ({
      show:true
    })
  },
  hiddenAuthorize:function(){
    this.setData({
      show: false
    })
  },  
  getDatas: function(e) {

    app.globalData.auth(e);
    /*
    var that = this;
    var domain = app.globalData.host;
    app.globalData.time= new Date().getTime();
    this.setData({
      show: false
    });
    console.log(e);
    //表示获取成功同意获取用户信息
    if (e.detail.errMsg =="getUserInfo:ok"){      
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
                              //app.getStorageSync.if_doctor = true;
                              wx.reLaunch({
                                url: '/pages/pages/doctor/index',
                              })
                            } else {
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
    }else{
      this.prompt("您取消授权了");      
    }
    */
  },
  cancel:function(){
    //拒绝直接进入自测
    this.setData({
      show: false
    });
    wx.navigateTo({
      url: '/pages/pages/evaluation/form1',
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