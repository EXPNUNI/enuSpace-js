function Rect(left,top,right,bottom)
{
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
}
function GetValue(variable)
{
    var xmlHttp = new XMLHttpRequest();
	var strUrl = "getvalue";
	var strParam= "page="+current_page+"&"+"variable="+variable;

	xmlHttp.open("POST", strUrl, false);	
	xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
	xmlHttp.setRequestHeader("Cache-Control","no-cache, must-revalidate");
	xmlHttp.setRequestHeader("Pragma","no-cache");
	xmlHttp.send(strParam);	

	var msg = xmlHttp.responseText;

	var arr = JSON.parse(msg);		
	if (arr.RESULT == "OK")
	{
		var ret;
		if(arr.TYPE == "wchar")
			return arr.VALUE;
		else if (arr.TYPE == "bool")
		{
			if (arr.VALUE == "true")
				ret = true;
			else
				ret = false;
		}
		else
			ret = Number(arr.VALUE);

		return ret;
	}
	else
	{
		if (arr.RESULT_CODE == "CODE_VARIABLE_NOUT_FOUND" )
		{
			console.log("SetTagValue: Register device variable not found");
		}
		if (arr.RESULT_CODE == "CODE_UNKNOWN_DATATYPE" )
		{
			console.log("SetTagValue: Data type unknown");
		}
	}
}
function SetValue(variable, value)
{
    var xmlHttp = new XMLHttpRequest();
    var strUrl = "setvalue";
    var strParam= "page="+current_page+"&"+"variable="+variable+"&"+"value="+value;

    xmlHttp.onreadystatechange=function()
    {
        if (xmlHttp.readyState==4 && xmlHttp.status==200)
        {
            var msg = xmlHttp.responseText;

            var arr = JSON.parse(msg);
            if (arr.RESULT == "OK")
            {
                console.log("setvalue ok");
            }
            else
            {
                if (arr.RESULT_CODE == "CODE_VARIABLE_NOUT_FOUND" )
                {
                    console.log("SetTagValue: Register device variable not found");
                }
                if (arr.RESULT_CODE == "CODE_UNKNOWN_DATATYPE" )
                {
                    console.log("SetTagValue: Data type unknown");
                }
            }
        }
    };
	//////////////////////////////////////////////////////////////////////
	
	xmlHttp.open("POST", strUrl, true);	
	xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
	xmlHttp.setRequestHeader("Cache-Control","no-cache, must-revalidate");
	xmlHttp.setRequestHeader("Pragma","no-cache");
	xmlHttp.send(strParam);	
}
function SetStruct(param1, param2, param3, param4)
{
    console.log("Could not support SetValue Funtion in client(web)");
}
function PrintMessage(param1)   // 콘솔에 입력한 내용을 표시한다.
{
    console.log(param1.toString());
}
//////////////////////////////////////////////////////////////////////////////////////
//create obj
function CreateLine(strID, fX1, fY1, fX2, fY2, ftransX, ftransY)
{
    var line_node = document.createElementNS("http://www.w3.org/2000/svg","line");
    window[strID] = new CreateRectObj(line_node);
    window[strID].id = strID;
    window[strID].x1 = fX1;
    window[strID].x2 = fX2;
    window[strID].y1 = fY1;
    window[strID].y2 = fY2;
    window[strID].translate_x = ftransX;
    window[strID].translate_y = ftransY;
    window[strID].parentObj = window[root_obj_id];
    window[strID].prevSibling = window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1];
    window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1].nextSibling = window[strID];
    window[root_obj_id].appendChild(window[strID]);
}
function CreatePolyline(strID, strPoints, ftransX, ftransY)
{
    var polyline_node = document.createElementNS("http://www.w3.org/2000/svg","polyline");
    window[strID] = new CreatePolygonObj(polyline_node);
    window[strID].id = strID;
    window[strID].points = strPoints;
    window[strID].translate_x = ftransX;
    window[strID].translate_y = ftransY;
    window[strID].parentObj = window[root_obj_id];
    window[strID].prevSibling = window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1];
    window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1].nextSibling = window[strID];
    window[root_obj_id].appendChild(window[strID]);
    gradient_update(window[strID]);
}
function CreatePolygon(strID, strPoints, ftransX, ftransY)
{
    var polygon_node = document.createElementNS("http://www.w3.org/2000/svg","polygon");
    window[strID] = new CreatePolygonObj(polygon_node);
    window[strID].id = strID;
    window[strID].points = strPoints;
    window[strID].translate_x = ftransX;
    window[strID].translate_y = ftransY;
    window[strID].parentObj = window[root_obj_id];
    window[strID].prevSibling = window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1];
    window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1].nextSibling = window[strID];
    window[root_obj_id].appendChild(window[strID]);
    gradient_update(window[strID]);
}
function CreateCircle(strID, r, cx, cy, ftransX, ftransY)
{
    var circle_node = document.createElementNS("http://www.w3.org/2000/svg","circle");
    window[strID] = new CreateCircleObj(circle_node);
    window[strID].id = strID;
    window[strID].r = r;
    window[strID].cx = cx;
    window[strID].cy = cy;
    window[strID].translate_x = ftransX;
    window[strID].translate_y = ftransY;
    window[strID].parentObj = window[root_obj_id];
    window[strID].prevSibling = window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1];
    window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1].nextSibling = window[strID];
    window[root_obj_id].appendChild(window[strID]);
    gradient_update(window[strID]);
}
function CreateEllipse(strID, rx, ry, cx, cy, ftransX, ftransY)
{
    var ellipse_node = document.createElementNS("http://www.w3.org/2000/svg","ellipse");
	window[strID] = new CreateEllipseObj(ellipse_node);
    window[strID].id = strID;
    window[strID].rx = rx;
    window[strID].ry = ry;
    window[strID].cx = cx;
    window[strID].cy = cy;
    window[strID].translate_x = ftransX;
    window[strID].translate_y = ftransY;
    window[strID].parentObj = window[root_obj_id];
    window[strID].prevSibling = window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1];
    window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1].nextSibling = window[strID];
    window[root_obj_id].appendChild(window[strID]);
    gradient_update(window[strID]);
}
function CreateRect(strID, x, y, width, height, ftransX, ftransY)
{
    var rect_node = document.createElementNS("http://www.w3.org/2000/svg","rect");
    window[strID] = new CreateRectObj(rect_node);
    window[strID].id = strID;
    window[strID].x = x;
    window[strID].y = y;
    window[strID].width = width;
    window[strID].height = height;
    window[strID].translate_x = ftransX;
    window[strID].translate_y = ftransY;
    window[strID].parentObj = window[root_obj_id];
    window[strID].prevSibling = window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1];
    window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1].nextSibling = window[strID];
    window[root_obj_id].appendChild(window[strID]);
    gradient_update(window[strID]);
}
function CreateText(strID, x, y, dx, dy, strText, ftransX, ftransY)
{
    var text_node = document.createElementNS("http://www.w3.org/2000/svg","text");
    window[strID] = new CreateTextObj(text_node);
    window[strID].id = strID;
    window[strID].x = x;
    window[strID].y = y;
    window[strID].dx = dx;
    window[strID].dy = dy;
    window[strID].textContent = strText;
    window[strID].translate_x = ftransX;
    window[strID].translate_y = ftransY;
    window[strID].parentObj = window[root_obj_id];
    window[strID].prevSibling = window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1];
    window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1].nextSibling = window[strID];
    window[root_obj_id].appendChild(window[strID]);
}
function CreateImage(strID, x, y, width, height, strhref, ftransX, ftransY)
{
    var image_node = document.createElementNS("http://www.w3.org/2000/svg","image");
    window[strID] = new CreateImageObj(image_node);
    window[strID].id = strID;
    window[strID].x = x;
    window[strID].y = y;
    window[strID].width = width;
    window[strID].height = height;
    window[strID].href = strhref;
    window[strID].translate_x = ftransX;
    window[strID].translate_y = ftransY;
    window[strID].parentObj = window[root_obj_id];
    window[strID].prevSibling = window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1];
    window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1].nextSibling = window[strID];
    window[root_obj_id].appendChild(window[strID]);
}
//하위객체 추가로직 필요
function CreateTrend(strID, x, y, width, height, ftransX, ftransY)
{
    console.log("CreateTrend function is not working in client");
    /*
    var trend_node = document.createElementNS("http://www.w3.org/2000/svg","pg-trend");
    window[strID] = new CreateTrendObj(trend_node);
    window[strID].id = strID;
    window[strID].x = x;
    window[strID].y = y;
    window[strID].width = width;
    window[strID].height = height;
    window[strID].translate_x = ftransX;
    window[strID].translate_y = ftransY;
    window[strID].parentObj = window[root_obj_id];
    window[strID].prevSibling = window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1];
    window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1].nextSibling = window[strID];
    window[root_obj_id].appendChild(window[strID]);
    window[root_obj_id].trend_list.push(window[strID]);
    gradient_update(window[strID]);
    */
}
function CreatePath(strID, strPoints, ftransX, ftransY)
{
    var path_node = document.createElementNS("http://www.w3.org/2000/svg","path");
    path_node.setAttribute("d",strPoints);
    window[strID] = new CreatePathObj(path_node);
    window[strID].id = strID;
    window[strID].translate_x = ftransX;
    window[strID].translate_y = ftransY;
    window[strID].parentObj = window[root_obj_id];
    window[strID].prevSibling = window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1];
    window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1].nextSibling = window[strID];
    window[root_obj_id].appendChild(window[strID]);
    gradient_update(window[strID]);
}
//defs 객체를 만들어서 객체를 복사해올수 있도록 만들어야함
function CreateUse(strID, x, y, strhref, strtype, ftransX, ftransY)
{
    console.log("CreateUse function is not working in client");
    /*
    var use_node = document.createElementNS("http://www.w3.org/2000/svg","use");
    window[strID] = new CreateUseObj(use_node);
    window[strID].x = x;
    window[strID].y = y;
    
    window[strID].parentObj = window[root_obj_id];
    window[strID].prevSibling = window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1];
    window[root_obj_id].childNodes[window[root_obj_id].childNodes.length-1].nextSibling = window[strID];
    window[root_obj_id].appendChild(window[strID]);
    */
}
//////////////////////////////////////////////////////////////////////////////////////
//property modify
function SetAttribute(strVariable, strValue)    // 속성을 설정하는 함수
{
    var strsetattribute = strVariable + "=" + strValue;
	eval(strsetattribute);
}
function ExecuteProgram(strProgram, strParam)   // 웹에서 쓰이지 않음
{
    console.log("ExecuteProgram function is not working in client");
}

