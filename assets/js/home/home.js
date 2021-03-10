$(function(){
    var icon_show = function(){
        if($(window).width() < 768){
            $(".icons").hide();
        } else {
            $(".icons").show();
        }
    };
    $(window).on("resize", icon_show);
    icon_show();

});