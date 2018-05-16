/**
 * Created by Edik on 2016/12/12.
 */
;(function (win, $) {
    var config = {
        url: '',
        type: 'open',
        width: '50%',
        direction: 'right'
    };

    var elayer = {};

    win.Elayer = function (options) {
        if(!options.type){
            options.type = config.type;
        }
        if(!options.width){
            options.width = config.width;
        }
        if((options.type == 'open' || options.type == 'iframe') && !options.url){
            console.error('Elayer url 参数不能为空!');
            return;
        }
        if(!options.direction){
            options.direction = config.direction;
        }
        return elayer.init(options);
    };

    Elayer.v = 0.1;

    elayer.init=function (options) {
        clearBodyHeight();
        var layerId_f = "Elayer_" + new Date().getTime() + "_";
        var maskId = layerId_f+"mask";
        var layerId = layerId_f+"layer";
        var tpl = '<div id="'+layerId_f+'mask" class="elayer-mask"></div><div id="'+layerId_f+'layer" class="elayer-portal"><span class="elayer-close"></span></div>';

        $("body").append(tpl);
        var mask = $("#"+maskId);
        var portal = $("#"+layerId);

        if(options.direction == 'left'){
            portal.css({"width":options.width,"left":'-'+options.width});
            mask.show();
            portal.show();
            portal.animate({"left":0},function () {
                last(mask,portal,options);
            });
        }else{
            portal.css({"width":options.width,"right":'-'+options.width});
            mask.show();
            portal.show();
            portal.animate({"right":0},function () {
                last(mask,portal,options);
            });

        }
    };
    var last=function (mask,portal,options) {

        if(options.type == 'open'){
            load(portal,options.url);
        }else if(options.type == 'iframe'){
            portal.append('<iframe src="'+options.url+'" class="elayer-iframe"></iframe>');
        }else{
            portal.append($(options.type).html());
        }
        //绑定事件
        bindEvent(mask,portal,options);
    }
    var load=function (portal,url) {
        if(url.indexOf("?") != -1){
            url = url + "&r="+new Date().getTime();
        }else{
            url = url + "?r="+new Date().getTime();
        }
        $.get(url,function (result) {
            portal.append(result);
        })
    };
    var close=function (mask, portal, options) {
        mask.fadeOut(100,function () {
            mask.remove();
        })
        if(options.direction == 'left'){
            portal.animate({"left": '-'+options.width},function () {
                portal.remove();
                recoverBodyHeight();
            })
        }else{
            portal.animate({"right": '-'+options.width},function () {
                portal.remove();
                recoverBodyHeight();
            })
        }

    };
    var bindEvent=function (mask, portal, options) {
        //点击黑色背景关闭
        mask.on("click",function () {
            close(mask, portal, options);
        })

        //右上角关闭按钮事件
        portal.find(".elayer-close").on("click",function () {
            close(mask, portal, options);
        })
    };
    var clearBodyHeight=function () {
        $("body").addClass("clearBodyHeight");
    };
    var recoverBodyHeight=function () {
        $("body").removeClass("clearBodyHeight");
    };
})(window, jQuery);