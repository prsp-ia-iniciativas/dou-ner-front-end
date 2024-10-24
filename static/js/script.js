// DOM Elements
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-upload');
const uploadedFiles = document.getElementById('uploaded-files');
const analyzeButton = document.getElementById('analyze-button');
const exoneradosContainer = document.getElementById('exonerados-container');
const nomeadosContainer = document.getElementById('nomeados-container');
const loadingSpinner = document.getElementById('loading-spinner');
const cardInfoContainer = document.getElementById('card-info-container');
const modal = document.getElementById("data-email-modal");
const mailIcon = document.getElementById("mail-icon");
const closeModal = document.getElementById("close-email-modal");
const emailForm = document.getElementById("email-subscription-form");

const chatbotIcon = document.getElementById('chatbot-icon');
const chatbotModal = document.getElementById('chatbot-modal');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotSend = document.getElementById('chatbot-send');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotMessages = document.getElementById('chatbot-messages');

let selectedFile = null;
let jsonData = null;

// Setup file handling and drag-and-drop events
function setupDragAndDrop() {
    dropArea.addEventListener('click', () => fileInput.click());

    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.style.backgroundColor = '#e9e9e9';
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.style.backgroundColor = '#f9f9f9';
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.style.backgroundColor = '#f9f9f9';
        handleFileUpload(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', () => handleFileUpload(fileInput.files));
}

// Handle file selection
function handleFileUpload(files) {
    if (files.length > 0) {
        selectedFile = files[0];
        updateUploadedFileUI(files[0].name);
        analyzeButton.disabled = false;
    }
}

function updateUploadedFileUI(fileName) {
    uploadedFiles.textContent = `Uploaded file: ${fileName}`;
}

// Handle the loading spinner visibility
function showLoading(isLoading) {
    loadingSpinner.style.display = isLoading ? 'flex' : 'none';
}

// Make the API request to analyze the file
function analyzeFile() {
    if (!selectedFile) {
        showError("Please upload a file first!");
        return;
    }

    showLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    makeApiRequest('/analyze', formData)
        .then(handleApiResponse)
        .catch((error) => showError(`Error analyzing the file: ${error}`))
        .finally(() => showLoading(false));
}

function makeApiRequest(url, formData) {
    return fetch(url, {
        method: 'POST',
        body: formData,
    }).then(response => response.json());
}

function handleApiResponse(data) {
    if (data.error) {
        showError(data.error);
        return;
    }

    jsonData = data;  // Store the result for later use (e.g. in the email modal)
    clearContainers();
    renderCards(data.exoneração, exoneradosContainer, 'exoneração');
    renderCards(data.nomeação, nomeadosContainer, 'nomeação');
}

function showError(errorMessage) {
    alert(errorMessage);
}

function clearContainers() {
    exoneradosContainer.innerHTML = '';
    nomeadosContainer.innerHTML = '';
}

// Render cards for each person (exoneração/nomeação)
function renderCards(peopleList, container, actionType) {
    peopleList.forEach((person, index) => {
        const card = createCard(person, actionType);
        card.style.animationDelay = `${index * 0.2}s`; // Staggered animation
        card.classList.add('show-card');
        container.appendChild(card);
    });
}

function createCard(person, actionType) {
    const card = document.createElement('div');
    card.classList.add('card', actionType === 'exoneração' ? 'exonerado' : 'nomeado');

    card.innerHTML = `
        <div class="card-header">
            <span class="person-icon">👤</span>
            <div class="card-name">${person}</div>
        </div>
        <div class="card-category">${person.categoria || 'Categoria não disponível'}</div>
        <div class="card-subcategory">${person.subcategoria || 'Subcategoria não disponível'}</div>
        <div class="card-date">${person.data || 'Sem data'}</div>
    `;

    card.addEventListener('mouseenter', () => showCardInfo(person));
    card.addEventListener('mouseleave', hideCardInfo);

    // Add click event to open the link in a new tab
    card.addEventListener('click', function () {
        window.open("https://www.doe.sp.gov.br/executivo/universidade-de-sao-paulo/despachos-do-reitor-de-18-de-outubro-de-2024-20241021123911227666932", '_blank');
    });

    return card;
}

function showCardInfo(person) {
    cardInfoContainer.innerHTML = `
        <div class="json-content">
            <div class="json-brace">JSON-Formatted <br /><br />{</div><br />
            <div class="json-pair"><span class="json-key">"Nome":</span> <span class="json-value">"${person}"</span>,</div>
            <div class="json-pair"><span class="json-key">"Categoria":</span> <span class="json-value">"CATEGORIA"</span>,</div>
            <div class="json-pair"><span class="json-key">"Subcategoria":</span> <span class="json-value">"SUB-CATEGORIA"</span>,</div>
            <div class="json-pair"><span class="json-key">"Data":</span> <span class="json-value">"${person.data || 'Sem data'}"</span></div>
            <div class="json-brace">}</div>
        </div>
    `;
    cardInfoContainer.classList.add('show');
    cardInfoContainer.classList.remove('hide');
}

function hideCardInfo() {
    cardInfoContainer.classList.add('hide');
    cardInfoContainer.classList.remove('show');
}

// Modal handling for showing email preview
mailIcon.onclick = function () {
    if (jsonData) {
        toggleModal(modal, true);
        populateEmailPreview(jsonData);
    } else {
        alert('Please analyze the data first.');
    }
};

function populateEmailPreview(data) {
    const exoneradosList = document.getElementById('exonerados-list');
    const nomeadosList = document.getElementById('nomeados-list');

    exoneradosList.innerHTML = '';
    nomeadosList.innerHTML = '';

    data.exoneração.forEach(person => {
        const listItem = document.createElement('li');
        listItem.textContent = person;
        exoneradosList.appendChild(listItem);
    });

    data.nomeação.forEach(person => {
        const listItem = document.createElement('li');
        listItem.textContent = person;
        nomeadosList.appendChild(listItem);
    });
}

function toggleModal(modalElement, isVisible) {
    modalElement.style.display = isVisible ? 'block' : 'none';
}

closeModal.onclick = () => toggleModal(modal, false);
window.onclick = event => { if (event.target == modal) toggleModal(modal, false); };

// Handle email subscription form submission
emailForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    alert(`You will receive this data at: ${email}`);
    toggleModal(modal, false);
});