function ExecuteString(strCallPageName, strScriptName, strEvent)
{
    /*v8::String::Utf8Value str1(args[0]);
	CString strCallPageName = utf8_decode(UtfToCString(str1));
	v8::String::Utf8Value str2(args[1]);
	CString strScriptName = utf8_decode(UtfToCString(str2));
	v8::String::Utf8Value str3(args[2]);
	CString strEvent = utf8_decode(UtfToCString(str3));
	CString strInput = strEvent;*/
}

function ChangePicture(position, page)  // svg파일 바꾸기
{
    //enuspace에 폴더 추가기능 생기기전까지 임시로직
	var sendpagename;
	if(String(page) == undefined)
	{
		console.log("invaild pagename or undefined pagename");
		return;
	}
	var strtemp = String(page).split('\\');
	if(strtemp.length > 0)
	{
		sendpagename = strtemp[strtemp.length - 1];
	}
	GradentList =[];
	if($('#imageLists').length > 0)
	{
		$('#imageLists').empty();
	}
	requestpage(sendpagename);
}

function LoadPicture(page, position)
{   // svg파일 로드하기(현재는 동작 방식이 changepicture와 동일함 추후 window형식이 되면 기능이 변경될 예정)
    ChangePicture(position, page);
}

function RemovePicture()
{
    console.log("RemovePicture function is not working in client");
}
function GetWindowSize()
{   // 캔버스(또는 window형식에서 해당 window의 크기)를 가져오는 함수 현재는 캔버스의 크기만 가져옴
    var rect = new Rect();
    rect.left = window[root_obj_id].x;
    rect.top = window[root_obj_id].y;
    rect.right = window[root_obj_id].x + window[root_obj_id].width;
    rect.bottom = window[root_obj_id].y + window[root_obj_id].height;
    return rect;
}

