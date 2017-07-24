AudioReactiveExampleSong = function (r,i, color1,color2){
  this.radius=r;
  this.index=i
  this.sphere=addGradientShaderSphere(r,color1, color2);
  this.orbit=worlds[i-1].radius*1.5;
  this.satellite=addBasicSphere(worlds[i-1].radius*0.1,0x000000);
  this.satellite.position.set(this.orbit*Math.sin(elapsedTime),0*Math.cos(elapsedTime),this.orbit*Math.cos(elapsedTime));
  this.title="Audio Reactive";
  this.author="Author";

  this.play=function(position){
    this.satellite.position.set(this.orbit*Math.sin(elapsedTime),0*Math.cos(elapsedTime),this.orbit*Math.cos(elapsedTime));
    worlds[this.index-1].setColor(new THREE.Color(1-frequencyData[3]/255.0,1-frequencyData[4]/255.0,1-frequencyData[5]/255.0).getHex(),
                       new THREE.Color(frequencyData[6]/255.0,frequencyData[7]/255.0,frequencyData[8]/255.0).getHex());
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
