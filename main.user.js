// ==UserScript==
// @name         steamDuPanUnlock
// @version      0.7
// @description  万恶的steam封锁了百度盘链接，此脚本可用来解封
// @author       Aiden
// @match        https://steamcommunity.com/*
// @match        https://store.steampowered.com/*			
// @grant        none
// @updateURL	 https://github.com/swhoro/steamDuPanUnlock/raw/master/main.user.js
// ==/UserScript==

(function () {
    var uglyWhiteWords = document.getElementsByClassName("bb_removedlink");
    for (let i = 0; i < uglyWhiteWords.length; i++) {
        uglyWhiteWords[i].parentElement.removeChild(uglyWhiteWords[i]);
    }

    var fixedALabel = document.getElementsByClassName("collapsed_link");
    for (let i = 0; i < fixedALabel.length; i++) {
        fixedALabel[i].style.display = "inline";
        fixedALabel[i].href = fixedALabel[i].innerHTML;
        fixedALabel[i].target = "_blank";
    }
})();