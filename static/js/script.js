const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('file-upload');
const uploadedFiles = document.getElementById('uploaded-files');
const analyzeButton = document.getElementById('analyze-button');
const listContainer = document.getElementById('list-container');

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


// Fetch the names from the server and simulate the typing effect
analyzeButton.addEventListener('click', function () {
    fetch('/analyze')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Error: ' + data.error);
                return;
            }

            const exonerados = data.lista_exonerados || [];
            const admitidos = data.lista_admitidos || [];

            const listaExonerados = document.getElementById('lista-exonerados');
            const listaAdmitidos = document.getElementById('lista-admitidos');

            // Clear previous items
            listaExonerados.innerHTML = '';
            listaAdmitidos.innerHTML = '';

            // Simulate typing effect for exonerados
            exonerados.forEach((name, index) => {
                const li = document.createElement('li');
                li.classList.add('typing');
                li.style.animationDelay = `${index * 0.5}s`;
                li.style.setProperty('--chars', name.length);  // Set the char length dynamically
                li.textContent = name;
                listaExonerados.appendChild(li);
            });

            // Simulate typing effect for admitidos
            admitidos.forEach((name, index) => {
                const li = document.createElement('li');
                li.classList.add('typing');
                li.style.animationDelay = `${index * 0.5}s`;
                li.style.setProperty('--chars', name.length);  // Set the char length dynamically
                li.textContent = name;
                listaAdmitidos.appendChild(li);
            });

            // Show lists after fetching
            listContainer.style.display = 'flex';
        })
        .catch(error => {
            alert('Error fetching data: ' + error);
        });
});
