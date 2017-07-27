class Song7 extends Song{
  constructor(r,i, color1,color2){
    super(r,i, color1,color2);
    this.sphere=getMeshPhongSphere(r,color1,1);//getGradientShaderSphere(r,color1, color2);
    this.addObject(this.sphere);
  }

  play(position){
    worlds[(this.index+1)%worlds.length].setColor(new THREE.Color(1-frequencyData[3]/255.0,1-frequencyData[4]/255.0,1-frequencyData[5]/255.0).getHex(),
                      new THREE.Color(frequencyData[6]/255.0,frequencyData[7]/255.0,frequencyData[8]/255.0).getHex());
  }

  songDidStart(s){
    //dnaCurveObject.setVisible(true);
  }

  songDidEnd(s){
    //dnaCurveObject.setVisible(false);
  }
}
