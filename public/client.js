import * as THREE from './build/three.module.js';
import {OrbitControls} from '/jsm/controls/OrbitControls.js';
import Stats from '/jsm/libs/stats.module.js';


let scene;
let camera;
let renderer;

var timeStart;

const canvas = document.querySelector('.webgl');

//create a scene
scene = new THREE.Scene();


//=======================CAMERA=========================
//create a camera
const fov = 60; // view angle is 60 degrees
//get aspect of screen
const aspect = window.innerWidth/ window.innerHeight;
//objects within [near,far] is visible
const near = 0.1;
const far = 900;

camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
//set cameras position
camera.position.z = 100;
scene.add(camera);
//=======================CAMERA=========================

//=====================RENDERER=========================
//create a renderer
renderer = new THREE.WebGLRenderer({
    //render all our objects
    canvas: canvas,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.autoClear = false;
//hex value
renderer.setClearColor(0x000000,0.0);



//=====================RENDERER=========================

//create controls
const controls = new OrbitControls(camera, renderer.domElement );


//=========================LIGHTS=======================

//addSphere function
THREE.PointLight.prototype.addSphere = function(){
    this.sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5,4,4),
    new THREE.MeshBasicMaterial({color: this.color}))
    this.add(this.sphere);
}

//create a light sources
//const ambientLight = new THREE.AmbientLight(0xffffff,0.2);
//scene.add(ambientLight);



const pointLight = new THREE.PointLight(0xffffff,1);
pointLight.addSphere();
var lightPosition = new THREE.Vector3(200,50,50);

pointLight.position.set(lightPosition.x,lightPosition.y,lightPosition.z);
scene.add(pointLight);


//=========================LIGHTS=======================


//==========================WORLD=======================
//create structure of the world
var sphereRadius = 30.0;


var sharedUniforms={
    lightPosition:{
        type: "v3",
        value: lightPosition
    }
};

var worldMaterial = new THREE.ShaderMaterial({
    //color: 0x00ffff,
   // wireframe:true,
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    uniforms: sharedUniforms,

});
//150,150
var worldGeometry = new THREE.IcosahedronGeometry(sphereRadius,200,200);

var worldMesh = new THREE.Mesh(worldGeometry,worldMaterial);
scene.add(worldMesh);


//==========================WORLD=======================


//==========================WATER=======================

var waterRadius = 30.4;


var sharedUniformsWater={
    lightPosition:{
        type: "v3",
        value: lightPosition
    },
    waterRadius:{
        type: "f",
        value: waterRadius
    },
    uTime:{
        type:"f",
        value:0.0
    }
};

var waterMaterial = new THREE.ShaderMaterial({
    //color: 0x00ffff,
    //wireframe:true
    vertexShader: document.getElementById('vertexShaderWater').textContent,
    fragmentShader: document.getElementById('fragmentShaderWater').textContent,
    uniforms: sharedUniformsWater,

});
//100,100
var waterGeometry = new THREE.IcosahedronGeometry(waterRadius,100,100);

var waterMesh = new THREE.Mesh(waterGeometry,waterMaterial);
scene.add(waterMesh);

//==========================WATER=======================

//=======================ATMOSPHERE=====================
var atmosRadius = 36.0;


var sharedUniformsAtmos={
    lightPosition:{
        type: "v3",
        value: lightPosition
    }
};

var atmosMaterial = new THREE.ShaderMaterial({
    //color: 0x00ffff,
    //wireframe:true
    vertexShader: document.getElementById('vertexShaderAtmosphere').textContent,
    fragmentShader: document.getElementById('fragmentShaderAtmosphere').textContent,
    uniforms: sharedUniformsAtmos,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide

});
var atmosGeometry = new THREE.IcosahedronGeometry(atmosRadius,20,20);

var atmosphereMesh = new THREE.Mesh(atmosGeometry,atmosMaterial);
scene.add(atmosphereMesh);


//=======================ATMOSPHERE=====================


//================RENDERING AND ANIMATION===============
//Create function that animates the scene
timeStart = Date.now();

const animate=()=>{
   
    sharedUniformsWater.uTime.value = (Date.now()- timeStart) / 250;

    
    //worldMesh.rotation.y -= 0.0014;
    
    //skyBoxMesh.rotation.y -= 0.001;

    //add controls
    controls.update();

    //call update function
    render();

    //calls itself for every frame
    requestAnimationFrame(animate);

}

const render =()=>{
    //finally render the scene
    renderer.render(scene,camera);
}

animate();
//================RENDERING AND ANIMATION===============