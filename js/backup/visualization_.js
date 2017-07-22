var material, wireframeMaterial;
var container, stats;
var camera, scene, renderer, splineCamera, cameraHelper, lightSpot;
var binormal = new THREE.Vector3();
var normal = new THREE.Vector3();
var radius=0.5;
var mouseRotation=new THREE.Vector3(0,0,0);
var ambientLight,directionalLight;
var timer=new THREE.Clock(true);
var parent, tubeGeometry, group;
var steps=2400.0;
var index=0.0;
var mmesh;
var initialDistance=5000;
var mmaterial;
var splines = {
  DNAKnot: generateDNAShape(),
  HeartCurve: new THREE.Curves.HeartCurve( 3.5 ),
  VivianiCurve: new THREE.Curves.VivianiCurve( 7000 ),
  KnotCurve: new THREE.Curves.KnotCurve(),
  HelixCurve: new THREE.Curves.HelixCurve(),
  TrefoilKnot: new THREE.Curves.TrefoilKnot(),
  TorusKnot: new THREE.Curves.TorusKnot( 20 ),
  CinquefoilKnot: new THREE.Curves.CinquefoilKnot( 20 ),
  TrefoilPolynomialKnot: new THREE.Curves.TrefoilPolynomialKnot( 14 ),
  FigureEightPolynomialKnot: new THREE.Curves.FigureEightPolynomialKnot(),
  DecoratedTorusKnot4a: new THREE.Curves.DecoratedTorusKnot4a(),
  DecoratedTorusKnot4b: new THREE.Curves.DecoratedTorusKnot4b(),
  DecoratedTorusKnot5a: new THREE.Curves.DecoratedTorusKnot5a(),
  DecoratedTorusKnot5c: new THREE.Curves.DecoratedTorusKnot5c()
};
var params = {
  spline: 'DNAKnot',
  scale: 5,
  offset:6,
  extrusionSegments: 3000,
  radiusSegments: 40,
  closed: false,
  animationView: false,
  lightVisible: true,
  speed:0.5,
  materialColor:  "#ffffff",
  wireframeColor: "#ffffff",
  backgroundColor:"#a49292",
  materialOpacity:0.5,
  wireframeOpacity:0.8
};


function init() {
  container = document.getElementById( 'container' );
  // camera
  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.01, 100000);
  camera.position.set( 0, 0, initialDistance );
  setMaterials();
  // scene
  scene = new THREE.Scene();
  //scene.fog = new THREE.Fog(0xffffff,2000, 100);
  //scene.fog = new THREE.Fog( 0xffffff, 10, 50 );
	//scene.fog.color.setHSL( 0.6, 0, 1 );
  parent = new THREE.Object3D();
  scene.add( parent );

  setLights();


