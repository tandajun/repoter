/**
 * Created by zhangye on 16/11/7.
 */
var Reporter = require('./index');

/**
 * 具备信息队列，当达到指定数目后，自动提交。
 */
var reporter = new Reporter({host: 'm.piaoeda.com', port: 8080, userId: ''});

/**
 * 如果没有配置 userid，则提示开发者在函数中传递 userid。
 * 用于在登录后，配置 reporter。
 */
reporter.config({
    userId: ''
});

/**
 * 发送用户的平台信息（浏览器、操作系统）
 */
reporter.send('platform', {
    resolution: reporter.resolution()
});


reporter.send('platform', {}, function (result) {

});

/**
 * 如果已经配置了 userid，则第一个参数不用传递 userid。
 * 自动记录时间，当前鼠标位置。
 */
reporter.track('location', 'event:click/change/visit', {
    el: 'button:food-category;input:name',
    reason: '',
    attachments: {}
});

reporter.track('location', 'event:click/change/visit', {
    el: 'link:food-category',
    reason: '',
    attachments: {}
});

/**
 * 记录用户的错误
 */
reporter.track('location', 'error:network/query/[action]', {
    errorDescription: {
        code: '',
        message: ''
    },
    reason: ''
});

/**
 * 如具体登录、查询等行为。用户活跃数。
 */
reporter.track('location://pc/**', 'action:register/forget-pwd/login/logout/search/start/', {

});

reporter.track('location://mobile/**', 'action:list/get-detail/save/update/delete/login/logout/register', {});

/**
 * 查询接口。
 */
reporter.query();