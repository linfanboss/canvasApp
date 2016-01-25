var canvasWidth = Math.min(600,$(window).width()-10);
var canvasHeight = canvasWidth;
var isMouseDown = false;
var lastLocation,lastTimeStamp;
var lastLineWidth = 0;
var strokeColor = 'black';

var canvas = document.getElementById("canvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var context = canvas.getContext('2d');
context.lineCap = 'round';
context.lineJoin = 'round';

drawGrid();

canvas.addEventListener('touchstart',function(e){
	e.preventDefault();
	var touchPos = e.touches[0];
	startStroke({x:touchPos.pageX,y:touchPos.pageY});
});
canvas.addEventListener('touchend',function(e){
	e.preventDefault();
	endStroke();
});
canvas.addEventListener('touchmove',function(e){
	e.preventDefault();
	if(isMouseDown == true){
		var touchPos = e.touches[0];
		moveStroke({x:touchPos.pageX,y:touchPos.pageY});
	}
});
canvas.onmousedown = function(e){
	e.preventDefault();
	startStroke({x:e.clientX,y:e.clientY});
}
canvas.onmouseup = function(e){
	e.preventDefault();
	endStroke();
}
canvas.onmouseout = function(e){
	e.preventDefault();
	endStroke();
}
canvas.onmousemove = function(e){
	e.preventDefault();
	if(isMouseDown == true){
		moveStroke({x:e.clientX,y:e.clientY});
	}
}
function startStroke(point){
	isMouseDown = true;
	lastLocation = calCanvasPos(point.x,point.y);
	lastTimeStamp = new Date().getTime();
}
function endStroke(){
	isMouseDown = false;
}
function moveStroke(point){
	//draw line
	var currentLocation = calCanvasPos(point.x,point.y);
	var currentTimeStamp = new Date().getTime();
	var s = calDistance(currentLocation,lastLocation);
	var t = currentTimeStamp - lastTimeStamp;
	var lineWidth = calLineWidth(s,t);

	context.beginPath();//此处要加上beginPath(),不然会导致米字格的线被重画掉
	context.moveTo(lastLocation.x,lastLocation.y);
	context.lineTo(currentLocation.x,currentLocation.y);
	context.lineWidth = lineWidth;
	context.strokeStyle = strokeColor;
	context.stroke();
	lastLocation = currentLocation;
	lastTimeStamp = currentTimeStamp;
	lastLineWidth = lineWidth;
}

$("#bottom").css('width',canvasWidth+'px');
$("#clearBtn").click(function(){
	context.clearRect(0,0,canvasWidth,canvasHeight);
	drawGrid();
});
$(".color").click(function(){
	strokeColor = $(this).css('backgroundColor');
	$("#bottom div").removeClass('color_select');
	$(this).addClass('color_select');
});
function calLineWidth(distance,time){
	var maxlineWidth = 30;
	var minLineWidth = 1;
	var maxSpeed = 10;
	var minSpeed = 0.1;

	var speed = distance/time;
	var result = 0;
	if(speed <= minSpeed){
		result = maxlineWidth;
	}else if(speed >= maxSpeed){
		result = minLineWidth;
	}else{
		result = maxlineWidth - (speed-minSpeed)/(maxSpeed-minSpeed)*(maxlineWidth-minLineWidth);
	}
	if(lastLineWidth == 0){
		return result;
	}else{
		return lastLineWidth*2/3 + result*1/3;
	}
}
function calDistance(currentPos,lastPos){
	return Math.sqrt((currentPos.x-lastPos.x)*(currentPos.x-lastPos.x)+(currentPos.y-lastPos.y)*(currentPos.y-lastPos.y));
}
function calCanvasPos(x,y){
	var canvasBox = canvas.getBoundingClientRect();
	return {x:Math.round(x-canvasBox.left), y:Math.round(y-canvasBox.top)}
}
function drawGrid(){
	context.save();
	context.strokeStyle = "rgb(230,11,9)";
	context.lineWidth = 6;
	context.beginPath();
	context.moveTo(3,3);
	context.lineTo(canvasWidth-3,3);
	context.lineTo(canvasWidth-3,canvasHeight-3);
	context.lineTo(3,canvasHeight-3);
	context.closePath();
	context.stroke();

	context.beginPath();
	context.lineWidth = 1;
	context.moveTo(3,3);
	context.lineTo(canvasWidth-3,canvasHeight-3);

	context.moveTo(canvasWidth-3,3);
	context.lineTo(3,canvasHeight-3);

	context.moveTo(3,canvasHeight/2);
	context.lineTo(canvasWidth-3,canvasHeight/2);

	context.moveTo(canvasWidth/2,3);
	context.lineTo(canvasWidth/2,canvasHeight-3);
	context.stroke();
	context.restore();
}
