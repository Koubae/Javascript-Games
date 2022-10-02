var canvas = document.getElementById('c');
var ctx = canvas.getContext('2d');

function mkGradient(opts){
    opts.ctx.rect(0, 0, opts.r2*2, opts.r2*2);

    var g = opts.ctx.createRadialGradient(opts.x||opts.r2, opts.x||opts.r2, opts.r1, opts.x||opts.r2, opts.x||opts.r2, opts.r2);

    g.addColorStop(0, opts.c1);
    g.addColorStop(1, opts.c2);


    opts.ctx.fillStyle = g;
    opts.ctx.fill();
}

var seede=999;
var lastVal = 2;
var pRand = function(){
  var thisVal = String(Math.round(Math.pow(seede++,lastVal)));
  lastVal = (Number(thisVal.substr(-1,1)) + Number(thisVal.substr(1,1)))/2;
  if(isNaN(lastVal)){
    lastVal = 2;
  }
  return Math.abs(Math.sin(thisVal));
}


function mkPlanet(opts){
    var pad = 1.8;
    seede = 1999889;
    var canvas = document.createElement('canvas');
    canvas.width = opts.r*(pad*2);
    canvas.height = opts.r*(pad*2);

    //     canvas.width =window.innerWidth;
    // canvas.height = window.innerHeight;

    var ctx = canvas.getContext('2d');

    // Halo
    mkGradient({
        ctx: ctx,
        r1: opts.r,
        r2: opts.r*pad,
        c1: opts.h1,
        c2: opts.h2
    });

    // Translate to edge of halo.
    var offset = opts.r*pad-opts.r;
    ctx.translate(offset, offset);

    ctx.save();
    /// Create planet outline clip
    ctx.beginPath();
    ctx.arc(opts.r, opts.r, opts.r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();

    // Fill the ocean
    mkGradient({
        ctx: ctx,
        r1: 0,
        r2: opts.r,
        c1: opts.o2,
        c2: opts.o1
    });

    // Add some continents
    for(var i=0;i<opts.r*10; i++){
        ctx.globalAlpha = pRand()*.8;
        var x = pRand()*opts.r*2;
        var y = pRand()*opts.r*2
        ctx.beginPath();
        ctx.arc(x, y, pRand()*(opts.r/10), 0, 2 * Math.PI);
        ctx.fillStyle = i > opts.r/2 ? opts.c3 : opts.c2;
        ctx.fill();
    }


    ctx.globalAlpha = 1;
    // Add some atmosphere
    mkGradient({
        ctx: ctx,
        r1: opts.r/2,
        r2: opts.r,
        c1: 'rgba(255,255,255,0)',
        c2: 'rgba(255,255,255,.5)'
    });


    if(!opts.radiant){
      mkGradient({
          ctx: ctx,
          r1: opts.r*1.3,
          r2: opts.r*2,
          c1: 'rgba(0,0,0,0)',
          c2: 'rgba(0,0,0,.8)',
          x: -opts.r/8
      });
    }

    ctx.restore();


    // Rings
    for(var i=0;i<100; i++){
        ctx.globalAlpha = .5;
        var seed = i*i+opts.time/100;
      var sinPt = Math.sin(seed);
        var y = opts.r + pRand()*opts.r/5;
        var x = opts.r + sinPt*(opts.r*(pad*0.75));
        var size = (Math.sin(i)+1)*(opts.r/100);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fillStyle = sinPt < .75 && sinPt > -0.75 ? '#00f' : '#0f0';
        ctx.fill();
    }
    return canvas;
}


var p = 3;
function drawFrame(){
    var sun = mkPlanet({
      r:200,
      o1: '#FFF500',
      o2: '#FFE300',
      c2: '#FFC700',
      c3: '#FFAF00',
      h1: 'rgba(255,122,0,1)',
      h2: 'rgba(255,12,0,0)',
      radiant:true,
      time:p++
  });

  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(sun,0,0);
  requestAnimationFrame(drawFrame);
}

drawFrame();