function GetImageSize(imageobj_id)
{
    var rect = new Rect();
    rect.left = window[imageobj_id].x;
    rect.top = window[imageobj_id].y;
    rect.right = window[imageobj_id].x + window[imageobj_id].width;
    rect.bottom = window[imageobj_id].y + window[imageobj_id].height;
    return rect;
}
function ExecFunctionSync()
{
    console.log("ExecFunctionSync function is not working in client");
}
function ExecFunctionAsync()
{
    console.log("ExecFunctionAsync function is not working in client");
}

function GetLocalCursorPosX()
{
    var x;
    if(mouse_cor)
    {
        x = mouse_cor.offsetX;
    }
    else
    {
        x = 0;
    }
    return x;
}
function GetLocalCursorPosY()
{
    var y;
    if(mouse_cor)
    {
        y = mouse_cor.offsetY;
    }
    else
    {
        y = 0;
    }
    return y;
}
function GetCursorPosX()
{
    var x;
    if(mouse_cor)
    {
        x = mouse_cor.screenX;
    }
    else
    {
        x = 0;
    }
    return x;
}
function GetCursorPosY()
{
    var y;
    if(mouse_cor)
    {
        y = mouse_cor.screenY;
    }
    else
    {
        y = 0;
    }
    return y;
}
function GetZoomScale()
{
    return m_worldScale.x;
}
function SetZoomScale(scale_value)
{
    m_worldScale.x = scale_value;
    m_worldScale.y = scale_value;
}
function SetMoveCanvas(posX, posY)
{
    m_worldPos.x = posX;
    m_worldPos.y = posY;
}
function GetMoveCanvasX()
{
	return m_worldPos.x;
}
function GetMoveCanvasY()
{
    return m_worldPos.y;
}
function OpenWindow()
{
    console.log("OpenWindow function is not working in client");
}
function CloseWindow()
{
    console.log("CloseWindow function is not working in client");
}
function MoveWindow()
{
    console.log("MoveWindow function is not working in client");
}
function GetMouseWheelDelta()
{
    console.log("GetMouseWheelDelta function is not working in client");
}
function ShellExecute()
{
    console.log("ShellExecute function is not working in client");
}
function PlaySound()
{
    console.log("PlaySound function is not working in client");
}
function PlaySoundX()
{
    console.log("PlaySoundX function is not working in client");
}
function StopSoundX()
{
    console.log("StopSoundX function is not working in client");
}
function SetVolumeX()
{
    console.log("SetVolumeX function is not working in client");
}
//////////////////////////////////////////////////////////////////////////////////////////////
//Dom Interface
function GetNodePointer()
{
    console.log("GetNodePointer function is not working in client");
}
function GetNodeAttribute()
{
    console.log("GetNodeAttribute function is not working in client");
}
function SetNodeAttribute()
{
    console.log("SetNodeAttribute function is not working in client");
}
function SetArrayValue()
{
    console.log("SetArrayValue function is not working in client");
}
function GetArrayValue()
{
    console.log("GetArrayValue function is not working in client");
}
function memcpy()
{
    console.log("memcpy function is not working in client");
}
function make3dobjstructure(objnode)
{
	var Appearance_node = document.createElement("Appearance");
	var Material_node = document.createElement("Material");
	var Shape_node = document.createElement("Shape");
	var Transform_node = document.createElement("Transform");
	Transform_node.setAttribute("rotation","0.000000,0.000000,0.000000");
	Transform_node.setAttribute("scaleOrientation","0.000000,0.000000,1.000000,0.000000");
	Transform_node.setAttribute("translation",objnode.getAttribute("trans"));
	Material_node.setAttribute("ambientIntensity","0.200000");
	Material_node.setAttribute("shininess","0.200000");
	Material_node.setAttribute("transparency","1.000000");
	Material_node.setAttribute("diffuseColor","0.800000,0.800000,0.800000");
	Material_node.setAttribute("emissiveColor","0.000000,0.000000,0.000000");
	Material_node.setAttribute("specularColor","0.000000,0.000000,0.000000");
	Shape_node.setAttribute("id",objnode.getAttribute("id"));
	Appearance_node.appendChild(Material_node);
	Shape_node.appendChild(Appearance_node);
	Shape_node.appendChild(objnode);
	Transform_node.appendChild(Shape_node);
	return objnode;
}
function Create3DBox(strID, size, transx, transy, transz)
{
    var cre_node = document.createElement("Box");
	cre_node.setAttribute("size",size+","+size+","+size);
	cre_node.setAttribute("trans",transx+","+transy+","+transz);
	cre_node.setAttribute("id",strID);
	cre_node = make3dobjstructure(cre_node);
    window[strID] = new Create3DBoxObj(cre_node);
    window[strID].parentObj = x3dSceneobj;
    window[strID].prevSibling = x3dSceneobj.childNodes[x3dSceneobj.childNodes.length-1];
    x3dSceneobj.childNodes[x3dSceneobj.childNodes.length-1].nextSibling = window[strID];
    x3dSceneobj.appendChild(window[strID]);
}
function Create3DCone(strID, bottomradius, height, slices, transx, transy, transz)
{
    var cre_node = document.createElement("Cone");
	cre_node.setAttribute("bottom","true");
	cre_node.setAttribute("bottomRadius",bottomradius);
	cre_node.setAttribute("height",height);
	cre_node.setAttribute("subdivision",slices);
	cre_node.setAttribute("top","true");
	cre_node.setAttribute("topRadius","true");
	cre_node.setAttribute("bottom","0.000000");
	cre_node.setAttribute("trans",transx+","+transy+","+transz);
	cre_node.setAttribute("id",strID);
	cre_node = make3dobjstructure(cre_node);
    window[strID] = new Create3DConeObj(cre_node);
    window[strID].parentObj = x3dSceneobj;
    window[strID].prevSibling = x3dSceneobj.childNodes[x3dSceneobj.childNodes.length-1];
    x3dSceneobj.childNodes[x3dSceneobj.childNodes.length-1].nextSibling = window[strID];
    x3dSceneobj.appendChild(window[strID]);
}
function Create3DCylinder(strID, height, radius, slices, transx, transy, transz)
{
	var cre_node = document.createElement("Cylinder");
	cre_node.setAttribute("bottom","true");
	cre_node.setAttribute("height",height);
	cre_node.setAttribute("radius",radius);
	cre_node.setAttribute("side","true");
	cre_node.setAttribute("subdivision",slices);
	cre_node.setAttribute("top","true");
	cre_node.setAttribute("trans",transx+","+transy+","+transz);
	cre_node.setAttribute("id",strID);
	cre_node = make3dobjstructure(cre_node);
    window[strID] = new Create3DCylinderObj(cre_node);
    window[strID].parentObj = x3dSceneobj;
    window[strID].prevSibling = x3dSceneobj.childNodes[x3dSceneobj.childNodes.length-1];
    x3dSceneobj.childNodes[x3dSceneobj.childNodes.length-1].nextSibling = window[strID];
    x3dSceneobj.appendChild(window[strID]);
}
function Create3DFaceSet(strID, points, coordIndex, transx, transy, transz)
{
	var cre_node = document.createElement("FaceSet");
	cre_node.setAttribute("bottom","true");
	cre_node.setAttribute("bottomRadius",bottomradius);
	cre_node.setAttribute("height",height);
	cre_node.setAttribute("subdivision","24.000000");
	cre_node.setAttribute("top","true");
	cre_node.setAttribute("topRadius","true");
	cre_node.setAttribute("bottom","0.000000");
	cre_node.setAttribute("trans",transx+","+transy+","+transz);
	cre_node.setAttribute("id",strID);
	cre_node = make3dobjstructure(cre_node);
    window[strID] = new Create3DCylinderObj(cre_node);
    window[strID].parentObj = x3dSceneobj;
    window[strID].prevSibling = x3dSceneobj.childNodes[x3dSceneobj.childNodes.length-1];
    x3dSceneobj.childNodes[x3dSceneobj.childNodes.length-1].nextSibling = window[strID];
    x3dSceneobj.appendChild(window[strID]);
}
function Create3DInline(strID, strUrl, transx, transy, transz)
{
	
}
function Create3DLineSet(strID, points, transx, transy, transz)
{
	
}
function Create3DSphere(strID, radius, slices, transx, transy, transz)
{
	var cre_node = document.createElement("Sphere");
	cre_node.setAttribute("radius",radius);
	cre_node.setAttribute("subdivision",slices);
	cre_node.setAttribute("trans",transx+","+transy+","+transz);
	cre_node.setAttribute("id",strID);
	cre_node = make3dobjstructure(cre_node);
    window[strID] = new Create3DSphereObj(cre_node);
    window[strID].parentObj = x3dSceneobj;
    window[strID].prevSibling = x3dSceneobj.childNodes[x3dSceneobj.childNodes.length-1];
    x3dSceneobj.childNodes[x3dSceneobj.childNodes.length-1].nextSibling = window[strID];
    x3dSceneobj.appendChild(window[strID]);
}
function Create3DTerrain(strID, size, subdivision, transx, transy, transz)
{
	
}
function Create3DText(strID, text, style, fontsize, transx, transy, transz)
{
	var font_node = document.createElement("FontStyle");
	font_node.setAttribute("family","Arial");
	font_node.setAttribute("size",fontsize);
	var cre_node = document.createElement("Text");
	cre_node.setAttribute("string",text);
	cre_node.setAttribute("trans",transx+","+transy+","+transz);
	cre_node.setAttribute("id",strID);
	cre_node = make3dobjstructure(cre_node);
    window[strID] = new Create3DSphereObj(cre_node);
    window[strID].parentObj = x3dSceneobj;
    window[strID].prevSibling = x3dSceneobj.childNodes[x3dSceneobj.childNodes.length-1];
    x3dSceneobj.childNodes[x3dSceneobj.childNodes.length-1].nextSibling = window[strID];
    x3dSceneobj.appendChild(window[strID]);
}
function Create3DContour(strID, transx, transy, transz)
{
	
}