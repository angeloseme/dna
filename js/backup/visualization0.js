var np=200;
var mnp=1  ;
var timer=new THREE.Clock(true);
const scene = new THREE.Scene();
var spheres=[];
var vvv=[];
var camera, controls;
var positions=[];
var pos=[];
var obj_geometry;
var dnaCurveObject, dnaCurve;
var lightSpot;
var directionalLight,ambientLight;
var renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: 'logzbuf' });//new THREE.WebGLRenderer( { antialias: true } );
var worlds=[];
var gui ;
// GUI PARAMS
var params = {
  playback:0.8,
  song:1
};




function initGUI(){
  // stats
  stats = new Stats();
  container.appendChild( stats.dom );
  // dat.GUI
  gui = new dat.GUI( { width: 300 } );
  var folderGeneral = gui.addFolder( 'General' );
  folderGeneral.add( params, 'playback', 0.0, 1 ).onChange( function( value ) {  } ).listen();;
  folderGeneral.add( params, 'song', 1, 10 ).step(1).onChange( function( value ) {  } ).listen();
  folderGeneral.open();
}




function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}



function init(){
  initGUI();
  positions.push(new THREE.Vector3(0,0,0));
  pos.push(new THREE.Vector3().copy(positions[positions.length-1]));
  for(var i=1;i<np;i++){
  	positions.push(new THREE.Vector3(
      positions[positions.length-1].x+Math.random()*2.3-1,//*i-i,
  		positions[positions.length-1].y+Math.random()*2-1,//*i-i,
  		positions[positions.length-1].z+Math.random()*2-1));//*i-i));
  	pos.push(new THREE.Vector3(positions[positions.length-1].x,positions[positions.length-1].y,positions[positions.length-1].z));
  }

  //LINE
  vvv.push([]);
  for(var i=0;i<np;i++){
  	vvv[vvv.length-1].push(new THREE.Vector3(i*2-np*0.5*2,0,0));//+
  }
  //loadOBJ("obj/man.obj",0.05,new THREE.Vector3(0,-4400,0));
  var scale=0.05;
  var translate=new THREE.Vector3(0,-4400,0);
  var tgeom=loadOBJ("obj/man.obj",function(tgeom){

    var vvertices=[];
    for(var i=0;i<np;i++){
      var aux=Math.floor(tgeom.vertices.length*0.18/np);
      var index=Math.floor(tgeom.vertices.length*0.82+aux*i);
      vvertices.push(new THREE.Vector3((tgeom.vertices[index].x+translate.x)*scale,(tgeom.vertices[index].y+translate.y)*scale,(tgeom.vertices[index].z+translate.z)*scale));
    }
    vvv.push(vvertices);
    obj_geometry=tgeom;
  });




  dnaCurve = new THREE.CatmullRomCurve3(positions );

  // create curve mesh

  var geometry = new THREE.Geometry();
  geometry.vertices = dnaCurve.getSpacedPoints(np*mnp  );

  const material = new THREE.MeshPhongMaterial({ color: 0xffffff,transparent:true,opacity:0.8,shininess:500,specular: 0xffffff,emissive: 0xffffff});//
  dnaCurveObject = new THREE.Line( geometry, material );
  scene.add( dnaCurveObject );


  directionalLight = new THREE.DirectionalLight( 0xffffff );
  scene.add(directionalLight);
  // visualize spaced points
  ambientLight=new THREE.AmbientLight( 0xffffff,0.3 );
  scene.add(ambientLight);

  const sphereGeomtry = new THREE.SphereBufferGeometry( 0.05,10,10 );
  const sphereMaterial = new THREE.MeshPhongMaterial({ color: 0x000000,transparent:true,opacity:1 });
  lightSpot = new THREE.Mesh( new THREE.SphereGeometry( 4,30,30),  new THREE.MeshBasicMaterial() ) ;
  scene.add( lightSpot );


  // renderer

  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0x000000,1	 );
  renderer.setPixelRatio( window.devicePixelRatio );
  document.body.appendChild( renderer.domElement );

  for(var i=0;i<np;i++){

  	var helper = new THREE.Mesh( sphereGeomtry, sphereMaterial );
  	helper.position.copy( dnaCurve.points[i] );
  	spheres.push(helper);
  	scene.add( helper );

  }

}

init();




