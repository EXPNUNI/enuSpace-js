///////////////////////////////////////////////////////////////////////////////////////
// 설    명 : IoT DIY 프로젝트 개발자를 위한 GUI 기반 통합 저작도구 개발 과제 수행중 개발된 소스
//           
// 사용방법 : NONE
// 작 성 자 : WH LEE
// 작성일자 : 2017.02
// 제 작 사 : 이엔유주식회사, ENU Co., Ltd
// 참조정보 : 
// Copyright (C) ENU Corporation
// All rights reserved.
// 수정이력 : 
// 2017.03.31: 그라데이션 추가 chs
///////////////////////////////////////////////////////////////////////////////////////
function coordinates()
{
    this.x;
    this.y;
}
function ellipseradius()
{
    this.rx;
    this.ry;
}
function CreateCanvas()
{
	canvas = $('#ID_CANVAS')[0];
	canvas_2Ddraw = canvas.getContext("2d");

	//Mouse Events
	canvas.addEventListener("click",mouseclick,false);
	canvas.addEventListener("touchstart",mousedown,false);
	canvas.addEventListener("dblclick",mousedblclick,false);
	canvas.addEventListener("mousemove",mousemove,false);
	canvas.addEventListener("mouseup",mouseup,false);
	canvas.addEventListener("mousedown",mousedown,false);
	canvas.addEventListener("mouseover",mouseover,false);
	canvas.addEventListener("mouseout",mouseout,false);
	//Resource Events
	canvas.addEventListener("load",onload,false);
	//Standard Events
	canvas.addEventListener("DOMActivate",DOMActivate,false);
	canvas.addEventListener("DOMFocusIn",DOMFocusIn,false);
	canvas.addEventListener("DOMFocusOut",DOMFocusOut,false);

	ctx = new CanvasWrapper(canvas_2Ddraw);
	canvas.id = "ID_CANVAS";

	/////////////////////////////////////////////////////
	if($('#imageLists').length == 0)
	{
		var text = "<div id=\"imageLists\"></div>";
		$('#Canvas_contents').append(text)
	}
	/////////////////////////////////////////////////////
	m_worldPos.x =0;
	m_worldPos.y =0;
	m_mouseOldPos.x = 0;
	m_mouseOldPos.y = 0;	

	m_bAutoscale =false;

	m_wordldScale.x =1;
	m_wordldScale.y=1;		
}

var InitMt;
var BoundBoxs = [];

function mouseclick(event)
{
    for (var i=0; i<BoundBoxs.length; i++)
    {
        var bb = BoundBoxs[i][0];
        var obj = BoundBoxs[i][1];
        if(obj.nodename == "path" || obj.nodename == "polyline"  )
        {
            if (ctx.isPointInPath && ctx.isPointInPath(event.offsetX, event.offsetY))
            {
                if(obj._onclick != undefined)
                {
                    obj._onclick();
                    Draw_All(window[root_obj_id]);
                }
            }
        }
        else
        {
            if(bb.isPointInBox(event.offsetX, event.offsetY))
            { 
                if(obj._onclick != undefined)
                {
                    obj._onclick();
                    Draw_All(window[root_obj_id]);
                }  
            }
        }
    }
}

function mousedblclick(event)
{
    for (var i=0; i<BoundBoxs.length; i++)
    {
        var bb = BoundBoxs[i][0];
        var obj = BoundBoxs[i][1];
        /*
        if(bb.isPointInBox(event.x, event.y))
        {
            obj._ondbclick();
        }
        
        goPOPUP("","test");
        */
    }
}

function mousemove(event)
{
    if(m_svgmoveflag == true)
    {
//        m_worldPos.x = m_mouseOldPos.x - (m_mouseStartPos.x - event.offsetX);
//        m_worldPos.y = m_mouseOldPos.y - (m_mouseStartPos.y - event.offsetY);
          m_worldPos.x = m_worldPos.x + event.offsetX - m_mouseOldPos.x;
          m_worldPos.y = m_worldPos.y + event.offsetY - m_mouseOldPos.y;
    }
	
	m_mouseOldPos.x = event.offsetX;
	m_mouseOldPos.y = event.offsetY;
	
    for (var i=0; i<BoundBoxs.length; i++)
    {
        var bb = BoundBoxs[i][0];
        var obj = BoundBoxs[i][1];
        if(obj.nodename == "path" || obj.nodename == "polyline")
        {
            if (ctx.isPointInPath && ctx.isPointInPath(event.offsetX, event.offsetY))
            {
                if((obj._onmousemove != undefined || obj.nodename == "svg"))
                {
                    obj._onmousemove();
                    Draw_All(window[root_obj_id]);
                }
                if((obj._onmouseover != undefined || obj.nodename == "svg") && mouse_over_obj != obj)
                {
                    if((mouse_over_obj._onmouseout != undefined || obj.nodename == "svg") && mouse_over_obj != obj)
                    {
                        if(mouse_over_obj._onmouseout != undefined)
						{
							mouse_over_obj._onmouseout();
						}
                        Draw_All(window[root_obj_id]);
                    }
                    if(obj._onmouseover)
					{
						obj._onmouseover();
					}
                    mouse_over_obj = obj;
                    Draw_All(window[root_obj_id]);
                }
            }
        }
        else
        {
            if(bb.isPointInBox(event.offsetX, event.offsetY))
            { 
                if(obj._onmousemove != undefined)
                {
                    obj._onmousemove();
                    Draw_All(window[root_obj_id]);
                }
               if((obj._onmouseover != undefined || obj.nodename == "svg") && mouse_over_obj != obj)
                {
                    if((mouse_over_obj._onmouseout != undefined || obj.nodename == "svg") && mouse_over_obj != obj)
                    {
						if(mouse_over_obj._onmouseout != undefined)
						{
							mouse_over_obj._onmouseout();
						}
                        Draw_All(window[root_obj_id]);
                    }
					if(obj._onmouseover)
					{
						obj._onmouseover();
					}
                    mouse_over_obj = obj;
                    Draw_All(window[root_obj_id]);
                }
                
            }
        }
    }
}

function mouseup(event)
{
    if(m_svgmoveflag == true)
    {
//        m_worldPos.x = m_mouseOldPos.x - (m_mouseStartPos.x - event.offsetX);
//        m_worldPos.y = m_mouseOldPos.y - (m_mouseStartPos.y - event.offsetY);
//        m_mouseOldPos.x = m_worldPos.x;
//        m_mouseOldPos.y = m_worldPos.y; 
       m_svgmoveflag = false;
    }
    m_mouseOldPos.x = event.offsetX;
    m_mouseOldPos.y = event.offsetY; 	
	
    for (var i=0; i<BoundBoxs.length; i++)
    {
        var bb = BoundBoxs[i][0];
        var obj = BoundBoxs[i][1];
        if(obj.nodename == "path" || obj.nodename == "polyline"  )
        {
            if (ctx.isPointInPath && ctx.isPointInPath(event.offsetX, event.offsetY))
            {
                if(obj._onmouseup != undefined)
                {
                    obj._onmouseup();
                    Draw_All(window[root_obj_id]);
                }
            }
        }
        else
        {
            if(bb.isPointInBox(event.offsetX, event.offsetY))
            { 
                if(obj._onmouseup != undefined)
                {
                    obj._onmouseup();
                    Draw_All(window[root_obj_id]);
                }  
            }
        }
    }
}

function mousedown(event)
{		
    for (var i=0; i<BoundBoxs.length; i++)
    {
        var bb = BoundBoxs[i][0];
        var obj = BoundBoxs[i][1];
        if(obj.nodename == "path" || obj.nodename == "polyline"  )
        {
            if (ctx.isPointInPath && ctx.isPointInPath(event.offsetX, event.offsetY))
            {
                if(obj._onmousedown != undefined)
                {
                    obj._onmousedown();
                    Draw_All(window[root_obj_id]);
                }
            }
        }
        else if(obj.nodename == "svg")
        {
            m_svgmoveflag = true;
        }
        else
        {
            if(bb.isPointInBox(event.offsetX, event.offsetY))
            { 
                if(obj._onmousedown != undefined)
                {
                    obj._onmousedown();
                    Draw_All(window[root_obj_id]);
                }  
            }
        }
    }
	m_mouseStartPos.x = event.offsetX;
	m_mouseStartPos.y = event.offsetY;	
}

function mouseover(event)
{
    for (var i=0; i<BoundBoxs.length; i++)
    {
        var bb = BoundBoxs[i][0];
        var obj = BoundBoxs[i][1];
        if(obj.nodename == "path" || obj.nodename == "polyline"  )
        {
            if (ctx.isPointInPath && ctx.isPointInPath(event.offsetX, event.offsetY))
            {
                if(obj._onmouseover != undefined)
                {
                    obj._onmouseover();
                    Draw_All(window[root_obj_id]);
                }
            }
        }
        else
        {
            if(bb.isPointInBox(event.offsetX, event.offsetY))
            { 
                if(obj._onmouseover != undefined)
                {
                    obj._onmouseover();
                    Draw_All(window[root_obj_id]);
                }
            }
        }
    }
}

function mouseout(event)
{
    for (var i=0; i<BoundBoxs.length; i++)
    {
        var bb = BoundBoxs[i][0];
        var obj = BoundBoxs[i][1];
        if(obj.nodename == "path" || obj.nodename == "polyline"  )
        {
            if (ctx.isPointInPath && ctx.isPointInPath(event.offsetX, event.offsetY))
            {
                if(obj._onmouseout != undefined)
                {
                    obj._onmouseout();
                    Draw_All(window[root_obj_id]);
                }
            }
        }
        else
        {
            if(bb.isPointInBox(event.offsetX, event.offsetY))
            { 
                if(obj._onmouseout != undefined)
                {
                    obj._onmouseout();
                    Draw_All(window[root_obj_id]);
                }  
            }
        }
    }
    Draw_All(window[root_obj_id]);
}

function onload(event)
{
    for (var i=0; i<BoundBoxs.length; i++)
    {
        var bb = BoundBoxs[i][0];
        var obj = BoundBoxs[i][1];
        if(obj.nodename == "path" || obj.nodename == "polyline"  )
        {
            if (ctx.isPointInPath && ctx.isPointInPath(event.offsetX, event.offsetY))
            {
                if(obj._onload != undefined)
                {
                    obj._onload();
                    Draw_All(window[root_obj_id]);
                }
            }
        }
        else
        {
            if(bb.isPointInBox(event.offsetX, event.offsetY))
            { 
                if(obj._onload != undefined)
                {
                    obj._onload();
                    Draw_All(window[root_obj_id]);
                }  
            }
        }
    }
}

function DOMActivate(event)
{
    for (var i=0; i<BoundBoxs.length; i++)
    {
        var bb = BoundBoxs[i][0];
        var obj = BoundBoxs[i][1];
        if(obj.nodename == "path" || obj.nodename == "polyline"  )
        {
            if (ctx.isPointInPath && ctx.isPointInPath(event.offsetX, event.offsetY))
            {
                if(obj._onactivate != undefined)
                {
                    obj._onactivate();
                    Draw_All(window[root_obj_id]);
                }
            }
        }
        else
        {
            if(bb.isPointInBox(event.offsetX, event.offsetY))
            {
                if(obj._onactivate != undefined)
                {
                    obj._onactivate();
                    Draw_All(window[root_obj_id]);
                }  
            }
        }
    }
}

