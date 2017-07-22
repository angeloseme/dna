Song4 = function (r,i, color1,color2){
  this.radius=r;
  this.index=i
  this.sphere=addGradientShaderSphere(r,color1, color2);
  //addMeshPhongSphere(r,color1);//

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
    if(position>0.5){
      dnaCurveObject.moveToIndex(0);

    }
    else{
      dnaCurveObject.moveToIndex(1);
    }
    //ANIMATING COLOR THROUGH A SIN WAVE
//    worlds[this.index-1].setColor(Math.random()*0xffffff,Math.random()*0xffffff);

  }

  //GETS CALLED WHEN SONG CHANGE
  this.songDidChange=function(s){
    if(s==this){
      //This song just started
      console.log(this);

      //Reset rotation of Camera
      //controls.constraint.rotateUp(controls.constraint.getPolarAngle()-Math.PI/2);
      //controls.constraint.rotateLeft(controls.constraint.getAzimuthalAngle()-Math.PI/2);
    }
    else{
      //Other song started
    }
  }
}