/*
var   hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
				hemiLight.color.setHSL( 0.6, 1, 0.6 );
				hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
				hemiLight.position.set( 0, 500, 0 );
				scene.add( hemiLight );

*/
        var vertexShader = document.getElementById( 'vertexShader' ).textContent;
				var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
				var uniforms = {
					topColor:    { value: new THREE.Color( 0x777777 ) },
					bottomColor: { value: new THREE.Color( 0x332233 ) },
					offset:      { value: 33 },
					exponent:    { value: 1.0 }
				};
				//uniforms.topColor.value.copy( hemiLight.color );
				//scene.fog.color.copy( uniforms.bottomColor.value );
				var skyGeo = new THREE.SphereGeometry( 400, 50, 50 );
				var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.DoubleSide } );
      //  skyMat=new THREE.MeshPhongMaterial({ color: 0x444444,transparent:true,opacity:1,side: THREE.DoubleSide });
        var sky = new THREE.Mesh( skyGeo, skyMat );
				scene.add( sky );

  // tube


  splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 100000 );
  parent.add( splineCamera );

  cameraHelper = new THREE.CameraHelper( splineCamera );
  scene.add( cameraHelper );
  addTube();



  particle = new THREE.Object3D();
  scene.add(particle);

  var geometry = new THREE.TetrahedronGeometry(2, 0);
  var geom = new THREE.TetrahedronGeometry(2, 0);
  var geom2 = new THREE.IcosahedronGeometry(15, 1);

  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading
  });

  for (var i = 0; i < 1000; i++) {
    var mesh = new THREE.Mesh(geom, material);
    mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    mesh.position.multiplyScalar(300 + (Math.random() * 300));
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    particle.add(mesh);
  }









  //cameraHelper.visible = params.lightVisible;
  lightSpot.visible = params.lightVisible;
  // renderer
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor( params.backgroundColor );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  initGUI();
  // controls
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  // event listener
  window.addEventListener( 'resize', onWindowResize, false );
  var textureLoader = new THREE.TextureLoader();
  mmaterial = new THREE.MeshPhongMaterial( {
					specular: 0x111111,
					//map: textureLoader.load( 'obj/Map-COL.jpg' ),
					//specularMap: textureLoader.load( 'obj/Map-SPEC.jpg' ),
					normalMap: textureLoader.load( 'obj/Infinite-Level_02_Tangent_SmoothUV.jpg' ),
					shininess: 25,
          side:THREE.DoubleSide
          ,transparent:true
          ,wireframe:true

				} );

          loader = new THREE.JSONLoader();
  				loader.load(  "obj/LeePerrySmith.js", function( geometry ) {

            for ( var i = 0; i < geometry.faces.length; i ++ ) {
              var face = geometry.faces[ i ];
              face.color.setHex(0x222222);
            }
            mmaterial=new THREE.MeshPhongMaterial({ vertexColors: THREE.FaceColors,transparent:true,opacity:1 });
            mmesh= new THREE.Mesh( geometry, mmaterial );


              //  mesh.rotation.y=clock.elap;
              //  mesh.rotation.x=PI;
                var scale=580;
                mmesh.position.y = 0;//scale;
                mmesh.position.z =0;// -scale;

				            mmesh.scale.set( scale, scale, scale );
                    mmesh.rotation.x=0.0*Math.PI;
                    //3*PI/2.0;//new Date()*0.001;
                  //  mmesh.rotation.y=Math.PI*2;//new Date()*0.001;
                  //  mmesh.rotation.z=Math.PI*2;//new Date()*0.001;



                setInterval(function(){mmesh.rotation.y+=0.002;mmesh.rotation.x+=0.002;mmesh.rotation.z+=0.002;
                },10);


                        scene.add( mmesh );
                      //  for (var i = 0; i < geometry.vertices.length; i++) {
                      //    var mesh = new THREE.Mesh(geom, material);
                      //    mesh.position.copy(geometry.vertices[i].multiplyScalar(scale));
                      //   particle.add(mesh);

                       //}
  				} );



}
function initGUI(){
  // stats
  stats = new Stats();
  container.appendChild( stats.dom );
  // dat.GUI
  var gui = new dat.GUI( { width: 300 } );
  var folderGeometry = gui.addFolder( 'Geometry' );
  folderGeometry.add( params, 'spline', Object.keys( splines ) ).onChange( function( value ) { addTube(); } );
  folderGeometry.add( params, 'scale', 0.1, 5 ).onChange( function( value ) { setScale(); } );
  folderGeometry.add( params, 'offset', 0.1, 10 );
  folderGeometry.add( params, 'extrusionSegments', 50, 20000 ).step( 50 ).onChange( function( value ) { addTube(); } );
  folderGeometry.add( params, 'radiusSegments', 1, 500 ).step( 1 ).onChange( function( value ) { addTube(); } );
  folderGeometry.add( params, 'closed').onChange( function( value ) { addTube(); } );
//  folderGeometry.open();
  var folderCamera = gui.addFolder( 'Camera' );
  folderCamera.add( params, 'animationView').onChange( function( value ) { animateCamera( true ); } );
  folderCamera.add( params, 'lightVisible').onChange( function( value ) { animateCamera(); } );
  folderCamera.add( params, 'speed', 0, 1 );
  var folderColor = gui.addFolder( 'Color' );
  folderColor.addColor( params, 'materialColor').onChange(function( value ) { updateColors()} );
  folderColor.addColor( params, 'wireframeColor').onChange( function( value ) {updateColors() });
  folderColor.addColor( params, 'backgroundColor').onChange(function( value ) { updateColors()});
  folderColor.add( params, 'materialOpacity', 0, 1 ).onChange(function( value ) { updateColors()});
  folderColor.add( params, 'wireframeOpacity', 0, 1 ).onChange(function( value ) { updateColors()});
//  folderColor.open();
}
function generateDNAShape(){
  var vector_array=[];
  var x=0,y=0,z=0;
  for (var i = 0; i < 50; i++) {
    var distance=30;
    var dx=(Math.random(1)-0.5)*distance;
    distance-=Math.abs(dx);
    var dy=(Math.random(1)-0.5)*distance;
    distance-=Math.abs(dy);
    var dz=(Math.random(1)-0.5)*distance;
    x+=dx;y+=dy;z+=dz;
    vector_array.push(new THREE.Vector3(x,y,z));
  }
  /*
  var steps=10;

  for (var i = 0; i < steps; i++) {
    vector_array.push(new THREE.Vector3(
        0.5*(vector_array[vector_array.length-1].x+vector_array[0].x),
        0.5*(vector_array[vector_array.length-1].y+vector_array[0].y),
        0.5*(vector_array[vector_array.length-1].z+vector_array[0].z)));
  }
  */
  var dna_curve = new THREE.CatmullRomCurve3(vector_array );
  dna_curve.type = 'catmullrom';
  dna_curve.closed = false;
  return dna_curve;
}

