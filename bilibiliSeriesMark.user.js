// ==UserScript==
// @name         bilibiliSeriesMark
// @namespace    https://https://github.com/swhoro
// @version      0.0.1
// @description  bilibili系列视频一键收藏
// @author       Aiden
// @match        https://space.bilibili.com/*/channel/seriesdetail?sid=*
// @updateUrl    https://github.com/swhoro/myJset/raw/master/bilibiliSeriesMark.user.js
// ==/UserScript==

(function () {
    "use strict";

    const url = new URL(window.location.href);
    // 合集id
    const sid = url.searchParams.get("sid");
    // 合集作者
    const uid = url.pathname.split("/")[1];
    // 合集名
    const series_name = document.getElementsByClassName("item cur")[0].innerHTML;

    const get_cookie = (name) => {
        let cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].split("=");
            cookie[0] = cookie[0].trim();
            if (cookie[0] === name) {
                console.log(true);
                return cookie[1];
            }
        }
    };
    //  当前登录用户 我 的验证信息
    const csrf = get_cookie("bili_jct");

    // add a button
    const page_head = document.getElementsByClassName("page-head")[0];
    const rel = page_head.children[1];
    const button = document.createElement("a");
    // 什么傻逼class名，play打错了可还行
    button.className = "paly-all-btn";
    button.textContent = "一键收藏";
    button.style.cssText = `
        right: 6rem;
        display: block;
        text-align: center;
        width: 65px;
    `;
    page_head.insertBefore(button, rel);

    button.onclick = async () => {
        // 获取合集所有视频
        const series_videos = (
            await fetch(
                `https://api.bilibili.com/x/series/archives?mid=${uid}&series_id=${sid}&only_normal=true&sort=desc&pn=1&ps=99999`
            ).then((r) => r.json())
        )["data"]["archives"];

        // 创建收藏夹，获取新收藏夹id
        const fav_id = (
            await fetch("https://api.bilibili.com/x/v3/fav/folder/add", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: `title=${series_name}&csrf=${csrf}&privacy=0`
            }).then((r) => r.json())
        )["data"]["id"];

        const [progress, sure_button] = create_progress(series_videos.length);

        const sleep = (timeout) =>
            new Promise((resolve) => {
                setTimeout(resolve, timeout);
            });

        for (let i = 0; i < series_videos.length; i++) {
            while (true) {
                const response = await fetch("https://api.bilibili.com/x/v3/fav/resource/deal", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: `rid=${series_videos[i]["aid"]}&add_media_ids=${fav_id}&type=2&csrf=${csrf}`
                }).then((r) => r.json());

                if (response["code"] === 0) {
                    progress.textContent = (i + 1).toString();
                    if (parseInt(progress.textContent) === series_videos.length)
                        // @ts-ignore
                        sure_button.disabled = false;
                    break;
                } else await sleep(2000);
            }
        }
    };

    const create_progress = (all_num) => {
        const _mask = document.createElement("div");
        _mask.style.cssText = `
            position: absolute;
            top: 0;
            background: rgba(0, 0, 0, 0.65);
            height: 100vh;
            width: 100vw;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10102;
        `;

        const _container = document.createElement("div");
        _container.style.cssText = `
            width: 420px;
            background-color: white;
            border-radius: 4px;
            padding: 40px;
        `;
        _mask.appendChild(_container);

        const _title = document.createElement("p");
        _title.textContent = "收藏进度";
        _title.style.cssText = `
            height: 50px;
            line-height: 50px;
            font-size: 40px;
            text-align: center;
            margin-bottom: 30px;
        `;
        _container.appendChild(_title);

        const _progress_wrapper = document.createElement("div");
        _progress_wrapper.style.cssText = `
            text-align: center;
            font-size: 30px;
            margin-bottom: 30px;
            height: 50px;
            line-height: 50px;
        `;
        _container.appendChild(_progress_wrapper);

        const _progress = document.createElement("span");
        _progress.textContent = "0";
        _progress_wrapper.appendChild(_progress);

        const _mid = document.createElement("span");
        _mid.textContent = "  /  ";
        _progress_wrapper.appendChild(_mid);

        const _all = document.createElement("span");
        _all.textContent = all_num.toString();
        _progress_wrapper.appendChild(_all);

        const _button = document.createElement("button");
        _button.disabled = true;
        _button.textContent = "确定";
        _button.style.cssText = `
            font-size: 14px;
            width: 160px;
            height: 40px;
            margin: 0 auto;
            display: block;
            background: #00AEEC;
            border: none;
            border-radius: 4px;
            color: white;
            cursor: pointer;
        `;
        _container.appendChild(_button);

        _button.onclick = () => {
            _mask.remove();
        };

        document.getElementsByTagName("body")[0].appendChild(_mask);

        return [_progress, _button];
    };
})();
