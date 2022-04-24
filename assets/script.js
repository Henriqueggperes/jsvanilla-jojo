const baseURL = "http://localhost:3000/personagens";

async function findAllCharacters() {
  const response = await fetch(`${baseURL}/todos-personagens`);

  const personagens = await response.json();

  personagens.forEach(function (personagens) {
    document.querySelector("#charList").insertAdjacentHTML(
      "beforeend",
      `
      <div class="Main__Card" id="CharListItem_${personagens.id}">
      <div class="CharsList__Char">${[personagens.personagem]}</div>
      <div class="CharsList__Img">
      <img 
      src="${personagens.foto}" 
      alt="Personagem ${personagens.personagem}"> 
      </div>
      <div class="CharsList__Stand">Stand: ${personagens.stand}</div>
      <div class = "Char__buttons">
      <button class="edit-button" onclick="abrirModal(${personagens.id})"> Editar </button>
      <button class="delete-button" onclick="abrirModalDelete()"> Apagar </button>
      </div>
  </div>
      `
    );
  });
}

async function findByIdCharacters() {
  const id = document.querySelector("#idChar").value;
  const response = await fetch(`${baseURL}/find-personagem/${id}`);
  const personagem = await response.json();

  const personagemEscolhidoDiv = document.querySelector("#personagemEscolhido");

  personagemEscolhidoDiv.innerHTML = `
  <h3> Personagem escolhido</h3>
  <div class="Char__Card" id="CharListItem_${personagem.id}">
      <div class="Char__Name">${[personagem.personagem]}</div>
      <div class="Char__Img">
         <img 
         src="${personagem.foto}" 
         alt="Personagem ${personagem.personagem}"> 
     </div>
     <div class="Chars__Description">${personagem.descricao}</div>
      <div class="Chars__Stand"><b>Stand:</b> ${personagem.stand}</div>
      <div class="Chars__StandStatus"><b>Stand Tier:</b> ${
        personagem.standstatus
      }</div>
      <div class="Chars__Habilities"><b>Habilidades:</b> ${
        personagem.habilidades
      }</div>
  </div>
   
  `;
}

findAllCharacters();

async function abrirModal(id = null) {

  if(id!= null){
   document.querySelector("#modal-title").innerText = "Atualizar personagem"
  
   const response = await fetch(`${baseURL}/find-personagem/${id}`);
   const personagem = await response.json();
   document.querySelector('#personagem').value=personagem.personagem;
    document.querySelector('#stand').value=personagem.stand;
    document.querySelector('#habilidades').value=personagem.habilidades;
    document.querySelector('#standstatus').value=personagem.standstatus;
    document.querySelector('#descricao').value=personagem.descricao;
    document.querySelector('#foto').value =personagem.foto;
    document.querySelector('#id').value = personagem.id;  
  }

  const modal = (document.querySelector("#create").style.display =
    "flex");
}
function fecharModal() {
  const modal = (document.querySelector("modal-overlay").style.display =
    "none");
    document.querySelector('#personagem').value="";
    document.querySelector('#stand').value="";
    document.querySelector('#habilidades').value="";
    document.querySelector('#standstatus').value="";
    document.querySelector('#descricao').value="";
    document.querySelector('#foto').value ="";
}
 async function createCharacter(){
  const id = document.querySelector('#id').value;
  const personagem = document.querySelector('#personagem').value;
  const stand = document.querySelector('#stand').value;
  const habilidades = document.querySelector('#habilidades').value;
  const standstatus= document.querySelector('#standstatus').value;
  const descricao = document.querySelector('#descricao').value;
  const foto = document.querySelector('#foto').value;

  const character = {
    id,
    personagem,
    stand,
    habilidades,
    standstatus,
    descricao,
    foto
  };

const modoEdicaoAtivado = id > 0;

const endpoint = baseURL+(modoEdicaoAtivado ? `/update/${id}`:`/create`);
  
const response = await fetch(endpoint, {
  method: modoEdicaoAtivado ? "put" : "post" ,
  headers: {
    "Content-Type": "application/json",
  },
  mode: 'cors',
  body: JSON.stringify(character),
  });
  const novoPersonagem =await response.json();

  const html = `
  <div class="Main__Card" id="CharListItem_${personagem.id}">
    <div class="CharsList__Char">${[novoPersonagem.personagem]}</div>
    <div class="CharsList__Img">
      <img src="${novoPersonagem.foto}" alt="Personagem ${novoPersonagem.personagem}"> 
    </div>
    <div class="CharsList__Stand">Stand: ${novoPersonagem.stand}</div>
  </div>
  `;
if(modoEdicaoAtivado){
document.querySelector(`CharListItem_${id}`).outerHTML = html;
}else{
  document.querySelector("#charList").insertAdjacentHTML('beforeend',html);
}

  
    fecharModal();
}


function abrirModalDelete(){
  document.querySelector("#delete").style.display =
  "flex";
  const btnS = document.querySelector(".btn-sim")
  btnS.addEventListener("click",function(){
    deletePersonagem(id);
  })
}

function fecharModalDelete(id){
  document.querySelector("#delete").style.display =
  "none";
}
async function deletePersonagem(id){
  const response = await fetch(`${baseURL}/delete/${id}`,{
  method:"delete",
  headers: {
   "Content-Type": "application/json"
  },
  mode: "cors"
  });
  const result = await response.json();
  alert(result.message);

  document.getElementById("charList").innerHTML = "";

  fecharModalDelete();
  findAllCharacters();

};