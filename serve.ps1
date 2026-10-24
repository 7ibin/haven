$port = 8080
$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Haven is running at http://localhost:$port"
Write-Host "Press Ctrl+C to stop."

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $localPath = $request.Url.LocalPath
    if ($localPath -eq "/") { $localPath = "/index.html" }

    $relative = $localPath.TrimStart("/").Replace("/", [IO.Path]::DirectorySeparatorChar)
    $filePath = Join-Path $root $relative

    if (Test-Path $filePath -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $mime = switch ($ext) {
            ".html" { "text/html; charset=utf-8" }
            ".css"  { "text/css; charset=utf-8" }
            ".js"   { "application/javascript; charset=utf-8" }
            ".json" { "application/json" }
            ".webmanifest" { "application/manifest+json" }
            ".svg"  { "image/svg+xml" }
            ".png"  { "image/png" }
            default { "application/octet-stream" }
        }
        $response.StatusCode = 200
        $response.ContentType = $mime
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $response.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("Not found")
        $response.ContentType = "text/plain"
        $response.OutputStream.Write($msg, 0, $msg.Length)
    }

    $response.Close()
}
