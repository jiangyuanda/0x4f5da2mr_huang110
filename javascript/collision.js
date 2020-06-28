/**
 * detect collision plug-ins
 * @param obj jQuery element selector
 * @param fn  event handler
 * @return this: this jQuery element selector
 * 
 */
$.fn.collision = function (obj, fn) {
    var l = $(this).position().left,
        t = $(this).position().top,
        r = l + $(this).width(),
        b = t + $(this).height();

    var oL = obj.position().left,
        oT = obj.position().top,
        oR = oL + obj.width(),
        oB = oT + obj.height();

    //detect collision
    if (l < oR && t < oB) {
        if (oL < r && oT < b) {
            //call event handler
            fn();
        }
    }

    return this;
};