DNACurveObject = function (n_points,resolution){
  this.index=0;
  this.prevIndex=0;
  this.n_points=n_points;
  this.resolution=resolution;
  this.current_points;
  this.vertices=[];
  this.alpha=0.999;
  this.transition_speed=0.6;
  this.line_material=new THREE.MeshBasicMaterial({ color: 0x999999,transparent:true,opacity:0.5 });//new THREE.MeshBasicMaterial({ color: 0xffffff,transparent:true,opacity:0.7,shininess:500,specular: 0xffffff,emissive: 0xffffff});;
  this.sphere_material=new THREE.MeshBasicMaterial({ color: 0x000000,transparent:true,opacity:1 });
  this.spheres=[];
  this.group=new THREE.Group();

  this.init=function(){
    var aux_v=[];
    for(var i=0;i<this.n_points;i++)
      aux_v.push(new THREE.Vector3(0,0,0));
    this.dnaCurve = new THREE.CatmullRomCurve3(aux_v);
    this.dnaCurve.tension=2;
    this.dnaCurve.type = 'chordal';
    var geometry = new THREE.Geometry();
    this.dnaCurveObject = new THREE.Line( geometry, this.line_material );
    scene.add( this.dnaCurveObject );
    const sphereGeomtry = new THREE.SphereBufferGeometry( 0.025,5,5 );
    for(var i=0;i<this.n_points;i++){
      var helper = new THREE.Mesh( sphereGeomtry, this.sphere_material );
      //helper.position.copy( this.dnaCurve.points[i] );
      this.spheres.push(helper);
      this.group.add(helper);
    }
    scene.add(this.group);
    this.scale(400);
  }


  this.update=function(){
    if(this.alpha<1){
      for(var i=0;i<this.n_points;i++){
        this.dnaCurve.points[i].set(
          this.alpha*this.vertices[this.index][i].x+(1.0-this.alpha)*this.dnaCurve.points[i].x,
          this.alpha*this.vertices[this.index][i].y+(1.0-this.alpha)*this.dnaCurve.points[i].y,
          this.alpha*this.vertices[this.index][i].z+(1.0-this.alpha)*this.dnaCurve.points[i].z);
        this.spheres[i].position.copy(this.dnaCurve.points[i]
          //new THREE.Vector3(
    //      this.dnaCurve.points[i].x*this.dnaCurveObject.scale.x,
    //      this.dnaCurve.points[i].y*this.dnaCurveObject.scale.y,
    //      this.dnaCurve.points[i].z*this.dnaCurveObject.scale.z
    //  )
      );
     }

     this.dnaCurveObject.geometry.vertices = this.dnaCurve.getPoints(this.n_points*this.resolution );
     this.dnaCurveObject.geometry.verticesNeedUpdate = true;
    }
    this.alpha=clamp(this.alpha+1/(this.transition_speed*10000.0),0,1);
    //$('#log').text(this.alpha);
  }

  this.addVertices=function(vertices){
    this.vertices.push(vertices);
  }

  this.scale=function(s){
    this.dnaCurveObject.scale.set(s,s,s);
    this.group.scale.set(s,s,s);

  }

  this.addDNAShape=function(scale=1){
    var positions=[];
    positions.push(new THREE.Vector3(0,0,0));
    for(var i=1;i<this.n_points;i++){
    	positions.push(new THREE.Vector3(
        scale*(positions[positions.length-1].x+Math.random()*1.1-0.5),//*i-i,
    		scale*(positions[positions.length-1].y+Math.random()*1.1-0.5),//*i-i,
    		scale*(positions[positions.length-1].z+Math.random()*1.1-0.5)));//*i-i));
    }
    this.addVertices(positions);
  }

  this.addOBJ=function(path,scale,translate,start,end,callback){
    var tgeom=loadOBJ(path,function(tgeom){
      console.log(path+" loaded");

      var vvertices=[];
      for(var i=0;i<dnaCurveObject.n_points;i++){
        var aux=Math.floor((tgeom.vertices.length-1)*(end-start)/dnaCurveObject.n_points);
        var index=Math.floor((tgeom.vertices.length-1)*start+aux*i);
        vvertices.push(
          new THREE.Vector3(
            (tgeom.vertices[index].x+translate.x)*scale,
            (tgeom.vertices[index].y+translate.y)*scale,
            (tgeom.vertices[index].z+translate.z)*scale)
          );

      }
      dnaCurveObject.addVertices(vvertices);

      if(callback)
        callback();
    });
  }

  this.moveToIndex=function(index){
    if(index!=this.index){
      this.index=index;
      console.log("changing to "+this.index+"!");
      this.alpha=0;
    }
  }

  this.setIndex=function(index){
    if(index!=this.index){
      this.index=index;
      console.log("set_changing! "+this.prevIndex+" "+this.index);
      this.alpha=0.9999999999999999;
    }
  }


  this.init();
}
