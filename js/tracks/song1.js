class Song1 extends Song{
  constructor(r,i, color1,color2){
    super(r,i, color1,color2);
    this.sphere=getGradientShaderSphere(r,color1, color2);
    this.addObject(this.sphere);
  }

  play(position){
    super.play(position);
  }

  songDidStart(s){
    super.songDidStart();
    dnaCurveObject.setVisible(true);
    dnaCurveObject.moveToNext();
  }

  songDidEnd(s){
    super.songDidEnd();
    dnaCurveObject.setVisible(false);
  }
}
