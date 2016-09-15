function makeHint(e) {
  totalHintsUsed++;
  var t = getParent(e);
  var hintBox = t.parent.querySelector('.hint-box');
  var timeX = 0;
  var mx = 0;
  var init;
  var timeIndex;

  if(!hintBox) {
    t.tar.innerHTML = "Ok, got it.";
    hintBox = document.createElement('div');
    hintBox.className = "hint-box cf";

    var createBoxOnTimer = function() {
      hintBox.innerHTML += '<span class="hint-el' + timeIndex + '">' + (init - timeX + 1) + '</span>';
      if(timeX) {
        setTimeout(createBoxOnTimer, 1000);
        timeX--;
      }
    };

    function createBox(bn, index) {
      if(bn === 0) return;
      if(index > 0) {
        timeX = init = bn-1;
        timeIndex = index;
        setTimeout(createBoxOnTimer, 1000);
      } else {
        mx += bn + 1;
        while(bn) {
          hintBox.innerHTML += '<span class="hint-el' + index + '">' + (mx - bn) + '</span>';
          bn--;
        }
      }
    }

    for(var n=0, max=t.nums.length; n<max; n++) {
      var toInt = parseInt(t.nums[n].textContent);
      if(/minus/.test(mathType) && n!==0 && toInt) {
        timeX = toInt - 1;
        var box = hintBox.getElementsByTagName('span');
        var createOutline = function() {
          box[box.length - (toInt - timeX)].className += " outline";
          box[box.length - (toInt - timeX)].innerHTML = toInt - timeX;
          if(timeX) {
            setTimeout(createOutline, 1000);
            timeX--;
          }
        };
        setTimeout(createOutline, 1000);
      } else {
        createBox(toInt, n);
      }
    }

    t.parent.appendChild(hintBox);
  } else {
    t.tar.innerHTML = "Help";
    t.parent.removeChild(hintBox);
  }
}
