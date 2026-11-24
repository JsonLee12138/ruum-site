export type Locale = "en" | "zh" | "ja" | "ko";

export interface TourStepCopy {
  title: string;
  description: string;
}

export interface SafetyItemCopy {
  code: string;
  title: string;
  detail: string;
}

export interface PillarCardCopy {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
}

export interface SiteCopy {
  locale: Locale;
  localeLabel: string;
  htmlLang: string;
  meta: {
    homeTitle: string;
    homeDescription: string;
    downloadTitle: string;
    downloadDescription: string;
    changelogTitle: string;
    changelogDescription: string;
  };
  nav: {
    home: string;
    capabilities: string;
    safety: string;
    download: string;
    changelog: string;
    support: string;
    installCta: string;
    themeToDark: string;
    themeToLight: string;
    menu: string;
  };
  hero: {
    eyebrowPrefix: string;
    eyebrowTech: string;
    headlineLine1: string;
    headlineLine2: string;
    subcopy: string;
    primaryCta: string;
    secondaryCta: string;
    tourCta: string;
    tourHint: string;
  };
  installBar: {
    tabs: {
      unix: string;
      homebrew: string;
      windows: string;
      cli: string;
    };
    detectedTag: string;
    copy: string;
    copied: string;
    allPackages: string;
    verifiedNote: string;
  };
  sandbox: {
    windowTitle: string;
    demoModeLabel: string;
    screenshotModeLabel: string;
    demoDisclaimer: string;
    screenshotCaption: string;
    tourButton: string;
    rescanButton: string;
    resetButton: string;
    rails: {
      explore: string;
      docker: string;
      watchdog: string;
      ssh: string;
    };
    explore: {
      breadcrumbRoot: string;
      summaryItems: string;
      modeSize: string;
      modeAge: string;
      hatchLegend: string;
      selectionHeading: string;
      ofScan: string;
      filesLabel: string;
      lastWriteLabel: string;
      kindLabel: string;
      gitLabel: string;
      markBtn: string;
      unmarkBtn: string;
      worthLooking: string;
      diskHeading: string;
      freeSuffix: string;
      projectedSuffix: string;
      reviewBtnPrefix: string;
      reviewBtnMid: string;
      reviewTitle: string;
      reviewTrashBtn: string;
      reviewExportBtn: string;
      reviewDoneBadge: string;
      reviewDoneText: string;
      reclaimableBadge: string;
      protectedBadge: string;
      ageWeek: string;
      ageOlder: string;
    };
    docker: {
      title: string;
      hostLocal: string;
      hostSsh: string;
      overviewTitle: string;
      safeReclaimable: string;
      cards: {
        images: string;
        containers: string;
        buildCache: string;
        localVolumes: string;
      };
      protectedBadge: string;
      protectedNote: string;
      sharedNotePrefix: string;
      candidatesTitle: string;
      cleanBtn: string;
      cleanedNotice: string;
    };
    watchdog: {
      title: string;
      statusHealthy: string;
      statusLow: string;
      daemonLabel: string;
      thresholdLabel: string;
      runAnalysisBtn: string;
      analyzingLabel: string;
      proposalTitle: string;
      proposalBadge: string;
      gitWarning: string;
      confirmBtn: string;
      confirmedNotice: string;
      mcpTraceTab: string;
      proposalTab: string;
      mcpTraceNote: string;
    };
    ssh: {
      title: string;
      banner: string;
      readOnlyTag: string;
      targetsHeading: string;
      scriptHeading: string;
      copyScript: string;
      copiedScript: string;
      previewNotice: string;
    };
    tour: {
      nextBtn: string;
      prevBtn: string;
      doneBtn: string;
      progressText: string;
      steps: {
        install: TourStepCopy;
        explore: TourStepCopy;
        docker: TourStepCopy;
        ssh: TourStepCopy;
        watchdog: TourStepCopy;
      };
    };
  };
  capabilities: {
    sectionEyebrow: string;
    sectionTitle: string;
    sectionSubtitle: string;
    aiMcp: PillarCardCopy & {
      modeStandard: string;
      modeReadOnly: string;
      copyJson: string;
      copiedJson: string;
      toolsHeading: string;
      toolCol: string;
      scopeCol: string;
      guardCol: string;
    };
    ssh: PillarCardCopy & {
      pipelineSteps: { step: string; title: string; detail: string }[];
      cmdLabel: string;
    };
    docker: PillarCardCopy & {
      cardLabels: { name: string; status: string; badge: string }[];
    };
    visual: PillarCardCopy & {
      legendTitle: string;
      hatchCaption: string;
      categories: string[];
    };
  };
  safety: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: SafetyItemCopy[];
  };
  installBand: {
    eyebrow: string;
    title: string;
    subtitle: string;
    downloadPageBtn: string;
    changelogBtn: string;
  };
  support: {
    eyebrow: string;
    title: string;
    description: string;
    kofiCta: string;
    kofiNote: string;
    wechatTrigger: string;
    wechatModalTitle: string;
    wechatHint: string;
    wechatAlt: string;
    closeLabel: string;
  };
  downloadPage: {
    eyebrow: string;
    title: string;
    subtitle: string;
    channelStable: string;
    channelBeta: string;
    recommendedForPrefix: string;
    archAppleSilicon: string;
    archIntel: string;
    archArm64: string;
    archX64: string;
    otherFormatsLabel: string;
    matchedCommandHeading: string;
    showAllOptions: string;
    hideAllOptions: string;
    otherPlatformsHint: string;
    latestTagLabel: string;
    publishedLabel: string;
    quickInstallHeading: string;
    packageManagersHeading: string;
    directArtifactsHeading: string;
    archLabel: string;
    formatLabel: string;
    sizeLabel: string;
    checksumLabel: string;
    downloadBtn: string;
    copyBtn: string;
    copiedBtn: string;
    verifyHeading: string;
    verifySubtitle: string;
    platformNotesHeading: string;
    macosNoteTitle: string;
    macosNoteBody: string;
    windowsNoteTitle: string;
    windowsNoteBody: string;
    linuxNoteTitle: string;
    linuxNoteBody: string;
    allReleasesLink: string;
  };
  changelogPage: {
    eyebrow: string;
    title: string;
    subtitle: string;
    filterAll: string;
    filterStable: string;
    filterBeta: string;
    stableBadge: string;
    betaBadge: string;
    featuresLabel: string;
    fixesLabel: string;
    improvementsLabel: string;
    viewOnGithub: string;
  };
  footer: {
    etymologyTitle: string;
    etymologyBody: string;
    license: string;
    groups: {
      product: string;
      community: string;
    };
    links: {
      github: string;
      releases: string;
      issues: string;
      download: string;
      changelog: string;
      support: string;
    };
  };
}
