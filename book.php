<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$body = json_decode(file_get_contents('php://input'), true);
if (!$body) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// ── Route to N8N webhook if configured, else direct Airtable ──────────────
$n8nUrl = getenv('N8N_WEBHOOK_URL') ?: '';

if ($n8nUrl) {
    // Forward raw body to N8N — N8N handles Airtable + email
    $ch = curl_init($n8nUrl);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($body),
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_TIMEOUT        => 20,
    ]);
    $result   = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr  = curl_error($ch);
    curl_close($ch);

    if ($curlErr) {
        http_response_code(502);
        echo json_encode(['error' => 'Could not reach booking service']);
        exit;
    }
    http_response_code($httpCode >= 200 && $httpCode < 300 ? 200 : $httpCode);
    echo $result;
    exit;
}

// ── Fallback: direct Airtable ─────────────────────────────────────────────
$token = getenv('AIRTABLE_TOKEN') ?: '';
$base  = getenv('AIRTABLE_BASE')  ?: 'appIusIxCmha7lwTx';
$table = getenv('AIRTABLE_TABLE') ?: 'tblztDpDrbvOpkhYg';

$payload = json_encode([
    'records' => [[
        'fields' => [
            'Full Name'         => $body['Full Name']         ?? '',
            'Phone Number'      => $body['Phone Number']      ?? '',
            'Email Address'     => $body['Email Address']     ?? '',
            'Vehicle'           => $body['Vehicle']           ?? '',
            'Service Requested' => $body['Service Requested'] ?? '',
            'Preferred Date'    => $body['Preferred Date']    ?? '',
            'Preferred Time'    => $body['Preferred Time']    ?? '',
            'Additional Notes'  => $body['Additional Notes']  ?? '',
            'Submission Source' => $body['Submission Source'] ?? 'Booking Form',
            'Status'            => 'New',
        ]
    ]]
]);

$ch = curl_init("https://api.airtable.com/v0/{$base}/{$table}");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => [
        "Authorization: Bearer {$token}",
        'Content-Type: application/json',
    ],
    CURLOPT_TIMEOUT => 15,
]);

$result   = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr  = curl_error($ch);
curl_close($ch);

if ($curlErr) {
    http_response_code(502);
    echo json_encode(['error' => 'Could not reach Airtable']);
    exit;
}

http_response_code($httpCode);
echo $result;