function addTube() {
  if ( group !== undefined ) {
    parent.remove( group );
    group.children[ 0 ].geometry.dispose();
    group.children[ 1 ].geometry.dispose();
  }
  var extrudePath = splines[ params.spline ];
  tubeGeometry = new THREE.TubeBufferGeometry( extrudePath, params.extrusionSegments, radius, params.radiusSegments, params.closed );
  addGeometry( tubeGeometry );
  setScale();
}



function setLights(){
  directionalLight = new THREE.DirectionalLight( 0xffffff );
  scene.add(directionalLight);
  ambientLight=new THREE.AmbientLight( 0xffffff,0.1 );
  scene.add(ambientLight);

  // debug camera
  lightSpot = new THREE.Mesh( new THREE.SphereGeometry( 10,30,30),  new THREE.MeshBasicMaterial() ) ;
  parent.add( lightSpot );

}







function setScale() {
  group.scale.set( params.scale, params.scale, params.scale );
}

function addGeometry( geometry ) {
  // 3D shape
  group = THREE.SceneUtils.createMultiMaterialObject( geometry, [ material, wireframeMaterial ] );
  parent.add( group );
}

function animateCamera() {
//  cameraHelper.visible = params.cameraHelper;
  lightSpot.visible = params.lightVisible;
}



init();
animate();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
//
function animate() {
  requestAnimationFrame( animate );
  render();
  stats.update();
}

