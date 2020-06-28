(function () {
    //game state
    var playGame = false;

    //num of stone collistions
    var stoneNum = 0;

    //check game status
    function gameState() {
        playGame ? playGame = false : playGame = true;
        if (playGame) {
            animateRun();
        } else {
            animateStop();
        }
    }

    //player object
    var player = {
        //whether the bullet can be fired
        bullentFlag: true,
        //player init
        init: function () {
            if ($("#player").length != 0) {
                $("#player").remove();
            }
            $("<div id='player'></div>").appendTo($("#map"));
            this.move();
            this.bindKey();
        },
        //player run
        move: function () {
            setInterval(function () {
                var x = $("#player").position().left;
                var y = $('#player').position().top;
                playGame && player.left && x > 0 && $("#player").css("left", x -= 2);
                playGame && player.top && y > 40 && $("#player").css("top", y -= 2);
                playGame && player.right && x < 600 && $("#player").css("left", x += 2);
                playGame && player.bottom && y < 320 && $("#player").css("top", y += 2);
            }, 0);
        },
        //player bind keyboard
        bindKey: function () {
            $(document).on("contextmenu", function (e) {
                e.preventDefault();
            }).on("touchend", function () {
                player.left = false;
                player.top = false;
                player.right = false;
                player.bottom = false;
                player.bullentFlag = true;
            });
            $("#left").on("touchstart", function () {
                player.left = true;
            }).on("touchend", function () {
                player.left = false;
            });
            $("#top").on("touchstart", function () {
                player.top = true;
            }).on("touchend", function () {
                player.top = false;
            });
            $("#right").on("touchstart", function () {
                player.right = true;
            }).on("touchend", function () {
                player.right = false;
            });
            $("#bottom").on("touchstart", function () {
                player.bottom = true;
            }).on("touchend", function () {
                player.bottom = false;
            });
            $("#launch").on("click", function () {
                player.bullent();
                player.bullentFlag = false;
            }).on("touchend", function () {
                player.bullentFlag = true;
            });
            $(document).on("keydown", function (e) {
                e.keyCode == 37 ? player.left = true : "";
                e.keyCode == 38 ? player.top = true : "";
                e.keyCode == 39 ? player.right = true : "";
                e.keyCode == 40 ? player.bottom = true : "";
                if (e.keyCode == 32) {
                    player.bullent();
                    player.bullentFlag = false;
                }
                if (e.keyCode == 80) {
                    gameState();
                }
            });
            $(document).on("keyup", function (e) {
                e.keyCode == 37 ? player.left = false : "";
                e.keyCode == 38 ? player.top = false : "";
                e.keyCode == 39 ? player.right = false : "";
                e.keyCode == 40 ? player.bottom = false : "";
                e.keyCode == 32 ? player.bullentFlag = true : "";
            });
        },
        //player bullent
        bullent: function () {
            if (this.bullentFlag) {
                var x = $("#player").position().left;
                var y = $('#player').position().top;
                var div = $("<div></div>").attr("class", "bullent").appendTo($("#map")).css({
                    "top": y + 20,
                    "left": x + 50
                });
                var timeId = setInterval(function () {
                    playGame && div.css("left", x += 5).collision($("#enemy"), function () {
                        enemy.init();
                        div.remove();
                        score.init(5);
                        clearInterval(timeId);
                    }).collision($("#friend"), function () {
                        friend.init();
                        div.remove();
                        score.init(-10);
                        clearInterval(timeId);
                    }).collision($("#stone"), function () {
                        stoneNum++;
                        div.remove();
                        if (stoneNum == 2) {
                            stone.init();
                            score.init(10);
                            stoneNum = 0;
                            clearInterval(timeId);
                        }
                    });
                    if (x > 700) {
                        div.remove();
                        clearInterval(timeId);
                    }
                }, 10);
            }
        },
    };

    //enemy object
    var enemy = {
        //enemy move timer id
        moveId: null,
        //enemy init
        init: function () {
            if ($("#enemy").length != 0) {
                $("#enemy").remove();
            }
            this.y = rand(100, 300);
            this.x = 700;
            $("<div id='enemy'></div>").appendTo($("#map")).css({
                "top": this.y,
                "left": this.x
            });
            this.move();
            setTimeout(function () {
                enemy.bullent();
            }, 500);
        },
        //enemy run
        move: function () {
            clearInterval(enemy.moveId);
            this.moveId = setInterval(function () {
                playGame && $("#enemy").css("left", enemy.x -= 3).collision($("#player"), function () {
                    enemy.init();
                    live.init2(-15);
                });
                if (enemy.x < -100) {
                    enemy.init();
                }
            }, 1000 / 60);
        },
        //enemy bullent
        bullent: function () {
            clearInterval(timeId);
            var x = $("#enemy").position().left;
            var y = $("#enemy").position().top;
            var div = $("<div></div>").appendTo($("#map")).attr("class", "enemyBullent").css({
                "top": y + 20,
                "left": x
            });
            var timeId = setInterval(function () {
                playGame && div.css("left", x -= 5).collision($("#player"), function () {
                    div.remove();
                    live.init2(-15);
                    clearInterval(timeId);
                });
                if (x < -100) {
                    div.remove();
                    clearInterval(timeId);
                }
            }, 1000 / 60);
        }
    };

    //friend object
    var friend = {
        //friend move timer id
        moveId: null,
        //friend init
        init: function () {
            if ($("#friend").length != 0) {
                $("#friend").remove();
            }
            this.y = rand(100, 300);
            this.x = 700;
            $("<div id='friend'></div>").appendTo($("#map")).css({
                "top": this.y,
                "left": this.x
            });
            this.move();
        },
        //friend run
        move: function () {
            clearInterval(this.moveId);
            this.moveId = setInterval(function () {
                playGame && $("#friend").css("left", friend.x -= 2).collision($("#player"), function () {
                    friend.init();
                    live.init2(-15);
                });
                if (friend.x < -100) {
                    friend.init();
                }
            }, 1000 / 60);
        }
    };

    //stone object
    var stone = {
        //stone move timer id
        moveId: null,
        //stone init
        init: function () {
            if ($("#stone").length != 0) {
                $("#stone").remove();
            }
            this.y = rand(100, 300);
            this.x = 700;
            $("<div id='stone'></div>").appendTo($("#map")).css({
                "top": this.y,
                "left": this.x
            });
            this.move();
        },
        //stone run
        move: function () {
            clearInterval(this.moveId);
            this.moveId = setInterval(function () {
                playGame && $("#stone").css("left", stone.x -= 3).collision($("#player"), function () {
                    stone.init();
                    stoneNum = 0;
                    live.init2(-15);
                });
                if (stone.x < -100) {
                    stone.init();
                    stoneNum = 0;
                }
            }, 1000 / 60);
        }
    };

    //energy object
    var energy = {
        //energy move timer id
        moveId: null,
        //energy init
        init: function () {
            if ($("#nl").length != 0) {
                $("#nl").remove();
            }
            this.y = -100;
            this.x = rand(10, 400);
            $("<div id='nl'></div>").appendTo($("#map")).css({
                "top": this.y,
                "left": this.x
            });
            this.move();
        },
        //energy run
        move: function () {
            clearInterval(this.moveId);
            this.moveId = setInterval(function () {
                playGame && $("#nl").css("top", energy.y += 3).collision($("#player"), function () {
                    energy.init();
                    live.init2(15);
                });
                if (energy.y > 450) {
                    energy.init();
                }
            }, 1000 / 60);
        }
    };

    //time object
    var time = {
        num: 0,
        //time init
        init: function () {
            var timeId = setInterval(function () {
                playGame && time.num++;
                var num = time.num < 10 ? "0" + time.num : time.num;
                playGame && $("#time").text(num);
            }, 1000);
        }
    };

    //live object
    var live = {
        num: 15,
        init: function () {
            this.num = 15;
            var timeId = setInterval(function () {
                playGame && live.num-- && $("#live").text(live.num);
                //game over
                if (live.num <= 0) {
                    clearInterval(timeId);
                    playGame = false;
                    $("#one").hide();
                    $("#ranking").show();
                    $("#map").hide();
                    animateStop();
                }
            }, 1000);
        },
        init2: function (num) {
            live.num += num;
            live.num = live.num > 30 ? live.num = 30 : live.num;
            playGame && $("#live").text(live.num);
            //game over
            if (live.num < 0) {
                playGame = false;
                animateStop();
                $("#one").hide();
                $("#ranking").show();
                $("#map").hide();
            }
        }
    }

    //score object
    var score = {
        score: 0,
        init: function (num) {
            if (num) {
                this.score += num;
                $("#score").text(this.score);
            } else {
                $("#score").text(0);
            }
        }
    };

    //game init
    var game = function () {
        player.init();
        enemy.init();
        friend.init();
        stone.init();
        energy.init();
        time.init();
        live.init();
        score.init();
        score.score = 0;
        animateRun();
        playGame = true;
    };

    //ranking list
    var ranking = {
        //data
        data: null,
        //submit
        sub: function () {
            $("#text").on("input", function () {
                if ($(this).val().length != 0) {
                    $("#sub").css("cursor", "pointer").removeAttr("disabled");
                } else {
                    $("#sub").css("cursor", "no-drop").attr("disabled", "disabled")
                }
            });
            $("#sub").on("click", function () {
                var obj = {
                    "name": $("#text").val(),
                    "time": time.num,
                    "score": score.score
                };
                $("#text").val("");
                $("#tj").hide();
                $("#ran").show();
                //get data and upload
                ranking.data = localStorage.xx_ranking ? JSON.parse(localStorage.xx_ranking) : [];
                ranking.data.push(obj);
                localStorage.xx_ranking = JSON.stringify(ranking.data);
                //data sort
                ranking.sort();
                //printing ringking
                ranking.printing();
            });
        },
        //printing
        printing: function () {
            for (var i = 0; i < this.data.length; i++) {
                $(`<tr><td>${i+1}</td><td>${this.data[i].name}</td><td>${this.data[i].score}</td><td>${this.data[i].time}</td></tr>`).appendTo($("#tb"));
                if (i == 4) {
                    break;
                }
            }
            $("#newGame").on("click", function () {
                location.href = "./index.html";
            });
        },
        //data sort
        sort: function () {
            for (var i = 0; i < ranking.data.length - 1; i++) {
                for (var j = 0; j < ranking.data.length - 1 - i; j++) {
                    if (ranking.data[j].score == ranking.data[j + 1].score) {
                        if (ranking.data[j].time < ranking.data[j + 1].time) {
                            var temp = ranking.data[j];
                            ranking.data[j] = ranking.data[j + 1];
                            ranking.data[j + 1] = temp;
                        }
                    } else if (ranking.data[j].score < ranking.data[j + 1].score) {
                        var temp = ranking.data[j];
                        ranking.data[j] = ranking.data[j + 1];
                        ranking.data[j + 1] = temp;
                    }
                }
            }
        }
    };

    window.onload = function () {
        //start game
        $("#start").on("click", function () {
            $("#one").hide();
            $("#ranking").hide();
            $("#map").show();
            game();
        });

        //data submit handle
        ranking.sub();

        //stop game
        $("#stop").click(function () {
            gameState();
        });

        //default font size
        var ff = 17;
        //font size plus
        $("#plus").click(function () {
            $(".nav span").css("font-size", ff++);
        });
        //font size reduce
        $("#jian").click(function () {
            $(".nav span").css("font-size", ff--);
        });
    };

    //random number
    function rand(min, max) {
        return parseInt(Math.random() * (max - min) + min);
    }

    //game animation start
    function animateRun() {
        $("#planet>img,#player,#enemy,#friend,.game,#stone,#nl").css("animation-play-state", "running");
    }

    //game animation stop
    function animateStop() {
        $("#planet>img,#player,#enemy,#friend,.game,#stone,#nl").css("animation-play-state", "paused");
    }
}());