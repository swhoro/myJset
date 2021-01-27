// ==UserScript==
// @name         trueLevel
// @version      0.0.2
// @description  真正的steam等级，排除汽车大奖赛的徽章
// @author       Aiden
// @match        https://steamcommunity.com/id/*
// @match        https://steamcommunity.com/profiles/*
// @updateUrl    https://github.com/swhoro/myJset/raw/master/trueLevel.user.js
// ==/UserScript==

(async function () {
    "use strict";

    // 请在此处填写steam api，否则无法运行脚本
    // 可从https://steamcommunity.com/dev/apikey获取api key
    var api = "";
    if (api == "") return;

    async function getTrueLevel(steamid) {
        let baseUrl =
            "https://api.steampowered.com/IPlayerService/GetBadges/v1/";
        let Url = baseUrl + "?key=" + api + "&steamid=" + steamid;

        let response = await fetch(Url);
        response = await response.json();
        response = response.response;

        let trueLevel = 0;
        let badges = response.badges;
        let nowEXP = response.player_xp;
        let fakeBadge = "";

        // 查找排除的勋章
        for (let i = 0; i < badges.length; i++) {
            if (badges[i].badgeid == 37) {
                fakeBadge = badges[i];
                break;
            }
        }

        // 计算真实经验值
        let trueEXP = 0;
        if (fakeBadge == "") trueEXP = nowEXP;
        else trueEXP = nowEXP - fakeBadge.xp;
        // 计算真实等级
        let t = (Math.sqrt(1 + (8 * trueEXP) / 1000) - 1) / 2;
        // t代表等级的去掉个位数的部分
        // 如0 ~ 10级时t为0，10 ~ 20级时t为1，2880 ~ 2890级时t为288
        t = parseInt(t);
        // eachEXP时在此区间内（如上所述10级一区间），每级所需经验值
        let eachEXP = 100 * (t + 1);
        // headEXP为区间内首项等级经验值，如t=0时为0级所需经验值（为0），t=288时为2880级所需经验值（为41616000）
        let headEXP = (1000 * (1 + t) * t) / 2;
        let headLevel = 10 * t;
        let difEXP = trueEXP - headEXP;
        let difLevel = parseInt(difEXP / eachEXP);
        trueLevel = headLevel + difLevel;

        // 控制台输出一些信息，返回真实等级
        console.log(steamid);
        console.log(fakeBadge);
        console.log("nowEXP = " + nowEXP);
        console.log("trueEXP = " + trueEXP);
        console.log("trueLevel = " + trueLevel);
        return trueLevel;
    }

    // 是否处于个人页面规则
    let regProfile = new RegExp(
        "^(https://steamcommunity.com/)((id/)|(profiles/))[^/]*(/?)$"
    );
    // 是否处于好友页面规则
    let regFriends = new RegExp(
        "^(https://steamcommunity.com/)((id/)|(profiles/))[^/]*/friends(/?)$"
    );
    let URL = location.href;

    // 判断是否处于个人页面
    if (regProfile.test(URL)) {
        // 查找steamid
        let nodes = document.querySelector("form#abuseForm").childNodes;
        let steamid = "";
        nodes.forEach(function findName(item) {
            if (item.name == "abuseID") steamid = item.value;
        });

        //获取真实等级
        let trueLevel = await getTrueLevel(steamid);

        // 插入真实等级到等级后面
        let trueLevelP = document.createElement("p");
        trueLevelP.innerHTML = trueLevel + "级";
        trueLevelP.title = "真实等级";
        trueLevelP.style.cssText =
            "display:inline;margin-left:10px;color:#C97546;";
        let levelDiv = document.querySelector("div.persona_level");
        levelDiv.appendChild(trueLevelP);
    }

    // 判断是否处于好友页面
    if (regFriends.test(URL)) {
        // 获取所有的好友block
        let allFriends = document.querySelectorAll("div.friend_block_v2");
        // 为每个好友block添加等级
        allFriends.forEach(async function (item) {
            // 获取steamid
            let steamid = item.getAttribute("data-steamid");
            let trueLevel = await getTrueLevel(steamid);

            // 插入真实等级到好友block右边
            let trueLevelP = document.createElement("p");
            trueLevelP.innerHTML = trueLevel + "级";
            trueLevelP.title = "真实等级";
            trueLevelP.style.cssText = `
        display:block;
        color:#C97546;
        position:absolute;
        top:0;right:0;
        height:48px;
        margin:0;
        padding-right:5px;
        line-height:48px;
        font-size:15px`;
            item.appendChild(trueLevelP);
        });
    }
})();
