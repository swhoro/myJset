// ==UserScript==
// @name         osu!下载不含视频文件
// @version      0.0.1
// @description  为osu!添加一个不快速下载不需视频文件得按钮
// @author       Aiden
// @match        https://osu.ppy.sh/beatmapsets?q=*
@updateUrl    https://github.com/swhoro/myJset/raw/master/osu.user.js
// ==/UserScript==

window.onload = function() {
  "use strict";

  function addAButton(target = document) {
    let i = target.querySelectorAll("div.beatmapset-panel__icons-box");

    i.forEach(function(item) {
      let newItem = item.cloneNode(true);
      newItem.firstChild.title = "下载不包含视频";
      newItem.firstChild.href = item.href + "?noVideo=1";
      newItem.firstChild.setAttribute("data-orig-title", "下载不包含视频")
      newItem.style="margin-left: 4px;"
      item.parentElement.appendChild(newItem);
    });
  }

  addAButton();

  function callback(mutationlists, observer) {
    mutationlists.forEach(mutationlist => {
      mutationlist.addedNodes.forEach(node => {
        addAButton(node.firstChild);
        addAButton(node.lastChild);
      });
    });
  }

  var observer = new MutationObserver(callback);
  observer.observe(document.querySelector("div.beatmapsets__items"), {
    childList: true
  });
};