function render() {

  // animate camera along spline
  var time = Date.now();

  var looptime = 1000000*(1.0-params.speed)+1;

  var t = ( time % looptime ) / looptime;
  var pos = tubeGeometry.parameters.path.getPointAt( t );
  pos.multiplyScalar( params.scale );
  // interpolation
  var segments = tubeGeometry.tangents.length;
  var pickt = t * segments;
  var pick = Math.floor( pickt );
  var pickNext = ( pick + 1 ) % segments;
  binormal.subVectors( tubeGeometry.binormals[ pickNext ], tubeGeometry.binormals[ pick ] );
  binormal.multiplyScalar( pickt - pick ).add( tubeGeometry.binormals[ pick ] );
  var dir = tubeGeometry.parameters.path.getTangentAt( t );
  var offset = params.offset;
  normal.copy( binormal ).cross( dir );
  // we move on a offset on its binormal
  pos.add( normal.clone().multiplyScalar( offset ) );
  // using arclength for stablization in look ahead
  //var pindex=( t + 30 / tubeGeometry.parameters.path.getLength() ) % 1;
  var lookAt = new THREE.Vector3();//tubeGeometry.parameters.path.getPointAt( pindex ).multiplyScalar( params.scale );
  // camera orientation 2 - up orientation via normal
  lookAt.copy( pos ).add( dir );
  splineCamera.matrix.lookAt( splineCamera.position, lookAt, normal );
  splineCamera.rotation.setFromRotationMatrix( splineCamera.matrix, splineCamera.rotation.order);
  splineCamera.rotateOnAxis(new THREE.Vector3(0, 1, 0).normalize(),-mouseRotation.x*0.5);
  splineCamera.rotateOnAxis(new THREE.Vector3(1, 0, 0).normalize(),-mouseRotation.y*0.5);

  if(!params.animationView){
    //console.log(pos.distanceTo(splineCamera.position));
    var alfa=index/steps,one_m_alfa=1-alfa;
    index=Math.min(steps,index+1);
    var ttt=new THREE.Vector3(
      pos.x*alfa+camera.position.x*one_m_alfa,
      pos.y*alfa+camera.position.y*one_m_alfa,
      pos.z*alfa+camera.position.z*one_m_alfa
    );
    if(index>=steps*0.8){
      alfa=(index-steps*0.8)/(steps*0.2);
      one_m_alfa=1-alfa;
      mmaterial.opacity=Math.max(0,one_m_alfa-0.2);

      splineCamera.rotation.x=splineCamera.rotation.x*alfa-mouseRotation.y*one_m_alfa;
      splineCamera.rotation.y=splineCamera.rotation.y*alfa-mouseRotation.x*one_m_alfa;
      splineCamera.rotation.z=splineCamera.rotation.z*alfa+mouseRotation.z*one_m_alfa;

    }
    else{
      splineCamera.rotation.x=-mouseRotation.y;
      splineCamera.rotation.y=-mouseRotation.x;
      splineCamera.rotation.z=mouseRotation.z;

    }
    splineCamera.position.copy(ttt);


    /*splineCamera.rotation.x=-mouseRotation.y;
    splineCamera.rotation.y=-mouseRotation.x;
    splineCamera.rotation.z=mouseRotation.z;*/

  }else{
    //splineCamera.position.copy( pos );
  }
  directionalLight.position.set(2500*Math.sin(timer.getElapsedTime()*0.6),2500*Math.cos(timer.getElapsedTime()*0.6),2500*Math.sin(timer.getElapsedTime()*0.6));
  lightSpot.position.copy( directionalLight.position );

  cameraHelper.update();
  renderer.render(scene,splineCamera);// scene, params.animationView === true ? splineCamera : camera );
}
function updateColors(){
  renderer.setClearColor( params.backgroundColor );
  material.color=new THREE.Color(params.materialColor);
  wireframeMaterial.color=new THREE.Color(params.wireframeColor);
  material.opacity=params.materialOpacity;
  wireframeMaterial.opacity=params.wireframeOpacity;
}

function setMaterials(){
  //material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('assets/img.jpg') } );

  material = new THREE.MeshLambertMaterial( { color: params.materialColor,opacity: params.materialOpacity,transparent:true } );
  wireframeMaterial = new THREE.MeshLambertMaterial( { color: params.wireframeColor, opacity: params.wireframeOpacity, wireframe: true, transparent: true } );
  pointsMaterial= new THREE.PointsMaterial( { color: params.wireframeColor } );
}
document.getElementById( 'container' ).onmousemove = handleMouseMove;
function handleMouseMove(event) {
  mouseRotation.x=mouseRotation.x*0.9+0.1*(Math.PI*((event.clientX-window.innerWidth*0.5)/(window.innerWidth*0.5)));
  mouseRotation.y=mouseRotation.y*0.9+0.1*(Math.PI*((event.clientY-window.innerHeight*0.5)/(window.innerHeight*0.5)));

}
