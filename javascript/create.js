$.fn.create = function (playGame, id, timer, x, y) {
    clearInterval(timer);
    if ($('#' + id).length != 0) {
        $('#' + id).remove();
    }

    let div = $('<div></div>').attr('id', id).css({
        'left': x,
        'top': y
    });

    $(this).append(div);

    timer = setInterval(() => {
        playGame && div.css('left', x -= 3);
        x < -100 ? arguments.callee() : '';
    }, 1000 / 60);
};