var scene_scale=1;
var t=1;
var mf=10000;


var radius=1;
worlds.push(new Gateway(radius,worlds.lenght-1,0xaa8888, 0x443344));
radius*=25;
worlds.push(new Song4(radius,worlds.length-1,0x777777,0x332233));
radius*=25;
worlds.push(new Song3(radius,worlds.length-1,0xaa8888, 0x443344));
radius*=25;
worlds.push(new Song2(radius,worlds.length-1,0xff8888, 0x220022));
radius*=25;
worlds.push(new Song1(radius,worlds.length-1,0x000000, 0x111111));
scene.scale.set(scene_scale,scene_scale,scene_scale);
camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, worlds[worlds.length-1].radius*10 );
camera.position.set( 0, 0, worlds[worlds.length-1].radius );
controls = new THREE.OrbitControls(camera);
controls.zoomSpeed = 0.2;

window.addEventListener( 'resize', onResize );
animate();

var t=0.0;
var currentSong=undefined;
function animate() {
  worlds[0].setColor(0xffffff*Math.random(),0xffffff*Math.random());
  //$('#log').text(controls.constraint.getPolarAngle()+" "+Math.floor(camera.position.distanceTo(new THREE.Vector3(0,0,0))));
  var dist=camera.position.distanceTo(new THREE.Vector3(0,0,0));
  for(var i=1;i<worlds.length;i++){
    if(dist>worlds[i-1].radius && dist<worlds[i].radius){
      var position=Math.abs(dist-worlds[i].radius)/(worlds[i].radius-worlds[i-1].radius);
      worlds[i-1].play(position);
      params.song=worlds.length-i;
      params.playback=position;
      if(currentSong!=worlds[i-1]){
        currentSong=worlds[i-1];
        for(var i=0;i<worlds.length;i++)
          worlds[i].songDidChange(currentSong);
      }
    }
  }


	controls.constraint.dollyIn(1.001);

  if(camera.position.distanceTo(new THREE.Vector3(0,0,0))<worlds[0].radius*2)
    camera.position.set( 0, 0,worlds[worlds.length-1].radius);

	if(camera.position.distanceTo(new THREE.Vector3(0,0,0))>worlds[worlds.length-1].radius)
    camera.position.set( 0, 0, worlds[0].radius*2 );
  controls.autoRotate=true;
	controls.update();
	//camera.zoom=timer.getElapsedTime()/100;
	directionalLight.position.set(worlds[worlds.length-1].radius*1.3*Math.sin(new Date()*0.0001),0*Math.cos(new Date()*0.0001),worlds[worlds.length-1].radius*1.3*Math.cos(new Date()*0.0001));
  lightSpot.position.copy( directionalLight.position );

	if(Math.abs(camera.position.distanceTo(new THREE.Vector3(0,0,0)))>worlds[0].radius*0.5)
		t=Math.min(t+0.002,1);

  else
    t=Math.max(t-0.002,0);
  //t=1;
	//small_sphere.scale.set(Math.max(0.01,t),Math.max(0.01,t),Math.max(0.01,t));
	var umt=1.0-t;

	for(var i=0;i<np;i++){
    if(obj_geometry){

	dnaCurve.points[i].x=pos[i].x*t+umt*vvv[1][i].x//radiuses[i]*Math.sin(angles[i].x)*Math.cos(angles[i].y);
	dnaCurve.points[i].y=pos[i].y*t+umt*vvv[1][i].y//radiuses[i]*Math.sin(angles[i].x)*Math.sin(angles[i].y);
	dnaCurve.points[i].z=pos[i].z*t+umt*vvv[1][i].z;//radiuses[i]*Math.cos(angles[i].x);

}
spheres[i].position.copy(dnaCurve.points[i]);
	}

	dnaCurve.tension=2;
	dnaCurve.type = 'chordal';
	dnaCurveObject.geometry.vertices = dnaCurve.getPoints( np*mnp );
	dnaCurveObject.geometry.verticesNeedUpdate = true;

	//if(t>0.2){
		dnaCurveObject.material.opacity=Math.max(Math.min(0.5,t),0.3);
	//}else{
		//dnaCurveObject.material.opacity=0.1;
	//}
  requestAnimationFrame( animate );
  render();
}

function render() {

renderer.render( scene, camera );

}
