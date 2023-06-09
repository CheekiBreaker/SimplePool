var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");
var pwr = 5,
  bRadius = 15,
  t0 = 0,
  balls = [],
  tablew = 32,
  animateStop = true,
  powAnimation = false;
var dotline;
pxpm = canvas.width / 20;

window.onload = function () {
  var myball = new Ball(202, canvas.height / 2, true);
  balls.push(myball);
  for (var i = 0; i < 6; i++) {
    for (var j = 0; j < i; j++) {
      var other = new Ball(
        520 + i * (bRadius - 2) * 2,
        (canvas.height - i * 2 * bRadius) / 2 +
          bRadius +
          2 * bRadius * j,
        false
      );
      balls.push(other);
    }
  }
  t0 = new Date();
  dotline = new dotLine(0, 0, 0, 0);

  animateStop = false;
  animate();
};

canvas.addEventListener(
  "touchstart",
  function () {
    var stop = false;
    balls.foreach(function () {
      if (this.moving && !this.inhole) stop = true;
    });
    if (stop) return;
    document.querySelector(".shotPower").style.display = "block";
    document.querySelector(".shotPower").style.top = balls[0].y - 60 + "px";
    document.querySelector(".shotPower").style.left = balls[0].x - 40 + "px";
    document.getElementById("pow").className = "animate";

    var touch = event.targetTouches[0];
    var x =
      touch.pageX +
      document.body.scrollLeft +
      document.documentElement.scrollLeft -
      document.querySelector(".table").offsetLeft;
    var y =
      touch.pageY +
      document.body.scrollTop +
      document.documentElement.scrollTop -
      document.querySelector(".table").offsetTop;
    dotline.display = true;
    dotline.x0 = balls[0].x;
    dotline.y0 = balls[0].y;
    dotline.x1 = x;
    dotline.y1 = y;

    window.addEventListener("touchend", muHandle, false);
    window.addEventListener("touchmove", mmHandle, false);

    function mmHandle() {
      event.preventDefault();
      var touch = event.targetTouches[0];
      var x =
        touch.pageX +
        document.body.scrollLeft +
        document.documentElement.scrollLeft -
        document.querySelector(".table").offsetLeft;
      var y =
        touch.pageY +
        document.body.scrollTop +
        document.documentElement.scrollTop -
        document.querySelector(".table").offsetTop;
      dotline.x1 = x;
      dotline.y1 = y;
    }
    function muHandle() {
      var x =
        touch.pageX +
        document.body.scrollLeft +
        document.documentElement.scrollLeft -
        document.querySelector(".table").offsetLeft;
      var y =
        touch.pageY +
        document.body.scrollTop +
        document.documentElement.scrollTop -
        document.querySelector(".table").offsetTop;
      var angle = Math.atan((y - balls[0].y) / (x - balls[0].x));
      var h =
        document.getElementById("pow").offsetHeight /
        document.getElementById("powbar").offsetHeight;
      var v = 60 * h;
      document.getElementById("pow").style.height = h * 100 + "%";

      balls[0].vx =
        x - balls[0].x > 0
          ? v * Math.abs(Math.cos(angle))
          : -v * Math.abs(Math.cos(angle));
      balls[0].vy =
        y - balls[0].y > 0
          ? v * Math.abs(Math.sin(angle))
          : -v * Math.abs(Math.sin(angle));

      document.getElementById("pow").className = "";

      window.removeEventListener("touchend", muHandle, false);
      window.removeEventListener("touchmove", muHandle, false);
      dotline.display = false;
      document.querySelector(".shotPower").style.display = "none";
    }
  },
  false
);

