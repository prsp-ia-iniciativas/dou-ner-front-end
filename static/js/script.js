const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-upload');
const uploadedFiles = document.getElementById('uploaded-files');
const analyzeButton = document.getElementById('analyze-button');
const exoneradosContainer = document.getElementById('exonerados-container');
const nomeadosContainer = document.getElementById('nomeados-container');

// Click to browse files
dropArea.addEventListener('click', function () {
    fileInput.click();
});

// Drag-and-drop functionality
dropArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropArea.style.backgroundColor = '#e9e9e9';
});

dropArea.addEventListener('dragleave', function () {
    dropArea.style.backgroundColor = '#f9f9f9';
});

dropArea.addEventListener('drop', function (e) {
    e.preventDefault();
    dropArea.style.backgroundColor = '#f9f9f9';

    const files = e.dataTransfer.files;
    handleFileUpload(files);
});

// Handle file selection via file input
fileInput.addEventListener('change', function () {
    const files = fileInput.files;
    handleFileUpload(files);
});

// Handle file upload
function handleFileUpload(files) {
    if (files.length > 0) {
        const fileName = files[0].name;
        uploadedFiles.textContent = "Uploaded file: " + fileName;
        analyzeButton.disabled = false; // Enable "Analisar" button
    }
}

// Fetch data from the JSON file and animate cards
analyzeButton.addEventListener('click', function () {
    fetch('/analyze')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Error: ' + data.error);
                return;
            }

            // Store fetched data in jsonData for later use (in email preview)
            jsonData = data;

            // Clear the previous cards
            exoneradosContainer.innerHTML = '';
            nomeadosContainer.innerHTML = '';

            // Populate and animate the cards
            renderCards(data.lista_exonerados, exoneradosContainer, 'exoneração');
            renderCards(data.lista_admitidos, nomeadosContainer, 'admissão');
        })
        .catch(error => {
            alert('Error fetching data: ' + error);
        });
});


// Function to render the cards with hover and click interactions
function renderCards(peopleList, container, actionType) {
    peopleList.forEach((person, index) => {
        const card = createCard(person, actionType);
        card.style.animationDelay = `${index * 0.2}s`; // Staggered animation
        card.classList.add('show-card'); // Add animation class

        // Apply the background color based on actionType (exoneração/nomeação)
        if (actionType === 'exoneração') {
            card.classList.add('exonerado'); // Apply soft red background for exonerados
        } else if (actionType === 'admissão') {
            card.classList.add('nomeado'); // Apply soft green background for nomeados
        }

        // Add hover event to show card info
        card.addEventListener('mouseenter', () => showCardInfo(person));
        card.addEventListener('mouseleave', hideCardInfo);

        // Add click event to open the link in a new tab
        card.addEventListener('click', function () {
            window.open("https://www.doe.sp.gov.br/executivo/universidade-de-sao-paulo/despachos-do-reitor-de-18-de-outubro-de-2024-20241021123911227666932", '_blank');
        });

        // Append the card with a slight delay
        setTimeout(() => {
            container.appendChild(card);
        }, index * 200);
    });
}

// Function to create a card with the necessary info
function createCard(person, actionType) {
    const card = document.createElement('div');
    card.classList.add('card');

    // Card header
    const header = document.createElement('div');
    header.classList.add('card-header');
    const icon = document.createElement('span');
    icon.classList.add('person-icon');
    icon.innerHTML = '👤'; // Use an emoji or custom icon
    const name = document.createElement('div');
    name.classList.add('card-name');
    name.textContent = person.nome;

    header.appendChild(icon);
    header.appendChild(name);
    card.appendChild(header);

    // Category
    const category = document.createElement('div');
    category.classList.add('card-category');
    category.textContent = person.categoria;
    card.appendChild(category);

    // Subcategory
    const subcategory = document.createElement('div');
    subcategory.classList.add('card-subcategory');
    subcategory.textContent = person.subcategoria;
    card.appendChild(subcategory);

    // Date (optional)
    const date = document.createElement('div');
    date.classList.add('card-date');
    date.textContent = person.data || 'Sem data'; // Default to "Sem data" if not provided
    card.appendChild(date);

    return card;
}


