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
function labelformat(trendobj,data,format)
{
    var time;
    var return_value;
    if(data.toString() == "Invalid Date")
    {
        return data.toString();
    }
    if(trendobj.trend_flow == "on")
    {
        time = new Date(data);
    }
    if(trendobj.trend_flow == "off")
    {
        time = new Date((data*1000));
    }

    if(prev_time_mode == "SYS")
    {
        switch(format)
        { 
            case 'number':
                return time.valueOf();
            case 'yyyy-mm-dd':
                return_value = time.getFullYear()+"-"+time.getMonth()+"-"+time.getDay();
                return return_value;
            case 'yyyy-mm':
                return_value = time.getFullYear()+"-"+time.getMonth();
                return return_value;
            case 'yyyy':
                return_value = time.getFullYear().toString();
                return return_value;
            case 'yy-mm-dd':
                return_value = time.getFullYear().toString().substring(2,4)+"-"+time.getMonth()+"-"+time.getDay();
                return return_value;
            case 'yy-mm':
                return_value = time.getFullYear().toString().substring(2,4)+"-"+time.getMonth();
                return return_value;
            case 'yy':
                return_value = time.getFullYear().toString().substring(2,4);
                return return_value;
            case 'hh:mm:ss.ms':
                return_value = time.getHours()+":"+time.getMinutes()+":"+time.getSeconds()+":"+time.getMilliseconds();
                return return_value;
            case 'hh:mm:ss':
                return_value = time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
                return return_value;
            case 'yyyy-mm-dd hh:mm:ss.ms':
                return_value = time.getFullYear()+"-"+time.getMonth()+"-"+time.getDay()+" "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds()+":"+time.getMilliseconds();
                return return_value;
            case 'yyyy-mm-dd hh:mm:ss':
                return_value = time.getFullYear()+"-"+time.getMonth()+"-"+time.getDay()+" "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
                return return_value;
            case 'yy-mm-dd hh:mm:ss.ms':
                return_value = time.getFullYear().toString().substring(2,4)+"-"+time.getMonth()+"-"+time.getDay()+" "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds()+":"+time.getMilliseconds();
                return return_value;
            case 'yy-mm-dd hh:mm:ss':
                return_value = time.getFullYear().toString().substring(2,4)+"-"+time.getMonth()+"-"+time.getDay()+" "+time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
                return return_value;
            default:
                return;
        }
    }
    else if(prev_time_mode == "SIM")
    {
        switch(format)
        { 
            case 'number':
                return time.valueOf();
            case 'yyyy-mm-dd':
                return_value = time.getFullYear()+"-"+time.getUTCMonth()+"-"+time.getUTCDay();
                return return_value;
            case 'yyyy-mm':
                return_value = time.getFullYear()+"-"+time.getUTCMonth();
                return return_value;
            case 'yyyy':
                return_value = time.getFullYear().toString();
                return return_value;
            case 'yy-mm-dd':
                return_value = time.getFullYear().toString().substring(2,4)+"-"+time.getUTCMonth()+"-"+time.getUTCDay();
                return return_value;
            case 'yy-mm':
                return_value = time.getFullYear().toString().substring(2,4)+"-"+time.getUTCMonth();
                return return_value;
            case 'yy':
                return_value = time.getFullYear().toString().substring(2,4);
                return return_value;
            case 'hh:mm:ss.ms':
                return_value = time.getUTCHours()+":"+time.getUTCMinutes()+":"+time.getUTCSeconds()+":"+time.getUTCMilliseconds();
                return return_value;
            case 'hh:mm:ss':
                return_value = time.getUTCHours()+":"+time.getUTCMinutes()+":"+time.getUTCSeconds();
                return return_value;
            case 'yyyy-mm-dd hh:mm:ss.ms':
                return_value = time.getFullYear()+"-"+time.getUTCMonth()+"-"+time.getUTCDay()+" "+time.getUTCHours()+":"+time.getUTCMinutes()+":"+time.getUTCSeconds()+":"+time.getUTCMilliseconds();
                return return_value;
            case 'yyyy-mm-dd hh:mm:ss':
                return_value = time.getFullYear()+"-"+time.getUTCMonth()+"-"+time.getUTCDay()+" "+time.getUTCHours()+":"+time.getUTCMinutes()+":"+time.getUTCSeconds();
                return return_value;
            case 'yy-mm-dd hh:mm:ss.ms':
                return_value = time.getFullYear().toString().substring(2,4)+"-"+time.getUTCMonth()+"-"+time.getUTCDay()+" "+time.getUTCHours()+":"+time.getUTCMinutes()+":"+time.getUTCSeconds()+":"+time.getUTCMilliseconds();
                return return_value;
            case 'yy-mm-dd hh:mm:ss':
                return_value = time.getFullYear().toString().substring(2,4)+"-"+time.getUTCMonth()+"-"+time.getUTCDay()+" "+time.getUTCHours()+":"+time.getUTCMinutes()+":"+time.getUTCSeconds();
                return return_value;
        }
    }
    
}
function fontstyle(obj, ctx)
{
    var fontBold;
    
    if(obj.font_color != undefined ||obj.font_color != "" )
    {
        ctx.fillStyle =obj.font_color;
    }
    else
    {  
         ctx.fillStyle= "rgb(0,0,0)";
    }
    
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
    
	ctx.font =fontData;
}

