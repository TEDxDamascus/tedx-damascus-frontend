<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'البريد الإلكتروني غير صالح']);
        exit;
    }

    $file = 'subscribers.csv';


    if (!file_exists($file)) {
        file_put_contents($file, "Email,Timestamp\n");
    }


    $current = file_get_contents($file);
    if (strpos($current, $email . ',') !== false) {
        echo json_encode(['message' => 'هذا البريد مسجل مسبقاً']);
        exit;
    }

    $entry = $email . "," . date('Y-m-d H:i:s') . "\n";
    file_put_contents($file, $entry, FILE_APPEND | LOCK_EX);

    echo json_encode(['message' => 'تم التسجيل بنجاح', 'success' => true]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
}
?>