class Song5 extends Song{
  constructor(r,i, color1,color2){
    super(r,i, color1,color2);
    this.sphere=getGradientShaderSphere(r,color1, color2);
    this.addObject(this.sphere);
    this.orbit=1.5*this.radius*inner_radius/outer_radius;
    this.satellite=getBasicSphere(0.1*this.radius*inner_radius/outer_radius,0xffffff);
    this.addObject(this.satellite);
    this.satellite.position.set(this.orbit*Math.sin(elapsedTime),0*Math.cos(elapsedTime),this.orbit*Math.cos(elapsedTime));
  }

  play(position){
    super.play(position);
    this.satellite.position.set(this.orbit*Math.sin(elapsedTime),0*Math.cos(elapsedTime),this.orbit*Math.cos(elapsedTime));
  }

  songDidStart(s){
      //dnaCurveObject.setVisible(true);
  }

  songDidEnd(s){
    //dnaCurveObject.setVisible(false);
  }
}
