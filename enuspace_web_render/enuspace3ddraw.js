var scene = null;
var camera = null;
var camera_distance = null;
var renderer = null;
var gl = null;
var shaderProgram = null;
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var cameraRotationMatrix = mat4.create();
mat4.identity(cameraRotationMatrix);
var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();
var root_obj_3d = null;

//animation frame id
var animationframe_id = null;

function struct_3d_size(x, y, z)
{
    if(x || y || z)
    {
        this.x = x; this.y = y; this.z = z;
    }
    else
    {
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}

function handleMouseUp(event) {
    mouseDown = false;
}

function handleMouseMove(event) {
    if (!mouseDown) {
        return;
    }
    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - lastMouseX;
    var newRotationMatrix = mat4.create();
    mat4.identity(newRotationMatrix);
    mat4.rotate(newRotationMatrix, degToRad(deltaX / 10), [0, 0, 1]);

    var deltaY = newY - lastMouseY;
    mat4.rotate(newRotationMatrix, degToRad(deltaY / 10), [1, 0, 0]);

    mat4.multiply(newRotationMatrix, cameraRotationMatrix, cameraRotationMatrix);

    lastMouseX = newX;
    lastMouseY = newY;
}

function handlemousewheel(e){
    var evt = window.event || e; //equalize event object
    var delta = evt.detail? evt.detail*(-120) : evt.wheelDelta; //check for detail first so Opera uses that instead of wheelDelta
	var pointerAbsolutePosition = new coordinates();
	
	var fValue = 1;
    if(delta < 0)
    {
        fValue = 1.1;
    }
    else if(delta > 0)
    {
        fValue = 0.9;
    }	
	
	camera_distance *= fValue;
}

function draw_3d() {
    drawScene(root_obj_3d);
//    renderer.render( scene, camera );
//    animate();
}

function initGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = window.innerWidth;
		gl.viewportHeight = window.innerHeight;
        gl.canvas.width = window.innerWidth;
        gl.canvas.height = window.innerHeight;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
}

function initDraw(rootobj) {
    var canvas3d = document.getElementById("ID_CANVAS_3D");
	if(canvas3d.getAttribute("hidden") != null)
	{
		canvas3d.removeAttribute("hidden");
	}
    initGL(canvas3d);
    camera = new THREE.PerspectiveCamera(75, gl.viewportWidth / gl.viewportHeight, 0.1, 10000.0);
    camera.position.y = 10;
    camera.position.z = 1000;
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer(gl);
    
    /*var material = new THREE.MeshBasicMaterial( { color: "rgb(255,0,255)" } );
    object = new THREE.Mesh( new THREE.BoxGeometry( 200, 200, 200, 4, 4, 4 ), material );
    object.position.set( 0, 0, 0 );
    scene.add( object );
    renderer.render( scene ,camera);*/

    /*
    //TextGeometry(text, parameters)
    //text — The text that needs to be shown. 
    //parameters — Object that can contains the following parameters.
    //font — an instance of THREE.Font.
    //size — Float. Size of the text. Default is 100.
    //height — Float. Thickness to extrude text. Default is 50.
    //curveSegments — Integer. Number of points on the curves. Default is 12.
    //bevelEnabled — Boolean. Turn on bevel. Default is False.
    //bevelThickness — Float. How deep into text bevel goes. Default is 10.
    //bevelSize — Float. How far from text outline is bevel. Default is 8.
    //bevelSegments — Integer. Number of bevel segments. Default is 3.
    var loader = new THREE.FontLoader();

    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
        var geometry = new THREE.TextGeometry( 'test font!', {
            font: font,
            size: 2,
            height: 0.5,
            curveSegments: 3
        } );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        text = new THREE.Mesh( geometry, material );
        scene.add( text );
    } );
    */
    
    initShaders();
//    initTexture();
    root_obj_3d = rootobj;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    camera_distance = 1000; // default
    gl.disable(gl.CULL_FACE);
    
    canvas3d.addEventListener("mousedown",handleMouseDown,false);
    canvas3d.addEventListener("mouseup",handleMouseUp,false);
    canvas3d.addEventListener("mousemove",handleMouseMove,false);
    mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel"
        
    if (canvas.attachEvent) //if IE (and Opera depending on user setting)
    {
        canvas3d.attachEvent("on"+mousewheelevt, handlemousewheel);
    }
    else if (canvas.addEventListener) //WC3 browsers
    {
        canvas3d.addEventListener(mousewheelevt,handlemousewheel,false);
    }
    

    draw_3d();
    animationframe_id = window.requestAnimationFrame(draw_3d);
}

