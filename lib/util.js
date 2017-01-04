/**
 * Created by APP on 2016/11/18.
 */

function Ajax(options) {
    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.dataType = options.dataType || "json";
    var params = formatParams(options.data);

    //创建 - 非IE6 - 第一步
    if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
    } else { //IE6及其以下版本浏览器
        var xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    //接收 - 第三步
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var status = xhr.status;
            if (status >= 200 && status < 300) {
                options.success && options.success(xhr.responseText, xhr.responseXML);
            } else {
                options.fail && options.fail(status);
            }
        }
    }

    //连接 和 发送 - 第二步
    if (options.type == "GET") {
        xhr.open("GET", options.url + "?" + params, true);
        xhr.send(null);
    } else if (options.type == "POST") {
        xhr.open("POST", options.url, true);
        //设置表单提交时的内容类型
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        //设置请求头
        if (!isEmptyObject(options.headers)){
            for (var i in options.headers){
                xhr.setRequestHeader(i, options.headers[i])
            }
        }
        xhr.send(params);
    }
}
//格式化参数
function formatParams(data) {
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    arr.push(("v=" + Math.random()).replace(".",""));
    return arr.join("&");
}
//判断空对象
function isEmptyObject(o) {
   var t;
   for (t in o){
       return false
   }
   return true
}
//时间格式化
function DateFormat(date, fmt) {
    if (date instanceof Date){
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    return false
}


module.exports = {
    Ajax: Ajax,
    DateFormat: DateFormat
};