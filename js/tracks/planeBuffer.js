PlaneSong = function (r,i, color1,color2){
  this.radius=r;
  this.index=i
  this.sphere=addGradientShaderSphere(r,color1, color2);
  this.orbit=worlds[i-1].radius*1.5;
  this.satellite=addBasicSphere(worlds[i-1].radius*0.1,0xffffff);
  this.satellite.position.set(this.orbit*Math.sin(elapsedTime),0*Math.cos(elapsedTime),this.orbit*Math.cos(elapsedTime));
  this.title="Song 2";
  this.author="Author 2";
  var geometry = new THREE.PlaneGeometry( this.radius*0.03, this.radius*0.03, 1 , 1);
  var material = new THREE.MeshPhongMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
  //this.satellite = new THREE.Mesh( geometry, material );
  //scene.add( this.satellite);

  this.play=function(position){
    this.satellite.position.set(this.orbit*Math.sin(elapsedTime),0*Math.cos(elapsedTime),this.orbit*Math.cos(elapsedTime));
    this.satellite.material.color=new THREE.Color(Math.abs(Math.sin(new Date()*0.001)),Math.abs(Math.sin(new Date()*0.001)),Math.abs(Math.sin(new Date()*0.001)) );
  /*  this.plane.rotation.set(elapsedTime,elapsedTime,elapsedTime);
    for(var i=0;i<this.plane.geometry.vertices.length;i++){
      this.plane.geometry.vertices[i].set(
          this.plane.geometry.vertices[i].x+Math.random(this.radius*0.0),
        this.plane.geometry.vertices[i].y+Math.random(this.radius*0.0),
        this.plane.geometry.vertices[i].z+Math.random(this.radius*1000.0-this.radius*500)
      );
    }

    this.plane.geometry.verticesNeedUpdate = true;*/
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
