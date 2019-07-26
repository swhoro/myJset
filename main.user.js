// ==UserScript==
// @name         steambaidupan_unlock
// @version      0.5
// @description  万恶的steam封锁了百度盘链接，此脚本可用来解封
// @author       Aiden
// @match        https://steamcommunity.com/*
// @grant        none
// @updateURL	 https://raw.githubusercontent.com/swhoro/steambaidupan_unlock/master/main.user.js
// ==/UserScript==

(function () {
    var uglyWhiteWords = document.querySelector(".bb_removedlink");
    uglyWhiteWords.parentElement.removeChild(temp1);

    var fixedALabel = document.querySelector(".collapsed_link");
    fixedALabel.style.display = "inline";
    fixedALabel.href = fixedALabel.innerHTML;
    fixedALabel.target = "_blank";
})();