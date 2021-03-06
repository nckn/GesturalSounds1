// ml5.js: Pose Estimation with PoseNet
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/Courses/ml5-beginners-guide/7.1-posenet.html
// https://youtu.be/OIo-DIOkNVg
// https://editor.p5js.org/codingtrain/sketches/ULA97pJXR

let video;
// let flippedVideo;
let poseNet;
let pose;
let skeleton;
let distance;
let remappedDist;

// Oscillator
var oscillators = [
  {type: 'sine', playing: false, curPos: 0, curFreq: 0, mod: 0},
  {type: 'square', playing: false, curPos: 0, curFreq: 0, mod: 0}
];
var button;
var slider;
// var playing = false;
// let curFreq = [];
let range = {min: 40, max: 180};

// Modulator
// let modulator; // this oscillator will modulate the amplitude of the carrier

function setup() {
  createCanvas(640, 480);
  // poseNet
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  // Flip video
  // flippedVideo = ml5.flipImage(video)
  
  // Synth
  oscillators.forEach(osc => {
    osc.wave = new p5.Oscillator();
    osc.wave.setType(osc.type);
    osc.wave.start();
    osc.wave.freq(440);
    osc.wave.amp(0.5);
    // Modulate the carrier's amplitude with the modulator
    // Optionally, we can scale the signal.
    // osc.wave.amp(modulator.scale(-1, 1, 1, -1));
    // Modulator
    osc.mod = new p5.Oscillator('triangle');
    osc.mod.disconnect(); // disconnect the modulator from master output
    osc.mod.freq(5);
    osc.mod.amp(1);
    osc.mod.start();
    // Hook osc up w/ its mod
    // osc.wave.amp(0); // This lines enables the mod effect
    // osc.wave.amp(osc.mod.scale(-1, 1, 1, -1)); // This lines enables the mod effect
  });
  

  // Modulate the carrier's amplitude with the modulator
  // Optionally, we can scale the signal.
  // oscillators[0].wave.amp(modulator.scale(-1, 1, 1, -1));

  // Create slider
  slider = createSlider(100, 1200, 440);

  button = createButton('play/pause');
  button.mousePressed(toggle);
}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  // Draw video
  image(video, 0, 0);
  // image(flippedVideo, 0, 0, 640, 480);

  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    distance = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    // Distance
    // print('distance: ' + distance);
    // Remap value
    remappedDist = map(distance, 0, 200, 20, 0);

    // Draw nose
    // fill(255, 0, 0);
    // ellipse(pose.nose.x, pose.nose.y, distance);
    
    // Draw wrist points
    // fill(0, 0, 255);
    // ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
    // ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);
    
    // Draw ear points
    fill(0, 0, 255);
    ellipse(pose.leftEar.x, pose.leftEar.y, 32);
    ellipse(pose.rightEar.x, pose.rightEar.y, 32);

    // log value
    // print('point val: ' + pose.nose.y);
    
    // Remap value
    // curFreq = map(pose.nose.y, 0, 480, range.min, range.max, true);
    // oscillators[0].curFreq = map(pose.nose.y, 480, 0, range.min, range.max);
    // print('curFreq val: ' + oscillators[0].curFreq);

    // Draw ellipses for each point
    // for (let i = 0; i < pose.keypoints.length; i++) {
    //   let x = pose.keypoints[i].position.x;
    //   let y = pose.keypoints[i].position.y;
    //   fill(0, 255, 0);
    //   ellipse(x, y, 16, 16);
    // }

    // Draw lines btw each connected point in skeleton
    // for (let i = 0; i < skeleton.length; i++) {
    //   let a = skeleton[i][0];
    //   let b = skeleton[i][1];
    //   strokeWeight(2);
    //   stroke(255);
    //   line(a.position.x, a.position.y, b.position.x, b.position.y);
    // }

    // Set the different pos for each osc to be translated to a freq
    oscillators[0].curPos = pose.leftEar.y
    oscillators[1].curPos = pose.rightEar.y
  }

  // map mouseY to moodulator freq between 0 and 20hz
  // let modFreq = map(mouseY, 0, height, 20, 0);
  // modulator.freq(modFreq);

  
  // Synth
  // osc.freq(slider.value()); // The slider
  // Synth
  oscillators.forEach(osc => {
    // Update mods
    osc.mod.freq(remappedDist);
    let modAmp = map(mouseX, 0, width, 0, 1);
    osc.mod.amp(modAmp, 0.01); // fade time of 0.1 for smooth fading
    // Update oscillators
    osc.curFreq = map(osc.curPos, 480, 0, range.min, range.max);
    osc.wave.freq(osc.curFreq);
  });
  // print('slider val: ' + slider.value());
  // if (playing) {
  //   background(255, 0, 255);
  // } else {
  //   background(51);
  // }
}

function toggle() {
  // Synth
  oscillators.forEach(osc => {
    if (!osc.playing) {
      osc.wave.amp(0.5, 1);
      osc.playing = true;
    } else {
      osc.wave.amp(0, 1);
      osc.playing = false;
    }
  });
}