function initShaders() {
    
    var frag_str = "precision mediump float;varying vec4 vColor;void main(void){ gl_FragColor = vColor;}"
    var vertex_str = "attribute vec3 aVertexPosition;attribute vec4 aVertexColor;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;uniform mat4 u_xformMatrix;varying vec4 vColor; void main(void) { gl_Position = uPMatrix * uMVMatrix * u_xformMatrix * vec4(aVertexPosition, 1.0); vColor = aVertexColor;}"
    
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);

    //fragment shader
    gl.shaderSource(fragmentShader, frag_str);
    gl.compileShader(fragmentShader);
    //vertex shader
    gl.shaderSource(vertexShader, vertex_str);
    gl.compileShader(vertexShader);
    
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function GetColorByValue(obj, fValue)
{
    var split_elevation = obj.colorElevation.split(";");
	var icount = split_elevation.length - 1;

	var rate = (obj.maxElevation - obj.minElevation) / icount;

	var i = 0;
    var color = split_elevation[0];
	for(var i = 0; i <= icount; i++)
    {
		if (obj.minElevation + (i * rate) >= fValue)
        {
            if(obj.minElevation + (i * rate) - (rate/2) > fValue && i > 0)
            {
                color = split_elevation[i-1];
                return color;
            }
            else
            {
                color = split_elevation[i];
                return color;
            }
        }
	}
	return color;
}

function drawScene(parentobj) {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    mat4.perspective(75, gl.viewportWidth / gl.viewportHeight, 0.1, 10000.0, pMatrix);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0.0, 0.0, -(camera_distance)]);
    mat4.rotate(mvMatrix, degToRad(-70), [1, 0, 0]);
    mat4.multiply(mvMatrix, cameraRotationMatrix);
    
    if(parentobj)
	{
		if(parentobj.nodename == "Scene")
		{
			
		}

		if(child != 0)
		{
            for (var i=0;i<parentobj.childNodes.length;i++)
			{
                var child = parentobj.childNodes[i];
                if(child.nodename == "Box")
                {
                    DrawBox(child);
                }
                else if(child.nodename == "Text")
                {
                    //DrawText(child);
                }
                else if(child.nodename == "Cone")
                {
                    DrawCone(child);
                }
                else if(child.nodename == "Cylinder")
                {
                    DrawCylinder(child);
                }
                else if(child.nodename == "Sphere")
                {
                    DrawSphere(child);
                }
                else if(child.nodename == "LineSet")
                {
                    DrawLineSet(child);
                }
                else if(child.nodename == "IndexedFaceSet")
                {
                    DrawIndexedFaceSet(child);
                }
                else if(child.nodename == "Terrain")
                {
                    DrawTerrain(child);
                }
                else if(child.nodename == "Contour3D")
                {
                    Draw3DContour(child);
                }
                else if(child.nodename == "inline")
                {
                   
                }
                if(child.nextElementSibling)
				{
					child = child.nextElementSibling;
				}
			}
		}
	}
}
/*
var lastTime = 0;

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime !== 0) {
        var elapsed = timeNow - lastTime;

        rPyramid += (90 * elapsed) / 1000.0;
        rCube -= (75 * elapsed) / 1000.0;
    }
    lastTime = timeNow;
}
*/
function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length === 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}

function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

    var normalMatrix = mat3.create();
    mat4.toInverseMat3(mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}

