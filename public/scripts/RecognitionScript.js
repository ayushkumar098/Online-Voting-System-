let imgSnap = document.getElementById('snapSend');
let aniWrap = document.getElementById('wrap-animation');
let ring = document.querySelector('.ring');
imgSnap.addEventListener('click', ()=>{
    aniWrap.classList.add('active');
    ring.style.display = 'block';
    Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
      ]).then(start)
    
})

async function start(){
    const modal = document.querySelector('.modal.active');
    closedModal(modal);
    let descInput = document.createElement('input');
    descInput.name = 'imgDesc';
    descInput.type = 'text';
    descInput.style.display = 'none';
    let imgInput = document.createElement('input');
    imgInput.name = 'imgURL';
    imgInput.type = 'text';
    imgInput.style.display = 'none';
    let imgDescMap = JSON.parse(document.getElementById('loaded-desc').innerHTML)._descriptors[0];
    var MapVal = []
    for(var i in imgDescMap)
      MapVal.push(imgDescMap[i]);
    let imgDesc = [new Float32Array(Array.from(MapVal))];
    console.log(imgDesc);
    const labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors(JSON.parse(document.getElementById('loaded-desc').innerHTML)._label, imgDesc)
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.4)
    let image;
    image = document.createElement('img');
    image.src = document.querySelector('.modal-body > p').innerHTML;
    image.width = '320';
    image.height = '240';
    const displaySize = { width: image.width, height: image.height }
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    let resLabel = [];
    results.forEach((result)=>{
        resLabel.push(result._label)
    })
    if(resLabel.includes(JSON.parse(document.getElementById('loaded-desc').innerHTML)._label)){
      window.location.href = "/generateOTP";
    }
    else{
      alert('Face Not Matching...Try Again');
      aniWrap.classList.remove('active');
      ring.style.display = 'none';
    }

}

function closedModal(modal) {
    if (modal == null) return
    let video = document.getElementById('video');
    video.pause();
    localstream.getTracks()[0].stop();
    video.src = "";
    modal.classList.remove('active')
    overlay.classList.remove('active')
    canvas.getContext("2d").clearRect(0, 0, canvas.clientWidth, canvas.height)
  }

