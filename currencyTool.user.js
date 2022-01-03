// ==UserScript==
// @name         currencyTool
// @namespace    https://https://github.com/swhoro
// @version      0.0.3
// @description  在部分页面上创建一个汇率转换工具
// @author       Aiden
// @match        https://steamdb.info/*
// @match        https://store.steampowered.com/app/*
// @match        https://keylol.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @updateURL	 https://github.com/swhoro/myJset/raw/master/currencyTool.user.js
// ==/UserScript==

(function () {
    "use strict";

    let exrate = GM_getValue("ARS");
    let updateTime = GM_getValue("update_time");
    let thisTime = new Date();
    thisTime = thisTime.getTime();
    // 汇率或updatetime不存在，初始化脚本
    if (!exrate || !updateTime || thisTime >= updateTime) {
        setExrate("ARS", thisTime);
    }

    async function setExrate(currency, time) {
        // 获取汇率
        let url = "https://1841964069062455.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/api/getCurrency/?cur=" + currency;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            synchronous: true,
            onload: (response) => {
                console.log("response is: ", response);
                exrate = Number(response.responseText);

                // 写入汇率和下次更新汇率时间
                GM_setValue(currency, exrate);
                GM_setValue("update_time", time + 3600 * 1000 * 12);
            },
        });
    }

    let div = document.createElement("div");
    div.style.cssText = `
        position: fixed;
        top: 10%;
        right: 0;
        width: 150px;
        z-index: 99;
        display: grid;
        grid-template-columns: 1fr;
    `;
    let showDiv = document.createElement("div");
    let show = document.createElement("button");
    show.innerHTML = "<";
    show.style.cssText = `
        width: 20px;
        color: white;
        position: relative;
        left: 130px;
        padding: 1px;
        margin-bottom: 2px;
        background-color: #161a21;
    `;
    showDiv.appendChild(show);
    div.appendChild(showDiv);
    // 计算汇率面板
    let calculateDiv = document.createElement("div");
    calculateDiv.style.cssText = `
        width: 100%;
        display: none;
        background-color: rgb(59, 59, 59);
        grid-template-columns: 1fr 1fr;
    `;
    let input = document.createElement("input");
    input.placeholder = "阿根廷比索";
    input.style.cssText = `
        width: 100px;
        height: 38px;
        border-style: solid;
        border-width: 0 0 2px 0;
        border-radius: 2px;
        padding-left: 5px;
        background-color: #161a21;
        color: white;
    `;
    let go = document.createElement("button");
    go.innerHTML = "GO!";
    go.style.cssText = `
        color: #C97546;
        border-style: solid;
        border-width: 0 0 2px 2px;
        border-radius: 2px;
        cursor: pointer;
    `;
    let result = document.createElement("p");
    result.style.cssText = `
        display: block;
        margin: 0;
        height: 34px;
        padding-left: 5px;
        line-height: 34px;
        background-color: #161a21;
        color: white;
    `;
    calculateDiv.appendChild(input);
    calculateDiv.appendChild(go);
    calculateDiv.appendChild(result);
    div.appendChild(calculateDiv);
    document.getElementsByTagName("body")[0].appendChild(div);

    show.addEventListener("click", () => {
        if (calculateDiv.style.display == "none") {
            calculateDiv.style.display = "grid";
            show.innerHTML = ">";
        } else {
            calculateDiv.style.display = "none";
            show.innerHTML = "<";
        }
    });

    go.addEventListener("click", () => {
        result.innerHTML = (Number(input.value) * exrate).toFixed(1) + " RMB";
    });
})();