// Chatbot functionality
chatbotIcon.addEventListener('click', function () {
    toggleModal(chatbotModal, true);

    if (chatbotMessages.children.length === 0) {
        const initialBotMessageDiv = document.createElement('div');
        initialBotMessageDiv.classList.add('chatbot-message', 'bot-message');
        initialBotMessageDiv.textContent = 'Olá! Como posso ajudar você hoje?';
        chatbotMessages.appendChild(initialBotMessageDiv);

        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
});

chatbotClose.addEventListener('click', () => toggleModal(chatbotModal, false));

chatbotSend.addEventListener('click', function () {
    const userMessage = chatbotInput.value.trim();

    if (userMessage) {
        const userMessageDiv = document.createElement('div');
        userMessageDiv.classList.add('chatbot-message', 'user-message');
        userMessageDiv.textContent = userMessage;
        chatbotMessages.appendChild(userMessageDiv);

        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        chatbotInput.value = '';

        setTimeout(function () {
            const botMessageDiv = document.createElement('div');
            botMessageDiv.classList.add('chatbot-message', 'bot-message');
            botMessageDiv.textContent = 'Posso ajudar com mais alguma coisa?';
            chatbotMessages.appendChild(botMessageDiv);

            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 1000);
    }
});

// Initialize drag and drop functionality
setupDragAndDrop();
analyzeButton.addEventListener('click', analyzeFile);
