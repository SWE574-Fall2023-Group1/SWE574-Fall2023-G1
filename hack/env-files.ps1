function Check-And-CreateEnv {
    param (
        [string]$filePath
    )

    $sampleFilePath = $filePath + ".sample"

    if (Test-Path $filePath) {
        # File exists
        Write-Host "$filePath already exists."
    } elseif (Test-Path $sampleFilePath) {
        # Sample file exists, copy it to create the file
        Copy-Item -Path $sampleFilePath -Destination $filePath
        Write-Host "File created by copying $sampleFilePath to $filePath."
    } else {
        # Neither file nor sample file exists, create an empty file
        New-Item -ItemType File -Path $filePath
        Write-Host "File created at $filePath."
    }
}

Check-And-CreateEnv -filePath "./backend/backend/.env"
Check-And-CreateEnv -filePath "./backend/frontend/.env"
