import * as THREE from 'three';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const cylinder = new THREE.Mesh(geometry, material);

scene.add(cylinder);
camera.position.z = 10;

renderer.setSize(600, 600);
document.body.appendChild(renderer.domElement);

let isMouseDown = false;
let mouseY = 0;
let mouseX = 0;

document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mouseup', onMouseUp, false);
document.addEventListener('mousemove', onMouseMove, false);

function onMouseDown(event) {
    isMouseDown = true;
}

function onMouseUp(event) {
    isMouseDown = false;
}

function onMouseMove(event) {
    if (isMouseDown) {
        const deltaX = (event.clientX / window.innerWidth) * 2 - 1;
        const deltaY = -(event.clientY / window.innerHeight) * 2 + 1;

        // Ajustez les coefficients selon vos besoins pour contrôler la vitesse de rotation
        cylinder.rotation.x += deltaY * 0.5;
        cylinder.rotation.y += deltaX * 0.5;
        cylinder.rotation.z += deltaX * 0.5; // Ajoutez la rotation autour de l'axe Z
    }
}

// Utilisez l'API Web Audio pour analyser les données audio
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
const dataArray = new Uint8Array(analyser.frequencyBinCount);

// Charger votre piste audio
const audioElement = new Audio("./musique/Soolking ft. Gazo - Casanova [Clip Officiel].mp3");
const audioSource = audioContext.createMediaElementSource(audioElement);
audioSource.connect(analyser);
analyser.connect(audioContext.destination);

audioElement.play();

function animate() {
    // Mettez à jour les données audio et ajustez la géométrie du cylindre en fonction
    analyser.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((acc, value) => acc + value, 0) / dataArray.length;
    const scale = (average / 128) * 1;

    cylinder.scale.set(scale, scale, scale);

    // Ajout du mouvement vertical en fonction de la position de la souris
    const targetY = mouseY * 10;
    cylinder.position.y += (targetY - cylinder.position.y) * 0.05;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();
