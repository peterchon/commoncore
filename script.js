'use strict';
var createBtn = document.getElementById("createWorksheet");
var timerBtn = document.getElementById("runTimer");
var container = document.getElementById('workbook');
var timer;
var totalTime = 1;
var mathType;

var runTimer = function (e) {
  var t = e.target || e.srcElement;
  if(totalTime > 1) {
    t.innerHTML = "Start time";
    clearInterval(timer);
    var humanTime = totalTime > 59 ? parseInt(totalTime / 60) + " minute " + totalTime%60 : totalTime;
    console.log('wow! you finished it in ' + humanTime + ' seconds!');
    totalTime = 1;
  } else {
    t.innerHTML = "Stop time";
    timer = setInterval(function(){
      totalTime++;
    }, 1000);
  }
};

var getRanNum = function(max) {
  return function(more) {
    return parseInt(Math.random() * max) + more;
  }
};

function getParent(e) {
  var tar = e.target || e.srcElement;
  var parent = tar.parentNode;
  var nums = parent.querySelectorAll('.num');

  return {
    tar: tar,
    parent: parent,
    nums: nums
  };
}

var checkAnswer = function(e) {
  var t = getParent(e);
  var answer = 0;
  var answerClass = "";
  for(var i=0; i<t.nums.length; i++) {
    var val = parseInt(t.nums[i].innerHTML);
    if(/plus/.test(mathType) || i===0) {
      answer += val;
    } else {
      answer -= val;
    }
  }
  if(!!t.tar.value) {
    if(answer === parseInt(t.tar.value)) {
      answerClass = "correct";
    } else {
      answerClass = "incorrect";
    }
  }
  t.tar.className = answerClass;
};

var makeProblems = function (r, n) {
  var problem = document.createElement('div');
  problem.className = "problem answer" + n + " " + mathType;
  var ran = getRanNum(r * 10);
  var input = document.createElement('input');
  input.type = "number";
  input.onkeyup = checkAnswer;

  var hint = document.createElement('a');
  hint.className = "hint";
  hint.innerHTML = "show hint";
  hint.onclick = makeHint;

  if(/minus/.test(mathType)) {
    var arr = [];
    for(var i=0; i<n; i++) {
      arr.push(ran(0));
    }
    arr.sort();
  }

  while(n){
    var num = document.createElement('span');
    num.className = n > 1 ? "num" : "num last";
    num.innerHTML = /minus/.test(mathType) ? arr[n-1] : ran(0);
    problem.appendChild(num);
    n--;
  }

  problem.appendChild(input);
  problem.appendChild(hint);
  container.appendChild(problem);
};

var makeWorkbook = function () {

  if(totalTime > 1) {
    clearInterval(timer);
    timerBtn.innerHTML = "Start time";
    totalTime = 1;
  }

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

  for(var i=0; i<problemCount; i++) {
    makeProblems(digitCount, sumCount);
  }
};

createBtn.onclick = makeWorkbook;
timerBtn.onclick = runTimer;
