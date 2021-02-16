// ==UserScript==
// @name         osu!下载不含视频文件
// @namespace    https://https://github.com/swhoro
// @version      0.0.3
// @description  为osu!搜索页面添加一个下载不需视频文件的按钮
// @author       Aiden
// @match        https://osu.ppy.sh/beatmapsets?q=*
// @updateUrl    https://github.com/swhoro/myJset/raw/master/osu.user.js
// ==/UserScript==

window.onload = function () {
    "use strict";

    function addAButton(target = document) {
        let items = target.querySelectorAll("div.beatmapset-panel__icons-box");

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.firstChild.title == "下载") continue;
            let newItem = item.cloneNode(true);
            newItem.firstChild.title = "下载不包含视频";
            newItem.firstChild.href = item.firstChild.href + "?noVideo=1";
            newItem.firstChild.setAttribute(
                "data-orig-title",
                "下载不包含视频"
            );
            newItem.style = "margin-left: 4px;";
            item.parentElement.appendChild(newItem);
        }
    }

    addAButton();

    function callback(mutationlists, observer) {
        mutationlists.forEach((mutationlist) => {
            mutationlist.addedNodes.forEach((node) => {
                addAButton(node.firstChild);
                addAButton(node.lastChild);
            });
        });
    }

    var observer = new MutationObserver(callback);
    observer.observe(document.querySelector("div.beatmapsets__items"), {
        childList: true,
    });
};