function DrawSymbol(series, x, y, symbol_size)
{
    var size;
    if(symbol_size)
    {
        size = symbol_size*0.3;
    }
    else
    {
        size = series.symbol_size;
    }
    if(series.symbol_type == "circle")
    {
        ctx.save();
        var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
        size = size/2;
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.bezierCurveTo(x + (KAPPA * size), y - size,  x + size, y - (KAPPA * size), x + size, y);
        ctx.bezierCurveTo(x + size, y + (KAPPA * size), x + (KAPPA * size), y + size, x, y + size);
        ctx.bezierCurveTo(x - (KAPPA * size), y + size, x - size, y + (KAPPA * size), x - size, y);
        ctx.bezierCurveTo(x - size, y - (KAPPA * size), x - (KAPPA * size), y - size, x, y - size);
       
        ctx.closePath();
        ctx.fillStyle = series.symbol_fill;
        ctx.globalAlpha = series.fill_opacity;
        ctx.fill();
//        ctx.strokeStyle = series.symbol_stroke;
//        ctx.globalAlpha = series.stroke_opacity;
//        ctx.stroke();
        ctx.restore();
    }
    else if(series.symbol_type == "triangle")
    {
        ctx.save();
        var radian30 = Math.PI/6;
        
        ctx.beginPath();
        ctx.moveTo(x + (Math.cos(radian30) * size), y+(size/2));
        ctx.lineTo(x - (Math.cos(radian30) * size), y+(size/2));
        ctx.lineTo(x, y - size);
        
        ctx.closePath();
        ctx.fillStyle = series.symbol_fill;
        ctx.globalAlpha = series.fill_opacity;
        ctx.fill();
//        ctx.strokeStyle = series.symbol_stroke;
//        ctx.globalAlpha = series.stroke_opacity;
//        ctx.stroke();
        ctx.restore();
    }
    else if(series.symbol_type == "rect")
    {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x - size, y - size);
        ctx.lineTo(x + size, y - size);
        ctx.lineTo(x + size, y + size);
        ctx.lineTo(x - size, y + size);
        
        ctx.closePath();
        ctx.fillStyle = series.symbol_fill;
        ctx.globalAlpha = series.fill_opacity;
        ctx.fill();
//        ctx.strokeStyle = series.symbol_stroke;
//        ctx.globalAlpha = series.stroke_opacity;
//        ctx.stroke();
        ctx.restore();
    }
    else if(series.symbol_type == "star")
    {
        
    }
}


function DrawTrendObj(obj,Parent_TF,GBoundBoxs)
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

    ctx.globalAlpha=obj.fill_opacity;
    ctx.fill();
    ctx.globalAlpha=obj.stroke_opacity;
    ctx.stroke();
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

