var timer=new THREE.Clock(true);
const scene = new THREE.Scene();
var camera, controls, currentSong;
var dnaCurveObject, lightSpot, directionalLight, ambientLight, worlds=[], gui, elapsedTime;
var renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: 'logzbuf' });//new THREE.WebGLRenderer( { antialias: true } );
//Creating a 400 points DNA CURVE OBJECT with 5 points of interpolations
var dnaCurveObject=new DNACurveObject(1000,5);

// GUI PARAMS
var params = {
  playback:0.8,
  song:1,
  ambient_light_color:0xffffff,
  ambient_light_intensity:0.1,
  directional_light_color:0xffffff,
  directional_light_intensity:0.5
};

//SETUP DEBUG GUI
function initGUI(){
  // stats
  stats = new Stats();
  container.appendChild( stats.dom );
  // dat.GUI
  gui = new dat.GUI( { width: 500 } );

  var folderGeneral = gui.addFolder( 'General' );
  var folderLight = gui.addFolder( 'Light' );
  folderGeneral.add( params, 'playback', 0.0, 1 ).onChange( function( value ) {  } ).listen();
  folderGeneral.add( params, 'song', 1, 10 ).step(1).onChange( function( value ) {  } ).listen();


  folderLight.addColor( params, 'ambient_light_color').onChange( function( value ) { ambientLight.color=new THREE.Color(value); } ).listen();
  folderLight.add(params, 'ambient_light_intensity', 0.0, 1.0).onChange( function( value ) {  ambientLight.intensity=value;} ).listen();
  folderLight.addColor( params, 'directional_light_color').onChange( function( value ) { directionalLight.color=new THREE.Color(value); } ).listen();
  folderLight.add(params, 'directional_light_intensity', 0.0, 1.0).onChange( function( value ) {  directionalLight.intensity=value;} ).listen();
  folderGeneral.open();
}

//UPDATE CAMERA ON WINDOW RESIZE
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

//INIT
function init(){
  initGUI();
  populateScene();

  //LOADING DNA RANDOM VERTEXES AT INDEX 0
  //dnaCurveObject.addDNAShape();
  dnaCurveObject.addDNAShape(0.99);
  //LOADING OBJ FILE VERTEXES AT INDEX 1. LOADING ONLY FROM 0.8 to 1 (only the head)
  dnaCurveObject.addOBJ("obj/man.obj",0.01,new THREE.Vector3(0,-4400,0),0,1,function(){ });

  //LIGHT
  directionalLight = new THREE.PointLight(params.directional_light_color, params.directional_light_intensity);
  scene.add(directionalLight);
  ambientLight=new THREE.AmbientLight( params.ambient_light_color,params.ambient_light_intensity );
  scene.add(ambientLight);
  lightSpot = new THREE.Mesh( new THREE.SphereGeometry( 4,30,30),  new THREE.MeshBasicMaterial() ) ;
  scene.add( lightSpot );

  //CAMERA CONTROLS
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, worlds[worlds.length-1].radius*2 );
  camera.position.set( 0, 0, worlds[worlds.length-1].radius );
  controls = new THREE.OrbitControls(camera);
  controls.zoomSpeed = 0.2;

  // RENDERER
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0x000000,1	 );
  //renderer.setPixelRatio( window.devicePixelRatio );
  document.body.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onResize );
  animate();
}

//POPULATE WORLD WITH SONG OBJECTS
function populateScene(){
  var scene_scale=1;
  var radius=1;
  //worlds.push(new Gateway(radius,worlds.lenght-1,0xaa8888, 0x443344));
  worlds.push(new Gateway(radius,worlds.lenght,0xffffff, 0x443344));
  radius*=80;
  worlds.push(new Song4(radius,worlds.length,0x777777,0x332233));
  radius*=12;
  worlds.push(new MeshPhongExampleSong(radius,worlds.length,0xffffff, 0x222222));
  radius*=12;
  worlds.push(new Song1(radius,worlds.length,0x777777, 0x222222));
  radius*=12;
  worlds.push(new AudioReactiveExampleSong(radius,worlds.length,0x000000, 0x222222));

/*
worlds.push(new Gateway(radius,worlds.lenght,0xffffff, 0x443344));
radius*=80;
worlds.push(new Song4(radius,worlds.length,0x777777,0x332233));
radius*=20;
worlds.push(new Song3(radius,worlds.length,0xaa8888, 0x443344));
radius*=20;
worlds.push(new Song2(radius,worlds.length,0xff8888, 0x220022));
radius*=20;
worlds.push(new Song1(radius,worlds.length,0x000000, 0x111111));

*/

  scene.scale.set(scene_scale,scene_scale,scene_scale);
}

//ANIMATE FUNCTION GETS CALLED 60 TIMES PER SECOND
function animate() {
  //worlds[0].setColor(0xffffff*Math.random(),0xffffff*Math.random());
  //$('#log').text(controls.constraint.getPolarAngle()+" "+Math.floor(camera.position.distanceTo(new THREE.Vector3(0,0,0))));
  elapsedTime=timer.getElapsedTime()*0.5;

  //PROCESS CAMERA POSITION -> PLAY CURRENT SONG
  var dist=camera.position.distanceTo(new THREE.Vector3(0,0,0));
  for(var i=1;i<worlds.length;i++){
    if(dist>worlds[i-1].radius && dist<worlds[i].radius){
      if(currentSong!=worlds[i]){
        if(currentSong)
          currentSong.songDidEnd();
        worlds[i].songDidStart();
      //  $('#info').fadeOut(1000,function(){
        $('#info').text(worlds[i].author+" - "+worlds[i].title);
        //  $('#info').text("fjsdklfjldskfjl");
        //  $('#info').fadeIn();
        //  });
        //console.log(worlds[i].author+" - "+worlds[i].title);
        currentSong=worlds[i];
      }
      var position=Math.abs(dist-worlds[i].radius)/(worlds[i].radius-worlds[i-1].radius);
      worlds[i].play(position);
      params.song=worlds.length-i;
      params.playback=position;
    }
  }
  controls.constraint.dollyIn(1.001);

  //RECURSIVE CAMERA MOVEMENT
  if(camera.position.distanceTo(new THREE.Vector3(0,0,0))<worlds[0].radius*2)
    camera.position.set( 0, 0,worlds[worlds.length-1].radius);
  if(camera.position.distanceTo(new THREE.Vector3(0,0,0))>worlds[worlds.length-1].radius)
    camera.position.set( 0, 0, worlds[0].radius*2 );

  //controls.autoRotate=true;
	controls.update();
  //UPDATE DIRECTIONAL LIGHT ROTATION
	directionalLight.position.set(worlds[worlds.length-1].radius*1.3*Math.sin(elapsedTime),0*Math.cos(elapsedTime),worlds[worlds.length-1].radius*1.3*Math.cos(elapsedTime));
  lightSpot.position.copy( directionalLight.position );

  //DNA SHAPE ROTATION
  //if(dnaCurveObject.alpha<1)
  dnaCurveObject.update();

  stats.update();
	requestAnimationFrame( animate );
  render();
  analyser.getByteFrequencyData(frequencyData);
}

function render() {
  renderer.render( scene, camera );
}
