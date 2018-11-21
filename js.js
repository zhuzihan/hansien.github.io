  var c,ctx;
  var oBall,oPad;
  var sounds = [];
  var padLeft=false;
  var padRight=false;
  var isStart;
  var scores=0;
  var flag_pause=true;
  // window.onload = function(){
  //
  // }
  function Ball(x,y,dx,dy,r){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
  }
  function Pad(x,w,h,img){
    this.x = x;
    this.w = w;
    this.h = h;
    this.img = img;
  }
  function Bricks(w,h,r,c,pad){
    this.w =w;
    this.h =h;
    this.r =r;//行数
    this.c =c;
    this.pad =pad;//缝隙
    this.objs;//flag
    this.colors = ["red","orange","yellow","green","blue","lightgray"];
  }
  document.getElementById("start_btn").onclick = function(){
    if(flag_pause){
      //新游戏开始
      score.innerHTML = "0";
      scores = 0;
      clearInterval(isStart);
      init();
    }
    else{
      //继续游戏
      isStart = setInterval(function(){
        drawScene(c.width,c.height);
      },10);
      // document.getElementById("bd").onkeydown=function(){control(event)};
      flag_pause = true;
    }
  }
  document.getElementById("stop").onclick = function(){
    clearTimeout(isStart);
    flag_pause = false;
    document.getElementsByTagName("body").onkeydown = function (){};
  }
  //初始化函数
  function init(){
    c = document.getElementById("scene");
    ctx = c.getContext("2d");//2d环境

    var width = c.width;
    var height = c.height;

    var padImg = new Image();
    padImg.src = "images/paddle.png";

    oBall = new Ball(width/2,570,5,-5,10);

    oPad = new Pad(width/2-32,64,20,padImg);
    oBricks = new Bricks((width/8)-1,20,6,8,2);

    oBricks.objs = new Array(oBricks.r);
    for(var i=0;i<oBricks.r;i++){
      oBricks.objs[i] = new Array(oBricks.c);
      for(var j=0;j<oBricks.c;j++){
        oBricks.objs[i][j] = 1;
      }
    }
    sounds[0] = new Audio("media/snd1.wav");
    sounds[0].volume = 0.9;
    sounds[1] = new Audio("media/snd2.wav");
    sounds[2] = new Audio("media/snd3.mp3");

    var bodyObj = document.getElementsByTagName("body")[0];
    function control(event){
      switch(event.keyCode){
        case 37:
        padLeft = true;
        break;
        case 39:
        padRight = true;
        break;
      }
    }
    bodyObj.onkeydown = function(){control(event);}
    bodyObj.onkeyup = function(event){
      switch(event.keyCode){
        case 37:
        padLeft = false;
        break;
        case 39:
        padRight = false;
        break;
      }
    }
    isStart = setInterval(function(){
      drawScene(width,height);
    },10);
  }
  function drawScene(w,h){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = "#000"; //填充黑色矩形
    ctx.fillRect(0,0,w,h);

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(oBall.x,oBall.y,oBall.r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();

    if(padRight){
      if(oPad.x<w-oPad.w){
        oPad.x += 5;
      }
    }
    else if(padLeft){
      if(oPad.x>0){
        oPad.x -= 5;
      }
    }
    ctx.drawImage(oPad.img,oPad.x,h-oPad.h);

    //Bricks
    for(var i=0;i<oBricks.r;i++){
      ctx.fillStyle = oBricks.colors[i];
      for(var j=0;j<oBricks.c;j++){
        var z_x = j*(oBricks.w+oBricks.pad)+oBricks.pad;
        var z_y = i*(oBricks.h+oBricks.pad)+oBricks.pad;
        if(oBricks.objs[i][j]==1){
          ctx.beginPath();
          ctx.rect(z_x,z_y,oBricks.w,oBricks.h);
          ctx.closePath();
          ctx.fill();
        }
      }
    }

    var row_H = oBricks.h+oBricks.pad;
    var row_W = oBricks.w+oBricks.pad;

    var i_row = Math.floor(oBall.y/row_H);
    var i_col = Math.floor(oBall.x/row_W);

    if(oBall.y<oBricks.r*row_H && i_row>=0 && i_col>=0 && oBricks.objs[i_row][i_col]==1){
      oBricks.objs[i_row][i_col] = 0;
      var score = document.getElementById("score");
      scores +=1000;
      score.innerHTML = scores;
      oBall.dy = -oBall.dy;
      //sound play
      sounds[0].play();
    }

    oBall.y += oBall.dy;
    oBall.x += oBall.dx;
    // oBall.x += 5;
    if(oBall.y+oBall.dy-oBall.r < 0 ){
      oBall.dy = - oBall.dy;
    }
    else if(oBall.y+oBall.dy+oBall.r>h - oPad.h){
      if(oBall.x>oPad.x && oBall.x<oPad.x+oPad.w){
        oBall.dy = -oBall.dy;
        oBall.dx = ((oBall.x - (oPad.x + oPad.w/2))/oPad.w)*10;
        sounds[1].play();
      }
      else if(oBall.y + oBall.dy +oBall.r >h){
        clearInterval(isStart);
        sounds[2].play();//gameover
      }

    }
    if(oBall.x+oBall.dx-oBall.r<0 || oBall.x+oBall.dx+oBall.r>w){
      oBall.dx = -oBall.dx;
      // sounds[1].play();
    }
  }
