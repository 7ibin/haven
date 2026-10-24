$p = Join-Path $PSScriptRoot '..\app.js'
$s = [IO.File]::ReadAllText($p)
$n = [regex]::Replace($s, '\$\{''((?:[^''\\]|\\.)*)''\}', {
  param($m)
  $m.Groups[1].Value
})
[IO.File]::WriteAllText($p, $n)
Write-Host "Remaining:" ([regex]::Matches($n, '\$\{''')).Count
