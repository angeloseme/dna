class Song {
  constructor(r,i, col1,col2){
    //var self=this;
    this.radius=r;
    this.index=i
    this.author="Author";
    this.group=new THREE.Group();
    this.title=this.constructor.name;
    this.params={visible:true,color1:col1,color2:col2,opacity:1};
    this.gui = songsGui.addFolder(this.title);
    this.gui.add( this.params, 'visible').onChange( (function( value ) { this.setVisible(value);}).bind(this) ).listen();
    this.gui.addColor( this.params, 'color1').onChange( (function( value ) { this.setColor(value,this.params.color2)}).bind(this) ).listen();
    this.gui.addColor( this.params, 'color2').onChange( (function( value ) { this.setColor(this.params.color1,value)}).bind(this) ).listen();
    this.gui.add( this.params, 'opacity',0,1).onChange( (function( value ) { this.setOpacity(value); }).bind(this)).listen();
    scene.add(this.group);
  }

  play(position){
  }

  songDidStart(s){
  }

  songDidEnd(s){
  }

  addObject(o){
    this.group.add(o);
  }

  scale(f){
    this.group.scale.set(f,f,f);
  }

  setVisible(t){
    this.group.visible=t;
  }

  setColor(color1,color2){
    this.params.color1=color1;
    this.params.color2=color2;

    if(this.sphere.material instanceof THREE.ShaderMaterial){
      this.sphere.material.uniforms.topColor.value=new THREE.Color( this.params.color1 );
      this.sphere.material.uniforms.bottomColor.value=new THREE.Color( this.params.color2 );
    }
    else{
      this.sphere.material.color=new THREE.Color( this.params.color1 );
    }
  }

  setOpacity(f){
    if(this.sphere.material instanceof THREE.ShaderMaterial){
      this.sphere.material.uniforms.opacity.value=f;
    }else{
      this.sphere.material.opacity=f;
    }
  }
}
