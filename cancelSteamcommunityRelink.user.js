// ==UserScript==
// @name         cancelSteamcommunityRelink
// @version      0.0.4
// @description  取消steam社区访问外部网站时的跳转页面
// @author       Aiden
// @match        https://steamcommunity.com/linkfilter/?url=*
// @updateUrl     https://github.com/swhoro/myJset/raw/master/cancelSteamcommunityRelink.user.js
// ==/UserScript==

(function () {
    "use strict";

    var thisurl = location.href;
    var trueurl = thisurl.substr(thisurl.indexOf("=") + 1);
    location.href = trueurl;
})();
