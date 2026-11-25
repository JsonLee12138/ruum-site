import type { SiteCopy } from "./types";

export const ko: SiteCopy = {
  locale: "ko",
  localeLabel: "한국어",
  htmlLang: "ko",
  meta: {
    homeTitle:
      "Ruum — 무료 오픈소스 디스크 용량 분석 및 AI 디스크 정리 도구 (Mac · Windows · Linux)",
    homeDescription:
      "Ruum은 macOS, Windows(고속 NTFS MFT 스캔), Linux를 지원하는 무료 오픈소스 트리맵 디스크 용량 분석 및 AI 디스크 정리 도구입니다. 대용량 파일, 개발 캐시, Docker, 원격 SSH 서버를 시각화하고 내장 MCP로 안전하게 정리하세요.",
    downloadTitle: "Ruum 다운로드 — macOS · Windows · Linux 무료 디스크 용량 분석 및 정리 도구",
    downloadDescription:
      "SHA-256 체크섬 및 Sigstore 빌드 증명이 포함된 macOS(Apple Silicon/Intel), Windows, Linux용 Ruum 데스크톱 설치 파일과 헤드리스 CLI를 무료로 다운로드하세요.",
    changelogTitle: "Ruum 변경 로그 — 크로스 플랫폼 디스크 용량 분석 및 AI 정리 릴리스 기록",
    changelogDescription:
      "macOS, Windows, Linux용 디스크 용량 분석 및 AI 정리 도구 Ruum의 공식 출시 내역과 업데이트 기록을 확인하세요.",
    keywords:
      "Ruum, ruum, 디스크 용량 분석, 디스크 정리, AI 디스크 정리, 대용량 파일 찾기, Mac 디스크 정리, Windows 디스크 분석, C드라이브 정리, NTFS MFT, Linux 디스크 용량, Docker 용량 정리, SSH 서버 디스크, MCP 디스크 도구, node_modules 정리, 무료 오픈소스",
    ogImageAlt:
      "Ruum — macOS, Windows, Linux용 무료 오픈소스 디스크 용량 분석 및 AI 디스크 정리 도구",
    applicationSubCategory: "디스크 용량 분석 및 AI 디스크 정리 도구",
    alternateNames: ["ruum", "Ruum 디스크 용량 분석기", "Ruum AI 디스크 정리"],
    featureList: [
      "macOS, Windows(관리자 NTFS MFT 직접 읽기), Linux용 고속 트리맵 디스크 용량 분석",
      "O(1) AI 워치독 데몬 및 사용자 승인 게이트가 적용된 8개 도구 stdio MCP 서버",
      "로컬 볼륨을 코어 레벨 읽기 전용으로 잠가 보호하는 Docker 공간 탐색기",
      "해시 검증된 정적 musl 스트리밍 기반의 sudo 없는 원격 SSH 디스크 진단",
      "node_modules, Xcode, Cargo 빌드 캐시 등 재생성 가능한 개발 캐시 즉시 식별",
      "휴지통 우선 이동, OS·마운트 경로 차단, 훅리스 Git 검사를 수행하는 Rust 안전 가드",
    ],
  },
  nav: {
    home: "홈",
    capabilities: "핵심 기능",
    safety: "안전 설계",
    download: "다운로드",
    changelog: "변경 로그",
    support: "후원",
    installCta: "설치하기",
    themeToDark: "Obsidian 다크 테마로 전환",
    themeToLight: "Warm Paper 라이트 테마로 전환",
    menu: "메뉴",
    logoAlt: "Ruum 로고",
  },
  hero: {
    eyebrowPrefix: "Rust + GPUI",
    eyebrowTech: "macOS · Linux · Windows · GPL-3.0",
    headlineLine1: "모든 드라이브에",
    headlineLine2: "숨 쉴 여유를.",
    subcopy:
      "Ruum은 macOS, Windows, Linux용 무료 오픈소스 디스크 용량 분석 및 AI 디스크 정리 도구입니다. 대용량 파일, 개발 캐시, Docker, 원격 SSH 서버 점유율을 트리맵으로 한눈에 파악하고 사용자 확인 후에만 안전하게 정리합니다.",
    primaryCta: "Ruum 다운로드",
    secondaryCta: "GitHub 보기",
    tourCta: "빠른 시작",
    tourHint: "아래에서 웹 데모와 실제 macOS 스크린샷을 전환하거나 5단계 빠른 시작을 실행해 보세요",
  },
  installBar: {
    tabs: {
      unix: "macOS / Linux",
      homebrew: "Homebrew",
      windows: "Windows",
      cli: "서버 CLI",
    },
    detectedTag: "현재 OS 추천",
    copy: "복사",
    copied: "복사됨",
    allPackages: "전체 설치 파일 및 체크섬",
    verifiedNote: "Ed25519 + SHA-256 서명 검증",
  },
  sandbox: {
    windowTitle: "Ruum",
    demoModeLabel: "인터랙티브 데모",
    screenshotModeLabel: "실제 스크린샷",
    demoDisclaimer: "샘플 데이터",
    screenshotCaption:
      "macOS 데스크톱 앱의 실제 스크린샷입니다. 데모 모드로 전환하면 직접 체험할 수 있습니다.",
    screenshotAlt: "Ruum macOS 네이티브 데스크톱 앱 디스크 용량 분석 실제 스크린샷",
    tourButton: "빠른 시작",
    rescanButton: "다시 스캔",
    resetButton: "초기화",
    rails: {
      explore: "탐색",
      docker: "Docker",
      watchdog: "Watchdog",
      ssh: "원격",
    },
    explore: {
      breadcrumbRoot: "Ruum / Users / dev",
      summaryItems: "263 GiB · 파일 4,184,346개 · 63.0초",
      modeSize: "크기순",
      modeAge: "수정 시점",
      hatchLegend: "빗금 = 회수 가능",
      selectionHeading: "선택 항목",
      ofScan: "비중",
      filesLabel: "파일 수",
      lastWriteLabel: "최근 수정",
      kindLabel: "유형",
      gitLabel: "Git 상태",
      markBtn: "정리 대상으로 표시",
      unmarkBtn: "표시 해제",
      worthLooking: "확인 권장",
      diskHeading: "디스크 · /dev/disk3s5",
      freeSuffix: "GiB 여유",
      projectedSuffix: "GiB 정리 후 예상",
      reviewBtnPrefix: "검토",
      reviewBtnMid: "개 · 확보 예정",
      reviewTitle: "비파괴 검토 및 실행",
      reviewTrashBtn: "휴지통으로 이동",
      reviewExportBtn: "AI 프롬프트 복사",
      reviewDoneBadge: "검증 완료",
      reviewDoneText: "휴지통으로 이동한 뒤 재스캔하여 실제 여유 공간을 갱신했습니다.",
      reclaimableBadge: "재생성 가능",
      protectedBadge: "소스 코드",
      ageWeek: "이번 주",
      ageOlder: "오래됨",
    },
    docker: {
      title: "Docker 공간 분석 및 안전 정리",
      hostLocal: "이 컴퓨터 · OrbStack",
      hostSsh: "SSH · prod-eu-01 · dockerd",
      overviewTitle: "디스크 사용량 개요",
      safeReclaimable: "안전 회수 가능",
      cards: {
        images: "이미지 (Images)",
        containers: "컨테이너 (Containers)",
        buildCache: "빌드 캐시",
        localVolumes: "로컬 볼륨",
      },
      protectedBadge: "보호됨 · 읽기 전용",
      protectedNote:
        "데이터베이스 등 로컬 볼륨은 읽기 전용으로 잠겨 Ruum이 절대 자동으로 삭제하지 않습니다.",
      sharedNotePrefix: "이미지와 공유됨",
      candidatesTitle: "안전한 정리 후보",
      cleanBtn: "선택 항목 정리",
      cleanedNotice: "선택한 캐시와 미사용 이미지를 정리했습니다. 볼륨은 안전하게 유지됩니다.",
    },
    watchdog: {
      title: "디스크 워치독 & AI 정리 어시스턴트",
      statusHealthy: "O(1) statvfs · 백그라운드 탐색 0회",
      statusLow: "AI 정리 제안 준비됨",
      daemonLabel: "데몬: launchd / systemd / Run",
      thresholdLabel: "임계값 < 20 GiB",
      runAnalysisBtn: "지금 AI 분석 실행",
      analyzingLabel: "빌드 캐시 및 오래된 Git worktree 평가 중…",
      proposalTitle: "정리 승인 창 (사용자 직접 확인)",
      proposalBadge: "무단 삭제 불가",
      gitWarning: "Git: 오래된 worktree 2개 · 16일 미수정",
      confirmBtn: "승인 및 정리",
      confirmedNotice: "승인된 항목을 안전하게 휴지통으로 옮겼습니다.",
      proposalTab: "AI 제안서",
      mcpTraceTab: "MCP 호출 추적",
      mcpTraceNote: "헤드리스 stdio JSON-RPC (`ruum mcp --read-only`)",
    },
    ssh: {
      title: "원격 SSH 비침투 진단",
      banner: "ruum ssh prod-eu-01 /var",
      readOnlyTag: "내보내기 전용 · sudo 불필요",
      targetsHeading: "스트리밍된 원격 대용량 경로",
      scriptHeading: "미리보기 우선 삭제 스크립트 (HostIdentity 검증)",
      copyScript: "스크립트 복사",
      copiedScript: "복사됨",
      previewNotice:
        "기본 실행은 대상만 미리 출력하며, `--delete` 시 hostname과 machine-id를 대조합니다.",
    },
    tour: {
      nextBtn: "다음",
      prevBtn: "이전",
      doneBtn: "완료",
      progressText: "{{current}} / {{total}}",
      steps: {
        install: {
          title: "1. 한 줄 명령어로 설치",
          description:
            "사용 중인 OS 탭에서 SHA-256 검증 설치 스크립트를 복사하거나(서버용 --cli-only 포함), 다운로드 페이지에서 설치 패키지를 받을 수 있습니다.",
        },
        explore: {
          title: "2. 시맨틱 트리맵 + 빗금 구분",
          description:
            "색상은 데이터 유형(코드, Agent 임시 공간, 툴체인, 캐시)을, 빗금은 안전한 정리 가능 여부를 뜻합니다. 타일을 클릭하면 오른쪽 여유 공간 예측 바가 즉시 올라갑니다.",
        },
        docker: {
          title: "3. 볼륨 잠금 기반 Docker 정리",
          description:
            "로컬과 SSH 원격 Docker를 하나의 UI에서 확인하세요. Local Volumes는 항상「보호됨 · 읽기 전용」으로 잠겨 데이터 손실을 원천 차단합니다.",
        },
        ssh: {
          title: "4. sudo 없는 SSH 원격 내보내기",
          description:
            "해시 검증된 정적 musl 스캐너를 자동 업로드하여 압축 스트림으로 시각화합니다. 원격 GUI는 직접 삭제를 차단하고 HostIdentity 검증 스크립트만 내보냅니다.",
        },
        watchdog: {
          title: "5. O(1) AI 워치독 및 MCP",
          description:
            "폴더 탐색 없이 statvfs로 여유 공간을 감시하고, 공간 부족 시 AI가 제안서를 준비해 사용자 체크박스 확인 창에서 승인을 기다립니다.",
        },
      },
    },
  },
  capabilities: {
    sectionEyebrow: "4가지 핵심 경쟁력",
    sectionTitle: "AI 시대 워크스테이션과 프로덕션 서버를 위한 설계.",
    sectionSubtitle:
      "수백 GB의 숨은 캐시, Docker 빌드 레이어, 원격 서버 병목을 즉시 드러내면서도 Rust 기반 안전 가드로 코드와 볼륨을 보호합니다.",
    aiMcp: {
      eyebrow: "01 · AI 인텔리전스 & MCP",
      title: "O(1) 워치독 데몬 + 8개 도구의 stdio MCP 서버.",
      description:
        "디스크 I/O 낭비 없이 여유 공간을 감시하고, 공간이 부족하면 설정한 AI CLI(Agy, Pi, Codex, Custom)로 정리 제안을 생성합니다. AI 에이전트용 MCP 서버도 내장했습니다.",
      bullets: [
        "OS 네이티브 상주: launchd (macOS), systemd --user (Linux), 무UAC Run (Windows)",
        "AI 제안은 Git 상태 경고가 포함된 독립 확인 창에서 사용자가 직접 체크 후 실행",
        "삭제 계열 MCP 도구는 데스크톱 승인 및 Touch ID 등 OS 인증 실패 시 즉시 중단",
      ],
      modeStandard: "표준 (GUI 승인 필수)",
      modeReadOnly: "--read-only (읽기 감사)",
      copyJson: "설정 복사",
      copiedJson: "복사됨",
      toolsHeading: "제공 MCP 도구 8종",
      toolCol: "도구명",
      scopeCol: "범위",
      guardCol: "안전 경계",
    },
    ssh: {
      eyebrow: "02 · 원격 SSH 진단",
      title: "sudo 없이 정적 musl 스캐너 자동 배포 및 스트리밍.",
      description:
        "SSH 호스트 별칭만 입력하면 해시 검증된 정적 musl 헬퍼를 ~/.cache/ruum/ssh/에 업로드해 원격 메모리 점유 없이 압축 스트림으로 트리맵을 그립니다.",
      bullets: [
        "중첩 마운트 경계에서 안전하게 정지하고 연결 해제 시 즉시 종료",
        "원격 GUI 세션은 엄격히 내보내기 전용으로 원격 직접 삭제를 차단",
        "내보낸 스크립트는 실제 원격 hostname과 machine-id 일치 여부를 먼저 검증",
      ],
      cmdLabel: "터미널에서 단 한 줄로 연결",
      pipelineSteps: [
        {
          step: "01",
          title: "탐지 및 업로드",
          detail: "원격 아키텍처를 확인해 해시 검증된 정적 musl 스캐너 업로드",
        },
        {
          step: "02",
          title: "제한된 압축 스트림",
          detail: "단일 SSH 파이프로 전송하여 원격 RAM에 트리를 쌓지 않음",
        },
        {
          step: "03",
          title: "HostIdentity 검증",
          detail: "실제 hostname과 /etc/machine-id가 일치할 때만 삭제 허용",
        },
      ],
    },
    docker: {
      eyebrow: "03 · Docker 공간 & 볼륨 안전",
      title: "이미지·컨테이너·빌드 캐시 정리, 로컬 볼륨은 읽기 전용 잠금.",
      description:
        "로컬(Docker Desktop / OrbStack)과 원격 SSH dockerd를 동일한 어댑터로 진단해 이미지 공유 레이어와 실제 회수 가능한 캐시를 정확히 구분합니다.",
      bullets: [
        "4단계 데몬 상태 탐지: 미설치 / 중지됨 / 소켓 권한 거부 / 사용 가능",
        "빌드 캐시 중 이미지와 공유된 바이트와 순수 회수량 분리 표시",
        "Local Volumes는 UI와 삭제 어댑터 양쪽에서 Protected · Read-only 잠금",
      ],
      cardLabels: [
        { name: "Images", status: "미사용 및 dangling 이미지 선택 가능", badge: "정리 가능" },
        { name: "Containers", status: "중지·종료된 컨테이너 후보", badge: "정리 가능" },
        { name: "Build Cache", status: "공유 레이어 분리 후 순수 회수량 산출", badge: "정리 가능" },
        {
          name: "Local Volumes",
          status: "영구 데이터 보호를 위해 항상 잠김",
          badge: "보호됨 · 읽기 전용",
        },
      ],
    },
    visual: {
      eyebrow: "04 · GPUI 네이티브 시각화",
      title: "색상은 데이터 유형, 빗금은 정리 가능 영역.",
      description:
        "Rust와 GPUI로 네이티브 렌더링됩니다. 타일 면적은 실제 할당 블록 크기에 비례하며(Windows 관리자 실행 시 NTFS MFT 직접 읽기), 빗금으로 정리 대상을 즉시 식별합니다.",
      bullets: [
        "메모이제이션 확장: ~에서 /로 넓혀도 기존 스캔 서브트리를 재사용",
        "하드링크 중복 제거로 동일 inode를 한 번만 계산하는 정확한 용량 측정",
        "중첩 선택을 이중 합산하지 않는 실시간 여유 공간 예측 미터",
      ],
      legendTitle: "카테고리 시맨틱 팔레트",
      hatchCaption:
        "45° 빗금 = 재생성 가능한 node_modules, Xcode / Cargo 빌드 캐시, worktree, 패키지 저장소",
      categories: [
        "코드",
        "Agent 임시",
        "툴체인",
        "컨테이너",
        "동기화",
        "Git",
        "미디어",
        "캐시",
        "문서",
        "기타",
      ],
    },
  },
  safety: {
    eyebrow: "엔지니어링 안전 가드",
    title: "단순 경고 창이 아닌, Rust 코어 레벨에서 강제되는 안전 규칙.",
    subtitle:
      "모든 삭제 경로는 디스크에 닿기 전 코어 레벨에서 검증되며 경계 위반 시 즉시 중단됩니다.",
    items: [
      {
        code: "GUARD · 01",
        title: "OS 핵심 경로 및 마운트 거부",
        detail:
          "루트, 홈 디렉터리, /usr, /etc, /nix/store, Homebrew 및 Windows 시스템 폴더는 무조건 차단됩니다.",
      },
      {
        code: "GUARD · 02",
        title: "Docker 볼륨 읽기 전용 잠금",
        detail:
          "로컬 볼륨은 코어 레벨에서 정리 대상에서 제외되어 데이터베이스와 영구 마운트가 실수로 삭제되지 않습니다.",
      },
      {
        code: "GUARD · 03",
        title: "클라우드 다운로드 방지 및 하드링크 제거",
        detail:
          "iCloud Drive·Dropbox 파일을 다운로드하지 않으며 Time Machine 스냅샷 제외 및 하드링크 중복을 제거합니다.",
      },
      {
        code: "GUARD · 04",
        title: "훅리스 Git 안전성 검사",
        detail:
          "Git hooks와 fsmonitor를 끈 읽기 전용 모드로 커밋되지 않은 변경 사항과 stash를 확인합니다.",
      },
      {
        code: "GUARD · 05",
        title: "사용자 확인 + Touch ID 인증",
        detail:
          "기본은 휴지통 이동이며 영구 삭제 및 변경형 MCP 도구는 체크박스 승인과 OS 네이티브 인증이 필수입니다.",
      },
      {
        code: "GUARD · 06",
        title: "Ed25519 + SHA-256 + Sigstore 검증",
        detail:
          "모든 릴리스에 서명된 매니페스트, SHA256SUMS 및 gh attestation verify용 증명이 제공됩니다.",
      },
    ],
  },
  installBand: {
    eyebrow: "15초 만에 시작하기",
    title: "로컬 드라이브와 원격 서버 모두에 여유 공간을 되돌려주세요.",
    subtitle:
      "단일 바이너리에 데스크톱 GUI, SSH 스캐너, 워치독, stdio MCP 서버가 모두 통합되어 있습니다.",
    downloadPageBtn: "전체 설치 파일 보기",
    changelogBtn: "변경 로그 보기",
  },
  support: {
    eyebrow: "OPEN SOURCE · GPL-3.0",
    title: "커피 한 잔 사주기",
    description:
      "Ruum이 디스크 공간을 되찾고 정리 시간을 줄이는 데 도움이 되었다면, 커피 한 잔으로 응원해 주세요.",
    kofiCta: "Ko-fi에서 커피 한 잔 사주기",
    kofiNote: "Ko-fi 일회성 후원 · Ruum은 언제나 무료 오픈소스로 유지됩니다.",
    wechatTrigger: "",
    wechatModalTitle: "",
    wechatHint: "",
    wechatAlt: "",
    closeLabel: "닫기",
  },
  downloadPage: {
    eyebrow: "배포 및 무결성 검증",
    title: "Ruum 다운로드",
    subtitle:
      "macOS, Windows, Linux용 무료 디스크 용량 분석·정리 설치 파일과 패키지 매니저, 헤드리스 서버 CLI를 SHA-256 및 Sigstore 검증과 함께 제공합니다.",
    channelStable: "안정판 (Stable)",
    channelBeta: "베타판 (Beta)",
    recommendedForPrefix: "권장 다운로드 ·",
    archAppleSilicon: "Apple Silicon (aarch64)",
    archIntel: "Intel (x86_64)",
    archArm64: "ARM64 (aarch64)",
    archX64: "x64 (x86_64)",
    otherFormatsLabel: "다른 형식",
    matchedCommandHeading: "빠른 설치 명령",
    showAllOptions: "다른 플랫폼·아키텍처 및 전체 버전 보기",
    hideAllOptions: "다른 플랫폼 및 전체 버전 접기",
    otherPlatformsHint: "macOS · Linux · Windows · CLI · SHA256SUMS · Sigstore",
    latestTagLabel: "릴리스",
    publishedLabel: "배포일",
    quickInstallHeading: "원라인 빠른 설치",
    packageManagersHeading: "패키지 매니저",
    directArtifactsHeading: "설치 파일 및 체크섬",
    archLabel: "아키텍처",
    formatLabel: "형식",
    sizeLabel: "크기",
    checksumLabel: "검증",
    downloadBtn: "다운로드",
    copyBtn: "복사",
    copiedBtn: "복사됨",
    verifyHeading: "다운로드 및 출처 증명 확인",
    verifySubtitle: "GitHub Releases의 모든 빌드에는 SHA256SUMS 및 Sigstore 증명이 포함됩니다.",
    platformNotesHeading: "플랫폼별 초기 설정 안내",
    macosNoteTitle: "macOS · Gatekeeper 및 전체 디스크 접근 권한",
    macosNoteBody:
      "미서명 빌드 경고가 뜨면 `xattr -dr com.apple.quarantine /Applications/ruum.app`을 실행하세요. 휴지통과 보호된 컨테이너를 스캔하려면 시스템 설정 › 개인정보 보호 및 보안에서 Ruum에 전체 디스크 접근 권한을 허용하세요.",
    windowsNoteTitle: "Windows · NTFS MFT 고속 스캔",
    windowsNoteBody:
      "C:\\ 같은 전체 NTFS 드라이브를 분석할 때 Ruum을 관리자 권한으로 실행하면 Master File Table(MFT)을 직접 읽어 탐색 속도가 수 배 빨라집니다.",
    linuxNoteTitle: "Linux · Wayland / X11 및 Hyprland",
    linuxNoteBody:
      "데스크톱 GUI는 Vulkan 지원 GPU가 있는 Wayland 또는 X11 세션이 필요합니다(헤드리스 서버는 `--cli-only` / `ruum ssh --check` 사용). Hyprland에서는 `windowrule = float, class:^(ruum)$` 설정을 권장합니다.",
    allReleasesLink: "GitHub에서 모든 릴리스 보기",
  },
  changelogPage: {
    eyebrow: "릴리스 히스토리",
    title: "변경 로그",
    subtitle: "모든 릴리스의 새로운 기능, 수정 및 안정성 개선 기록.",
    filterAll: "전체",
    filterStable: "Stable",
    filterBeta: "Beta",
    stableBadge: "Stable",
    betaBadge: "Beta",
    featuresLabel: "새 기능",
    fixesLabel: "버그 수정",
    improvementsLabel: "개선 사항",
    viewOnGithub: "GitHub 릴리스 보기",
  },
  footer: {
    logoAlt: "Ruum 마크",
    etymologyTitle: '왜 "Ruum"인가요?',
    etymologyBody:
      "고대 노르드어로 넓고 탁 트인 여유 공간(rúm)을 뜻하는 단어에서 유래했습니다. 쌓인 빌드 산출물과 오래된 캐시를 비워 드라이브에 숨 쉴 공간을 되돌려줍니다.",
    license: "GPL-3.0-only · JsonLee12138 오픈소스 프로젝트",
    groups: {
      product: "제품",
      community: "오픈소스",
      contact: "연락처",
    },
    links: {
      github: "GitHub",
      releases: "Releases",
      issues: "Issues",
      download: "다운로드",
      changelog: "변경 로그",
      support: "후원",
      email: "이메일 (lijunsong2@gmail.com)",
      discord: "Discord 커뮤니티",
    },
  },
};
