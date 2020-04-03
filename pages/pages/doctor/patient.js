const app = getApp();
var domain = app.globalData.host;
var util = require('../../../utils/util.js');
Page({
  data: {
    focus: false,
    lists:[],    
    searchState:false,
    placeholder:"",
    value:"",
    cancel:false,
    pro:false,
    error:false,
    errmsg:''
  },
  showInput:function(e){
    console.log(e);
    this.setData({
      searchState:true,
      focus: true,
      placeholder: '请输入姓名进行搜索',
      cancel:true,
    })
  },
  hideInput:function(e){
    this.setData({
      searchState: false,
      focus: false,
      placeholder: '',
      value:''
    })
    this.getlist({});
  },
  clearInput:function(e){
    this.setData({
      value: ''
    })
    this.getlist({});
  },
  inputChange:function(e){
    var val = e.detail.value;
    this.setData({
      value:val
    })
    this.getlist({name:val});
  },
  getlist: function (options){
    var unionid = app.globalData.unionid;
    var name = options.name === undefined ? '' : options.name;
    var that = this
    wx.request({
      url: domain + `/wxs/doctor/my_patient?unionid=${unionid}&name=${name}`,
      method: "GET",
      contentType: 'application/json;charset=UTF-8',
      header: {
        'content-type': 'application/json'
      },
      success: function (result) {
        console.log(result.data);
        if (result.data.errcode == 0) {
          var results = result.data.data;
          if (results != "" && results.length>0){
            that.setData({
              lists: results,
              pro: false
            })
          }else{
            that.setData({
              lists: results,
              pro: true
            })
          }          
        }else{
          that.setData({
            error:true,
            errmsg: result.data.errmsg
          })          
        }
      },
      error: function (res) {
        util.error(that, JSON.stringify(res));
      }
    })
  },
  onLoad: function () {    
    this.getlist({});    
  },  
  to_list: function (e) {
    console.log(e);
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/pages/doctor/list?pid='+id
    })  
  },
  onShow: function () {

  },
  back:function(){
    util.back();
  },
  onShareAppMessage: function () {
    return {
      title: '银屑病智能风险管理',      
      path: '/pages/index/index',
      imageUrl: '/pages/image/share_img.png',
    }
  }
})
