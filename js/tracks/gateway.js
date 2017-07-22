Gateway = function (r,i, color1,color2){
    this.radius=r;
    this.index=i
    this.sphere=addGradientShaderSphere(r,color1, color2);

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

  this.play=function(position){

  }

  this.songDidChange=function(s){
    if(s==this){
      //This song just started

        console.log(this);
    }
    else{
      //Other song started
    }
  }
}
