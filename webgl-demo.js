var cubeRotation = 0.0;

main();

var temp = 0, position_z = -2 ,position_y = 0.75, speed = 0, acceleration = 0.15, g = 0.01 ,temp1=1,position_rock_z=-20,position_rock_y=0;

//
// Start here
//
function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }
 // const vsSource = `
  //   attribute vec4 aVertexPosition;
  //   attribute vec2 aTextureCoord;

  //   uniform mat4 uModelViewMatrix;
  //   uniform mat4 uProjectionMatrix;

  //   varying highp vec2 vTextureCoord;

  //   void main(void) {
  //     gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  //     vTextureCoord = aTextureCoord;
  //   }
  // `;

    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;

      // Apply lighting effect

      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;
  // const fsSource = `
  //   varying highp vec2 vTextureCoord;

  //   uniform sampler2D uSampler;

  //   void main(void) {
  //     gl_FragColor = texture2D(uSampler, vTextureCoord);
  //   }
  // `;
  // // Initialize a shader program; this is where all the lighting
   const fsSource = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
  `;
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // // };
  //   const programInfo = {
  //   program: shaderProgram,
  //   attribLocations: {
  //     vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
  //     textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
  //   },
  //   uniformLocations: {
  //     projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
  //     modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
  //     uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
  //   },
  // };
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  var buffers1 = [];
  var array = [];
  const buffers = initBuffers(gl);
  var l=0;
  while(l<20)
  {buffers1[l] = initBuffers2(gl,1);l++;}

const texture = loadTexture(gl, './tunnel.jpg');
const texture1= loadTexture(gl,'./index.jpg');

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

   // drawScene1(gl, programInfo, buffers1, deltaTime);
    drawScene(gl, programInfo, buffers,texture, deltaTime);
    l=0;
    while(l<20)
    {drawScene2(gl, programInfo, buffers1[l],texture1, deltaTime,l+1);l++;}


    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);

}
//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//
function initBuffers(gl) {



  // Create a buffer for the cube's vertex positions.

  const positionBuffer = gl.createBuffer();
  
  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the cube.
  const positions = [

   
     0.4142*1.2, 1*1.2,  1.0,
    -0.4142*1.2, 1*1.2,  1.0,
     0.4142*1.2, 1*1.2, -1.0,
    -0.4142*1.2, 1*1.2, -1.0,

     0.4142*1.2, 1*1.2,  1.0,
     1*1.2, 0.4142*1.2,  1.0,
     0.4142*1.2, 1*1.2, -1.0,
     1*1.2, 0.4142*1.2, -1.0,

     1*1.2, 0.4142*1.2,  1.0,
     1*1.2,-0.4142*1.2,  1.0,
     1*1.2, 0.4142*1.2, -1.0,
     1*1.2,-0.4142*1.2, -1.0,

     1*1.2,-0.4142*1.2,  1.0,
     0.4142*1.2,-1*1.2,  1.0,
     1*1.2,-0.4142*1.2, -1.0,
     0.4142*1.2,-1*1.2, -1.0,

     0.4142*1.2,-1*1.2,  1.0,
    -0.4142*1.2,-1*1.2,  1.0,
     0.4142*1.2,-1*1.2, -1.0,
    -0.4142*1.2,-1*1.2, -1.0,

    -0.4142*1.2,-1*1.2,  1.0,
    -1*1.2,-0.4142*1.2,  1.0,
    -0.4142*1.2,-1*1.2, -1.0,
    -1*1.2,-0.4142*1.2, -1.0,

    -1*1.2,-0.4142*1.2,  1.0,
    -1*1.2, 0.4142*1.2,  1.0,
    -1*1.2,-0.4142*1.2, -1.0,
    -1*1.2, 0.4142*1.2, -1.0,

    -1*1.2, 0.4142*1.2,  1.0,
    -0.4142*1.2, 1*1.2,  1.0,
    -1*1.2, 0.4142*1.2, -1.0,
    -0.4142*1.2, 1*1.2, -1.0,
  ];
  var i=0,j=0,k=0;  
  var len = positions.length;
  var len1 = positions.length;

  while(1) 
  {
    j++;
    if(j==1600)
      break;
   while(i<12)
   {
   //console.log(len);
    // printf("%d",len);
      i++;
      if(len1%3==2)
       positions[len1] = positions[len1- len]-2;
       else
      positions[len1] = positions[len1- len];
       len1++;
    }
    i=0;
  } 
  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Now set up the colors for the faces. We'll use solid colors
  // for each face.
  // Convert the array of colors into a table for all the vertices.
  // var c;
  // var colors = [];
  
  // for (var j = 0; j < 8*200; ++j) {

  //   c = [Math.floor(Math.random() * 256)/255.0,Math.floor(Math.random() * 256)/255.0,Math.floor(Math.random() * 256)/255.0,1.0];
  //   // Repeat each color four times for the four vertices of the face
  //   colors = colors.concat(c, c, c, c);
  // }

  // const colorBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  const textureCoordinates = [
    // Front
    [0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0],
    // Back
    [0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0],
    // Top
    [0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0],
    // Bottom
    [0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0],
    // Right
    [0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0],
    // Left
    [0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0],
  ];

tem = []

  for(var i = 0; i < textureCoordinates.length*200; i++) {
    c = textureCoordinates[i%8];
    tem = tem.concat(c,c,c,c);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tem),
                gl.STATIC_DRAW);




 const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  const vertexNormals = [
    // Front
     [1.1*5.65, 1.1*2.34, 0,
     1.1*5.65, 1.1*2.34, 0,
     1.1*5.65, 1.1*2.34, 0,
     1.1*5.65, 1.1*2.34, 0],

    [1.1*2.34, 1.1*5.65, 0,
      1.1*2.34, 1.1*5.65, 0,
      1.1*2.34, 1.1*5.65, 0,
      1.1*2.34, 1.1*5.65, 0],

     [-1.1*2.34, 1.1*5.65, 0,
      -1.1*2.34, 1.1*5.65, 0,
      -1.1*2.34, 1.1*5.65, 0,
      -1.1*2.34, 1.1*5.65, 0],

     [-1.1*5.65, 1.1*2.34, 0,
     -1.1*5.65, 1.1*2.34, 0,
    -1.1*5.65, 1.1*2.34, 0,
  -1.1*5.65, 1.1*2.34, 0],

     [-1.1*5.65, -1.1*2.34, 0,
     -1.1*5.65, -1.1*2.34, 0,
   -1.1*5.65, -1.1*2.34, 0,
 -1.1*5.65, -1.1*2.34, 0],

     [-1.1*2.34, -1.1*5.65, 0,
     -1.1*2.34, -1.1*5.65, 0,
   -1.1*2.34, -1.1*5.65, 0,
 -1.1*2.34, -1.1*5.65, 0],

     [1.1*2.34, -1.1*5.65, 0,
     1.1*2.34, -1.1*5.65, 0,
   1.1*2.34, -1.1*5.65, 0,
 1.1*2.34, -1.1*5.65, 0],
     [1.1*5.65, -1.1*2.34, 0,
     1.1*5.65, -1.1*2.34, 0,
   1.1*5.65, -1.1*2.34, 0,
 1.1*5.65, -1.1*2.34, 0],
  ];

temo = []

  for(var i = 0; i < vertexNormals.length*200; i++) {
    c = vertexNormals[i%8];
    temo = temo.concat(c,c,c,c);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(temo),
                gl.STATIC_DRAW);

  






  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [
    0,  1,  2,      1,  2,  3,    // front
    4,  5,  6,      5,  6,  7,    // back
    8,  9,  10,     9,  10, 11,   // top
    12, 13, 14,     13, 14, 15,   // bottom
    16, 17, 18,     17, 18, 19,   // right
    20, 21, 22,     21, 22, 23,   // left
    24, 25, 26,     25, 26, 27,   // left
    28, 29, 30,     29, 30, 31,   // left    
  ];
  var indlen = indices.length;
  var p=0;
  var indind = indlen;

while(1)
{
  if(p==10000)
    break;
    indices[indlen] = indices[indlen - indind] + 32;
    indlen++;
    p++;
}
  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);
  


  // return {
  //   position: positionBuffer,
  //   color: colorBuffer,
  //   indices: indexBuffer,
  // };
    return {
    position: positionBuffer,
    normal : normalBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
  };
}




function drawScene(gl, programInfo, buffers,texture, deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-0.0, position_y, position_z]);  // amount to translate
  mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              cubeRotation,     // amount to rotate in radians
              [0, 0, 1]);       // axis to rotate around (Z)
  // mat4.rotate(modelViewMatrix,  // destination matrix
  //             modelViewMatrix,  // matrix to rotate
  //             cubeRotation * .7,// amount to rotate in radians
  //             [0, 1, 0]);       // axis to rotate around (X)

  //movement here
    position_y -= speed;
  if (position_y < 0.75) {
    speed -= g;
  }
  else 
  {
    speed = 0;
    position_y =  0.75;
    temp = 0;
    temp1=1;
  } 
  position_z+= 0.35;
  if (position_z >= 265) {
     position_z = -1;
  }
  

  
  

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }


   {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexNormal);
  }

   const normalMatrix = mat4.create();
  mat4.invert(normalMatrix, modelViewMatrix);
  mat4.transpose(normalMatrix, normalMatrix);


  gl.uniformMatrix4fv(
      programInfo.uniformLocations.normalMatrix,
      false,
      normalMatrix);

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
 {
    const num = 2; // every coordinate composed of 2 values
    const type = gl.FLOAT; // the data in the buffer is 32 bit float
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set to the next
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
}
  gl.activeTexture(gl.TEXTURE0);

  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const vertexCount = 9600;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

  // Update the rotation for the next draw

  //cubeRotation += deltaTime;
}









//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}



function initBuffers2(gl,color_block) {


  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


  const positions = [
    -1.0*0.11, -1.0,  1.0*0.11,
     1.0*0.11, -1.0,  1.0*0.11,
     1.0*0.11,  1.0,  1.0*0.11,
    -1.0*0.11,  1.0,  1.0*0.11,

    -1.0*0.11, -1.0, -1.0*0.11,
    -1.0*0.11,  1.0, -1.0*0.11,
     1.0*0.11,  1.0, -1.0*0.11,
     1.0*0.11, -1.0, -1.0*0.11,
    -1.0*0.11,  1.0, -1.0*0.11,
    -1.0*0.11,  1.0,  1.0*0.11,
     1.0*0.11,  1.0,  1.0*0.11,
     1.0*0.11,  1.0, -1.0*0.11,

    -1.0*0.11, -1.0, -1.0*0.11,
     1.0*0.11, -1.0, -1.0*0.11,
     1.0*0.11, -1.0,  1.0*0.11,
    -1.0*0.11, -1.0,  1.0*0.11,

     1.0*0.11, -1.0, -1.0*0.11,
     1.0*0.11,  1.0, -1.0*0.11,
     1.0*0.11,  1.0,  1.0*0.11,
     1.0*0.11, -1.0,  1.0*0.11,

   -1.0*0.11, -1.0, -1.0*0.11,
    -1.0*0.11, -1.0,  1.0*0.11,
    -1.0*0.11,  1.0,  1.0*0.11,
    -1.0*0.11,  1.0, -1.0*0.11,
  ];


  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


 const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  const textureCoordinates = [
    // Front
    [0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0],
    // Back
    [0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0],
    // Top
    [0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0],
    // Bottom
    [0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0],
    // Right
    [0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0],
    // Left
    [0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0],
  ];

tem = []

  for(var i = 0; i < textureCoordinates.length*200; i++) {
    c = textureCoordinates[i%8];
    tem = tem.concat(c,c,c,c);
  }
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tem),
                gl.STATIC_DRAW);
  // var colors = [];

  // for (var j = 0; j < 6; ++j) {
  //  const c = [Math.floor(Math.random() * 256)/255.0,Math.floor(Math.random() * 256)/255.0,Math.floor(Math.random() * 256)/255.0,1.0];
  //   colors = colors.concat(c,c,c,c);
  // }

  // const colorBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);


  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
  ];


  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
  };
}

var rot=Math.floor(Math.random() * Math.floor(180));
var nn=0;
function drawScene2(gl, programInfo, buffers,texture, deltaTime,index) {
  
  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  var kr = 0;
  while(kr < 20) {
    if(position_z + (-20.0*kr+position_z) > 200) {
      alert("killed");
    }
    kr++;
  }

  // var obj=0;
  // while(obj<20)
  // {  
  //    console.log(position_z);
  //    console.log(-20.0*obj+position_z);
  //   if(position_z  + (-20*obj+position_z) > -0.05)
  //   {
  //     console.log('a');
  //     alert('detect');
  //     //exit();
  //   }
  //   obj++;
  // }


  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  const modelViewMatrix = mat4.create();






 // if(count == 1){
if(nn==1000) 
{rot = rot + 1;nn=0;}
nn++;


  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-0.0, position_y, -20*index+position_z]);
   mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              cubeRotation+2*index,     // amount to rotate in radians
              [0, 0, 1]);       // axis to rotate around (Z)
 
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  {
    const num = 2; // every coordinate composed of 2 values
    const type = gl.FLOAT; // the data in the buffer is 32 bit float
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set to the next
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
}
  gl.activeTexture(gl.TEXTURE0);

  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);


  gl.useProgram(programInfo.program);


  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

}

function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn of mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

var aa=0,bb=0;
Mousetrap.bind('d',function()  {
  if(aa==0)
    cubeRotation -= 0.1;
})

Mousetrap.bind('a',function()  {
    if(bb==0)
    cubeRotation += 0.1;
})

var deacceleration= 0.01;
Mousetrap.bind('space', function() {
    if(temp == 0) {
      deacceleration=0.01;
      speed += acceleration;
      temp = 1; 
    }
})

Mousetrap.bind('o',function()  {
    if(temp == 0 && temp1 ==1) {
      speed += acceleration;
      temp = 1;
    }  
    cubeRotation -= 0.1;
})

Mousetrap.bind('p',function()  {
    if(temp == 0 && temp1 ==1) {
      speed += acceleration;
      temp1 = 0;
    }  
    cubeRotation += 0.1;
})




//