function DrawBox(obj) {
    var size = new struct_3d_size((obj.size_x/2) * obj.scale_x, (obj.size_y/2) * obj.scale_y, (obj.size_z/2) * obj.scale_z);

    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    vertices = [
        -size.x, size.y, size.z, //[0]
         size.x, size.y, size.z, //[1]
        -size.x,-size.y, size.z, //[2]
         size.x,-size.y, size.z, //[3]
        -size.x, size.y, -size.z, //[4]
         size.x, size.y, -size.z, //[5]
        -size.x,-size.y, -size.z, //[6]
         size.x,-size.y, -size.z //[7]
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = 8;

    cubeVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    var colors = [];
    for(var i = 0; i < 8;i++)
    {
        colors.push(parseFloat(obj.diffuseColor[0]), parseFloat(obj.diffuseColor[1]), parseFloat(obj.diffuseColor[2]), 1.0);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    cubeVertexColorBuffer.itemSize = 4;
    cubeVertexColorBuffer.numItems = 8;

    cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    var cubeVertexIndices = [
        0, 1, 2,      2, 1, 3,  //front
        5, 4, 7,      7, 4, 6,  //back
        4, 5, 0,      0, 5, 1,  //top
        2, 3, 6,      6, 3, 7,  //bottom
        4, 0, 6,      6, 0, 2,  //left
        1, 5, 3,      3, 5, 7   //right
    ];
    
    //var cubeVertexIndices = [ //triangle_strip buffer
    //    4, 5, 0, 1, 2, 3, 1, 7,
    //    5, 6, 4, 0, 6, 2, 7, 3
    //];
    
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    cubeVertexIndexBuffer.itemSize = 1;
    cubeVertexIndexBuffer.numItems = 36;
    
    mvPushMatrix();
    mat4.translate(mvMatrix, [obj.translation_x, obj.translation_y, obj.translation_z]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_x), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_y), [0, 1, 0]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_z), [0, 0, 1]);
    mat4.translate(mvMatrix, [obj.center_x, obj.center_y, obj.center_z]);
    
	var xformMatrix = new Float32Array([
		obj.scale_x,   0.0,  0.0,  0.0,
		0.0,  obj.scale_y,   0.0,  0.0,
		0.0,  0.0,  obj.scale_z,   0.0,
		0.0,  0.0,  0.0,  1.0  
	]);

	var u_xformMatrix = gl.getUniformLocation(shaderProgram, 'u_xformMatrix');
	gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
	
    //vertex버퍼 바인드
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //색상 vertex버퍼 바인드
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //인덱스 버퍼 바인드
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();
}

function DrawCone(obj) {
    var def_d = 360 / obj.subdivision;
    var conevertices = [
        0, 0, obj.height/2,//상단 꼭지점
        0, 0,-(obj.height/2)//하단 중앙점
    ];//콘의 상단 꼭지점과 하단 중앙점을 먼저 넣는다.
    for (var k = 0; k <= 360; k += def_d)
    {
        conevertices.push(Math.cos(degToRad(k))*obj.bottomRadius, Math.sin(degToRad(k))*obj.bottomRadius, -(obj.height/2));
    }

    //The following code snippet creates a vertex buffer and binds data to it
    coneVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(conevertices), gl.STATIC_DRAW);
    coneVertexBuffer.itemSize = 3;
    coneVertexBuffer.numItems = conevertices.length/3;
     
    var colors = [];
    for(var i = 0; i < coneVertexBuffer.numItems; i++)
    {
        colors.push(parseFloat(obj.diffuseColor[0]), parseFloat(obj.diffuseColor[1]), parseFloat(obj.diffuseColor[2]), 1.0);
    }
    coneVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    coneVertexColorBuffer.itemSize = 4;
    coneVertexColorBuffer.numItems = colors.length/4;
    
    var topindices = [0];
    for(var i = 2; i < coneVertexBuffer.numItems; i++)
    {
        topindices.push(i);
    }
    var bottomindices = [1];
    for(var i = 2; i < coneVertexBuffer.numItems; i++)
    {
        bottomindices.push(i);
    }
    
    conetopIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, conetopIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(topindices), gl.STATIC_DRAW);
    conetopIndexBuffer.itemSize = 1;
    conetopIndexBuffer.numItems = topindices.length;
    
    conebottomIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, conebottomIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(bottomindices), gl.STATIC_DRAW);
    conebottomIndexBuffer.itemSize = 1;
    conebottomIndexBuffer.numItems = bottomindices.length;
    
    mvPushMatrix();
    mat4.translate(mvMatrix, [obj.translation_x, obj.translation_y, obj.translation_z]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_x), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_y), [0, 1, 0]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_z), [0, 0, 1]);
    mat4.translate(mvMatrix, [obj.center_x, obj.center_y, obj.center_z]);

	var xformMatrix = new Float32Array([
		obj.scale_x,   0.0,  0.0,  0.0,
		0.0,  obj.scale_y,   0.0,  0.0,
		0.0,  0.0,  obj.scale_z,   0.0,
		0.0,  0.0,  0.0,  1.0  
	]);

	var u_xformMatrix = gl.getUniformLocation(shaderProgram, 'u_xformMatrix');
	gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
	
    //vertex버퍼 바인드
    gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, coneVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //색상 vertex버퍼 바인드
    gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, coneVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //인덱스 버퍼 바인드
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, conetopIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLE_FAN, conetopIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
   
    //vertex버퍼 바인드
    gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, coneVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //색상 vertex버퍼 바인드
    gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, coneVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, conebottomIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLE_FAN, conebottomIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();
}

