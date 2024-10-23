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


// Show card information in the fixed div
function showCardInfo(person) {
    const cardInfoContainer = document.getElementById('card-info-container');
    cardInfoContainer.innerHTML = `
        <strong>Nome:</strong> ${person.nome}<br>
        <strong>Categoria:</strong> ${person.categoria}<br>
        <strong>Subcategoria:</strong> ${person.subcategoria}<br>
        <strong>Data:</strong> ${person.data || 'Sem data'}<br>
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