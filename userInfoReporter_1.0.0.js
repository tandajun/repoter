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
})('UserInfoReporter', function () {
    var platform = require('platform');
    //platform.js获取不到PC端信息时
    if(platform.product){
        var t = window.navigator.userAgent;
        platform.product = t.substring(t.indexOf('(')+1,t.indexOf(';'));
    }
    var UserInfoReporter = function (options) {
        this.host = options.host || 'http://localhost';
        this.port = options.port || '80';
        this.userId = options.userId;
        this.application = {
            terminalType: options.application.terminalType,
            code: options.application.code,
            name: options.application.name
        };
        this.model = options.model || platform.product;
        this.clientHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        this.clientWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.recordTime = new Date().getTime();
    };

    /**
     * 当前屏幕的分辨率
     * @returns {string}
     */
    UserInfoReporter.prototype.resolution = function () {
        var html = document.documentElement;
        return Math.max(html.clientWidth, window.innerWidth || 0) + 'x' + Math.max(html.clientHeight, window.innerHeight || 0)
    };
    /**
     * 当前客户端信息
     * @returns {string}
     */
    /*  不想让暴露的在原型中的属性被修改
        Object.defineProperties(UserInfoReporter.prototype,{
        name: { value: platform.name, writable: false },
        version : { value: platform.version, writable: false },
        layout : { value: platform.layout, writable: false },
        manufacturer : { value: platform.manufacturer, writable: false },
        product : { value: platform.product, writable: false },
        userAgent : { value: platform.ua, writable: false },
        os : { value: platform.os, writable: false }
    });*/
    UserInfoReporter.prototype.pName = platform.name;
    UserInfoReporter.prototype.pVersion = platform.version;
    UserInfoReporter.prototype.pLayout = platform.layout;
    UserInfoReporter.prototype.pManufacturer = platform.manufacturer;
    UserInfoReporter.prototype.pProduct = platform.product;
    UserInfoReporter.prototype.pUserAgent = platform.ua;
    UserInfoReporter.prototype.pOs = platform.os;

    /**
     * 发送 GET 请求。
     */
    UserInfoReporter.prototype.send = function () {
        var url = this.host + ':' + this.port + '/log-server/user-info/create?u_id='
                + encodeURIComponent(this.userId)
                + '&a_t=' + encodeURIComponent(this.application.terminalType)
                + '&a_c=' + encodeURIComponent(this.application.code)
                + '&a_n=' + encodeURIComponent(this.application.name)
                + '&md='  + encodeURIComponent(this.model)
                + '&r_t=' + encodeURIComponent(this.recordTime)
                + '&n='   + encodeURIComponent(this.pName)
                + '&vs='  + encodeURIComponent(this.pVersion)
                + '&lo='  + encodeURIComponent(this.pLayout)
                + '&mf='  + encodeURIComponent(this.pManufacturer)
                + '&pd='  + encodeURIComponent(this.pProduct)
                + '&ch='  + encodeURIComponent(this.clientHeight)
                + '&cw='  + encodeURIComponent(this.clientWidth)
                + '&ua='  + encodeURIComponent(this.pUserAgent)
                + '&os_a=' + encodeURIComponent(this.pOs.architecture)
                + '&os_f=' + encodeURIComponent(this.pOs.family)
                + '&os_v=' + encodeURIComponent(this.pOs.version);
        (new Image).src = url;
    };
    return UserInfoReporter;
});