function DOMFocusIn(event)
{
    for (var i=0; i<BoundBoxs.length; i++)
    {
        var bb = BoundBoxs[i][0];
        var obj = BoundBoxs[i][1];
        if(obj.nodename == "path" || obj.nodename == "polyline"  )
        {
            if (ctx.isPointInPath && ctx.isPointInPath(event.offsetX, event.offsetY))
            {
                if(obj._onfocusin != undefined)
                {
                    obj._onfocusin();
                    Draw_All(window[root_obj_id]);
                }
            }
        }
        else
        {
            if(bb.isPointInBox(event.offsetX, event.offsetY))
            {
                if(obj._onfocusin != undefined)
                {
                    obj._onfocusin();
                    Draw_All(window[root_obj_id]);
                }  
            }
        }
    }
}

function DOMFocusOut(event)
{
    for (var i=0; i<BoundBoxs.length; i++)
    {
        var bb = BoundBoxs[i][0];
        var obj = BoundBoxs[i][1];
        if(obj.nodename == "path" || obj.nodename == "polyline"  )
        {
            if (ctx.isPointInPath && ctx.isPointInPath(event.offsetX, event.offsetY))
            {
                if(obj._onfocusout != undefined)
                {
                    obj._onfocusout();
                    Draw_All(window[root_obj_id]);
                }
            }
        }
        else
        {
            if(bb.isPointInBox(event.offsetX, event.offsetY))
            {
                if(obj._onfocusout != undefined)
                {
                    obj._onfocusout();
                    Draw_All(window[root_obj_id]);
                }  
            }
        }
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
trim = function(s) { return s.replace(/^\s+|\s+$/g, ''); }
compressSpaces = function(s) { return s.replace(/[\s\r\t\n]+/gm,' '); }

function ToNumberArray(s)
{
    var a = trim(compressSpaces((s || '').replace(/,/g, ' '))).split(' ');
			for (var i=0; i<a.length; i++) {
				a[i] = parseFloat(a[i]);
			}
			return a;
};

function CreatePath(s)
{
  var a = ToNumberArray(s);
  var path = [];
  for (var i=0; i<a.length; i+=2) {
      path.push(new enuPoint(a[i], a[i+1]));
			}
    return path;
    
};
///////////////////////////////////////////////////////////////////////////////////////////////

enuPoint = function(x, y) {
			this.x = x;
			this.y = y;
		}

CreatePoint = function(s) {
			var a = ToNumberArray(s);
			return new enuPoint(a[0], a[1]);
		}

m_worldPos = function(x,y)
{
    this.x =x;
    this.y =y;
}
m_mouseOldPos = function(x,y)
{
    this.x =x;
    this.y =y;
}
m_mouseStartPos = function(x,y)
{
    this.x =x;
    this.y =y;
}
var m_svgmoveflag = false;
m_wordldScale = function(x,y)
{
    this.x =x;
    this.y =y;
}
var m_bAutoscale =true;	

BoundingBox = function(x1, y1, x2, y2) { // pass in initial points if you want
            this.x1 = Number.NaN;
            this.y1 = Number.NaN;
            this.x2 = Number.NaN;
            this.y2 = Number.NaN;

            this.x = function() { return this.x1; }
            this.y = function() { return this.y1; }
            this.width = function() { return this.x2 - this.x1; }
            this.height = function() { return this.y2 - this.y1; }

            this.addPoint = function(x, y) {	
                if (x != null) {
                    if (isNaN(this.x1) || isNaN(this.x2)) {
                        this.x1 = x;
                        this.x2 = x;
                    }
                    if (x < this.x1) this.x1 = x;
                    if (x > this.x2) this.x2 = x;
                }

                if (y != null) {
                    if (isNaN(this.y1) || isNaN(this.y2)) {
                        this.y1 = y;
                        this.y2 = y;
                    }
                    if (y < this.y1) this.y1 = y;
                    if (y > this.y2) this.y2 = y;
                }
            }			
            this.addX = function(x) { this.addPoint(x, null); }
            this.addY = function(y) { this.addPoint(null, y); }

            this.addBoundingBox = function(bb) {
                this.addPoint(bb.x1, bb.y1);
                this.addPoint(bb.x2, bb.y2);
            }

            this.addQuadraticCurve = function(p0x, p0y, p1x, p1y, p2x, p2y) {
                var cp1x = p0x + 2/3 * (p1x - p0x); // CP1 = QP0 + 2/3 *(QP1-QP0)
                var cp1y = p0y + 2/3 * (p1y - p0y); // CP1 = QP0 + 2/3 *(QP1-QP0)
                var cp2x = cp1x + 1/3 * (p2x - p0x); // CP2 = CP1 + 1/3 *(QP2-QP0)
                var cp2y = cp1y + 1/3 * (p2y - p0y); // CP2 = CP1 + 1/3 *(QP2-QP0)
                this.addBezierCurve(p0x, p0y, cp1x, cp2x, cp1y,	cp2y, p2x, p2y);
            }

            this.addBezierCurve = function(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
                // from http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
                var p0 = [p0x, p0y], p1 = [p1x, p1y], p2 = [p2x, p2y], p3 = [p3x, p3y];
                this.addPoint(p0[0], p0[1]);
                this.addPoint(p3[0], p3[1]);

                for (i=0; i<=1; i++) {
                    var f = function(t) { 
                        return Math.pow(1-t, 3) * p0[i]
                        + 3 * Math.pow(1-t, 2) * t * p1[i]
                        + 3 * (1-t) * Math.pow(t, 2) * p2[i]
                        + Math.pow(t, 3) * p3[i];
                    }

                    var b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
                    var a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
                    var c = 3 * p1[i] - 3 * p0[i];

                    if (a == 0) {
                        if (b == 0) continue;
                        var t = -c / b;
                        if (0 < t && t < 1) {
                            if (i == 0) this.addX(f(t));
                            if (i == 1) this.addY(f(t));
                        }
                        continue;
                    }

                    var b2ac = Math.pow(b, 2) - 4 * c * a;
                    if (b2ac < 0) continue;
                    var t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
                    if (0 < t1 && t1 < 1) {
                        if (i == 0) this.addX(f(t1));
                        if (i == 1) this.addY(f(t1));
                    }
                    var t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
                    if (0 < t2 && t2 < 1) {
                        if (i == 0) this.addX(f(t2));
                        if (i == 1) this.addY(f(t2));
                    }
                }
            }

            this.isPointInBox = function(x, y) {
                return (this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2);
            }

            this.addPoint(x1, y1);
            this.addPoint(x2, y2);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//var canvas_2Ddraw = new CanvasWrapper(document.getElementById("canvas").getContext("2d"));

function Draw_Init(obj)
{
    if(obj != undefined)
    {
        BoundBoxs =[];
       // ctx.clearRect(0, 0, canvas.width, canvas.height);
        //ctx.clearRect(0,0,obj.width,obj.height);
//        m_worldPos.x =0;
//        m_worldPos.y =0;
//        m_mouseOldPos.x = 0;
//        m_mouseOldPos.y = 0;
        mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"
        
      if (canvas.attachEvent) //if IE (and Opera depending on user setting)
        {
            canvas.attachEvent("on"+mousewheelevt, onmousewheel);
        }
        else if (canvas.addEventListener) //WC3 browsers
        {
            canvas.addEventListener(mousewheelevt, onmousewheel, false);
        }
      
//        m_bAutoscale =false;
        //캔버스 사이즈 와 svg 사이즈를 비교한다
        //큰축을 기준으로 스케일을 만든다.
        
//        m_wordldScale.x =1;
//        m_wordldScale.y=1;
    }
}


function Draw_All(obj)
{
    if(obj != undefined)
    {
        if(obj.nodename == "svg")
        {
            CanvasSetup();
            //ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.rect(0,0,canvas.width,canvas.height);
            SetStyle(obj);
            ctx.globalAlpha=obj.fill_opacity;
            ctx.fill();
            ctx.globalAlpha=obj.stroke_opacity;
            ctx.stroke();
            ctx.save();  //초기화
            InitMt = createMatrixIdentity()
            ctx.setMatrix(InitMt);
            var TotalScalex =1;
            var TotalScaley =1;
      
            
            if(m_bAutoscale)
            {
                var _offset =1;
                
                if (obj.width/canvas.clientWidth > obj.height/canvas.clientHeight)
                {
                     _offset=  canvas.clientWidth/obj.width;  
                }
                else
                {
                    _offset=  canvas.clientHeight/obj.height ;
                }
                TotalScalex = m_wordldScale.x *_offset;
                TotalScaley = m_wordldScale.y *_offset;    
            }
            else
            {
                TotalScalex = m_wordldScale.x;
                TotalScaley = m_wordldScale.y;
            }
            
            ctx.translate(m_worldPos.x, m_worldPos.y);
            ctx.scale(TotalScalex,TotalScaley);
            
            InitMt = ctx.getMatrix();
            BoundBoxs =[];
            
            var bb = new BoundingBox(0, 0, canvas.width,canvas.height);
            var map = [bb,obj];
            BoundBoxs.push(map);
            
            renderObj(obj,InitMt);
            ctx.restore();  //초기화
            
            //ctx.setMatrix(InitMt);
            var mt = ctx.getMatrix();
        }
    }
}

function IsPrimitive(objNode)
{
    if(objNode ==  "line" || objNode ==  "rect" || objNode ==  "polygon" || objNode ==  "polyline" || objNode ==  "path" ||  objNode ==  "text" || objNode ==  "g" || objNode ==  "use")
    {
        return true;
    }
    else
    {
        return false;  
    }
}

function IsTrendObj(objNode)
{
    if(objNode ==  "pg-trend" || objNode ==  "pg-trendtitle" || objNode ==  "pg-trendlegend" || objNode ==  "pg-trendxaxis" || objNode ==  "pg-trendyaxis" ||  objNode ==  "pg-trendgraph" || objNode ==  "pg-trendseries")
    {
        return true;
    }
    else
    {
        return false;  
    }
}
//12.14 LWH
//계층구조로 재귀함수로
function renderObj(Obj,Parent_TF,MY_GBB)
{
    //documentElement는 항상 루트 노드를 나타낸다
	if(Obj)
	{
        var GBoundBoxs = []; 
        var ChildGBB;

		if(Obj.childNodes.length)
        {
            for(var i =0;i<Obj.childNodes.length;i++)
            {
                var childobj = Obj.childNodes[i];
				var Transform_cur =InitMt;

                if(childobj.nodename == "line" && childobj.visibility != false)
                {
                    Transform_cur = DrawLineObj(childobj,Parent_TF,GBoundBoxs);
                }
                else if(childobj.nodename == "rect" && childobj.visibility != false)
                {
                    Transform_cur=DrawRectObj(childobj,Parent_TF,GBoundBoxs);
                }
                else if((childobj.nodename == "polygon" || childobj.nodename == "polyline") && childobj.visibility != false)
                {
                    Transform_cur =DrawPolygonObj(childobj,Parent_TF,GBoundBoxs);
                }
                else if((childobj.nodename == "ellipse" || childobj.nodename == "circle") && childobj.visibility != false)
                {
                    Transform_cur =DrawEllipseObj(childobj,Parent_TF,GBoundBoxs);
                }
                else if(childobj.nodename == "path" && childobj.visibility != false)
                {
                    Transform_cur =DrawPathObj(childobj,Parent_TF,GBoundBoxs);
                }
                else if(childobj.nodename == "text" && childobj.visibility != false)
                {
                    Transform_cur =DrawTextObj(childobj,Parent_TF,GBoundBoxs);
                }
                else if(childobj.nodename == "image" && childobj.visibility != false)
                {
                    Transform_cur =DrawImageObj(childobj,Parent_TF,GBoundBoxs);
                }
                else if(childobj.nodename == "g" && childobj.visibility != false)
                {
                    Transform_cur = DrawGObj(childobj,Parent_TF);
                    ChildGBB = new BoundingBox();
                    var bbMap = [ChildGBB,Obj];
                    GBoundBoxs.push(bbMap);
                }
                else if(childobj.nodename == "use" && childobj.visibility != false)
                {
                    Transform_cur = DrawUseObj(childobj,Parent_TF);
                    ChildGBB = new BoundingBox();
                    var bbMap = [ChildGBB,Obj];
                    GBoundBoxs.push(bbMap);
                }
                else if(childobj.nodename == "pg-link")
                {
                    Activelinkcolor(childobj);
                }
                else if(childobj.nodename == "pg-set-attribute")   // pg-attribute의 경우 타입별 변수형으로 맞춰서 문자열을 변경시킨다.
                {
                    pgSetAttribute(Obj, childobj);
                }
                else if(childobj.nodename == "pg-trend" && childobj.visibility != false)
                {
                    Transform_cur = DrawTrendObj(childobj,Parent_TF,GBoundBoxs);
                    ChildGBB = new BoundingBox();
                    var bbMap = [ChildGBB,Obj];
                    GBoundBoxs.push(bbMap);
                }
                else if(childobj.nodename == "pg-trendtitle" && Obj.title_visible != "hidden")
                {
                    Transform_cur = DrawTrendtitleObj(childobj,Parent_TF,GBoundBoxs);
                }
                else if(childobj.nodename == "pg-trendlegend" && Obj.legend_visible != "hidden")
                {
                    Transform_cur = DrawTrendlegendObj(childobj,Parent_TF,GBoundBoxs);
                }
                else if(childobj.nodename == "pg-trendxaxis")
                {
                    Transform_cur = DrawTrendxaxisObj(childobj,Parent_TF,GBoundBoxs);
                }
                else if(childobj.nodename == "pg-trendyaxis")
                {
                    Transform_cur = DrawTrendyaxisObj(childobj,Parent_TF,GBoundBoxs);
                }
                else if(childobj.nodename == "pg-trendgraph" && Obj.grid_visible != "hidden")
                {
                    Transform_cur = DrawTrendgraphObj(childobj,Parent_TF,GBoundBoxs);
                }
                else if(childobj.nodename == "pg-trendseries" && Obj.visibility != "hidden")
                {
                    Transform_cur = DrawTrendseriesObj(childobj,Parent_TF,GBoundBoxs);
                }
                else
                {
                    Transform_cur =Parent_TF;
                }
                
                if(childobj.childNodes)
                {
                    if(childobj.childNodes.length != 0 && (IsPrimitive(childobj.nodename) || IsTrendObj(childobj.nodename)) && childobj.visibility != false)
                    {
                        renderObj(childobj,Transform_cur,ChildGBB);
                    }
                }
			}
            //그룹, use객체인경우는 하위 루프를 돌고 모아서 처리한다. 
            if(Obj.nodename =="g" || Obj.nodename =="use")
            {
                bb =MY_GBB;
                for (var i=0; i<GBoundBoxs.length; i++) {
					bb.addBoundingBox(GBoundBoxs[i][0]);
				}
                var bbMap = [bb,Obj]; 
                BoundBoxs.push(bbMap);
                for (var i=0; i<GBoundBoxs.length; i++) {
					 BoundBoxs.push(GBoundBoxs[i]);
				}
                GBoundBoxs =[];
            }
		}
	}
}
function Activelinkcolor(obj)
{
    var parentobj = obj.parentObj;
    /*if(obj.from_value)
    {
        if(obj.from_value == false)
        {
            parentobj.stroke = "rgb(255,0,0)";
        }
        else
        {
            parentobj.stroke = "rgb(0,255,0)";
        }
    }
    else
    {*/
        var pinlist = window[obj.from_id].pin_list;
        if(pinlist.length)
        {
            for(var i in pinlist)
            {
                if(pinlist[i].var_type == "bool")
                {
                    if(pinlist[i].name == obj.param_from)
                    {
                        var bool_check = window[obj.from_id][obj.param_from];
                        if(bool_check == false)
                        {
                            parentobj.stroke = "rgb(255,0,0)";
                            parentobj.fill = "rgb(255,0,0)";
                        }
                        else
                        {
                            parentobj.stroke = "rgb(0,255,0)";
                            parentobj.fill = "rgb(0,255,0)";
                        }
                    }
                }
            }
        }
    //}
}

function pgSetAttribute(parentobj, childnode)
{
    if(childnode.value.indexOf("#") != -1)
    {
        parentobj[childnode.variable.substring(1,childnode.variable.length)] = eval(childnode.value.substring(1,childnode.value.length));
    }
}

function SetTransform(obj)
{
    ctx.translate(parseFloat(obj.translate_x), parseFloat(obj.translate_y));
    ctx.translate(parseFloat(obj.center_x), parseFloat(obj.center_y));
    ctx.scale(obj.scale_x,obj.scale_y);
    ctx.rotate(obj.rotate*Math.PI/180);
    ctx.translate(parseFloat(-obj.center_x), parseFloat(-obj.center_y));
}

function SetTextStyle(obj)
{
    //ctx.font = "italic bold 48px  serif";
    var fontBold;
    
    if(obj.stroke != 'undefined' ||obj.stroke != "" )
    {
        ctx.fillStyle =obj.stroke;
    }
    else
    {  
         ctx.fillStyle= "rgb(0,0,0)";
    }
    
	var fontData ="";
    
    if(obj.font_style !='undefined')
    {
        fontData += obj.font_style+ " ";
    }
    if(obj.font_style !='undefined')
    {
        if(obj.font_weight == "bold" || obj.font_weight == "BOLD" ) 
        {
            fontBold = "bold";
            fontData += fontBold + " ";
        }
    }
    if(obj.font_size != 'undefined')
    {
        fontData +=obj.font_size + " ";
    }
    else
    {
         fontData +="10 ";
    }
    if(obj.font_family!='undefined')
    {
        fontData += obj.font_family;
    }
    
	ctx.font =fontData;
}

function SetStyle(obj)
{
    if(obj.fill.indexOf("rgb(") != -1)
   {
      ctx.fillStyle = obj.fill;
   }
   else if(obj.fill.indexOf("#") != -1 && obj.fill.indexOf("url") == -1)
   {
      var r = obj.fill.substring(1,3);
      var g = obj.fill.substring(3,5);
      var b = obj.fill.substring(5,7);
      
      var fill_text = "rgb("+ parseInt(r, 16) + "," + parseInt(g, 16) + "," + parseInt(b, 16) + ")";
      ctx.fillStyle = fill_text;
   }
    ctx.strokeStyle = obj.stroke;
    
    if(obj.stroke_width !='undefined')
    {
        ctx.lineWidth = obj.stroke_width;
    }
   else
    {
        ctx.lineWidth = 1;
    }
    
    ctx.lineCap = obj.stroke_linecap;
    ctx.lineJoin = obj.stroke_linejoin; 
    
    var gaps = ToNumberArray(obj.stroke_dasharray);
    if(String(gaps) != "NaN")
    {
        if (typeof(ctx.setLineDash) != 'undefined')
        {
            ctx.setLineDash(gaps);
        } 
    }
    else
    {
        var empty_dash = [];
        ctx.setLineDash(empty_dash);
    }
}

function DrawLineObj(obj,Parent_TF,GBoundBoxs)
{
    var bIsGroup =false;
    var parentOBJ =obj.parentObj;
    if(parentOBJ.nodename == "g" || parentOBJ.nodename == "use")
    {bIsGroup =true;}
    else
    {bIsGroup =false;}
    
    ctx.setMatrix(Parent_TF);
    SetTransform(obj);
    SetStyle(obj);
    
    if(obj.visibility == false)
    {
        return ctx.getMatrix();
    }
   
    //draw line
    //알파값(opacity)은 실시간으로 먹여준다.
    ctx.globalAlpha=obj.stroke_opacity;
    ctx.beginPath();
    ctx.moveTo(obj.x1,obj.y1);
    ctx.lineTo(obj.x2,obj.y2);
    ctx.stroke();
    ctx.closePath();
    DrawArrow(obj);
    
    var PW1 = ctx.getCoords(obj.x1,obj.y1);
    var PW2 = ctx.getCoords(obj.x2,obj.y2);
    
     if(PW1.x-PW2.x < 1 && PW1.x -PW2.x >-1)
    {
        PW1.x =PW1.x - 2;
        PW2.x =PW2.x + 2;
    }
    if(PW1.y-PW2.y <1 && PW1.y -PW2.y >-1)
    {
        PW1.y =PW1.y - 2;
        PW2.y =PW2.y + 2;
    }
    
    var bb =new BoundingBox(PW1.x, PW1.y, PW2.x, PW2.y);
    var map =[bb,obj];
    
	if(bIsGroup)
    {
       GBoundBoxs.push(map);
    }
    else
    {
       BoundBoxs.push(map);
    }

    return ctx.getMatrix();
}

function DrawRectObj(obj,Parent_TF,GBoundBoxs)
{
    var bIsGroup =false;
    var parentOBJ =obj.parentObj;
    
    if(parentOBJ.nodename == "g" || parentOBJ.nodename == "use")
    {bIsGroup =true;}
    else
    {bIsGroup =false;}
    
   ctx.setMatrix(Parent_TF);
    SetTransform(obj);
    SetStyle(obj);
    
    if(obj.visibility == false)
    {
        return ctx.getMatrix();
    }
    ///////////////////////////////////////////////////////////////////
  
    var x =obj.x;
    var y =obj.y;
    var rx =obj.rx;
    var ry =obj.ry;
    var width = obj.width;
    var height = obj.height;
    
    ctx.beginPath();
    ctx.moveTo(x + rx, y);
    ctx.lineTo(x + width - rx, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + ry)
    ctx.lineTo(x + width, y + height - ry);
    ctx.quadraticCurveTo(x + width, y + height, x + width - rx, y + height)
    ctx.lineTo(x + rx, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - ry)
    ctx.lineTo(x, y + ry);
    ctx.quadraticCurveTo(x, y, x + rx, y)
    ctx.closePath();

  
    ///////////////////////////////////////////////////////////////////
    var PW1 = ctx.getCoords(obj.x,obj.y);
    var PW2 = ctx.getCoords(obj.x+obj.width, obj.y+obj.height);
    
    
     if(PW1.x-PW2.x <1 && PW1.x -PW2.x >-1)
    {
        PW1.x =PW1.x -1;
        PW2.x =PW2.x +1;
    }
    if(PW1.y-PW2.y <1 && PW1.y -PW2.y >-1)
    {
        PW1.y =PW1.y -1;
        PW2.y =PW2.y +1;
    }
   
    
    var bb =new BoundingBox(PW1.x, PW1.y, PW2.x, PW2.y);
    var map =[bb,obj];
    
	SetGrident(bb,obj);
	ctx.globalAlpha=obj.fill_opacity;
    ctx.fill();
    ctx.globalAlpha=obj.stroke_opacity;
    ctx.stroke();
	
   if(bIsGroup)
    {
       GBoundBoxs.push(map);
    }
    else
    {
       BoundBoxs.push(map);
    }
   
   return ctx.getMatrix();
}

function DrawPolygonObj(obj,Parent_TF,GBoundBoxs)
{
    var bIsGroup =false;
    var parentOBJ =obj.parentObj;
    if(parentOBJ.nodename == "g" || parentOBJ.nodename == "use")
    {bIsGroup =true;}
    else
    {bIsGroup =false;} 
    
    
    ctx.setMatrix(Parent_TF);
    SetTransform(obj);
    SetStyle(obj);
    
    if(obj.visibility == false)
    {
        return ctx.getMatrix();
    }
    
    //노드설정
    var points = CreatePath(obj.points);
    
    if(points.length != 0)
    {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        
        var PW1 = ctx.getCoords(points[0].x, points[0].y);
        var bb =new BoundingBox(PW1.x, PW1.y);
       
		
		
		
        for (var i=1; i<points.length; i++) 
        {
			ctx.lineTo(points[i].x, points[i].y);
            PW1 = ctx.getCoords(points[i].x, points[i].y);
            bb.addPoint(PW1.x, PW1.y);
        }
		SetGrident(bb,obj);  //그라데이션추가
		
        if(obj.nodename == "polygon")
        {
            ctx.closePath();
            ctx.globalAlpha=obj.fill_opacity;
            ctx.fill();
            ctx.globalAlpha=obj.stroke_opacity;
            ctx.stroke();
        }
        else
        {   
            ctx.globalAlpha=obj.stroke_opacity;
            ctx.stroke();
            DrawArrow(obj);
        }
    
        var map =[bb,obj];
        if(bIsGroup)
        {
            GBoundBoxs.push(map);
        }
        else
        {
            BoundBoxs.push(map);
        }
    }
    return ctx.getMatrix();
}

function IsClipObj(datatype)
{
    if(datatype =="Donut")
        return true;
    if(datatype =="Symbol")
        return true;
    if(datatype =="Frame")
        return true;
    return false;
}

function DrawPathObj(obj,Parent_TF,GBoundBoxs)
{
    var bIsGroup =false;
    var parentOBJ =obj.parentObj;
    if(parentOBJ.nodename == "g" || parentOBJ.nodename == "use")
    {bIsGroup =true;}
    else
    {bIsGroup =false;}
    
    ctx.setMatrix(Parent_TF);
    SetTransform(obj);
    SetStyle(obj);
    
    if(obj.visibility == false)
    {
        return ctx.getMatrix();
    }
    
	ctx.globalAlpha =1;
	
    var IsClipOBJ = IsClipObj(obj.datatype);
    var isClosed = false;
    
    var d = obj.d;
    var index = -1;
    
   d= d.replace(/,/g, " ");
   var tokens =[];
   var strValue ="";
   var strType ="";
   for(var i =0 ; i < d.length;i++)
   {
      var cValue = d[i];

         switch (cValue)
         {
            case 'M':
            case 'm':
            case 'L':
            case 'l':
            case 'H':
            case 'h':
            case 'V':
            case 'v':
            case 'C':
            case 'c':
            case 'S':
            case 's':
            case 'Q':
            case 'q':
            case 'T':
            case 't':
            case 'A':
            case 'a':
            case 'Z':
            case 'z':
            {
               //이전의 값을 저장한다.
               
               if(strValue!="")
               {
                  tokens.push(strType);
                  
                  var temp = strValue.split(' ');
                  for(var x =0; x< temp.length;x++)
                  {
                     if(temp[x] !='')
                        tokens.push(temp[x]);
                  }      

               }
               strType = cValue;   
               strValue = "";
               
               break;
               }
            
         default:
         {
            strValue = strValue + cValue;
            break;
         }
         
      }

   }
   if (strType != ' ')
   {
      tokens.push(strType);
      var temp = strValue.split(' ');
      for(var i =0; i< temp.length;i++)
      {
         if(temp[i] !='')
            tokens.push(temp[i]);
      }
   }
         
   
   
   
    var CurrentPoint = new enuPoint(0,0);
    var Control= new enuPoint(0,0);
    var Start = new enuPoint(0,0);
    var command = '';
    var previousCommand = '';
    var points = [];
    var angles = [];
    
    function isRelativeCommand()
    {
        switch(command)
        {
            case 'm':
            case 'l':
            case 'h':
            case 'v':
            case 'c':
            case 's':
            case 'q':
            case 't':
            case 'a':
            case 'z':
                return true;
                break;
        }
        return false;
    }
    function getToken()
    {
        index++;
        return tokens[index];
    }
        
    function makeAbsolute(p)
    {
        if (isRelativeCommand()) {
         p.x += CurrentPoint.x;
         p.y += CurrentPoint.y;
        }
        return p;
    }
    function getScalar()
    {
        return parseFloat(getToken());
    }
       
    function getPoint()
    {
        var p = new enuPoint(getScalar(), getScalar());
        return makeAbsolute(p);
    }
    
    function getAsCurrentPoint()
    {
        var p = getPoint();
        CurrentPoint = p;
        return p;   
    }
    
    function getAsControlPoint()
    {
        var p = getPoint();
        control = p;
        return p;
    }
    
    function nextCommand() 
    {
        previousCommand = command;
        command = getToken();
    }
    
    function isEnd()
    {
        return index >= tokens.length - 1;
    }
    
    function isCommandOrEnd()
    {
        if (isEnd()) return true;
        return tokens[index + 1].match(/^[A-Za-z]$/) != null;
    }
    
    function addMarkerAngle(p, a)
   {
      points.push(p);
      angles.push(a);
   }
    
    function addMarker(p, from, priorTo)
   {
      // if the last angle isn't filled in because we didn't have this point yet ...
      if (priorTo != null && angles.length > 0 && angles[angles.length-1] == null) {
         angles[angles.length-1] = points[tpoints.length-1].angleTo(priorTo);
      }
      this.addMarkerAngle(p, from == null ? null : from.angleTo(p));
   }
    
    function getReflectedControlPoint()
   {
      if (previousCommand.toLowerCase() != 'c' && 
         previousCommand.toLowerCase() != 's' &&
         previousCommand.toLowerCase() != 'q' && 
         previousCommand.toLowerCase() != 't' )
      {
         return CurrentPoint;
      }
      
      // reflect point
      var p = new enuPoint(2 * CurrentPoint.x - control.x, 2 * CurrentPoint.y - control.y);               
      return p;
   }
    
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //M 49.18 171.00 L 42.93 142.27 C 2.20 121.58 -12.17 75.24 10.82 38.65 s 74.36 -49.42 115.09 -28.73 c 40.56 20.69 54.93 67.03 31.94 103.45 c -16.90 27.02 -50.36 42.07 -84.50 37.96 L 49.18 171.00 z
    

    var isFirstLoof= true;
   var isZendLoof = true;
    ctx.beginPath();
    var bb = new BoundingBox();
      
   var   multiObj =false;        
   if(obj.data_type == "Donut" || obj.data_type == "Symbol" || obj.data_type == "Frame")
   {
      multiObj = true;
   }   
      
    while(!isEnd())
    {
        nextCommand();
        
        switch (command) 
        {
            case 'M':
            case 'm':
            {
                //z로 끝나지 않고 m이 들어오는경우 첫번째 경우는 제외함.
                //두번째 루프이므로 첫번째 라인을 처리한다.
                if(isFirstLoof == false )
                {
                    if(isClosed == false )
                    {
                        ctx.globalAlpha=obj.stroke_opacity;
                        ctx.stroke();
                    }else
                    {
                        if(IsClipOBJ==true)
                        {
                            canvas_2Ddraw.globalCompositeOperation='destination-out';
                        }
                    }
               
               //////////////////////////////////////////////////////////////
               //도넛등 구멍을 뚫기위해 멀티플래그를 변경한다.
               if(!multiObj)
                  ctx.beginPath();
                }
            if(isFirstLoof ==true)
                {
                    isFirstLoof = false;
                }
                var p = getAsCurrentPoint();
               
                ctx.moveTo(p.x, p.y);
                
                var PW1 = ctx.getCoords(p.x, p.y);                
               
                bb.addPoint(PW1.x, PW1.y);
                start = CurrentPoint;
                
                while (!isCommandOrEnd())
                {
                    var p = getAsCurrentPoint();
            
                    var PW1 = ctx.getCoords(p.x, p.y);                
                    
                    bb.addPoint(PW1.x, PW1.y);
               
                    if (ctx != null) ctx.lineTo(p.x, p.y);
                }
                isClosed = false;
                
                break;
            }
            case 'L':
            case 'l':
            {
                while (!isCommandOrEnd())
            {
               var c = CurrentPoint;
               var p = getAsCurrentPoint();
               //addMarker(p, c);
      
               var PW1 = ctx.getCoords(p.x , p.y);
               
               bb.addPoint(PW1.x, PW1.y);
               ctx.lineTo(p.x , p.y);
            }
            break;
            }
            case 'H':
            case 'h':
            {
                while (!isCommandOrEnd())
            {
               var newP = new enuPoint((isRelativeCommand() ? CurrentPoint.x : 0) + getScalar(), CurrentPoint.y);
               //addMarker(newP, CurrentPoint);
               CurrentPoint = newP;
         
               var PW1 = ctx.getCoords(CurrentPoint.x, CurrentPoint.y);
               
               bb.addPoint(PW1.x, PW1.y);
               
               if (ctx != null) ctx.lineTo(CurrentPoint.x, CurrentPoint.y);
            }
            break;
            }
            case 'V':
            case 'v':
            {
                while (!isCommandOrEnd())
            {
               var newP = new enuPoint(CurrentPoint.x, (isRelativeCommand() ? CurrentPoint.y : 0) + getScalar());
               //addMarker(newP, CurrentPoint);
               CurrentPoint = newP;
         
               var PW1 = ctx.getCoords(CurrentPoint.x, CurrentPoint.y);
               
               bb.addPoint(PW1.x, PW1.y);
               ctx.lineTo(CurrentPoint.x, CurrentPoint.y);
            }
            break;
            }
            case 'C':
            case 'c':
            {
                while (!isCommandOrEnd())
            {
               var curr = CurrentPoint;
               var p1 = getPoint();
               var cntrl = getAsControlPoint();
               var cp = getAsCurrentPoint();
               //addMarker(cp, cntrl, p1);
         
               var PW1 = ctx.getCoords(curr.x, curr.y);
               var PW2 = ctx.getCoords(p1.x, p1.y);
               var PW3 = ctx.getCoords(cntrl.x, cntrl.y);
               var PW4 = ctx.getCoords(cp.x, cp.y);  
               
               bb.addBezierCurve(PW1.x, PW1.y,PW2.x,PW2.y,PW3.x,PW3.y,PW4.x,PW4.y);
               ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
            }
            break;
            }
            case 'S':
            case 's':
            {
                while (!isCommandOrEnd())
            {
               var curr = CurrentPoint;
               var p1 = getReflectedControlPoint();
               var cntrl = getAsControlPoint();
               var cp = getAsCurrentPoint();
               //addMarker(cp, cntrl, p1);
               var PW1 = ctx.getCoords(curr.x, curr.y);
               var PW2 = ctx.getCoords(p1.x, p1.y);
               var PW3 = ctx.getCoords(cntrl.x, cntrl.y);
               var PW4 = ctx.getCoords(cp.x, cp.y);  
               
               bb.addBezierCurve(PW1.x, PW1.y,PW2.x,PW2.y,PW3.x,PW3.y,PW4.x,PW4.y);
               ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
            }
            break;
            }
            case 'Q':
            case 'q':
            {
                while (!isCommandOrEnd())
            {
               var curr = CurrentPoint;
               var cntrl = getAsControlPoint();
               var cp = getAsCurrentPoint();
               //pp.addMarker(cp, cntrl, cntrl);
               //bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
               var PW1 = ctx.getCoords(curr.x, curr.y);
               var PW2 = ctx.getCoords(cntrl.x, cntrl.y);
               var PW3 = ctx.getCoords(cp.x, cp.y);
       
               bb.addQuadraticCurve(PW1.x, PW1.y,PW2.x,PW2.y,PW3.x,PW3.y);
               ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
            }
            break;
            }
            case 'T':
            case 't':
            {
                while (!pp.isCommandOrEnd())
            {
               var curr = CurrentPoint;
               var cntrl = getReflectedControlPoint();
               control = cntrl;
               var cp = getAsCurrentPoint();
               //pp.addMarker(cp, cntrl, cntrl);
               //bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
               var PW1 = ctx.getCoords(curr.x, curr.y);
               var PW2 = ctx.getCoords(cntrl.x, cntrl.y);
               var PW3 = ctx.getCoords(cp.x, cp.y);
       
               bb.addQuadraticCurve(PW1.x, PW1.y,PW2.x,PW2.y,PW3.x,PW3.y);
               ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
            }
            break;
            }
            case 'A':
            case 'a':
            {
                while (!isCommandOrEnd())
                {
                   var curr = CurrentPoint;
                   var rx = getScalar();
                   var ry = getScalar();
                   var xAxisRotation = getScalar() * (Math.PI / 180.0);
                   var largeArcFlag = getScalar();
                   var sweepFlag = getScalar();
                   var cp = getAsCurrentPoint();
                   cp.x =cp.x ;
                   cp.y=cp.y;

                   var currp = new enuPoint(
                      Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0,
                      -Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0
                   );

                   var l = Math.pow(currp.x,2)/Math.pow(rx,2)+Math.pow(currp.y,2)/Math.pow(ry,2);

                   if (l > 1) {
                      rx *= Math.sqrt(l);
                      ry *= Math.sqrt(l);
                   }
                   var s = (largeArcFlag == sweepFlag ? -1 : 1) * Math.sqrt(
                      ((Math.pow(rx,2)*Math.pow(ry,2))-(Math.pow(rx,2)*Math.pow(currp.y,2))-(Math.pow(ry,2)*Math.pow(currp.x,2))) /
                      (Math.pow(rx,2)*Math.pow(currp.y,2)+Math.pow(ry,2)*Math.pow(currp.x,2))
                   );

                   if (isNaN(s)) s = 0;

                   var cpp = new enuPoint(s * rx * currp.y / ry, s * -ry * currp.x / rx);
                   // cx, cy
                   var centp = new enuPoint(
                      (curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y,
                      (curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y
                   );

                   // vector magnitude
                   var m = function(v) { return Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2)); }
                   // ratio between two vectors
                   var r = function(u, v) { return (u[0]*v[0]+u[1]*v[1]) / (m(u)*m(v)) }
                   // angle between two vectors
                   var a = function(u, v) { return (u[0]*v[1] < u[1]*v[0] ? -1 : 1) * Math.acos(r(u,v)); }
                   // initial angle
                   var a1 = a([1,0], [(currp.x-cpp.x)/rx,(currp.y-cpp.y)/ry]);
                   // angle delta
                   var u = [(currp.x-cpp.x)/rx,(currp.y-cpp.y)/ry];
                   var v = [(-currp.x-cpp.x)/rx,(-currp.y-cpp.y)/ry];
                   var ad = a(u, v);

                   if (r(u,v) <= -1) ad = Math.PI;

                   if (r(u,v) >= 1) ad = 0;

                   // for markers
                   var dir = 1 - sweepFlag ? 1.0 : -1.0;
                   var ah = a1 + dir * (ad / 2.0);
                   var halfWay = new enuPoint(
                      centp.x + rx * Math.cos(ah),
                      centp.y + ry * Math.sin(ah)
                   );

                   //addMarkerAngle(halfWay, ah - dir * Math.PI / 2);
                   //addMarkerAngle(cp, ah - dir * Math.PI);\
                   var PW1 = ctx.getCoords(cp.x, cp.y);

                   bb.addPoint(PW1.x, PW1.y);

                   if (ctx != null)
                   {
                      var r = rx > ry ? rx : ry;
                      var sx = rx > ry ? 1 : rx / ry;
                      var sy = rx > ry ? ry / rx : 1;

                      ctx.translate(centp.x, centp.y);
                      ctx.rotate(xAxisRotation);
                      ctx.scale(sx, sy);
                      ctx.arc(0, 0, r, a1, a1 + ad, 1 - sweepFlag);
                      ctx.scale(1/sx, 1/sy);
                      ctx.rotate(-xAxisRotation);
                      ctx.translate(-centp.x, -centp.y);
                   }
                }
                break;
            }
            case 'Z':
            case 'z':
            {
                ctx.closePath();
                
                SetGrident(bb,obj);
                ctx.globalAlpha=obj.fill_opacity;
            
            
            if(!multiObj)
            {
               ctx.fill(); 
            }
         
             //첫번째 루프이므로 통과하면 false 처리함.
                
                if(IsClipOBJ==true)
                {
                   canvas_2Ddraw.globalCompositeOperation='source-over'; 
                }
                ctx.globalAlpha=obj.stroke_opacity;
                ctx.stroke();
                isClosed = true;
           
                CurrentPoint = start;
                break; 
            }
     
        } 
    }
    
   if(multiObj)
   {
      canvas_2Ddraw.mozFillRule = 'evenodd'; //for old firefox 1~30
      canvas_2Ddraw.fill('evenodd'); 
   }
   
    if(isClosed == false)
    {    
        ctx.globalAlpha=obj.stroke_opacity;
        ctx.stroke();
    }
   
   canvas_2Ddraw.globalCompositeOperation='source-over'; 
    
    var map =[bb,obj];
    if(bIsGroup)
    {
        GBoundBoxs.push(map);
    }
    else
    {
        BoundBoxs.push(map);
    }
    return ctx.getMatrix();
}

function DrawEllipseObj(obj,Parent_TF,GBoundBoxs)
{
    var bIsGroup =false;
    var parentOBJ =obj.parentObj;
    
    if(parentOBJ.nodename == "g" || parentOBJ.nodename == "use")
    {bIsGroup =true;}
    else
    {bIsGroup =false;}
    
    ctx.setMatrix(Parent_TF);
    SetTransform(obj);
    SetStyle(obj);
    
    if(obj.visibility == false)
    {
        return ctx.getMatrix();
    }
    
    ///////////////////////////////////////////////////////////////////////////////
    var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
    var rx = parseFloat(obj.rx);
    var ry = parseFloat(obj.ry);
    var cx = parseFloat(obj.cx);
    var cy = parseFloat(obj.cy);
    
    if(obj.nodename == "ellipse")
    {
         rx = parseFloat(obj.rx);
         ry = parseFloat(obj.ry);
    }
	else
    {
         rx = parseFloat(obj.r);
         ry = parseFloat(obj.r);
    }
    
	ctx.globalAlpha=obj.fill_opacity;
    
    if (ctx != null)
    {
	    ctx.beginPath();
        ctx.moveTo(cx, cy - ry);
        ctx.bezierCurveTo(cx + (KAPPA * rx), cy - ry,  cx + rx, cy - (KAPPA * ry), cx + rx, cy);
        ctx.bezierCurveTo(cx + rx, cy + (KAPPA * ry), cx + (KAPPA * rx), cy + ry, cx, cy + ry);
        ctx.bezierCurveTo(cx - (KAPPA * rx), cy + ry, cx - rx, cy + (KAPPA * ry), cx - rx, cy);
        ctx.bezierCurveTo(cx - rx, cy - (KAPPA * ry), cx - (KAPPA * rx), cy - ry, cx, cy - ry);
        ctx.closePath();
        
        
        var PW1 = ctx.getCoords(cx - rx, cy - ry);
        var PW2 = ctx.getCoords( cx + rx, cy + ry);
        var bb = new BoundingBox(PW1.x,PW1.y,PW2.x,PW2.y);
        var map =[bb,obj];
		SetGrident(bb,obj);
		
		ctx.globalAlpha=obj.fill_opacity;
        ctx.fill();
        ctx.globalAlpha=obj.stroke_opacity;
        ctx.stroke();
		
		if(bIsGroup)
        {
            GBoundBoxs.push(map);
        }
        else
        {
            BoundBoxs.push(map);
        }
	}
	return ctx.getMatrix();
}

function DrawTextObj(obj,Parent_TF,GBoundBoxs)
{
    var bIsGroup =false;
    var parentOBJ =obj.parentObj;
    
    if(parentOBJ.nodename == "g" || parentOBJ.nodename == "use")
    {bIsGroup =true;}
    else
    {bIsGroup =false;}
    
    
    ctx.setMatrix(Parent_TF);
   
    SetTransform(obj);
   
    if(obj.visibility == false)
    {
        return ctx.getMatrix();
    }
    
    //////////////////////////////////////////////
     //ctx.font = "italic bold 48px  serif";
    var fontBold;
    
    if(obj.stroke != undefined ||obj.stroke != "" )
    {
        canvas_2Ddraw.fillStyle =obj.stroke;
    }
    else
    {  
         canvas_2Ddraw.fillStyle= "rgb(0,0,0)";
    }
    canvas_2Ddraw.globalAlpha =1;
	
   var fontData ="";
    
    if(obj.font_style != undefined)
    {
        fontData += obj.font_style+ " ";
    }
    if(obj.font_style != undefined)
    {
        if(obj.font_weight == "bold" || obj.font_weight == "BOLD" ) 
        {
            fontBold = "bold";
            fontData += fontBold + " ";
        }
    }
    if(obj.font_size != undefined)
    {
        fontData +=obj.font_size + "px ";
    }
    else
    {
         fontData +="10px ";
    }
    if(obj.font_family!= undefined)
    {
        fontData += obj.font_family;
    }
    
   canvas_2Ddraw.font =fontData;
    
    //anchor처리시 텍스트 크기를 얻어야한다.
    var x = parseFloat(obj.x);
    var y = parseFloat(obj.y);
    var dx = parseFloat(obj.dx);
    var dy = parseFloat(obj.dy);
    //SetTransform(obj);
    var textArea =canvas_2Ddraw.measureText(obj.textContent);
    //var textArea = ctx.measureText(obj.text); 
    var AreaX = x +dx;
    var AreaY = y +dy;
    var baseLineShift = 0;
    
    AreaY = AreaY + (obj.baseline_height*0.3);
   
   
    var TextArray = obj.textContent.toString().split( '\n' );
   
    if(obj.text_anchor == "middle")
    {
        canvas_2Ddraw.textAlign = "center";
    }
    else
    {
        canvas_2Ddraw.textAlign = obj.text_anchor;
    }
    canvas_2Ddraw.globalAlpha = obj.stroke_opacity;
   for(var i =0 ;i<TextArray.length;i++)
   {
       canvas_2Ddraw.fillText(TextArray[i], AreaX, AreaY +(obj.textoneline_height*i) );
   }
   

    //x, y - fontSize, x + Math.floor(fontSize * 2.0 / 3.0) * this.children[0].getText().length, y);
    var fontSize = obj.font_size;
    var PW1 = ctx.getCoords(x,y - fontSize);
    var PW2 = ctx.getCoords( x+textArea.width,y);
    var bb = new BoundingBox(PW1.x,PW1.y,PW2.x,PW2.y);
    var map =[bb,obj];
    
   if(bIsGroup)
    {
       GBoundBoxs.push(map);
    }
    else
    {
       BoundBoxs.push(map);
    }
   return ctx.getMatrix();
}

function DrawGObj(obj,Parent_TF)
{
    ctx.setMatrix(Parent_TF);
    SetTransform(obj);  
    
	return ctx.getMatrix();
}

function DrawUseObj(obj,Parent_TF)
{
    ctx.setMatrix(Parent_TF);
    SetTransform(obj);  
    
	return ctx.getMatrix();
};

function DrawImageObj(obj,Parent_TF,GBoundBoxs)
{
    var bIsGroup =false;
    var parentOBJ =obj.parentObj;
    
    if(parentOBJ.nodename == "g" || parentOBJ.nodename == "use")
    {bIsGroup =true;}
    else
    {bIsGroup =false;}
    
    ctx.setMatrix(Parent_TF);
    SetTransform(obj);
    
    if(obj.visibility == false)
    {
        return ctx.getMatrix();
    }
	canvas_2Ddraw.globalAlpha = 1;
    var PW1 = ctx.getCoords(obj.x,obj.y);
    var PW2 = ctx.getCoords(obj.x+obj.width, obj.y+obj.height);
   
   obj.imageObj =CreateImageSrc(obj.id,obj.xlink_href);
   
    canvas_2Ddraw.drawImage(obj.imageObj, obj.x, obj.y, obj.width, obj.height);
   
    var bb =new BoundingBox(PW1.x, PW1.y, PW2.x, PW2.y);
    var map =[bb,obj];
    
    if(bIsGroup)
    {
       GBoundBoxs.push(map);
    }
    else
    {
       BoundBoxs.push(map);
    }
    
    return ctx.getMatrix();
};
function DrawArrow(drawobj)
{
    if(drawobj.nodename == "line")
    {
        var arrowPoint = [];
        var beginPoint = new coordinates();
        var endPoint = new coordinates();
        beginPoint.x = drawobj.x1;
        beginPoint.y = drawobj.y1;
        endPoint.x = drawobj.x2;
        endPoint.y = drawobj.y2;
        var Type_begin = drawobj.begin_arrow_type;
        var Span_begin = drawobj.begin_arrow_span;
        var Size_begin = drawobj.begin_arrow_size;
        var Type_end = drawobj.end_arrow_type;
        var Span_end = drawobj.end_arrow_span;
        var Size_end = drawobj.end_arrow_size;

        //////////////////////////////////////////////////////////////////////////
        //beginArrow
        if(Type_begin != "none")
        {
            if(Type_begin == "arrow" || Type_begin == "line arrow" || Type_begin == "stealth arrow")
            {
                if(Span_begin == "large1")
                {
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*1.5),60,endPoint,beginPoint);
                }
				else if(Span_begin == "large2")
                {
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*1.5),45,endPoint,beginPoint);
                }
				else if(Span_begin == "large3")
                {
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*1.5),30,endPoint,beginPoint);
                }
                else if(Span_begin == "medium1")
                {
                    arrowPoint = CalArrowPoint(Type_begin,Size_begin,60,endPoint,beginPoint);
                }
                else if(Span_begin == "medium2")
                {
                    arrowPoint = CalArrowPoint(Type_begin,Size_begin,45,endPoint,beginPoint);
                }
                else if(Span_begin == "medium3")
                {
                    arrowPoint = CalArrowPoint(Type_begin,Size_begin,30,endPoint,beginPoint);
                }
                else if(Span_begin == "small1")
                {
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*0.7),60,endPoint,beginPoint);
                }
                else if(Span_begin == "small2")
                {
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*0.7),45,endPoint,beginPoint);
                }
                else if(Span_begin == "small3")
                {
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*0.7),30,endPoint,beginPoint);
                }
            }
            else if(Type_begin == "circle")
            {
                arrowPoint = CalArrowPoint(Type_begin,(Size_begin*1.5),45,endPoint,beginPoint);
            }
            else if(Type_begin == "diamond")
            {
                if(Span_begin == "large1")
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*1.5),60,endPoint,beginPoint);
				else if(Span_begin == "large2")
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*1.5),45,endPoint,beginPoint);
				else if(Span_begin == "large3")
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*1.5),30,endPoint,beginPoint);
                else if(Span_begin == "medium1")
                    arrowPoint = CalArrowPoint(Type_begin,Size_begin,60,endPoint,beginPoint);
                else if(Span_begin == "medium2")
                    arrowPoint = CalArrowPoint(Type_begin,Size_begin,45,endPoint,beginPoint);
                else if(Span_begin == "medium3")
                    arrowPoint = CalArrowPoint(Type_begin,Size_begin,30,endPoint,beginPoint);
                else if(Span_begin == "small1")
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*0.7),60,endPoint,beginPoint);
                else if(Span_begin == "small2")
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*0.7),45,endPoint,beginPoint);
                else if(Span_begin == "small3")
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*0.7),30,endPoint,beginPoint);
            }

            if(Type_begin == "arrow" || Type_begin == "line arrow" || Type_begin == "stealth arrow" || Type_begin == "diamond")
            {
                for(var i = 0; i < arrowPoint.length;i++)
                {
                    if(i == 0)
                    {
                        ctx.beginPath();
                        ctx.moveTo(arrowPoint[i].x,arrowPoint[i].y);
                    }
                    else
                    {
                        ctx.lineTo(arrowPoint[i].x,arrowPoint[i].y);
                    }
                }
                ctx.closePath();
                if(Type_begin == "arrow" || Type_begin == "stealth arrow" || Type_begin == "diamond")
                    ctx.fill();
                ctx.stroke();
            }
            else if(Type_begin == "circle")
            {
                var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
                var circlesize = new ellipseradius();
                if(Span_begin == "large1")
                {
                    circlesize.rx = (Size_begin/2)*2;
                    circlesize.ry = Size_begin/1;
                }
				else if(Span_begin == "large2")
                {
                    circlesize.rx = (Size_begin/2)*2;
                    circlesize.ry = Size_begin/2;
                }
				else if(Span_begin == "large3")
                {
                    circlesize.rx = (Size_begin/2)*2;
                    circlesize.ry = Size_begin/3;
                }
                else if(Span_begin == "medium1")
                {
                    circlesize.rx = Size_begin/2;
                    circlesize.ry = Size_begin/1;
                }
                else if(Span_begin == "medium2")
                {
                    circlesize.rx = Size_begin/2;
                    circlesize.ry = Size_begin/2;
                }
                else if(Span_begin == "medium3")
                {
                    circlesize.rx = Size_begin/2;
                    circlesize.ry = Size_begin/3;
                }
                else if(Span_begin == "small1")
                {
                    circlesize.rx = Size_begin/2/2;
                    circlesize.ry = Size_begin/1;
                }
                else if(Span_begin == "small2")
                {
                    circlesize.rx = Size_begin/2/2;
                    circlesize.ry = Size_begin/2;
                }
                else if(Span_begin == "small3")
                {
                    circlesize.rx = Size_begin/2/2;
                    circlesize.ry = Size_begin/3;
                }

                ctx.beginPath();
                ctx.moveTo(beginPoint.x, beginPoint.y-circlesize.ry);
                ctx.bezierCurveTo(beginPoint.x+(KAPPA*circlesize.rx), beginPoint.y-circlesize.ry, beginPoint.x+circlesize.rx, beginPoint.y-(KAPPA*circlesize.ry), beginPoint.x+circlesize.rx, beginPoint.y);
                ctx.bezierCurveTo(beginPoint.x+circlesize.rx, beginPoint.y+(KAPPA*circlesize.ry), beginPoint.x+(KAPPA*circlesize.rx), beginPoint.y+circlesize.ry, beginPoint.x, beginPoint.y+circlesize.ry);
                ctx.bezierCurveTo(beginPoint.x-(KAPPA*circlesize.rx), beginPoint.y+circlesize.ry, beginPoint.x-circlesize.rx, beginPoint.y+(KAPPA*circlesize.ry), beginPoint.x-circlesize.rx, beginPoint.y);
                ctx.bezierCurveTo(beginPoint.x-circlesize.rx, beginPoint.y-(KAPPA*circlesize.ry), beginPoint.x-(KAPPA*circlesize.rx), beginPoint.y-circlesize.ry, beginPoint.x, beginPoint.y-circlesize.ry);

                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        }
        //////////////////////////////////////////////////////////////////////////
        //endArrow
        if(Type_end != "none")
        {
            if(Type_end == "arrow" || Type_end == "line arrow" || Type_end == "stealth arrow")
            {
                if(Span_end == "large1")
                {
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*1.5),60,beginPoint,endPoint);
                }
				else if(Span_end == "large2")
                {
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*1.5),45,beginPoint,endPoint);
                }
				else if(Span_end == "large3")
                {
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*1.5),30,beginPoint,endPoint);
                }
                else if(Span_end == "medium1")
                {
                    arrowPoint = CalArrowPoint(Type_end,Size_end,60,beginPoint,endPoint);
                }
                else if(Span_end == "medium2")
                {
                    arrowPoint = CalArrowPoint(Type_end,Size_end,45,beginPoint,endPoint);
                }
                else if(Span_end == "medium3")
                {
                    arrowPoint = CalArrowPoint(Type_end,Size_end,30,beginPoint,endPoint);
                }
                else if(Span_end == "small1")
                {
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*0.7),60,beginPoint,endPoint);
                }
                else if(Span_end == "small2")
                {
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*0.7),45,beginPoint,endPoint);
                }
                else if(Span_end == "small3")
                {
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*0.7),30,beginPoint,endPoint);
                }
            }
            else if(Type_end == "circle")
            {
                arrowPoint = CalArrowPoint(Type_end,(Size_end*1.5),45,beginPoint,endPoint);
            }
            else if(Type_end == "diamond")
            {
                if(Span_end == "large1")
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*1.5),60,beginPoint,endPoint);
				else if(Span_end == "large2")
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*1.5),45,beginPoint,endPoint);
				else if(Span_end == "large3")
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*1.5),30,beginPoint,endPoint);
                else if(Span_end == "medium1")
                    arrowPoint = CalArrowPoint(Type_end,Size_end,60,beginPoint,endPoint);
                else if(Span_end == "medium2")
                    arrowPoint = CalArrowPoint(Type_end,Size_end,45,beginPoint,endPoint);
                else if(Span_end == "medium3")
                    arrowPoint = CalArrowPoint(Type_end,Size_end,30,beginPoint,endPoint);
                else if(Span_end == "small1")
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*0.7),60,beginPoint,endPoint);
                else if(Span_end == "small2")
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*0.7),45,beginPoint,endPoint);
                else if(Span_end == "small3")
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*0.7),30,beginPoint,endPoint);
            }

            if(Type_end == "arrow" || Type_end == "line arrow" || Type_end == "stealth arrow" || Type_end == "diamond")
            {
                for(var i = 0; i < arrowPoint.length;i++)
                {
                    if(i == 0)
                    {
                        ctx.beginPath();
                        ctx.moveTo(arrowPoint[i].x,arrowPoint[i].y);
                    }
                    else
                    {
                        ctx.lineTo(arrowPoint[i].x,arrowPoint[i].y);
                    }
                }

                ctx.closePath();
                if(Type_end == "arrow" || Type_end == "stealth arrow" || Type_end == "diamond")
                    ctx.fill();
                ctx.stroke();
            }
            else if(Type_end == "circle")
            {
                var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
                var circlesize = new ellipseradius();
                if(Span_end == "large1")
                {
                    circlesize.rx = (Size_end/2)*2;
                    circlesize.ry = Size_end/1;
                }
				else if(Span_end == "large2")
                {
                    circlesize.rx = (Size_end/2)*2;
                    circlesize.ry = Size_end/2;
                }
				else if(Span_end == "large3")
                {
                    circlesize.rx = (Size_end/2)*2;
                    circlesize.ry = Size_end/3;
                }
                else if(Span_end == "medium1")
                {
                    circlesize.rx = Size_end/2;
                    circlesize.ry = Size_end/1;
                }
                else if(Span_end == "medium2")
                {
                    circlesize.rx = Size_end/2;
                    circlesize.ry = Size_end/2;
                }
                else if(Span_end == "medium3")
                {
                    circlesize.rx = Size_end/2;
                    circlesize.ry = Size_end/3;
                }
                else if(Span_end == "small1")
                {
                    circlesize.rx = Size_end/2/2;
                    circlesize.ry = Size_end/1;
                }
                else if(Span_end == "small2")
                {
                    circlesize.rx = Size_end/2/2;
                    circlesize.ry = Size_end/2;
                }
                else if(Span_end == "small3")
                {
                    circlesize.rx = Size_end/2/2;
                    circlesize.ry = Size_end/3;
                }

                ctx.beginPath();
                ctx.moveTo(endPoint.x, endPoint.y-circlesize.ry);
                ctx.bezierCurveTo(endPoint.x+(KAPPA*circlesize.rx), endPoint.y-circlesize.ry, endPoint.x+circlesize.rx, endPoint.y-(KAPPA*circlesize.ry), endPoint.x+circlesize.rx, endPoint.y);
                ctx.bezierCurveTo(endPoint.x+circlesize.rx, endPoint.y+(KAPPA*circlesize.ry), endPoint.x+(KAPPA*circlesize.rx), endPoint.y+circlesize.ry, endPoint.x, endPoint.y+circlesize.ry);
                ctx.bezierCurveTo(endPoint.x-(KAPPA*circlesize.rx), endPoint.y+circlesize.ry, endPoint.x-circlesize.rx, endPoint.y+(KAPPA*circlesize.ry), endPoint.x-circlesize.rx, endPoint.y);
                ctx.bezierCurveTo(endPoint.x-circlesize.rx, endPoint.y-(KAPPA*circlesize.ry), endPoint.x-(KAPPA*circlesize.rx), endPoint.y-circlesize.ry, endPoint.x, endPoint.y-circlesize.ry);

                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        }
    }
    else if(drawobj.nodename == "polyline")
    {
        var arrowPoint = [];
        var beginPoint = new coordinates();
        var beginPoint_next = new coordinates();
        var endPoint = new coordinates();
        var endPoint_prev = new coordinates();
        var Type_begin = drawobj.begin_arrow_type;
        var Span_begin = drawobj.begin_arrow_span;
        var Size_begin = drawobj.begin_arrow_size;
        var Type_end = drawobj.end_arrow_type;
        var Span_end = drawobj.end_arrow_span;
        var Size_end = drawobj.end_arrow_size;
        
        var points = CreatePath(drawobj.points);
        
        beginPoint.x = points[0].x;
        beginPoint.y = points[0].y;
        beginPoint_next.x = points[1].x;
        beginPoint_next.y = points[1].y;
        endPoint.x = points[points.length-1].x;
        endPoint.y = points[points.length-1].y;
        endPoint_prev.x = points[points.length-2].x;
        endPoint_prev.y = points[points.length-2].y;

        //////////////////////////////////////////////////////////////////////////
        //beginArrow
        if(Type_begin != "none")
        {
            if(Type_begin == "arrow" || Type_begin == "line arrow" || Type_begin == "stealth arrow")
            {
                if(Span_begin == "large1")
                {
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*1.5),60,beginPoint_next,beginPoint);
                }
				else if(Span_begin == "large2")
                {
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*1.5),45,beginPoint_next,beginPoint);
                }
				else if(Span_begin == "large3")
                {
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*1.5),30,beginPoint_next,beginPoint);
                }
                else if(Span_begin == "medium1")
                {
                    arrowPoint = CalArrowPoint(Type_begin,Size_begin,60,beginPoint_next,beginPoint);
                }
                else if(Span_begin == "medium2")
                {
                    arrowPoint = CalArrowPoint(Type_begin,Size_begin,45,beginPoint_next,beginPoint);
                }
                else if(Span_begin == "medium3")
                {
                    arrowPoint = CalArrowPoint(Type_begin,Size_begin,30,beginPoint_next,beginPoint);
                }
                else if(Span_begin == "small1")
                {
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*0.7),60,beginPoint_next,beginPoint);
                }
                else if(Span_begin == "small2")
                {
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*0.7),45,beginPoint_next,beginPoint);
                }
                else if(Span_begin == "small3")
                {
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*0.7),30,beginPoint_next,beginPoint);
                }
            }
            else if(Type_begin == "circle")
            {
                arrowPoint = CalArrowPoint(Type_begin,(Size_begin*1.5),45,beginPoint_next,beginPoint);
            }
            else if(Type_begin == "diamond")
            {
                if(Span_begin == "large1")
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*1.5),60,beginPoint_next,beginPoint);
				else if(Span_begin == "large2")
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*1.5),45,beginPoint_next,beginPoint);
				else if(Span_begin == "large3")
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*1.5),30,beginPoint_next,beginPoint);
                else if(Span_begin == "medium1")
                    arrowPoint = CalArrowPoint(Type_begin,Size_begin,60,beginPoint_next,beginPoint);
                else if(Span_begin == "medium2")
                    arrowPoint = CalArrowPoint(Type_begin,Size_begin,45,beginPoint_next,beginPoint);
                else if(Span_begin == "medium3")
                    arrowPoint = CalArrowPoint(Type_begin,Size_begin,30,beginPoint_next,beginPoint);
                else if(Span_begin == "small1")
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*0.7),60,beginPoint_next,beginPoint);
                else if(Span_begin == "small2")
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*0.7),45,beginPoint_next,beginPoint);
                else if(Span_begin == "small3")
                    arrowPoint = CalArrowPoint(Type_begin,(Size_begin*0.7),30,beginPoint_next,beginPoint);
            }

            if(Type_begin == "arrow" || Type_begin == "line arrow" || Type_begin == "stealth arrow" || Type_begin == "diamond")
            {
                for(var i = 0; i < arrowPoint.length;i++)
                {
                    if(i == 0)
                    {
                        ctx.beginPath();
                        ctx.moveTo(arrowPoint[i].x,arrowPoint[i].y);
                    }
                    else
                    {
                        ctx.lineTo(arrowPoint[i].x,arrowPoint[i].y);
                    }
                }

                ctx.closePath();
                if(Type_begin == "arrow" || Type_begin == "stealth arrow" || Type_begin == "diamond")
                    ctx.fill();
                ctx.stroke();
            }
            else if(Type_begin == "circle")
            {
                var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
                var circlesize = new ellipseradius();
                if(Span_begin == "large1")
                {
                    circlesize.rx = (Size_begin/2)*2;
                    circlesize.ry = Size_begin/1;
                }
				else if(Span_begin == "large2")
                {
                    circlesize.rx = (Size_begin/2)*2;
                    circlesize.ry = Size_begin/2;
                }
				else if(Span_begin == "large3")
                {
                    circlesize.rx = (Size_begin/2)*2;
                    circlesize.ry = Size_begin/3;
                }
                else if(Span_begin == "medium1")
                {
                    circlesize.rx = Size_begin/2;
                    circlesize.ry = Size_begin/1;
                }
                else if(Span_begin == "medium2")
                {
                    circlesize.rx = Size_begin/2;
                    circlesize.ry = Size_begin/2;
                }
                else if(Span_begin == "medium3")
                {
                    circlesize.rx = Size_begin/2;
                    circlesize.ry = Size_begin/3;
                }
                else if(Span_begin == "small1")
                {
                    circlesize.rx = Size_begin/2/2;
                    circlesize.ry = Size_begin/1;
                }
                else if(Span_begin == "small2")
                {
                    circlesize.rx = Size_begin/2/2;
                    circlesize.ry = Size_begin/2;
                }
                else if(Span_begin == "small3")
                {
                    circlesize.rx = Size_begin/2/2;
                    circlesize.ry = Size_begin/3;
                }

                ctx.beginPath();
                ctx.moveTo(beginPoint.x, beginPoint.y-circlesize.ry);
                ctx.bezierCurveTo(beginPoint.x+(KAPPA*circlesize.rx), beginPoint.y-circlesize.ry, beginPoint.x+circlesize.rx, beginPoint.y-(KAPPA*circlesize.ry), beginPoint.x+circlesize.rx, beginPoint.y);
                ctx.bezierCurveTo(beginPoint.x+circlesize.rx, beginPoint.y+(KAPPA*circlesize.ry), beginPoint.x+(KAPPA*circlesize.rx), beginPoint.y+circlesize.ry, beginPoint.x, beginPoint.y+circlesize.ry);
                ctx.bezierCurveTo(beginPoint.x-(KAPPA*circlesize.rx), beginPoint.y+circlesize.ry, beginPoint.x-circlesize.rx, beginPoint.y+(KAPPA*circlesize.ry), beginPoint.x-circlesize.rx, beginPoint.y);
                ctx.bezierCurveTo(beginPoint.x-circlesize.rx, beginPoint.y-(KAPPA*circlesize.ry), beginPoint.x-(KAPPA*circlesize.rx), beginPoint.y-circlesize.ry, beginPoint.x, beginPoint.y-circlesize.ry);

                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        }
        //////////////////////////////////////////////////////////////////////////
        //endArrow
        if(Type_end != "none")
        {
            if(Type_end == "arrow" || Type_end == "line arrow" || Type_end == "stealth arrow")
            {
                if(Span_end == "large1")
                {
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*1.5),60,endPoint_prev,endPoint);
                }
				else if(Span_end == "large2")
                {
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*1.5),45,endPoint_prev,endPoint);
                }
				else if(Span_end == "large3")
                {
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*1.5),30,endPoint_prev,endPoint);
                }
                else if(Span_end == "medium1")
                {
                    arrowPoint = CalArrowPoint(Type_end,Size_end,60,endPoint_prev,endPoint);
                }
                else if(Span_end == "medium2")
                {
                    arrowPoint = CalArrowPoint(Type_end,Size_end,45,endPoint_prev,endPoint);
                }
                else if(Span_end == "medium3")
                {
                    arrowPoint = CalArrowPoint(Type_end,Size_end,30,endPoint_prev,endPoint);
                }
                else if(Span_end == "small1")
                {
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*0.7),60,endPoint_prev,endPoint);
                }
                else if(Span_end == "small2")
                {
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*0.7),45,endPoint_prev,endPoint);
                }
                else if(Span_end == "small3")
                {
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*0.7),30,endPoint_prev,endPoint);
                }
            }
            else if(Type_end == "circle")
            {
                arrowPoint = CalArrowPoint(Type_end,(Size_end*1.5),45,endPoint_prev,endPoint);
            }
            else if(Type_end == "diamond")
            {
                if(Span_end == "large1")
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*1.5),60,endPoint_prev,endPoint);
				else if(Span_end == "large2")
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*1.5),45,endPoint_prev,endPoint);
				else if(Span_end == "large3")
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*1.5),30,endPoint_prev,endPoint);
                else if(Span_end == "medium1")
                    arrowPoint = CalArrowPoint(Type_end,Size_end,60,endPoint_prev,endPoint);
                else if(Span_end == "medium2")
                    arrowPoint = CalArrowPoint(Type_end,Size_end,45,endPoint_prev,endPoint);
                else if(Span_end == "medium3")
                    arrowPoint = CalArrowPoint(Type_end,Size_end,30,endPoint_prev,endPoint);
                else if(Span_end == "small1")
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*0.7),60,endPoint_prev,endPoint);
                else if(Span_end == "small2")
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*0.7),45,endPoint_prev,endPoint);
                else if(Span_end == "small3")
                    arrowPoint = CalArrowPoint(Type_end,(Size_end*0.7),30,endPoint_prev,endPoint);
            }

            if(Type_end == "arrow" || Type_end == "line arrow" || Type_end == "stealth arrow" || Type_end == "diamond")
            {
                for(var i = 0; i < arrowPoint.length;i++)
                {
                    if(i == 0)
                    {
                        ctx.beginPath();
                        ctx.moveTo(arrowPoint[i].x,arrowPoint[i].y);
                    }
                    else
                    {
                        ctx.lineTo(arrowPoint[i].x,arrowPoint[i].y);
                    }
                }

                ctx.closePath();
                if(Type_end == "arrow" || Type_end == "stealth arrow" || Type_end == "diamond")
                    ctx.fill();
                ctx.stroke();
            }
            else if(Type_end == "circle")
            {
                var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
                var circlesize = new ellipseradius();
                if(Span_end == "large1")
                {
                    circlesize.rx = (Size_end/2)*2;
                    circlesize.ry = Size_end/1;
                }
				else if(Span_end == "large2")
                {
                    circlesize.rx = (Size_end/2)*2;
                    circlesize.ry = Size_end/2;
                }
				else if(Span_end == "large3")
                {
                    circlesize.rx = (Size_end/2)*2;
                    circlesize.ry = Size_end/3;
                }
                else if(Span_end == "medium1")
                {
                    circlesize.rx = Size_end/2;
                    circlesize.ry = Size_end/1;
                }
                else if(Span_end == "medium2")
                {
                    circlesize.rx = Size_end/2;
                    circlesize.ry = Size_end/2;
                }
                else if(Span_end == "medium3")
                {
                    circlesize.rx = Size_end/2;
                    circlesize.ry = Size_end/3;
                }
                else if(Span_end == "small1")
                {
                    circlesize.rx = Size_end/2/2;
                    circlesize.ry = Size_end/1;
                }
                else if(Span_end == "small2")
                {
                    circlesize.rx = Size_end/2/2;
                    circlesize.ry = Size_end/2;
                }
                else if(Span_end == "small3")
                {
                    circlesize.rx = Size_end/2/2;
                    circlesize.ry = Size_end/3;
                }

                ctx.beginPath();
                ctx.moveTo(endPoint.x, endPoint.y-circlesize.ry);
                ctx.bezierCurveTo(endPoint.x+(KAPPA*circlesize.rx), endPoint.y-circlesize.ry, endPoint.x+circlesize.rx, endPoint.y-(KAPPA*circlesize.ry), endPoint.x+circlesize.rx, endPoint.y);
                ctx.bezierCurveTo(endPoint.x+circlesize.rx, endPoint.y+(KAPPA*circlesize.ry), endPoint.x+(KAPPA*circlesize.rx), endPoint.y+circlesize.ry, endPoint.x, endPoint.y+circlesize.ry);
                ctx.bezierCurveTo(endPoint.x-(KAPPA*circlesize.rx), endPoint.y+circlesize.ry, endPoint.x-circlesize.rx, endPoint.y+(KAPPA*circlesize.ry), endPoint.x-circlesize.rx, endPoint.y);
                ctx.bezierCurveTo(endPoint.x-circlesize.rx, endPoint.y-(KAPPA*circlesize.ry), endPoint.x-(KAPPA*circlesize.rx), endPoint.y-circlesize.ry, endPoint.x, endPoint.y-circlesize.ry);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        }
    }
}

