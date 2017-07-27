class Song10 extends Song{
  constructor(r,i, color1,color2){
    super(r,i, color1,color2);
    this.sphere=getGradientShaderSphere(r,color1, color2);
    this.addObject(this.sphere);
  }

  play(position){
    super.play(position);
    worlds[(this.index+1)%worlds.length].setColor(new THREE.Color(1-frequencyData[3]/255.0,1-frequencyData[4]/255.0,1-frequencyData[5]/255.0).getHex(),
                      new THREE.Color(frequencyData[6]/255.0,frequencyData[7]/255.0,frequencyData[8]/255.0).getHex());
  }

  songDidStart(s){
    //dnaCurveObject.scale(100*100);
    this.setColor(0x111111,0x222222);
    if(obj_file){
      obj_file.scale.set(1.5,1.5,1.5);
      obj_file.visible=true;
    }
  }

  songDidEnd(s){
    if(obj_file){
      obj_file.visible=false;
    }
  }
}
