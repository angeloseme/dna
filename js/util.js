//SPHERE UTILS

function getBasicSphere(radius,color,texture){
  var material= new THREE.MeshBasicMaterial({ color: color,transparent:true,opacity:1 });
  var mesh = new THREE.Mesh( new THREE.SphereGeometry( radius, 50, 50 ), material );
  //scene.add(mesh);
  return mesh;
}

function getMeshPhongSphere(radius,color, shininess=20, texture,repeatX=1,repeatY=1, wrapping=THREE.MirroredRepeatWrapping){
  var material;
  if(texture){
    texture=THREE.ImageUtils.loadTexture(texture) ;
    texture.wrapS = texture.wrapT = wrapping;
    texture.repeat.set(repeatX, repeatY);
    //  texture.offset.set(100, 200);
    material = new THREE.MeshPhongMaterial( { color: color, shininess:shininess, transparent:true,opacity:1,side: THREE.DoubleSide ,  map: texture} );
  }else
  material = new THREE.MeshPhongMaterial( { color: color, shininess:shininess, transparent:true,opacity:1,side: THREE.DoubleSide });
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

function getJSONFile(path, color,callback, color_map_texture,repeatX=1,repeatY=1, wrapping=THREE.MirroredRepeatWrapping){
  var mmaterial;
  if(color_map_texture){
    if(color_map_texture.endsWith(".jpg")){
      console.log("Loading jpg");
      var textureLoader = new THREE.TextureLoader();
      var texturemap=textureLoader.load( color_map_texture);
      mmaterial = new THREE.MeshPhongMaterial( {
        color:color,
        mmap:texturemap,
        map: texturemap,//textureLoader.load( texture),
        side:THREE.DoubleSide
      });
    }
    else{
      console.log("Loading video: "+color_map_texture);
      var texturemap = new THREE.VideoTexture(document.getElementById(color_map_texture));
      texturemap.minFilter =  THREE.LinearFilter;
      texturemap.magFilter = THREE.LinearFilter;
      texturemap.format = THREE.RGBFormat;
      mmaterial = new THREE.MeshPhongMaterial( {
        color:color,
        mmap:texturemap,
        map: texturemap,//textureLoader.load( texture),
        side:THREE.DoubleSide
      });
      setInterval(function(){mmaterial.needsUpdate=true;},100);
    }
  }
  else{
    console.log("Loading nothing");
    mmaterial = new THREE.MeshPhongMaterial( {
      color:color,
    side:THREE.DoubleSide
    });
  }
  loader = new THREE.JSONLoader();
  loader.load(  "obj/LeePerrySmith.js", function( geometry ) {
    var mmesh=new THREE.Mesh( geometry, mmaterial );
  callback(mmesh);
});

}



function getOBJFile(path, callback, texture,repeatX=1,repeatY=1, wrapping=THREE.MirroredRepeatWrapping){
  /*
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
*/

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
}
