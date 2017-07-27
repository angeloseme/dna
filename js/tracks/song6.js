class Song6 extends Song{
  constructor(r,i, color1,color2){
    super(r,i, color1,color2);
    this.sphere=getMeshPhongSphere(r,color1,1);//getGradientShaderSphere(r,color1, color2);
    this.addObject(this.sphere);
    this.orbit=2*this.radius*inner_radius/outer_radius;
    this.satellite=getBasicSphere(0.1*this.radius*inner_radius/outer_radius,0xffffff);
    this.addObject(this.satellite);
    this.satellite.position.set(this.orbit*Math.sin(elapsedTime),0*Math.cos(elapsedTime),this.orbit*Math.cos(elapsedTime));
    this.prev_intensity=directionalLight.intensity;
  }

  play(position){
    super.play(position);
    var maxV=-1;
    for(var i=0;i<3;i++){
      maxV=Math.max(frequencyData[i],maxV);
    }
    this.satellite.position.set(this.orbit*Math.sin(elapsedTime),0*Math.cos(elapsedTime),this.orbit*Math.cos(elapsedTime));
    directionalLight.intensity=maxV/255;
    this.satellite.material.color.set(new THREE.Color(frequencyData[0]/255,frequencyData[1]/255,frequencyData[2]/255));
    directionalLight.color.copy(this.satellite.material.color);//
  }

  songDidStart(s){

    //this.prev_ambient_light_intensity=ambientLight.intensity;
    //dnaCurveObject.setVisible(true);
  }

  songDidEnd(s){

    directionalLight.intensity=this.prev_intensity;
    directionalLight.color=new THREE.Color(1,1,1);
    //ambientLight.intensity=this.prev_ambient_light_intensity;
    //dnaCurveObject.setVisible(false);
  }
}
