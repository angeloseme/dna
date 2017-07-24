Song4 = function (r,i, color1,color2){
  this.radius=r;
  this.index=i
  this.title="Song 4";
  this.author="Author 4";
  this.sphere=addGradientShaderSphere(r,color1, color2);
  //addMeshPhongSphere(r,color1);//

  this.params={
    threshold:0.5,
    transition_speed:0.6
  };

  this.addGUIFolder=function(){
    var folderSong = gui.addFolder( 'Song1' );
    folderSong.add( this.params, 'threshold', 0.0, 1 ).onChange( function( value ) {  } ).listen();
    folderSong.add( this.params, 'transition_speed', 0.0, 1 ).onChange( function( value ) {
      dnaCurveObject.transition_speed=1.0-value;
    } ).listen();
  }

  this.addGUIFolder();
  this.setColor=function(color1,color2){
    if(this.sphere.material instanceof THREE.ShaderMaterial){
      this.color1=color1;
      this.color2=color2;
      this.sphere.material.uniforms.topColor.value=new THREE.Color( this.color1 );
      this.sphere.material.uniforms.bottomColor.value=new THREE.Color( this.color2 );
    }else{
      this.color1=color1;
      this.color2=color2;
      this.sphere.material.color=new THREE.Color( this.color1 );
    }
  }

  this.setOpacity=function(f){
    if(this.sphere.material instanceof THREE.ShaderMaterial){
      this.sphere.material.uniforms.opacity.value=f;
    }else{
      this.sphere.material.opacity=f;
    }
  }

  //WHERE THE ANIMATIONS SHOULD BE
  this.play=function(position){
    //IF POSITION >0.5 THE DNA WILL BECAME HEAD (INDEX 0)
    //ELSE KEEP THE DNA SHAPE (INDEX 1)
    if(position>this.params.threshold){
      dnaCurveObject.moveToIndex(1);
      controls.constraint.rotateUp(0.0008);
    }
    else{
      dnaCurveObject.moveToIndex(0);
      controls.constraint.rotateUp(-0.004);
    }

    //ANIMATING COLOR THROUGH A SIN WAVE
//    worlds[this.index-1].setColor(Math.random()*0xffffff,Math.random()*0xffffff);

  }

  this.songDidStart=function(s){
    controls.constraint.rotateUp(controls.constraint.getPolarAngle()-Math.PI/2);
    console.log("New song: "+this.author+" - "+this.title);
    scene.autoRotate=true;
  }

  this.songDidEnd=function(s){
    scene.autoRotate=false;

  }
}