canvas.addEventListener(
  "mousedown",
  function () {
    var stop = false;
    balls.foreach(function () {
      if (this.moving && !this.inhole) stop = true;
    });
    if (stop) return;
    document.querySelector(".shotPower").style.display = "block";
    document.querySelector(".shotPower").style.top = balls[0].y - 60 + "px";
    document.querySelector(".shotPower").style.left = balls[0].x - 40 + "px";
    document.getElementById("pow").className = "animate";
    var x =
      event.clientX +
      document.body.scrollLeft +
      document.documentElement.scrollLeft -
      document.querySelector(".table").offsetLeft;
    var y =
      event.clientY +
      document.body.scrollTop +
      document.documentElement.scrollTop -
      document.querySelector(".table").offsetTop;
    dotline.display = true;
    dotline.x0 = balls[0].x;
    dotline.y0 = balls[0].y;
    dotline.x1 = x;
    dotline.y1 = y;

    window.addEventListener("mouseup", muHandle, false);
    window.addEventListener("mousemove", mmHandle, false);

    function mmHandle() {
      var x =
        event.clientX +
        document.body.scrollLeft +
        document.documentElement.scrollLeft -
        document.querySelector(".table").offsetLeft;
      var y =
        event.clientY +
        document.body.scrollTop +
        document.documentElement.scrollTop -
        document.querySelector(".table").offsetTop;
      dotline.x1 = x;
      dotline.y1 = y;
    }
    function muHandle() {
      var x =
        event.clientX +
        document.body.scrollLeft +
        document.documentElement.scrollLeft -
        document.querySelector(".table").offsetLeft;
      var y =
        event.clientY +
        document.body.scrollTop +
        document.documentElement.scrollTop -
        document.querySelector(".table").offsetTop;

      var angle = Math.atan((y - balls[0].y) / (x - balls[0].x));
      var h =
        document.getElementById("pow").offsetHeight /
        document.getElementById("powbar").offsetHeight;
      var v = 60 * h;
      document.getElementById("pow").style.height = h * 100 + "%";

      balls[0].vx =
        x - balls[0].x > 0
          ? v * Math.abs(Math.cos(angle))
          : -v * Math.abs(Math.cos(angle));
      balls[0].vy =
        y - balls[0].y > 0
          ? v * Math.abs(Math.sin(angle))
          : -v * Math.abs(Math.sin(angle));

      document.getElementById("pow").className = "";

      window.removeEventListener("mouseup", muHandle, false);
      window.removeEventListener("mousemove", muHandle, false);
      dotline.display = false;
      document.querySelector(".shotPower").style.display = "none";
    }
  },
  false
);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var t1 = new Date();
  var t = (t1 - t0) / 1000;

  collision();
  balls.foreach(function () {
    if (!this.inhole) this._run(t);
  });
  if (dotline.display) {
    dotline.x0 = balls[0].x;
    dotline.y0 = balls[0].y;
    dotline._paint();
  }

  t0 = t1;
  if (!animateStop) {
    if ("requestAnimationFrame" in window) {
      requestAnimationFrame(animate);
    } else if ("webkitRequestAnimationFrame" in window) {
      webkitRequestAnimationFrame(animate);
    } else if ("msRequestAnimationFrame" in window) {
      msRequestAnimationFrame(animate);
    } else if ("mozRequestAnimationFrame" in window) {
      mozRequestAnimationFrame(animate);
    } else {
      setTimeout(animate, 16);
    }
  }
}

function collision() {
  for (var i = 0; i < balls.length; i++) {
    for (var j = 0; j < balls.length; j++) {
      var b1 = balls[i],
        b2 = balls[j];
      if (b1 !== b2 && !b1.inhole && !b2.inhole) {
        var rc = Math.sqrt(Math.pow(b1.x - b2.x, 2) + Math.pow(b1.y - b2.y, 2));
        if (Math.ceil(rc) < b1.radius + b2.radius) {
          if (!b1.moving && !b2.moving) return;

          var ax =
            ((b1.vx - b2.vx) * Math.pow(b1.x - b2.x, 2) +
              (b1.vy - b2.vy) * (b1.x - b2.x) * (b1.y - b2.y)) /
            Math.pow(rc, 2);
          var ay =
            ((b1.vy - b2.vy) * Math.pow(b1.y - b2.y, 2) +
              (b1.vx - b2.vx) * (b1.x - b2.x) * (b1.y - b2.y)) /
            Math.pow(rc, 2);

          b1.vx = b1.vx - ax;
          b1.vy = b1.vy - ay;
          b2.vx = b2.vx + ax;
          b2.vy = b2.vy + ay;

          var clength = (b1.radius + b2.radius - rc) / 2;
          var cx = (clength * (b1.x - b2.x)) / rc;
          var cy = (clength * (b1.y - b2.y)) / rc;
          b1.x = b1.x + cx;
          b1.y = b1.y + cy;
          b2.x = b2.x - cx;
          b2.y = b2.y - cy;
        }
      }
    }
  }
}

var dotLine = function (x0, y0, x1, y1) {
  this.x0 = this.x0;
  this.y0 = this.y0;
  this.x1 = this.x1;
  this.y1 = this.y1;
  this.dotlength = 3;
  this.display = false;
};
dotLine.prototype = {
  constructor: dotLine,
  _ready: function () {
    this.length = Math.sqrt(
      Math.pow(this.y1 - this.y0, 2) + Math.pow(this.x1 - this.x0, 2)
    );
    this.dotNum = Math.ceil(this.length / this.dotlength);
  },
  _paint: function () {
    this._ready();
    xadd = (this.dotlength * (this.x1 - this.x0)) / this.length;
    yadd = (this.dotlength * (this.y1 - this.y0)) / this.length;
    ctx.save();
    ctx.beginPath();
    for (var i = 1; i <= this.dotNum; i++) {
      if (i % 2 !== 0) {
        ctx.moveTo(this.x0 + (i - 1) * xadd, this.y0 + (i - 1) * yadd);
        ctx.lineTo(this.x0 + i * xadd, this.y0 + i * yadd);
      }
    }
    ctx.strokeStyle = "#FFF";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.x1, this.y1, bRadius - 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  },
};

