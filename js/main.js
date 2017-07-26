
  var sound = new Howl({
      src: ['audio/1.mp3'],
      loop: true
    });

  var analyser =   Howler.ctx.createAnalyser();
  analyser.fftSize = 32;
  Howler.masterGain.connect(analyser);
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  sound.once('load', function(){
    sound.play();
  });
