// ==UserScript==
// @name         steambaidupan_unlock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  万恶的steam封锁了百度盘链接，此脚本可用来解封
// @author       Aiden
// @match        https://steamcommunity.com/*
// @grant        none
// @updateURL	 https://raw.githubusercontent.com/swhoro/steambaidupan_unlock/master/main.user.js
// ==/UserScript==

(function() {

    var temp1=document.querySelector('.bb_removedlink')

    temp1.parentElement.removeChild(temp1);

    var temp2=document.querySelector('.collapsed_link')

    temp2.style.display='inline'

})();