function DrawSphere(obj) {
    var latitudeBands = obj.subdivision_v;
    var longitudeBands = obj.subdivision_h;
    var radius = obj.radius;

    var vertexPositionData = [];
    for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * (Math.PI*2) / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;

            vertexPositionData.push(radius * x);
            vertexPositionData.push(radius * y);
            vertexPositionData.push(radius * z);
        }
    }

    var indexData = [];
    for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            indexData.push(first);
            indexData.push(second);
            indexData.push(first + 1);

            indexData.push(second);
            indexData.push(second + 1);
            indexData.push(first + 1);
        }
    }

    SphereVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, SphereVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
    SphereVertexPositionBuffer.itemSize = 3;
    SphereVertexPositionBuffer.numItems = vertexPositionData.length / 3;

    SphereVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, SphereVertexColorBuffer);
    var colors = [];
    for(var i = 0; i<SphereVertexPositionBuffer.numItems;i++)
    {
        colors.push(parseFloat(obj.diffuseColor[0]), parseFloat(obj.diffuseColor[1]), parseFloat(obj.diffuseColor[2]), 1.0);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    SphereVertexColorBuffer.itemSize = 4;
    SphereVertexColorBuffer.numItems = SphereVertexPositionBuffer.numItems;

    SphereVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SphereVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
    SphereVertexIndexBuffer.itemSize = 1;
    SphereVertexIndexBuffer.numItems = indexData.length;
    
    //draw 시작
    mvPushMatrix();
    mat4.translate(mvMatrix, [obj.translation_x, obj.translation_y, obj.translation_z]);
    mat4.rotate(mvMatrix, degToRad(-90), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_x), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_y), [0, 1, 0]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_z), [0, 0, 1]);
    mat4.translate(mvMatrix, [obj.center_x, obj.center_y, obj.center_z]);
    
	var xformMatrix = new Float32Array([
		obj.scale_x,   0.0,  0.0,  0.0,
		0.0,  obj.scale_y,   0.0,  0.0,
		0.0,  0.0,  obj.scale_z,   0.0,
		0.0,  0.0,  0.0,  1.0  
	]);

	var u_xformMatrix = gl.getUniformLocation(shaderProgram, 'u_xformMatrix');
	gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
	
    //vertex버퍼 바인드
    gl.bindBuffer(gl.ARRAY_BUFFER, SphereVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, SphereVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //색상 vertex버퍼 바인드
    gl.bindBuffer(gl.ARRAY_BUFFER, SphereVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, SphereVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //인덱스 버퍼 바인드
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, SphereVertexIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, SphereVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();
}

function DrawCylinder(obj) {
    var def_d = 360 / obj.subdivision;
    //상단과 하단의 점들을 먼저 구한다.
    var topvertices = [0, 0, obj.height/2];//실린더의 상단 중앙점을 먼저 넣는다.
    for (var k = 0; k <= 360; k += def_d)
    {
        topvertices.push(Math.cos(degToRad(k))*obj.radius, Math.sin(degToRad(k))*obj.radius, obj.height/2);
    }
    var bottomvertices = [0, 0, -obj.height/2];//실린더의 하단 중앙점을 먼저 넣는다.
    for (var k = 0; k <= 360; k += def_d)
    {
        bottomvertices.push(Math.cos(degToRad(k))*obj.radius, Math.sin(degToRad(k))*obj.radius, -obj.height/2);
    }

    //The following code snippet creates a vertex buffer and binds data to it
    cylindertopVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylindertopVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(topvertices), gl.STATIC_DRAW);
    cylindertopVertexBuffer.itemSize = 3;
    cylindertopVertexBuffer.numItems = topvertices.length/3;
    
    cylinderbottomVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylinderbottomVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bottomvertices), gl.STATIC_DRAW);
    cylinderbottomVertexBuffer.itemSize = 3;
    cylinderbottomVertexBuffer.numItems = bottomvertices.length/3;
    
    var middlevertices = [];
    for(var i = 3; i < topvertices.length; i += 3)
    {
        middlevertices.push(topvertices[i], topvertices[i+1], topvertices[i+2], bottomvertices[i], bottomvertices[i+1], bottomvertices[i+2]);
    }
    cylindermiddleVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylindermiddleVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(middlevertices), gl.STATIC_DRAW);
    cylindermiddleVertexBuffer.itemSize = 3;
    cylindermiddleVertexBuffer.numItems = middlevertices.length/3;
    
    var topbottomcolors = [];
    for(var i = 0; i < cylindertopVertexBuffer.numItems; i++)
    {
        topbottomcolors.push(parseFloat(obj.diffuseColor[0]), parseFloat(obj.diffuseColor[1]), parseFloat(obj.diffuseColor[2]), 1.0);
    }
    cylindertopbottomVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylindertopbottomVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(topbottomcolors), gl.STATIC_DRAW);
    cylindertopbottomVertexColorBuffer.itemSize = 4;
    cylindertopbottomVertexColorBuffer.numItems = topbottomcolors.length/4;
    
    var middlecolors = [];
    for(var i = 0; i < cylindermiddleVertexBuffer.numItems; i++)
    {
        middlecolors.push(parseFloat(obj.diffuseColor[0]), parseFloat(obj.diffuseColor[1]), parseFloat(obj.diffuseColor[2]), 1.0);
    }
    cylindermiddleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cylindermiddleVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(middlecolors), gl.STATIC_DRAW);
    cylindermiddleVertexColorBuffer.itemSize = 4;
    cylindermiddleVertexColorBuffer.numItems = middlecolors.length/4;
    
    var topbottomindices = [];
    for(var i = 0; i < cylindertopbottomVertexColorBuffer.numItems; i++)
    {
        topbottomindices.push(i);
    }
    var middleindices = [];
    for(var i = 0; i < cylindermiddleVertexColorBuffer.numItems; i++)
    {
        middleindices.push(i);
    }
    
    cylindertopbottomIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylindertopbottomIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(topbottomindices), gl.STATIC_DRAW);
    cylindertopbottomIndexBuffer.itemSize = 1;
    cylindertopbottomIndexBuffer.numItems = topbottomindices.length;
    
    cylindermiddleIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylindermiddleIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(middleindices), gl.STATIC_DRAW);
    cylindermiddleIndexBuffer.itemSize = 1;
    cylindermiddleIndexBuffer.numItems = middleindices.length;
    
    //draw 시작
    mvPushMatrix();
    mat4.translate(mvMatrix, [obj.translation_x, obj.translation_y, obj.translation_z]);
    //mat4.rotate(mvMatrix, degToRad(-90), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_x), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_y), [0, 1, 0]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_z), [0, 0, 1]);
    mat4.translate(mvMatrix, [obj.center_x, obj.center_y, obj.center_z]);

	var xformMatrix = new Float32Array([
		obj.scale_x,   0.0,  0.0,  0.0,
		0.0,  obj.scale_y,   0.0,  0.0,
		0.0,  0.0,  obj.scale_z,   0.0,
		0.0,  0.0,  0.0,  1.0  
	]);

	var u_xformMatrix = gl.getUniformLocation(shaderProgram, 'u_xformMatrix');
	gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
	
    //실린더 top 버퍼
    if(obj.top === "true")
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, cylindertopVertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cylindertopVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
        //색상 vertex버퍼 바인드
        gl.bindBuffer(gl.ARRAY_BUFFER, cylindertopbottomVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cylindertopbottomVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        //인덱스 버퍼 바인드
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylindertopbottomIndexBuffer);
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLE_FAN, cylindertopbottomIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    
    //실린더 bottom 버퍼
    if(obj.bottom === "true")
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, cylinderbottomVertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cylinderbottomVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
        //색상 vertex버퍼 바인드
        gl.bindBuffer(gl.ARRAY_BUFFER, cylindertopbottomVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cylindertopbottomVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        //인덱스 버퍼 바인드
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylindertopbottomIndexBuffer);
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLE_FAN, cylindertopbottomIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    
    //실린더 middle 버퍼
    if(obj.side === "true")
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, cylindermiddleVertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cylindermiddleVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
        //색상 vertex버퍼 바인드
        gl.bindBuffer(gl.ARRAY_BUFFER, cylindermiddleVertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, cylindermiddleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        //인덱스 버퍼 바인드
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylindermiddleIndexBuffer);
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLE_STRIP, cylindermiddleIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    mvPopMatrix();
}

