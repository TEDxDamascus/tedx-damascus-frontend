<?php
/**
 * Open Graph HTML for social crawlers (Facebook does not run JavaScript).
 * Humans are sent to the Next.js static shell.
 */
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: public, max-age=300');

$API = 'https://api.tedxdamascus.sy';
$host = $_SERVER['HTTP_HOST'] ?? 'tedxdamascus.sy';
$SITE = 'https://' . $host;

$type = $_GET['type'] ?? '';
$locale = (($_GET['locale'] ?? 'en') === 'ar') ? 'ar' : 'en';
$key = trim((string) ($_GET['slug'] ?? $_GET['id'] ?? ''));

$allowedTypes = ['speaker' => 'speakers', 'team' => 'team', 'organizer' => 'organizers'];
if (!isset($allowedTypes[$type]) || $key === '' || !preg_match('/^[A-Za-z0-9_-]+$/', $key)) {
  renderOg($SITE, $SITE . '/', 'TEDx Damascus', 'Ideas worth spreading from the heart of Syria.', $SITE . '/images/icons/tedx-logo.png');
  exit;
}

$section = $allowedTypes[$type];
$prettyUrl = $SITE . '/' . $locale . '/' . $section . '/' . rawurlencode($key) . '/';
$spaUrl = $SITE . '/' . $locale . '/' . $section . '/detail/?' . ($type === 'speaker' ? 'slug' : 'id') . '=' . rawurlencode($key);

$ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
$isCrawler = (bool) preg_match(
  '/facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|Discordbot|Pinterest|vkShare/i',
  $ua
);

if (!$isCrawler) {
  header('Location: ' . $spaUrl, true, 302);
  exit;
}

$fallbackTitle = 'TEDx Damascus';
$fallbackDesc = $locale === 'ar'
  ? 'أفكار تستحق الانتشار من قلب سوريا.'
  : 'Ideas worth spreading from the heart of Syria.';
$fallbackImage = $SITE . '/images/icons/tedx-logo.png';

$found = fetchProfile($API, $type, $key, $locale);
if (!$found) {
  renderOg($SITE, $prettyUrl, $fallbackTitle, $fallbackDesc, $fallbackImage);
  exit;
}

renderOg($SITE, $prettyUrl, $found['title'], $found['description'], $found['image']);

function fetchProfile(string $api, string $type, string $key, string $locale): ?array
{
  if ($type === 'speaker') {
    $list = apiList($api . '/speakers?limit=500');
    foreach ($list as $item) {
      $slug = toSlug(loc($item['slug'] ?? '', 'en'));
      $id = (string) ($item['_id'] ?? '');
      if ($slug === $key || $id === $key) {
        $name = loc($item['name'] ?? '', $locale);
        $bio = loc($item['bio'] ?? '', $locale);
        $desc = loc($item['description'] ?? '', $locale);
        return [
          'title' => $name !== '' ? $name : 'TEDx Damascus Speaker',
          'description' => firstNonEmpty($bio, $desc, 'Speaker at TEDx Damascus'),
          'image' => imageUrl($item['speaker_image'] ?? null, $api),
        ];
      }
    }
    return null;
  }

  if ($type === 'team') {
    $list = apiList($api . '/team?limit=500');
    foreach ($list as $item) {
      $id = (string) ($item['_id'] ?? '');
      $en = toSlug(loc($item['name'] ?? '', 'en'));
      $ar = toSlug(loc($item['name'] ?? '', 'ar'));
      if ($id === $key || $en === $key || $ar === $key) {
        $name = loc($item['name'] ?? '', $locale);
        $bio = loc($item['bio'] ?? '', $locale);
        return [
          'title' => $name !== '' ? $name : 'TEDx Damascus Team',
          'description' => firstNonEmpty($bio, 'Team member at TEDx Damascus'),
          'image' => imageUrl($item['image'] ?? null, $api),
        ];
      }
    }
    return null;
  }

  $direct = apiJson($api . '/organizer/' . rawurlencode($key));
  $item = is_array($direct) ? (($direct['data'] ?? null) ?: $direct) : null;
  if (!is_array($item) || empty($item['_id'])) {
    $list = apiList($api . '/organizer?limit=500');
    foreach ($list as $row) {
      if ((string) ($row['_id'] ?? '') === $key) {
        $item = $row;
        break;
      }
    }
  }
  if (!is_array($item) || empty($item['_id'])) {
    return null;
  }

  $name = loc($item['name'] ?? '', $locale);
  $bio = loc($item['bio'] ?? '', $locale);
  $role = is_string($item['role'] ?? null) ? $item['role'] : '';
  return [
    'title' => $name !== '' ? $name : 'TEDx Damascus Organizer',
    'description' => firstNonEmpty($bio, $role, 'Organizer at TEDx Damascus'),
    'image' => imageUrl($item['image'] ?? null, $api),
  ];
}

