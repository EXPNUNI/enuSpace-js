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
// 2017.03.31 그라데이션 추가 chs
// 
///////////////////////////////////////////////////////////////////////////////////////
function ChangePicture(position, page)
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
   GridentList =[];
   
   if($('#imageLists').length > 0)
   {
      $('#imageLists').empty();
   }
   ///
   
    requestpage(sendpagename);
}
//12.14 LWH
function getPictureValue(page)
{
    var xmlHttp = new XMLHttpRequest();
	var strUrl = "getpicturevalue" ;
	var strParam= "page="+page;

    if(render_mode == "3d")
    {
        return;
    }
    xmlHttp.onreadystatechange=function()
    {
        if (xmlHttp.readyState==4 && xmlHttp.status==200)
        {
            var msg = xmlHttp.responseText;

            var arr;
            if(msg != "")
            {
                arr = JSON.parse(msg);
            }

            if(arr != undefined)
            {
                if(arr.RESULT_CODE == "RESULT_OK")
                {
                    if(arr.TIME)
                    {
                        if(arr.TIME_FORMAT != prev_time_mode)
                        {
                            time_flag = true;
                        }

                        old_time_value = time_value;
                        var recive_time = new Date(arr.TIME).valueOf();
                        if(arr.TIME_FORMAT == "SIM")
                        {
                            var sub_time = new Date("1601-01-01 00:00:00.000").valueOf();
                            time_value = recive_time - sub_time;
                        }
                        else if(arr.TIME_FORMAT == "SYS")
                        {
                            time_value = recive_time;
                        }
                        prev_time_mode = arr.TIME_FORMAT;
                    }
                    var values = arr.VALUES;
                    var eval_text = "";
                    if (values.length > 0)
                    {
                        for(var i in values)
                        {
                            if(values[i].VARIABLE.indexOf("@") != -1)
                            {
                                values[i].VARIABLE = values[i].VARIABLE.substring(1,values[i].VARIABLE.length);
                            }
                            if(window[values[i].VARIABLE] != undefined)
                            {
                                if(values[i].VALUE == "TRUE" || values[i].VALUE == "FALSE")
                                {
                                    if(values[i].VALUE == "TRUE")
                                    {
                                        window[values[i].VARIABLE] = Boolean(true);
                                    }
                                    else if(values[i].VALUE == "FALSE")
                                    {
                                        window[values[i].VARIABLE] = Boolean(false);
                                    }
                                }
                                else if(Number(values[i].VALUE))
                                {
                                    window[values[i].VARIABLE] = Number(values[i].VALUE);
                                }
                                else
                                {
                                    window[values[i].VARIABLE] = values[i].VALUE;
                                }
                            }
                            else if(values[i].VARIABLE.indexOf(".") != -1)
                            {
                                var split_text = "";
                                split_text = values[i].VARIABLE.split(".");
                                for(var j in split_text)
                                {
                                    if(j==0)
                                    {
                                        eval_text = "window[\"" + split_text[j] + "\"]";
                                    }
                                    else
                                    {
                                        eval_text = eval_text + "[\"" + split_text[j] + "\"]";
                                    }
                                }

                                if(values[i].VALUE == "TRUE" || values[i].VALUE == "FALSE")
                                {
                                    if(values[i].VALUE == "TRUE")
                                    {
                                        eval_text = eval_text + " = " + Boolean(true) + ";";
                                    }
                                    else if(values[i].VALUE == "FALSE")
                                    {
                                        eval_text = eval_text + " = " + Boolean(false) + ";";
                                    }
                                }
                                else if(Number(values[i].VALUE))
                                {
                                    eval_text = eval_text + " = " + Number(values[i].VALUE) + ";";
                                }
                                else
                                {
                                    eval_text = eval_text + " = " + values[i].VALUE + ";";
                                }
                                eval(eval_text);
                            }
                        }
                    }
                }
                else
                {
                    if(arr.RESULT_CODE == "CODE_INVALID_PAGE")
                    {
                        console.log("getPictureValue: 페이지를 찾지 못하였습니다.");
                    }
                }
            }
            if(old_time_value != time_value)
            {
                if(window[root_obj_id].trend_list.length != 0)
                {
                    var trendlist = window[root_obj_id].trend_list;
                    for(var i in trendlist)
                    {
                        SeriesDataUpdate(trendlist[i]);
                    }
                }
            }
            if(time_flag)
            {
                if(window[root_obj_id].trend_list.length != 0)
                {
                    var trendlist = window[root_obj_id].trend_list;
                    for(var i in trendlist)
                    {
                        SeriesDataInitialize(trendlist[i]);
                    }
                }
                time_flag = false;
            }
        }
        else if(xmlHttp.readyState==4 && xmlHttp.status==500)
        {
            console.log("500 error Internal Server Error: 서버에서 클라이언트 요청을 처리 중에 에러가 발생함.");
        }
        else if(xmlHttp.readyState==4 && xmlHttp.status==503)
        {
            console.log("503 error Service Unavailable: 서버가 일시적으로 요청을 처리할 수 없음. 서버가 과부하 상태이거나 점검중이므로 요청을 처리할 수 없음을 알려줌.");
        }
        else if(xmlHttp.readyState == 4 && xmlHttp.status==504)
        {
            console.log("504 error Gateway Timeout: 서버를 통하는 게이트웨이에 문제가 발생하여 시간이 초과됨.");
        }
        else if(xmlHttp.readyState == 4 && xmlHttp.status==505)
        {
            console.log("505 error HTTP Version Not Supported: 해당 HTTP 버전에서는 지원되지 않는 요청임을 알려줌.");
        }
    };
    
    xmlHttp.open("POST", strUrl, true);	
	xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
	xmlHttp.setRequestHeader("Cache-Control","no-cache, must-revalidate");
	xmlHttp.setRequestHeader("Pragma","no-cache");
	xmlHttp.send(strParam);
}
function requestpage(pagename) 
{
    if(render_mode == "2d")
    {
        if(root_obj_id != undefined)
        {
            if(window[root_obj_id] != undefined)
            {
                if(window[root_obj_id].main_taskview != undefined)
                {
                    clearInterval(interval_id);
                }
                delete window[root_obj_id];
            }
        }
    }
    else if(render_mode == "3d")
    {
        if(x3dSceneobj != undefined)
        {
            if(x3dSceneobj.main_taskview != undefined)
            {
                clearInterval(interval_id);
            }
            delete x3dSceneobj;
        }
    }
    //12.14 LWH
    if(current_page != undefined)
    {
        if(interval_page_value != undefined)
        {
            clearInterval(interval_page_value);
        }
    }
    
    var xmlHttp = new XMLHttpRequest();
	var strUrl = "requestpage" ;
	var strParam= "page="+pagename.trim();
    current_page = pagename.trim();

	xmlHttp.open("POST",strUrl,false);
	xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
	xmlHttp.setRequestHeader("Cache-Control","no-cache, must-revalidate");
	xmlHttp.setRequestHeader("Pragma","no-cache");
	xmlHttp.send(strParam);
	
	//////////////////////////////////////////////////////////////////////
    var agent = navigator.userAgent.toLowerCase();
    
  	var msg = xmlHttp.responseText;
	var DomNode;
	
    if((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) // 인터넷 익스플로러 전용
	{
		DomNode=new ActiveXObject("Microsoft.XMLDOM");
		DomNode.async=false;
		DomNode.loadXML(msg);
        current_browser = "ie";
	} 
    else if (window.DOMParser)//크롬, 파이어폭스 등등
	{
		parser = new DOMParser();
		DomNode=parser.parseFromString(msg,"text/xml");
        current_browser = "";
	}

    if(DomNode.documentElement.nodeName == "svg")
    {
        render_mode = "2d";
        makestruct(DomNode.documentElement);
    }
    else if(DomNode.documentElement.nodeName == "x3d")
    {
        render_mode = "3d";
        makestruct_x3d(DomNode.documentElement);
    }
	
    if(render_mode == "2d")
    {
        if(root_obj_id != undefined)
        {
            if(window[root_obj_id] != undefined)
            {
                if(window[root_obj_id].main_taskview != undefined)
                {
                    interval_id = setInterval("window[root_obj_id].main_taskview()", 50);
                }
            }
        }
    }
    else if(render_mode == "3d")
    {
        if(x3dSceneobj != undefined)
        {
            if(x3dSceneobj.main_taskview != undefined)
            {
                interval_id = setInterval("x3dSceneobj.main_taskview()", 50);
            }
        }
    }
    
    if(render_mode == "2d")
    {//init시 마우스오버 오브젝트를 rootobj로 한다. 03.06 LWH
        mouse_over_obj = window[root_obj_id];
        //12.14 LWH
        if(current_page != undefined)
        {
            interval_page_value = setInterval("getPictureValue(current_page);", 200);
        }
        Draw_Init(window[root_obj_id]);
        Draw_All(window[root_obj_id]);
    }
    else if(render_mode == "3d")
    {
        mouse_over_obj = x3dSceneobj;
        if(current_page != undefined)
        {
            interval_page_value = setInterval("getPictureValue(current_page);", 200);
        }
        initDraw(x3dSceneobj);
    }
    
}
function SetTagValue(tag, value)
{
    var xmlHttp = new XMLHttpRequest();
    var strUrl = "setvalue" ;
    var strParam= "tagid="+tag + "&" + "value="+ value;

    xmlHttp.onreadystatechange=function()
    {
        if (xmlHttp.readyState==4 && xmlHttp.status==200)
        {
            var msg = xmlHttp.responseText;

            var arr = JSON.parse(msg);
            if (arr.RESULT == "OK")
            {

            }
            else
            {
                if (arr.RESULT_CODE == "CODE_VARIABLE_NOUT_FOUND" )
                {
                    console.log("SetTagValue: 등록된 디바이스의 변수를  검색하지 못하였습니다.");
                }
                if (arr.RESULT_CODE == "CODE_UNKNOWN_DATATYPE" )
                {
                    console.log("SetTagValue:알수없는 데이터 타입니다..");
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

function GetTagValue(tag)
{
    var xmlHttp = new XMLHttpRequest();
	var strUrl = "getvalue" ;
	var strParam= "tagid="+tag;

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
			console.log("GetTagValue: 등록된 디바이스의 변수를  검색하지 못하였습니다.");
		}
		if (arr.RESULT_CODE == "CODE_UNKNOWN_DATATYPE" )
		{
			console.log("GetTagValue: 알수없는 데이터 타입니다..");
		}				
	}
}

////////////////////////////////////////////////////////////////////////////////////////
//sibling update
function sibling_update(obj)
{
    var prevobj;
    var nextobj;
    if(obj != undefined)
    {
        for(var i = 0;i<obj.childNodes.length;i++)
        {
            if((i-1) == -1)
            {
                prevobj = obj.childNodes[i];
            }
            else
            {
                prevobj.nextSibling = obj.childNodes[i];
                obj.childNodes[i].prevSibling = prevobj;
                prevobj = obj.childNodes[i];
            }
        }
    }
}
//prevSibling;
//nextSibling;

var linkobj_list = [];
var root_obj_id;	//svgobjidlist
var symbol_list;	//symbol obj
var interval_id;
//12.14 LWH
var current_page;
var interval_page_value;
//12.15 LWH
var current_browser;
var old_time_value = -1;
var time_value = 0;
var time_flag = false;  // 타임모드 변경 여부 확인
var prev_time_mode;     // 이전 타임모드
var GridentList =[];
var mouse_over_obj;
//2017.11.28 LWH 추가
var render_mode;    //랜더링 모드 2d or 3d


////////////////////////////////////////////////////////////////////////////////////////
//구조체 생성 2d svg
function makestruct(parentNode, parentObj)
{
	//documentElement는 항상 루트 노드를 나타낸다
	if(parentNode)
	{
		if(parentNode.nodeName == "svg")
		{
			window[parentNode.id] = new CreateSvgObj(parentNode);
            root_obj_id = parentNode.id;
			parentObj = window[parentNode.id];
		}

		var childnode = parentNode.firstChild;

		if(childnode != 0)
		{
            for (var i=0;i<parentNode.childNodes.length;i++)
			{
                if(childnode.nodeName == "line")
                {
                    window[childnode.id] = new CreateLineObj(childnode);
                    window[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(window[childnode.id]);
                }
                else if(childnode.nodeName == "rect")
                {
                    window[childnode.id] = new CreateRectObj(childnode);
                    window[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(window[childnode.id]);
                }
                else if(childnode.nodeName == "polygon" || childnode.nodeName == "polyline")
                {
                    window[childnode.id] = new CreatePolygonObj(childnode);
                    window[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(window[childnode.id]);
                }
                else if(childnode.nodeName == "ellipse")
                {
                    window[childnode.id] = new CreateEllipseObj(childnode);
                    window[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(window[childnode.id]);
                }
                else if(childnode.nodeName == "circle")
                {
                    window[childnode.id] = new CreateCircleObj(childnode);
                    window[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(window[childnode.id]);
                }
                else if(childnode.nodeName == "path")
                {
                    window[childnode.id] = new CreatePathObj(childnode);
                    window[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(window[childnode.id]);
                }
                else if(childnode.nodeName == "text")
                {
                    window[childnode.id] = new CreateTextObj(childnode);
                    window[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(window[childnode.id]);
                }
                else if(childnode.nodeName == "g")
                {
                    window[childnode.id] = new CreateGObj(childnode);
                    window[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(window[childnode.id]);
                }
                else if(childnode.nodeName == "use")
                {
                    window[childnode.id] = new CreateUseObj(childnode);
                    window[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(window[childnode.id]);
                }
                else if(childnode.nodeName == "pg-trend-contour")
                {
                    window[childnode.id] = new CreateContourObj(childnode);
                    window[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(window[childnode.id]);
                }
                else if(childnode.nodeName == "image")
                {
                    window[childnode.id] = new CreateImageObj(childnode);
                    window[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(window[childnode.id]);
                }
                else if(childnode.nodeName == "pg-trend")
                {
                    window[childnode.id] = new CreateTrendObj(childnode);
                    window[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(window[childnode.id]);
                    window[root_obj_id].trend_list.push(window[childnode.id]);
                }
                else if(childnode.nodeName == "pg-link")    // link객체는 생성하지 않고 자식객체인 폴리라인만 생성한다.
                {
                    window[childnode.id] = new CreateLinkObj(childnode);
                    window[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(window[childnode.id]);
                }
				else if(childnode.nodeName == "linearGradient") //[그라디언트 추가]
				{
					window[childnode.id] = new CreateLineGridentObj(childnode);
					window[childnode.id].parentObj = parentObj;
					GridentList.push(window[childnode.id]);
					
				}
				else if(childnode.nodeName == "radialGradient") //[그라디언트 추가]
				{
					window[childnode.id] = new CreateRadialGridentObj(childnode);
					window[childnode.id].parentObj = parentObj;
					GridentList.push(window[childnode.id]);
				}
                else if(childnode.nodeName == "pg-attribute")   // pg-attribute의 경우 타입별 변수형으로 맞춰서 문자열을 변경시킨다.
                {
                    if(parentNode.nodeName == "svg")    // svg일 경우 전역변수 선언
                    {
                        if(childnode.getAttribute("type") == "double" || childnode.getAttribute("type") == "int" || childnode.getAttribute("type") == "float")  // 숫자형 double, float, int
                        {
                            window[childnode.getAttribute("variable")] = Number(childnode.getAttribute("initial"));
                        }
                        else if(childnode.getAttribute("type") == "bool")   // bool
                        {
                            if(childnode.getAttribute("initial") == "TRUE")
                            {
                                window[childnode.getAttribute("variable")] = Boolean(true);
                            }
                            else
                            {
                                window[childnode.getAttribute("variable")] = Boolean(false);
                            }
                        }
                        else    // 문자열 string
                        {
                            window[childnode.getAttribute("variable")] = childnode.getAttribute("initial");
                        }
                    }
                    else
                    {
                        if(childnode.getAttribute("type") == "double" || childnode.getAttribute("type") == "int" || childnode.getAttribute("type") == "float")
                        {
                            parentObj[childnode.getAttribute("variable")] = Number(childnode.getAttribute("initial"));
                        }
                        else if(childnode.getAttribute("type") == "bool")
                        {
                            if(childnode.getAttribute("initial") == "TRUE")
                            {
                                parentObj[childnode.getAttribute("variable")] = Boolean(true);
                            }
                            else
                            {
                                parentObj[childnode.getAttribute("variable")] = Boolean(false);
                            }
                        }
                        else
                        {
                            parentObj[childnode.getAttribute("variable")] = childnode.getAttribute("initial");
                        }
                    }   
                }

                if(childnode.childNodes.length != 0 && childnode.nodeName != "use")
				{
					makestruct(childnode,window[childnode.id]);
				}
                
				if(childnode.nextSibling)
				{
					childnode = childnode.nextSibling;
				}
				else
				{
                    sibling_update(parentObj);
                    break;
				}
			}
		}
	}
}
////////////////////////////////////////////////////////////////////////////////////////
//function 생성
function CreateFunction(scriptobj, createobj)
{
	var scripttext = scriptobj.split("function");
	var trimtext;
	var scriptcontent;
	var userfn_name;
    var paramiter_arr;
	var innerfncheck;
    var paramitertext;
	for (var i=0;i<scripttext.length;i++)
	{
		trimtext = scripttext[i].trim();
		scriptcontent = trimtext.substring(trimtext.indexOf("{")+1,trimtext.length-1);//스크립트의 내용만 추출

		if(scriptcontent.split("{").length == scriptcontent.split("}").length)
			innerfncheck = false;
		else
			innerfncheck = true;

		if(trimtext)
		{
			if(trimtext.indexOf("onclick()") == 1 && !innerfncheck)
			{
				createobj._onclick = Function(scriptcontent.trim());
			}
			else if(trimtext.indexOf("onmousedown()") == 1 && !innerfncheck)
			{
				createobj._onmousedown = Function(scriptcontent.trim());
			}
			else if(trimtext.indexOf("onmouseup()") == 1 && !innerfncheck)
			{
				createobj._onmouseup = Function(scriptcontent.trim());
			}
			else if(trimtext.indexOf("onmouseover()") == 1 && !innerfncheck)
			{
				createobj._onmouseover = Function(scriptcontent.trim());
			}
			else if(trimtext.indexOf("onmouseout()") == 1 && !innerfncheck)
			{
				createobj._onmouseout = Function(scriptcontent.trim());
			}
			else if(trimtext.indexOf("onmousemove()") == 1 && !innerfncheck)
			{
				createobj._onmousemove = Function(scriptcontent.trim());
			}
			else if(trimtext.indexOf("onmousewheel()") == 1 && !innerfncheck)
			{
				createobj._onmousewheel = Function(scriptcontent.trim());
			}
			else if(trimtext.indexOf("onfocusin()") == 1 && !innerfncheck)
			{
				createobj._onfocusin = Function(scriptcontent.trim());
			}
			else if(trimtext.indexOf("onfocusout()") == 1 && !innerfncheck)
			{
				createobj._onfocusout = Function(scriptcontent.trim());
			}
			else if(trimtext.indexOf("onactivate()") == 1 && !innerfncheck)
			{
				createobj._onactivate = Function(scriptcontent.trim());
			}
			else if(trimtext.indexOf("onload()") == 1 && !innerfncheck)
			{
				createobj._onload = Function(scriptcontent.trim());
			}
			else if(trimtext.indexOf("ontaskview()") == 1 && !innerfncheck)
			{
				createobj._ontaskview = Function(scriptcontent.trim());
			}
			else	//유저 함수 저장
			{
				if(createobj.nodename == "svg")
                {
                    userfn_name = trimtext.substring(0,trimtext.indexOf("(")).trim();
                    if(userfn_name == "")
                        console.log("id: "+createobj.id+" error: fn name is null");
					else if(userfn_name == "main_taskview")
					{
						createobj[userfn_name] = Function(scriptcontent.trim());
					}
                    else
                    {
                        paramitertext = trimtext.substring(trimtext.indexOf("(")+1, trimtext.indexOf(")")).trim();
						paramitertext = "\"" + paramitertext + "\"";
                        window[userfn_name] = Function(eval(paramitertext),scriptcontent.trim());
                    }
                }
                else
                {
                    userfn_name = trimtext.substring(0,trimtext.indexOf("(")).trim();
                    if(userfn_name == "")
                        console.log("id: "+createobj.id+" error: fn name is null");
                    else
                    {
                        paramitertext = trimtext.substring(trimtext.indexOf("(")+1, trimtext.indexOf(")")).trim();
						paramitertext = "\"" + paramitertext + "\"";
                        createobj[userfn_name] = Function(eval(paramitertext),scriptcontent.trim());
                    }
                }
			}
		}
	}
}
////////////////////////////////////////////////////////////////////////////////////////
//link 객체 생성
function CreateLinkObj(nodeobj)
{
	this.nodename = nodeobj.nodeName;
	this.id = nodeobj.getAttribute("id");
    this.parentObj;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//link property
	this.from_id = nodeobj.getAttribute("from-id");
	this.param_from = nodeobj.getAttribute("param-from");
    this.from_value;
	this.to_id = nodeobj.getAttribute("to-id");
	this.param_to = nodeobj.getAttribute("param-to");
}
////////////////////////////////////////////////////////////////////////////////////////
//svg 객체 생성
function CreateSvgObj(nodeobj)
{
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = nodeobj.getAttribute("id");
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //series데이터를 받아오기 위한 trend list
    this.trend_list = [];
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//gbase
	this.visibility = nodeobj.getAttribute("visibility");
    this.stroke = "rgb(255,255,255)";
    this.stroke_opacity = 1;
    this.stroke_width = 1;
    this.stroke_dasharray = "";
    this.fill = "rgb(255,255,255)";
    this.fill_opacity = 1;
    
    this.style = String(nodeobj.getAttribute("style"));
    if(this.style != "null")
    {
        var style_split = this.style.split(";");
        var style_element_split;
        for(var i = 0;i < style_split.length;i++)
        {
            style_element_split = style_split[i].split(":");
            if(style_element_split[0] == "stroke")
            {
                this.stroke = String(style_element_split[1]);
            }            
            if(style_element_split[0] == "stroke-opacity")
            {
                this.stroke_opacity = String(style_element_split[1]);
            }
            if(style_element_split[0] == "stroke-width")
            {
                this.stroke_width = String(style_element_split[1]);
            }
            if(style_element_split[0] == "stroke-dasharray")
            {
                this.stroke_dasharray = String(style_element_split[1]);
            }
            if(style_element_split[0] == "background-color")
            {
                this.fill = String(style_element_split[1]);
                this.fill_opacity = 1;
            }
        }
    }
    this.x = parseFloat(nodeobj.getAttribute("x"));
	this.y = parseFloat(nodeobj.getAttribute("y"));
	this.width = parseFloat(nodeobj.getAttribute("width"));
	this.height = parseFloat(nodeobj.getAttribute("height"));
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//tranform
	this.transform = nodeobj.getAttribute("transform");
    if(this.transform)
    {
        var transform_split = this.transform.split("(");
        this.translate_x = parseFloat(Number(transform_split[1].substring(0,transform_split[1].indexOf(","))));
        this.translate_y = parseFloat(Number(transform_split[1].substring(transform_split[1].indexOf(",")+1,transform_split[1].indexOf(")"))));
        this.rotate = parseFloat(Number(transform_split[2].substring(0,transform_split[2].indexOf(")"))));
        this.scale_x = parseFloat(Number(transform_split[3].substring(0,transform_split[3].indexOf(","))));
        this.scale_y = parseFloat(Number(transform_split[3].substring(transform_split[3].indexOf(",")+1,transform_split[3].indexOf(")"))));
    }
    else
    {
        this.translate_x = 0;
        this.translate_y = 0;
        this.rotate = 0;
        this.scale_x = 1;
        this.scale_y = 1;
    }
    this.center_x = nodeobj.getAttribute("pg-xcenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-xcenter")) : 0;
    this.center_y = nodeobj.getAttribute("pg-ycenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-ycenter")) : 0;
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//svg property
	this.version = nodeobj.getAttribute("version");
	this.preserveAspectRatio = nodeobj.getAttribute("preserveAspectRatio");
	this.contentScriptType = nodeobj.getAttribute("contentScriptType");
	this.contentStyleType = nodeobj.getAttribute("contentStyleType");
	this.viewBox = nodeobj.getAttribute("viewBox");

	var child = nodeobj.firstChild;
	for(var i=0;i<nodeobj.childNodes.length;i++)
	{
		if(child.nodeName == "script")
		{
            if(current_browser == "ie")
            {
                CreateFunction(child.text,this);
            }
            else
            {
                CreateFunction(child.textContent,this);
            }
		}
		if(child.nextSibling)
		{
			child = child.nextSibling;
		}
		else
		{
			break;
		}
	}
}
////////////////////////////////////////////////////////////////////////////////////////
//g 객체 생성
function CreateGObj(nodeobj)
{
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = nodeobj.getAttribute("id");
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
    }
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//gbase
	this.visibility = nodeobj.getAttribute("visibility");
	this.stroke = nodeobj.getAttribute("stroke");
	this.stroke_opacity = parseFloat(nodeobj.getAttribute("stroke-opacity"));
	this.stroke_width = parseFloat(nodeobj.getAttribute("stroke-width"));
    this.stroke_dasharray = nodeobj.getAttribute("stroke-dasharray");
    this.x = parseFloat(nodeobj.getAttribute("x"));
	this.y = parseFloat(nodeobj.getAttribute("y"));
	this.width = parseFloat(nodeobj.getAttribute("width"));
	this.height = parseFloat(nodeobj.getAttribute("height"));
	this.style = nodeobj.getAttribute("style");
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//tranform
	this.transform = nodeobj.getAttribute("transform");
    if(this.transform)
    {
        var transform_split = this.transform.split("(");
        this.translate_x = parseFloat(Number(transform_split[1].substring(0,transform_split[1].indexOf(","))));
        this.translate_y = parseFloat(Number(transform_split[1].substring(transform_split[1].indexOf(",")+1,transform_split[1].indexOf(")"))));
        this.rotate = parseFloat(Number(transform_split[2].substring(0,transform_split[2].indexOf(")"))));
        this.scale_x = parseFloat(Number(transform_split[3].substring(0,transform_split[3].indexOf(","))));
        this.scale_y = parseFloat(Number(transform_split[3].substring(transform_split[3].indexOf(",")+1,transform_split[3].indexOf(")"))));
    }
    else
    {
        this.translate_x = 0;
        this.translate_y = 0;
        this.rotate = 0;
        this.scale_x = 1;
        this.scale_y = 1;
    }
    this.center_x = nodeobj.getAttribute("pg-xcenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-xcenter")) : 0;
    this.center_y = nodeobj.getAttribute("pg-ycenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-ycenter")) : 0;
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//G property

	var child = nodeobj.firstChild;
	for(var i=0;i<nodeobj.childNodes.length;i++)
	{
		if(child.nodeName == "script")
		{
            if(current_browser == "ie")
            {
                CreateFunction(child.text,this);
            }
            else
            {
                CreateFunction(child.textContent,this);
            }
		}
		if(child.nextSibling)
		{
			child = child.nextSibling;
		}
		else
		{
			break;
		}
	}
}
////////////////////////////////////////////////////////////////////////////////////////
//line 객체 생성
function CreateLineObj(nodeobj)
{
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = nodeobj.getAttribute("id");
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//gbase
    this.visibility = nodeobj.getAttribute("visibility");
	this.stroke = nodeobj.getAttribute("stroke");
	this.stroke_opacity = parseFloat(nodeobj.getAttribute("stroke-opacity"));
	this.stroke_width = parseFloat(nodeobj.getAttribute("stroke-width"));
    this.stroke_dasharray = nodeobj.getAttribute("stroke-dasharray");
    this.stroke_linecap = nodeobj.getAttribute("stroke-linecap");
    this.stroke_linejoin = nodeobj.getAttribute("stroke-linejoin");
	this.x = parseFloat(nodeobj.getAttribute("x"));
	this.y = parseFloat(nodeobj.getAttribute("y"));
	this.width = parseFloat(nodeobj.getAttribute("width"));
	this.height = parseFloat(nodeobj.getAttribute("height"));
	this.style = nodeobj.getAttribute("style");
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//tranform
	this.transform = nodeobj.getAttribute("transform");
    if(this.transform)
    {
        var transform_split = this.transform.split("(");
        this.translate_x = parseFloat(Number(transform_split[1].substring(0,transform_split[1].indexOf(","))));
        this.translate_y = parseFloat(Number(transform_split[1].substring(transform_split[1].indexOf(",")+1,transform_split[1].indexOf(")"))));
        this.rotate = parseFloat(Number(transform_split[2].substring(0,transform_split[2].indexOf(")"))));
        this.scale_x = parseFloat(Number(transform_split[3].substring(0,transform_split[3].indexOf(","))));
        this.scale_y = parseFloat(Number(transform_split[3].substring(transform_split[3].indexOf(",")+1,transform_split[3].indexOf(")"))));
    }
    else
    {
        this.translate_x = 0;
        this.translate_y = 0;
        this.rotate = 0;
        this.scale_x = 1;
        this.scale_y = 1;
    }
    this.center_x = nodeobj.getAttribute("pg-xcenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-xcenter")) : 0;
    this.center_y = nodeobj.getAttribute("pg-ycenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-ycenter")) : 0;
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//line property
    this.fill = nodeobj.getAttribute("stroke");
    this.fill_opacity = parseFloat(nodeobj.getAttribute("stroke-opacity"));
    
	this.x1 = parseFloat(Number(nodeobj.getAttribute("x1")));
	this.y1 = parseFloat(Number(nodeobj.getAttribute("y1")));
	this.x2 = parseFloat(Number(nodeobj.getAttribute("x2")));
	this.y2 = parseFloat(Number(nodeobj.getAttribute("y2")));
    this.begin_arrow_type=nodeobj.getAttribute("pg-begin-arrow-type");
	this.begin_arrow_size=parseFloat(Number(nodeobj.getAttribute("pg-begin-arrow-size")));
	this.begin_arrow_span=nodeobj.getAttribute("pg-begin-arrow-span");
	this.end_arrow_type=nodeobj.getAttribute("pg-end-arrow-type");
	this.end_arrow_size=parseFloat(Number(nodeobj.getAttribute("pg-end-arrow-size")));
	this.end_arrow_span=nodeobj.getAttribute("pg-end-arrow-span");

	var child = nodeobj.firstChild;
	for(var i=0;i<nodeobj.childNodes.length;i++)
	{
		if(child.nodeName == "script")
		{
            if(current_browser == "ie")
            {
                CreateFunction(child.text,this);
            }
            else
            {
                CreateFunction(child.textContent,this);
            }
		}
		if(child.nextSibling)
		{
			child = child.nextSibling;
		}
		else
		{
			break;
		}
	}
}
////////////////////////////////////////////////////////////////////////////////////////
//rect 객체 생성
function CreateRectObj(nodeobj)
{
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = nodeobj.getAttribute("id");
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//gbase
    this.visibility = nodeobj.getAttribute("visibility");
	this.stroke = nodeobj.getAttribute("stroke");
	this.stroke_opacity = parseFloat(nodeobj.getAttribute("stroke-opacity"));
	this.stroke_width = parseFloat(nodeobj.getAttribute("stroke-width"));
    this.stroke_dasharray = nodeobj.getAttribute("stroke-dasharray");
    this.stroke_linecap = nodeobj.getAttribute("stroke-linecap");
    this.stroke_linejoin = nodeobj.getAttribute("stroke-linejoin");
	this.x = parseFloat(nodeobj.getAttribute("x"));
	this.y = parseFloat(nodeobj.getAttribute("y"));
	this.width = parseFloat(nodeobj.getAttribute("width"));
	this.height = parseFloat(nodeobj.getAttribute("height"));
	this.style = nodeobj.getAttribute("style");
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//tranform
	this.transform = nodeobj.getAttribute("transform");
    if(this.transform)
    {
        var transform_split = this.transform.split("(");
        this.translate_x = parseFloat(Number(transform_split[1].substring(0,transform_split[1].indexOf(","))));
        this.translate_y = parseFloat(Number(transform_split[1].substring(transform_split[1].indexOf(",")+1,transform_split[1].indexOf(")"))));
        this.rotate = parseFloat(Number(transform_split[2].substring(0,transform_split[2].indexOf(")"))));
        this.scale_x = parseFloat(Number(transform_split[3].substring(0,transform_split[3].indexOf(","))));
        this.scale_y = parseFloat(Number(transform_split[3].substring(transform_split[3].indexOf(",")+1,transform_split[3].indexOf(")"))));
    }
    else
    {
        this.translate_x = 0;
        this.translate_y = 0;
        this.rotate = 0;
        this.scale_x = 1;
        this.scale_y = 1;
    }
    this.center_x = nodeobj.getAttribute("pg-xcenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-xcenter")) : 0;
    this.center_y = nodeobj.getAttribute("pg-ycenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-ycenter")) : 0;
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//rect property
	this.fill = nodeobj.getAttribute("fill");
	this.fill_opacity = parseFloat(nodeobj.getAttribute("fill-opacity"));
    this.rx = parseFloat(nodeobj.getAttribute("rx"));
	this.ry = parseFloat(nodeobj.getAttribute("ry"));

	var child = nodeobj.firstChild;
	for(var i=0;i<nodeobj.childNodes.length;i++)
	{
		if(child.nodeName == "script")
		{
            if(current_browser == "ie")
            {
                CreateFunction(child.text,this);
            }
            else
            {
                CreateFunction(child.textContent,this);
            }
		}
		if(child.nextSibling)
		{
			child = child.nextSibling;
		}
		else
		{
			break;
		}
	}
}
////////////////////////////////////////////////////////////////////////////////////////
//polygon 객체 생성
function CreatePolygonObj(nodeobj)
{
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = nodeobj.getAttribute("id");
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//gbase
    this.visibility = nodeobj.getAttribute("visibility");
	this.stroke = nodeobj.getAttribute("stroke");
	this.stroke_opacity = parseFloat(nodeobj.getAttribute("stroke-opacity"));
	this.stroke_width = parseFloat(nodeobj.getAttribute("stroke-width"));
    this.stroke_dasharray = nodeobj.getAttribute("stroke-dasharray");
    this.stroke_linecap = nodeobj.getAttribute("stroke-linecap");
    this.stroke_linejoin = nodeobj.getAttribute("stroke-linejoin");
	this.x = parseFloat(nodeobj.getAttribute("x"));
	this.y = parseFloat(nodeobj.getAttribute("y"));
	this.width = parseFloat(nodeobj.getAttribute("width"));
	this.height = parseFloat(nodeobj.getAttribute("height"));
	this.style = nodeobj.getAttribute("style");
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//tranform
	this.transform = nodeobj.getAttribute("transform");
    if(this.transform)
    {
        var transform_split = this.transform.split("(");
        this.translate_x = parseFloat(Number(transform_split[1].substring(0,transform_split[1].indexOf(","))));
        this.translate_y = parseFloat(Number(transform_split[1].substring(transform_split[1].indexOf(",")+1,transform_split[1].indexOf(")"))));
        this.rotate = parseFloat(Number(transform_split[2].substring(0,transform_split[2].indexOf(")"))));
        this.scale_x = parseFloat(Number(transform_split[3].substring(0,transform_split[3].indexOf(","))));
        this.scale_y = parseFloat(Number(transform_split[3].substring(transform_split[3].indexOf(",")+1,transform_split[3].indexOf(")"))));
    }
    else
    {
        this.translate_x = 0;
        this.translate_y = 0;
        this.rotate = 0;
        this.scale_x = 1;
        this.scale_y = 1;
    }
    this.center_x = nodeobj.getAttribute("pg-xcenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-xcenter")) : 0;
    this.center_y = nodeobj.getAttribute("pg-ycenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-ycenter")) : 0;
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//polygon property
    if(nodeobj.nodeName == "polyline")
    {
        this.fill = nodeobj.getAttribute("stroke");
        this.fill_opacity = parseFloat(nodeobj.getAttribute("stroke-opacity"));
        this.begin_arrow_type=nodeobj.getAttribute("pg-begin-arrow-type");
        this.begin_arrow_size=parseFloat(nodeobj.getAttribute("pg-begin-arrow-size"));
        this.begin_arrow_span=nodeobj.getAttribute("pg-begin-arrow-span");
        this.end_arrow_type=nodeobj.getAttribute("pg-end-arrow-type");
        this.end_arrow_size=parseFloat(nodeobj.getAttribute("pg-end-arrow-size"));
        this.end_arrow_span=nodeobj.getAttribute("pg-end-arrow-span");
    }
    else
    {
        this.fill = nodeobj.getAttribute("fill");
        this.fill_opacity = parseFloat(nodeobj.getAttribute("fill-opacity"));
    }
	this.points = nodeobj.getAttribute("points");
    
	var child = nodeobj.firstChild;
	for(var i=0;i<nodeobj.childNodes.length;i++)
	{
		if(child.nodeName == "script")
		{
            if(current_browser == "ie")
            {
                CreateFunction(child.text,this);
            }
            else
            {
                CreateFunction(child.textContent,this);
            }
		}
		if(child.nextSibling)
		{
			child = child.nextSibling;
		}
		else
		{
			break;
		}
	}
}
////////////////////////////////////////////////////////////////////////////////////////
//ellipse 객체 생성
function CreateEllipseObj(nodeobj)
{
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = nodeobj.getAttribute("id");
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//gbase
    this.visibility = nodeobj.getAttribute("visibility");
	this.stroke = nodeobj.getAttribute("stroke");
	this.stroke_opacity = parseFloat(nodeobj.getAttribute("stroke-opacity"));
	this.stroke_width = parseFloat(nodeobj.getAttribute("stroke-width"));
    this.stroke_dasharray = nodeobj.getAttribute("stroke-dasharray");
    this.stroke_linecap = nodeobj.getAttribute("stroke-linecap");
    this.stroke_linejoin = nodeobj.getAttribute("stroke-linejoin");
	this.x = parseFloat(nodeobj.getAttribute("x"));
	this.y = parseFloat(nodeobj.getAttribute("y"));
	this.width = parseFloat(nodeobj.getAttribute("width"));
	this.height = parseFloat(nodeobj.getAttribute("height"));
	this.style = nodeobj.getAttribute("style");
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//tranform
	this.transform = nodeobj.getAttribute("transform");
    if(this.transform)
    {
        var transform_split = this.transform.split("(");
        this.translate_x = parseFloat(Number(transform_split[1].substring(0,transform_split[1].indexOf(","))));
        this.translate_y = parseFloat(Number(transform_split[1].substring(transform_split[1].indexOf(",")+1,transform_split[1].indexOf(")"))));
        this.rotate = parseFloat(Number(transform_split[2].substring(0,transform_split[2].indexOf(")"))));
        this.scale_x = parseFloat(Number(transform_split[3].substring(0,transform_split[3].indexOf(","))));
        this.scale_y = parseFloat(Number(transform_split[3].substring(transform_split[3].indexOf(",")+1,transform_split[3].indexOf(")"))));
    }
    else
    {
        this.translate_x = 0;
        this.translate_y = 0;
        this.rotate = 0;
        this.scale_x = 1;
        this.scale_y = 1;
    }
    this.center_x = nodeobj.getAttribute("pg-xcenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-xcenter")) : 0;
    this.center_y = nodeobj.getAttribute("pg-ycenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-ycenter")) : 0;
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//ellipse property
	this.fill = nodeobj.getAttribute("fill");
	this.fill_opacity = parseFloat(nodeobj.getAttribute("fill-opacity"));
	this.cx = parseFloat(nodeobj.getAttribute("cx"));
	this.cy = parseFloat(nodeobj.getAttribute("cy"));
	this.rx = parseFloat(nodeobj.getAttribute("rx"));
	this.ry = parseFloat(nodeobj.getAttribute("ry"));

	var child = nodeobj.firstChild;
	for(var i=0;i<nodeobj.childNodes.length;i++)
	{
		if(child.nodeName == "script")
		{
            if(current_browser == "ie")
            {
                CreateFunction(child.text,this);
            }
            else
            {
                CreateFunction(child.textContent,this);
            }
		}
		if(child.nextSibling)
		{
			child = child.nextSibling;
		}
		else
		{
			break;
		}
	}
}
////////////////////////////////////////////////////////////////////////////////////////
//circle 객체 생성
function CreateCircleObj(nodeobj)
{
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = nodeobj.getAttribute("id");
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//gbase
    this.visibility = nodeobj.getAttribute("visibility");
	this.stroke = nodeobj.getAttribute("stroke");
	this.stroke_opacity = parseFloat(nodeobj.getAttribute("stroke-opacity"));
	this.stroke_width = parseFloat(nodeobj.getAttribute("stroke-width"));
    this.stroke_dasharray = nodeobj.getAttribute("stroke-dasharray");
    this.stroke_linecap = nodeobj.getAttribute("stroke-linecap");
    this.stroke_linejoin = nodeobj.getAttribute("stroke-linejoin");
	this.x = parseFloat(nodeobj.getAttribute("x"));
	this.y = parseFloat(nodeobj.getAttribute("y"));
	this.width = parseFloat(nodeobj.getAttribute("width"));
	this.height = parseFloat(nodeobj.getAttribute("height"));
	this.style = nodeobj.getAttribute("style");
    ////////////////////////////////////////////////////////////////////////////////////////////////////
	//tranform
	this.transform = nodeobj.getAttribute("transform");
    if(this.transform)
    {
        var transform_split = this.transform.split("(");
        this.translate_x = parseFloat(Number(transform_split[1].substring(0,transform_split[1].indexOf(","))));
        this.translate_y = parseFloat(Number(transform_split[1].substring(transform_split[1].indexOf(",")+1,transform_split[1].indexOf(")"))));
        this.rotate = parseFloat(Number(transform_split[2].substring(0,transform_split[2].indexOf(")"))));
        this.scale_x = parseFloat(Number(transform_split[3].substring(0,transform_split[3].indexOf(","))));
        this.scale_y = parseFloat(Number(transform_split[3].substring(transform_split[3].indexOf(",")+1,transform_split[3].indexOf(")"))));
    }
    else
    {
        this.translate_x = 0;
        this.translate_y = 0;
        this.rotate = 0;
        this.scale_x = 1;
        this.scale_y = 1;
    }
    this.center_x = nodeobj.getAttribute("pg-xcenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-xcenter")) : 0;
    this.center_y = nodeobj.getAttribute("pg-ycenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-ycenter")) : 0;
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//circle property
	this.fill = nodeobj.getAttribute("fill");
	this.fill_opacity = parseFloat(nodeobj.getAttribute("fill-opacity"));
	this.cx = parseFloat(nodeobj.getAttribute("cx"));
	this.cy = parseFloat(nodeobj.getAttribute("cy"));
	this.r = parseFloat(nodeobj.getAttribute("r"));

	var child = nodeobj.firstChild;
	for(var i=0;i<nodeobj.childNodes.length;i++)
	{
		if(child.nodeName == "script")
		{
            if(current_browser == "ie")
            {
                CreateFunction(child.text,this);
            }
            else
            {
                CreateFunction(child.textContent,this);
            }
		}
		if(child.nextSibling)
		{
			child = child.nextSibling;
		}
		else
		{
			break;
		}
	}
}
////////////////////////////////////////////////////////////////////////////////////////
//path 객체 생성
function compressSpaces(s) 
{ 
    return s.replace(/[\s\r\t\n]+/gm,' '); 
}
function trim(s) 
{
    return s.replace(/^\s+|\s+$/g, '');
}
function CreatePathObj(nodeobj)
{
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = nodeobj.getAttribute("id");
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//gbase
    this.visibility = nodeobj.getAttribute("visibility");
	this.stroke = nodeobj.getAttribute("stroke");
	this.stroke_opacity = parseFloat(nodeobj.getAttribute("stroke-opacity"));
	this.stroke_width = parseFloat(nodeobj.getAttribute("stroke-width"));
    this.stroke_dasharray = nodeobj.getAttribute("stroke-dasharray");
    this.stroke_linecap = nodeobj.getAttribute("stroke-linecap");
    this.stroke_linejoin = nodeobj.getAttribute("stroke-linejoin");
	this.x = parseFloat(nodeobj.getAttribute("x"));
	this.y = parseFloat(nodeobj.getAttribute("y"));
	this.width = parseFloat(nodeobj.getAttribute("width"));
	this.height = parseFloat(nodeobj.getAttribute("height"));
	this.style = nodeobj.getAttribute("style");
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//tranform
	this.transform = nodeobj.getAttribute("transform");
    if(this.transform)
    {
        var transform_split = this.transform.split("(");
        this.translate_x = parseFloat(Number(transform_split[1].substring(0,transform_split[1].indexOf(","))));
        this.translate_y = parseFloat(Number(transform_split[1].substring(transform_split[1].indexOf(",")+1,transform_split[1].indexOf(")"))));
        this.rotate = parseFloat(Number(transform_split[2].substring(0,transform_split[2].indexOf(")"))));
        this.scale_x = parseFloat(Number(transform_split[3].substring(0,transform_split[3].indexOf(","))));
        this.scale_y = parseFloat(Number(transform_split[3].substring(transform_split[3].indexOf(",")+1,transform_split[3].indexOf(")"))));
    }
    else
    {
        this.translate_x = 0;
        this.translate_y = 0;
        this.rotate = 0;
        this.scale_x = 1;
        this.scale_y = 1;
    }
    this.center_x = nodeobj.getAttribute("pg-xcenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-xcenter")) : 0;
    this.center_y = nodeobj.getAttribute("pg-ycenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-ycenter")) : 0;
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//path property
	this.fill = nodeobj.getAttribute("fill");
	this.fill_opacity = parseFloat(nodeobj.getAttribute("fill-opacity"));
    this.data_type = nodeobj.getAttribute("data-type");
    //Symbol Donut Frame
    this.d = nodeobj.getAttribute("d");
    this.mask = "";
	this.d_array = [];
	this.d_array = this.d.split(" ");
 /*   
    var z_check = 0;
    var strTemp = "";
    for(var i = 0; i <this.d_array.length;i++)
    {
        if(this.data_type == L"Symbol")
        {
            if(z_check < 2)
            {
                strTemp = strTemp + " " + d_array[i];
            }
            else
            {
                strTemp = strTemp + " " + d_array[i];
            }
            if(d_array[i] == "z" || d_array[i] == "Z")
            {
                z_check++;
                if(z_check == 2)
                {
                    this.d = strTemp;
                    strTemp = "";
                }
                else if(z_check > 2)
                {
                    this.mask = strTemp;
                    strTemp = "";
                }
            }
        }
        else if(this.data_type == L"Donut" || this.data_type == L"Frame")
        {
            if(z_check < 1)
            {
                strTemp = strTemp + " " + d_array[i];
            }
            else
            {
                strTemp = strTemp + " " + d_array[i];
            }
            if(d_array[i] == "z" || d_array[i] == "Z")
            {
                z_check++;
                if(z_check == 1)
                {
                    this.d = strTemp;
                    strTemp = "";
                }
                else if(z_check > 1)
                {
                    this.mask = strTemp;
                    strTemp = "";
                }
            }
        }
    }
*/        
	this.pathLength = this.d_array.length;
    
    this.d = this.d.replace(/,/gm,' '); // get rid of all commas
    this.d = this.d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2'); // separate commands from commands
    this.d = this.d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2'); // separate commands from commands
    this.d = this.d.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm,'$1 $2'); // separate commands from points
    this.d = this.d.replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2'); // separate commands from points
    this.d = this.d.replace(/([0-9])([+\-])/gm,'$1 $2'); // separate digits when no comma
    this.d = this.d.replace(/(\.[0-9]*)(\.)/gm,'$1 $2'); // separate digits when no comma
    this.d = this.d.replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/gm,'$1 $3 $4 '); // shorthand elliptical arc path syntax
    this.d = this.d.replace(/[\s\r\t\n]+/gm,' '); // compress multiple spaces
    this.d = this.d.replace(/^\s+|\s+$/g, '');
    
	var child = nodeobj.firstChild;
	for(var i=0;i<nodeobj.childNodes.length;i++)
	{
		if(child.nodeName == "script")
		{
            if(current_browser == "ie")
            {
                CreateFunction(child.text,this);
            }
            else
            {
                CreateFunction(child.textContent,this);
            }
		}
		if(child.nextSibling)
		{
			child = child.nextSibling;
		}
		else
		{
			break;
		}
	}
}
////////////////////////////////////////////////////////////////////////////////////////
//text 객체 생성
function CreateTextObj(nodeobj)
{
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = nodeobj.getAttribute("id");
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//gbase
    this.visibility = nodeobj.getAttribute("visibility");
	this.stroke = nodeobj.getAttribute("stroke");
	this.stroke_opacity = parseFloat(nodeobj.getAttribute("stroke-opacity"));
	this.stroke_width = parseFloat(nodeobj.getAttribute("stroke-width"));
    this.stroke_dasharray = nodeobj.getAttribute("stroke-dasharray");
    this.stroke_linecap = nodeobj.getAttribute("stroke-linecap");
    this.stroke_linejoin = nodeobj.getAttribute("stroke-linejoin");
	this.x = parseFloat(nodeobj.getAttribute("x"));
	this.y = parseFloat(nodeobj.getAttribute("y"));
	this.width = parseFloat(nodeobj.getAttribute("width"));
	this.height = parseFloat(nodeobj.getAttribute("height"));
	this.style = nodeobj.getAttribute("style");
    ////////////////////////////////////////////////////////////////////////////////////////////////////
	//tranform
	this.transform = nodeobj.getAttribute("transform");
    if(this.transform)
    {
        var transform_split = this.transform.split("(");
        this.translate_x = parseFloat(Number(transform_split[1].substring(0,transform_split[1].indexOf(","))));
        this.translate_y = parseFloat(Number(transform_split[1].substring(transform_split[1].indexOf(",")+1,transform_split[1].indexOf(")"))));
        this.rotate = parseFloat(Number(transform_split[2].substring(0,transform_split[2].indexOf(")"))));
        this.scale_x = parseFloat(Number(transform_split[3].substring(0,transform_split[3].indexOf(","))));
        this.scale_y = parseFloat(Number(transform_split[3].substring(transform_split[3].indexOf(",")+1,transform_split[3].indexOf(")"))));
    }
    else
    {
        this.translate_x = 0;
        this.translate_y = 0;
        this.rotate = 0;
        this.scale_x = 1;
        this.scale_y = 1;
    }
    this.center_x = nodeobj.getAttribute("pg-xcenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-xcenter")) : 0;
    this.center_y = nodeobj.getAttribute("pg-ycenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-ycenter")) : 0;
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//text property
    this.font_family = nodeobj.getAttribute("font-family");
	this.font_size = parseFloat(nodeobj.getAttribute("font-size"));
	this.font_style = nodeobj.getAttribute("font-style");
	this.text_anchor = nodeobj.getAttribute("text-anchor");
	this.baseline_shift = parseFloat(nodeobj.getAttribute("baseline-shift"));
    this.font_weight = nodeobj.getAttribute("font-weight");
        
	this.dx = parseFloat(nodeobj.getAttribute("dx"));
	this.dy = parseFloat(nodeobj.getAttribute("dy"));
    
    var strText="";
    for(var i = 0;i<nodeobj.childNodes.length;i++)
    {
        if(nodeobj.childNodes[i].nodeName == "#text")
        {
            strText = strText + nodeobj.childNodes[i].nodeValue.trim();
        }
    }
	
	this.textLineCount =  parseInt(nodeobj.getAttribute("pg-line-count"));
	this.textoneline_height =  parseFloat(nodeobj.getAttribute("pg-oneline-height"));
	this.baseline_height =  parseFloat(nodeobj.getAttribute("baseline-height"));

	this.textContent = strText;
	this.textLength = this.textContent.length;
	this.lengthAdjust = nodeobj.getAttribute("lengthAdjust");

	var child = nodeobj.firstChild;
	for(var i=0;i<nodeobj.childNodes.length;i++)
	{
		if(child.nodeName == "script")
		{
            if(current_browser == "ie")
            {
                CreateFunction(child.text,this);
            }
            else
            {
                CreateFunction(child.textContent,this);
            }
		}
		if(child.nextSibling)
		{
			child = child.nextSibling;
		}
		else
		{
			break;
		}
	}
}
////////////////////////////////////////////////////////////////////////////////////////
//image 객체 생성
function CreateImageObj(nodeobj)
{
    //base
    this.nodename = nodeobj.nodeName;
    this.xmlns = nodeobj.getAttribute("xmlns");
    this.xlink = nodeobj.getAttribute("xmlns:xlink");
    this.id = nodeobj.getAttribute("id");
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
    this.parentNode;
    this.ownnode = nodeobj.cloneNode(false);
    this.childNodes = [];

    this.appendChild = function(pushobj){
        this.childNodes.push(pushobj);
        sibling_update(this);
    }
    this.removeChild = function(childid){
        for(var i =0;i<childNodes.length;i++)
        {
            if(childNodes[i].id == childid)
            {
                this.childNodes.splice(i,1);
                break;
            }
        }
        sibling_update(this);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //gbase
    this.visibility = nodeobj.getAttribute("visibility");
    this.stroke = nodeobj.getAttribute("stroke");
    this.stroke_opacity = parseFloat(nodeobj.getAttribute("stroke-opacity"));
    this.stroke_width = parseFloat(nodeobj.getAttribute("stroke-width"));
    this.stroke_dasharray = nodeobj.getAttribute("stroke-dasharray");
    this.stroke_linecap = nodeobj.getAttribute("stroke-linecap");
    this.stroke_linejoin = nodeobj.getAttribute("stroke-linejoin");
    this.x = parseFloat(nodeobj.getAttribute("x"));
    this.y = parseFloat(nodeobj.getAttribute("y"));
    this.width = parseFloat(nodeobj.getAttribute("width"));
    this.height = parseFloat(nodeobj.getAttribute("height"));
    this.style = nodeobj.getAttribute("style");
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //tranform
    this.transform = nodeobj.getAttribute("transform");
    if(this.transform)
    {
        var transform_split = this.transform.split("(");
        this.translate_x = parseFloat(Number(transform_split[1].substring(0,transform_split[1].indexOf(","))));
        this.translate_y = parseFloat(Number(transform_split[1].substring(transform_split[1].indexOf(",")+1,transform_split[1].indexOf(")"))));
        this.rotate = parseFloat(Number(transform_split[2].substring(0,transform_split[2].indexOf(")"))));
        this.scale_x = parseFloat(Number(transform_split[3].substring(0,transform_split[3].indexOf(","))));
        this.scale_y = parseFloat(Number(transform_split[3].substring(transform_split[3].indexOf(",")+1,transform_split[3].indexOf(")"))));
    }
    else
    {
        this.translate_x = 0;
        this.translate_y = 0;
        this.rotate = 0;
        this.scale_x = 1;
        this.scale_y = 1;
    }
    this.center_x = nodeobj.getAttribute("pg-xcenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-xcenter")) : 0;
    this.center_y = nodeobj.getAttribute("pg-ycenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-ycenter")) : 0;
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //image property
    this.xlink_href = nodeobj.getAttribute("xlink:href");
    this.b_imageload = false;
    this.imageObj=CreateImageSrc(this.id,this.xlink_href,this.width,this.height);

    var child = nodeobj.firstChild;
    for(var i=0;i<nodeobj.childNodes.length;i++)
    {
        if(child.nodeName == "script")
        {
            if(current_browser == "ie")
            {
                CreateFunction(child.text,this);
            }
            else
            {
                CreateFunction(child.textContent,this);
            }
        }
        if(child.nextSibling)
        {
            child = child.nextSibling;
        }
        else
        {
            break;
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////////
//Use 객체 생성
function CreateUseObj(nodeobj)
{
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = nodeobj.getAttribute("id");
    this.childNodes = [];
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
    
    this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
	//pin객체 저장용
    this.pin_list = [];    
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//gbase
    this.visibility = nodeobj.getAttribute("visibility");
	this.stroke = nodeobj.getAttribute("stroke");
	this.stroke_opacity = parseFloat(nodeobj.getAttribute("stroke-opacity"));
	this.stroke_width = parseFloat(nodeobj.getAttribute("stroke-width"));
    this.stroke_dasharray = nodeobj.getAttribute("stroke-dasharray");
    this.stroke_linecap = nodeobj.getAttribute("stroke-linecap");
    this.stroke_linejoin = nodeobj.getAttribute("stroke-linejoin");
	this.x = parseFloat(nodeobj.getAttribute("x"));
	this.y = parseFloat(nodeobj.getAttribute("y"));
	this.width = parseFloat(nodeobj.getAttribute("width"));
	this.height = parseFloat(nodeobj.getAttribute("height"));
	this.style = nodeobj.getAttribute("style");
    ////////////////////////////////////////////////////////////////////////////////////////////////////
	//tranform
	this.transform = nodeobj.getAttribute("transform");
	if(this.transform)
	{
        var transform_split = this.transform.split("(");
		this.translate_x = parseFloat(Number(transform_split[1].substring(0,transform_split[1].indexOf(","))));
		this.translate_y = parseFloat(Number(transform_split[1].substring(transform_split[1].indexOf(",")+1,transform_split[1].indexOf(")"))));
		this.rotate = parseFloat(Number(transform_split[2].substring(0,transform_split[2].indexOf(")"))));
		this.scale_x = parseFloat(Number(transform_split[3].substring(0,transform_split[3].indexOf(","))));
		this.scale_y = parseFloat(Number(transform_split[3].substring(transform_split[3].indexOf(",")+1,transform_split[3].indexOf(")"))));
		this.center_x =parseFloat(Number(nodeobj.getAttribute("pg-xcenter")));
		this.center_y =parseFloat(Number(nodeobj.getAttribute("pg-ycenter")));
	}
	else
	{
		this.translate_x = 0;
		this.translate_y = 0;
		this.rotate = 0;
		this.scale_x = 1;
		this.scale_y = 1;
		this.center_x = 0;
		this.center_y = 0;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//Use property
	this.type = nodeobj.getAttribute("type");

	////////////////////////////////////////////////////////////////////////////////////////////////////
	//script & childnode
	function MakeUseStruct(parentObj,parentnode)
	{
		var childnode = parentnode.firstChild;
		for(var i=0;i<parentnode.childNodes.length;i++)
		{
			if(childnode.nodeName == "script")
			{
				CreateFunction(childnode.textContent,parentObj);
			}
			else
			{
				if(childnode.nodeName == "line")
				{
					parentObj[childnode.id] = new CreateLineObj(childnode);
                    parentObj[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(parentObj[childnode.id]);
				}
                else if(childnode.nodeName == "rect")
                {
                    parentObj[childnode.id] = new CreateRectObj(childnode);
                    parentObj[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(parentObj[childnode.id]);
                }
                else if(childnode.nodeName == "polygon" || childnode.nodeName == "polyline")
                {
                    parentObj[childnode.id] = new CreatePolygonObj(childnode);
                    parentObj[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(parentObj[childnode.id]);
                }
                else if(childnode.nodeName == "ellipse")
                {
                    parentObj[childnode.id] = new CreateEllipseObj(childnode);
                    parentObj[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(parentObj[childnode.id]);
                }
                else if(childnode.nodeName == "circle")
                {
                    parentObj[childnode.id] = new CreateCircleObj(childnode);
                    parentObj[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(parentObj[childnode.id]);
                }
                else if(childnode.nodeName == "text")
                {
                    parentObj[childnode.id] = new CreateTextObj(childnode);
                    parentObj[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(parentObj[childnode.id]);
                }
                else if(childnode.nodeName == "path")
                {
                    parentObj[childnode.id] = new CreatePathObj(childnode);
                    parentObj[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(parentObj[childnode.id]);
                }
                else if(childnode.nodeName == "g")
                {
                    parentObj[childnode.id] = new CreateGObj(childnode);
                    parentObj[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(parentObj[childnode.id]);
                }
                else if(childnode.nodeName == "use")
                {
                    parentObj[childnode.id] = new CreateUseObj(childnode);
                    parentObj[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(parentObj[childnode.id]);
                }
                else if(childnode.nodeName == "image")
                {
                    parentObj[childnode.id] = new CreateImageObj(childnode);
                    parentObj[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(parentObj[childnode.id]);
                }
                else if(childnode.nodeName == "pg-trend-contour")
                {
                    parentObj[childnode.id] = new CreateContourObj(childnode);
                    parentObj[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(parentObj[childnode.id]);
                    window[root_obj_id].trend_list.push(parentObj[childnode.id]);
                }
                else if(childnode.nodeName == "pg-trend")
                {
                    parentObj[childnode.id] = new CreateTrendObj(childnode);
                    parentObj[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(parentObj[childnode.id]);
                    window[root_obj_id].trend_list.push(parentObj[childnode.id]);
                }
                else if(childnode.nodeName == "pg-pin")
                {
                    parentObj[childnode.getAttribute("name")] = childnode.getAttribute("default-value");
                    parentObj.pin_list.push(new CreatePinObj(childnode));
                }
                else if(childnode.nodeName == "pg-attribute")
                {
                    if(childnode.getAttribute("type") == "double" || childnode.getAttribute("type") == "int" || childnode.getAttribute("type") == "float")
                    {
                        parentObj[childnode.getAttribute("variable")] = Number(childnode.getAttribute("initial"));
                    }
                    else if(childnode.getAttribute("type") == "bool")
                    {
                        if(childnode.getAttribute("initial") == "TRUE")
                        {
                            parentObj[childnode.getAttribute("variable")] = Boolean(true);
                        }
                        else
                        {
                            parentObj[childnode.getAttribute("variable")] = Boolean(false);
                        }
                    }
                    else
                    {
                        parentObj[childnode.getAttribute("variable")] = childnode.getAttribute("initial");
                    }
                }
                else if(childnode.nodeName == "pg-set-attribute")   // pg-attribute의 경우 타입별 변수형으로 맞춰서 문자열을 변경시킨다.
                {
                    parentObj.appendChild(new CreateSetAttributeObj(childnode));
                }

                if(childnode.childNodes.length && childnode.getAttribute("type") != "hmi")
                {
                    if(childnode.nodeName == "pg-pin")
                    {
                        MakeUseStruct(parentObj,childnode);
                    }
                    else
                    {
                        MakeUseStruct(parentObj[childnode.id],childnode);
                    }
                }
			}
			if(childnode.nextSibling)
			{
				childnode = childnode.nextSibling;
			}
			else
			{
                sibling_update(parentObj);
				break;
			}
		}
	}
	MakeUseStruct(this,nodeobj);
}
function CreateContourObj(nodeobj)
{
    //base
    this.nodename = nodeobj.nodeName;
    this.xmlns = nodeobj.getAttribute("xmlns");
    this.xlink = nodeobj.getAttribute("xmlns:xlink");
    this.id = nodeobj.getAttribute("id");
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
    this.parentNode;
    this.ownnode = nodeobj.cloneNode(false);
    this.childNodes = [];

    this.appendChild = function(pushobj){
        this.childNodes.push(pushobj);
        sibling_update(this);
    }
    this.removeChild = function(childid){
        for(var i =0;i<childNodes.length;i++)
        {
            if(childNodes[i].id == childid)
            {
                this.childNodes.splice(i,1);
                break;
            }
        }
        sibling_update(this);
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //gbase
    this.visibility = nodeobj.getAttribute("visibility");
    this.stroke = nodeobj.getAttribute("stroke");
    this.stroke_opacity = parseFloat(nodeobj.getAttribute("stroke-opacity"));
    this.stroke_width = parseFloat(nodeobj.getAttribute("stroke-width"));
    this.stroke_dasharray = nodeobj.getAttribute("stroke-dasharray");
    this.stroke_linecap = nodeobj.getAttribute("stroke-linecap");
    this.stroke_linejoin = nodeobj.getAttribute("stroke-linejoin");
    this.x = parseFloat(nodeobj.getAttribute("x"));
    this.y = parseFloat(nodeobj.getAttribute("y"));
    this.width = parseFloat(nodeobj.getAttribute("width"));
    this.height = parseFloat(nodeobj.getAttribute("height"));
    this.style = nodeobj.getAttribute("style");
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //tranform
    this.transform = nodeobj.getAttribute("transform");
    if(this.transform)
    {
        var transform_split = this.transform.split("(");
        this.translate_x = parseFloat(Number(transform_split[1].substring(0,transform_split[1].indexOf(","))));
        this.translate_y = parseFloat(Number(transform_split[1].substring(transform_split[1].indexOf(",")+1,transform_split[1].indexOf(")"))));
        this.rotate = parseFloat(Number(transform_split[2].substring(0,transform_split[2].indexOf(")"))));
        this.scale_x = parseFloat(Number(transform_split[3].substring(0,transform_split[3].indexOf(","))));
        this.scale_y = parseFloat(Number(transform_split[3].substring(transform_split[3].indexOf(",")+1,transform_split[3].indexOf(")"))));
    }
    else
    {
        this.translate_x = 0;
        this.translate_y = 0;
        this.rotate = 0;
        this.scale_x = 1;
        this.scale_y = 1;
    }
    this.center_x = nodeobj.getAttribute("pg-xcenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-xcenter")) : 0;
    this.center_y = nodeobj.getAttribute("pg-ycenter") != undefined ? parseFloat(nodeobj.getAttribute("pg-ycenter")) : 0;
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //contour property
    this.fill = nodeobj.getAttribute("fill") != undefined ? nodeobj.getAttribute("fill") : "rgb(200,200,200)";
	this.fill_opacity = nodeobj.getAttribute("fill-opacity") != undefined ? parseFloat(nodeobj.getAttribute("fill-opacity")) : 1.00;
	this.grid_stroke = nodeobj.getAttribute("grid-stroke") != undefined ? nodeobj.getAttribute("grid-stroke"): "rgb(0,0,0)";
    this.grid_stroke_width = nodeobj.getAttribute("grid-stroke-width") != undefined ? parseFloat(nodeobj.getAttribute("grid-stroke-width")) : 1.0;
    this.grid_stroke_opacity = nodeobj.getAttribute("grid-stroke-opacity") != undefined ? parseFloat(nodeobj.getAttribute("grid-stroke-opacity")) : 1.0;
    
    this.contourType = nodeobj.getAttribute("contourType") != undefined ? nodeobj.getAttribute("contourType") : "contour"; // contour, contour rect, contour circle
    var subdivision_split = nodeobj.getAttribute("subdivision") != undefined ? nodeobj.getAttribute("subdivision").split(",") : [2, 2];
    this.subdivision_x = parseFloat(subdivision_split[0]);
    this.subdivision_y = parseFloat(subdivision_split[1]);
    this.label_num = nodeobj.getAttribute("label-num") != undefined ? parseFloat(nodeobj.getAttribute("label-num")) : 0;
    
    this.minElevation = parseFloat(nodeobj.getAttribute("minElevation"));
    this.maxElevation = parseFloat(nodeobj.getAttribute("maxElevation"));
    this.colorElevation = nodeobj.getAttribute("colorElevation");
    
    this.grid_visible = nodeobj.getAttribute("grid_visible") != undefined ? nodeobj.getAttribute("grid_visible") : "visible";
    this.outline_visible = nodeobj.getAttribute("outline_visible") != undefined ? nodeobj.getAttribute("outline_visible") : "visible";
    this.xaxis_visible = nodeobj.getAttribute("xaxis_visible") != undefined ? nodeobj.getAttribute("xaxis_visible") : "visible";
    this.yaxis_visible = nodeobj.getAttribute("yaxis_visible") != undefined ? nodeobj.getAttribute("yaxis_visible") : "visible";
    this.value_visible = nodeobj.getAttribute("value_visible") != undefined ? nodeobj.getAttribute("value_visible") : "visible";
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // contour font property
    this.xaxis_font_color = nodeobj.getAttribute("xaxis-font-color") != undefined ? nodeobj.getAttribute("xaxis-font-color") : "rgb(0,0,0)";
    this.xaxis_font_family = nodeobj.getAttribute("xaxis-font-color") != undefined ? nodeobj.getAttribute("xaxis-font-color") : "rgb(0,0,0)";
    this.xaxis_font_size = nodeobj.getAttribute("xaxis-font-size") != undefined ? parseFloat(nodeobj.getAttribute("xaxis-font=size")) : 10.00;
    this.yaxis_font_family = nodeobj.getAttribute("yaxis-font-family") != undefined ? nodeobj.getAttribute("yaxis-font-family") : "arial";
    this.yaxis_font_color = nodeobj.getAttribute("yaxis-font-color") != undefined ? nodeobj.getAttribute("yaxis-font-color") : "rgb(0,0,0)";
    this.yaxis_font_size = nodeobj.getAttribute("yaxis-font-size") != undefined ? parseFloat(nodeobj.getAttribute("yaxis-font-size")) : 10.00;
    this.value_font_family = nodeobj.getAttribute("value-font-family") != undefined ? nodeobj.getAttribute("value-font-family") : "arial";
    this.value_font_color = nodeobj.getAttribute("value-font-color") != undefined ? nodeobj.getAttribute("value-font-color"): "rgb(0,0,0)";
    this.value_font_size = nodeobj.getAttribute("value-font-size") != undefined ? nodeobj.getAttribute("value-font-size") : 10.00;
    this.value_format = nodeobj.getAttribute("value-format") != undefined ? nodeobj.getAttribute("value-format") : "number"; // number, engineering unit
    this.value_decimal_point = nodeobj.getAttribute("value-decimal-point") != undefined ? parseFloat(nodeobj.getAttribute("value-decimal-point")) : 0;

	this.data = new Array();
    init_data(this);
    
    function init_data(obj)
    {
        for(var i = 0; i < obj.subdivision_x; i++)
        {
            obj.data.push(new Array());
			for(var j = 0; j < obj.subdivision_y; j++)
			{
				obj.data[i].push(obj.minElevation);
			}
        }
    }
	
	this.label = new Array();
    init_label(this);
    
    function init_label(obj)
    {
        for(var i = 0; i < obj.subdivision_x; i++)
        {
			obj.label.push(new Array());
			for(var j = 0; j < obj.subdivision_y; j++)
			{
				obj.label[i].push(new Array());
				for(var k = 0; k < obj.label_num; k++)
				{
					obj.label[i][j].push("");
				}
            }
        }
    }
	
    var child = nodeobj.firstChild;
    for(var i=0;i<nodeobj.childNodes.length;i++)
    {
        if(child.nodeName == "script")
        {
            if(current_browser == "ie")
            {
                CreateFunction(child.text,this);
            }
            else
            {
                CreateFunction(child.textContent,this);
            }
        }
        if(child.nextSibling)
        {
            child = child.nextSibling;
        }
        else
        {
            break;
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////////
//image 객체 생성
function CreatePinObj(nodeobj)
{
	//base
	this.id = nodeobj.getAttribute("id");
	this.childNodes = [];
    ////////////////////////////////////////////////////////////////////////////////////////////////////
	//image property
    this.name = nodeobj.getAttribute("name");
    this.desc = nodeobj.getAttribute("desc");
    this.pin_type = nodeobj.getAttribute("pin-type");
    this.max_value = nodeobj.getAttribute("max-value");
    this.min_value = nodeobj.getAttribute("min-value");
    this.default_value = nodeobj.getAttribute("default-value");
    this.color = nodeobj.getAttribute("color");
    this.var_type = nodeobj.getAttribute("var-type");
    this.dim1 = nodeobj.getAttribute("dim1");
	this.dim2 = nodeobj.getAttribute("dim2");
    this.unit = nodeobj.getAttribute("unit");
}
function CreateSetAttributeObj(nodeobj)
{
    this.nodename = nodeobj.nodeName;
    this.id = nodeobj.getAttribute("id");
	this.variable = nodeobj.getAttribute("variable");
	this.value = nodeobj.getAttribute("value");
}
function CreateLineGridentObj(nodeobj)
{
	this.id =nodeobj.getAttribute("id");
	this.type = "line";
	this.x1 =parseFloat(nodeobj.getAttribute("x1"));
	this.y1 =parseFloat(nodeobj.getAttribute("y1"));
	this.x2 =parseFloat(nodeobj.getAttribute("x2"));
	this.y2 =parseFloat(nodeobj.getAttribute("y2"));
	
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
	
	var stops = [];
	for(var i = 0;i<nodeobj.childNodes.length;i++)
    {
         if(nodeobj.childNodes[i].nodeName == "stop")
        {
		   var stopOBJ= new CreateStopGridentObj(nodeobj.childNodes[i]);
           stops.push(stopOBJ);
        }
    }
	this.stop =stops;
	
}
function CreateRadialGridentObj(nodeobj)
{
	this.id =nodeobj.getAttribute("id");
	this.type = "radial";
	this.cx =parseFloat(nodeobj.getAttribute("cx"));
	this.cy =parseFloat(nodeobj.getAttribute("cy"));
	this.fx =parseFloat(nodeobj.getAttribute("fx"));
	this.fy =parseFloat(nodeobj.getAttribute("fy"));
	this.r =parseFloat(nodeobj.getAttribute("r"));
	
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
	
	var stops = [];
	for(var i = 0;i<nodeobj.childNodes.length;i++)
    {
        if(nodeobj.childNodes[i].nodeName == "stop")
        {
		   var stopOBJ= new CreateStopGridentObj(nodeobj.childNodes[i]);
           stops.push(stopOBJ);
        }
    }
	this.stop =stops;
}
function CreateStopGridentObj(nodeobj)
{
	this.offsets = parseFloat(nodeobj.getAttribute("offset"))*0.01;
	var style =nodeobj.getAttribute("style");
	var color = "rgba("
	var text = style;
	var jbSplit = text.split( ';' );
	text =jbSplit[0].replace("stop-color:rgb(","");
	text =text.replace(")","");
	color =color+text;
	text =jbSplit[1].replace("stop-opacity:","");
	color =color+","+text+")";
	this.stopStyle =color;	
	
}
function CreateImageSrc(id,xlink_href)
{
   
   xlink_href =xlink_href.trim();
   var newid = "img_" +id;
   if($('#'+newid).length >0)
   {
      var src =$('#'+newid)[0].src;
      if(src != xlink_href)
      {
		  $('#'+newid).remove();
         var text ="<img id=\""+ newid +"\" src=\""+xlink_href +"\" style=\"display:none\">"
		if($('#imageLists').length > 0)
		{
			$('#imageLists').append(text);
		}
      }
         
   }
   else
   {
      var text ="<img id=\""+ newid +"\" src=\""+xlink_href +"\" style=\"display:none\">"
      if($('#imageLists').length > 0)
      {
         $('#imageLists').append(text);
      }
   }      
   

   return $('#'+newid)[0];
}
////////////////////////////////////////////////////////////////////////////////////////
//구조체 생성 x3d
var x3dSceneobj;
var x3dFunction = new Object();
function makestruct_x3d(parentNode, parentObj)
{
	//documentElement는 항상 루트 노드를 나타낸다
	if(parentNode)
	{
		if(parentNode.nodeName == "Scene")
		{
			x3dSceneobj = new CreateX3DObj(parentNode);
			parentObj = x3dSceneobj;
		}

		var childnode = parentNode.firstElementChild;

		if(childnode != 0)
		{
            for (var i=0;i<parentNode.children.length;i++)
			{
                if(childnode.nodeName == "Box")
                {
                    window[parentNode.id] = new Create3DBoxObj(childnode);
                    window[parentNode.id].parentObj = parentObj;
                    parentObj.appendChild(window[parentNode.id]);
                }
                else if(childnode.nodeName == "Text")
                {
                    window[parentNode.id] = new Create3DTextObj(childnode);
                    window[parentNode.id].parentObj = parentObj;
                    parentObj.appendChild(window[parentNode.id]);
                }
                else if(childnode.nodeName == "Cone")
                {
                    window[parentNode.id] = new Create3DConeObj(childnode);
                    window[parentNode.id].parentObj = parentObj;
                    parentObj.appendChild(window[parentNode.id]);
                }
                else if(childnode.nodeName == "Cylinder")
                {
                    window[parentNode.id] = new Create3DCylinderObj(childnode);
                    window[parentNode.id].parentObj = parentObj;
                    parentObj.appendChild(window[parentNode.id]);
                }
                else if(childnode.nodeName == "Sphere")
                {
                    window[parentNode.id] = new Create3DSphereObj(childnode);
                    window[parentNode.id].parentObj = parentObj;
                    parentObj.appendChild(window[parentNode.id]);
                }
                else if(childnode.nodeName == "LineSet")
                {
                    window[parentNode.id] = new Create3DLineSetObj(childnode);
                    window[parentNode.id].parentObj = parentObj;
                    parentObj.appendChild(window[parentNode.id]);
                }
                else if(childnode.nodeName == "IndexedFaceSet")
                {
                    window[parentNode.id] = new Create3DIndexedFaceSetObj(childnode);
                    window[parentNode.id].parentObj = parentObj;
                    parentObj.appendChild(window[parentNode.id]);
                }
                else if(childnode.nodeName == "Terrain")
                {
                    window[parentNode.id] = new Create3DTerrainObj(childnode);
                    window[parentNode.id].parentObj = parentObj;
                    parentObj.appendChild(window[parentNode.id]);
                }
                else if(childnode.nodeName == "Contour3D")
                {
                    window[parentNode.id] = new Create3DContourObj(childnode);
                    window[parentNode.id].parentObj = parentObj;
                    parentObj.appendChild(window[parentNode.id]);
                }
                else if(childnode.nodeName == "inline")
                {
                    window[parentNode.id] = new Create3DinlineObj(childnode);
                    window[parentNode.id].parentObj = parentObj;
                    parentObj.appendChild(window[parentNode.id]);
                }
                
                if(childnode.children.length != 0 && (childnode.nodeName != "Transform" || childnode.nodeName != "Shape"))
				{
					makestruct_x3d(childnode,parentObj);
				}
               
                if(childnode.nextElementSibling)
				{
					childnode = childnode.nextElementSibling;
				}
				else
				{
                    sibling_update(parentObj);
                    break;
				}
			}
		}
	}
}

function CreateX3DObj(nodeobj)
{
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = nodeobj.getAttribute("id");
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // x3d 배경정보
    var background;
    var findnode = nodeobj.firstChild;
    while(findnode)
    {
        if(findnode.nodeName == "Background")
        {
            background = findnode;
            break;
        }
		if(findnode.nextSibling)
		{
			findnode = findnode.nextSibling;
		}
		else
		{
			break;
		}
    }
    this.bind = background.getAttribute("bind");
    this.description = background.getAttribute("description");
    this.skyColor = background.getAttribute("skyColor");
    this.transparency = background.getAttribute("transparency");
    
	this.width = window.innerWidth;
    this.height = window.innerHeight;

    // scene에 있는 function을 생성하는 로직
    var child = nodeobj.firstElementChild;
    while(child)
    {
        if(child.nodeName == "script")
        {
            if(current_browser == "ie")
            {
                CreateFunction(child.text,this);
            }
            else
            {
                CreateFunction(child.textContent,this);
            }
        }
        if(child.nextElementSibling)
        {
            child = child.nextElementSibling;
        }
        else
        {
            break;
        }
    }
    
    // x3d에 있는 function을 생성하는 로직
    child = nodeobj.parentElement.firstElementChild;
    while(child)
    {
        if(child.nodeName == "script")
        {
            if(current_browser == "ie")
            {
                CreateFunction(child.text,x3dFunction);
            }
            else
            {
                CreateFunction(child.textContent,x3dFunction);
            }
        }
        if(child.nextElementSibling)
        {
            child = child.nextElementSibling;
        }
        else
        {
            break;
        }
    }
}

function Create3DBoxObj(nodeobj)
{
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // transform과 shape노드 가져오기
    var transformobj = nodeobj.parentElement.parentElement;
    var shapeobj = nodeobj.parentElement;
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = shapeobj.id;
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //transform 정보
    var receivetext;
    var splittext;
    
    receivetext = transformobj.getAttribute("center") !== null ? transformobj.getAttribute("center"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.center_x = parseFloat(splittext[0]);
        this.center_y = parseFloat(splittext[1]);
        this.center_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("translation") !== null ? transformobj.getAttribute("translation"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.translation_x = parseFloat(splittext[0]);
        this.translation_y = parseFloat(splittext[1]);
        this.translation_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("scale") !== null ? transformobj.getAttribute("scale"): "1,1,1";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.scale_x = parseFloat(splittext[0]);
        this.scale_y = parseFloat(splittext[1]);
        this.scale_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("rotation") !== null ? transformobj.getAttribute("rotation"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.rotation_x = parseFloat(splittext[0]);
        this.rotation_y = parseFloat(splittext[1]);
        this.rotation_z = parseFloat(splittext[2]);   
    }
    
    this.scaleOrientation = transformobj.getAttribute("scaleOrientation");
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Box 정보
    var materialinfo;
    var findnode = shapeobj.firstElementChild;
    while(findnode)
    {
        if(findnode.nodeName == "Appearance")
        {
            var findchildnode = findnode.firstElementChild;
            while(findchildnode)
            {
                if(findchildnode.nodeName == "Material")
                {
                    materialinfo = findchildnode;
                    break;
                }
                if(findchildnode.nextElementSibling)
                {
                    findchildnode = findchildnode.nextElementSibling;
                }
                else
                {
                    break;
                }
            }
        }
        
		if(findnode.nextElementSibling)
		{
			findnode = findnode.nextElementSibling;
		}
		else
		{
			break;
		}
    }
    this.diffuseColor = materialinfo.getAttribute("diffuseColor").split(",");
    this.emissiveColor = materialinfo.getAttribute("emissiveColor").split(",");
    this.specularColor = materialinfo.getAttribute("specularColor").split(",");
    for(var i = 0; i < 3;i++)
    {
        if(this.diffuseColor[i] != this.emissiveColor)
        {
            if(parseFloat(this.diffuseColor[i]) == 1) this.emissiveColor[i] = this.diffuseColor[i];
            else if(parseFloat(this.emissiveColor[i]) == 1) this.diffuseColor[i] = this.emissiveColor[i];
        }
    }
    this.ambientIntensity = parseFloat(materialinfo.getAttribute("ambientIntensity"));
    this.shininess = parseFloat(materialinfo.getAttribute("shininess"));
    this.transparency = parseFloat(materialinfo.getAttribute("transparency"));
    
    splittext = nodeobj.getAttribute("size").split(",");
    this.size_x = parseFloat(splittext[0]);
    this.size_y = parseFloat(splittext[1]);
    this.size_z = parseFloat(splittext[2]);
    
    var child = nodeobj.parentElement.firstElementChild;
    while(child)
    {
        if(child.nodeName == "script")
        {
            if(current_browser == "ie")
            {
                CreateFunction(child.text,this);
            }
            else
            {
                CreateFunction(child.textContent,this);
            }
        }
        if(child.nextElementSibling)
        {
            child = child.nextElementSibling;
        }
        else
        {
            break;
        }
    }
}

function Create3DTextObj(nodeobj)
{
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // transform과 shape노드 가져오기
    var transformobj = nodeobj.parentElement.parentElement;
    var shapeobj = nodeobj.parentElement;
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = shapeobj.id;
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //transform 정보
    var receivetext;
    var splittext;
    
    receivetext = transformobj.getAttribute("center") !== null ? transformobj.getAttribute("center"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.center_x = parseFloat(splittext[0]);
        this.center_y = parseFloat(splittext[1]);
        this.center_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("translation") !== null ? transformobj.getAttribute("translation"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.translation_x = parseFloat(splittext[0]);
        this.translation_y = parseFloat(splittext[1]);
        this.translation_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("scale") !== null ? transformobj.getAttribute("scale"): "1,1,1";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.scale_x = parseFloat(splittext[0]);
        this.scale_y = parseFloat(splittext[1]);
        this.scale_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("rotation") !== null ? transformobj.getAttribute("rotation"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.rotation_x = parseFloat(splittext[0]);
        this.rotation_y = parseFloat(splittext[1]);
        this.rotation_z = parseFloat(splittext[2]);   
    }
    
    this.scaleOrientation = transformobj.getAttribute("scaleOrientation");
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Box 정보
    var materialinfo;
    var findnode = shapeobj.firstElementChild;
    while(findnode)
    {
        if(findnode.nodeName == "Appearance")
        {
            var findchildnode = findnode.firstElementChild;
            while(findchildnode)
            {
                if(findchildnode.nodeName == "Material")
                {
                    materialinfo = findchildnode;
                    break;
                }
                if(findchildnode.nextElementSibling)
                {
                    findchildnode = findchildnode.nextElementSibling;
                }
                else
                {
                    break;
                }
            }
        }
        
		if(findnode.nextElementSibling)
		{
			findnode = findnode.nextElementSibling;
		}
		else
		{
			break;
		}
    }
    this.diffuseColor = materialinfo.getAttribute("diffuseColor").split(",");
    this.emissiveColor = materialinfo.getAttribute("emissiveColor").split(",");
    this.specularColor = materialinfo.getAttribute("specularColor").split(",");
    for(var i = 0; i < 3;i++)
    {
        if(this.diffuseColor[i] != this.emissiveColor)
        {
            if(parseFloat(this.diffuseColor[i]) == 1) this.emissiveColor[i] = this.diffuseColor[i];
            else if(parseFloat(this.emissiveColor[i]) == 1) this.diffuseColor[i] = this.emissiveColor[i];
        }
    }
    this.ambientIntensity = parseFloat(materialinfo.getAttribute("ambientIntensity"));
    this.shininess = parseFloat(materialinfo.getAttribute("shininess"));
    this.transparency = parseFloat(materialinfo.getAttribute("transparency"));
    
    this.string = nodeobj.getAttribute("string");
    
    var fontstylenode = nodeobj.firstElementChild;
    this.family = fontstylenode.getAttribute("family");
    this.size = parseFloat(fontstylenode.getAttribute("size"));
    this.style = fontstylenode.getAttribute("style");
    this.justify = fontstylenode.getAttribute("justify");
}

function Create3DConeObj(nodeobj)
{
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // transform과 shape노드 가져오기
    var transformobj = nodeobj.parentElement.parentElement;
    var shapeobj = nodeobj.parentElement;
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = shapeobj.id;
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //transform 정보
    var receivetext;
    var splittext;
    
    receivetext = transformobj.getAttribute("center") !== null ? transformobj.getAttribute("center"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.center_x = parseFloat(splittext[0]);
        this.center_y = parseFloat(splittext[1]);
        this.center_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("translation") !== null ? transformobj.getAttribute("translation"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.translation_x = parseFloat(splittext[0]);
        this.translation_y = parseFloat(splittext[1]);
        this.translation_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("scale") !== null ? transformobj.getAttribute("scale"): "1,1,1";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.scale_x = parseFloat(splittext[0]);
        this.scale_y = parseFloat(splittext[1]);
        this.scale_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("rotation") !== null ? transformobj.getAttribute("rotation"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.rotation_x = parseFloat(splittext[0]);
        this.rotation_y = parseFloat(splittext[1]);
        this.rotation_z = parseFloat(splittext[2]);   
    }
    
    this.scaleOrientation = transformobj.getAttribute("scaleOrientation");
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Cone 정보
    var materialinfo;
    var findnode = shapeobj.firstElementChild;
    while(findnode)
    {
        if(findnode.nodeName == "Appearance")
        {
            var findchildnode = findnode.firstElementChild;
            while(findchildnode)
            {
                if(findchildnode.nodeName == "Material")
                {
                    materialinfo = findchildnode;
                    break;
                }
                if(findchildnode.nextElementSibling)
                {
                    findchildnode = findchildnode.nextElementSibling;
                }
                else
                {
                    break;
                }
            }
        }
        
		if(findnode.nextElementSibling)
		{
			findnode = findnode.nextElementSibling;
		}
		else
		{
			break;
		}
    }
    this.diffuseColor = materialinfo.getAttribute("diffuseColor").split(",");
    this.emissiveColor = materialinfo.getAttribute("emissiveColor").split(",");
    this.specularColor = materialinfo.getAttribute("specularColor").split(",");
    for(var i = 0; i < 3;i++)
    {
        if(this.diffuseColor[i] != this.emissiveColor)
        {
            if(parseFloat(this.diffuseColor[i]) == 1) this.emissiveColor[i] = this.diffuseColor[i];
            else if(parseFloat(this.emissiveColor[i]) == 1) this.diffuseColor[i] = this.emissiveColor[i];
        }
    }
    this.ambientIntensity = parseFloat(materialinfo.getAttribute("ambientIntensity"));
    this.shininess = parseFloat(materialinfo.getAttribute("shininess"));
    this.transparency = parseFloat(materialinfo.getAttribute("transparency"));
    
    this.bottom = nodeobj.getAttribute("bottom");
    this.bottomRadius = parseFloat(nodeobj.getAttribute("bottomRadius"));
	this.height = parseFloat(nodeobj.getAttribute("height"));
    this.subdivision = parseFloat(nodeobj.getAttribute("subdivision"));
    this.top = nodeobj.getAttribute("top");
	this.topRadius = parseFloat(nodeobj.getAttribute("topRadius"));
}

function Create3DCylinderObj(nodeobj)
{
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // transform과 shape노드 가져오기
    var transformobj = nodeobj.parentElement.parentElement;
    var shapeobj = nodeobj.parentElement;
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = shapeobj.id;
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //transform 정보
    var receivetext;
    var splittext;
    
    receivetext = transformobj.getAttribute("center") !== null ? transformobj.getAttribute("center"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.center_x = parseFloat(splittext[0]);
        this.center_y = parseFloat(splittext[1]);
        this.center_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("translation") !== null ? transformobj.getAttribute("translation"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.translation_x = parseFloat(splittext[0]);
        this.translation_y = parseFloat(splittext[1]);
        this.translation_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("scale") !== null ? transformobj.getAttribute("scale"): "1,1,1";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.scale_x = parseFloat(splittext[0]);
        this.scale_y = parseFloat(splittext[1]);
        this.scale_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("rotation") !== null ? transformobj.getAttribute("rotation"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.rotation_x = parseFloat(splittext[0]);
        this.rotation_y = parseFloat(splittext[1]);
        this.rotation_z = parseFloat(splittext[2]);   
    }
    
    this.scaleOrientation = transformobj.getAttribute("scaleOrientation");
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Cylinder 정보
    var materialinfo;
    var findnode = shapeobj.firstElementChild;
    while(findnode)
    {
        if(findnode.nodeName == "Appearance")
        {
            var findchildnode = findnode.firstElementChild;
            while(findchildnode)
            {
                if(findchildnode.nodeName == "Material")
                {
                    materialinfo = findchildnode;
                    break;
                }
                if(findchildnode.nextElementSibling)
                {
                    findchildnode = findchildnode.nextElementSibling;
                }
                else
                {
                    break;
                }
            }
        }
        
		if(findnode.nextElementSibling)
		{
			findnode = findnode.nextElementSibling;
		}
		else
		{
			break;
		}
    }
    this.diffuseColor = materialinfo.getAttribute("diffuseColor").split(",");
    this.emissiveColor = materialinfo.getAttribute("emissiveColor").split(",");
    this.specularColor = materialinfo.getAttribute("specularColor").split(",");
    for(var i = 0; i < 3;i++)
    {
        if(this.diffuseColor[i] != this.emissiveColor)
        {
            if(parseFloat(this.diffuseColor[i]) == 1) this.emissiveColor[i] = this.diffuseColor[i];
            else if(parseFloat(this.emissiveColor[i]) == 1) this.diffuseColor[i] = this.emissiveColor[i];
        }
    }
    this.ambientIntensity = parseFloat(materialinfo.getAttribute("ambientIntensity"));
    this.shininess = parseFloat(materialinfo.getAttribute("shininess"));
    this.transparency = parseFloat(materialinfo.getAttribute("transparency"));
    
    this.bottom = nodeobj.getAttribute("bottom");
	this.height = parseFloat(nodeobj.getAttribute("height"));
    this.radius = parseFloat(nodeobj.getAttribute("radius"));
    this.side = (nodeobj.getAttribute("side"));
    this.subdivision = parseFloat(nodeobj.getAttribute("subdivision"));
    this.top = nodeobj.getAttribute("top");
}

function Create3DSphereObj(nodeobj)
{
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // transform과 shape노드 가져오기
    var transformobj = nodeobj.parentElement.parentElement;
    var shapeobj = nodeobj.parentElement;
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = shapeobj.id;
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //transform 정보
    var receivetext;
    var splittext;
    
    receivetext = transformobj.getAttribute("center") !== null ? transformobj.getAttribute("center"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.center_x = parseFloat(splittext[0]);
        this.center_y = parseFloat(splittext[1]);
        this.center_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("translation") !== null ? transformobj.getAttribute("translation"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.translation_x = parseFloat(splittext[0]);
        this.translation_y = parseFloat(splittext[1]);
        this.translation_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("scale") !== null ? transformobj.getAttribute("scale"): "1,1,1";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.scale_x = parseFloat(splittext[0]);
        this.scale_y = parseFloat(splittext[1]);
        this.scale_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("rotation") !== null ? transformobj.getAttribute("rotation"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.rotation_x = parseFloat(splittext[0]);
        this.rotation_y = parseFloat(splittext[1]);
        this.rotation_z = parseFloat(splittext[2]);   
    }
    
    this.scaleOrientation = transformobj.getAttribute("scaleOrientation");
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Sphere 정보
    var materialinfo;
    var findnode = shapeobj.firstElementChild;
    while(findnode)
    {
        if(findnode.nodeName == "Appearance")
        {
            var findchildnode = findnode.firstElementChild;
            while(findchildnode)
            {
                if(findchildnode.nodeName == "Material")
                {
                    materialinfo = findchildnode;
                    break;
                }
                if(findchildnode.nextElementSibling)
                {
                    findchildnode = findchildnode.nextElementSibling;
                }
                else
                {
                    break;
                }
            }
        }
        
		if(findnode.nextElementSibling)
		{
			findnode = findnode.nextElementSibling;
		}
		else
		{
			break;
		}
    }
    this.diffuseColor = materialinfo.getAttribute("diffuseColor").split(",");
    this.emissiveColor = materialinfo.getAttribute("emissiveColor").split(",");
    this.specularColor = materialinfo.getAttribute("specularColor").split(",");
    for(var i = 0; i < 3;i++)
    {
        if(this.diffuseColor[i] != this.emissiveColor)
        {
            if(parseFloat(this.diffuseColor[i]) == 1) this.emissiveColor[i] = this.diffuseColor[i];
            else if(parseFloat(this.emissiveColor[i]) == 1) this.diffuseColor[i] = this.emissiveColor[i];
        }
    }
    this.ambientIntensity = parseFloat(materialinfo.getAttribute("ambientIntensity"));
    this.shininess = parseFloat(materialinfo.getAttribute("shininess"));
    this.transparency = parseFloat(materialinfo.getAttribute("transparency"));
    
    this.radius = parseFloat(nodeobj.getAttribute("radius"));
    splittext = nodeobj.getAttribute("subdivision").split(",");
    this.subdivision_v = parseFloat(splittext[0]);
    this.subdivision_h = parseFloat(splittext[1]);
}

function Create3DLineSetObj(nodeobj)
{
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // transform과 shape노드 가져오기
    var transformobj = nodeobj.parentElement.parentElement;
    var shapeobj = nodeobj.parentElement;
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = shapeobj.id;
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //transform 정보
    var receivetext;
    var splittext;
    
    receivetext = transformobj.getAttribute("center") !== null ? transformobj.getAttribute("center"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.center_x = parseFloat(splittext[0]);
        this.center_y = parseFloat(splittext[1]);
        this.center_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("translation") !== null ? transformobj.getAttribute("translation"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.translation_x = parseFloat(splittext[0]);
        this.translation_y = parseFloat(splittext[1]);
        this.translation_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("scale") !== null ? transformobj.getAttribute("scale"): "1,1,1";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.scale_x = parseFloat(splittext[0]);
        this.scale_y = parseFloat(splittext[1]);
        this.scale_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("rotation") !== null ? transformobj.getAttribute("rotation"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.rotation_x = parseFloat(splittext[0]);
        this.rotation_y = parseFloat(splittext[1]);
        this.rotation_z = parseFloat(splittext[2]);   
    }
    
    this.scaleOrientation = transformobj.getAttribute("scaleOrientation");
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // LineSet 정보
    var materialinfo;
    var findnode = shapeobj.firstElementChild;
    while(findnode)
    {
        if(findnode.nodeName == "Appearance")
        {
            var findchildnode = findnode.firstElementChild;
            while(findchildnode)
            {
                if(findchildnode.nodeName == "Material")
                {
                    materialinfo = findchildnode;
                    break;
                }
                if(findchildnode.nextElementSibling)
                {
                    findchildnode = findchildnode.nextElementSibling;
                }
                else
                {
                    break;
                }
            }
        }
        
		if(findnode.nextElementSibling)
		{
			findnode = findnode.nextElementSibling;
		}
		else
		{
			break;
		}
    }
    this.diffuseColor = materialinfo.getAttribute("diffuseColor").split(",");
    this.emissiveColor = materialinfo.getAttribute("emissiveColor").split(",");
    this.specularColor = materialinfo.getAttribute("specularColor").split(",");
    for(var i = 0; i < 3;i++)
    {
        if(this.diffuseColor[i] != this.emissiveColor)
        {
            if(parseFloat(this.diffuseColor[i]) == 1) this.emissiveColor[i] = this.diffuseColor[i];
            else if(parseFloat(this.emissiveColor[i]) == 1) this.diffuseColor[i] = this.emissiveColor[i];
        }
    }
    this.ambientIntensity = parseFloat(materialinfo.getAttribute("ambientIntensity"));
    this.shininess = parseFloat(materialinfo.getAttribute("shininess"));
    this.transparency = parseFloat(materialinfo.getAttribute("transparency"));
    
    var coordinateobj = nodeobj.firstElementChild;
    this.point = coordinateobj.getAttribute("point").split(" ");
}

function Create3DIndexedFaceSetObj(nodeobj)
{
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // transform과 shape노드 가져오기
    var transformobj = nodeobj.parentElement.parentElement;
    var shapeobj = nodeobj.parentElement;
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = shapeobj.id;
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //transform 정보
    var receivetext;
    var splittext;
    
    receivetext = transformobj.getAttribute("center") !== null ? transformobj.getAttribute("center"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.center_x = parseFloat(splittext[0]);
        this.center_y = parseFloat(splittext[1]);
        this.center_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("translation") !== null ? transformobj.getAttribute("translation"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.translation_x = parseFloat(splittext[0]);
        this.translation_y = parseFloat(splittext[1]);
        this.translation_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("scale") !== null ? transformobj.getAttribute("scale"): "1,1,1";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.scale_x = parseFloat(splittext[0]);
        this.scale_y = parseFloat(splittext[1]);
        this.scale_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("rotation") !== null ? transformobj.getAttribute("rotation"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.rotation_x = parseFloat(splittext[0]);
        this.rotation_y = parseFloat(splittext[1]);
        this.rotation_z = parseFloat(splittext[2]);   
    }
    
    this.scaleOrientation = transformobj.getAttribute("scaleOrientation");
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // IndexedFaceSet 정보
    var materialinfo;
    var findnode = shapeobj.firstElementChild;
    while(findnode)
    {
        if(findnode.nodeName == "Appearance")
        {
            var findchildnode = findnode.firstElementChild;
            while(findchildnode)
            {
                if(findchildnode.nodeName == "Material")
                {
                    materialinfo = findchildnode;
                    break;
                }
                if(findchildnode.nextElementSibling)
                {
                    findchildnode = findchildnode.nextElementSibling;
                }
                else
                {
                    break;
                }
            }
        }
        
		if(findnode.nextElementSibling)
		{
			findnode = findnode.nextElementSibling;
		}
		else
		{
			break;
		}
    }
    this.diffuseColor = materialinfo.getAttribute("diffuseColor").split(",");
    this.emissiveColor = materialinfo.getAttribute("emissiveColor").split(",");
    this.specularColor = materialinfo.getAttribute("specularColor").split(",");
    for(var i = 0; i < 3;i++)
    {
        if(this.diffuseColor[i] != this.emissiveColor)
        {
            if(parseFloat(this.diffuseColor[i]) == 1) this.emissiveColor[i] = this.diffuseColor[i];
            else if(parseFloat(this.emissiveColor[i]) == 1) this.diffuseColor[i] = this.emissiveColor[i];
        }
    }
    this.ambientIntensity = parseFloat(materialinfo.getAttribute("ambientIntensity"));
    this.shininess = parseFloat(materialinfo.getAttribute("shininess"));
    this.transparency = parseFloat(materialinfo.getAttribute("transparency"));
    
    var coordinateobj = nodeobj.firstElementChild;
    this.point = parseFloat(coordinateobj.getAttribute("point"));
}

function Create3DTerrainObj(nodeobj)
{
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // transform과 shape노드 가져오기
    var transformobj = nodeobj.parentElement.parentElement;
    var shapeobj = nodeobj.parentElement;
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = shapeobj.id;
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //transform 정보
    var receivetext;
    var splittext;
    
    receivetext = transformobj.getAttribute("center") !== null ? transformobj.getAttribute("center"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.center_x = parseFloat(splittext[0]);
        this.center_y = parseFloat(splittext[1]);
        this.center_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("translation") !== null ? transformobj.getAttribute("translation"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.translation_x = parseFloat(splittext[0]);
        this.translation_y = parseFloat(splittext[1]);
        this.translation_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("scale") !== null ? transformobj.getAttribute("scale"): "1,1,1";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.scale_x = parseFloat(splittext[0]);
        this.scale_y = parseFloat(splittext[1]);
        this.scale_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("rotation") !== null ? transformobj.getAttribute("rotation"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.rotation_x = parseFloat(splittext[0]);
        this.rotation_y = parseFloat(splittext[1]);
        this.rotation_z = parseFloat(splittext[2]);   
    }
    
    this.scaleOrientation = transformobj.getAttribute("scaleOrientation");
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Terrain 정보
    var materialinfo;
    var findnode = shapeobj.firstElementChild;
    while(findnode)
    {
        if(findnode.nodeName == "Appearance")
        {
            var findchildnode = findnode.firstElementChild;
            while(findchildnode)
            {
                if(findchildnode.nodeName == "Material")
                {
                    materialinfo = findchildnode;
                    break;
                }
                if(findchildnode.nextElementSibling)
                {
                    findchildnode = findchildnode.nextElementSibling;
                }
                else
                {
                    break;
                }
            }
        }
        
		if(findnode.nextElementSibling)
		{
			findnode = findnode.nextElementSibling;
		}
		else
		{
			break;
		}
    }
    this.diffuseColor = materialinfo.getAttribute("diffuseColor").split(",");
    this.emissiveColor = materialinfo.getAttribute("emissiveColor").split(",");
    this.specularColor = materialinfo.getAttribute("specularColor").split(",");;
    this.ambientIntensity = parseFloat(materialinfo.getAttribute("ambientIntensity"));
    this.shininess = parseFloat(materialinfo.getAttribute("shininess"));
    this.transparency = parseFloat(materialinfo.getAttribute("transparency"));
    
    splittext = nodeobj.getAttribute("size").split(",");
    this.size_x = parseFloat(splittext[0]);
    this.size_y = parseFloat(splittext[1]);
    
    splittext = nodeobj.getAttribute("subdivision").split(",");
    this.subdivision_x = parseFloat(splittext[0]);
    this.subdivision_y = parseFloat(splittext[1]);
    this.height = parseFloat(nodeobj.getAttribute("size"));
    
    this.minElevation = parseFloat(nodeobj.getAttribute("minElevation"));
    this.maxElevation = parseFloat(nodeobj.getAttribute("maxElevation"));
    this.elevationType = nodeobj.getAttribute("elevationType");
    this.colorElevation = nodeobj.getAttribute("colorElevation");
    this.terrainType = nodeobj.getAttribute("terrainType");
    this.grid_visible = nodeobj.getAttribute("grid_visible");
    this.outline_visible = nodeobj.getAttribute("outline_visible");
    this.xyaxis_visible = nodeobj.getAttribute("xyaxis_visible");
    this.zaxis_visible = nodeobj.getAttribute("zaxis_visible");
    this.value_visible = nodeobj.getAttribute("value_visible");
    this.data = new Array();
    init_data(this);
    
    function init_data(obj)
    {
        for(var i = 0; i < obj.subdivision_x; i++)
        {
            obj.data.push(new Array());
        }
    }
    
    var child = nodeobj.parentElement.firstElementChild;
    while(child)
    {
        if(child.nodeName == "script")
        {
            if(current_browser == "ie")
            {
                CreateFunction(child.text,this);
            }
            else
            {
                CreateFunction(child.textContent,this);
            }
        }
        if(child.nextElementSibling)
        {
            child = child.nextElementSibling;
        }
        else
        {
            break;
        }
    }
}

function Create3DContourObj(nodeobj)
{
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // transform과 shape노드 가져오기
    var transformobj = nodeobj.parentElement.parentElement;
    var shapeobj = nodeobj.parentElement;
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = shapeobj.id;
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
	this.childNodes = [];

	this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	}
	this.removeChild = function(childid){
		for(var i =0;i<childNodes.length;i++)
		{
			if(childNodes[i].id == childid)
			{
				this.childNodes.splice(i,1);
				break;
			}
		}
        sibling_update(this);
	}
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //transform 정보
    var receivetext;
    var splittext;
    
    receivetext = transformobj.getAttribute("center") !== null ? transformobj.getAttribute("center"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.center_x = parseFloat(splittext[0]);
        this.center_y = parseFloat(splittext[1]);
        this.center_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("translation") !== null ? transformobj.getAttribute("translation"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.translation_x = parseFloat(splittext[0]);
        this.translation_y = parseFloat(splittext[1]);
        this.translation_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("scale") !== null ? transformobj.getAttribute("scale"): "1,1,1";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.scale_x = parseFloat(splittext[0]);
        this.scale_y = parseFloat(splittext[1]);
        this.scale_z = parseFloat(splittext[2]);   
    }
    receivetext = transformobj.getAttribute("rotation") !== null ? transformobj.getAttribute("rotation"): "0,0,0";
    if(receivetext)
    {
        splittext = receivetext.split(",");
        this.rotation_x = parseFloat(splittext[0]);
        this.rotation_y = parseFloat(splittext[1]);
        this.rotation_z = parseFloat(splittext[2]);   
    }
    
    this.scaleOrientation = transformobj.getAttribute("scaleOrientation");
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Contour 정보
    var materialinfo;
    var findnode = shapeobj.firstElementChild;
    while(findnode)
    {
        if(findnode.nodeName == "Appearance")
        {
            var findchildnode = findnode.firstElementChild;
            while(findchildnode)
            {
                if(findchildnode.nodeName == "Material")
                {
                    materialinfo = findchildnode;
                    break;
                }
                if(findchildnode.nextElementSibling)
                {
                    findchildnode = findchildnode.nextElementSibling;
                }
                else
                {
                    break;
                }
            }
        }
        
		if(findnode.nextElementSibling)
		{
			findnode = findnode.nextElementSibling;
		}
		else
		{
			break;
		}
    }
    this.diffuseColor = materialinfo.getAttribute("diffuseColor").split(",");
    this.emissiveColor = materialinfo.getAttribute("emissiveColor").split(",");
    this.specularColor = materialinfo.getAttribute("specularColor").split(",");;
    this.ambientIntensity = parseFloat(materialinfo.getAttribute("ambientIntensity"));
    this.shininess = parseFloat(materialinfo.getAttribute("shininess"));
    this.transparency = parseFloat(materialinfo.getAttribute("transparency"));
    
    splittext = nodeobj.getAttribute("size").split(",");
    this.size_x = parseFloat(splittext[0]);
    this.size_y = parseFloat(splittext[1]);
    this.height = parseFloat(nodeobj.getAttribute("height"));
    
    splittext = nodeobj.getAttribute("subdivision").split(",");
    this.subdivision_x = parseFloat(splittext[0]);
    this.subdivision_y = parseFloat(splittext[1]);
    this.subdivision_z = parseFloat(splittext[2]);
    
    this.hidden_points = nodeobj.getAttribute("hidden_points");
    
    this.minElevation = parseFloat(nodeobj.getAttribute("minElevation"));
    this.maxElevation = parseFloat(nodeobj.getAttribute("maxElevation"));
    this.colorElevation = nodeobj.getAttribute("colorElevation");
    
    this.grid_visible = nodeobj.getAttribute("grid_visible");
    this.outline_visible = nodeobj.getAttribute("outline_visible");
    this.xyaxis_visible = nodeobj.getAttribute("xyaxis_visible");
    this.zaxis_visible = nodeobj.getAttribute("zaxis_visible");
    this.value_visible = nodeobj.getAttribute("value_visible");
    this.hidden_points = new Array();
    init_hidden_points(nodeobj, this);
    function init_hidden_points(nodeobj, obj)
    {
        for(var i = 0; i < obj.subdivision_x; i++)
        {
            obj.hidden_points.push(new Array());
            for(var j = 0; j < obj.subdivision_y; j++)
            {
                obj.hidden_points[i].push(new Array());
                for(var k = 0; k < obj.subdivision_z; k++)
                {
                    obj.hidden_points[i][j].push(true);
                }
            }
        }
        
        var str_hidden_points_split = nodeobj.getAttribute("hidden_points").split(" ");
        for(var i = 0; i < str_hidden_points_split.length; i++)
        {
            var str_points_split = str_hidden_points_split[i].split(",");
            var x_points = str_points_split[0].split(":");
            var y_points = str_points_split[1].split(":");
            var z_points = str_points_split[2].split(":");
            
            var x = parseFloat(x_points[0]);
            var x_end = parseFloat(x_points[x_points.length-1]);
            var y = parseFloat(y_points[0]);
            var y_end = parseFloat(y_points[y_points.length-1]);
            var z = parseFloat(z_points[0]);
            var z_end = parseFloat(z_points[z_points.length-1]);
            
            while(x <= x_end)
            {
                while(y <= y_end)
                {
                    while(z <= z_end)
                    {
                        if(x < obj.subdivision_x && y < obj.subdivision_y && z < obj.subdivision_z)
                        {
                            obj.hidden_points[x][y][z] = false;
                        }
                        z++;
                    }
                    z = parseFloat(z_points[0]);
                    y++;
                }
                y = parseFloat(y_points[0]);
                x++;
            }
        }
    }
    
    this.data = new Array();
    init_data(this);
    
    function init_data(obj)
    {
        for(var i = 0; i < obj.subdivision_x; i++)
        {
            obj.data.push(new Array());
            for(var j = 0; j < obj.subdivision_y; j++)
            {
                obj.data[i].push(new Array());
            }
        }
    }
    
    var child = nodeobj.parentElement.firstElementChild;
    while(child)
    {
        if(child.nodeName == "script")
        {
            if(current_browser == "ie")
            {
                CreateFunction(child.text,this);
            }
            else
            {
                CreateFunction(child.textContent,this);
            }
        }
        if(child.nextElementSibling)
        {
            child = child.nextElementSibling;
        }
        else
        {
            break;
        }
    }
}