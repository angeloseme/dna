//SPHERE UTILS

function getBasicSphere(radius,color,texture){
  var material;
  var color_map=getColorMap(texture);
  material = new THREE.MeshBasicMaterial( { color: color, transparent:true,opacity:1,side: THREE.DoubleSide ,  map: color_map} );
  if(texture instanceof THREE.VideoTexture)setInterval(function(){material.needsUpdate=true;},100);
  var mesh = new THREE.Mesh( new THREE.SphereGeometry( radius, 50, 50 ), material );
  //scene.add(mesh);
  return mesh;
}

function getMeshPhongSphere(radius,color, shininess=20, texture,repeatX=1,repeatY=1, wrapping=THREE.MirroredRepeatWrapping){
  var color_map=getColorMap(texture);
  var material = new THREE.MeshPhongMaterial( { color: color, shininess:shininess, map:color_map, transparent:true,opacity:1,side: THREE.DoubleSide });
  if(texture instanceof THREE.VideoTexture)setInterval(function(){material.needsUpdate=true;},100);
  
  var mesh = new THREE.Mesh( new THREE.SphereGeometry( radius, 50, 50 ), material );
  //scene.add(mesh);
  return mesh;
}

function getGradientShaderSphere(radius,col1,col2){
  var vertexShader = document.getElementById( 'vertexShader' ).textContent;
  var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
  var uniforms = {
    topColor:    { value: new THREE.Color( col1 ) },
    bottomColor: { value: new THREE.Color( col2 ) },
    offset:      { value: 1 },
    exponent:    { value: 1.0 },
    opacity:    { value: 1}
  };
  var material = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, opacity:1,transparent:true,side: THREE.DoubleSide } );
  var mesh = new THREE.Mesh( new THREE.SphereGeometry( radius, 50, 50 ), material );
  //scene.add(mesh);
  return mesh;
}

//MATH UTILS
function clamp(val, minV,maxV){
  return Math.min(maxV,Math.max(minV,val));
}


//LOADING

function loadOBJ(path, callback){
  loader = new THREE.OBJLoader();
  loader.load( path , function( geom) {
    geom.traverse( function ( child ) {
      if ( child instanceof THREE.Mesh ) {
        var tgeom = new THREE.Geometry().fromBufferGeometry( child.geometry);
        callback(tgeom);
        return;
      }
    });
  });
}



function getJSONFile(path, color,callback, texture,repeatX=1,repeatY=1, wrapping=THREE.MirroredRepeatWrapping){
  var mmaterial;
  var color_map=getColorMap(texture);
  mmaterial = new THREE.MeshPhongMaterial( {
    color:color,
    map: color_map,//textureLoader.load( texture),
    side:THREE.DoubleSide
  });
  loader = new THREE.JSONLoader();
  loader.load(  "obj/LeePerrySmith.js", function( geometry ) {
    var mmesh=new THREE.Mesh( geometry, mmaterial );
  callback(mmesh);
});

}

function getColorMap(texture){
  var color_map;
  if(texture){
    if(texture.endsWith(".jpg")){
      console.log("Loading jpg "+texture);
      color_map=new THREE.TextureLoader().load(texture);
    }
    else{
      console.log("Loading video: "+texture);
      color_map=createVideoMap(texture);
    }
  }
  return color_map;
}

function createVideoMap(html_video_tag_name){
  var texturemap = new THREE.VideoTexture(document.getElementById(html_video_tag_name));
  texturemap.minFilter =  THREE.LinearFilter;
  texturemap.magFilter = THREE.LinearFilter;
  texturemap.format = THREE.RGBFormat;
  return texturemap;
}

/*
function getOBJFile(path, callback, texture,repeatX=1,repeatY=1, wrapping=THREE.MirroredRepeatWrapping){

  loader = new THREE.OBJLoader();
  loader.load( path , function( geom) {
  geom.traverse( function ( child ) {
  if ( child instanceof THREE.Mesh ) {
  var tgeom = new THREE.Geometry().fromBufferGeometry( child.geometry);
  callback(tgeom);
  return;
}
});
});


var loader = new THREE.OBJLoader();
loader.load(
  path,
  function ( object ) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh){
        //child.material = lambert;
        child.material.side=THREE.DoubleSide ;
        child.material.needsUpdate=true;
        if(texture){
          video = document.getElementById( 'video' );
          child.material.map=THREE.ImageUtils.loadTexture(texture) ;
          child.material.map.wrapS = texture.wrapT = wrapping;
          child.material.map.repeat.set(repeatX, repeatY);
        }
        //console.log("aaaa"+child.material.constructor.name);
      }
    });
    if(callback)callback(object);
  }
);
}*/
