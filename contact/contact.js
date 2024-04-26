document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
  
    const name = document.getElementById('name').value;
  
    // Simple validation (optional)
    if (name === '') {
      alert('Please enter your name.');
      return;
    }
  
    // Send the data (using fetch API) - Replace with your preferred method
    fetch('process.php', {
      method: 'POST',
      body: new URLSearchParams({ name }),
    })
    .then(response => response.text())
    .then(data => {
      alert(data); // Display success or error message from process.php
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    });
  });
  