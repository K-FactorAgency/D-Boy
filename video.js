// Function to fetch and display the CSV file content
async function fetchAndDisplayCSV(keyword) {
    try {
        const filePath = `/${keyword}/${keyword}_videos.csv`;
        console.log("Fetching CSV file from:", filePath); // Add this line for debugging
        const response = await fetch(filePath);
        console.log("Response:", response); // Add this line for debugging
        const csvText = await response.text();
        console.log("CSV Text:", csvText); // Add this line for debugging
        const videosData = parseCSV(csvText);
        console.log("Videos Data:", videosData); // Add this line for debugging
        const infoBoxesHtml = videosData.slice(0, 3).map(createInfoBox).join(''); // Only take the first 3 rows
        console.log("Info Boxes HTML:", infoBoxesHtml); // Add this line for debugging
        document.getElementById('info-box-container').innerHTML = infoBoxesHtml;
        document.getElementById('video-info-wrapper').style.display = 'block'; // Show the wrapper with video info and comments button
    } catch (error) {
        console.error('Error fetching or parsing CSV data:', error);
        document.getElementById('info-box-container').innerHTML = '<p>Error loading videos.</p>';
        document.getElementById('video-info-wrapper').style.display = 'none'; // Hide the wrapper if error occurs
    }
}

// Function to parse CSV text to JSON
function parseCSV(csvText) {
    return Papa.parse(csvText, { header: true }).data;
}

// Function to create HTML for the informative box for each video
function createInfoBox(video) {
    return `
        <div class="video-info-box">
            <h1 class="video-title">${video['Video Title'] || 'No Title Available'}</h1>
            <img src="${video['Thumbnail'] || 'default-thumbnail.png'}" alt="Video Thumbnail" class="video-thumbnail">
            <div class="video-stats">
                <p><strong>Views:</strong> ${video['View Count'] || 'Not Available'}</p>
                <p><strong>Likes:</strong> ${video['Like Count'] || 'Not Available'}</p>
                <p><strong>Comments:</strong> ${video['Comment Count'] || 'Not Available'}</p>
            </div>
            <p class="video-description">${video['Description'] || 'No Description Available'}</p>
        </div>
    `;
}

// Load topics when "View Topics" button is clicked
function loadTopics() {
    const keyword = document.getElementById('video-select').value;
    if (keyword) {
        const ldaPath = `/${keyword}/${keyword}_lda.html`; // Assuming path structure
        const ldaFrame = document.getElementById('lda-content');
        ldaFrame.src = ldaPath;
        document.getElementById('lda-section').style.display = 'block';
    }
}

async function explainTopics() {
    try {
        const keyword = document.getElementById('video-select').value;
        if (keyword) {
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
        }
    } catch (error) {
        console.error('Error fetching or parsing CSV data:', error);
    }
}

function displayExplanations(data) {
    const explanationSection = document.getElementById('explanation-section');
    // Clear any previous content
    explanationSection.innerHTML = '';

    // Loop through each topic and create an explanation box
    data.forEach(topic => {
        const explanationBox = document.createElement('div');
        explanationBox.classList.add('explanation-box');
        explanationBox.innerHTML = `
            <h3>Topic ${topic['Topic']}</h3>
            <p><strong>Keywords:</strong> ${topic['Keywords']}</p>
            <p>${topic['Explanation']}</p>
        `;
        explanationSection.appendChild(explanationBox);
    });

    // Show the explanation section
    explanationSection.style.display = 'flex'; // Make sure it's displayed as flex
}