function CalArrowPoint(Type, Size, Angle, beginPoint, endPoint)
{
	var ArrowPoint = [];
	var bottomPoint = new coordinates();
	var sidePoint1 = new coordinates();
    var sidePoint2 = new coordinates();
	var Gradient;
	var ArrowRadian = DegreeToRadian(Angle/2);	// 화살표 각도
	var BottomSideSize = Size * Math.tan(ArrowRadian);	// 삼각형 밑변 길이의 1/2
	var GradientRadian;
	if(endPoint.x-beginPoint.x != 0)
	{
		Gradient = (endPoint.y-beginPoint.y)/(endPoint.x-beginPoint.x);
		GradientRadian = Math.atan(Gradient);	// 기울기 라디안
		if(endPoint.x-beginPoint.x<0)
		{
			GradientRadian = GradientRadian + Math.PI;
		}
	}
	else if(endPoint.y-beginPoint.y < 0)
		GradientRadian = -Math.PI/2;
	else
		GradientRadian = Math.PI/2;

	if(Type == "arrow" || Type == "line arrow" || Type == "stealth arrow")
	{
		var stealthPoint = new coordinates();
		stealthPoint.x = endPoint.x - ((Size*3/5) * Math.cos(GradientRadian));
		stealthPoint.y = endPoint.y - ((Size*3/5) * Math.sin(GradientRadian));
		bottomPoint.x = endPoint.x - (Size * Math.cos(GradientRadian));
		bottomPoint.y = endPoint.y - (Size * Math.sin(GradientRadian));
		sidePoint1.x = bottomPoint.x - (BottomSideSize * Math.cos(GradientRadian-(Math.PI/2)));
		sidePoint1.y = bottomPoint.y - (BottomSideSize * Math.sin(GradientRadian-(Math.PI/2)));
		sidePoint2.x = (2*bottomPoint.x) - sidePoint1.x;
		sidePoint2.y = (2*bottomPoint.y) - sidePoint1.y;

		ArrowPoint.push(sidePoint1);
		ArrowPoint.push(endPoint);
		ArrowPoint.push(sidePoint2);
		
		if(Type == "stealth arrow")
        {
            ArrowPoint.push(stealthPoint);
        }	
	}
	else if(Type == "circle")
	{
		ArrowPoint.push(endPoint);
	}
	else if(Type == "diamond")
	{
		var upPoint = new coordinates();
        var downPoint = new coordinates();
        var leftPoint = new coordinates();
        var rightPoint = new coordinates();
		leftPoint.x = endPoint.x - ((Size/2) * Math.cos(GradientRadian));
		if(RadianToDegree(GradientRadian) == 180)
        {
            leftPoint.y = endPoint.y;
        }
		else
        {
            leftPoint.y = endPoint.y - ((Size/2) * Math.sin(GradientRadian));
        }
		rightPoint.x = (2*endPoint.x) - leftPoint.x;
		rightPoint.y = (2*endPoint.y) - leftPoint.y;
		upPoint.x = endPoint.x - ((BottomSideSize/2) * Math.cos(GradientRadian-(Math.PI/2)));
		upPoint.y = endPoint.y - ((BottomSideSize/2) * Math.sin(GradientRadian-(Math.PI/2)));
		downPoint.x = (2*endPoint.x) - upPoint.x;
		downPoint.y = (2*endPoint.y) - upPoint.y;

		ArrowPoint.push(upPoint);
		ArrowPoint.push(rightPoint);
		ArrowPoint.push(downPoint);
		ArrowPoint.push(leftPoint);
	}
	return ArrowPoint;
}

