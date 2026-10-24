$ErrorActionPreference = 'Stop'
$path = Join-Path $PSScriptRoot '..\app.js'
$s = [IO.File]::ReadAllText($path)

# 1. Remove hi locale from i18n
$s = [regex]::Replace($s, ",\r?\n  hi: \{[\s\S]*?\r?\n  \},\r?\n\};", "`n};")

# 2. i18n helpers
$s = $s.Replace('function t(k) { return i18n[lang][k] || i18n.en[k] || k; }', "function t(k) { return i18n.en[k] || k; }")
$s = $s.Replace('if (i18n[lang][k]) el.textContent = i18n[lang][k];', 'if (i18n.en[k]) el.textContent = i18n.en[k];')
$s = $s.Replace('if (i18n[lang][k]) el.placeholder = i18n[lang][k];', 'if (i18n.en[k]) el.placeholder = i18n.en[k];')

# 3. Remove plainHi lines
$s = [regex]::Replace($s, "\r?\n\s*plainHi: \[[^\]]*\],", '')

# 4. Collapse notCovered / waiting { en, hi } -> array
$s = [regex]::Replace($s, "notCovered: \{\r?\n\s*en: (\[[\s\S]*?\]),\r?\n\s*hi: \[[\s\S]*?\],\r?\n\s*\}", 'notCovered: $1')
$s = [regex]::Replace($s, "waiting: \{\r?\n\s*en: (\[[\s\S]*?\]),\r?\n\s*hi: \[[\s\S]*?\],\r?\n\s*\}", 'waiting: $1')

# 5. Product / travel Hindi fields
$s = [regex]::Replace($s, ",\s*nameHi:\s*'(?:\\.|[^'])*'", '')
$s = [regex]::Replace($s, ",\s*tagHi:\s*'(?:\\.|[^'])*'", '')
$s = [regex]::Replace($s, ",\s*labelHi:\s*'(?:\\.|[^'])*'", '')
$s = $s.Replace('labelEn:', 'label:')

# 6. aiSuggestions
$s = [regex]::Replace($s, "const aiSuggestions = \{\r?\n\s*en: (\[[^\]]*\]),\r?\n\s*hi: \[[^\]]*\],\r?\n\};", 'const aiSuggestions = $1;')

# 7. AI_PRODUCT_PROMPT_QUERIES -> flat en object
$s = [regex]::Replace($s, "const AI_PRODUCT_PROMPT_QUERIES = \{\r?\n\s*en: (\{[\s\S]*?\}),\r?\n\s*hi: \{[\s\S]*?\},\r?\n\};", 'const AI_PRODUCT_PROMPT_QUERIES = $1;')

# 8. AI_SUGGEST_SHORT_LABEL
$s = [regex]::Replace($s, "const AI_SUGGEST_SHORT_LABEL = \{\r?\n\s*en: (\{[\s\S]*?\}),\r?\n\s*hi: \{[\s\S]*?\},\r?\n\};", 'const AI_SUGGEST_SHORT_LABEL = $1;')

# 9. AI_TERM_GLOSSARY entries { en, hi } -> string
$s = [regex]::Replace($s, "\{ en: ('(?:\\.|[^'])*'), hi: '(?:\\.|[^'])*' \}", '$1')

# 10. AI_MODES: keep en/descEn only
$s = [regex]::Replace($s, ", hi: '[^']*'", '')
$s = [regex]::Replace($s, ", descHi: '[^']*'", '')
$s = $s.Replace('descEn:', 'desc:')

# 11. Plan trust accessors
$s = $s.Replace('const notItems = hi ? meta.notCovered.hi : meta.notCovered.en;', 'const notItems = meta.notCovered;')
$s = $s.Replace('const waitItems = hi ? meta.waiting.hi : meta.waiting.en;', 'const waitItems = meta.waiting;')

# 12. AI query lookup
$s = $s.Replace('AI_PRODUCT_PROMPT_QUERIES[lang]?.[key]', 'AI_PRODUCT_PROMPT_QUERIES[key]')

# 13. travel country search (nameHi removed)
$s = $s.Replace(@"
    const en = c.name.toLowerCase();
    const hi = c.nameHi.toLowerCase();
    return en.includes(q) || hi.includes(q) || c.id.includes(q);
"@, @"
    const en = c.name.toLowerCase();
    return en.includes(q) || c.id.includes(q);
"@)

# 14. Remove const hi = lang === 'hi';
$s = [regex]::Replace($s, "\r?\n\s*const hi = lang === 'hi';", '')

# 15. Remove lang === 'hi' ternaries and hi ? ternaries via C#
Add-Type -Path (Join-Path $PSScriptRoot 'TernaryStrip.cs')
$s = [TernaryStrip]::Strip($s)

# 16. Cleanup lang variable (optional minimal)
$s = [regex]::Replace($s, "\r?\n  lang = 'en';", '')
$s = $s.Replace('let lang = ''en'';', '')

# 17. preferredLang guard — remove from toggle if still there
$s = $s.Replace(" || key === 'preferredLang'", '')

[IO.File]::WriteAllText($path, $s)
Write-Host "Wrote $path"
