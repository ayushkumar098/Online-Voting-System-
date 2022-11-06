const imageUpload = document.getElementById("imageUpload");
const testImg = document.getElementById("test-img");

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
]).then(start);

async function start() {
  const container = document.createElement("div");
  container.style.position = "relative";
  document.body.append(container);
  const labeledFaceDescriptors = await loadLabeledImages();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
  let image;
  let canvas;
  document.body.append("Loaded");
  imageUpload.addEventListener("click", async () => {
    if (image) image.remove();
    if (canvas) canvas.remove();
    // image = await faceapi.bufferToImage(imageUpload.files[0]);
    image = testImg;
    container.append(image);
    canvas = faceapi.createCanvasFromMedia(image);
    container.append(canvas);
    const displaySize = { width: image.width, height: image.height };
    faceapi.matchDimensions(canvas, displaySize);
    const detections = await faceapi
      .detectAllFaces(image)
      .withFaceLandmarks()
      .withFaceDescriptors();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const results = resizedDetections.map((d) =>
      faceMatcher.findBestMatch(d.descriptor)
    );
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box;
      const drawBox = new faceapi.draw.DrawBox(box, {
        label: result.toString(),
      });
      drawBox.draw(canvas);
    });
  });
}

function loadLabeledImages() {
  const labels = [
    "54322",
  ];
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      for (let i = 1; i <= 1; i++) {
        const img = document.getElementById("sampleImg");
        //const img = await faceapi.bufferToImage(sampleImg.files[0]);
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(detections.descriptor);
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}

// async function start() {
  
//   const container = document.createElement("div");
//   container.style.position = "relative";
//   document.body.append(container);
//   document.body.append("Loaded");
//   imageUpload.addEventListener("change", async () => {
    
//     image = await faceapi.bufferToImage(imageUpload.files[0]);
//     container.append(image)
//     const canvas = faceapi.createCanvasFromMedia(image)
//     container.append(canvas)
//     const displaySize = {width:image.width,height: image.height}
//     faceapi.matchDimensions(canvas,displaySize)
//     const detections = await faceapi
//       .detectAllFaces(image)
//       .withFaceLandmarks()
//       .withFaceDescriptors();
//     document.body.append(detections.length)
//     const resizedDetections = faceapi.resizeResults(detections, displaySize);

//     resizedDetections.forEach(detection => {
//         const box = detection.detection.box
//         const drawBox = new faceapi.draw.DrawBox(box,{label: 'Face'})
//         drawBox.draw(canvas)
//     });
//   });
// }
