// ==UserScript==
// @name         scrollUp
// @version      0.2
// @description  为steam相关页面创建一个返回顶部按钮
// @author       Aiden
// @match        https://store.steampowered.com/*
// @match        https://steamcommunity.com/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @updateUrl    https://github.com/swhoro/myjset/raw/master/scrollUp.user.js 
// ==/UserScript==

(function() {
    'use strict';

    //创建一个按钮div，id为btn-scrollUp
    var myScrollUp = document.createElement("div");
    //自定义按钮样式
    myScrollUp.style.cssText = `
    	position:fixed;
    	bottom:5%;
    	right:0.5%;
    	width:60px;
    	height:60px;
    	background-color:#171a21;
    	border-radius:6px;
    	cursor:pointer;
    	z-index:99`;
    //设置按钮id为btn-scrollUp
    myScrollUp.setAttribute("id","btn-scrollUp")
    document.body.appendChild(myScrollUp);
    //判断当前页面是否已经下滑1300像素，若不满足则隐藏按钮
    if($(window).scrollTop() <= 1300){
        myScrollUp.style.display = "none";
    };

    //创建画布
    var canvas = document.createElement("canvas");
    canvas.setAttribute("width",60);
    canvas.setAttribute("height",60);
    myScrollUp.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#c6d4df";
    ctx.fillStyle = "#c6d4df";
    //画一个三角形
    ctx.beginPath();
    ctx.moveTo(15,42.99);
    ctx.lineTo(30,17.01);
    ctx.lineTo(45,42.99);
    ctx.closePath();
    ctx.fill();

    //监听window的scroll事件
    $(window).scroll(function(){
        //若往下滑动超过1300像素，则显示上滑按钮，否则隐藏
        if($(window).scrollTop() > 1300 ){
            $("#btn-scrollUp").fadeIn();
        }else{
            $('#btn-scrollUp').fadeOut();
        };
    });
    
    //设定按钮功能，点击后返回页面顶部
    $("#btn-scrollUp").click(function(){
        $("html").animate({
            scrollTop:0
        },500);
    })
})();