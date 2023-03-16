const result = document.querySelector("#result");
const btnSubmit = document.querySelector("button[type=submit]");
function uploadAudio(event) {
  result.classList.remove('alert-success');
  result.classList.remove('alert-danger');
  event.preventDefault();
  btnSubmit.setAttribute('disabled',true);
  btnSubmit.classList.add('loading');
  result.innerHTML = '';
  const fileInput = document.querySelector("#audioFile");
  makeRequest(fileInput.files[0]);
}

const form = document.getElementById('audioForm');
form.addEventListener('submit',uploadAudio);

const btnRecord = document.querySelector('#recordAudio');
const playlist = document.querySelector('#playlist');
const recorder = new MicRecorder({
  bitRate: 128
});

btnRecord.addEventListener('click',startRecording);
function startRecording() {
  result.classList.remove('alert-success');
  result.classList.remove('alert-danger');
  result.innerHTML = "";
  playlist.innerHTML = "";
  recorder.start().then(() => {
    btnRecord.textContent = 'Stop recording';
    btnRecord.classList.toggle('btn-danger');
    btnRecord.removeEventListener('click',startRecording);
    btnRecord.addEventListener('click',stopRecording);
  }).catch((e) => {
    console.error(e);
  });

}
function stopRecording() {
  recorder.stop().getMp3().then(([buffer,blob]) => {
    console.log(buffer,blob);
    const file = new File(buffer,'music.mp3',{
      type: blob.type,
      lastModified: Date.now()
    });

    makeRequest(file)
    const player = new Audio(URL.createObjectURL(file));
    player.controls = true;
    playlist.appendChild(player);

    btnRecord.textContent = 'Record';
    btnRecord.classList.toggle('btn-danger');
    btnRecord.removeEventListener('click',stopRecording);
    btnRecord.addEventListener('click',startRecording);
  }).catch((e) => {
    console.error(e);
  });
}


function makeRequest(file) {
  const form = new FormData();
  form.append('file',file);
  axios.post('/audio',form)
    .then(response => {
      console.log(response.data);
      const text = response.data.text;
      result.innerHTML = text || 'Vazio';
      result.classList.add('alert-success');
      btnSubmit.removeAttribute('disabled');
      btnSubmit.classList.remove('loading');
    })
    .catch((error) => {
      console.log(error);
      result.innerHTML = error?.message || 'ERROR';
      result.classList.add('alert-danger');
      btnSubmit.removeAttribute('disabled');
      btnSubmit.classList.remove('loading');
    });
}