var socket = io("https://620ee524-ec28-4c0c-84a9-8a891f8a0687-00-2yl8bpx3ypd0p.janeway.replit.dev/clientframe.html");
var first = true;
var userAmt = 0;
var userlist = [];
var bonzislist = [];
var mousex = 0;
var mousey = 0;
var logtxt = "<i>Welcome to BonziWORLD XP</i>"

$(window).load(function(){
  $("#login_card").show();
  $("#login_load").hide();
  $("#login_go1").click(() => {
      setTimeout(() => {
        var audioe = new Audio("/sound/start.mp3");
        audioe.play();
        first = false;
      },300);
    $("#login_card").html('<input id="login_name" type="text" placeholder="Nickname"><input id="login_room" type="text" placeholder="Room ID (Optional)"><div id="login_go"></div><div id="login_error" style="display:none"></div>');
    $("#login_go").click(login);
    $("#login_name, #login_room").keypress(function(e) {
      if(e.which == 13) {
        socket.emit("login", {name: $("#login_name").val(), room: $("#login_room").val()});
        login();
      }
    });
  });
});
function app(type){
  if(type == "flash_playerbg"){
    var playr = "";
    function runGame(swf){
      var flashcontext = document.getElementById("flash_con");
      flashcontext.style.width = "550px";
      flashcontext.style.height = "440px";
      flashcontext.style.visibility = "visible";
      flashcontext.innerHTML = "";
      window.RufflePlayer = window.RufflePlayer || {};
      window.RufflePlayer.config = {
        forcescale: true,
        quality: "low"
      }
      var rufl = "";
      var urle = swf;
        var ruffle = window.RufflePlayer.newest();
        var player = ruffle.createPlayer();
        var container = document.getElementById("flash_con");
        player.style.width = "495px";
        player.style.height = "396px";
        container.appendChild(player);
        player.load(urle);
        rufl = window.RufflePlayer.newest();
        playr = player;
      document.getElementById("flash_x").onclick = () => {
        playr.remove();
        document.getElementById("flash_window").style.visibility = "hidden";
        flashcontext.innerHTML = '<a id="flash_it" href="javascript:var a=1;">Icy Tower</a><br><a id="flash_pb" href="javascript:var a=1;">Papas Burgeria</a><br><input type="text" id="swfurl"><button id="cst">Custom Swf URL</button>';
        flashcontext.style.visibility = "hidden";
      }
    }


    document.getElementById("cst").onclick = () => {
      runGame(document.getElementById("swfurl").value);
    }
    document.getElementById("flash_x").onclick = () => {
      document.getElementById("flash_window").style.visibility = "hidden";
      document.getElementById("flash_con").style.visibility = "hidden";
    }
    document.getElementById("flash_player").onclick = () => {
      document.getElementById("flash_window").style.visibility = "visible";
      document.getElementById("flash_con").style.visibility = "visible";
    }
    document.getElementById("flash_it").onclick = () => {
      runGame("icytower.swf");
    }
    document.getElementById("flash_pb").onclick = () => {
      runGame("papasburgeria.swf");
    }
  }

  if(type == "bsn"){
    new bonziwindow("bsn","BSN Messenger","<div id='bsn_cont'></div>","<hr>","80%","80%");
    $("#bsn_cont").innerHTML = "<iframe src='/bsn.html'"
  }
}
function bonziwindow(type, header, body, buttons, top, left){
  var localId = Id(5);
  var previous = 0;
  var current = 0;

  currentDrag = localId;
  this.move = (left,top) => {
    $("#" + localId).css({
      "left": left + "px",
      "top": top + "px"
    });
  }

  $("#content").append('<div id='+localId+' class="window" style="position: absolute;top: '+top+'; left: '+ left+';"><div style="height:14%;width:85%;" id="'+localId+'_bar"><img id="'+localId+'_x" class="x" src="/img/desktop/x.png"></div><div id="'+localId+'_con" style="position:relative;left: 2%;"><h3 class="header">'+header+'</h3><br>'+body+'</div></div>');

  $("#" + localId + "_con").css({'font-family': 'WinXP'});

  $("#" + localId + "_bar").on("mousedown", () => {

  })
  if(buttons == "ok"){
    $("#" + localId).append('<div style="position:relative;top: 29%;left:2%;"><button id="'+localId+'_ok">Ok</button>');
  }
  if(buttons == "ok_cancel"){
    $("#" + localId).append('<div style="position:relative; top: 29%; left:2%; display:flex;"><button id="'+localId+'_ok">Ok</button><button id="'+localId+'_cancel">Cancel</button></div>');
  }
  if(buttons.includes('<')){
    $("#" + localId).append(buttons);
  }
  document.getElementById(localId).style.position = "absolute";
  $("#" + localId + "_x").on("mousedown", function(){
    $("#" + localId).remove();
  });
  $("#" + localId + "_ok").on("mousedown", function(){
    if(type == "options"){
    socket.emit("command",{type: "color", param: $("#color").val()});
    socket.emit("command",{tyoe: "name", param: $("#newname").val()}); 
    }
    $("#" + localId).remove();
  });
  $("#" + localId + "_cancel").on("mousedown", function(){
    $("#" + localId).remove();
  });
  document.addEventListener('mousemove', (e) => {
    left = e.clientX;
    t = e.clientY;
  });
}
function Id(length) {
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';let result = '';
   for (let i = 0; i < length; i++){
      result += characters.charAt(Math.floor(Math.random() * characters.length));
   }
   return result;
}
function touchHandler(event){
  var touches = event.changedTouches,first = touches[0],type = "";
  switch(event.type){
    case "touchstart": type = "mousedown"; break;
    case "touchmove":  type = "mousemove"; break;        
    case "touchend":   type = "mouseup";   break;
    default:           return;
  }
  var simulated = document.createEvent("MouseEvent");
  simulated.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0, null);
  first.target.dispatchEvent(simulated);
}
function sendMsg(){
  var msg = $("#chat_message").val();

  if(msg.startsWith("/")){
    var cmdtype = msg.substring(1, msg.indexOf(" "));
    var param = msg.substring(msg.indexOf(" ") + 1, msg.length);
    console.log(cmdtype +" "+param);
    socket.emit("command",{type: cmdtype, param: param})
  } else {
    socket.emit("msg",{msg: msg});
  }
  $("#chat_message").val("")
}
function notif(head, body, top, left, type){
  let localId = Id(10);
  console.log("bla")
  $("#content").append("<div class='notif' id='"+localId+"' style='top:"+top+";left:"+left+";'><div class='notif_cont'><h3 class='notif_header'>"+head+"</h3><div class='body'>"+body+"</div></div></div>");
  document.body.onresize = () => {
    var info = document.getElementById("info_icon").getBoundingClientRect().x - 330;
    var info2 = $(window).height() - 140;
    var infox = info + "px";
    var infoy = info2 + "px";
    if(type == "info")
    $("#"+localId).css({
       "top": infoy,
       "left": infox
    });
  }
  setTimeout(() => { $("#"+localId).remove(); },6000)
}
function bonzi(colorurl,left,top,property){
  var width = 200;
  var height = 160;
  var rows = 21;
  var columns = 17;
  var localId = property.id;
  
  $("#content").append("<div id='name_"+localId+"' style='position:absolute;' class='bonzi_name'>"+property.name+"</div><canvas class='bonzi_canvas' width='200' height='160' style='position:absolute;top:"+top+";left:"+left+";' id='"+localId+"'></canvas><div id='chat_"+localId+"' class='bubble_chat'><div class='msg_cont'>Test Message</div></div><div id='point_"+localId+"' class='bubble_point'></div>");
  $("#chat_"+localId).hide();
  $("#point_" + localId).hide();
  
  var canvas = document.getElementById(localId);
  var ctx = canvas.getContext('2d');
  var img = new Image();
  var draw = (x,y) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
  }
  var animate = (properties) => {
    if(properties.type == "idle"){
      draw(0,0);
    } 
    if(properties.type == "surf_right"){
      let x = 200;
      let y = 0;
      var col = columns * width - width - width;
      var row = 0;
      var anim = setInterval(() => {
        if(x > col){x = 0; y+=height;}
        if(y > row){y = 0;x = 0;}

        draw(x,y);
        x+=200;
      },80);
      setTimeout(()=>{clearInterval(anim)},750);
    }
  }
  var move = (properties) => {
    var yInt = parseInt(properties.y);
    var xInt = parseInt(properties.x);
    var namey = yInt - 10;
    var namex = xInt - 10;
    var chaty = namey + 65;
    var chatx = namex + 160;
    var pointx = chatx - 19;
    var pointy = chaty;

    document.getElementById("name_"+localId).style.top = namey + "px";
    document.getElementById("name_"+localId).style.left = namex + "px";
    document.getElementById("chat_"+localId).style.left = chatx + "px";
    document.getElementById("chat_"+localId).style.top = chaty + "px";
    document.getElementById("point_"+localId).style.top = pointy + "px";
    document.getElementById("point_"+localId).style.left = pointx + "px";
    canvas.style.left = properties.x;
    canvas.style.top = properties.y;
  }
  var talk = (properties) => {
    $("#chat_" + localId).show();
    $("#point_" + localId).show();
    $("#chat_" + localId).html(properties.text);

    var wordsPerMinute = 80;
    var words = properties.text.split(' ').length;
    if(words < 2 && properties.text.length > 20){
      wordsPerMinute = 40;
    }
    const approximateDuration = (words / wordsPerMinute) * 60 * 1000; 

    speak.play(properties.text, { pitch: 80, speed: 150 });

    setTimeout(() => {
        $("#chat_" + localId).hide();
        $("#point_" + localId).hide();
      console.log("")
    }, approximateDuration);

  } 
  var update = (properties) => {
    $("#name_" + localId).html(properties.name);
    img.src = properties.color;
    draw(0,0);
    animate({type: "idle"});
  }
  
  this.animate = animate;
  this.move = move;
  this.draw = draw;
  this.talk = talk;
  this.update = update;
  
  this.id = localId;
  this.name = property.name;
  console.log("Bonzi initialized");
  img.src = colorurl;
  img.onload = function() {
    draw(0,0);
    var yInt = parseInt(document.getElementById(localId).style.top);
    var xInt = parseInt(document.getElementById(localId).style.left);
    move({x: xInt, y: yInt})
    //let x = 0;
    //let y = 0;
    //var col = columns * width - width;
    //var row = rows * height - height;
    //setInterval(() => {
      //if(y > row){y = 0;x = 0;}
      //if(x > col){x = 0; y+=height;}

      //draw(x,y);
      //x+=200;
    //},80);
  }
  var mousestat = "up";
  var mouseloop = setInterval(() => {
    var xmax = $(window).width();
    let neg = (int) => {return 0-int;}
    var ymax = $(window).height();
    var newx = mousex - 50;
    var newy = mousey - 50;
    var xqueue = newx > neg(xmax) && newx < xmax;
    var yqueue = newy > neg(ymax) && newy < ymax;
    if(mousestat == "down"){
      if(xqueue && yqueue){
        move({x: newx + "px", y: newy + "px"});
      }
    }
    
  },10);
  document.onmousemove = (e) => {
    e = window.event;
    mousex = e.clientX;
    mousey = e.clientY;
  }
  document.getElementById(localId).onmousedown = () => {
    mousestat = "down";
    $("body").css({
      "user-select": "none"
    });
  }
  document.getElementById(localId).onmouseup = () => {
    mousestat = "up";
    $("body").css({
      "user-select": "auto"
    });
  }
}
function updateUsers(){
  userAmt = userlist.length;
  $("#users_online").html("Users online: "+userAmt);
}
function screenbonzis(properties){
  var bonziselect = "";
  for(i=0;i<bonzislist.length;i++){
    if(bonzislist[i].id == properties.id){
      bonziselect = bonzislist[i];
    }
  }
  return bonziselect;
}
function login(){
  $("#login_card").hide();
  $("#login_load").show();
  socket.emit("login",{name: $("#login_name").val(), room: $("#login_room").val()});

  $("#chat_message").keypress((e) => {
    if(e.which == 13) sendMsg();
  });
  var clickhandlers = [
    {id: "#my_bonzi", func: () => {
      new bonziwindow('options','My Bonzi Options','<hr><div style="display:flex;"><p>Color: </p><select id="color"><option value="red">Red</option><option value="green">Green</option> <option value="blue">Blue</option><option value="purple">Purple</option><option value="pink">Pink</option><option value="black">Black</option><option value="brown">Brown</option><option value="bsn">BSN Icon</option><option value="peedy">Peedy</option><option value="smile">Smile</option></select></div><div style="display:flex;"><p>Name: </p><input type="text" placeholder="name..." id="newname"></div></div>','ok_cancel','40%','40%'); 
    }},
    {id: "#bonzi_log", func: () => {
      new bonziwindow('bw','Bonzi Log','<hr><div id="log_cont">'+logtxt+'</div>','ok','0%','0%');
    }},
    {id: "#info_icon", func: () => {
      var icon = document.getElementById("info_icon").getBoundingClientRect().x - 310 + "px";
      var icon2 = $(window).height() - 140 + "px";
      var iconx = icon + "px";
      var icony = icon2 + "px";
      new notif("Welcome to BonziWORLD XP","BonziWORLD XP is in early development/beta. Beware there might be some glitches.", icony, iconx,"info");
    }},
    {id: "#games", func: () => {
      new bonziwindow("games","BonziWORLD Games","<div style='width:300px;height:120px;overflow:scroll'><img src='/img/desktop/flash.png' id='flash_player' width='40' height='40'>Flash Player</img></div>","ok");
      new app("flash_playerbg");
    }},
    {id: "#bsn_messenger", func: () => {
      BSN();
    }},
    {id: "#chat_send", func: () => {
      sendMsg();
    }}
  ];
  for(i = 0; i < clickhandlers.length; i++){
    $(clickhandlers[i].id).click(clickhandlers[i].func);
  }

  socket.on("room", (data) => {
    $("#page_login").hide();
    $("#room_public").hide();
    $("#room_private").hide();
    $("#room_owner").hide();
    if(data.isPublic){
      $("#room_public").show();
      $(".room_id").text("default");
    } else {
      $("#room_private").show();
      $(".room_id").text(data.room);
    }
    if(data.isOwner){
      $("#room_owner").show();
    }
  });
  socket.on("userlist", (data) => {
    userlist = data;
    userAmt = userlist.length;
    for(i=0;i<userAmt;i++){
      var newuser = new bonzi(userlist[i].color,randompos("x"),randompos("y"),{name: userlist[i].name, id: userlist[i].id});
      bonzislist = [...bonzislist, newuser];
    }
    updateUsers();
  });
  socket.on("newuser", (data) => {
    var newuser = new bonzi(data.color,randompos("x"),randompos("y"),{name: data.name, id: data.id});
    bonzislist = [...bonzislist, newuser];
  });
  socket.on("leave", (data) => {
    document.getElementById(data.id).remove();
    document.getElementById("name_" + data.id).remove();
    document.getElementById("chat_" + data.id).remove();
    document.getElementById("point_" + data.id).remove();
  });
  socket.on("msg", (data) => {
    var thisbonzi = screenbonzis({id: data.id});
    logtxt+=thisbonzi.name + data.msg+"<br>";
    thisbonzi.talk({text: data.msg});
  });
  socket.on("updateUser", (data) => {
    var n = data.name;
    if(data.name !== ""){data.name = n}
    screenbonzis({id: data.id}).update({name: data.name, color: data.color, id: data.id});
  });
    var randompos = (type) => {
      var maxh = $(window).height() - 180;
      var maxw = $(window).width() - 180;
      
      var newx1 = Math.floor(Math.random() * maxw);
      var newy1 = Math.floor(Math.random() * maxh);
      if(type == "x"){
        return newx1 + "px";
      }
      if(type == "y"){
        return newy1 + "px";
      }
    }
  
  
}
