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
        for (let i = 0; i < histories.length; i++) {
            if (histories[i].url == url) {
                histories.splice(i, 1);
                break;
            }
        }
        let date = new Date();
        let hour = date.getHours();
        if (hour <= 9) hour = "0" + hour;
        let minute = date.getMinutes();
        if (minute <= 9) minute = "0" + minute;
        let time = "" + date.getMonth() + "月" + date.getDay() + "日 " + hour + ":" + minute;
        let thisHistory = {
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
    historyButton.innerHTML = "<a>历史</a>";
    historyButton.style.cssText = `
        cursor: pointer;
    `;
    dropdown.insertBefore(historyButton, referenceNode);

    // 创建 历史 面板
    let historyPanel = document.createElement("div");
    historyPanel.style.cssText = `
        width: 35vw;
        height: 45vh;
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        top: 12vh;
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
        width: calc(100% - 20px);
        max-height: 80%;
        overflow-y: scroll;
        border-style: dotted;
        border-width: 2px;
        border-color: black;
    `;
    let myStyle = document.createElement("style");
    myStyle.innerHTML = `
        div#history-display-div::-webkit-scrollbar {
            display: none;
        }
    `;
    document.getElementsByTagName("head")[0].appendChild(myStyle);

    // 历史记录表
    let historyTable = document.createElement("table");
    historyTable.style.cssText = `
        table-layout: fixed;
        width: 100%;
    `;

    let headTime = document.createElement("th");
    headTime.style.cssText = `
        height: 1.5vw;
        text-align: center;
        border-style: dotted;
        border-width: 0 2px 0 0;
        border-color: #00000059;
    `;
    headTime.innerHTML = "时间";
    let headTr = document.createElement("tr");
    headTr.appendChild(headTime);

    let headTitle = document.createElement("th");
    headTitle.style.cssText = `
        width: 80%;
        text-align:center;
    `;
    headTitle.innerHTML = "标题";
    headTr.appendChild(headTitle);
    historyTable.appendChild(headTr);

    histories.reverse().forEach((history) => {
        let tdTime = document.createElement("td");
        tdTime.title = "最后浏览时间";
        tdTime.style.cssText = `
            text-align: center;
            border-style: dotted;
            border-width: 2px 2px 0 0;
            border-color: #00000059;
        `;
        tdTime.innerHTML = history.time;
        let tr = document.createElement("tr");
        tr.appendChild(tdTime);

        let p = document.createElement("p");
        p.style.cssText = `
            line-height: 1.7vw;
            height: 1.7vw;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `;
        p.innerHTML = history.title;

        let a = document.createElement("a");
        a.href = history.url;
        a.target = "_blank";

        a.appendChild(p);

        let tdTitle = document.createElement("td");
        tdTitle.title = history.title;
        tdTitle.style.cssText = `
            width: 80%;
            padding-left: 7px;
            border-style: dotted;
            border-width: 2px 0 0 0;
            border-color: #00000059;
        `;
        tdTitle.appendChild(a);
        tr.appendChild(tdTitle);
        historyTable.appendChild(tr);
    });
    historiesDisplayDiv.appendChild(historyTable);

    // 底部功能按钮区
    let functionButtonsPanel = document.createElement("div");
    functionButtonsPanel.style.cssText = `
        width: 100%;
        display: flex;
        justify-content: space-evenly;
        margin: 0 10px 10px 10px;
    `;

    let functionButtonsStyle = `
        width: 6vw;
        cursor: pointer;
        border: 2px solid #C97546;
        font-size: 1.1rem;
        line-height: 1.3rem;
        text-align:center;
        background-color: white;
    `;

    // 清空历记录按钮
    let clearButton = document.createElement("button");
    clearButton.innerHTML = "清空历史";
    clearButton.style.cssText = functionButtonsStyle;
    clearButton.addEventListener("click", () => {
        GM_setValue("histories", null);
        while (historyTable.children.length > 1) {
            historyTable.removeChild(historyTable.children[1]);
        }
        alert("历史记录已清空");
    });
    functionButtonsPanel.appendChild(clearButton);

    historyPanel.appendChild(historiesDisplayDiv);
    historyPanel.appendChild(functionButtonsPanel);
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
