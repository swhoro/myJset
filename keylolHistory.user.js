// ==UserScript==
// @name         keylolHistory
// @namespace    https://github.com/swhoro
// @version      0.0.1
// @description  为keylol社区添加历史记录
// @author       Aiden
// @match        https://keylol.com/*
// @updateURL    https://github.com/swhoro/myJset/raw/master/keylolHistory.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
    // 当页面中存在iframe时，不在iframe中运行脚本
    if (window.top != window.self) return;

    let histories = GM_getValue("histories");
    if (histories == null) {
        histories = [];
    }

    let url = window.location.href;
    let testReg = new RegExp("^https://keylol.com/t\\d{6}-1-1$");

    // 当页面为某一帖子时，插入histories数组
    if (testReg.test(url)) {
        // 当出现重复帖子时，删除以前历史记录，新增一个历史记录
        histories.forEach((history, index, histories) => {
            if (history.url == url) {
                histories.splice(index, 1);
            }
        });
        let date = new Date();
        let hour = date.getHours();
        if (hour <= 9) hour = "0" + hour;
        let minute = date.getMinutes();
        if (minute <= 9) minute = "0" + minute;
        let time = "" + date.getMonth() + "月" + date.getDay() + "日 " + hour + ":" + minute;
        thisHistory = {
            url: url,
            title: document.title,
            time: time,
        };
        histories.push(thisHistory);
        GM_setValue("histories", histories);
    }

    // 插入第几个位置
    let location = 1;
    location = location - 1;
    // 创建新 历史 节点并插入文档中
    let dropdown = document.getElementsByClassName("dropdown-menu-right")[0];
    let referenceNode = dropdown.children[location];
    let historyButton = document.createElement("li");
    // historyButton.id = "history-button";
    historyButton.innerHTML = "<a>历史</a>";
    historyButton.style.cssText = `
        cursor: pointer;
    `;
    dropdown.insertBefore(historyButton, referenceNode);

    // 创建 历史 面板
    let historyPanel = document.createElement("div");
    // historyPanel.id = "history-panel";
    historyPanel.style.cssText = `
        width: 35vw;
        height: 45vh;
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        top: 13vh;
        right: 15vw;
        z-index: 99;
        background-color: white;
        border: 3px solid #C97546;
        visibility: hidden;
    `;

    // 历史记录显示区
    let historiesDisplayDiv = document.createElement("div");
    historiesDisplayDiv.id = "history-display-div";
    historiesDisplayDiv.style.cssText = `
        margin: 10px;
        height: 80%;
        overflow-y: scroll;
    `;
    let style = document.createElement("style");
    style.innerHTML = `
    div#history-display-div::-webkit-scrollbar {
        display: none;
    }
    `;
    document.getElementsByTagName("head")[0].appendChild(style);

    // 历史记录表
    let historytable = document.createElement("table");
    historytable.innerHTML =
        "<tr><th style='text-align: center;width: 20%;border-style: dotted;border-width: 0 2px 0 0;border-color: #00000059;'>时间</th><th style='text-align:center;'>标题</th></tr>";
    historytable.style.cssText = `
        width: 100%;
        border-style: dotted;
        border-width: 2px;
        border-color: black;
    `;
    histories.reverse().forEach((history) => {
        let text =
            "<tr><td title='最近浏览时间' style='text-align: center;border-style: dotted;border-width: 2px 2px 0 0;border-color: #00000059;'>" +
            history.time +
            "</td><td style='padding-left: 7px;border-style: dotted;border-width: 2px 0 0 0;border-color: #00000059;'>" +
            "<a title='" +
            history.title +
            "' target='_blank' href='" +
            history.url +
            "'><p style='width: 28vw;white-space: nowrap;line-height: 2vw;height: 2vw;overflow: hidden;text-overflow: ellipsis;'>" +
            history.title +
            "</p></a></td></tr>";
        historytable.innerHTML = historytable.innerHTML + text;
    });

    historiesDisplayDiv.appendChild(historytable);

    // 底部功能按钮区
    let functionButtons = document.createElement("div");
    functionButtons.style.cssText = `
        height: 10%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin: 0 10px 10px 10px;
    `;

    let functionButtonsStyle = `
        width: 100px;
        cursor: pointer;
        border: 2px solid #C97546;
        font-size: 15px;
        text-align:center;
     `;

    // // 自定义外观按钮
    // let settingsButton = document.createElement("div");
    // settingsButton.innerHTML = "外观设定";
    // settingsButton.style.cssText = functionButtonsStyle;
    // // 自定义外观面板
    // let settingPanel = document.createElement("div");
    // settingsButton.style.cssText = `
    //     border: 2px solid #C97546;
    // `;
    // functionButtons.appendChild(settingsButton);

    // 清空历记录按钮
    let clearButton = document.createElement("div");
    clearButton.innerHTML = "清空历史";
    clearButton.style.cssText = functionButtonsStyle;
    clearButton.addEventListener("click", () => {
        GM_setValue("histories", null);
        historytable.innerHTML =
            "<tr><th style='text-align: center;width: 20%;border-style: dotted;border-width: 0 2px 0 0;border-color: #00000059;'>最后浏览时间</th><th style='text-align:center;'>标题</th></tr>";
        alert("历史记录已清空");
    });
    functionButtons.appendChild(clearButton);

    historyPanel.appendChild(historiesDisplayDiv);
    historyPanel.appendChild(functionButtons);
    document.getElementsByTagName("body")[0].appendChild(historyPanel);

    // 监听 历史 按钮，开关 历史 面板
    historyButton.addEventListener("click", () => {
        if (historyPanel.style.visibility == "hidden") {
            historyPanel.style.visibility = "visible";
        } else {
            historyPanel.style.visibility = "hidden";
        }
    });
})();
