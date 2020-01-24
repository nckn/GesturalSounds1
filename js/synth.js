// ml5.js: Pose Estimation with PoseNet
// The Coding Train / Daniel Shiffman
// https://thecodingtrain.com/Courses/ml5-beginners-guide/7.1-posenet.html
// https://youtu.be/OIo-DIOkNVg
// https://editor.p5js.org/codingtrain/sketches/ULA97pJXR

let video;
let poseNet;
let pose;
let skeleton;

// Oscillator
var wave;
var button;
var slider;
var playing = false;
let yS = 0;
let range = {min: 40, max: 120};

function setup() {
  createCanvas(640, 480);
  // poseNet
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  // Synth
  wave = new p5.Oscillator();
  slider = createSlider(100, 1200, 440);

  wave.setType('sine');
  wave.start();
  wave.freq(440);
  wave.amp(0);

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
  image(video, 0, 0);

  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
    fill(255, 0, 0);
    ellipse(pose.nose.x, pose.nose.y, d);
    fill(0, 0, 255);
    ellipse(pose.rightWrist.x, pose.rightWrist.y, 32);
    ellipse(pose.leftWrist.x, pose.leftWrist.y, 32);

    // log value
    // print('point val: ' + pose.nose.y);
    
    // Remap value
    yS = map(pose.nose.y, 0, 480, range.min, range.max, true);
    print('yS val: ' + yS);

    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0, 255, 0);
      ellipse(x, y, 16, 16);
    }

    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(255);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
  }

  // Synth
  // wave.freq(slider.value()); // The slider
  wave.freq(yS);
  // print('slider val: ' + slider.value());
  // if (playing) {
  //   background(255, 0, 255);
  // } else {
  //   background(51);
  // }
}

function toggle() {
  if (!playing) {
    wave.amp(0.5, 1);
    playing = true;
  } else {
    wave.amp(0, 1);
    playing = false;
  }
}