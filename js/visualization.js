var timer=new THREE.Clock(true);
const scene = new THREE.Scene();
var camera, controls, currentSong;
var dnaCurveObject, lightSpot, directionalLight, ambientLight, worlds=[], gui, elapsedTime;
var renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: 'logzbuf' });//new THREE.WebGLRenderer( { antialias: true } );
//Creating a 400 points DNA CURVE OBJECT with 5 points of interpolations
var dnaCurveObject=new DNACurveObject(500,5);
var outer_radius=20, inner_radius=1;
var obj_file,songsGui;

//getOBJFile("obj/LeePerrySmith.obj",function(t){obj_file=t;obj_file.scale.set(300,300,300);scene.add(obj_file);},"/assets/4.jpg");
getJSONFile("obj/LeePerrySmith.js",0xffffff,
  function(t){
    obj_file=t;
    obj_file.scale.set(12.5,12.5,12.5);
    obj_file.position.set(0.1,-1.7,-1.1);
    obj_file.visible=false;
    scene.add(obj_file);
    init();
  },
  "video"
);//"/assets/4.jpg");

// GUI PARAMS
var params = {
  playback:0.8,
  song:1,
  ambient_light_color:0xffffff,
  ambient_light_intensity:0.02,
  directional_light_color:0xffffff,
  directional_light_intensity:0.5,
  dna_index:0,
  dna_scale:1,
  transition_speed:0.6,
  playing:true,
  auto_rotate:false
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
  folderGeneral.add( params, 'playback', 0.0, 1 ).onChange( function( value ) {
    camera.position.set(camera.position.x,camera.position.y,   -(params.playback-1)*(outer_radius-inner_radius)+inner_radius);
   } ).listen();
  folderGeneral.add( params, 'song', 1, 10 ).step(1).onChange( function( value ) { setSong(value-1); } ).listen();
  folderGeneral.add( params, 'playing');
  folderGeneral.add( params, 'auto_rotate');

  var folderDNA = gui.addFolder( 'DNA' );
  folderDNA.add(params, 'dna_index', 0.0, dnaCurveObject.vertices.length).step(1).onChange( function( value ) { dnaCurveObject.moveToIndex(value); } ).listen();
  folderDNA.add(params, 'dna_scale', 0.0, 5 ).onChange( function( value ) {dnaCurveObject.scale(value);} ).listen();
  folderDNA.add(params, 'transition_speed', 0.0000001, 1 ).onChange( function( value ) {  dnaCurveObject.transition_speed=1.0-value;} ).listen();

  folderLight.addColor( params, 'ambient_light_color').onChange( function( value ) { ambientLight.color=new THREE.Color(value); } ).listen();
  folderLight.add(params, 'ambient_light_intensity', 0.0, 1.0).onChange( function( value ) {  ambientLight.intensity=value;} ).listen();
  folderLight.addColor( params, 'directional_light_color').onChange( function( value ) { directionalLight.color=new THREE.Color(value); } ).listen();
  folderLight.add(params, 'directional_light_intensity', 0.0, 1.0).onChange( function( value ) {  directionalLight.intensity=value;} ).listen();
  folderGeneral.open();
  songsGui = gui.addFolder( 'Songs' );

}

//UPDATE CAMERA ON WINDOW RESIZE
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

//INIT
function init(){
//  dnaCurveObject.addOBJ("obj/LeePerrySmith.obj",0.01,new THREE.Vector3(0,-4400,0),0,1,function(){ console.log("loaded?")});
  dnaCurveObject.addDNAShape(0.5);
  dnaCurveObject.addDNAShape(0.5);
  dnaCurveObject.addDNAShape(0.5);
  dnaCurveObject.addDNAShape(0.5);
  dnaCurveObject.setIndex(0);
  //dnaCurveObject.addOBJ("obj/man.obj",0.01,new THREE.Vector3(0,-4400,0),0,1,function(){ });
  //


  initGUI();




  //LOADING OBJ FILE VERTEXES AT INDEX 1. LOADING ONLY FROM 0.8 to 1 (only the head)

  //LIGHT
  directionalLight = new THREE.PointLight(params.directional_light_color, params.directional_light_intensity);
  scene.add(directionalLight);
  ambientLight=new THREE.AmbientLight( params.ambient_light_color,params.ambient_light_intensity );
  scene.add(ambientLight);
  lightSpot = new THREE.Mesh( new THREE.SphereGeometry( 4,30,30),  new THREE.MeshBasicMaterial() ) ;
  scene.add( lightSpot );

  //CAMERA CONTROLS
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000);//worlds[worlds.length-1].radius*2 );

  controls = new THREE.OrbitControls(camera);
  controls.zoomSpeed = 0.2;


  populateScene();
  camera.position.set( 0, 0, worlds[worlds.length-1].radius );
  // RENDERER
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0x000000,1	 );
  //renderer.setPixelRatio( window.devicePixelRatio );
  document.body.appendChild( renderer.domElement );

  window.addEventListener( 'resize', onResize );

  setSong(0);

  animate();
}

