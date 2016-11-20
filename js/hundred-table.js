/**
 * Created by peterchon on 11/20/16.
 */

var section = document.querySelector('.hundred-table');
var checkBtn = document.getElementById('check');
var generateRandomBtn = document.getElementById('random');
var num1 = document.getElementById('num1');
var num2 = document.getElementById('num2');
var total = document.getElementById('total');

function makeTable() {
    for(var i=0; i<10; i++) {
        var div = document.createElement('div');

        for(var j=1; j<=10; j++) {
            var span = document.createElement('span');
            var num = i * 10 + j;
            span.className = "n" + num.toString();
            span.textContent = num;

            div.appendChild(span);
        }

        section.appendChild(div);
    }
}

makeTable();

checkBtn.onclick = function() {

    var that = section;
    var startNum = Number(num1.value);
    var addNum = Number(num2.value);
    var guessNum = Number(total.value);

    if(!guessNum || !startNum || !addNum) return;

    section.innerHTML = "";
    makeTable();

    var right = addNum % 10;
    var down = (addNum - right) / 10;
    var intv = 800;

    var dom = that.querySelector('.n' + startNum);
    dom.classList.add("init");

    function goDown(i, start) {
        window.setTimeout(function() {
            dom = that.querySelector('.n' + (startNum + i * 10));
            if(!/init/.test(dom.className)) {
                dom.classList.add("down");
            }
        }, intv * i);
        if(start) {
            window.setTimeout(function(){
                for(var j=0; j<right; j++) {
                    goRight(j);
                }
            }, intv * i);
        }
    }

    function goRight(i) {
        var startNumPlus = startNum + 1;
        window.setTimeout(function() {
            dom = that.querySelector('.n' + (down * 10 + startNumPlus + i));
            dom.classList.add("right");
        }, intv * (i + 1));
    }

    for(var i=0; i<=down; i++) {
        var go = i === down;
        goDown(i, go);
    }
};

generateRandomBtn.onclick = function() {

    total.value = "";
    section.innerHTML = "";
    makeTable();

    function ran(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    num1.value = ran(1, 99);
    num2.value = ran(1, 100 - num1.value);
};