var Ball = function (x, y, ismine) {
  this.x = x;
  this.y = y;
  this.ismine = ismine;
  this.oldx = x;
  this.oldy = y;
  this.vx = 0;
  this.vy = 0;
  this.radius = bRadius;
  this.inhole = false;
  this.angle = 0;
  this.moving = true;
};
Ball.prototype = {
  constructor: Ball,
  _paint: function () {
    var b = this.ismine
      ? document.getElementById("wb")
      : document.getElementById("yb");
    if (b.complete) {
      ctx.drawImage(
        b,
        this.x - this.radius,
        this.y - this.radius,
        2 * this.radius,
        2 * this.radius
      );
    } else {
      b.onload = function () {
        ctx.drawImage(
          b,
          this.x - this.radius,
          this.y - this.radius,
          2 * this.radius,
          2 * this.radius
        );
      };
    }
  },
  _run: function (t) {
    this.oldx = this.x;
    this.oldy = this.y;

    this.vx =
      Math.abs(this.vx) < 0.1
        ? 0
        : this.vx > 0
        ? this.vx - pwr * t
        : this.vx + pwr * t;
    this.vy =
      Math.abs(this.vy) < 0.1
        ? 0
        : this.vy > 0
        ? this.vy - pwr * t
        : this.vy + pwr * t;

    this.x += t * this.vx * pxpm;
    this.y += t * this.vy * pxpm;

    if (
      (this.x < 55 && this.y < 55) ||
      (this.x > 370 && this.x < 430 && this.y < 50) ||
      (this.x > 740 && this.y < 55) ||
      (this.x < 46 && this.y > 490) ||
      (this.x > 377 && this.x < 420 && this.y > 490) ||
      (this.x > 740 && this.y > 490)
    ) {
      this.inhole = true;
      if (this.ismine) {
        var that = this;
        setTimeout(function () {
          that.x = 202;
          that.y = canvas.height / 2;
          that.vx = 0;
          that.vy = 0;
          that.inhole = false;
        }, 500);
      } 
    } else {
      if (
        this.y > canvas.height - (bRadius + tablew) ||
        this.y < bRadius + tablew
      ) {
        this.y =
          this.y < bRadius + tablew
            ? bRadius + tablew
            : canvas.height - (bRadius + tablew);
        this.derectionY = !this.derectionY;
        this.vy = -this.vy * 0.6;
      }
      if (
        this.x > canvas.width - (bRadius + tablew) ||
        this.x < bRadius + tablew
      ) {
        this.x =
          this.x < bRadius + tablew
            ? bRadius + tablew
            : canvas.width - (bRadius + tablew);
        this.derectionX = !this.derectionX;
        this.vx = -this.vx * 0.6;
      }
    }

    this.angle = Math.atan((this.x - this.oldx) / (this.y - this.oldy));
    this._paint();

    if (Math.abs(this.vx) < 0.1 && Math.abs(this.vy) < 0.1) {
      this.moving = false;
    } else {
      this.moving = true;
    }
  },
};

Array.prototype.foreach = function (callback) {
  for (var i = 0; i < this.length; i++) {
    callback.apply(this[i], [i]);
  }
};

var Line = function (x0, y0, x1, y1) {
  this.start = {
    x: x0,
    y: y0,
  };
  this.end = {
    x: x1,
    y: y1,
  };
  this.x = null;
  this.y = null;
  this.k = (y0 - y1) / (x0 - x1);
  this.b = y0 - this.k * x0;
  if (x0 - x1 === 0) {
    this.x = x0;
  }
  if (y0 - y1 === 0) {
    this.y = y0;
  }
  this.angle = Math.asin(this.k);
  this._draw = function () {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.stroke();
    ctx.restore();
  };
};

function getLineCols(line1, line2) {
  if (line1.k - line2.k === 0) {
    return false;
  }
  var x, y;
  x = (line2.b - line1.b) / (line1.k - line2.k);
  y = line1.k * x + line1.b;

  if (line1.x !== null) {
    x = line1.x;
    y = line2.k * x + line2.b;
  } else if (line2.x !== null) {
    x = line2.x;
    y = line1.k * x + line1.b;
  }

  if (line1.y !== null) {
    y = line1.y;
    x = (y - line2.b) / line2.k;
  } else if (line2.y !== null) {
    y = line2.y;
    x = (y - line1.b) / line1.k;
  }

  if (
    ((x >= line1.start.x && x <= line1.end.x) ||
      (x >= line1.end.x && x <= line1.start.x)) &&
    ((y >= line1.start.y && y <= line1.end.y) ||
      (y >= line1.end.y && y <= line1.start.y))
  ) {
    if (
      ((x >= line2.start.x && x <= line2.end.x) ||
        (x >= line2.end.x && x <= line2.start.x)) &&
      ((y >= line2.start.y && y <= line2.end.y) ||
        (y >= line2.end.y && y <= line2.start.y))
    ) {
      return { x: x, y: y };
    }
  }
  return false;
}
