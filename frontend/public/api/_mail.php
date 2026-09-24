<?php
// Outgoing mail through the real mailbox over authenticated SMTP, so Hostinger
// DKIM-signs it and SPF/DMARC align with hollandsvastgoedfonds.com. Plain PHP
// mail() is not DKIM-signed and fails DMARC, which sends lead notifications and
// seller confirmations to spam. Falls back to mail() if SMTP is not configured
// or fails. Config (~/hollands_data/config.php): smtp_host, smtp_port,
// smtp_user, smtp_pass. Never executed directly (.htaccess denies _*.php).
declare(strict_types=1);

if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) { http_response_code(404); exit; }

function hvf_mail(array $cfg, string $to, string $encodedSubject, string $body, string $headers, string $from): bool {
    $to = str_replace(["\r", "\n"], '', $to);
    if (!empty($cfg['smtp_pass'])) {
        try {
            if (hvf_smtp_send($cfg, $to, $encodedSubject, $body, $headers, $from)) return true;
        } catch (Throwable $e) {
            error_log('[mail] smtp: ' . $e->getMessage());
        }
    }
    return @mail($to, $encodedSubject, $body, $headers, '-f' . $from);
}

function hvf_smtp_send(array $cfg, string $to, string $encodedSubject, string $body, string $headers, string $from): bool {
    $host = (string)($cfg['smtp_host'] ?? 'smtp.hostinger.com');
    $port = (int)($cfg['smtp_port'] ?? 465);
    $user = (string)($cfg['smtp_user'] ?? $from);
    $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'peer_name' => $host]]);
    $fp = @stream_socket_client("ssl://{$host}:{$port}", $errno, $errstr, 10, STREAM_CLIENT_CONNECT, $ctx);
    if (!$fp) throw new RuntimeException("connect $errno $errstr");
    stream_set_timeout($fp, 15);

    $read = function () use ($fp): string {
        $out = '';
        while (($line = fgets($fp, 1024)) !== false) {
            $out .= $line;
            if (strlen($line) < 4 || $line[3] === ' ') break;
        }
        return $out;
    };
    $cmd = function (string $c, array $ok) use ($fp, $read): string {
        if ($c !== '') fwrite($fp, $c . "\r\n");
        $r = $read();
        if (!in_array((int)substr($r, 0, 3), $ok, true)) throw new RuntimeException('SMTP ' . trim(substr($r, 0, 120)) . ' after ' . strtok($c, ' '));
        return $r;
    };

    $cmd('', [220]);
    $cmd('EHLO hollandsvastgoedfonds.com', [250]);
    $cmd('AUTH LOGIN', [334]);
    $cmd(base64_encode($user), [334]);
    $cmd(base64_encode((string)$cfg['smtp_pass']), [235]);
    $cmd('MAIL FROM:<' . $from . '>', [250]);
    $cmd('RCPT TO:<' . $to . '>', [250, 251]);
    $cmd('DATA', [354]);

    $msg = 'Date: ' . date(DATE_RFC2822) . "\r\n"
        . 'Message-ID: <' . bin2hex(random_bytes(12)) . '@hollandsvastgoedfonds.com>' . "\r\n"
        . 'To: <' . $to . ">\r\n"
        . 'Subject: ' . $encodedSubject . "\r\n"
        . rtrim($headers, "\r\n") . "\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . preg_replace('/^\./m', '..', str_replace(["\r\n", "\r"], "\n", $body));
    $msg = str_replace("\n", "\r\n", str_replace("\r\n", "\n", $msg));
    fwrite($fp, $msg . "\r\n.\r\n");
    $cmd('', [250]);
    @fwrite($fp, "QUIT\r\n");
    fclose($fp);
    return true;
}