function DegreeToRadian(vdegree)
{
    return vdegree * (Math.PI / 180);
}
function RadianToDegree(vradian)
{
    return vradian * (180 / Math.PI);
}

function onmousewheel(e){
    var evt = window.event || e //equalize event object
    var delta = evt.detail? evt.detail*(-120) : evt.wheelDelta //check for detail first so Opera uses that instead of wheelDelta
//    if(delta == 120)
//    {
//        m_wordldScale.x = m_wordldScale.x * 1.1;
//        m_wordldScale.y = m_wordldScale.y * 1.1;
//    }
//    else if(delta == -120)
//    {
//        m_wordldScale.x = m_wordldScale.x * 0.9;
//        m_wordldScale.y = m_wordldScale.y * 0.9;
//    }

	var pointerAbsolutePosition = new coordinates();
	
	pointerAbsolutePosition.x = (m_worldPos.x - event.offsetX) / m_wordldScale.x;
	pointerAbsolutePosition.y = (m_worldPos.y - event.offsetY) / m_wordldScale.y;
	
	var fValue = 1;
    if(delta > 0)
    {
        fValue = 1.1;
    }
    else if(delta < 0)
    {
        fValue = 0.9;
    }	
	
	m_wordldScale.x *= fValue;
	m_wordldScale.y = m_wordldScale.x;	
	
	m_worldPos.x = pointerAbsolutePosition.x * m_wordldScale.x + event.offsetX;
	m_worldPos.y = pointerAbsolutePosition.y * m_wordldScale.y + event.offsetY;
	
    Draw_All(window[root_obj_id]);
}

