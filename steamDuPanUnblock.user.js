// ==UserScript==
// @name         steamDuPanUnblock
// @version      1.1
// @description  万恶的steam封锁了百度盘链接，此脚本可用来解封
// @author       Aiden
// @match        https://steamcommunity.com/*
// @match        https://store.steampowered.com/*
// @updateURL	 https://github.com/swhoro/myjset/raw/master/steamDuPanUnblock.user.js
// ==/UserScript==

(function () {
	'use strict';

    //用来恢复至正常的链接
    function fixLinks(temp) {
        if (temp == "normal") {
            temp = document;
        };

        //去除｛链接已删除｝字样
        var uglyWhiteWords = temp.getElementsByClassName("bb_removedlink");
        while (uglyWhiteWords.length != 0) {
            uglyWhiteWords[0].parentElement.removeChild(uglyWhiteWords[0]);
        }

        //恢复度盘链接显示
        var fixedALabel = temp.getElementsByClassName("collapsed_link");
        for (let i = 0; i < fixedALabel.length; i++) {
            fixedALabel[i].style.display = "inline";
            fixedALabel[i].href = fixedALabel[i].innerHTML;
            fixedALabel[i].target = "_blank";
        };
    }

    //对于评论页面与商店页面，可能无法加载完成
    //此时添加observer用来观察是否新加载了评论
    function haveAnObserve(idName) {
        //创建observeer，若新加载了评论，执行恢复链接函数
        var observer = new MutationObserver(function (chosen) {
            for (let element of chosen) {
                fixLinks(element.target);
            };
        });

        //将observer绑定至评论区，观察是否有子节点变化
        observer.observe(document.getElementById(idName), {
            childList: true
        });
    }

    //提取当前页面链接
    var thisLink = location.href;
    //判断当前处于评论页面或商店页面
    //根据据页面的不同传递不同的评论区div id
    if (/reviews/.test(thisLink)) {
        haveAnObserve("AppHubCards");
    } else if (/steampowered.com/.test(thisLink)) {
        haveAnObserve("Reviews_summary");
    }
    //不管是否处于以上两个页面，均会执行一次恢复链接函数
    fixLinks("normal");
})();
