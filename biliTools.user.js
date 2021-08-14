// ==UserScript==
// @name          biliTools
// @namespace     https://https://github.com/swhoro
// @version       0.0.1
// @description   一些bilibili小功能
// @author        Aiden
// @match         https://www.bilibili.com/*
// @updateUrl     https://github.com/swhoro/myJset/raw/master/biliTools.user.js
// ==/UserScript==

// 番剧页面选择剧集不再新标签页打开
(() => {
    let url = window.location.href;
    let reg = new RegExp("^https://www.bilibili.com/bangumi/media/\\S*$");
    if (reg.test(url)) {
        console.log("bili tool is running!");
        let buttons = document.getElementsByClassName("season-slider-list")[0].children;
        for (let button of buttons) {
            let a = button.getElementsByTagName("a")[0];
            if (a) {
                a.target = "_self";
            }
        }
    }
})();
