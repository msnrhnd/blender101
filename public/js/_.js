$(document).ready(function () {
    var WIDTH = $('#svg').width(),
        HEIGHT = WIDTH * 4 / 3,
        paper = Raphael("svg", WIDTH, HEIGHT),
        LEVEL, UNIT, UY, UX, ORI, SUM;
        LEVEL = Number($('#level label.active input').val());

    function init() {
        UNIT = WIDTH / LEVEL / 5 * 2;
        UY = UNIT / 2;
        UX = UY * Math.sqrt(3);
        ORI = [WIDTH / 2, HEIGHT * 5 / 9];
        SUM = 0;
    };

    Array.prototype.sum = function () {
        var total = 0,
            i = this.length;
        while (i--) {
            total += this[i];
        }
        return total;
    }
    Raphael.fn.polyline = function (pathStr) {
        return this.path('M' + pathStr);
    };
    Raphael.fn.cube = function (orix, oriy) {
        Raphael.fn.face = function (rot, color) {
            var pathStr = '',
                ang = Math.PI / 3;
            pathStr += orix + ',' + (oriy + UNIT * Math.cos(ang)) + ' ';
            pathStr += (orix + UNIT * Math.sin(ang)) + ',' + oriy + ' ';
            pathStr += orix + ',' + (oriy - UNIT * Math.cos(ang)) + ' ';
            pathStr += (orix - UNIT * Math.sin(ang)) + ',' + oriy + ' ';
            pathStr += orix + ',' + (oriy + UNIT * Math.cos(ang)) + ' ';
            shape = this.polyline(pathStr).attr({
                'fill': color,
                'stroke': 'white',
                'stroke-width': UNIT / 16
            });
            return shape.rotate(rot, orix, oriy).translate(0, -UNIT * Math.cos(ang));
        };
        var colors = ['#bdf1f8', '#b0e0e6', '#86abaf'];
        for (i = 0; i < 3; i++) {
            this.face(120 * i, colors[i]);
        }
    };

    function initGrid(level) {
        var grid = new Array(Math.pow(level + 2, 2));
        for (var i = 0, max = grid.length; i < max; i++) {
            if (0 <= i && i <= level + 1) {
                grid[i] = 0;
            }
            else if ((level + 1) * (level + 2) <= i && i <= Math.pow(level + 2, 2) - 1) {
                grid[i] = 0;
            }
            else if (i % (level + 2) == 0) {
                grid[i] = 0;
            }
            else if (i % (level + 2) == level + 1) {
                grid[i] = 0;
            }
            else {
                grid[i] = 1;
            }
        }
        return grid;
    }

    function nextGrid(grid, prob) {
        var l = Math.sqrt(grid.length);

        function flip(k) {
            if (grid[k] == 1) {
                if (grid[k + 1] == 0 && grid[k + l] == 0) {
                    if (Math.random() > prob) {
                        grid[k] = 0;
                        return true;
                    }
                }
            }
            return false;
        };
        for (var i = l + 1, max = Math.pow(l - 2, 2) + 3 * (l - 2) + 1; i < max; i++) {
            if (flip(i)) {
                i = l + 1;
            }
        }
        return grid;
    }

    function layer(orix, oriy, grid) {
        var l = Math.sqrt(grid.length);
        for (var i = 0; i < l; i++) {
            for (var j = 0; j < l; j++) {
                if (grid[i + l * j] == 1) {
                    paper.cube(orix + (j - i) * UX, oriy + UY * (i + j));
                }
            }
        }
    }

    function draw(level) {
        var grid = initGrid(level);
        for (var k = 0; k < level * 2; k++) {
            var next_grid = nextGrid(grid, 0.5);
            layer(ORI[0], ORI[1] - k * UNIT, next_grid);
            grid = next_grid;
            SUM += next_grid.sum();
        }
    }

    function answer(sum) {
        $('#answer').empty();
        var rand = Math.floor(Math.random() * 4); // 0, 1, 2, 3
        for (var i = sum - rand, max = sum + 4 - rand; i < max; i++) {
            $('<div>', {
                'class': 'btn btn-default btn-lg'
            }).text(i).appendTo('#answer');
        }
    }

    $(document).on('click', '#answer .btn', function () {
        $('#answer .result').remove();
        if (Number($(this).text()) == SUM) {
            $('<div>', {
                'class': 'result correct'
            }).text('Correct!').appendTo('#answer');
        }
        else {
            $('<div>', {
                'class': 'result incorrect'
            }).text('Incorrect...').appendTo('#answer');
        }
    });
    $('#level label').change(function () {
        paper.clear();
        LEVEL = Number($('input', this).val());
        init();
        draw(LEVEL);
        answer(SUM);
    });
    init();
    draw(LEVEL);
    answer(SUM);
});
