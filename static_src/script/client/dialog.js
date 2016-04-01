/**
 * Created by Rik on 1-4-2016.
 */

$(function(){

    $("#test").dialog({
        modal: true,
        draggable: false,
        resizable: false,
        position: {
            my: "center",
            at: "center",
            of: window,
        },
        show: 'blind',
        hide: 'blind',
        closeOnEscape: false,
        width: 330,
        dialogClass: 'ui-dialog-osx'
    });


});