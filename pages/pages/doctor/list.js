var app = getApp()
var domain = app.globalData.host;
Page({
  data: {
    lists: [],
    pro: false,
    error:false,
    errmsg:''
  },
  onLoad: function (options) {
    console.log(options)
    var ifEnd = options.ifEnd ? options.ifEnd : '';
    console.log(ifEnd)
    var pid = options.pid ? options.pid:"";
    console.log(pid)
    var unionid = app.globalData.unionid;
    console.log('doctor-list.js onload');
    var that = this;
    wx.request({
      url: domain + `/wxs/doctor/list?unionid=` + unionid + `&pid=` + pid + `&ifEnd=` + ifEnd,
      method: 'get',
      success: function (result) {
        console.log(result)
        if (result.data.errcode == 0) {
          var lists = result.data.data;
          if (lists != '' && lists.length>0){
            that.setData({
              lists: lists,
              pro: false
            })
          }else{
            that.setData({
              lists: lists,
              pro: true
            })
          }         
        } else {
          that.setData({
            error: true,
            errmsg: result.data.errmsg
          })
        }
      },
      error: function (res) {
        that.setData({
          error: true,
          errmsg: JSON.stringify(res)
        })
      }
    })
  },
  detail: function (e) {
    const id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/pages/doctor/evaluation_detail?id=' + id
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 1
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
