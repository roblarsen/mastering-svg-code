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
  function addLine(coords, color = "#ff8000") {
    const NS = canvas.getAttribute('xmlns');
    const startingPoint = canvas.createSVGPoint();
    const endingPoint = canvas.createSVGPoint();
    console.log(coords);
    startingPoint.x = coords.x1;
    startingPoint.y = coords.y1;
    endingPoint.x = coords.x2;
    endingPoint.y = coords.y2;
    const startingCoords = startingPoint.matrixTransform(canvas.getScreenCTM().inverse());
    const endingCoords = endingPoint.matrixTransform(canvas.getScreenCTM().inverse());
    console.log(startingCoords, endingCoords, color);

    let elem;
    elem = doc.createElementNS(NS, "line");
    elem.setAttribute("x1", startingCoords.x);
    elem.setAttribute("y1", startingCoords.y);
    elem.setAttribute("x2", endingCoords.x);
    elem.setAttribute("y2", endingCoords.y);
    elem.setAttribute("stroke", color);
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
    const maxRange = 200;
    const years = data.length;
    const total = data.reduce((total, item) => {
      return total + item.hrs;
    }, 0);
    const avg = total / years;
    const diffs = data.map((item) => {
      return item.hrs - avg;
    });
    const maxDiff = maxDiffer(diffs);
    const intervals = maxRange/maxDiff;
    console.log(intervals);
  });
}