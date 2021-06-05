// ==UserScript==
// @name         hbKeyGetter
// @namespace    https://https://github.com/swhoro
// @version      0.0.2
// @description  将hb key复制到剪切板
// @author       Aiden
// @match        https://www.humblebundle.com/downloads?key=*
// @updateUrl     https://github.com/swhoro/myJset/raw/master/hbKeyGetter.user.js
// ==/UserScript==

(function () {
    let button = document.createElement("button");
    button.innerHTML = "复制key到剪切板";
    button.style.cssText = `
        position: fixed;
        right: 10%;
        bottom: 10%;
        background-color: white;
    `;
    document.getElementsByTagName("body")[0].appendChild(button);

    button.addEventListener("click", () => {
        let text = getKeys();
        // console.log(text);
        navigator.clipboard.writeText(text).then(() => {
            alert("已复制到剪切板");
        });
    });

    function getKeys() {
        let text = "";
        let keyContainers = document.getElementsByClassName("key-container")[0].children;
        for (let element of keyContainers) {
            let games = element.getElementsByClassName("key-list")[0].children;
            for (let game of games) {
                // game class为key-redeemer
                let name = game.children[0].children[0].innerHTML.slice(0, -6);
                let code = game.children[1].children[0].title;
                text = text + name + " " + code + "\r\n";
            }
        }
        return text;
    }
})();