function DrawTrendtitleObj(obj,Parent_TF,GBoundBoxs)
{
    var bIsGroup =false;
    var parentOBJ =obj.parentObj;
    
    if(parentOBJ.parentObj.nodename == "g" || parentOBJ.parentObj.nodename == "use")
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
    var r_rx =obj.rx;
    var r_ry =obj.ry;
    var r_x;
    var r_y;
    var r_width;
    var r_height;
    
    if(obj.text_anchor == "start")
    {
        r_x =obj.x;// - obj.gap.left;
        r_y =obj.y;// - obj.gap.top;
        r_width = obj.width;
        r_height = obj.height;
    }
    else if(obj.text_anchor == "middle")
    {
        r_x =obj.x - obj.width/2;// - obj.gap.left;
        r_y =obj.y;// - obj.gap.top;
        r_width = obj.width;
        r_height = obj.height;
    }
    else if(obj.text_anchor == "end")
    {
        r_x =obj.x - obj.width;// - obj.gap.left;
        r_y =obj.y;// - obj.gap.top;
        r_width = obj.width;
        r_height = obj.height;
    }
    
    ctx.beginPath();
    ctx.moveTo(r_x + r_rx, r_y);
    ctx.lineTo(r_x + r_width - r_rx, r_y);
    ctx.quadraticCurveTo(r_x + r_width, r_y, r_x + r_width, r_y + r_ry)
    ctx.lineTo(r_x + r_width, r_y + r_height - r_ry);
    ctx.quadraticCurveTo(r_x + r_width, r_y + r_height, r_x + r_width - r_rx, r_y + r_height)
    ctx.lineTo(r_x + r_rx, r_y + r_height);
    ctx.quadraticCurveTo(r_x, r_y + r_height, r_x, r_y + r_height - r_ry)
    ctx.lineTo(r_x, r_y + r_ry);
    ctx.quadraticCurveTo(r_x, r_y, r_x + r_rx, r_y)
    ctx.closePath();
    
    ctx.globalAlpha=obj.fill_opacity;
    ctx.fill();
    ctx.globalAlpha=obj.stroke_opacity;
    ctx.stroke();
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
    //////////////////////////////////////////////
     //ctx.font = "italic bold 48px  serif";
    fontstyle(obj, canvas_2Ddraw);
    //anchor처리시 텍스트 크기를 얻어야한다.
    var x = parseFloat(obj.x);
    var y = parseFloat(obj.y);
    var dx = parseFloat(obj.dx);
    var dy = parseFloat(obj.dy);
    //SetTransform(obj);
    var textArea =canvas_2Ddraw.measureText(obj.title);
    //var textArea = ctx.measureText(obj.text); 
    var AreaX = x +dx;
    var AreaY = y +dy + obj.text_height;
    var baseLineShift = 0;
    
    if(parseFloat(obj.baseline_shift) != 0)
    {
        baseLineShift = obj.baseline_shift * (parseFloat(obj.baseline_shift) *0.01);
        AreaY = AreaY - baseLineShift;
    }
    if(obj.text_anchor == "middle")
    {
        canvas_2Ddraw.textAlign = "center";
    }
    else
    {
        canvas_2Ddraw.textAlign = obj.text_anchor;
    }
    canvas_2Ddraw.globalAlpha = 1;
    canvas_2Ddraw.fillText(obj.title, AreaX, AreaY);

    /*
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
    */
	return ctx.getMatrix();
}

