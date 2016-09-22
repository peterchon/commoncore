'use strict';
var createBtn = document.getElementById("createNew");
var timerBtn = document.getElementById("runTimer");
var container = document.getElementById('workbook');
var timerArea = document.getElementById('timerArea');
var mathTypeContainer = document.querySelector('.math-type');
var timer;
var totalTime = 1;
var mathType;
var totalHintsUsed = 0;
var totalHintPerSession = [];
var maximumNumber, totalNumber, algebra;

mathTypeContainer.onclick = function(Event) {
  var el = Event.target || Event.srcElement;
  var totalParent = document.getElementById('total').parentNode.parentNode;
  if(/minus/.test(el.value) && el.checked) {
    totalParent.style.display = "none";
  } else {
    totalParent.style.display = "inline-block";
  }
};

var runTimer = function (e) {
  var t = e.target || e.srcElement;

  function readableTime(tt) {
    return tt > 59 ? parseInt(tt / 60) + " minute " + tt%60 : tt;
  }

  if(totalTime > 1) {
    t.innerHTML = 'Start Timer';
    clearInterval(timer);
    timerArea.innerHTML = 'Wow! You finished it in ' + readableTime(totalTime) + ' seconds!';
    totalTime = 1;
  } else {
    t.innerHTML = 'Stop Timer';
    timer = setInterval(function(){
      timerArea.innerHTML = readableTime(totalTime) + " seconds";
      totalTime++;
    }, 1000);
  }
};

var getRanNum = function(max) {
  return function(more) {
    return parseInt(Math.random() * (max - more) + more);
  }
};

function getParent(e) {
  var t = e.target || e.srcElement;
  var p = t.parentNode;
  var n = p.querySelectorAll('.num');

  return {
    tar: t,
    parent: p,
    nums: n
  };
}

var checkAnswer = function(e) {
  var t = getParent(e);
  var answer = 0;
  for(var i=0; i<t.nums.length; i++) {
    var val = parseInt(t.nums[i].innerHTML);
    answer = /plus/.test(mathType) || i===0 ? answer + val : answer - val;
  }

  if (!!t.tar.value && answer === parseInt(t.tar.value)) {
    t.tar.className = answer === parseInt(t.tar.value) ? "correct" : "incorrect";
  }

};

var makeProblems = function (r, n) {
  var max = 10, tNum = 0, problemArr = [];

  if(maximumNumber) max = document.getElementById('max').value;

  if(totalNumber) tNum = document.getElementById('total').value;

  var problem = document.createElement('div');
  problem.className = "problem answer" + n + " " + mathType;
  var ran = getRanNum(r * max);
  var input = document.createElement('input');
  input.type = "number";
  input.onkeyup = checkAnswer;

  var hint = document.createElement('a');
  hint.className = "hint";
  hint.innerHTML = "Help";
  hint.onclick = makeHint;

  if(/minus/.test(mathType)) {
    var arr = [];
    for(var i=0; i<n; i++) {
      arr.push(ran(0));
    }
    arr.sort(function(a, b) {
      return a - b;
    });
  }

  while(n){
    var num = document.createElement('span');
    num.className = n > 1 ? "num" : "num last";
    num.innerHTML = /minus/.test(mathType) ? arr[n-1] : ran(0);
    if(totalNumber && n === 1 && !/minus/.test(mathType)) {
      num.innerHTML = tNum - parseInt(problemArr[0].textContent);
    }
    problem.appendChild(num);
    problemArr.push(num);
    n--;
  }

  if(algebra) {
    problem.innerHTML = "";
    var algebraTotal = 0;
    for(var j=0, m=problemArr.length; j<m; j++) {
      if(j === m - 1) {
        problem.appendChild(input);
        input.setAttribute('data-val', problemArr[j].textContent);
      } else {
        problem.appendChild(problemArr[j]);
      }
      algebraTotal += parseInt(problemArr[j].textContent);
    }
    problem.className += " algebra";
    problem.innerHTML += '<span class="num total">' + algebraTotal + '</span>';
  } else {
    problem.appendChild(input);
  }

  problem.appendChild(hint);

  container.appendChild(problem);
};

var makeWorkbook = function () {

  maximumNumber = document.getElementById('maxNum').checked;
  totalNumber = document.getElementById('totalNum').checked;
  algebra = document.getElementById('algebra').checked;

  totalHintPerSession.push(totalHintsUsed);
  totalHintsUsed = 0;

  clearInterval(timer);
  timerBtn.innerHTML = 'Start Timer';
  timerArea.innerHTML = "";
  totalTime = 1;

  container.innerHTML = "";
  var type = document.getElementsByName('type');

  for(var i=0; i<2; i++) {
    if(type[i].checked) {
      mathType = type[i].value;
    }
  }

  var digitCount = document.getElementById('digit') ? document.getElementById('digit').value : 1;
  var sumCount = document.getElementById('sum') ? document.getElementById('sum').value : 2;
  var problemCount = document.getElementById('problems').value;

  if(problemCount > 999) {
    container.innerHTML = "<p>I like your enthusiasm, but I think " + problemCount + " might be too many.</p>";
    return;
  }

  for(var j=0; j<problemCount; j++) {
    makeProblems(digitCount, sumCount);
  }
};

createBtn.onclick = makeWorkbook;
timerBtn.onclick = runTimer;
