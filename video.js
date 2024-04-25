// Function to fetch and display the CSV file content
function fetchAndDisplayCSV(keyword) {
  const filePath = `/${keyword}/${keyword}_videos.csv`;

  fetch(filePath)
    .then(response => response.text())
    .then(csvText => {
      const videosData = parseCSV(csvText);
      const infoBoxesHtml = videosData.slice(0, 3).map(createInfoBox).join(''); // Only take the first 3 rows
      document.getElementById('info-box-container').innerHTML = infoBoxesHtml;
    })
    .catch(error => console.error('Error fetching the CSV file:', error));
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