function DrawTrendlegendObj(obj,Parent_TF,GBoundBoxs)
{
    var bIsGroup =false;
    var parentOBJ =obj.parentObj;
    
    if(parentOBJ.parentObj.nodename == "g" || parentOBJ.parentObj.nodename == "use")
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
    //back ground draw
    var r_rx =obj.rx;
    var r_ry =obj.ry;
    var r_x =obj.x;
    var r_y =obj.y;
    var r_width = obj.width;
    var r_height = obj.height;

    ctx.beginPath();
    ctx.moveTo(r_x + r_rx, r_y);
    ctx.lineTo(r_x + r_width - r_rx, r_y);
    ctx.quadraticCurveTo(r_x + r_width, r_y, r_x + r_width, r_y + r_ry)
    ctx.lineTo(r_x + r_width, r_y + r_height - r_ry);
    ctx.quadraticCurveTo(r_x + r_width, r_y + r_height, r_x + r_width - r_rx, r_y + r_height)
    ctx.lineTo(r_x + r_rx, r_y + r_height);
    ctx.quadraticCurveTo(r_x, r_y + r_height, r_x, r_y + r_height - r_ry)
    ctx.lineTo(r_x, r_y + r_ry);
    ctx.quadraticCurveTo(r_x, r_y, r_x + r_rx, r_y)
    ctx.closePath();
    
    ctx.globalAlpha=obj.fill_opacity;
    ctx.fill();
    ctx.globalAlpha=obj.stroke_opacity;
    ctx.stroke();
    ///////////////////////////////////////////////////////////////////
    //series information draw
    var serieslist = obj.parentObj.trendSeriesList;
    var fontheight = obj.font_highest_height;
    var fontwidth = obj.font_highest_width;
    var symbolsize = obj.symbol_size;
    var cur_x = obj.x;
    var cur_y = obj.y;
    var start_x = obj.x;
    var start_y = obj.y;
    var end_x;
    var end_y;
    var list_harf;
    if(symbolsize < fontheight)
    {
        list_harf = fontheight/2;
    }
    else
    {
        list_harf = symbolsize/2;
    }
    if(obj.position == "top" || obj.position == "bottom")
    {
        var row = 0;
        var col = 0;
        for(var i = 0;i<serieslist.length;i++)
        {
            ///////////////////////////////////////////////////////////////////
            //기본위치 설정
            start_x = obj.x + obj.gap.left + col * (fontwidth + obj.gap.symbol_text + obj.gap.series);
            start_y = obj.y + obj.gap.top + row * obj.gap.row;
            end_x = start_x + (fontwidth + obj.gap.symbol_text + obj.gap.series);
            end_y = start_y + obj.gap.row;
            if(end_x > obj.parentObj.width)
            {
                col = 0;
                row++;
            }
            else
            {
                col++;
            }
            ///////////////////////////////////////////////////////////////////
            //시리즈 라인색상 및 심볼모양, 색상 표현
            ctx.beginPath();
            ctx.moveTo(start_x, start_y + list_harf);
            ctx.lineTo(start_x + symbolsize, start_y + list_harf);
            ctx.strokeStyle = serieslist[i].stroke;
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = serieslist[i].stroke_opacity;
            ctx.stroke();
            DrawSymbol(serieslist[i], start_x + list_harf, start_y + list_harf, symbolsize);
            ///////////////////////////////////////////////////////////////////
            
            ///////////////////////////////////////////////////////////////////
            //텍스트 처리
            //anchor처리시 텍스트 크기를 얻어야한다.
            var AreaX = start_x + symbolsize + obj.gap.symbol_text;
            var AreaY = start_y + fontheight;
            var baseLineShift = 0;

            fontstyle(obj, canvas_2Ddraw);
            
            canvas_2Ddraw.textAlign = "start";
            canvas_2Ddraw.globalAlpha = 1;
            canvas_2Ddraw.fillText(serieslist[i].id, AreaX, AreaY);
        }
    }
    else if(obj.position == "left" || obj.position == "right"|| obj.position == "left top"|| obj.position == "right top")
    {
        var row = 0;
        var col = 0;
        for(var i = 0;i<serieslist.length;i++)
        {
            ///////////////////////////////////////////////////////////////////
            //기본위치 설정
            start_x = obj.x + obj.gap.left + col * (fontwidth + obj.gap.symbol_text + obj.gap.series);
            start_y = obj.y + obj.gap.top + row * (obj.gap.row + fontheight);
            end_x = start_x + (fontwidth + obj.gap.symbol_text + obj.gap.series);
            end_y = start_y + obj.gap.row;
            if(end_y > obj.parentObj.height)
            {
                row = 0;
                col++;
            }
            else
            {
                row++;
            }
            ///////////////////////////////////////////////////////////////////
            //시리즈 라인색상 및 심볼모양, 색상 표현
            ctx.beginPath();
            ctx.moveTo(start_x, start_y + list_harf);
            ctx.lineTo(start_x + symbolsize, start_y + list_harf);
            ctx.strokeStyle = serieslist[i].stroke;
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = serieslist[i].stroke_opacity;
            ctx.stroke();
            DrawSymbol(serieslist[i], start_x + list_harf, start_y + list_harf, symbolsize);
            ///////////////////////////////////////////////////////////////////
            
            ///////////////////////////////////////////////////////////////////
            //텍스트 처리
            //anchor처리시 텍스트 크기를 얻어야한다.
            var AreaX = start_x + symbolsize + obj.gap.symbol_text;
            var AreaY = start_y + fontheight;
            var baseLineShift = 0;

            fontstyle(obj, canvas_2Ddraw);
            
            canvas_2Ddraw.textAlign = "start";
            canvas_2Ddraw.globalAlpha = 1;
            canvas_2Ddraw.fillText(serieslist[i].id, AreaX, AreaY);
        }
    }
        
    
	return ctx.getMatrix();
}

