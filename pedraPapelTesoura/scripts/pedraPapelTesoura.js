let placar = JSON.parse(localStorage.getItem('placar')) || {win:0, loss:0, draw:0};
atualizarPlacar();

let jogando = false;
let intervalId;

document.querySelector('.b1').addEventListener('click', ()=>{jogar('rock');});
document.querySelector('.b3').addEventListener('click', ()=>{jogar('paper');});
document.querySelector('.b4').addEventListener('click', ()=>{jogar('scissors');});
document.querySelector('.b2').addEventListener('click', ()=>{reset();});
document.querySelector('.b5').addEventListener('click', ()=>{autoplay();});

document.body.addEventListener('keydown', (event)=>{
  if(event.key==='r'){
    jogar('rock');
  }else if(event.key==='p'){
    jogar('paper');
  }else if(event.key==='s'){
    jogar('scissors');
  }
});

function jogadaAleatoria(){
  const aleatorio = Math.random();
  return aleatorio < 1/3 ? 'rock' : aleatorio < 2/3 ? 'paper' : 'scissors';
}

function autoplay(){
  if(!jogando){
    intervalId = setInterval(() => jogar(jogadaAleatoria()), 1000);
    jogando = true;
  } else {
    clearInterval(intervalId);
    jogando = false;
  }
}

function jogar(escolha){
  const compMove = jogadaAleatoria();
  let resultado = '';

  if(escolha === compMove){
    resultado = 'Empate.';
    placar.draw += 1;
  } else if(
    (compMove === 'paper' && escolha === 'rock') || 
    (compMove === 'rock' && escolha === 'scissors') || 
    (compMove === 'scissors' && escolha === 'paper')
  ){
    resultado = 'Você <span class="text-red-500">perdeu</span>.';
    placar.loss += 1;
  } else {
    resultado = 'Você <span class="text-green-500">ganhou</span>.';
    placar.win += 1;
  }

  localStorage.setItem('placar', JSON.stringify(placar));

  document.querySelector('.resul2').innerHTML = resultado;
  document.querySelector('.resul1').innerHTML = `
    Você: <img src="imagens/${escolha}-emoji.png" class="w-16 h-16"> 
    Computador: <img src="imagens/${compMove}-emoji.png" class="w-16 h-16">
  `;

  atualizarPlacar();
}

function atualizarPlacar() {
  document.querySelector('.placarHtml').innerHTML = `
    Wins: <span class="text-green-500">${placar.win}</span>, 
    Losses: <span class="text-red-500">${placar.loss}</span>, 
    Ties: ${placar.draw}
  `;
}

function reset(){
  placar = {win: 0, loss: 0, draw: 0};
  localStorage.removeItem('placar');

  document.querySelector('.resul2').innerHTML = '';
  document.querySelector('.resul1').innerHTML = '';
  
  atualizarPlacar();
}
