//app.js
var domain = "http://17240k68p1.51mypc.cn";
//var domain = "https://tty.tsing-care.com";
App({
  globalData: {    
    if_doctor:false,//医生信息
    if_information: false,//身份信息
    unionid: '',
    userInfo: null,//个人信息
    host: domain,
    time:0,
    //需要上传的数据
    data:{
      /*面积,红斑,鳞屑,厚度 */
      'result1':['','','',''],
      'level': '',//生活质量评分
      'result2': ['', '', '', '', '', '', ''],
      'checkvalue1': '',//是否诊断银屑病
      'time1': '',//诊断银屑病时间
      'checkvalue2': '',//是否诊断银屑病关节炎
      'time2': '',//诊断银屑病关节炎时间
    },
    evaluationResult:'',
  },
  onLaunch: function() {
    
  },
})