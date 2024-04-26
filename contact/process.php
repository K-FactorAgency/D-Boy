<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $name = $_POST['name'];
  $email = 'tyler@databakeryasia.com'; // Replace with your recipient email

  $message = "You received a new message from: $name";

  // Use a library like PHPMailer for more advanced email sending
  if (mail($email, 'Contact Form Submission', $message)) {
    echo 'Thank you for contacting us! We will get back to you soon.';
  } else {
    echo 'There was an error sending your message. Please try again later.';
  }
} else {
  echo 'Invalid request.';
}

?>