function apiJson(string $url)
{
  $raw = httpGet($url);
  if ($raw === null || $raw === '') {
    return null;
  }
  $decoded = json_decode($raw, true);
  return is_array($decoded) ? $decoded : null;
}

function apiList(string $url): array
{
  $decoded = apiJson($url);
  if (!is_array($decoded)) {
    return [];
  }
  if (isListArray($decoded)) {
    return $decoded;
  }
  if (isset($decoded['data']) && is_array($decoded['data'])) {
    return isListArray($decoded['data']) ? $decoded['data'] : [];
  }
  return [];
}

function isListArray(array $arr): bool
{
  if ($arr === []) {
    return true;
  }
  return array_keys($arr) === range(0, count($arr) - 1);
}

function httpGet(string $url): ?string
{
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_TIMEOUT => 8,
      CURLOPT_CONNECTTIMEOUT => 5,
      CURLOPT_HTTPHEADER => ['Accept: application/json'],
    ]);
    $body = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($body === false || $code >= 400) {
      return null;
    }
    return $body;
  }

  $ctx = stream_context_create(['http' => ['timeout' => 8, 'header' => "Accept: application/json\r\n"]]);
  $body = @file_get_contents($url, false, $ctx);
  return $body === false ? null : $body;
}

function loc($field, string $lang): string
{
  if ($field === null || $field === '') {
    return '';
  }
  if (is_string($field)) {
    return $field;
  }
  if (is_array($field)) {
    $value = $field[$lang] ?? $field['en'] ?? $field['ar'] ?? '';
    return is_string($value) ? $value : '';
  }
  return '';
}

function toSlug(string $text): string
{
  $text = strtolower($text);
  $text = preg_replace('/[^a-z0-9\s-]/', '', $text) ?? '';
  $text = trim($text);
  $text = preg_replace('/\s+/', '-', $text) ?? '';
  return $text;
}

function firstNonEmpty(string ...$values): string
{
  foreach ($values as $value) {
    if (trim($value) !== '') {
      return trim($value);
    }
  }
  return '';
}

function imageUrl($id, string $api): string
{
  if (is_array($id) && isset($id['url'])) {
    $id = $id['url'];
  }
  if (!is_string($id) || $id === '') {
    return '';
  }
  if (strpos($id, 'http://') === 0 || strpos($id, 'https://') === 0) {
    return $id;
  }
  if (strpos($id, '/') === 0) {
    return $id;
  }
  return $api . '/files/' . $id;
}

function facebookImageUrl(string $raw, string $site): string
{
  if ($raw === '') {
    $raw = $site . '/images/icons/tedx-logo.png';
  } elseif (strpos($raw, '/') === 0) {
    $raw = $site . $raw;
  }

  if (strpos($raw, 'images.weserv.nl') !== false) {
    $query = parse_url($raw, PHP_URL_QUERY);
    parse_str((string) $query, $params);
    $inner = $params['url'] ?? '';
    if (is_string($inner) && $inner !== '') {
      $raw = preg_match('#^https?://#', $inner) ? $inner : ('http://' . $inner);
    }
  }

  if (strpos($raw, 'http://') === 0) {
    $withoutScheme = substr($raw, strlen('http://'));
  } elseif (strpos($raw, 'https://') === 0) {
    $withoutScheme = substr($raw, strlen('https://'));
  } else {
    $withoutScheme = $raw;
  }

  return 'https://images.weserv.nl/?url=' . rawurlencode($withoutScheme)
    . '&w=1200&h=630&fit=contain&cbg=101010';
}

function renderOg(string $site, string $url, string $title, string $description, string $image): void
{
  $pageTitle = $title === 'TEDx Damascus' ? $title : ($title . ' | TEDx Damascus');
  $ogImage = facebookImageUrl($image, $site);
  $t = htmlspecialchars($pageTitle, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
  $d = htmlspecialchars($description, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
  $u = htmlspecialchars($url, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
  $i = htmlspecialchars($ogImage, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
  $siteName = 'TEDx Damascus';

  echo <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{$t}</title>
  <meta name="description" content="{$d}">
  <link rel="canonical" href="{$u}">
  <meta property="og:type" content="profile">
  <meta property="og:site_name" content="{$siteName}">
  <meta property="og:title" content="{$t}">
  <meta property="og:description" content="{$d}">
  <meta property="og:url" content="{$u}">
  <meta property="og:image" content="{$i}">
  <meta property="og:image:secure_url" content="{$i}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="{$t}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{$t}">
  <meta name="twitter:description" content="{$d}">
  <meta name="twitter:image" content="{$i}">
</head>
<body>
  <p>{$t}</p>
  <p>{$d}</p>
  <p><a href="{$u}">{$u}</a></p>
</body>
</html>
HTML;
}
