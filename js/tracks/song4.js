class Song4 extends Song{
  constructor(r,i, color1,color2){
    super(r,i, color1,color2);
    this.sphere=getGradientShaderSphere(r,color1, color2);
    this.addObject(this.sphere);
  }

  play(position){
  }

  songDidStart(s){
    dnaCurveObject.setVisible(true);
    dnaCurveObject.moveToNext();
  }

  songDidEnd(s){
    dnaCurveObject.setVisible(false);
  }

}