function SetGrident(bb,obj)
{
	if(obj.fill.indexOf("rgb(") == -1)
	{
		var text =  obj.fill;
		text =text.replace("url(#","");
		text =text.replace(")","");
		//그라데이션을 찾는다.
		for(var i = 0 ; i<GridentList.length;i++)
		{
			if(text ==GridentList[i].id)
			{
				var grident =GridentList[i];
				var grd;
				
				var Widths =parseFloat(bb.width());
				var heights =parseFloat(bb.height());
				
				Widths = Widths/m_wordldScale.x;
				heights = heights/m_wordldScale.y;
				
				if(grident.type == "line")
				{			
					
					
					var x1 =  Widths*(grident.x1*0.01);
					var x2 =  Widths*(grident.x2*0.01);
					var y1 =  heights*(grident.y1*0.01);
					var y2 =  heights*(grident.y2*0.01);
					var point1 = new enuPoint(x1,y1);
					point1 =GetRotatePoint(obj,point1);
					var point2 = new enuPoint(x2,y2);
					point2 =GetRotatePoint(obj,point2);
					
					grd=ctx.createLinearGradient(point1.x,point1.y,point2.x,point2.y);
					for(var i =0; i< grident.stop.length;i++)
					{
						var stop = grident.stop[i];
						var offset =stop.offsets;
						var style =stop.stopStyle;
						grd.addColorStop(offset,style);
					}
			
				}	
				else
				{
				
					var cx =  Widths*(grident.cx*0.01);
					var cy =  heights*(grident.cy*0.01);
					var fx =  Widths*(grident.fx*0.01);
					var fy =  heights*(grident.fy*0.01);
					var r =0;
					
					if(Widths > heights)
						r = Widths *(grident.r*0.01);
					else
						r = heights *(grident.r*0.01);
					
					var point1 = new enuPoint(cx,cy);
					point1 =GetRotatePoint(obj,point1);
					var point2 = new enuPoint(fx,fy);
					point2 =GetRotatePoint(obj,point2);
					
					grd=ctx.createRadialGradient(point1.x,point1.y,0,point2.x,point2.y,r);
					for(var i =0; i< grident.stop.length;i++)
					{
						var stop = grident.stop[i];
						var offset =stop.offsets;
						var style =stop.stopStyle;
						grd.addColorStop(offset,style);
					}
				}	
				ctx.fillStyle=grd;	
			}
		}	
	}
	
}


function DegreeToRadian(degree) 
{
	return (degree) * (3.14159265359 / 180.0);
}

function GetRotatePoint(obj, point)
{
	
	var angle =obj.rotate;
	var CenterPoint = new enuPoint(obj.center_x,obj.center_y);
	var theta = DegreeToRadian(angle);
	var NewPoint = new enuPoint(0,0);
	
	/*
	x' = (x-a) * cosR - (y-b)sinR
	y' = (x-a) * sinR + (y-b)cosR
	*/
	if (obj.scale_x < 0 && pNode.scale_y < 0)
	{
		theta = -theta;
	}
	else  if (obj.scale_x < 0 || obj.scale_y < 0)
	{
		theta = theta;
	}
	else
	{
		theta = -theta;
	}		
	NewPoint.x = ((point.x - CenterPoint.x) * Math.cos(theta)) - (point.y - CenterPoint.y)*Math.sin(theta);
	NewPoint.y = ((point.x - CenterPoint.x) * Math.sin(theta)) + (point.y - CenterPoint.y)*Math.cos(theta);
	

	NewPoint.x = NewPoint.x + CenterPoint.x;
	NewPoint.y = NewPoint.y + CenterPoint.y;
	return NewPoint;
}

