MeshPhongExampleSong = function (r,i, color1,color2){
    this.radius=r;
    this.index=i
    this.sphere=addMeshPhongSphere(r,color1,1);//,"assets/8.pbm",20, 20,THREE.RepeatWrapping); //addGradientShaderSphere(r,color1, color2);

    this.orbit=worlds[i-1].radius*1.5;
    this.satellite=addBasicSphere(worlds[i-1].radius*0.1,0xffffff);
    this.satellite.position.set(this.orbit*Math.sin(elapsedTime),0*Math.cos(elapsedTime),this.orbit*Math.cos(elapsedTime));

    this.title="Mesh Phong";
    this.author="Author 3";

  this.play=function(position){
    //MAKE THE SATELLITE ROTATE
    this.satellite.position.set(this.orbit*Math.sin(elapsedTime),0*Math.cos(elapsedTime),this.orbit*Math.cos(elapsedTime));
  }

  this.songDidStart=function(s){
    console.log("New song: "+this.author+" - "+this.title);
  }

  this.songDidEnd=function(s){
  }

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
}