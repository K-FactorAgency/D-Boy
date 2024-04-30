// Global scope variable
let keyword = null;  // Initialize at a global level

document.getElementById('video-select').addEventListener('change', function() {
    keyword = this.value; // Update global variable
    if (keyword) {
        fetchAndDisplayExplanations(keyword);
        fetchAndDisplayScenarios(keyword);
    }
});

// Initialize scenario section with three empty boxes for dynamic update
function initializeScenarioSection() {
    const scenarioSection = document.getElementById('scenario-section');
    scenarioSection.innerHTML = ''; // Clear previous content
    for (let i = 1; i <= 3; i++) {
        const scenarioBox = document.createElement('div');
        scenarioBox.classList.add('scenario-box');
        scenarioBox.textContent = `Scenario ${i}`;
        scenarioSection.appendChild(scenarioBox);
    }
}

document.addEventListener('DOMContentLoaded', initializeScenarioSection);

// Function to fetch and display topics when a keyword is selected
async function fetchAndDisplayExplanations(keyword) {
    try {
        const filePath = `/${keyword}/${keyword}_lda_results.csv`;
        console.log("Fetching LDA results from:", filePath); // For debugging
        const response = await fetch(filePath);
        const csvText = await response.text();
        const parsedData = Papa.parse(csvText, { header: true }).data;
        console.log("Parsed Data:", parsedData); // For debugging
        displayExplanations(parsedData);
    } catch (error) {
        console.error('Error fetching or parsing CSV data:', error);
    }
}

// Function to create and display HTML for each topic
function displayExplanations(data) {
    const explanationSection = document.getElementById('explanation-section');
    explanationSection.innerHTML = ''; // Clear any previous content

    data.forEach((topic, index) => {
        const explanationBox = document.createElement('div');
        explanationBox.classList.add('explanation-box');
        explanationBox.setAttribute('data-id', index + 1); // Assigning an ID to each box
        explanationBox.innerHTML = `
            <h3>Topic ${topic['Topic']}</h3>
            <p><strong>Keywords:</strong> ${topic['Keywords']}</p>
            <p>${topic['Explanation']}</p>
        `;

        explanationBox.addEventListener('click', function() {
            const topicId = this.getAttribute('data-id');
            console.log('Selected Topic ID:', topicId); // Log the ID instead of the topic text
            processTopic(topicId); // Process topic by ID
            const firstScenarioBox = document.querySelector('#scenario-section .scenario-box:nth-child(1)');
            firstScenarioBox.textContent = `Topic ID: ${topicId}`; // Update the display with the ID
        });

        explanationSection.appendChild(explanationBox);
    });

    explanationSection.style.display = 'flex'; // Show the explanation section
}

// Function to process topics
function processTopic(topicId) {
    console.log('Processing Topic with ID:', topicId);
    // Additional logic to process topic by ID can be implemented here
}

document.querySelectorAll('.protagonist-container .explanation-box').forEach((box, index) => {
    box.setAttribute('data-id', index + 1);
    box.addEventListener('click', function() {
        const protagonistId = this.getAttribute('data-id');
        console.log('Selected Protagonist ID:', protagonistId);
        const secondScenarioBox = document.querySelector('#scenario-section .scenario-box:nth-child(2)');
        secondScenarioBox.textContent = `Protagonist ID: ${protagonistId}`;
    });
});

document.querySelectorAll('.genre-container .explanation-box').forEach((box, index) => {
    box.setAttribute('data-id', index + 1);
    box.addEventListener('click', function() {
        const genreId = this.getAttribute('data-id');
        console.log('Selected Genre ID:', genreId);
        const thirdScenarioBox = document.querySelector('#scenario-section .scenario-box:nth-child(3)');
        thirdScenarioBox.textContent = `Genre ID: ${genreId}`;
    });
});

document.getElementById('write-scenario-btn').addEventListener('click', async function() {
    const selectedTopic = document.querySelector('#scenario-section .scenario-box:nth-child(1)').textContent;
    const selectedProtagonist = document.querySelector('#scenario-section .scenario-box:nth-child(2)').textContent;
    const selectedGenre = document.querySelector('#scenario-section .scenario-box:nth-child(3)').textContent;

    if (selectedTopic.includes('Topic ID:') && selectedProtagonist.includes('Protagonist ID:') && selectedGenre.includes('Genre ID:')) {
        const topicNumber = parseInt(selectedTopic.match(/\d+/)[0]);
        const protagonistNumber = parseInt(selectedProtagonist.match(/\d+/)[0]);
        const genreNumber = parseInt(selectedGenre.match(/\d+/)[0]);
        const scenarios = await fetchAndDisplayScenarios(topicNumber, protagonistNumber, genreNumber);
        displayScenarios(scenarios);
    } else {
        alert('Please select a topic, protagonist, and genre.');
    }
});

async function fetchAndDisplayScenarios(topic, protagonist, genre) {
    const filePath = `/${keyword}/${keyword}_scenarios.csv`;
    try {
        const response = await fetch(filePath);
        const csvText = await response.text();
        const parsedData = Papa.parse(csvText, { header: true }).data;
        return parsedData.filter(scenario => {
            return parseInt(scenario['Topic']) === topic && 
                   parseInt(scenario['Protagonist']) === protagonist &&
                   parseInt(scenario['Genre']) === genre;
        });
    } catch (error) {
        console.error('Error fetching or parsing CSV data:', error);
        alert('Failed to load scenarios. Please try again.');
        return [];
    }
}

function displayScenarios(scenarios) {
    const displayElement = document.getElementById('scenario-display');
    if (scenarios.length > 0) {
        displayElement.textContent = scenarios.map(scenario => scenario['Scenario']).join(', ');
    } else {
        displayElement.textContent = 'No matching scenarios found.';
    }
}
