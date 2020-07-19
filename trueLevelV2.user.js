// ==UserScript==
// @name         trueLevel
// @version      0.0.2
// @description  真正的steam等级，排除汽车大奖赛的徽章
// @author       Aiden
// @match        https://steamcommunity.com/id/*
// @match        https://steamcommunity.com/profiles/*
// @updateUrl    https://github.com/swhoro/myjset/raw/master/trueLevelV2.user.js
// ==/UserScript==

(async function() {
  "use strict";

  async function getTrueLevel(baseUrl) {
    let homeUrl = baseUrl + "/badges";
    let carUrl = homeUrl + "/37";

    // 将纯文本HTML转化为Document
    function parseDom(str) {
      let domparser = new DOMParser();
      let doc = domparser.parseFromString(str, "text/html")
      return doc;
    }

    // 获取当前经验
    let response1 = await fetch(homeUrl);
    response1 = await response1.text();
    let dommy1 = parseDom(response1);
    let nowEXP = dommy1.querySelector("span.profile_xp_block_xp").innerHTML;
    let l1 = nowEXP.match(/\d/g);
    let str1 = "";
    l1.forEach(function(item) {
      str1 = str1 + item;
    });
    nowEXP = parseInt(str1);

    // 获取被排除的经验
    let response2 = await fetch(carUrl);
    response2 = await response2.text();
    let dommy2 = parseDom(response2);
    // 如果不存在37号徽章，直接等于trueEXP
    // 否则减去fakeEXP
    let trueEXP = 0;
    if (dommy2.querySelector("span.profile_xp_block_xp") != null)
      trueEXP = nowEXP;
    else {
      let fakeEXP = dommy2.querySelector("div.badge_info_description")
        .childNodes[3].innerHTML;
      let l2 = fakeEXP.match(/\d/g);
      let str2 = "";
      l2.forEach(function(item) {
        str2 = str2 + item;
      });
      fakeEXP = parseInt(str2);
      trueEXP = nowEXP - fakeEXP;
    }

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
    let trueLevel = headLevel + difLevel;

    // 控制台输出一些信息，返回真实等级
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
    let baseUrl = location.href;
    //获取真实等级
    let trueLevel = await getTrueLevel(baseUrl);

    // 插入真实等级到等级后面
    let trueLevelP = document.createElement("p");
    trueLevelP.innerHTML = trueLevel + "级";
    trueLevelP.title = "真实等级";
    trueLevelP.style.cssText = "display:inline;margin-left:10px;color:#C97546;";
    let levelDiv = document.querySelector("div.persona_level");
    levelDiv.appendChild(trueLevelP);
  }

    // 判断是否处于好友页面
    if (regFriends.test(URL)) {
      // 获取所有的好友block
      let allFriends = document.querySelectorAll("div.friend_block_v2");
      // 为每个好友block添加等级
      allFriends.forEach(async function(item) {
        // 获取steamid
        let baseUrl = item.childNodes[3].href;
        let trueLevel = await getTrueLevel(baseUrl);

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
