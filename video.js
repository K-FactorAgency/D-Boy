// Function to fetch and display the CSV file content
async function fetchAndDisplayCSV(keyword) {
  try {
      const filePath = `/${keyword}/${keyword}_videos.csv`;
      const response = await fetch(filePath);
      const csvText = await response.text();
      const videosData = parseCSV(csvText);
      const infoBoxesHtml = videosData.slice(0, 3).map(createInfoBox).join(''); // Only take the first 3 rows
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

