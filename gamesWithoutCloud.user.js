// ==UserScript==
// @name         gamesWithoutCloud
// @version      0.0.1
// @description  找寻没有云存档的游戏
// @author       Aiden
// @match        https://steamcommunity.com/id/*/games/*
// @match        https://steamcommunity.com/profile/*/games/*
// @grant        GM_xmlhttpRequest
// @updateURL	 https://github.com/swhoro/myJset/raw/master/gamesWithoutCloud.user.js
// ==/UserScript==

window.onload = (function () {
    "use strict";

    // 无云存档游戏列表和读取失败游戏列表
    let gamesWithoutCloud = [];
    let gamesFailed = [];

    //  获取页面所有游戏
    let games = document.querySelectorAll('div[id^="links_dropdown_"]');

    let promiseArr = [];
    for (let i = 0; i < games.length; i++) {
        let popupBody = games[i].getElementsByClassName("popup_body2")[0];
        let url = popupBody.children[0].href;
        let gameID = url.split("/")[url.split("/").length - 1];
        promiseArr.push(
            new Promise((res) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    context: {
                        gameID: gameID,
                    },
                    synchronous: true,
                    onload: (response) => {
                        haveCloud(response);
                        res(true);
                    },
                });
            })
        );
    }

    Promise.all(promiseArr).then(() => {
        console.log("以下游戏没有云存档：");
        gamesWithoutCloud.forEach((item) => {
            console.log(item);
        });

        console.log("以下游戏读取失败：");
        gamesFailed.forEach((item) => {
            console.log(item);
        });
    });

    function haveCloud(response) {
        console.log("读取游戏 %s", response.context.gameID);

        let doc = parseDom(response.responseText);
        try {
            let items = doc.getElementById("category_block").children;
            //   遍历右侧信息栏
            for (let i = 0; i < items.length; i++)
                if (
                    (items[i].className == "game_area_details_specs") &
                    (items[i].lastChild.innerHTML == "Steam 云")
                )
                    return;
        } catch (error) {
            // 若读取游戏失败，加入失败游戏列表
            console.log("读取游戏 %s 失败", response.context.gameID);
            console.log(error);
            gamesFailed.push(response.context.gameID);
            return;
        }

        //  若没有云存档，则加入数组
        let gameName = doc.getElementsByClassName("apphub_AppName")[0]
            .innerText;
        gamesWithoutCloud.push(gameName);
    }

    function parseDom(str) {
        let domparser = new DOMParser();
        let doc = domparser.parseFromString(str, "text/html");
        return doc;
    }
})();
