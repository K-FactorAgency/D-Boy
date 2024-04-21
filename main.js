// Async function to fetch CSV data and convert it to HTML
async function fetchAndDisplayComments(keyword) {
    try {
        const commentsPath = `/samsunggalaxy/${keyword}_comments.csv`; // Assuming path structure
        const response = await fetch(commentsPath);
        const csvData = await response.text();
        return parseCSVtoHTML(csvData);
    } catch (error) {
        console.error('Error fetching or parsing CSV data:', error);
        return '<p>Error loading comments.</p>';
    }
}

// HTML helper to create a scrollable table with pagination controls
function createTableWithPagination(comments, pageSize) {
    let currentPage = 1;
    const pageCount = Math.ceil(comments.length / pageSize);

    function renderPagination() {
        let paginationHTML = `<div class="pagination">`;
        for (let i = 1; i <= pageCount; i++) {
            paginationHTML += `<span class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</span>`;
        }
        paginationHTML += `</div>`;
        return paginationHTML;
    }

    function renderTable(page) {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const slicedComments = comments.slice(start, end);
        
        let tableContent = '<ul>';
        slicedComments.forEach(comment => {
            tableContent += `<li>${comment}</li>`;
        });
        tableContent += '</ul>';
        return tableContent;
    }

    window.changePage = (page) => {
        currentPage = page;
        document.getElementById('comments-content').innerHTML = renderTable(page) + renderPagination();
    };

    return renderTable(currentPage) + renderPagination();
}

// Convert CSV data to HTML list elements with pagination
function parseCSVtoHTML(csvData) {
    const rows = csvData.split('\n').slice(1);
    const comments = rows.map(row => {
        const columns = row.split(',');
        return columns.length > 4 ? columns[4].trim() : '';
    }).filter(comment => comment);
    
    return createTableWithPagination(comments, 10); // Display 10 comments per page
}

// Load comments and display them
async function loadData() {
    const keyword = document.getElementById('keyword').value;
    if (keyword) {
        const commentsHtml = await fetchAndDisplayComments(keyword);
        document.getElementById('comments-content').innerHTML = commentsHtml;
        document.getElementById('comments-section').style.display = 'block';
        document.getElementById('lda-section').style.display = 'none'; // Hide LDA section initially
    } else {
        document.getElementById('comments-section').style.display = 'none';
        document.getElementById('lda-section').style.display = 'none';
    }
}

// Load the LDA topics visualization
function loadTopics() {
    const keyword = document.getElementById('keyword').value;
    if (keyword) {
        const ldaPath = `/samsunggalaxy/${keyword}_lda.html`; // Assuming path structure
        const ldaFrame = document.getElementById('lda-content');
        ldaFrame.src = ldaPath;
        document.getElementById('lda-section').style.display = 'block';
    }
}

// Event listener for keyword dropdown changes
document.getElementById('keyword').addEventListener('change', loadData);