// Show card information in the fixed div (formatted as real JSON)
function showCardInfo(person) {
    const cardInfoContainer = document.getElementById('card-info-container');
    cardInfoContainer.innerHTML = `
        <div class="json-content">
            <div class="json-brace">JSON-Formatted <br /><br />{</div><br />
            <div class="json-pair"><span class="json-key">"Nome":</span> <span class="json-value">"${person.nome}"</span>,</div>
            <div class="json-pair"><span class="json-key">"Categoria":</span> <span class="json-value">"${person.categoria}"</span>,</div>
            <div class="json-pair"><span class="json-key">"Subcategoria":</span> <span class="json-value">"${person.subcategoria}"</span>,</div>
            <div class="json-pair"><span class="json-key">"Data":</span> <span class="json-value">"${person.data || 'Sem data'}"</span></div>
            <div class="json-brace">}</div>
        </div>
    `;
    cardInfoContainer.classList.add('show');
    cardInfoContainer.classList.remove('hide');
}


// Hide the fixed div
function hideCardInfo() {
    const cardInfoContainer = document.getElementById('card-info-container');
    cardInfoContainer.classList.add('hide');
    cardInfoContainer.classList.remove('show');
}

// Get elements
const chatbotIcon = document.getElementById('chatbot-icon');
const chatbotModal = document.getElementById('chatbot-modal');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotSend = document.getElementById('chatbot-send');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotMessages = document.getElementById('chatbot-messages');

// Open the chatbot modal when the icon is clicked
chatbotIcon.addEventListener('click', function () {
    chatbotModal.style.display = 'block';

    // Display initial bot message only if no messages are present
    if (chatbotMessages.children.length === 0) {
        const initialBotMessageDiv = document.createElement('div');
        initialBotMessageDiv.classList.add('chatbot-message', 'bot-message');
        initialBotMessageDiv.textContent = 'Olá! Como posso ajudar você hoje?';
        chatbotMessages.appendChild(initialBotMessageDiv);

        // Scroll to the bottom of the messages
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
});

// Close the chatbot modal when the close button is clicked
chatbotClose.addEventListener('click', function () {
    chatbotModal.style.display = 'none';
});

// Send message when the "Enviar" button is clicked
chatbotSend.addEventListener('click', function () {
    const userMessage = chatbotInput.value.trim();

    if (userMessage) {
        // Display user message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.classList.add('chatbot-message', 'user-message');
        userMessageDiv.textContent = userMessage;
        chatbotMessages.appendChild(userMessageDiv);

        // Scroll to the bottom of the messages
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

        // Clear input field
        chatbotInput.value = '';

        // Simulate chatbot response
        setTimeout(function () {
            const botMessageDiv = document.createElement('div');
            botMessageDiv.classList.add('chatbot-message', 'bot-message');
            botMessageDiv.textContent = 'Posso ajudar com mais alguma coisa?';
            chatbotMessages.appendChild(botMessageDiv);

            // Scroll to the bottom of the messages
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 1000); // Simulate a delay for the bot response
    }
});

// Get the modal and form elements
var modal = document.getElementById("data-email-modal");
var mailIcon = document.getElementById("mail-icon");
var closeModal = document.getElementById("close-email-modal");
var emailForm = document.getElementById("email-subscription-form");

// Handle opening the modal and populating the email preview
mailIcon.onclick = function () {
    if (jsonData) {
        modal.style.display = "block"; // Open the modal
        populateEmailPreview(jsonData); // Load the email content
    } else {
        alert('Please analyze the data first.');
    }
};

// Close the modal when clicking on the close button
closeModal.onclick = function () {
    modal.style.display = "none";
};

// Close the modal when clicking outside the modal
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// Populate the email content preview inside the modal
function populateEmailPreview(data) {
    const exoneradosList = document.getElementById('exonerados-list');
    const nomeadosList = document.getElementById('nomeados-list');

    // Clear previous content
    exoneradosList.innerHTML = '';
    nomeadosList.innerHTML = '';

    // Populate exonerados list
    data.lista_exonerados.forEach(person => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${person.nome} | ${person.categoria} | ${person.subcategoria} | ${person.data}
        `;
        exoneradosList.appendChild(listItem);
    });

    // Populate nomeados list
    data.lista_admitidos.forEach(person => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${person.nome} | ${person.categoria} | ${person.subcategoria} | ${person.data}
        `;
        nomeadosList.appendChild(listItem);
    });
}

// Handle email subscription form submission
emailForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the entered email
    const email = document.getElementById('email').value;

    // Simulate sending email (this is where you'd connect to the backend)
    alert(`You will receive this data at: ${email}`);

    // Optionally, close the modal after submission
    modal.style.display = "none";
});

