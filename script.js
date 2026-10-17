const loader = document.getElementById("loader");
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hide"), 1100);
});

function goTo(id) {
  document.getElementById(id).scrollIntoView({behavior:"smooth"});
}

/* Stars */
let stars = [];
function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

for(let i=0;i<190;i++){
  stars.push({
    x:Math.random()*innerWidth,
    y:Math.random()*innerHeight,
    r:Math.random()*1.5+.2,
    speed:Math.random()*.25+.03,
    phase:Math.random()*Math.PI*2
  });
}

function animateStars(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const s of stars){
    s.phase += .012;
    const alpha = .25 + (Math.sin(s.phase)+1)*.3;
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,255,255,${alpha})`;
    ctx.fill();
    s.y -= s.speed;
    if(s.y < -5) s.y = canvas.height + 5;
  }
  requestAnimationFrame(animateStars);
}
animateStars();

/* Photo parallax */
const photo = document.querySelector(".photo-card");
addEventListener("mousemove",(e)=>{
  if(innerWidth <= 800) return;
  const x = e.clientX/innerWidth-.5;
  const y = e.clientY/innerHeight-.5;
  photo.style.transform=`rotate(${3+x*5}deg) translate(${x*10}px,${y*10}px)`;
});

/* Music
   Browsers block automatic sound until the visitor interacts.
   The first click anywhere starts the local MP3 if it exists.
*/
let playing=false;

async function startMusic(){
  try{
    await music.play();
    playing=true;
    musicBtn.innerHTML="♫ <span>Musiqa yoqilgan</span>";
  }catch(e){
    musicBtn.innerHTML="♫ <span>Musiqani yoqish</span>";
  }
}

musicBtn.addEventListener("click",()=>{
  if(playing){
    music.pause();
    playing=false;
    musicBtn.innerHTML="♫ <span>Musiqani yoqish</span>";
  }else{
    startMusic();
  }
});

document.addEventListener("click", (e)=>{
  if(e.target !== musicBtn && !playing) startMusic();
},{once:true});

/* Scroll reveal */
const reveals=document.querySelectorAll(".reveal");
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});

reveals.forEach(el=>observer.observe(el));