function DrawTrendxaxisObj(obj,Parent_TF,GBoundBoxs)
{
    var bIsGroup =false;
    var parentOBJ =obj.parentObj;
    
    if(parentOBJ.parentObj.nodename == "g" || parentOBJ.parentObj.nodename == "use")
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
    // trend와 graph의 객체를 사용하기 쉽게 저장
    var trendobj = obj.parentObj;
    var graphobj = trendobj.graph;
    
    ///////////////////////////////////////////////////////////////////
    //x축 값 및 라벨 리스트
    var duration = trendobj.duration*1000;
    var scale_tick = duration/graphobj.xaxis_count;
    var xscale;
    var xaxis_min_scale;
    var xaxis_scale;
    
    if(trendobj.trend_flow == "on")
    {
        xscale = duration/graphobj.xaxis_count;
    }
    else if(trendobj.trend_flow == "off")
    {
        xscale = (trendobj.xview_max - trendobj.xview_min)/graphobj.xaxis_count;
    }
    
    if(trendobj.xview_min%xscale)// 첫번째 값 가져오기
    {
        xaxis_min_scale = trendobj.xview_min + (xscale - (trendobj.xview_min%xscale));
    }
    else//없다면 x축 최소값 부터
    {
        xaxis_min_scale = trendobj.xview_min;
    }
    xaxis_scale = xaxis_min_scale;
    obj.xaxislist = [];
    
    for(xaxis_scale; xaxis_scale <= trendobj.xview_max; xaxis_scale = xaxis_scale + xscale)// 각각의 눈금 값을 저장한다.
    {
        if(xaxis_scale >= trendobj.xview_min)
        {
            obj.xaxislist.push(Number(xaxis_scale.toFixed(obj.decimal_point)));
        }
        if(obj.xaxislist.length > (graphobj.xaxis_count + 1))
        {
            break;
        }
    }
    ///////////////////////////////////////////////////////////////////
    //x축 라인 구현 위치별로 그리는 방식 적용
    if(trendobj.xaxis_visible != "hidden")
    {
        var x = 0;
        var y = 0;
        var width = graphobj.width;
        var height = graphobj.height;
        var datalist = obj.xaxislist;

        if(obj.position == "top")
        {
            x = graphobj.x;
            y = graphobj.y;
        }
        else if(obj.position == "bottom")
        {
            x = graphobj.x;
            y = graphobj.y + graphobj.height;
        }
        else
        {
            return;
        }

        if(datalist.length == 0)
        {
            console.log("no xaxis data");
            return;
        }

        //var duration = trendobj.duration;
        var xaxis_gap;
        if(trendobj.trend_flow == "on")
        {
            xaxis_gap = graphobj.width/duration;
        }
        else
        {
            xaxis_gap = graphobj.width/(trendobj.xview_max - trendobj.xview_min);
        }
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        if(graphobj.xaxis_count)
        {
            if(obj.mainscale == "on")
            {
                if(obj.position == "top")
                {
                    for(var i = 0; i < graphobj.xaxis_count;i++)
                    {
                        var xaxis_cal = x + (datalist[i] - trendobj.xview_min) * xaxis_gap;
                        ctx.moveTo(xaxis_cal, y);
                        ctx.lineTo(xaxis_cal, y - obj.scale_length);
                    }
                }
                else if(obj.position == "bottom")
                {
                    for(var i = 0; i < graphobj.xaxis_count;i++)
                    {
                        var xaxis_cal = x + (datalist[i] - trendobj.xview_min) * xaxis_gap;
                        ctx.moveTo(xaxis_cal, y);
                        ctx.lineTo(xaxis_cal, y + obj.scale_length);
                    }
                }
                else
                {
                    console.log("x축의 위치 값이 잘못 됨");
                    return;
                }
            }
        }
        ctx.closePath();

        ctx.globalAlpha=obj.fill_opacity;
        ctx.fill();
        ctx.globalAlpha=obj.stroke_opacity;
        ctx.stroke();
        
        //////////////////////////////////////////////
        //ctx.font = "italic bold 48px  serif";
        fontstyle(obj, canvas_2Ddraw);
        //anchor처리시 텍스트 크기를 얻어야한다.
        var AreaX;
        var AreaY;
        var baseLineShift = 0;

        if(obj.position == "top")
        {
            AreaY = graphobj.y - obj.scale_length;
        }
        else if(obj.position == "bottom")
        {
            AreaY = graphobj.y + graphobj.height + obj.scale_length + obj.font_height;
        }

        if(obj.xaxislist.length)
        {
            for(var i = 0;i < obj.xaxislist.length;i++)
            {
                AreaX = graphobj.x + (datalist[i] - trendobj.xview_min) * xaxis_gap;

                if(parseFloat(obj.baseline_shift))
                {
                    baseLineShift = parseFloat(obj.baseline_shift) * (parseFloat(obj.baseline_shift) *0.01);
                    AreaY = AreaY - baseLineShift;
                }
                canvas_2Ddraw.textAlign = "center";
                canvas_2Ddraw.globalAlpha = 1;
                var format_text = labelformat(trendobj,datalist[i],obj.label_format);
                canvas_2Ddraw.fillText(format_text, AreaX, AreaY);
            }
        }
    }
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
    
	return ctx.getMatrix();
}

