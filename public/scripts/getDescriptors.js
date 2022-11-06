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
  const labeledFaceDescriptors = await loadLabeledImages()
  // console.log(labeledFaceDescriptors, typeof(labeledFaceDescriptors));
//   const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
//   alert('Content Loaded');
  document.getElementById('loaded').innerHTML = 'Image Loaded';
  aniWrap.classList.remove('active');
  ring.style.display = 'none';
  let descriptorString = labeledFaceDescriptors.toString();
  // let descriptorString = JSON.stringify(labeledFaceDescriptors);
  descInput.value = descriptorString;
  imgInput.value = document.querySelector('.modal-body > p').innerHTML;
  document.getElementById('infoForm').appendChild(imgInput);
  document.getElementById('infoForm').appendChild(descInput);
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

  function loadLabeledImages() {
    const labels = [""+document.querySelector('#name').value]
    console.log('Labels:', labels)
    return Promise.all(
      labels.map(async label => {
        const descriptions = []
        const img = document.createElement('img');
        img.src = document.querySelector('.modal-body > p').innerHTML;
        // const img = await faceapi.fetchImage(`https://i.ibb.co/3SHsLPg/Ashwin.jpg`);
        console.log(await faceapi.detectSingleFace(img));
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
        descriptions.push(detections.descriptor)

        return JSON.stringify(new faceapi.LabeledFaceDescriptors(label, descriptions));
      })
    )
  }