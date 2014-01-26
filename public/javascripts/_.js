$(document).ready(function () {
    var WIDTH = $('.container').width();
    var HEIGHT = WIDTH * 2 / 3;
    var LEVEL = 4;
    var UNIT = WIDTH / LEVEL / 5;
    var UY = UNIT/2;
    var UX = UY * Math.sqrt(3);
    var ORI = [WIDTH / 4, HEIGHT * 5 / 9];
    var COLOR = '#B0E0E6';
    var SUM = 0;
    var paper = Raphael("svg", WIDTH, HEIGHT);
    Array.prototype.sum = function () {
        var total = 0;
        var i = this.length; 
        while (i--) {
            total += this[i];
        }
        return total;
    }
    Raphael.fn.polyline = function(pointString) {
        return this.path('M' + pointString);
    };
    Raphael.fn.cube = function(o, unit, color){
        Raphael.fn.shape = function(o, unit) {
            var str = o[0] + ',' + o[1] + ' ';
            str += (o[0] - unit / 2) + ',' + (o[1] - unit * Math.sqrt(3) / 2) + ' ';
            str += (o[0] + unit / 2) + ',' + (o[1] - unit * Math.sqrt(3) / 2) + ' ';
            str += (o[0] + unit) + ',' + o[1] + ' ';
            str += o[0] + ',' + o[1];
            return this.polyline(str).attr({'stroke': 'white', 'stroke-width': unit/16});
        };
        var plane0 = this.shape(o, unit).attr('fill', '#b0e0e6');
        var plane1 = plane0.clone().rotate(120, o[0], o[1]).attr('fill', '#86abaf');
        var plane2 = plane0.clone().rotate(-120, o[0], o[1]).attr('fill', '#bdf1f8');
        var cube = this.set(plane0, plane1, plane2).rotate(90, o[0], o[1]);
        return cube;
    };
    var grid = new Array(Math.pow(LEVEL + 2, 2));
    for(var i=0, max=grid.length; i<max; i++){
        if(0<=i && i<=LEVEL+1) {
            grid[i] = 0;
        } else if ((LEVEL+1)*(LEVEL+2)<=i && i<=Math.pow(LEVEL+2, 2)-1) {
            grid[i] = 0;
        } else if (i%(LEVEL+2)==0){
            grid[i] = 0;
        } else if (i%(LEVEL+2)==LEVEL+1){
            grid[i] = 0;
        } else {
            grid[i] = 1;
        }
    }
    function nextGrid(grid) {
        var next_grid = grid;
        var l = Math.sqrt(grid.length);
        function flip(i) {
            if(grid[i]==1) {
                if(grid[i+1]==0 && grid[i+l]==0) {
                    if(Math.random() > 0.5) {
                        next_grid[i] = 0;
                        return true;
                    }
                }
            }
            return false;
        };
        for(var i=0, max=grid.length; i<max; i++) {
            if(flip(i)){
                i = 0;
            }
        }
        return next_grid;
    }
    function layer(ori, grid) {
        var l = Math.sqrt(grid.length);
        for(var i=0; i<l; i++) {
            for(var j=0; j<l; j++) {
                if(grid[i+l*j]==1) {
                    paper.cube([ori[0]+(j-i)*UX, ori[1]+UY*(i+j)], UNIT, COLOR);
                }
            }
        }
    }
    for(var i=0; i<LEVEL*2; i++){
        var next_grid = nextGrid(grid);
        layer([ORI[0], ORI[1]-i*UY*2], next_grid);
        grid = next_grid;
        SUM += next_grid.sum();
    }
    paper.text(ORI[0], ORI[1], SUM).attr('font-size', UNIT);
});
