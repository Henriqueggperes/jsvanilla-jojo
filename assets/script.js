const baseURL = "http://localhost:3000/characters";

async function findAllCharacters() {
  const response = await fetch(`${baseURL}/all-characters`);
  
  const personagens = await response.json();
  
  personagens.forEach(function (personagens) {
    document.querySelector("#charList").insertAdjacentHTML(
      "beforeend",
      `
      <div class="Main__Card" id="CharListItem_'${personagens._id}'">
        <div class="CharsList__Char">${[personagens.personagem]}</div>
        <div class="CharsList__Img">
        <img 
        src="${personagens.foto}" 
        alt="Personagem ${personagens.personagem}"> 
      </div>
      <div class="CharsList__Stand">Stand: ${personagens.stand}</div>
        <div class = "Char__buttons">
        <button class="edit-button" onclick="abrirModal('${personagens._id}')"> Editar </button>
        <button class="delete-button" onclick="abrirModalDelete('${personagens._id}')"> Apagar </button>
        </div>
      </div>
      `
      );
    });
  }
  findAllCharacters();
  
async function findByIdCharacters() {
  const id = document.querySelector("#idChar").value;
  const response = await fetch(`${baseURL}/find-character/${id}`);
  const personagem = await response.json();

  const personagemEscolhidoDiv = document.querySelector("#personagemEscolhido");

  personagemEscolhidoDiv.innerHTML = `
  <h3> Personagem escolhido</h3>
  <div class="Char__Card" id="CharListItem_'${personagem._id}'">
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


async function abrirModal(id = "") {

  if(id!= ""){
   document.querySelector("#modal-title").innerText = "Atualizar personagem"
  
   const response = await fetch(`${baseURL}/find-character/${id}`);
   const personagem = await response.json();
   document.querySelector('#personagem').value=personagem.personagem;
    document.querySelector('#stand').value=personagem.stand;
    document.querySelector('#habilidades').value=personagem.habilidades;
    document.querySelector('#standstatus').value=personagem.standstatus;
    document.querySelector('#descricao').value=personagem.descricao;
    document.querySelector('#foto').value =personagem.foto;
    document.querySelector('#id').value = personagem._id;  
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

const modoEdicaoAtivado = id != "";

const endpoint = baseURL+(modoEdicaoAtivado ? `/update-character/${id}`:`/create-character`);
  
const response = await fetch(endpoint, {
  method: modoEdicaoAtivado ? "put" : "post" ,
  headers: {
    "Content-Type": "application/json",
  },
  mode: 'cors',
  body: JSON.stringify(character),
  });
  const novoPersonagem =await response.json();

  document.location.reload(true);
// if(modoEdicaoAtivado){
// document.querySelector(`CharListItem_${id}`).outerHTML = html;
// }else{
//   document.querySelector("#charList").insertAdjacentHTML('beforeend',html);
// }

  
    fecharModal();
}


function abrirModalDelete(id){
  document.querySelector("#delete").style.display =
  "flex";
  const btnS = document.querySelector(".btn-sim")
  btnS.addEventListener("click",function(){
    deletePersonagem(id);
  })
}

function fecharModalDelete(){
  document.querySelector("#delete").style.display =
  "none";
}
async function deletePersonagem(id){
  const response = await fetch(`${baseURL}/delete-character/${id}`,{
  method:"delete",
  headers: {
   "Content-Type": "application/json"
  },
  mode: "cors"
  });
  const result = await response.json();
 
  document.location.reload(true);

  fecharModalDelete();

};