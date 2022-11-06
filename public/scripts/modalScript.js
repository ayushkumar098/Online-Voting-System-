let canvas = document.getElementById('canvas');
let video = document.getElementById('video');
let openModalbut = document.querySelector('[data-modal-target]');
let closedModalbut = document.querySelector('[data-close-button]');
let overlay = document.getElementById('overlay');
let snapbut = document.getElementById('snap');
let imgUrl = document.createElement('p');//To store the image data url
var localstream;

openModalbut.addEventListener('click', ()=>{
    const modal = document.querySelector(openModalbut.dataset.modalTarget);
    openModal(modal);
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({video: true}).then(stream =>{
            localstream = stream;
            video.srcObject = stream;
            video.play();
        });
    }
})
snapbut.addEventListener('click', ()=>{
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.clientWidth, canvas.height);
    document.getElementById('snapSend').style.display = 'block';
    imgUrl.innerHTML = canvas.toDataURL('image/jpeg');
    imgUrl.style.display='none';
    document.querySelector('.modal-body').appendChild(imgUrl);
})

overlay.addEventListener('click', () => {
    const modal = document.querySelector('.modal.active');
    video.pause();
    localstream.getTracks()[0].stop();
    video.src = "";
    closeModal(modal)
})

closedModalbut.addEventListener('click', ()=>{
    const modal = closedModalbut.closest('.modal');
    video.pause();
    localstream.getTracks()[0].stop();
    video.src = "";
    closeModal(modal)
})


function openModal(modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')
  }
  
  function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')
    canvas.getContext("2d").clearRect(0, 0, canvas.clientWidth, canvas.height)
  }