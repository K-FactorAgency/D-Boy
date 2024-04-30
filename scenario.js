// Event listener for the dropdown selection
document.getElementById('video-select').addEventListener('change', function() {
    const selectedKeyword = this.value;
    if (selectedKeyword) {
        fetchAndDisplayExplanations(selectedKeyword);
    }
});

// Event listener for Protagonist boxes
document.querySelectorAll('.protagonist-container .explanation-box').forEach((box, index) => {
    box.addEventListener('click', function() {
        // Get the text content of the clicked Protagonist box
        const protagonistText = `Protagonist ${index + 1}`;

        // Update the text in the 2nd box of the scenario section
        const secondScenarioBox = document.querySelector('#scenario-section .scenario-box:nth-child(2)');
        if (secondScenarioBox) {
            secondScenarioBox.textContent = protagonistText;
        }
    });
});

// Event listener for Genre boxes
document.querySelectorAll('.genre-container .explanation-box').forEach((box, index) => {
    box.addEventListener('click', function() {
        // Get the text content of the clicked Genre box
        const genreText = `Genre ${index + 1}`;

        // Update the text in the 3rd box of the scenario section
        const thirdScenarioBox = document.querySelector('#scenario-section .scenario-box:nth-child(3)');
        if (thirdScenarioBox) {
            thirdScenarioBox.textContent = genreText;
        }
    });
});


// Load topics and display explanations when a keyword is selected
async function fetchAndDisplayExplanations(keyword) {
    try {
        const filePath = `/${keyword}/${keyword}_lda_results.csv`;
        console.log("Fetching LDA results from:", filePath); // Add this line for debugging
        const response = await fetch(filePath);
        console.log("Response:", response); // Add this line for debugging
        const csvText = await response.text();
        console.log("CSV Text:", csvText); // Add this line for debugging
        // Parse CSV data
        const parsedData = Papa.parse(csvText, { header: true }).data;
        console.log("Parsed Data:", parsedData); // Add this line for debugging
        // Display explanations in the HTML
        displayExplanations(parsedData);
    } catch (error) {
        console.error('Error fetching or parsing CSV data:', error);
    }
}

// Function to create HTML for the explanation box
function displayExplanations(data) {
    const explanationSection = document.getElementById('explanation-section');
    const scenarioSection = document.getElementById('scenario-section');
    
    // Clear any previous content
    explanationSection.innerHTML = '';
    scenarioSection.innerHTML = '';

    // Loop through each topic and create an explanation box
    data.forEach(topic => {
        const explanationBox = document.createElement('div');
        explanationBox.classList.add('explanation-box');
        explanationBox.innerHTML = `
            <h3>Topic ${topic['Topic']}</h3>
            <p><strong>Keywords:</strong> ${topic['Keywords']}</p>
            <p>${topic['Explanation']}</p>
        `;

        // Add event listener to each topic box
        explanationBox.addEventListener('click', function() {
            // Get the text data of the clicked topic
            const clickedTopic = this.innerText; // Example: "Topic1", "Topic2", etc.

            // Display scenario section with scenario boxes
            scenarioSection.innerHTML = ''; // Clear previous scenario boxes
            for (let i = 1; i <= 3; i++) {
                const scenarioBox = document.createElement('div');
                scenarioBox.classList.add('scenario-box');
                if (i === 1) {
                    scenarioBox.textContent = `${clickedTopic}`;
                } else {
                    scenarioBox.textContent = `Scenario ${i}`;
                }
                scenarioSection.appendChild(scenarioBox);
            }

            // Show scenario section
            scenarioSection.style.display = 'flex';
        });

        explanationSection.appendChild(explanationBox);
    });

    // Show the explanation section
    explanationSection.style.display = 'flex'; // Make sure it's displayed as flex
}

// Function to display text in the scenario wrapper
function displayTextInScenarioWrapper(text) {
    // Create a new scenario box
    const scenarioBox = document.createElement('div');
    scenarioBox.classList.add('scenario-box');
    scenarioBox.textContent = text;

    // Append the scenario box to the scenario section
    document.getElementById('scenario-section').appendChild(scenarioBox);
}