function DrawIndexedFaceSet(obj) {
    //The following code snippet creates a vertex buffer and binds data to it
    var point = obj.point;
    FaceSetVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, FaceSetVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(point), gl.STATIC_DRAW);
    FaceSetVertexBuffer.itemSize = 3;
    FaceSetVertexBuffer.numItems = point.length/3;
    
    var colors = [];
    for(var i = 0; i < FaceSetVertexBuffer.numItems; i++)
    {
        colors.push(parseFloat(obj.diffuseColor[0]), parseFloat(obj.diffuseColor[1]), parseFloat(obj.diffuseColor[2]), 1.0);
    }
    FaceSetVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, FaceSetVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    FaceSetVertexColorBuffer.itemSize = 4;
    FaceSetVertexColorBuffer.numItems = colors.length/4;
	
	FaceSetIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, FaceSetIndexBuffer);
    var FaceSetIndices = obj.coordindex;
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(FaceSetIndices), gl.STATIC_DRAW);
    FaceSetIndexBuffer.itemSize = 1;
    FaceSetIndexBuffer.numItems = FaceSetIndices.length;
    
    //draw 시작
    mvPushMatrix();
    mat4.translate(mvMatrix, [obj.translation_x, obj.translation_y, obj.translation_z]);
	mat4.scale(obj.scale_x,obj.scale_y,obj.scale_z);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_x), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_y), [0, 1, 0]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_z), [0, 0, 1]);
    mat4.translate(mvMatrix, [obj.center_x, obj.center_y, obj.center_z]);
	
	var xformMatrix = new Float32Array([
		obj.scale_x,   0.0,  0.0,  0.0,
		0.0,  obj.scale_y,   0.0,  0.0,
		0.0,  0.0,  obj.scale_z,   0.0,
		0.0,  0.0,  0.0,  1.0  
	]);

	var u_xformMatrix = gl.getUniformLocation(shaderProgram, 'u_xformMatrix');
	gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
    
    //gl.lineWidth(2);
    //vertex버퍼 바인드
    gl.bindBuffer(gl.ARRAY_BUFFER, FaceSetVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, FaceSetVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //색상 vertex버퍼 바인드
    gl.bindBuffer(gl.ARRAY_BUFFER, FaceSetVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, FaceSetVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //인덱스 버퍼 바인드
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, FaceSetIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, FaceSetIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();
}

function DrawLineSet(obj) {
    //The following code snippet creates a vertex buffer and binds data to it
    var point = [];
    for(var i = 0; i < obj.point.length; i+=3)
    {
        point.push(parseFloat(obj.point[i]),parseFloat(obj.point[i+1]),parseFloat(obj.point[i+2]));
    }
    lineVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(point), gl.STATIC_DRAW);
    lineVertexBuffer.itemSize = 3;
    lineVertexBuffer.numItems = point.length/3;
    
    var colors = [];
    for(var i = 0; i < lineVertexBuffer.numItems; i++)
    {
        colors.push(parseFloat(obj.diffuseColor[0]), parseFloat(obj.diffuseColor[1]), parseFloat(obj.diffuseColor[2]), 1.0);
    }
    lineVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    lineVertexColorBuffer.itemSize = 4;
    lineVertexColorBuffer.numItems = colors.length/4;
    
    //draw 시작
    mvPushMatrix();
    mat4.translate(mvMatrix, [obj.translation_x, obj.translation_y, obj.translation_z]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_x), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_y), [0, 1, 0]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_z), [0, 0, 1]);
    mat4.translate(mvMatrix, [obj.center_x, obj.center_y, obj.center_z]);
    
	var xformMatrix = new Float32Array([
		obj.scale_x,   0.0,  0.0,  0.0,
		0.0,  obj.scale_y,   0.0,  0.0,
		0.0,  0.0,  obj.scale_z,   0.0,
		0.0,  0.0,  0.0,  1.0  
	]);

	var u_xformMatrix = gl.getUniformLocation(shaderProgram, 'u_xformMatrix');
	gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
	
    //gl.lineWidth(2);
    //vertex버퍼 바인드
    gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, lineVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //색상 vertex버퍼 바인드
    gl.bindBuffer(gl.ARRAY_BUFFER, lineVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, lineVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    setMatrixUniforms();
    gl.drawArrays(gl.LINE_STRIP, 0, lineVertexBuffer.numItems);
    mvPopMatrix();
}

