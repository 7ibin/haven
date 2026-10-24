$ErrorActionPreference = 'Stop'
$path = Resolve-Path (Join-Path $PSScriptRoot '..\app.js')
Add-Type -Path (Join-Path $PSScriptRoot 'TernaryStrip.cs')
$s = [IO.File]::ReadAllText($path)
$prev = ''
$n = 0
while ($s -ne $prev -and $n -lt 2000) {
  $prev = $s
  $s = [TernaryStrip]::Strip($s)
  $n++
}
# Mechanical field renames
$s = $s.Replace('hi ? d.labelHi : d.labelEn', 'd.label')
$s = $s.Replace('hi ? m.labelHi : m.labelEn', 'm.label')
$s = $s.Replace('hi ? active.labelHi : active.labelEn', 'active.label')
$s = $s.Replace('hi ? p.nameHi : p.name', 'p.name')
$s = $s.Replace('hi ? c.nameHi : c.name', 'c.name')
$s = $s.Replace('hi ? p.labelHi : p.labelEn', 'p.label')
$s = $s.Replace('hi ? t.hi : t.en', 't.en')
$s = $s.Replace('hi ? o.hi : o.en', 'o.en')
$s = $s.Replace('hi ? (cfg.labelHi || cfg.label) : cfg.label', 'cfg.label')
$s = $s.Replace('AI_SUGGEST_SHORT_LABEL[lang]?.[key]', 'AI_SUGGEST_SHORT_LABEL[key]')
$s = $s.Replace('aiSuggestions[lang] || aiSuggestions.en', 'aiSuggestions')
$s = $s.Replace('aiSuggestions[lang]', 'aiSuggestions')
# Run stripper again after replacements
for ($i = 0; $i -lt 500; $i++) {
  $next = [TernaryStrip]::Strip($s)
  if ($next -eq $s) { break }
  $s = $next
}
[IO.File]::WriteAllText($path, $s)
$hiQ = ([regex]::Matches($s, 'hi \?')).Count
$langHi = ([regex]::Matches($s, "lang === 'hi' \?")).Count
Write-Host "Iterations: $n; remaining hi ?: $hiQ; lang===hi: $langHi"
