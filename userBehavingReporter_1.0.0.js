/**
 * Created by tandajun on 16/11/18.
 */
;(function (name, definition) {
    // 检测上下文环境是否为AMD或CMD
    var hasDefine = typeof define === 'function';

    // 检查上下文环境是否为Node
    var hasExports = typeof module !== 'undefined' && module.exports;

    if (hasDefine) {
        define(definition);
    } else if (hasExports) {
        module.exports = definition();
    } else {
        // 将模块的执行结果挂在window变量中，在浏览器中this指向window对象
        var context = this;

        context[name] = definition();
    }
})('_Reporter', function () {
    /**
     * 暴露出去的Actions规范
     */
    var Actions = {
        CLICK: 'clk',
        CHANGE: 'chg',
        SELECT: 'slt',
        TOUCH: 'tch',
        VISIT: 'vst',
        BACK: 'bk',
        LEAVE: 'lv',
        ERROR: 'er',
        LOGIN: 'lg',
        ADD:'ad',
        DELETE:'dl',
        UPDATE:'ud',
        QUERY:'qr'
    };
    var ActionTypes = {
        CLICK: 'CLICK',
        CHANGE: 'CHANGE',
        SELECT: 'SELECT',
        TOUCH: 'TOUCH',
        VISIT: 'VISIT',
        BACK: 'BACK',
        LEAVE: 'LEAVE',
        ERROR: 'ERROR',
        LOGIN: 'LOGIN',
        ADD: 'ADD',
        DELETE: 'DELETE',
        UPDATE: 'UPDATE',
        QUERY: 'QUERY'
    };
    /**
     * 构造函数
     * @param options
     */
    var UserBehavingReporter = function (options) {
        this.host = options.host || 'http://localhost';
        this.port = options.port || '80';
        this.userId = options.userId;
        this.applicationCode = options.applicationCode;
        this.clientHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        this.clientWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.behavings = [];
    };

    /**
     * 用于存放用户行为的队列
     */
    UserBehavingReporter.prototype.track = function (options) {
        var route = options.route;
        var action = options.action;
        var description = options.description;
        var evt = options.evt;
        try{
            if(!route || route === {})    throw "Parameter cannot be empty : route !";
            if(!action in Actions)    throw "Parameter cannot be analyzed : action !";
            if(!description || description === '')    throw "Parameter cannot be analyzed : description !";
        }catch(err){
            console.log('%c'+err,'color:red');
            return null
        }
        this.behavings.push({
            routeCode: route.code,
            routePath: route.path,
            routeName: route.name,
            action: Actions[action],
            evt_el: evt ? evt.target.nodeName : '',
            evt_x: evt ? evt.x : '',
            evt_y: evt ? evt.y : '',
            description: options.description,
            stayTime: options.stayTime || 0,
            recordTime: new Date().getTime()
        })
    };

    /**
     * 用于存放用户 点击 行为的队列
     */
    UserBehavingReporter.prototype.click = function (route) { //route={code:'',path:'',name:''}
      var evt = window.event;
      try{
        if(!route || route === {})    throw "Parameter cannot be empty : route !";
      }catch(err){
        console.log('%c'+err,'color:red');
        return false
      }
      this.behavings.push({
        routeCode: route.code,
        routePath: route.path,
        routeName: route.name,
        action: Actions.CLICK,
        evt_el: evt.target.nodeName,
        evt_x: evt.x,
        evt_y: evt.y,
        recordTime: new Date().getTime()
      });
      return true;
    };

    /**
     * 用于存放用户 触摸 行为的队列
     */
    UserBehavingReporter.prototype.touch = function (route) { //route={code:'',path:'',name:''}
      var evt = window.event;
      try{
        if(!route || route === {})    throw "Parameter cannot be empty : route !";
      }catch(err){
        console.log('%c'+err,'color:red');
        return false
      }
      this.behavings.push({
        routeCode: route.code,
        routePath: route.path,
        routeName: route.name,
        action: Actions.TOUCH,
        evt_el: evt.target.nodeName,
        evt_x: evt.x,
        evt_y: evt.y,
        recordTime: new Date().getTime()
      })
      return true;
    };

    /**
     * 用于存放用户 访问路由 行为的队列
     */
    UserBehavingReporter.prototype.visit = function (route) { //route={code:'',path:'',name:''}
      try{
        if(!route || route === {})    throw "Parameter cannot be empty : route !";
      }catch(err){
        console.log('%c'+err,'color:red');
        return null
      }
      this.behavings.push({
        routeCode: route.code,
        routePath: route.path,
        routeName: route.name,
        action: Actions.VISIT,
        recordTime: new Date().getTime()
      })
    };

    /**
     * 用于存放用户 离开路由 行为的队列
     */
    UserBehavingReporter.prototype.leave = function (route, stayTime) { //route={code:'',path:'',name:''}
      try{
        if(!route || route === {})    throw "Parameter cannot be empty : route !";
      }catch(err){
        console.log('%c'+err,'color:red');
        return null
      }
      this.behavings.push({
        routeCode: route.code,
        routePath: route.path,
        routeName: route.name,
        action: Actions.LEAVE,
        stayTime: stayTime || 0,
        recordTime: new Date().getTime()
      })
    };

    /**
     * 清空收集的行为队列
     */
    UserBehavingReporter.prototype.clear = function () {
        this.behavings = [];
    };

    /**
     * 发送 GET 请求。
     */
    UserBehavingReporter.prototype.send = function () {
        for (var i in this.behavings){
            var url = this.host + ':' + this.port + '/log-server/user-behaving/create?u_id='
                + encodeURIComponent(this.userId)
                + '&a_c=' + encodeURIComponent(this.applicationCode)
                + '&r_c=' + encodeURIComponent(this.behavings[i].routeCode)
                + '&r_p=' + encodeURIComponent(this.behavings[i].routePath)
                + '&r_n=' + encodeURIComponent(this.behavings[i].routeName)
                + '&ac=' + encodeURIComponent(this.behavings[i].action)
                + '&el=' + encodeURIComponent(this.behavings[i].evt_el || '')
                + '&e_x=' + encodeURIComponent(this.behavings[i].evt_x || '')
                + '&e_y=' + encodeURIComponent(this.behavings[i].evt_y || '')
                + '&ds=' + encodeURIComponent(this.behavings[i].description || '')
                + '&r_t=' + encodeURIComponent(this.behavings[i].recordTime)
                + '&s_t=' + encodeURIComponent(this.behavings[i].stayTime)
                + '&c_w=' + encodeURIComponent(this.clientWidth)
                + '&c_h=' + encodeURIComponent(this.clientHeight);

            (new Image).src = url;
        }
        this.behavings = [];
    };
    return {
        'UserBehavingReporter' : UserBehavingReporter,
        'ActionTypes' : ActionTypes
    };
});
