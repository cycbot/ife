/**
 * Created by cycbot on 2017/4/23.
 */
const page = require('webpage').create();

//设置查询关键字
var key = 'ife';
//设置请求url
const searchUrl = 'https://www.baidu.com/s?wd=' + encodeURIComponent(key);

const startTime = new Date();

//抓取
page.open(searchUrl, function (status) {
    var result = null;
    if (status !== 'success') {
        result = {
            code: 0,
            msg: '抓取失败',
            word: key,
            time: new Date() - startTime
        }
    } else {
        const dataList = page.evaluate(function () {
            //若成功将结果格式化打印
            var resultList = document.querySelectorAll('.result');
            var arr = [];
            for (var i = 0, len = resultList.length; i < len; i++) {
                var item = resultList[i];
                arr.push({
                    title: item.querySelector('.t').innerText,
                    info: item.querySelector('.c-abstract').innerText,
                    link: item.querySelector('.t > a').href,
                    pic: item.querySelector('.c-img') ? item.querySelector('.c-img').src : '没有图片'
                })
            }
            return arr;
        });
        result = {
            code: 1,
            msg: '抓取成功',
            word: key,
            time: new Date() - startTime,
            dataList: dataList
        }
    }
    phantom.outputEncoding = 'utf8';
    console.log(JSON.stringify(result, null, 4));
    phantom.exit();
});