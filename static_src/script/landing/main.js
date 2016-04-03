/**
 * Created by Eelco on 1-4-2016.
 */

$(function(){

    const creditDiv = $("#credits");
    const creditBtn = $("#creditButton");

    var open = false;
    creditBtn.click(function(e){
        e.preventDefault();
        var targetLocation = open ? 0 : $(document).height();
        creditDiv.toggle("slide", { direction: 'up', mode: 'show' });
        $("html, body").animate({ scrollTop: targetLocation }, 1000);
        open = !open;
    });

});