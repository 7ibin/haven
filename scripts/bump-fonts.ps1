$p = Join-Path $PSScriptRoot '..\styles.css'
$s = [IO.File]::ReadAllText($p)
$s = $s -replace 'font-size: 0\.5625rem', 'font-size: 0.75rem'
$s = $s -replace 'font-size: 0\.625rem', 'font-size: 0.75rem'
$s = $s -replace 'font-size: 0\.6875rem', 'font-size: 0.75rem'
[IO.File]::WriteAllText($p, $s)
