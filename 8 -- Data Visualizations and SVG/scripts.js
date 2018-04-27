/*
   ES6
   */
{
  const data = [
    {
      "year": 2003,
      "hrs": 31
    },
    {
      "year": 2004,
      "hrs": 41
    },
    {
      "year": 2005,
      "hrs": 47
    },
    {
      "year": 2006,
      "hrs": 54
    },
    {
      "year": 2007,
      "hrs": 35
    },
    {
      "year": 2008,
      "hrs": 23
    },
    {
      "year": 2009,
      "hrs": 28
    },
    {
      "year": 2010,
      "hrs": 32
    },
    {
      "year": 2011,
      "hrs": 29
    },
    {
      "year": 2012,
      "hrs": 23
    },
    {
      "year": 2013,
      "hrs": 30
    },
    {
      "year": 2014,
      "hrs": 35
    },
    {
      "year": 2015,
      "hrs": 37
    },
    {
      "year": 2016,
      "hrs": 38
    }
  ];
  const doc = document;
  const canvas = doc.getElementById("canvas");
  function addText(coords,text) {
    let elem;
    const NS = canvas.getAttribute('xmlns');
    elem = doc.createElementNS(NS, "text");
    elem.setAttribute("x", coords.x);
    elem.setAttribute("y", coords.y);
    elem.textContent = text;
    canvas.appendChild(elem);

  }

  function addLine(coords, stroke = "#ff8000") {
    let elem;
    const NS = canvas.getAttribute('xmlns');
    elem = doc.createElementNS(NS, "line");
    elem.setAttribute("x1", coords.x1);
    elem.setAttribute("y1", coords.y1);
    elem.setAttribute("x2", coords.x2);
    elem.setAttribute("y2", coords.y2);
    elem.setAttribute("stroke", stroke);
    canvas.appendChild(elem);

  }
  function addRect(coords, fill = "#ff8000", stroke = "#ffffff") {
    let elem;
    const NS = canvas.getAttribute('xmlns');
    elem = doc.createElementNS(NS, "rect");
    elem.setAttribute("x", coords.x);
    elem.setAttribute("y", coords.y);
    elem.setAttribute("width", coords.width);
    elem.setAttribute("height", coords.height);
    elem.setAttribute("fill", fill);
    elem.setAttribute("stroke", stroke);
    canvas.appendChild(elem);

  }
  function maxDiffer(arr) {
    let maxDiff = arr[1] - arr[0];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] - arr[i] > maxDiff) {
          maxDiff = arr[j] - arr[i];
        }
      }
    }
    return maxDiff;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const viewBox = canvas.viewBox.baseVal;
    const width = viewBox.width;
    const height = viewBox.height;
    const x = viewBox.x;
    const y = viewBox.y;
    const padding = width/200;

    const years = data.length;
    const total = data.reduce((total, item) => {
      return total + item.hrs;
    }, 0);
    

    const avg = total / years;
    const verticalMidPoint = (y + height)/2;

    const diffs = data.map((item) => {
      return item.hrs - avg;
    });
    

    const maxDiff = maxDiffer(diffs);
  

    const yIntervals = verticalMidPoint/maxDiff;
    const xInterval = (width/years);
    for (const i in diffs){
      if (diffs[i] < 0){
        addRect({
        "x" :  (xInterval * i ) + padding,
        "y" :verticalMidPoint, 
        "width": xInterval - padding,
        "height": Math.abs(diffs[i]*yIntervals) , 
        }, "#C8102E","#ffffff");
      } else if (diffs[i]>0){
          addRect({
            "x" :  (xInterval * i) + padding,
          "y" :verticalMidPoint - diffs[i]*yIntervals , 
          "width": xInterval - padding,
          "height": diffs[i]*yIntervals , 
          },"#4A777A","#ffffff");
      }
      addLine({
        x1: x,
        y1: verticalMidPoint,
        x2: width,
        y2: verticalMidPoint
      },"#ffffff")
    }
  });
}