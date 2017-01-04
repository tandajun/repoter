/**
 * Created by zhangye on 16/11/7.
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
})('YonReporter', function () {
    var YonReporter = function (options) {
        this.userid = options.userid;
    };

    /**
     * 当前屏幕的分辨率
     * @returns {string}
     */
    YonReporter.prototype.resolution = function () {
        var html = document.documentElement;
        return Math.max(html.clientWidth, window.innerWidth || 0) + 'x' + Math.max(html.clientHeight, window.innerHeight || 0)
    };

    /**
     * 自动记录用户名、IP、时间戳。
     * 压缩参数（每个参数精简为 2-3 个字母）。
     *
     * @param where
     * @param doing
     * @param thing
     */
    YonReporter.prototype.track = function (where, doing, thing) {
        var info = {
            location: location.href,
            referrer: document.referrer
        };
    };

    /**
     * 发送 GET 请求。
     */
    YonReporter.prototype.exec = function () {

    };

    /**
     * 收集信息的类型
     * @type {{PLATFORM: string, USER_BEHAVIOUR: string}}
     */
    YonReporter.category = {
        PLATFORM : 'platform', // 客户端平台信息
        USER_BEHAVIOUR: 'user_behaviour' // 客户端用户行为信息
    };

    return YonReporter;
});