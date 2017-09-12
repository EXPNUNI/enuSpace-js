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
// 
///////////////////////////////////////////////////////////////////////////////////////
function gap()
{
    this.left=0;
    this.right=0;
    this.top=0;
    this.bottom=0;
    this.row=0;
	this.symboltotext=0;
	this.series=0;
}
function data_point(x, y)
{
    this.x;
    this.y;
    if(x != undefined)
    {
        this.x = x;
    }
    if(y != undefined)
    {
        this.y = y;
    }
}
function CreateVariable(variable)
{
    if(variable.indexOf('@') != -1)
    {
        if(variable.split('.').length > 1)
        {
            var values = variable.split('.');
            var strVariableparent;
            var strVariablename = "";
            for(var i in values)
            {
                if(i==0)
                {
                    var temp = values[i].substring(1,values[i].length);
                    if(window[temp])
                    {
                        strVariableparent = window[temp];
                    }
                    else
                    {
                        window[temp] = new Object();
                        strVariableparent = window[temp];
                    }
                    strVariablename = strVariablename + temp;
                }
                else if(i < values.length - 1)
                {
                    strVariableparent[values[i]] = new Object();
                    strVariableparent = strVariableparent[values[i]];
                }
                else if(i == values.length - 1)
                {
                    strVariableparent[values[i]] = 0;
                }
            }
        }
        else
        {
            if(variable.indexOf('@') >= 0)
            {
                var temp = variable.substring(1,variable.length);
                window[temp] = 0;
            }
        }
    }
}
function VariableValueReturn(variable)
{
    var variable_value;
    if(variable.split('.').length > 1)
    {
        var values = variable.split('.');
        for(var i in values)
        {
            if(i==0)
            {
                if(values[i].indexOf('@') >= 0)
                {
                    eval_text = "window[\""+values[i].substring(1,values[i].length)+"\"]";
                }
                else
                {
                    eval_text = "window[\""+values[i]+"\"]";
                }
            }
            else 
            {
                eval_text = eval_text+"[\""+values[i]+"\"]";
            }
        }
        variable_value = eval(eval_text);
    }
    else
    {
        if(variable)
        {
            if(variable.indexOf('@') >= 0)
            {
                variable_value = window[variable.substring(1,variable.length)];
            }
            else
            {
                variable_value = window[variable];
            }
        }
    }
    return variable_value;
}
function gethistoricaldata(tagid, duration, endtime, datalist)
{
    var xmlHttp = new XMLHttpRequest();
	var strUrl = "gethistoricaldata" ;
	var strParam= "tagid="+tagid+"&"+"duration="+duration+"&"+"endtime="+endtime;

	xmlHttp.open("POST", strUrl, false);	
	xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
	xmlHttp.setRequestHeader("Cache-Control","no-cache, must-revalidate");
	xmlHttp.setRequestHeader("Pragma","no-cache");
	xmlHttp.send(strParam);	

	var msg = xmlHttp.responseText;

	var arr = JSON.parse(msg);
    if (arr.RESULT == "OK")
	{
        var values = arr.VALUES;
        if(values.length > 0)
        {
            if(arr.TIME_FORMAT == "SIM")
            {
                for(var i in values)
                {
                    var recive_time = new Date(values[i].TIME).valueOf();
                    var sub_time = new Date("1601-01-01 00:00:00.000").valueOf();
                    var x = recive_time - sub_time;
                    var y = parseFloat(Number(values[i].VALUE));
                    var point_data = new data_point(x, y);

                    datalist.unshift(point_data);
                }
            }
            else if(arr.TIME_FORMAT == "SYS")
            {
                for(var i in values)
                {
                    var x = new Date(values[i].TIME).valueOf();
                    var y = parseFloat(Number(values[i].VALUE));
                    var point_data = new data_point(x, y);

                    datalist.unshift(point_data);
                }
            }
        }
    }
    else
    {
        console.log("gethistoricaldata: 받아오기 에러");
    }
}
function SeriesDataUpdate(trendobj)
{
    var trendserieslist = trendobj.trendSeriesList;
    if(trendobj.trend_flow == "on")
    {
        trendobj.xview_max = time_value;
        trendobj.xview_min = time_value - trendobj.duration*1000;
    
        for(var i in trendserieslist)
        {
            var point_data = new data_point(0,0);
            point_data.x = time_value;
            point_data.y = VariableValueReturn(trendserieslist[i].variable);
            trendserieslist[i].series_data.push(point_data);
        }
    }
    else(trendobj.trend_flow == "off")
    {
        for(var i in trendserieslist)
        {
            if(trendserieslist[i].data != trendserieslist[i].olddata)
            {
                trendserieslist[i].olddata = trendserieslist[i].data;
                
                var datalist = trendserieslist[i].data.split(' ');
                var data_split = [];

                for(var i = 0;i < datalist.length;i++)
                {
                    data_split = datalist[i].split(',');
                    var insert_data = new data_point(Number(data_split[0]), Number(data_split[1]));
                    this.series_data.push(insert_data);
                }
            }
        }
    }
}
function SeriesDataInitialize(trendobj)
{
    var trendserieslist = trendobj.trendSeriesList;
    if(trendobj.trend_flow == "on")
    {
        for(var i in trendserieslist)
        {
            trendserieslist[i].data = [];
            trendserieslist[i].series_data = [];
        }
    }
}
function CreateTrendObj(nodeobj)
{
	//base
	this.nodename = nodeobj.nodeName;
	this.xmlns = nodeobj.getAttribute("xmlns");
	this.xlink = nodeobj.getAttribute("xmlns:xlink");
	this.id = nodeobj.getAttribute("id");
    this.childNodes = [];
    this.trendSeriesList = [];
    this.prevSibling;
    this.nextSibling;
    this.parentObj;
	this.parentNode;
	this.ownnode = nodeobj.cloneNode(false);
    
    this.appendChild = function(pushobj){
		this.childNodes.push(pushobj);
        sibling_update(this);
	};
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
    };
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
	///////////////////////////////////////////////////////////////////////////////////////////////////
    //Trend property
    this.fill = nodeobj.getAttribute("fill");
    this.fill_opacity = parseFloat(Number(nodeobj.getAttribute("fill-opacity")));
    this.rx = parseFloat(Number(nodeobj.getAttribute("rx")));
    this.ry = parseFloat(Number(nodeobj.getAttribute("ry")));
    
    //Real Time Trend
    this.trend_flow = nodeobj.getAttribute("trend-flow");
    
    //x, y 축 최대, 최소값
    this.xview_min = parseFloat(Number(nodeobj.getAttribute("xview-min")));
    this.xview_max = parseFloat(Number(nodeobj.getAttribute("xview-max")));
    this.yview_min = parseFloat(Number(nodeobj.getAttribute("yview-min")));
    this.yview_max = parseFloat(Number(nodeobj.getAttribute("yview-max")));
    
    //Real Time Trend일 때 화면에 표시되는 데이터의 갯수
    this.duration = parseFloat(Number(nodeobj.getAttribute("duration")));
    
    //x, y축의 max값을 넘어가는 값이 나올 때 자동으로 최대값 설정한다.
    this.auto_scale = nodeobj.getAttribute("auto-scale");
    
    //Real Time Trend일 때 차트가 흘러가는 방향 지정
    this.direction = nodeobj.getAttribute("direction");
    this.direction_y = nodeobj.getAttribute("direction-y");
    if(this.direction_y == undefined)
    {
        this.direction_y = "down-top";
    }
    //y축 시리즈 갯수대로 생성
    this.individual_yaxis = nodeobj.getAttribute("individual-yaxis");
    
    this.series_yaxis = nodeobj.getAttribute("series-yaxis");
    
    // 마우스가 위치한 곳의 값을 표현 또는 반환해준다.
    this.ruler = nodeobj.getAttribute("ruler");
    
    // 차트 구성 객체 visible 속성
    this.title_visible = nodeobj.getAttribute("title-visible");
    this.legend_visible = nodeobj.getAttribute("legend-visible");
    this.grid_visible = nodeobj.getAttribute("grid-visible");
    this.xaxis_visible = nodeobj.getAttribute("xaxis-visible");
    this.yaxis_visible = nodeobj.getAttribute("yaxis-visible");
    
    //band 속성
    this.band_visible = nodeobj.getAttribute("band-visible");
    this.highlimit_band = parseFloat(Number(nodeobj.getAttribute("highlimit-band")));
    this.band_high_fill = nodeobj.getAttribute("band-high-fill");
    this.band_high_opacity = parseFloat(Number(nodeobj.getAttribute("band-high-opacity")));
    this.band_high_width = parseFloat(Number(nodeobj.getAttribute("band-high-width")));
    this.band_high_dasharray = nodeobj.getAttribute("band-high-dasharray");
    this.lowlimit_band = parseFloat(Number(nodeobj.getAttribute("lowlimit-band")));
    this.band_low_fill = nodeobj.getAttribute("band-low-fill");
    this.band_low_opacity = parseFloat(Number(nodeobj.getAttribute("band-low-opacity")));
    this.band_low_width = parseFloat(Number(nodeobj.getAttribute("band-low-width")));
    this.band_low_dasharray = nodeobj.getAttribute("band-low-dasharray");
    
    this.interpolator = nodeobj.getAttribute("interpolator");
    
    // x축 flow시 축이 흐르게 하는효과를 내기 위한 속성
    this.last_xaxis_mainscale = 0;
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//script & childnode
	function MakeTrendStruct(parentObj,parentnode)
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
				if(childnode.nodeName == "pg-trendtitle")
				{
					parentObj[childnode.id] = new CreateTitleObj(childnode);
                    parentObj[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(parentObj[childnode.id]);
				}
                else if(childnode.nodeName == "pg-trendlegend")
                {
                    parentObj[childnode.id] = new CreateLegendObj(childnode);
                    parentObj[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(parentObj[childnode.id]);
                }
                else if(childnode.nodeName == "pg-trendxaxis")
                {
                    parentObj[childnode.id] = new CreateXaxisObj(childnode);
                    parentObj[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(parentObj[childnode.id]);
                }
                else if(childnode.nodeName == "pg-trendyaxis")
                {
                    parentObj[childnode.id] = new CreateYaxisObj(childnode);
                    parentObj[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(parentObj[childnode.id]);
                }
                else if(childnode.nodeName == "pg-trendgraph")
                {
                    parentObj[childnode.id] = new CreateGraphObj(childnode);
                    parentObj[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(parentObj[childnode.id]);
                }
                else if(childnode.nodeName == "pg-trendseries")
                {
                    parentObj[childnode.id] = new CreateSeriesObj(childnode);
                    parentObj[childnode.id].parentObj = parentObj;
                    parentObj.appendChild(parentObj[childnode.id]);
                    parentObj.trendSeriesList.push(parentObj[childnode.id]);
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
	MakeTrendStruct(this,nodeobj);
    /////////////////////////////////////////////////////////////////////////////////////////
    // trend series의 data값 받아오기
    var childobj = this.trendSeriesList[0];
    while(childobj)
    {
        if(childobj)
        {
            gethistoricaldata(childobj.variable,(this.duration*1000),0,childobj.series_data);
        }
        
        childobj = childobj.nextSibling;
    }
}

function CreateTitleObj(nodeobj)
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
	//Title property
    this.baseline_shift = parseFloat(Number(nodeobj.getAttribute("baseline-shift")));
    this.dx = parseFloat(Number(nodeobj.getAttribute("dx")));
    this.dy = parseFloat(Number(nodeobj.getAttribute("dy")));
    this.rx = parseFloat(Number(nodeobj.getAttribute("rx")));
    this.ry = parseFloat(Number(nodeobj.getAttribute("ry")));
    this.text_height = parseFloat(Number(nodeobj.getAttribute("text-height")));
    this.text_anchor = nodeobj.getAttribute("text-anchor");
    if(nodeobj.getAttribute("text-anchor") == undefined)
    {
        this.text_anchor = "middle";
    }
    
    this.gap = new gap();
    this.gap.left = parseFloat(Number(nodeobj.getAttribute("gapleft")));
    this.gap.right = parseFloat(Number(nodeobj.getAttribute("gapright")));
    this.gap.top = parseFloat(Number(nodeobj.getAttribute("gaptop")));
    this.gap.bottom = parseFloat(Number(nodeobj.getAttribute("gapbottom")));
    
	this.fill = nodeobj.getAttribute("fill");
	this.fill_opacity = parseFloat(Number(nodeobj.getAttribute("fill-opacity")));
    
	this.position = nodeobj.getAttribute("position");  // title의 위치
	this.title = nodeobj.getAttribute("title");    // 제목 문자열
    
    //제목 문자의 속성
	this.font_color = nodeobj.getAttribute("font-color");
	this.font_family = nodeobj.getAttribute("font-family");
	this.font_size = parseFloat(Number(nodeobj.getAttribute("font-size")));
	this.font_weight = nodeobj.getAttribute("font-weight");
	this.font_style = nodeobj.getAttribute("font-style");
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//script
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

function CreateLegendObj(nodeobj)
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
	//gbase
    this.visibility = nodeobj.getAttribute("visibility");
	this.stroke = nodeobj.getAttribute("stroke");
	this.stroke_opacity = parseFloat(nodeobj.getAttribute("stroke-opacity"));
	this.stroke_width = parseFloat(nodeobj.getAttribute("stroke-width"));
    this.stroke_dasharray = nodeobj.getAttribute("stroke-dasharray");
    this.stroke_linecap = nodeobj.getAttribute("stroke-linecap");
    this.stroke_linejoin = nodeobj.getAttribute("stroke-linejoin");
    this.rx = parseFloat(Number(nodeobj.getAttribute("rx")));
    this.ry = parseFloat(Number(nodeobj.getAttribute("ry")));
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
	//legend property
	this.fill = nodeobj.getAttribute("fill");
	this.fill_opacity = parseFloat(Number(nodeobj.getAttribute("fill-opacity")));
	this.position = nodeobj.getAttribute("position");
    
    //gap(간격) 설정
    this.gap = new gap();
	this.gap.left = parseFloat(Number(nodeobj.getAttribute("gap-left")));
	this.gap.right = parseFloat(Number(nodeobj.getAttribute("gap-right")));
	this.gap.top = parseFloat(Number(nodeobj.getAttribute("gap-top")));
	this.gap.bottom = parseFloat(Number(nodeobj.getAttribute("gap-bottom")));
	this.gap.row = parseFloat(Number(nodeobj.getAttribute("gap-row")));
	this.gap.symbol_text = parseFloat(Number(nodeobj.getAttribute("gap-symbol-text")));
	this.gap.series = parseFloat(Number(nodeobj.getAttribute("gap-series")));

	this.symbol_size = parseFloat(Number(nodeobj.getAttribute("symbol-size")));
	this.font_color = nodeobj.getAttribute("font-color");
	this.font_family = nodeobj.getAttribute("font-family");
	this.font_size = parseFloat(Number(nodeobj.getAttribute("font-size")));
	this.angle = parseFloat(Number(nodeobj.getAttribute("angle")));
	this.font_style = nodeobj.getAttribute("font-style");
	this.font_weight = nodeobj.getAttribute("font-weight");
	this.font_height = parseFloat(Number(nodeobj.getAttribute("font-height")));
    
    this.font_highest_width = parseFloat(Number(nodeobj.getAttribute("font-highest-width")));
    this.font_highest_height = parseFloat(Number(nodeobj.getAttribute("font-highest-height")));
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//script
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

function CreateXaxisObj(nodeobj)
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
	//Xaxis property
	this.fill = nodeobj.getAttribute("fill");
	this.fill_opacity = parseFloat(Number(nodeobj.getAttribute("fill-opacity")));
	this.position = nodeobj.getAttribute("position");
    this.label_visible = nodeobj.getAttribute("label-visible");
    
    //눈금 속성
	this.mainscale = nodeobj.getAttribute("mainscale");
	this.scale_length = parseFloat(Number(nodeobj.getAttribute("scale-length")));
    this.subscale = nodeobj.getAttribute("subscale");
    this.subscale_length = parseFloat(Number(nodeobj.getAttribute("subscale-length")));
    this.tick = parseFloat(Number(nodeobj.getAttribute("tick")));
	
    //글자속성
    this.font_family = nodeobj.getAttribute("font-family");
    this.label_format = nodeobj.getAttribute("label-format");
    this.font_color = nodeobj.getAttribute("font-color");
    this.font_size = parseFloat(Number(nodeobj.getAttribute("font-size")));
    this.font_style = nodeobj.getAttribute("font-style");
    this.font_weight = nodeobj.getAttribute("font-weight");
    this.font_width = parseFloat(Number(nodeobj.getAttribute("font-width")));
    this.font_height = parseFloat(Number(nodeobj.getAttribute("font-height")));
    
    //소수점단위
    this.decimal_point = parseFloat(Number(nodeobj.getAttribute("decimal-point")));

    //단위
    this.unit_visible = nodeobj.getAttribute("unit-visible");
    this.unit = nodeobj.getAttribute("unit");
    
    this.xaxislist = [];
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//script
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

function CreateYaxisObj(nodeobj)
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
	//Yaxis property
	this.fill = nodeobj.getAttribute("fill");
	this.fill_opacity = parseFloat(Number(nodeobj.getAttribute("fill-opacity")));
	this.position = nodeobj.getAttribute("position");
    this.label_visible = nodeobj.getAttribute("label-visible");
    
    //눈금 속성
	this.mainscale = nodeobj.getAttribute("mainscale");
	this.scale_length = parseFloat(Number(nodeobj.getAttribute("scale-length")));
    this.subscale = nodeobj.getAttribute("subscale");
    this.subscale_length = parseFloat(Number(nodeobj.getAttribute("subscale-length")));
    this.tick = parseFloat(Number(nodeobj.getAttribute("tick")));
			
    //글자속성
    this.font_family = nodeobj.getAttribute("font-family");
    this.label_format = nodeobj.getAttribute("label-format");
    this.font_color = nodeobj.getAttribute("font-color");
    this.font_size = parseFloat(Number(nodeobj.getAttribute("font-size")));
    this.font_style = nodeobj.getAttribute("font-style");
    this.font_weight = nodeobj.getAttribute("font-weight");
    this.font_width = parseFloat(Number(nodeobj.getAttribute("font-width")));
    this.font_height = parseFloat(Number(nodeobj.getAttribute("font-height")));
    
    //소수점단위
    this.decimal_point = parseFloat(Number(nodeobj.getAttribute("decimal-point")));

    //단위
    this.unit_visible = nodeobj.getAttribute("unit-visible");
    this.unit = nodeobj.getAttribute("unit");
    
    this.yaxislist = [];
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//script
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

function CreateGraphObj(nodeobj)
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
	//Graph property
	this.fill = nodeobj.getAttribute("fill");
	this.fill_opacity = parseFloat(Number(nodeobj.getAttribute("fill-opacity")));
	this.xaxis_count = parseFloat(Number(nodeobj.getAttribute("xaxis-count")));
    this.yaxis_count = parseFloat(Number(nodeobj.getAttribute("yaxis-count")));
	
	this.grid_stroke = nodeobj.getAttribute("grid-stroke");
	this.grid_stroke_opacity = parseFloat(Number(nodeobj.getAttribute("grid-stroke-opacity")));
	this.grid_stroke_width = parseFloat(Number(nodeobj.getAttribute("grid-stroke-width")));
	this.grid_stroke_dasharray = nodeobj.getAttribute("grid-stroke-dasharray");
	
    this.horizontal = nodeobj.getAttribute("series-scale");
    this.vertical = nodeobj.getAttribute("series-scale");
	////////////////////////////////////////////////////////////////////////////////////////////////////
	//script
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

function CreateSeriesObj(nodeobj)
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
	//series property
	this.fill = nodeobj.getAttribute("fill");
	this.fill_opacity = parseFloat(Number(nodeobj.getAttribute("fill-opacity")));
	this.variable = nodeobj.getAttribute("variable");
    
    this.series_max_size = parseFloat(Number(nodeobj.getAttribute("series-max-size")));
    this.series_type = nodeobj.getAttribute("series-type");
    
    this.symbol_type = nodeobj.getAttribute("symbol-type");
    this.symbol_fill = nodeobj.getAttribute("symbol-fill");
	this.symbol_fill_opacity = parseFloat(Number(nodeobj.getAttribute("symbol-fill-opacity")));
    this.symbol_stroke = nodeobj.getAttribute("symbol-stroke");
	this.symbol_stroke_opacity = parseFloat(Number(nodeobj.getAttribute("symbol-stroke-opacity")));
	this.symbol_stroke_width = parseFloat(Number(nodeobj.getAttribute("symbol-stroke-width")));
    this.symbol_stroke_dasharray = nodeobj.getAttribute("symbol-stroke-dasharray");
	this.symbol_size = parseFloat(Number(nodeobj.getAttribute("symbol-size")));

    this.data = nodeobj.getAttribute("data");
    this.olddata = "";
    this.series_data = [];
    this.mainscale_label = nodeobj.getAttribute("mainscale-label");
    this.font_family = nodeobj.getAttribute("font-family");
    this.font_format = nodeobj.getAttribute("font-format");
    this.font_color = nodeobj.getAttribute("font-color");
	this.font_size = parseFloat(Number(nodeobj.getAttribute("symbol-size")));
    this.font_style = nodeobj.getAttribute("font-style");
	
    this.series_scale = nodeobj.getAttribute("series-scale");
	
	this.yaxis_max = parseFloat(Number(nodeobj.getAttribute("yaxis-max")));
	this.yaxis_min = parseFloat(Number(nodeobj.getAttribute("yaxis-min")));
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////
	//series data init
/*    var datalist = this.data.split(' ');
    var data_split = [];
    
    for(var i = 0;i < datalist.length;i++)
    {
        data_split = datalist[i].split(',');
        var insert_data = new data_point(Number(data_split[0]), Number(data_split[1]));
        this.series_data.push(insert_data);
    }
*/  
    ////////////////////////////////////////////////////////////////////////////////////////////////////
	//script
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
    CreateVariable(this.variable);
}