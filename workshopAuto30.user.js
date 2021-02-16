// ==UserScript==
// @name         workshopAuto30
// @namespace    https://https://github.com/swhoro
// @version      0.2.1
// @description  创意工坊订阅页面自动变为每页30个项目
// @author       Aiden
// @match        https://steamcommunity.com/id/*/myworkshopfiles/*
// @updateURL    https://github.com/swhoro/myJset/raw/master/workshopAuto30.user.js
// ==/UserScript==

(function () {
    var thisUrl = window.location.href;

    var urls;
    if (thisUrl.match("numperpage") == null) {
        thisUrl = thisUrl + "&numperpage=30";
        window.location.href = thisUrl;
    } else if (thisUrl.match("numperpage=10")) {
        urls = thisUrl.split("numperpage=10");
        thisUrl = urls[0] + "numperpage=30" + urls[1];
        window.location.href = thisUrl;
    } else if (thisUrl.match("numperpage=20")) {
        urls = thisUrl.split("numperpage=20");
        thisUrl = urls[0] + "numperpage=30" + urls[1];
        window.location.href = thisUrl;
    }
})();
