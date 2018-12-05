/*eslint-disable*/
import db from '../../../plugins/db'
import api from '../../../service/api'
const mixin = {
  methods: {
    //微信登录
    wecatLogin() {
      const _this = this;
      let p = new Promise(function(resolve, reject) {
        plus.oauth.getServices(function(services) {
          _this.auths = services;
          let s = _this.auths[0];
          if(!s.authResult) {
            s.login(function(e) {
              //("登录认证成功！");
              s.getUserInfo(function(e) {
                _this.userInfo = s.userInfo
                _this.addMember();
                db.set('userInfo', s.userInfo);
                resolve(200);
              }, function(e) {
                //("获取用户信息失败：" + e.message + " - " + e.code); 
                resolve(201);
              });
            }, function(e) {
              //("登录认证失败！");
              resolve(201);
            });
          } else {
            _this.userInfo = s.userInfo
            ///("已经登录认证！");
            db.set('userInfo', s.userInfo);
            resolve(200);
          }
        }, function(e) {
          //("获取分享服务列表失败：" + e.message + " - " + e.code);
          resolve(201);
        });
      })
      return p;
    },
    //注册用户到数据库
    async addMember() {
      let res = await this.$http.post(this, api.addMember, {
        fromOpenid: '',
        appid: api.appid,
        openid: this.userInfo.openid,
        nickName: this.userInfo.nickname,
        avatarUrl: this.userInfo.headimgurl,
        gender: this.userInfo.sex,
        province: this.userInfo.province,
        city: this.userInfo.city,
        country: this.userInfo.country
      })
    },
    //获取会员信息
    async getMemberInfo() {
      let res = await this.$http.get(this, api.memberInfo, {
        appid: api.appid,
        openid: db.get('userInfo').openid
      })
    }
  },
};

export default mixin;