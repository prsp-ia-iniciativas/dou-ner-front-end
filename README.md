
# Diário Oficial Extraction & Named Entity Recognition (NER)

This project is a web application that allows users to upload **PDF files** from the **Diário Oficial** and extracts information using **Named Entity Recognition (NER)** techniques. The extracted information includes the names of people involved in "exoneração" (exoneration) and "nomeação" (nomination), along with randomly generated categories and subcategories for demonstration purposes.

## Features

- **File Upload**: Users can upload PDF files to be processed.
- **NER Integration**: The application uses pre-trained NER models to extract entity information from the uploaded PDF.
- **Display Results**: Results are shown dynamically on the frontend with categorization (exoneração, nomeação).
- **Simulated Metadata**: In addition to the extracted names, random metadata like categories, subcategories, and dates are generated.
- **NER Inference**: A dedicated route for performing NER inference on any given text.

## Technologies

- **Flask**: Backend framework for handling requests and file processing.
- **Transformers**: Using the Hugging Face `pipeline` and pre-trained BERT models for NER tasks.
- **JavaScript & HTML/CSS**: For the frontend, including dynamic rendering of the results and drag-and-drop file upload functionality.
- **REST API**: For sending and receiving data between the frontend and backend.

## Project Structure

```
.
├── app.py                     # Flask backend
├── data                       # Ignored data folder for storing temporary files
├── requirements.txt           # Dependencies
├── static
│   ├── css
│   │   └── styles.css         # CSS styles for frontend
│   ├── images
│   │   └── sp.jpeg            # São Paulo government logo
│   └── js
│       └── script.js          # JavaScript for handling frontend interactions
├── templates
│   ├── index.html             # Main HTML page
│   └── ner.html               # NER demo HTML page
└── uploads                    # Directory to store uploaded files
```

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-repo/dou-ner-extraction.git
cd dou-ner-extraction
```

### 2. Create and activate a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install the dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the application

```bash
python app.py
```

The application will start at `http://127.0.0.1:5000/`.

### 5. Access the application

- **Main App**: Navigate to `http://127.0.0.1:5000/` to upload a PDF file and extract information.
- **NER Demo**: Navigate to `http://127.0.0.1:5000/ner` to test the NER extraction with plain text.

## Key Endpoints

### `/`

The homepage where users can upload a **PDF file** to extract information on "exoneração" and "nomeação".

### `/analyze` (POST)

Uploads the PDF file to the external API and returns extracted information along with simulated metadata (categories, subcategories, and dates).

- **Request**: A POST request with a PDF file.
- **Response**: A JSON object containing lists of people involved in "exoneração" and "nomeação" along with randomly generated metadata.

Example Response:

```json
{
    "exoneração": [
        {
            "nome": "Lucas Silva",
            "categoria": "Secretaria de Meio Ambiente",
            "subcategoria": "Coordenadoria Geral",
            "data": "2024-09-15"
        },
        {
            "nome": "Ana Pereira",
            "categoria": "Casa Civil",
            "subcategoria": "Gabinete do Secretário",
            "data": "2024-09-12"
        }
    ],
    "nomeação": [
        {
            "nome": "João Costa",
            "categoria": "Secretaria de Administração",
            "subcategoria": "Administração Geral",
            "data": "2024-09-01"
        }
    ]
}
```

### `/ner` (POST)

Performs **NER inference** on a given text.

- **Request**: A POST request with a JSON body containing the `text` field.
- **Response**: A JSON object listing the extracted named entities from the text.

Example:

```json
{
  "text": "Lucas Silva é nomeado para o cargo de Diretor da Secretaria de Administração."
}
```

Response:

```json
{
    "entities": [
        ["Lucas Silva", "PER", 0, 11],
        ["Diretor", "ORG", 25, 32],
        ["Secretaria de Administração", "ORG", 36, 63]
    ]
}
```

## How It Works

1. **File Upload**: When the user uploads a PDF, the file is sent to an external API that processes it and returns the extracted information in JSON format.
2. **NER Processing**: The app uses a pre-trained NER model to analyze the input text and extract entities.
3. **Simulated Data**: For demo purposes, the app generates random categories, subcategories, and dates to enrich the extracted entities with additional metadata.
4. **Frontend Display**: The extracted information is dynamically rendered on the frontend in two sections: "Exonerados" (exonerated) and "Nomeados" (appointed).

## Contributing

We welcome contributions! Please feel free to submit pull requests, report bugs, or suggest features.
