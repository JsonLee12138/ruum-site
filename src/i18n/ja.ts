import type { SiteCopy } from "./types";

export const ja: SiteCopy = {
  locale: "ja",
  localeLabel: "日本語",
  htmlLang: "ja",
  meta: {
    homeTitle:
      "Ruum — 無料オープンソースのディスク容量解析・AI ディスク整理ツール (Mac / Windows / Linux)",
    homeDescription:
      "Ruum は macOS、Windows（NTFS MFT 高速解析）、Linux 対応の無料オープンソース・ディスク容量解析 & AI ディスク整理ツール。大容量ファイル、開発キャッシュ、Docker、SSH サーバーを可視化し、MCP 連携で安全に空き容量を確保します。",
    downloadTitle: "Ruum をダウンロード — macOS / Windows / Linux 対応無料ディスク容量解析ツール",
    downloadDescription:
      "SHA-256 チェックサムと Sigstore 来歴証明付きの Ruum デスクトップ版インストーラーとヘッドレス CLI（macOS Apple Silicon・Intel / Windows / Linux）を無料ダウンロード。",
    changelogTitle: "Ruum 変更履歴 — ディスク容量解析・AI ディスク整理ツールのリリース記録",
    changelogDescription:
      "macOS・Windows・Linux 向けディスク容量解析・AI 整理ツール Ruum の公式リリース履歴と新機能アップデート。",
    keywords:
      "Ruum, ruum, ディスク容量解析, ディスク整理, 空き容量 増やす, AI ディスク整理, 大容量ファイル 検索, Mac ディスク容量, Windows ディスク解析, NTFS MFT, Linux ディスク使用量, Docker 容量整理, SSH ディスク解析, MCP ディスクツール, node_modules 削除, オープンソース, 無料",
    ogImageAlt:
      "Ruum — macOS・Windows・Linux 対応の無料オープンソース・ディスク容量解析 & AI ディスク整理ツール",
    applicationSubCategory: "ディスク容量解析・AI ディスク整理ツール",
    alternateNames: ["ruum", "Ruum ディスク容量解析", "Ruum AI ディスク整理"],
    featureList: [
      "macOS、Windows（管理者 NTFS MFT 直接読み取り）、Linux 対応のツリーマップ容量解析",
      "O(1) AI ウォッチドッグ常駐と 8 ツール対応 stdio MCP サーバー（人間承認ゲート付き）",
      "ローカルボリュームを読み取り専用ロックで完全保護する Docker 容量エクスプローラー",
      "ハッシュ検証済み静的 musl スキャナーによる sudo 不要のリモート SSH 診断",
      "node_modules、Xcode、Cargo ビルドキャッシュなど開発用キャッシュを斜線で即座に特定",
      "ゴミ箱移動を標準とし OS・マウント保護とフックレス Git 検査を行う Rust 安全ガード",
    ],
  },
  nav: {
    home: "ホーム",
    capabilities: "主な機能",
    safety: "安全設計",
    download: "ダウンロード",
    changelog: "変更履歴",
    support: "支援",
    installCta: "インストール",
    themeToDark: "ダークテーマ（Obsidian）へ切替",
    themeToLight: "ライトテーマ（Warm Paper）へ切替",
    menu: "メニュー",
    logoAlt: "Ruum ロゴ",
  },
  hero: {
    eyebrowPrefix: "Rust + GPUI",
    eyebrowTech: "macOS · Linux · Windows · GPL-3.0",
    headlineLine1: "すべてのドライブに、",
    headlineLine2: "確かな余白を。",
    subcopy:
      "Ruum は macOS・Windows・Linux 対応の無料オープンソース・ディスク容量解析 & AI ディスク整理ツールです。大容量ファイル、開発キャッシュ、Docker、SSH サーバーを高速ツリーマップで可視化し、確認後にのみ安全に整理します。",
    primaryCta: "Ruum をダウンロード",
    secondaryCta: "GitHub で見る",
    tourCta: "クイックスタート",
    tourHint:
      "インタラクティブ体験と実機スクリーンショットを切り替え可能 — クイックスタートで 5 ステップ案内",
  },
  installBar: {
    tabs: {
      unix: "macOS / Linux",
      homebrew: "Homebrew",
      windows: "Windows",
      cli: "サーバー CLI",
    },
    detectedTag: "推奨環境",
    copy: "コピー",
    copied: "コピー済み",
    allPackages: "全インストーラー・SHA-256",
    verifiedNote: "Ed25519 + SHA-256 検証済み",
  },
  sandbox: {
    windowTitle: "Ruum",
    demoModeLabel: "Web デモ",
    screenshotModeLabel: "実機スクリーンショット",
    demoDisclaimer: "模擬データ",
    screenshotCaption:
      "macOS デスクトップアプリの実機スクリーンショットです。Web デモへ戻すと操作を試せます。",
    screenshotAlt: "Ruum macOS ネイティブデスクトップ版ディスク容量解析の実機スクリーンショット",
    tourButton: "クイックスタート",
    rescanButton: "再スキャン",
    resetButton: "リセット",
    rails: {
      explore: "探索",
      docker: "Docker",
      watchdog: "Watchdog",
      ssh: "リモート",
    },
    explore: {
      breadcrumbRoot: "Ruum / Users / dev",
      summaryItems: "263 GiB · 4,184,346 ファイル · 63.0 秒",
      modeSize: "サイズ",
      modeAge: "更新時期",
      hatchLegend: "斜線 = 解放可能",
      selectionHeading: "選択中の項目",
      ofScan: "占有率",
      filesLabel: "ファイル数",
      lastWriteLabel: "最終更新",
      kindLabel: "分類",
      gitLabel: "Git 保護",
      markBtn: "削除候補にマーク",
      unmarkBtn: "マーク解除",
      worthLooking: "要チェック候補",
      diskHeading: "ディスク · /dev/disk3s5",
      freeSuffix: "GiB 空き",
      projectedSuffix: "GiB 整理後の予測",
      reviewBtnPrefix: "確認",
      reviewBtnMid: "件 · 解放予定",
      reviewTitle: "非破壊レビュー",
      reviewTrashBtn: "ゴミ箱へ移動",
      reviewExportBtn: "プロンプトをコピー",
      reviewDoneBadge: "検証完了",
      reviewDoneText: "ゴミ箱へ移動し、再スキャンで実空き容量を更新しました。",
      reclaimableBadge: "再生成可能",
      protectedBadge: "ソースコード",
      ageWeek: "今週",
      ageOlder: "古い",
    },
    docker: {
      title: "Docker 容量エクスプローラー",
      hostLocal: "このコンピューター · OrbStack",
      hostSsh: "SSH · prod-eu-01 · dockerd",
      overviewTitle: "ディスク使用量概要",
      safeReclaimable: "安全に解放可能",
      cards: {
        images: "イメージ (Images)",
        containers: "コンテナ (Containers)",
        buildCache: "ビルドキャッシュ",
        localVolumes: "ローカルボリューム",
      },
      protectedBadge: "保護済み · 読み取り専用",
      protectedNote:
        "DB 等の永続ボリュームは読み取り専用にロックされ、Ruum によって自動削除されません。",
      sharedNotePrefix: "イメージと共有",
      candidatesTitle: "安全な整理候補",
      cleanBtn: "選択項目を整理",
      cleanedNotice:
        "選択したキャッシュ・未使用イメージを削除しました。ボリュームは保護されています。",
    },
    watchdog: {
      title: "容量ウォッチドッグ & AI アシスタント",
      statusHealthy: "O(1) statvfs · 走査負荷ゼロ",
      statusLow: "AI 整理提案の準備完了",
      daemonLabel: "常駐: launchd / systemd / Run",
      thresholdLabel: "閾値 < 20 GiB",
      runAnalysisBtn: "AI 分析を今すぐ実行",
      analyzingLabel: "キャッシュと古い Git worktree を評価中…",
      proposalTitle: "削除確認ダイアログ（人の確認が必須）",
      proposalBadge: "無断削除なし",
      gitWarning: "Git: 古い worktree ×2 · 16 日間未更新",
      confirmBtn: "承認して整理",
      confirmedNotice: "承認された候補を安全にゴミ箱へ移動しました。",
      proposalTab: "AI 整理案",
      mcpTraceTab: "MCP 実行ログ",
      mcpTraceNote: "ヘッドレス stdio JSON-RPC (`ruum mcp --read-only`)",
    },
    ssh: {
      title: "リモート SSH 診断（非破壊）",
      banner: "ruum ssh prod-eu-01 /var",
      readOnlyTag: "読み取り専用 · sudo 不要",
      targetsHeading: "ストリーミング検出された大規模領域",
      scriptHeading: "プレビュー優先スクリプト（HostIdentity 検証付）",
      copyScript: "コピー",
      copiedScript: "コピー済み",
      previewNotice:
        "通常実行は対象を表示するのみ。`--delete` 指定時にホスト名と machine-id を照合します。",
    },
    tour: {
      nextBtn: "次へ",
      prevBtn: "戻る",
      doneBtn: "完了",
      progressText: "{{current}} / {{total}}",
      steps: {
        install: {
          title: "1. ワンコマンドで導入",
          description:
            "お使いの OS タブから SHA-256 検証付きインストーラーをコピーできます（サーバー向けの --cli-only や各 OS パッケージページも利用可能）。",
        },
        explore: {
          title: "2. 色分けツリーマップ + 斜線表示",
          description:
            "色相で種類（コード、Agent 一時領域、ツールチェーン、キャッシュ）を区別し、斜線で解放可能領域を表示。クリックするだけで右側の空き容量予測が即座に更新されます。",
        },
        docker: {
          title: "3. ボリューム保護付き Docker 整理",
          description:
            "ローカルや SSH 先の Docker を同じ画面で可視化。Local Volumes は常に「保護済み・読み取り専用」に固定され、重要なデータ誤削除を防ぎます。",
        },
        ssh: {
          title: "4. sudo 不要の SSH 遠隔分析",
          description:
            "検証済みの静的 musl スキャナーを自動展開して圧縮ストリーム受信。GUI からの直接削除は禁止され、安全なスクリプトのみ出力します。",
        },
        watchdog: {
          title: "5. O(1) AI ウォッチドッグ & MCP",
          description:
            "軽量な statvfs 監視で空き容量低下を検知し、AI が提案を作成。必ず独立ウィンドウで人のチェック承認を待ちます。",
        },
      },
    },
  },
  capabilities: {
    sectionEyebrow: "4 つのコア強み",
    sectionTitle: "AI 時代の開発端末と本番サーバーのために。",
    sectionSubtitle:
      "肥大化したキャッシュ、Docker ビルド層、リモートサーバーのボトルネックを可視化し、Rust の堅牢な安全ガードで保護します。",
    aiMcp: {
      eyebrow: "01 · AI インテリジェンス & MCP",
      title: "O(1) ウォッチドッグ + 8 ツール対応 stdio MCP サーバー。",
      description:
        "バックグラウンド走査ゼロで空き容量を監視し、容量不足時には設定済み AI CLI（Agy / Pi / Codex / Custom）で整理案を作成。AI エージェント向けに 8 つの型付き MCP ツールを提供します。",
      bullets: [
        "OS ネイティブ常駐：launchd (macOS)、systemd --user (Linux)、非 UAC Run (Windows)",
        "AI 提案は常に Git 未コミット警告付きの独立確認ウィンドウで人間が承認",
        "削除系 MCP ツールはデスクトップ承認と Touch ID 等の OS 認証がない限り Fail-closed",
      ],
      modeStandard: "標準（GUI 承認必須）",
      modeReadOnly: "--read-only（読み取り監査）",
      copyJson: "設定をコピー",
      copiedJson: "コピー済み",
      toolsHeading: "公開 MCP ツール一覧",
      toolCol: "ツール名",
      scopeCol: "対象",
      guardCol: "安全境界",
    },
    ssh: {
      eyebrow: "02 · リモート SSH 解析",
      title: "sudo 不要の静的 musl スキャナー自動展開。",
      description:
        "SSH ホストエイリアスを指定するだけ。ハッシュ検証済みの静的 musl バイナリを ~/.cache/ruum/ssh/ へ展開し、リモート側のメモリにツリーを溜めず圧縮ストリームで描画します。",
      bullets: [
        "ネストされたマウント境界で停止し、切断時は即座にクリーン終了",
        "リモート GUI セッションはエクスポート専用で誤操作による削除を完全遮断",
        "出力スクリプトは実ホストの hostname と machine-id を照合してから実行",
      ],
      cmdLabel: "ターミナルから 1 コマンドで接続",
      pipelineSteps: [
        {
          step: "01",
          title: "環境判定・展開",
          detail: "アーキテクチャを判別し静的 musl スキャナーをユーザーキャッシュへ配置",
        },
        {
          step: "02",
          title: "圧縮ストリーミング",
          detail: "単一 SSH パイプでレコード送信。サーバー側メモリを圧迫しません",
        },
        {
          step: "03",
          title: "HostIdentity 照合",
          detail: "hostname と /etc/machine-id の一致検証をパスしたホストのみ処理",
        },
      ],
    },
    docker: {
      eyebrow: "03 · Docker 容量とボリューム保護",
      title: "イメージとビルドキャッシュを安全に整理。ボリュームは完全保護。",
      description:
        "ローカル（Docker Desktop / OrbStack）と SSH 先 dockerd を共通のアダプターで診断し、イメージ共有層と独立して解放可能なキャッシュを正確に分離します。",
      bullets: [
        "4 状態プローブ：未導入 / デーモン停止 / Socket 権限不足 / 利用可能",
        "Build Cache の共有バイト数と実解放バイト数を分離表示",
        "Local Volumes は UI・削除ロジック双方で完全に読み取り専用ロック",
      ],
      cardLabels: [
        { name: "Images", status: "未使用・dangling を個別に選択可能", badge: "解放可能" },
        { name: "Containers", status: "停止済みコンテナを安全に整理", badge: "解放可能" },
        { name: "Build Cache", status: "イメージ共有分を除いた実サイズ表示", badge: "解放可能" },
        {
          name: "Local Volumes",
          status: "永続データ保護のため常にロック",
          badge: "保護済み · 読み取り専用",
        },
      ],
    },
    visual: {
      eyebrow: "04 · GPUI ネイティブ可視化",
      title: "色は「データの種類」、斜線は「安全に消せる領域」。",
      description:
        "Rust + GPUI によるネイティブ描画。Windows では管理者権限時に NTFS MFT を直接読み取り高速化。色と斜線の二軸表現で整理判断を一瞬で下せます。",
      bullets: [
        "メモ化拡大：~ から / へ広げてもスキャン済みサブツリーを再利用",
        "ハードリンクの重複排除により実消費ブロック（st_blocks）を正確に集計",
        "親子フォルダを重複カウントしないリアルタイム空き容量予測メーター",
      ],
      legendTitle: "カテゴリ配色ガイド",
      hatchCaption:
        "45° 斜線 = 再生成可能な node_modules、Xcode / Cargo ビルドキャッシュ、worktree、パッケージストア",
      categories: [
        "コード",
        "Agent 一時",
        "ツールチェーン",
        "コンテナ",
        "同期",
        "Git",
        "メディア",
        "キャッシュ",
        "ドキュメント",
        "その他",
      ],
    },
  },
  safety: {
    eyebrow: "システムレベルの安全境界",
    title: "UI の確認だけでなく、Rust コアで強制する安全保証。",
    subtitle:
      "すべての削除操作はディスクに触れる前にコア層で検証され、境界違反時は自動中断されます。",
    items: [
      {
        code: "GUARD · 01",
        title: "OS 重要領域・マウント拒否",
        detail:
          "ルート、ホーム直下、/usr、/etc、/nix/store、Homebrew、Windows システムフォルダは無条件に拒否します。",
      },
      {
        code: "GUARD · 02",
        title: "Docker ボリューム読み取り専用",
        detail:
          "ローカルボリュームはコアレベルで整理対象から除外され、DB や永続データが誤って消えることはありません。",
      },
      {
        code: "GUARD · 03",
        title: "クラウド実体ダウンロード防止",
        detail:
          "iCloud Drive や Dropbox の未同期ファイルをダウンロードせず走査。Time Machine スナップショットも除外。",
      },
      {
        code: "GUARD · 04",
        title: "フックレス Git 安全性チェック",
        detail:
          "Git hooks や fsmonitor を無効化したまま、未コミット変更・stash・未プッシュ状態を安全に確認。",
      },
      {
        code: "GUARD · 05",
        title: "人間承認 + Touch ID 認証",
        detail:
          "標準はゴミ箱移動。完全削除および書き込み系 MCP はチェックボックス承認と OS ネイティブ認証が必須です。",
      },
      {
        code: "GUARD · 06",
        title: "Ed25519 + SHA-256 + Sigstore",
        detail:
          "全リリースに署名付き manifest、SHA256SUMS、gh attestation verify 対応の来歴証明を添付。",
      },
    ],
  },
  installBand: {
    eyebrow: "15 秒で導入完了",
    title: "開発マシンにもサーバーにも、ゆとりのある空き容量を。",
    subtitle:
      "1 つのバイナリにデスクトップ GUI、SSH スキャナー、Watchdog、stdio MCP サーバーをすべて内蔵。",
    downloadPageBtn: "全インストーラーを見る",
    changelogBtn: "変更履歴を読む",
  },
  support: {
    eyebrow: "OPEN SOURCE · GPL-3.0",
    title: "コーヒーを一杯おごる",
    description:
      "Ruum がディスクの空き容量の確保や調査時間の短縮に役立ちましたら、コーヒーを一杯おごっていただけると励みになります。",
    kofiCta: "Ko-fi でコーヒーを一杯おごる",
    kofiNote: "Ko-fi での単発サポート · Ruum は今後も完全無料・オープンソースです。",
    wechatTrigger: "",
    wechatModalTitle: "",
    wechatHint: "",
    wechatAlt: "",
    closeLabel: "閉じる",
  },
  downloadPage: {
    eyebrow: "配布物と署名検証",
    title: "Ruum をダウンロード",
    subtitle:
      "macOS・Windows・Linux 向けの無料ディスク容量解析・整理インストーラー、各種パッケージ、サーバー用 CLI を SHA-256 と Sigstore 検証付きで提供しています。",
    channelStable: "安定版 (Stable)",
    channelBeta: "ベータ版 (Beta)",
    recommendedForPrefix: "推奨インストーラー ·",
    archAppleSilicon: "Apple Silicon (aarch64)",
    archIntel: "Intel (x86_64)",
    archArm64: "ARM64 (aarch64)",
    archX64: "x64 (x86_64)",
    otherFormatsLabel: "その他の形式",
    matchedCommandHeading: "クイックインストール",
    showAllOptions: "他のプラットフォーム・アーキテクチャ・全バージョンを表示",
    hideAllOptions: "他のプラットフォーム・全バージョンを閉じる",
    otherPlatformsHint: "macOS · Linux · Windows · CLI · SHA256SUMS · Sigstore",
    latestTagLabel: "バージョン",
    publishedLabel: "公開日",
    quickInstallHeading: "ワンラインインストール",
    packageManagersHeading: "パッケージマネージャー",
    directArtifactsHeading: "直接ダウンロード & チェックサム",
    archLabel: "アーキテクチャ",
    formatLabel: "形式",
    sizeLabel: "サイズ",
    checksumLabel: "検証",
    downloadBtn: "ダウンロード",
    copyBtn: "コピー",
    copiedBtn: "コピー済み",
    verifyHeading: "ダウンロードと来歴の検証",
    verifySubtitle: "すべてのリリースには SHA256SUMS と Sigstore アテステーションが含まれます。",
    platformNotesHeading: "プラットフォーム別セットアップ補足",
    macosNoteTitle: "macOS · Gatekeeper とフルディスクアクセス",
    macosNoteBody:
      "未署名ビルドの警告が出る場合は `xattr -dr com.apple.quarantine /Applications/ruum.app` を実行してください。ゴミ箱や保護コンテナの解析には「システム設定 › プライバシーとセキュリティ › フルディスクアクセス」で Ruum を許可してください。",
    windowsNoteTitle: "Windows · NTFS MFT 高速スキャン",
    windowsNoteBody:
      "C:\\ などの NTFS ドライブ全体をスキャンする場合、Ruum を管理者として起動すると Master File Table (MFT) を直接読み取り数倍高速化します。",
    linuxNoteTitle: "Linux · Wayland / X11 & Hyprland",
    linuxNoteBody:
      "GUI 実行には Vulkan 対応 GPU と Wayland / X11 が必要です（ヘッドレス環境は `--cli-only` / `ruum ssh --check` をご利用ください）。Hyprland では `windowrule = float, class:^(ruum)$` を推奨します。",
    allReleasesLink: "GitHub Releases ですべて見る",
  },
  changelogPage: {
    eyebrow: "リリース履歴",
    title: "変更履歴",
    subtitle: "各リリースの新機能、修正、安定性改善の履歴。",
    filterAll: "すべて",
    filterStable: "Stable",
    filterBeta: "Beta",
    stableBadge: "Stable",
    betaBadge: "Beta",
    featuresLabel: "新機能",
    fixesLabel: "修正",
    improvementsLabel: "改善",
    viewOnGithub: "GitHub で詳細を見る",
  },
  footer: {
    logoAlt: "Ruum マーク",
    etymologyTitle: 'なぜ "Ruum" なのか',
    etymologyBody:
      "古ノルド語で「広々とした空間・開放された余白（rúm）」に由来。溜まったビルド成果物やキャッシュを取り除き、ドライブに本来の呼吸空間を取り戻します。",
    license: "GPL-3.0-only · JsonLee12138 によるオープンソース",
    groups: {
      product: "プロダクト",
      community: "オープンソース",
      contact: "お問い合わせ",
    },
    links: {
      github: "GitHub",
      releases: "Releases",
      issues: "Issues",
      download: "ダウンロード",
      changelog: "変更履歴",
      support: "支援",
      email: "メール",
      discord: "Discord コミュニティ",
    },
  },
};
