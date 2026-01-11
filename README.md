# MRKB Background Display

## Overview
MRKB Background Display is a small Foundry VTT module that provides a persistent display widget on the scene canvas which can show a custom image as a foreground widget or as a background overlay.

This repository contains the module manifest and the minimal implementation (ES module + CSS + localization).

## Features
- Show a custom image as a display widget overlaying the scene canvas.
- Three display modes: Off, Image (visible widget), Background (show as scene background).
- Choose image from Foundry's file browser (data or other configured sources).
- Control the sizing behavior: Contain, Cover, or Multi (contain foreground + blurred cover background).
- Localized UI strings (English, 한국어, 日本語).

## Compatibility
- Foundry VTT 13.x (module manifest sets minimum: 13, verified: 13.351)
- Module ID: `mrkb-background-display`
- Version: 1.0.0
- Repository: https://github.com/mrkb-fvtt-modules/fvtt-background-display
- Manifest URL: `https://raw.githubusercontent.com/mrkb-fvtt-modules/fvtt-background-display/refs/heads/master/module.json`

## Installation (Foundry)
1. Open Foundry VTT and go to Settings → Add-on Modules → Install Module.
2. Paste the module manifest URL (above) into the "Manifest URL" field and click Install.
3. After installation enable the module in Manage Modules for your World.

Optional (development/local):
- Copy the repository into your Foundry `Data/modules/` directory and enable it from Manage Modules.

## Usage
After enabling the module, a new tool group appears in the Scene Controls (visible only to GMs).

Controls (buttons provided under the "Display" group):
- Show Display: Switch mode to "Image" — shows the display widget on the scene.
- Hide Display: Switch mode to "Off" — hides the widget.
- Show as Background: Switch mode to "Background" — applies the image as a background overlay.
- Image Browser: Opens Foundry's image browser so you can pick an image from your configured file sources. Selecting an image sets it as the display image.
- Remove Image: Clears the configured image.

The display widget is injected immediately after the canvas element. It contains two image elements (foreground and background) to support the "multi" sizing mode (a contained foreground over a blurred cover background).

## Settings
The module registers the following world-scoped settings (accessible by code or via the module configuration UI where applicable):

- `mrkb-background-display.mode` (String)
  - Purpose: Current display mode
  - Choices: `off`, `image`, `background`
  - Default: `image`

- `mrkb-background-display.image` (String)
  - Purpose: URL/path of the image shown by the display widget
  - Default: `""` (empty)

- `mrkb-background-display.size` (String)
  - Purpose: How the image is sized on the canvas
  - Choices: `contain` (내접), `cover` (외접), `multi` (동시)
  - Default: `multi`

These settings are updated when you use the scene control buttons or the image browser. They are world-scoped so the state is shared among all users in the world.

## Image recommendations
- Supported formats: PNG, JPEG, GIF (depends on Foundry/file server).
- For best visual results use images with the same aspect ratio as your scene or use `cover` sizing to fill the canvas.
- If using the `multi` sizing mode, provide a high-resolution image so the blurred background looks good when scaled up.

---

# 한국어 설명

## 개요
MRKB Background Display는 Foundry VTT 장면 캔버스 위에 표시되는 작은 디스플레이 위젯을 제공합니다. 이 위젯은 사용자 지정 이미지를 전경 위젯으로 표시하거나 배경 오버레이로 사용할 수 있습니다.

## 특징
- 장면에 사용자 지정 이미지를 표시하는 디스플레이 위젯 제공.
- 세 가지 표시 모드: 끔(Off), 이미지(Image), 배경(Background).
- Foundry의 파일 브라우저로부터 이미지를 선택 가능.
- 크기 조절 모드: 내접(contain), 외접(cover), 동시(multi).
- 다국어 지원(영어, 한국어, 일본어).

## 호환성
- Foundry VTT 13.x (module.json에 최소 13, 검증 13.351)
- 모듈 ID: `mrkb-background-display`
- 버전: 1.0.0

## 설치 (Foundry)
1. Foundry VTT에서 설정 → Add-on Modules → Install Module로 이동합니다.
2. 위의 매니페스트 URL을 "Manifest URL"에 붙여넣고 Install을 클릭합니다.
3. 설치 후 Manage Modules에서 모듈을 활성화합니다.

로컬 개발: 저장소를 Foundry `Data/modules/` 폴더에 복사하고 활성화하세요.

## 사용법
모듈을 활성화하면 장면 컨트롤(Scenes controls)에 `Display` 그룹이 추가됩니다 (GM만 사용 가능).

버튼 기능:
- 디스플레이 보이기: 모드를 `image`로 설정하여 위젯을 표시합니다.
- 디스플레이 숨기기: 모드를 `off`로 설정하여 위젯을 숨깁니다.
- 배경으로 보이기: 모드를 `background`로 설정하여 이미지를 배경처럼 보이게 합니다.
- 이미지 브라우저: Foundry의 이미지 브라우저를 열어 이미지를 선택합니다. 선택하면 자동으로 디스플레이 이미지가 설정됩니다.
- 이미지 제거: 현재 설정된 이미지를 제거합니다.

## 설정
등록된 World 범위 설정:

- `mrkb-background-display.mode` (문자열)
  - 설명: 현재 표시 모드
  - 선택지: `off`, `image`, `background`
  - 기본값: `image`

- `mrkb-background-display.image` (문자열)
  - 설명: 표시할 이미지의 경로 또는 URL
  - 기본값: 빈 문자열

- `mrkb-background-display.size` (문자열)
  - 설명: 캔버스에서 이미지가 어떻게 크기 조절되는지
  - 선택지: `contain` (내접), `cover` (외접), `multi` (동시)
  - 기본값: `multi`

## 이미지 권장사항
- 지원 형식: PNG, JPEG, GIF(Foundry/파일 서버에 따라 달라질 수 있음).
- 장면과 동일한 종횡비의 이미지를 사용하거나 `cover` 모드를 사용하여 캔버스를 채우는 것을 권장합니다.
- `multi` 모드 사용 시 흐릿한 배경 효과를 위해 고해상도 이미지를 사용하는 것이 좋습니다.