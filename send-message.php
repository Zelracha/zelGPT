<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $messages = $data['messages'];

    // Prepare API endpoint
    $url = 'https://gpt-api-bay.vercel.app/chat';

    // Initialize cURL session
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['messages' => $messages]));

    // Execute cURL request
    $response = curl_exec($ch);
    curl_close($ch);

    // Return API response
    echo $response;
}
?>
