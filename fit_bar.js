/**
 * Created by tung on 16/01/2017.
 */
$(document).ready(function () {
    var bar = $(".bar");
    var num_click = 0;
    var txt = "";
    var button = $("button");
    var def_height = Math.random() * 1000;
    bar.mousedown(function () {
        bar.animate(
            {
                height: '+=200px'

            }, 8000);

    });

    bar.mouseup(function () {
        bar.stop();
        num_click += 1;
        txt = "Height of the bar:  " + bar.height() + "<br>";
        txt += "<br> Goal: " + def_height + "<br>";

        if (bar.height() > def_height && num_click <= 3) {
            txt += "<br>" + "<b>YOU WIN</b> <br>" + "<b>START NEW GAME</b> <br>";
        }
        else if(bar.height() < def_height && num_click > 3){
            txt += "<br>" + "<b>YOU LOSE</b> <br>" + "<b>START NEW GAME</b> <br>";

        }

        $("#result").html(txt);
    });

    button.mousedown(function () {
        num_click = 0;
        def_height = Math.random() * 1000;
        bar.animate(
            {
                height: '100px'
            }
        );

    });
    button.mouseup(function () {
        txt = "";
        $("#result").html(txt);
    });

});