//POPULATE WORLD WITH SONG OBJECTS
function populateScene(){
  var scene_scale=1;
  var radius=1;
  //worlds.push(new Gateway(radius,worlds.lenght-1,0xaa8888, 0x443344));
  //worlds.push(new Gateway(radius,worlds.lenght,0xffffff, 0x443344));
  //radius=radius*80;


  //worlds.push(new Song4(radius,worlds.length,0x777777,0x332233));
  //radius*=12;
  /*worlds.push(new MeshPhongExampleSong(radius,worlds.length,0xffffff, 0x222222));
  radius*=12;
  worlds.push(new PlaneSong(radius,worlds.length,0x777777, 0x222222));
  radius*=12;
  worlds.push(new AudioReactiveExampleSong(radius,worlds.length,0x000000, 0x222222));
*/

//worlds.push(new Gateway(radius,worlds.lenght,0xffffff, 0x443344));
//radius*=80;
//radius*=20;
//radius*=20;
//radius*=20;
worlds.push(new Song1(radius,worlds.length,0x000000, 0x111111));
worlds.push(new Song2(radius,worlds.length,0xff8888, 0x220022));
worlds.push(new Song3(radius,worlds.length,0xaa8888, 0x443344));
worlds.push(new Song4(radius,worlds.length,0x777777,0x332233));
worlds.push(new Song5(radius,worlds.length,0x000000, 0x111111));
worlds.push(new Song6(radius,worlds.length,0xff8888, 0x220022));
worlds.push(new Song7(radius,worlds.length,0xaa8888, 0x443344));
worlds.push(new Song8(radius,worlds.length,0x777777,0x332233));
worlds.push(new Song9(radius,worlds.length,0x000000, 0x111111));
worlds.push(new Song10(radius,worlds.length,0xff8888, 0x220022));
  for(var i=0;i<worlds.length;i++){
    worlds[i].songDidEnd();
  }
  currentSong=worlds[0];


  scene.scale.set(scene_scale,scene_scale,scene_scale);
}

function setSong(i, direction=1){
  console.log("song "+i+" -> "+params.song);
  var new_pos=outer_radius*0.95
  if(direction<0)
    new_pos=inner_radius*1.15;
  var index=i%(worlds.length);
  if(index<0)index=worlds.length-1;
  var pindex=(index+1)%(worlds.length);
//  if(pindex<0)pindex=worlds.length-1;
  console.log(index+" "+pindex);
  for(var j=0;j<worlds.length;j++){
    console.log();
      if(j==index || j==pindex)
        worlds[j].setVisible(true);
      else
        worlds[j].setVisible(false);
  }
  worlds[index].scale(outer_radius);
  worlds[pindex].scale(inner_radius);

  camera.position.set(0,0,new_pos);
  currentSong.songDidEnd();
  currentSong=worlds[index];
  currentSong.songDidStart();
  params.song=index+1;
}

function next(){
  setSong((currentSong.index+1)%worlds.length);

}


//ANIMATE FUNCTION GETS CALLED 60 TIMES PER SECOND
function animate() {
  //worlds[0].setColor(0xffffff*Math.random(),0xffffff*Math.random());
  //$('#log').text(controls.constraint.getPolarAngle()+" "+Math.floor(camera.position.distanceTo(new THREE.Vector3(0,0,0))));


  elapsedTime=timer.getElapsedTime()*0.5;
  //PROCESS CAMERA POSITION -> PLAY CURRENT SONG
  var dist=camera.position.distanceTo(new THREE.Vector3(0,0,0));
  $('#info').text(currentSong.author+" - "+currentSong.title);
  if(dist<inner_radius*1.1){
    setSong(currentSong.index+1);
  }
  if(dist>outer_radius){
    setSong(currentSong.index-1,-1);
  }
  params.playback=1-(camera.position.z-inner_radius)/(outer_radius-inner_radius);
  currentSong.play(params.playback);

  /*
  for(var i=1;i<worlds.length;i++){
    if(dist>worlds[i-1].radius && dist<worlds[i].radius){
      if(currentSong!=worlds[i]){
        if(currentSong)
          currentSong.songDidEnd();
        worlds[i].songDidStart();
      //  $('#info').fadeOut(1000,function(){
        //$('#info').text(worlds[i].author+" - "+worlds[i].title);
        //  $('#info').text("fjsdklfjldskfjl");
        //  $('#info').fadeIn();
        //  });
        //console.log(worlds[i].author+" - "+worlds[i].title);
        currentSong=worlds[i];
          for(var j=i;j<worlds.length;j++){
            if(j==i || j==i-1)
            worlds.setVisible(false);
          }
        break;
      }
      var position=Math.abs(dist-worlds[i].radius)/(worlds[i].radius-worlds[i-1].radius);
      worlds[i].play(position);
      params.song=worlds.length-i;
      params.playback=position;
    }
  }*/
  if(params.playing)controls.constraint.dollyIn(1.001);

/*
  //RECURSIVE CAMERA MOVEMENT
  if(camera.position.distanceTo(new THREE.Vector3(0,0,0))<worlds[0].radius*2)
    camera.position.set( 0, 0,worlds[worlds.length-1].radius);
  if(camera.position.distanceTo(new THREE.Vector3(0,0,0))>worlds[worlds.length-1].radius)
    camera.position.set( 0, 0, worlds[0].radius*2 );
*/
  //controls.autoRotate=true;
	controls.update();
  //UPDATE DIRECTIONAL LIGHT ROTATION
	directionalLight.position.set(worlds[worlds.length-1].radius*1000.3*Math.sin(elapsedTime),0*Math.cos(elapsedTime),worlds[worlds.length-1].radius*1000.3*Math.cos(elapsedTime));
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
