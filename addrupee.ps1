# Replace "Rs " back to Indian Rupee symbol in source files
$files = @(
    'C:\Users\loges\.gemini\antigravity\scratch\maheswari-billing\app.js',
    'C:\Users\loges\.gemini\antigravity\scratch\maheswari-billing\index.html'
)
$rupeeSym = [char]0x20B9

foreach ($file in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $text = [System.Text.Encoding]::UTF8.GetString($bytes)
    $replaced = $text.Replace('Rs ', [string]$rupeeSym)
    $outBytes = [System.Text.Encoding]::UTF8.GetBytes($replaced)
    [System.IO.File]::WriteAllBytes($file, $outBytes)
    Write-Output "Updated: $([System.IO.Path]::GetFileName($file))"
}
