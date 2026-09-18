// Dados simulados da história (árvore de decisões)
const storyData = {
  inicio: {
    title: "Capítulo 1: O Novo Clube Cultural",
    text: "Você acabou de chegar à nova escola. No corredor principal, há dois murais com avisos chamativos.",
    choices: [
      { text: "Ver o mural do Clube de Teatro e Narrativas", next: "teatro" },
      { text: "Ver o mural da Feira de Diversidade e Acolhimento", next: "feira" }
    ]
  },
  teatro: {
    title: "O Clube de Teatro",
    text: "Você entra na sala de ensaio. O grupo está montando uma peça focada em histórias de representatividade LGBTQIA+. O diretor pergunta se você quer atuar ou escrever o roteiro.",
    choices: [
      { text: "Oferecer-se para escrever o roteiro", next: "roteiro" },
      { text: "Subir no palco para um teste de atuação", next: "palco" }
    ]
  },
  feira: {
    title: "A Feira de Acolhimento",
    text: "No pátio, estudantes organizam um evento para discutir apoio mútuo, respeito aos pronomes e criar um espaço seguro para todos na escola.",
    choices: [
      { text: "Ajudar a organizar os painéis de conscientização", next: "paineis" },
      { text: "Conversar com os organizadores sobre novas ideias", next: "ideias" }
    ]
  },
  roteiro: {
    title: "Caminho do Roteirista",
    text: "Suas palavras inspiram todos no clube! Você cria uma história emocionante e aceita o desafio de ser o roteirista principal.",
    choices: [{ text: "Recomeçar História", next: "inicio" }]
  },
  palco: {
    title: "Caminho da Atuação",
    text: "Sua atuação transmite verdade e emoção. O público aplaude e você garante o papel principal na apresentação!",
    choices: [{ text: "Recomeçar História", next: "inicio" }]
  },
  paineis: {
    title: "Organizando a Feira",
    text: "O evento é um sucesso completo! Vários alunos agradecem pelo espaço acolhedor e informativo.",
    choices: [{ text: "Recomeçar História", next: "inicio" }]
  },
  ideias: {
    title: "Novas Conexões",
    text: "Sua iniciativa aproxima pessoas incríveis de você, criando um novo grupo de amizade muito forte.",
    choices: [{ text: "Recomeçar História", next: "inicio" }]
  }
};

// Elementos da interface
const loginScreen = document.getElementById("login-screen");
const gameScreen = document.getElementById("game-screen");
const adminScreen = document.getElementById("admin-screen");

const loginForm = document.getElementById("login-form");
const userBadge = document.getElementById("user-badge");

const storyTitle = document.getElementById("story-title");
const storyText = document.getElementById("story-text");
const choicesContainer = document.getElementById("choices-container");

// Variáveis de Estado (com padrões)
let currentFontSize = parseInt(localStorage.getItem("pq_fontsize")) || 16;
let currentTheme = localStorage.getItem("pq_theme") || "theme-dark";
let currentNode = localStorage.getItem("pq_current_node") || "inicio";

// Inicializa configurações salvas ao carregar
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(currentTheme);
  applyFontSize(currentFontSize);
  checkSavedSession();
});

// LOGIN E SESSÃO
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const username = document.getElementById("username").value;
  const pronouns = document.getElementById("pronouns").value;
  const role = document.getElementById("role").value;

  // SALVAMENTO AUTOMÁTICO DE USUÁRIO
  localStorage.setItem("pq_user", JSON.stringify({ username, pronouns, role }));

  loginScreen.classList.remove("active");

  if (role === "admin") {
    adminScreen.classList.add("active");
  } else {
    gameScreen.classList.add("active");
    userBadge.innerText = `${username} (${pronouns})`;
    loadStoryNode(currentNode);
  }
});

function checkSavedSession() {
  const savedUser = JSON.parse(localStorage.getItem("pq_user"));
  if (savedUser) {
    loginScreen.classList.remove("active");
    if (savedUser.role === "admin") {
      adminScreen.classList.add("active");
    } else {
      gameScreen.classList.add("active");
      userBadge.innerText = `${savedUser.username} (${savedUser.pronouns})`;
      loadStoryNode(currentNode);
    }
  }
}

// SALVAMENTO AUTOMÁTICO DO PROGRESSO DA HISTÓRIA
function loadStoryNode(nodeKey) {
  const node = storyData[nodeKey];
  storyTitle.innerText = node.title;
  storyText.innerText = node.text;

  // Guarda o capítulo atual no navegador
  currentNode = nodeKey;
  localStorage.setItem("pq_current_node", nodeKey);

  choicesContainer.innerHTML = "";
  node.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice-btn";
    button.innerText = choice.text;
    button.onclick = () => loadStoryNode(choice.next);
    choicesContainer.appendChild(button);
  });
}

// LOGOUT (Limpa sessão de jogo)
document.getElementById("logout-btn").addEventListener("click", logout);
document.getElementById("admin-logout-btn").addEventListener("click", logout);

function logout() {
  localStorage.removeItem("pq_user");
  localStorage.removeItem("pq_current_node");
  currentNode = "inicio";

  gameScreen.classList.remove("active");
  adminScreen.classList.remove("active");
  loginScreen.classList.add("active");
}

// CONTROLE DE TAMANHO DE FONTE
document.getElementById("btn-font-inc").addEventListener("click", () => {
  if (currentFontSize < 24) {
    currentFontSize += 2;
    applyFontSize(currentFontSize);
  }
});

document.getElementById("btn-font-dec").addEventListener("click", () => {
  if (currentFontSize > 12) {
    currentFontSize -= 2;
    applyFontSize(currentFontSize);
  }
});

document.getElementById("btn-font-reset").addEventListener("click", () => {
  currentFontSize = 16;
  applyFontSize(currentFontSize);
});

function applyFontSize(size) {
  storyText.style.fontSize = `${size}px`;
  localStorage.setItem("pq_fontsize", size);
}

// CONTROLE DE MODO DE LEITURA (TEMAS)
document.getElementById("theme-dark").addEventListener("click", () => applyTheme("theme-dark"));
document.getElementById("theme-light").addEventListener("click", () => applyTheme("theme-light"));
document.getElementById("theme-sepia").addEventListener("click", () => applyTheme("theme-sepia"));

function applyTheme(themeName) {
  document.body.className = themeName;
  currentTheme = themeName;
  localStorage.setItem("pq_theme", themeName);
}

// PAINEL ADM
document.getElementById("admin-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("scene-title").value;
  alert(`Nova cena "${title}" cadastrada!`);
  document.getElementById("admin-form").reset();
});