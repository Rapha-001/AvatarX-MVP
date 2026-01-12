// Scroll reveal for cards
const cards = document.querySelectorAll('.reveal');
function revealCards(){
  const windowHeight = window.innerHeight;
  cards.forEach(card=>{
    const cardTop = card.getBoundingClientRect().top;
    if(cardTop<windowHeight-150){card.classList.add('active');}else{card.classList.remove('active');}
  });
}
window.addEventListener('scroll',revealCards);
revealCards();

// Floating 3D Words
const wordsContainer=document.querySelector('.floating-words');
const wordTexts=['Web3','Learn','Build','Community','Explore','Blockchain','Contribute','Projects','Growth'];
for(let i=0;i<30;i++){
  const span=document.createElement('span');
  span.innerText=wordTexts[Math.floor(Math.random()*wordTexts.length)];
  span.style.left=Math.random()*100+'vw';
  span.style.top=Math.random()*100+'vh';
  const duration=20+Math.random()*30;
  const delay=Math.random()*10;
  span.style.animation=`floatWord ${duration}s linear ${delay}s infinite`;
  const scale=0.5+Math.random()*1.5;
  span.style.transform=`scale(${scale}) rotateX(${Math.random()*360}deg) rotateY(${Math.random()*360}deg)`;
  wordsContainer.appendChild(span);
}