const loadScript = (src, index, type='text/javaScript', progress=()=>{}, done=()=>{}) => {
    return new Promise((resolve, reject)=>{
        const script = document.createElement('script');
        script.src = src[index];
        const xhr = new XMLHttpRequest();
        xhr.open('GET', script.src, true);
        xhr.responseType = 'blob';
        xhr.onloadstart = () => {
            console.log('Download started...');
        };
        xhr.onprogress = (event) => {
            if (event.lengthComputable) {
                const p = (event.loaded / event.total);
                progress(index, src, type, p);
            }
        };
        xhr.onload = () => {
            console.log('Download complete!');
            if(xhr.status === 200){
                const scriptBlob = xhr.response;
                const scriptURL = URL.createObjectURL(scriptBlob);
                script.src = scriptURL;
                script.type = type;
                document.head.appendChild(script);
                done(index, src, type, 1);
                resolve();
            }
            if(xhr.status != 200){
                reject('Non 200 status (' + xhr.status  + ') when loading ' + src );
            }
        };
        xhr.onerror = () => {
            reject('Unkown XMLHttpRequest Error.');
        };
        xhr.send();
    });
};


const canvas = document.getElementById('loader_canvas');
const ctx = canvas.getContext("2d");
const progress = (index, src, type, fp) => {
    const ip = 1 / src.length;
    const tp = ip * index + ip * fp;
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, canvas.height / 2 - 20, canvas.width * tp, 40)    
}

const src = ["../../phaser.min.js", './demo.js'];
loadScript(src, 0, 'text/javaScript', progress)
.then( () => {
    canvas.style.display = 'none';
    return loadScript(src, 1, 'module', progress);
})
.catch( (e) => {
    document.body.innerHTML = e;
})

