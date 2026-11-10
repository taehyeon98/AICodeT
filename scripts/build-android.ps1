param(
  [ValidateSet('arm64-v8a', 'x86_64', 'arm64-v8a,x86_64')]
  [string]$Architectures = 'arm64-v8a'
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot

if (-not $env:JAVA_HOME) {
  $bundledJava = 'C:\Program Files\Android\Android Studio\jbr'
  if (-not (Test-Path -LiteralPath "$bundledJava\bin\java.exe")) {
    throw 'JAVA_HOME을 JDK 경로로 설정해주세요.'
  }
  $env:JAVA_HOME = $bundledJava
}
if (-not $env:ANDROID_HOME) {
  $sdkPath = Join-Path $env:LOCALAPPDATA 'Android\Sdk'
  if (-not (Test-Path -LiteralPath $sdkPath)) {
    throw 'ANDROID_HOME을 Android SDK 경로로 설정해주세요.'
  }
  $env:ANDROID_HOME = $sdkPath
}
if (-not (Test-Path -LiteralPath (Join-Path $env:ANDROID_HOME 'cmake\3.31.6\bin\cmake.exe'))) {
  throw 'Android SDK Tools에서 CMake 3.31.6을 설치해주세요. docs/ANDROID_APK.md를 참고하세요.'
}
$env:EXPO_NO_TELEMETRY = '1'
$env:CI = 'true'

& npm.cmd exec -- expo prebuild --platform android --no-install
if ($LASTEXITCODE -ne 0) { throw 'Android 프로젝트 생성 실패' }

Push-Location -LiteralPath (Join-Path $projectRoot 'android')
try {
  # Expo's Windows guidance: CMake 3.31.6 includes Ninja with long-path support.
  & .\gradlew.bat app:assembleRelease "-PreactNativeArchitectures=$Architectures" '-Pandroid.cmakeVersion=3.31.6' --no-daemon --max-workers=2 --console=plain
  if ($LASTEXITCODE -ne 0) { throw 'Android APK 빌드 실패' }
} finally {
  Pop-Location
}

$apkPath = Join-Path $projectRoot 'android\app\build\outputs\apk\release\app-release.apk'
if (-not (Test-Path -LiteralPath $apkPath)) { throw '빌드 결과 APK가 없습니다.' }
$version = (Get-Content -LiteralPath (Join-Path $projectRoot 'package.json') -Raw | ConvertFrom-Json).version
$outputDirectory = Join-Path $projectRoot 'build'
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
$outputPath = Join-Path $outputDirectory "AICodeT-$version-$($Architectures.Replace(',', '-'))-preview.apk"
Copy-Item -LiteralPath $apkPath -Destination $outputPath -Force
Write-Output "내부 테스트용 APK: $outputPath"
Get-FileHash -LiteralPath $outputPath -Algorithm SHA256 | Select-Object Hash
