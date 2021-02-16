// ==UserScript==
// @name         toCNY
// @namespace    https://https://github.com/swhoro
// @version      0.0.2
// @description  steam低价区价格改为人民币显示
// @author       Aiden
// @match        https://store.steampowered.com/app/*
// @updateURL    https://github.com/swhoro/myJset/raw/master/toCNY.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
    "use strict";

    let targets = document.getElementsByClassName("game_area_purchase_game");
    for (let target of targets) {
        let observer = new MutationObserver(toCNY);
        observer.observe(target, { childList: true });
    }

    // done用来判断是否已在当前页面更新过汇率
    // exrate表示汇率
    // currency表示当前页面外币
    let done = 0;
    let exrate = 0;
    let currency = "";

    function printFormate(str) {
        console.log(
            "%ctoCNY:%c " + str,
            "background: #C97546; color: #fff; border-radius: 4px;padding:2px 5px",
            "background: white"
        );
    }

    async function toCNY(mutationList, observer) {
        // block用以保存显示低价区的div
        let block = undefined;
        for (let mutation of mutationList) {
            // 没有增加的节点，下一个
            if (mutation.addedNodes == undefined) continue;
            // 循环增加的节点，查看是否有需要的
            for (let node of mutation.addedNodes) {
                if (node.className == "es_regional_container es_regional_app")
                    block = node;
            }
        }
        // 没有需要的节点，退出
        if (block == undefined) return;

        // 是否获取过当前页面外币
        if (currency == "") {
            let tcurrency = block.children[0].children[0];
            // 如果因为各种原因刷不出汇率，直接退出
            if (tcurrency == undefined) {
                printFormate("刷不出外币，退出");
                return;
            }
            // 此时tcurrency形如 ARS$ 1.899,00
            tcurrency = tcurrency.innerHTML;
            tcurrency = tcurrency.split(" ")[0];
            // 如果发现已是人民币，不执行脚本
            if (tcurrency == "¥") {
                printFormate("已是国区商店，退出");
                return;
            }
            // 最后tcurrency形如 ARS
            tcurrency = tcurrency.substr(0, tcurrency.length - 1);
            // 如果发现外币已经是CNY，跳过
            if (tcurrency == "CNY") return;
            currency = tcurrency;
        }

        // 在此页面中是否已经更新汇率
        if (done == 0) {
            exrate = GM_getValue(currency);
            printFormate("read exrate: " + exrate);

            let next_time = GM_getValue("next_time");
            let time = new Date();
            time = time.getTime();

            // 判断是否需要更新汇率
            if (exrate == undefined || time > next_time) {
                await setExrate(currency, time);
            }
            done = 1;
        }

        // 获取并修改低价区价格
        for (let child of block.children) {
            let text = child.children[0];
            // 判断是否存在外币显示
            if (text == undefined) continue;
            // 此时text形如 ARS$ 1.899,00
            text = text.innerHTML;
            text = text.split(" ");
            text[0] = "CNY¥";
            text[1] = text[1].replace(".", "").replace(",", ".");
            text[1] = parseFloat(text[1]) * exrate;
            text[1] = Math.round(text[1]);
            child.children[0].innerHTML = text[0] + " " + text[1];
        }
    }

    async function setExrate(currency, time) {
        // 获取汇率
        let baseUrl =
            "https://1841964069062455.cn-shanghai.fc.aliyuncs.com/2016-08-15/proxy/api/getCurrency/?cur=" +
            currency;
        let response = await fetch(baseUrl);
        let result = await response.text();
        exrate = Number(result);

        // 写入汇率和下次更新汇率时间
        GM_setValue(currency, exrate);
        GM_setValue("next_time", time + 3600000 * 12);
        printFormate("updat exrate: " + exrate);
    }
})();