function DrawTrendyaxisObj(obj,Parent_TF,GBoundBoxs)
{
    var bIsGroup =false;
    var parentOBJ =obj.parentObj;
    
    if(parentOBJ.parentObj.nodename == "g" || parentOBJ.parentObj.nodename == "use")
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
    // trend와 graph의 객체를 사용하기 쉽게 저장
    var trendobj = obj.parentObj;
    var graphobj = trendobj.graph;
    
    ///////////////////////////////////////////////////////////////////
    //y축 값 및 라벨 리스트
    var yscale = (trendobj.yview_max - trendobj.yview_min)/graphobj.yaxis_count;
//    var yaxis_min_scale = trendobj.yview_min;
    var yaxis_scale = trendobj.yview_min;
    /*
    if(obj.yaxislist.length)// 배열의 첫번째 값 가져오기
    {
        yaxis_min_scale = obj.yaxislist[0];
    }
    else//없다면 0부터
    {
        yaxis_min_scale = trendobj.yview_min;
    }
    yaxis_scale = yaxis_min_scale;
    */
    obj.yaxislist = [];
    
    for(yaxis_scale; yaxis_scale <= trendobj.yview_max; yaxis_scale = yaxis_scale + yscale)// 각각의 눈금 값을 저장한다.
    {
        if(yaxis_scale >= trendobj.yview_min)
        {
            obj.yaxislist.push(yaxis_scale.toFixed(obj.decimal_point));
        }
        if(obj.yaxislist.length > (graphobj.yaxis_count + 1))
        {
            break;
        }
    }
    ///////////////////////////////////////////////////////////////////
    //y축 라인 구현 위치별로 그리는 방식 적용
    if(trendobj.yaxis_visible != "hidden")
    {
        var x = 0;
        var y = 0;
        var width = graphobj.width;
        var height = graphobj.height;
        var datalist = obj.yaxislist;

        if(obj.position == "left")
        {
            x = graphobj.x;
            y = graphobj.y + height;
        }
        else if(obj.position == "right")
        {
            x = graphobj.x + width;
            y = graphobj.y + height;
        }
        else
        {
            return;
        }

        if(datalist.length == 0)
        {
            console.log("no yaxis data");
            return;
        }

        var yaxis_gap = height/(trendobj.yview_max - trendobj.yview_min);

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - height);
        if(graphobj.yaxis_count)
        {
            if(obj.mainscale == "on")
            {
                if(obj.position == "left")
                {
                    for(var i = 0; i < graphobj.yaxis_count;i++)
                    {
                        var yaxis_cal = y - (datalist[i] - trendobj.yview_min) * yaxis_gap;
                        ctx.moveTo(x, yaxis_cal);
                        ctx.lineTo(x - obj.scale_length, yaxis_cal);
                    }
                }
                else if(obj.position == "right")
                {
                    for(var i = 0; i < graphobj.yaxis_count;i++)
                    {
                        var yaxis_cal = y - (datalist[i] - trendobj.yview_min) * yaxis_gap;
                        ctx.moveTo(x + width, yaxis_cal);
                        ctx.lineTo(x + width + obj.scale_length, yaxis_cal);
                    }
                }
                else
                {
                    console.log("y축의 위치 값이 잘못 됨");
                    return;
                }
            }
        }
        ctx.closePath();

        ctx.globalAlpha=obj.fill_opacity;
        ctx.fill();
        ctx.globalAlpha=obj.stroke_opacity;
        ctx.stroke();
        
        //////////////////////////////////////////////
        //ctx.font = "italic bold 48px  serif";
        fontstyle(obj, canvas_2Ddraw);
        //anchor처리시 텍스트 크기를 얻어야한다.
        var AreaX;
        var AreaY;
        var baseLineShift = 0;

        if(obj.position == "left")
        {
            AreaX = graphobj.x - obj.scale_length;
        }
        else if(obj.position == "right")
        {
            AreaX = graphobj.x + obj.scale_length;
        }

        if(obj.yaxislist.length)
        {
            for(var i = 0;i < obj.yaxislist.length;i++)
            {
                AreaY = graphobj.y + graphobj.height + obj.font_height/3 - (datalist[i] - trendobj.yview_min) * yaxis_gap;

                if(parseFloat(obj.baseline_shift))
                {
                    baseLineShift = parseFloat(obj.baseline_shift) * (parseFloat(obj.baseline_shift) *0.01);
                    AreaY = AreaY - baseLineShift;
                }
                if(obj.position == "left")
                {
                    canvas_2Ddraw.textAlign = "end";
                }
                else if(obj.position == "right")
                {
                    canvas_2Ddraw.textAlign = "start";
                }
                //else
                //{
                //    canvas_2Ddraw.textAlign = obj.text_anchor;
                //}
                canvas_2Ddraw.globalAlpha = 1;
                canvas_2Ddraw.fillText(datalist[i], AreaX, AreaY);
            }
        }
    }
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
    
	return ctx.getMatrix();
}

