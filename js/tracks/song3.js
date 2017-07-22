Song3 = function (r,i, color1,color2){
    this.radius=r;
    this.index=i
    this.sphere=addGradientShaderSphere(r,color1, color2);
    this.orbit=worlds[i-1].radius*1.5;
    this.satellite=addBasicSphere(worlds[i-1].radius*0.1,0xffffff);
    this.satellite.position.set(this.orbit*Math.sin(new Date()*0.0001),0*Math.cos(new Date()*0.0001),this.orbit*Math.cos(new Date()*0.0001));


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

  this.play=function(position){
    //MAKE THE SATELLITE ROTATE
    this.satellite.position.set(this.orbit*Math.sin(new Date()*0.0001),0*Math.cos(new Date()*0.0001),this.orbit*Math.cos(new Date()*0.0001));
    //ROTATE THE ORBIT
    controls.constraint.rotateUp(-0.001);
  }

  this.songDidChange=function(s){
    if(s==this){//This song just started
    //  controls.constraint.rotateUp(controls.constraint.getPolarAngle()-Math.PI/2);
    }
    else{//Other song started
      controls.constraint.rotateUp(controls.constraint.getPolarAngle()-Math.PI/2);
      worlds[this.index-1].setOpacity(1);
    }
  }
}