function DrawTerrain(obj)
{
    var x_interval = obj.size_x/obj.subdivision_x;
    var y_interval = obj.size_y/obj.subdivision_y;
    
    var point = [];
    for(var i = 0; i < obj.subdivision_x; i++)
    {
        for(var j = 0; j < obj.subdivision_y; j++)
        {
            point.push(x_interval * i, y_interval * j, obj.data[i][j] == undefined ? obj.minElevation : obj.data[j][i] <= obj.maxElevation ? obj.data[i][j] >= obj.minElevation ? obj.data[i][j] : obj.minElevation : obj.maxElevation);
        }
    }
    TerrainVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, TerrainVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(point), gl.STATIC_DRAW);
    TerrainVertexBuffer.itemSize = 3;
    TerrainVertexBuffer.numItems = point.length/3;
    
    var colors = [];
    for(var i = 0; i < obj.subdivision_x; i++)
    {
        for(var j = 0; j < obj.subdivision_y; j++)
        {
            var str_return = GetColorByValue(obj, obj.data[i][j]);
            var str_rgb = str_return.substring(4, str_return.length-1).split(",");
            colors.push(parseFloat(str_rgb[0])/255, parseFloat(str_rgb[1])/255, parseFloat(str_rgb[2])/255, 1.0);
        }
    }
    TerrainColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, TerrainColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    TerrainColorBuffer.itemSize = 4;
    TerrainColorBuffer.numItems = colors.length/4;
    
    TerrainIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, TerrainIndexBuffer);
    var terrainIndices = [];
    for(var i = 0; i < obj.subdivision_x-1; i++)
    {
        for(var j = 0; j < obj.subdivision_y-1; j++)
        {
            terrainIndices.push((obj.subdivision_y * i) + j, (obj.subdivision_y * (i+1)) + (j+1), (obj.subdivision_y * i) + (j+1),
                               (obj.subdivision_y * i) + j, (obj.subdivision_y * (i+1)) + j, (obj.subdivision_y * (i+1)) + (j+1));
        }
    }
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(terrainIndices), gl.STATIC_DRAW);
    TerrainIndexBuffer.itemSize = 1;
    TerrainIndexBuffer.numItems = terrainIndices.length;
    
    //draw 시작
    mvPushMatrix();
    mat4.translate(mvMatrix, [obj.translation_x, obj.translation_y, obj.translation_z]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_x), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_y), [0, 1, 0]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_z), [0, 0, 1]);
    mat4.translate(mvMatrix, [obj.center_x, obj.center_y, obj.center_z]);
    
	var xformMatrix = new Float32Array([
		obj.scale_x,   0.0,  0.0,  0.0,
		0.0,  obj.scale_y,   0.0,  0.0,
		0.0,  0.0,  obj.scale_z,   0.0,
		0.0,  0.0,  0.0,  1.0  
	]);

	var u_xformMatrix = gl.getUniformLocation(shaderProgram, 'u_xformMatrix');
	gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
	
    //vertex버퍼 바인드
    gl.bindBuffer(gl.ARRAY_BUFFER, TerrainVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, TerrainVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //색상 vertex버퍼 바인드
    gl.bindBuffer(gl.ARRAY_BUFFER, TerrainColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, TerrainColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //인덱스 버퍼 바인드
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, TerrainIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, TerrainIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();
}

function Draw3DContour(obj)
{
    var x_interval = obj.size_x/obj.subdivision_x;
    var y_interval = obj.size_y/obj.subdivision_y;
    var z_interval = obj.height/obj.subdivision_z;
    
    var point = [];
    for(var i = 0; i < obj.subdivision_x; i++)
    {
        for(var j = 0; j < obj.subdivision_y; j++)
        {
            for(var k = 0; k < obj.subdivision_z; k++)
            {
                point.push(x_interval * i, y_interval * j, z_interval * k);
            }
        }
    }
    ContourVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ContourVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(point), gl.STATIC_DRAW);
    ContourVertexBuffer.itemSize = 3;
    ContourVertexBuffer.numItems = point.length/3;
    
    var colors = [];
    for(var i = 0; i < obj.subdivision_x; i++)
    {
        for(var j = 0; j < obj.subdivision_y; j++)
        {
            for(var k = 0; k < obj.subdivision_z; k++)
            {
                var str_return = GetColorByValue(obj, obj.data[i][j][k]);
                var str_rgb = str_return.substring(4, str_return.length-1).split(",");
                colors.push(parseFloat(str_rgb[0])/255, parseFloat(str_rgb[1])/255, parseFloat(str_rgb[2])/255, 1.0);
            }
        }
    }
    ContourColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, ContourColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    ContourColorBuffer.itemSize = 4;
    ContourColorBuffer.numItems = colors.length/4;
    
    ContourIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ContourIndexBuffer);
    ///////////////////////////////////////////////////////////////////
    // 코드 간략화 변수들
    var move_x = obj.subdivision_y * obj.subdivision_z;
    var move_y = obj.subdivision_z;
    ///////////////////////////////////////////////////////////////////
    var ContourIndices = [];
    for(var i = 0; i < obj.subdivision_x-1; i++)
    {
        for(var j = 0; j < obj.subdivision_y-1; j++)
        {
            for(var k = 0; k < obj.subdivision_z-1; k++)
            {
                if(get_hidden_points(obj, i, j, k))
                {
                    ContourIndices.push((move_x * i) + (move_y * j) + k, (move_x * i) + (move_y * j) + (k + 1), (move_x * (i + 1)) + (move_y * j) + (k + 1),
                                    (move_x * i) + (move_y * j) + k, (move_x * (i + 1)) + (move_y * j) + (k + 1), (move_x * (i + 1)) + (move_y * j) + k, // front
                                    (move_x * (i + 1)) + (move_y * (j + 1)) + k, (move_x * (i + 1)) + (move_y * (j + 1)) + (k + 1), (move_x * i) + (move_y * (j + 1)) + (k + 1),
                                    (move_x * (i + 1)) + (move_y * (j + 1)) + k, (move_x * i) + (move_y * (j + 1)) + (k + 1), (move_x * i) + (move_y * (j + 1)) + k, // back
                                    (move_x * i) + (move_y * (j + 1)) + k, (move_x * i) + (move_y * (j + 1)) + (k + 1), (move_x * i) + (move_y * j) + (k + 1),
                                    (move_x * i) + (move_y * (j + 1)) + k, (move_x * i) + (move_y * j) + (k + 1), (move_x * i) + (move_y * j) + k, // left
                                    (move_x * (i + 1)) + (move_y * j) + k, (move_x * (i + 1)) + (move_y * j) + (k + 1), (move_x * (i + 1)) + (move_y * (j + 1)) + (k + 1),
                                    (move_x * (i + 1)) + (move_y * j) + k, (move_x * (i + 1)) + (move_y * (j + 1)) + (k + 1), (move_x * (i + 1)) + (move_y * (j + 1)) + k, // right
                                    (move_x * i) + (move_y * j) + (k + 1), (move_x * i) + (move_y * (j + 1)) + (k + 1), (move_x * (i + 1)) + (move_y * (j + 1)) + (k + 1),
                                    (move_x * i) + (move_y * j) + (k + 1), (move_x * (i + 1)) + (move_y * (j + 1)) + (k + 1), (move_x * (i + 1)) + (move_y * j) + (k + 1), // top
                                    (move_x * i) + (move_y * (j + 1)) + k, (move_x * i) + (move_y * j) + k, (move_x * (i + 1)) + (move_y * j) + k,
                                    (move_x * i) + (move_y * (j + 1)) + k, (move_x * (i + 1)) + (move_y * j) + k, (move_x * (i + 1)) + (move_y * (j + 1)) + k // bottom
                    );
                }
            }
        }
    }
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ContourIndices), gl.STATIC_DRAW);
    ContourIndexBuffer.itemSize = 1;
    ContourIndexBuffer.numItems = ContourIndices.length;
    
    //draw 시작
    mvPushMatrix();
    mat4.translate(mvMatrix, [obj.translation_x, obj.translation_y, obj.translation_z]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_x), [1, 0, 0]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_y), [0, 1, 0]);
    mat4.rotate(mvMatrix, degToRad(obj.rotation_z), [0, 0, 1]);
    mat4.translate(mvMatrix, [obj.center_x, obj.center_y, obj.center_z]);
    
	var xformMatrix = new Float32Array([
		obj.scale_x,   0.0,  0.0,  0.0,
		0.0,  obj.scale_y,   0.0,  0.0,
		0.0,  0.0,  obj.scale_z,   0.0,
		0.0,  0.0,  0.0,  1.0  
	]);

	var u_xformMatrix = gl.getUniformLocation(shaderProgram, 'u_xformMatrix');
	gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
	
    //vertex버퍼 바인드
    gl.bindBuffer(gl.ARRAY_BUFFER, ContourVertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, ContourVertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //색상 vertex버퍼 바인드
    gl.bindBuffer(gl.ARRAY_BUFFER, ContourColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, ContourColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    //인덱스 버퍼 바인드
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ContourIndexBuffer);
    setMatrixUniforms();
    gl.drawElements(gl.TRIANGLES, ContourIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    mvPopMatrix();
}

function get_hidden_points(obj, x, y, z)
{
    return obj.hidden_points[x][y][z];
}