function SetStyleGrid(obj)
{
    ctx.strokeStyle = obj.grid_stroke;
    
    if(obj.grid_stroke_width !='undefined')
    {
        ctx.lineWidth = obj.grid_stroke_width;
    }
   else
    {
        ctx.lineWidth = 1;
    }
	
    var gaps = ToNumberArray(obj.grid_stroke_dasharray);
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

function DrawTrendgraphObj(obj,Parent_TF,GBoundBoxs)
{
    var bIsGroup =false;
    var parentOBJ =obj.parentObj;
    var trendobj = parentOBJ;
    if(parentOBJ.parentObj.nodename == "g" || parentOBJ.parentObj.nodename == "use")
    {bIsGroup =true;}
    else
    {bIsGroup =false;}
    
    ctx.setMatrix(Parent_TF);
    SetTransform(obj);
    
    if(obj.visibility == false)
    {
        return ctx.getMatrix();
    }

    var x =obj.x;
    var y =obj.y;
    var width = obj.width;
    var height = obj.height;
    var xaxis_gap;
    var yaxis_gap = obj.height/(trendobj.yview_max - trendobj.yview_min);
    
    if(trendobj.trend_flow == "on")
    {
        xaxis_gap = obj.width/(trendobj.duration*1000);
    }
    else
    {
        xaxis_gap = obj.width/(trendobj.xview_max - trendobj.xview_min);
    }
    
    //배경 그리기
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.globalAlpha=obj.fill_opacity;
    ctx.fill();
    
    //그래프선 그리기
	ctx.save();
    ctx.beginPath();
	ctx.rect(obj.x, obj.y, obj.width, obj.height);
    canvas_2Ddraw.clip();
	SetStyleGrid(obj);
	if(obj.xaxis_count && obj.yaxis_count)
    {
        if(trendobj.xaxis.xaxislist)
        {
            for(var i in trendobj.xaxis.xaxislist)
            {
				if(trendobj.xaxis.xaxislist[i] > trendobj.xview_min && trendobj.xaxis.xaxislist[i] < trendobj.xview_max)
				{
					var xaxis_cal = x + (trendobj.xaxis.xaxislist[i] - trendobj.xview_min) * xaxis_gap;
					ctx.moveTo(xaxis_cal, y);
					ctx.lineTo(xaxis_cal, y + height);
				}
            }
        }
        if(trendobj.yaxis.yaxislist)
        {
            for(var i in trendobj.yaxis.yaxislist)
            {	
				if(trendobj.yaxis.yaxislist[i] > trendobj.yview_min && trendobj.yaxis.yaxislist[i] < trendobj.yview_max)
				{
					var yaxis_cal = (y + height) - (trendobj.yaxis.yaxislist[i] - trendobj.yview_min) * yaxis_gap;
					ctx.moveTo(x,yaxis_cal);
					ctx.lineTo(x + width,yaxis_cal);
				}
            }
        }
    }
	ctx.globalAlpha=obj.grid_stroke_opacity;
    ctx.closePath();
    ctx.stroke();
	
    SetStyle(obj);
	ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x+ width, y + height);
	ctx.lineTo(x, y + height);
	ctx.lineTo(x, y);
	ctx.closePath();
    ctx.globalAlpha=obj.stroke_opacity;
    ctx.stroke();
	ctx.restore();
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

function DrawTrendseriesObj(obj,Parent_TF)
{
    
    var bIsGroup =false;
    var parentOBJ =obj.parentObj;
    
    if(parentOBJ.parentObj.nodename == "g" || parentOBJ.parentObj.nodename == "use")
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
    var trendobj = obj.parentObj;
    if(trendobj.trend_flow == "off")
    {
        if(obj.olddata != obj.data)
        {
            obj.olddata = obj.data;
            obj.series_data = [];
            var point_check = 0;
            var point_x = 0;
            var point_y = 0;
            var strTmp = "";
            for(var i = 0; i < obj.data.length; i++)
            {
                if (obj.data[i] == ',' && point_check == 0)
                {
                    point_x = parseFloat(Number(strTmp));
                    strTmp = "";
                    point_check++;
                }
                else if (obj.data[i] == ' ' && strTmp != "" && point_check == 1)
                {
                    point_y = parseFloat(Number(strTmp));
                    var insert_data = new data_point(point_x, point_y);
                    obj.series_data.push(insert_data);
                    strTmp = "";
                    point_check = 0;
                }
                else if (obj.data[i] != ' ')
                {
                    strTmp += obj.data[i];
                }
            }
            point_y = parseFloat(Number(strTmp));
            var insert_data = new data_point(point_x, point_y);
            obj.series_data.push(insert_data);
        }
    }
    ///////////////////////////////////////////////////////////////////
    var graphobj = obj.parentObj.graph;
    var start_x = graphobj.x;
    var start_y = graphobj.y;
    var x = 0;
    var y = 0;
    var start_data_number = 0;
    var data = obj.series_data;
    var previous_data;
    var xaxis_gap = graphobj.width/(trendobj.xview_max - trendobj.xview_min);
    var yaxis_gap = graphobj.height/(trendobj.yview_max - trendobj.yview_min);
    var data_interval = parseInt(data.length / obj.series_max_size);
    
    if(data_interval == 0)
    {
        data_interval = 1;
    }
    
    if(data.length)
    {
        if(trendobj.direction == "left-right")
        {
            start_x = graphobj.x;
        }
        else if(trendobj.direction == "right-left")
        {
            start_x = graphobj.x + graphobj.width;
        }
        if(trendobj.direction_y == "down-top")
        {
            start_y = graphobj.y + graphobj.height;
        }
        else if(trendobj.direction_y == "top-down")
        {
            start_y = graphobj.y;
        }

        if(trendobj.direction_y == undefined && trendobj.direction == undefined)//기본 값 down top, right left
        {
            start_x = graphobj.x;
            start_y = graphobj.y + graphobj.height;
        }
        previous_data = data[0];

        for(start_data_number;start_data_number < data.length;start_data_number = start_data_number + data_interval)
        {
            if(data[start_data_number].x >= trendobj.xview_min)
            {
                break;
            }
        }
        if(start_data_number >= 1)
        {
            if((start_data_number - data_interval)>=0)
            {
                start_data_number = start_data_number - data_interval;
            }
        }
        ctx.save();
        ctx.beginPath();
		ctx.rect(graphobj.x, graphobj.y, graphobj.width, graphobj.height);
        canvas_2Ddraw.clip();
		
        if(obj.series_type == "line")
        {
            var symbol_cor = [];
			ctx.beginPath();
            for(var i = start_data_number; i < data.length; i = i + data_interval)
            {
                if(trendobj.direction == "right-left")
                {
                    x = start_x - (data[i].x - trendobj.xview_min) * xaxis_gap;
                }
                else if(trendobj.direction == "left-right")
                {
                    x = start_x + (data[i].x - trendobj.xview_min) * xaxis_gap;
                }
                if(trendobj.direction_y == "down-top")
                {
                    y = start_y - (data[i].y - trendobj.yview_min) * yaxis_gap;
                }
                else if(trendobj.direction_y == "top-down")
                {
                    y = start_y + (data[i].y - trendobj.yview_min) * yaxis_gap;
                }
                if(i == 0)
                {
                    ctx.moveTo(x,y);
                }
                ctx.lineTo(x,y);
                
                symbol_cor.push(new data_point(x,y));
                
                if(trendobj.xview_max < data[i].x)
                {
                    break;
                }
            }
            ctx.globalAlpha=obj.stroke_opacity;
            ctx.stroke();
			if(obj.symbol_type != "none")
			{
				for(var i = 0;i <symbol_cor.length;i++)
				{
					DrawSymbol(obj,symbol_cor[i].x,symbol_cor[i].y);
				}
			}
        }
        else if(obj.series_type == "scatter")
        {
            for(var i = start_data_number; i < data.length; i = i + data_interval)
            {
                if(trendobj.direction == "right-left")
                {
                    x = start_x - (data[i].x - trendobj.xview_min) * xaxis_gap;
                }
                else if(trendobj.direction == "left-right")
                {
                    x = start_x + (data[i].x - trendobj.xview_min) * xaxis_gap;
                }
                if(trendobj.direction_y == "down-top")
                {
                    y = start_y - (data[i].y - trendobj.yview_min) * yaxis_gap;
                }
                else if(trendobj.direction_y == "top-down")
                {
                    y = start_y + (data[i].y - trendobj.yview_min) * yaxis_gap;
                }
                DrawSymbol(obj,x,y);
                if(trendobj.xview_max < data[i].x)
                {
                    break;
                }
            }
        }
        ctx.restore();
    }
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
    
    return ctx.getMatrix();
}