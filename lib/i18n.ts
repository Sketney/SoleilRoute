export const locales = ["en", "ru", "fr", "de", "es"] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
};

export const defaultLocale: Locale = "en";
export const localeCookie = "tp_locale";

export type Translations = {
  common: {
    languageLabel: string;
    orLabel: string;
    newLabel: string;
    closeLabel: string;
    justNow: string;
  };
  site: {
    description: string;
  };
  navigation: {
    features: string;
    howItWorks: string;
    pricing: string;
    faqs: string;
    signIn: string;
    createAccount: string;
    startPlanning: string;
    exploreFeatures: string;
    home: string;
    dashboard: string;
    trips: string;
    budgetPlanner: string;
    visaChecker: string;
    community: string;
    notifications: string;
    moderation: string;
    admin: string;
    settings: string;
    help: string;
  };
  hero: {
    pill: string;
    title: string;
    description: string;
    highlightOne: string;
    highlightTwo: string;
    trustTitle: string;
    trustBullets: string[];
    noCreditCard: string;
  };
  features: {
    heading: string;
    subheading: string;
    items: { title: string; description: string }[];
  };
  howItWorks: {
    heading: string;
    subheading: string;
    steps: { title: string; body: string }[];
    stepLabel: (step: number) => string;
  };
  pricing: {
    heading: string;
    subheading: string;
    popular: string;
    plans: {
      name: string;
      price: string;
      period?: string;
      description: string;
      features: string[];
      cta: string;
    }[];
  };
  faqs: {
    heading: string;
    subheading: string;
    items: { question: string; answer: string }[];
  };
  footer: {
    product: string;
    resources: string;
    company: string;
    links: {
      features: string;
      pricing: string;
      releaseNotes: string;
      documentation: string;
      support: string;
      blog: string;
      about: string;
      careers: string;
      contact: string;
    };
    legal: {
      privacy: string;
      terms: string;
      status: string;
      rights: string;
    };
  };
  auth: {
    login: {
      title: string;
      subtitle: string;
      googleButton: string;
      divider: string;
      noAccount: string;
      createAccount: string;
      submit: string;
      submitting: string;
      emailLabel: string;
      passwordLabel: string;
      placeholderEmail: string;
      placeholderPassword: string;
      toast: {
        errorTitle: string;
        errorDescription: string;
        successTitle: string;
        successDescription: string;
      };
      validation: {
        email: string;
        password: string;
      };
    };
    register: {
      title: string;
      subtitle: string;
      googleButton: string;
      divider: string;
      haveAccount: string;
      signIn: string;
      submit: string;
      submitting: string;
      emailLabel: string;
      passwordLabel: string;
      confirmLabel: string;
      placeholderEmail: string;
      placeholderPassword: string;
      placeholderConfirm: string;
      toast: {
        errorTitle: string;
        errorDescription: string;
      };
      validation: {
        email: string;
        password: string;
        confirm: string;
      };
    };
  };
  dashboard: {
    headerTitle: string;
    headerSubtitle: string;
    signedInAs: string;
    accountSettings: string;
    themeLight: string;
    themeDark: string;
    help: string;
    signOut: string;
    home: string;
    workspaceTitle: string;
    needHelp: string;
  };
  settings: {
    title: string;
    subtitle: string;
    profileTitle: string;
    passwordTitle: string;
    sessionsTitle: string;
  };
  profileForm: {
    emailLabel: string;
    displayNameLabel: string;
    avatarLabel: string;
    avatarAlt: string;
    avatarPlaceholder: string;
    save: string;
    saving: string;
    toastErrorTitle: string;
    toastErrorDescription: string;
    toastSuccessTitle: string;
    toastSuccessDescription: string;
    validationEmail: string;
    validationDisplayName: string;
  };
  passwordForm: {
    currentLabel: string;
    newLabel: string;
    confirmLabel: string;
    save: string;
    saving: string;
    toastErrorTitle: string;
    toastErrorDescription: string;
    toastSuccessTitle: string;
    toastSuccessDescription: string;
    validationCurrent: string;
    validationNew: string;
    validationConfirm: string;
  };
  sessionsForm: {
    activeLabel: string;
    revoke: string;
    revoking: string;
    toastErrorTitle: string;
    toastErrorDescription: string;
    toastSuccessTitle: string;
    toastSuccessDescription: string;
  };
  notifications: {
    menuTitle: string;
    markAllRead: string;
    loading: string;
    empty: string;
    viewAll: string;
    viewDetails: string;
    newBadge: string;
    historyTitle: string;
    historySubtitle: string;
    pendingInvitationsTitle: string;
    pendingInvitationsSubtitle: string;
    preferencesTitle: string;
    searchPlaceholder: string;
    statusPlaceholder: string;
    statusAll: string;
    statusUnread: string;
    statusRead: string;
    typePlaceholder: string;
    typeAll: string;
    typeSuccess: string;
    typeWarning: string;
    typeInfo: string;
    refresh: string;
    refreshing: string;
    noMatches: string;
    markRead: string;
    invitationEmpty: string;
    invitationRoleEditor: string;
    invitationRoleViewer: string;
    invitationDecline: string;
    invitationAccept: string;
    tripFallback: string;
    unknownDestination: string;
    invitedByFallback: string;
    invitedBy: (name: string, date: string) => string;
  };
  community: {
    title: string;
    subtitle: string;
    createTitle: string;
    createSubtitle: string;
    fields: {
      tag: string;
      text: string;
      mapUrl: string;
      image: string;
    };
    placeholders: {
      tag: string;
      text: string;
      mapUrl: string;
    };
    tabs: {
      feed: string;
      mine: string;
      saved: string;
    };
    tags: {
      place: string;
      map_point: string;
      landmark: string;
      other: string;
    };
    status: {
      pending: string;
      approved: string;
      rejected: string;
    };
    publish: string;
    posting: string;
    refresh: string;
    loading: string;
    emptyFeed: string;
    emptyMine: string;
    emptySaved: string;
    viewMap: string;
    rejectionReason: string;
    mediaHint: string;
    mediaImageHint: string;
    mediaMapHint: string;
    detailsTitle: string;
    noMap: string;
    unknownAuthor: string;
    profile: {
      title: string;
      subtitle: string;
      postsTitle: string;
      postsEmpty: string;
    };
    toastSubmittedTitle: string;
    toastSubmittedDescription: string;
    toastErrorTitle: string;
    toastErrorDescription: string;
    comments: {
      title: string;
      placeholder: string;
      reply: string;
      submit: string;
      submitting: string;
      empty: string;
      loading: string;
      toastSuccessTitle: string;
      toastSuccessDescription: string;
      toastErrorTitle: string;
      toastErrorDescription: string;
    };
    actions: {
      edit: string;
      delete: string;
      like: string;
      savePost: string;
      save: string;
      cancel: string;
      saving: string;
      confirmDelete: string;
      toastUpdatedTitle: string;
      toastUpdatedDescription: string;
      toastDeletedTitle: string;
      toastDeletedDescription: string;
    };
    validation: {
      tagRequiredTitle: string;
      tagRequiredDescription: string;
      textRequiredTitle: string;
      textRequiredDescription: string;
      textProhibitedTitle: string;
      textProhibitedDescription: string;
      mediaRequiredTitle: string;
      mediaRequiredDescription: string;
      mapInvalidTitle: string;
      mapInvalidDescription: string;
      imageSizeTitle: string;
      imageSizeDescription: string;
    };
  };
  moderation: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    approve: string;
    reject: string;
    reasonPlaceholder: string;
    toastApprovedTitle: string;
    toastApprovedDescription: string;
    toastRejectedTitle: string;
    toastRejectedDescription: string;
    toastErrorTitle: string;
    toastErrorDescription: string;
  };
  admin: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    refresh: string;
    searchPlaceholder: string;
    adminLabel: string;
    moderatorLabel: string;
    toastUpdatedTitle: string;
    toastUpdatedDescription: string;
    toastErrorTitle: string;
    toastErrorDescription: string;
  };
  onboarding: {
    stepLabel: (current: number, total: number) => string;
    next: string;
    back: string;
    done: string;
    skip: string;
    loadingHint: string;
    steps: {
      welcome: { title: string; body: string };
      planTrip: { title: string; body: string };
      trips: { title: string; body: string };
      budget: { title: string; body: string };
      visa: { title: string; body: string };
      notifications: { title: string; body: string };
      settings: { title: string; body: string };
    };
  };
  help: {
    title: string;
    subtitle: string;
    quickHelpTitle: string;
    quickHelpBody: string;
    accountSettingsCta: string;
    contactSupportTitle: string;
    contactSupportBody: string;
    systemStatusTitle: string;
    systemStatusBody: string;
    statusButton: string;
    faqTitle: string;
    faqs: { question: string; answer: string }[];
  };
  supportDialog: {
    triggerButton: string;
    title: string;
    description: string;
    emailLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    cancel: string;
    send: string;
    sending: string;
    toastErrorTitle: string;
    toastErrorDescription: string;
    toastSuccessTitle: string;
    toastSuccessDescription: string;
    validationEmail: string;
    validationSubject: string;
    validationMessage: string;
  };
  notificationPreferences: {
    emailTitle: string;
    emailBody: string;
    inAppTitle: string;
    inAppBody: string;
    save: string;
    saving: string;
    toastSuccessTitle: string;
    toastSuccessDescription: string;
    toastErrorTitle: string;
    toastErrorDescription: string;
  };
  dashboardOverview: {
    stats: {
      totalBudgetLabel: string;
      totalBudgetHelper: string;
      activeTripsLabel: string;
      activeTripsHelper: string;
      paidInvoicesLabel: string;
      paidInvoicesHelper: string;
      outstandingLabel: string;
      outstandingHelper: string;
      upcomingTripsLabel: string;
      upcomingTripsHelper: string;
      overBudgetLabel: string;
      overBudgetHelper: string;
    };
  };
  quickActions: {
    title: string;
    dialogTitle: string;
    dialogDescription: string;
    actions: {
      planTripTitle: string;
      planTripDescription: string;
      reviewBudgetsTitle: string;
      reviewBudgetsDescription: string;
      checkVisaTitle: string;
      checkVisaDescription: string;
    };
  };
  tripForm: {
    submitDefault: string;
    submitting: string;
    createSuccessTitle: string;
    createSuccessDescription: string;
    createErrorTitle: string;
    createErrorDescription: string;
    fields: {
      nameLabel: string;
      citizenshipLabel: string;
      destinationCountryLabel: string;
      destinationCityLabel: string;
      startDateLabel: string;
      endDateLabel: string;
      totalBudgetLabel: string;
      travelStyleLabel: string;
      currencyLabel: string;
      baseCurrencyLabel: string;
      notesLabel: string;
    };
    placeholders: {
      name: string;
      destinationCountry: string;
      destinationCity: string;
      notes: string;
      selectCitizenship: string;
      searchCountries: string;
      currency: string;
      baseCurrency: string;
      travelStyle: string;
    };
    autoSplitMessage: (count: number, categories: string) => string;
    validation: {
      nameMin: string;
      destinationCountryRequired: string;
      destinationCityRequired: string;
      startDateInvalid: string;
      startDateRequired: string;
      endDateInvalid: string;
      endDateRequired: string;
      totalBudgetInvalid: string;
      totalBudgetPositive: string;
      currencyLength: string;
      citizenshipRequired: string;
      baseCurrencyLength: string;
      travelStyleRequired: string;
      endDateAfterStart: string;
    };
  };
  tripDetailsEditor: {
    trigger: string;
    title: string;
    description: string;
    cancel: string;
    save: string;
    saving: string;
    toastSuccessTitle: string;
    toastSuccessDescription: string;
    toastErrorTitle: string;
    toastErrorDescription: string;
  };
  tripList: {
    emptyTitle: string;
    emptyDescription: string;
    openTrip: string;
    manageBudget: string;
    visaChecklist: string;
    deleteTrip: string;
    deleting: string;
    confirmDelete: string;
    sharedLabel: (role: string) => string;
    budgetProgressLabel: string;
    budgetProgressSummary: (percent: number) => string;
    toastDeleteTitle: string;
    toastDeleteDescription: string;
    toastDeleteErrorTitle: string;
    toastDeleteErrorDescription: string;
  };
  tripsView: {
    pageDescription: string;
    searchPlaceholder: string;
    statusPlaceholder: string;
    statusAll: string;
    sortPlaceholder: string;
    sortOptions: {
      upcoming: string;
      latest: string;
      ending: string;
      name: string;
      visa_status: string;
      budget_high: string;
      budget_low: string;
    };
    resetFilters: string;
  };
  tripOverview: {
    backToTrips: string;
    sharedEditor: string;
    sharedViewer: string;
    detailsTitle: string;
    detailLabels: {
      dates: string;
      destination: string;
      citizenship: string;
      totalBudget: string;
      spentPaid: string;
      visaStatus: string;
      baseCurrency: string;
    };
    notesTitle: string;
    notesEmpty: string;
    ownerFallback: string;
    collaboratorUnknown: string;
  };
  tripBudgetPage: {
    backToOverview: string;
    title: string;
  };
  tripBudget: {
    progressTitle: string;
    paidSoFar: string;
    progressSummary: (percent: number, planned: string) => string;
  };
  budget: {
    categories: {
      transport: string;
      accommodation: string;
      food: string;
      activities: string;
      visa: string;
      other: string;
    };
  };
  budgetChart: {
    title: string;
    description: string;
    plannedLabel: string;
    paidLabel: string;
  };
  budgetItems: {
    title: string;
    summaryPlanned: string;
    summaryPaid: string;
    summaryRemaining: string;
    summaryOverBudget: string;
    summaryOutstanding: string;
    noItems: string;
    categoryLabel: string;
    descriptionLabel: string;
    amountLabel: string;
    paidLabel: string;
    savedLabel: string;
    remove: string;
    saveChanges: string;
    saving: string;
    addTitle: string;
    addButton: string;
    adding: string;
    newDescriptionPlaceholder: string;
    editDescriptionPlaceholder: string;
    viewOnly: string;
    confirmDelete: string;
    toastInvalidAmountTitle: string;
    toastInvalidAmountDescription: string;
    toastSaveTitle: string;
    toastSaveDescription: string;
    toastSaveErrorTitle: string;
    toastSaveErrorDescription: string;
    toastToggleErrorTitle: string;
    toastToggleErrorDescription: string;
    toastAddTitle: string;
    toastAddDescription: string;
    toastAddErrorTitle: string;
    toastAddErrorDescription: string;
    toastDeleteTitle: string;
    toastDeleteDescription: string;
    toastDeleteErrorTitle: string;
    toastDeleteErrorDescription: string;
  };
  budgetCaps: {
    title: string;
    description: string;
    plannedLabel: string;
    capLabel: string;
    noCap: string;
    overBy: string;
    capInputLabel: string;
    saveCaps: string;
    saving: string;
    viewOnly: string;
    toastSuccessTitle: string;
    toastSuccessDescription: string;
    toastErrorTitle: string;
    toastErrorDescription: string;
  };
  budgetPlanner: {
    title: string;
    description: string;
    destinationLabel: string;
    destinationPlaceholder: string;
    destinationSearchPlaceholder: string;
    travelStyleLabel: string;
    travelStylePlaceholder: string;
    tripLengthLabel: string;
    travelersLabel: string;
    dailyEstimateTitle: string;
    dailyEstimateNote: (currency: string) => string;
    totalEstimateTitle: string;
    totalEstimateNote: (days: number, travelers: number) => string;
    categorySplitTitle: string;
    highlightsTitle: string;
    notesTitle: string;
    notesFallback: string;
    estimatesFootnote: string;
    tierTitle: string;
    tierDescription: string;
    tierSelected: string;
    tierPerDay: string;
    tierPerTrip: string;
    tierBadgesTitle: string;
    tiers: {
      budget: { label: string; description: string };
      mid: { label: string; description: string };
      luxury: { label: string; description: string };
    };
    noMatches: string;
  };
  visa: {
    statuses: {
      unknown: string;
      required: string;
      in_progress: string;
      approved: string;
      not_required: string;
    };
  };
  visaChecker: {
    title: string;
    description: string;
    citizenshipLabel: string;
    destinationLabel: string;
    citizenshipSearchPlaceholder: string;
    destinationSearchPlaceholder: string;
    destinationPlaceholder: string;
    noMatches: string;
    noDestinations: string;
    checkButton: string;
    checking: string;
    addToTrip: string;
    createTripTitle: string;
    createTripDescription: string;
    tripName: (destination: string) => string;
    toastMissingTitle: string;
    toastMissingDescription: string;
    toastErrorTitle: string;
    toastErrorDescription: string;
    resultsNote: string;
    emptyState: string;
    resultStatusRequired: string;
    resultStatusFree: string;
    badgeRequired: string;
    badgeNotRequired: string;
    detailVisaType: string;
    detailValidity: string;
    detailProcessing: string;
    detailCost: string;
    noFee: string;
    viewEmbassy: string;
    lastCheckedLabel: string;
    sourceLabel: string;
    insightsTitle: string;
    insightsCurrency: string;
    insightsLanguages: string;
    insightsTimezones: string;
    insightsCallingCodes: string;
    insightsCapital: string;
  };
  visaStatusEditor: {
    currentStatusLabel: string;
    selectPlaceholder: string;
    lastCheckedLabel: string;
    noChecks: string;
    toastSuccessTitle: string;
    toastSuccessDescription: string;
    toastErrorTitle: string;
    toastErrorDescription: string;
  };
  tripVisaPage: {
    backToOverview: string;
    title: string;
    subtitle: (citizenship: string, destination: string) => string;
    requirementsTitle: string;
    visaRequired: string;
    visaNotRequired: string;
    detailValidity: string;
    detailProcessing: string;
    detailCost: string;
    detailEmbassy: string;
    embassyLink: string;
    noFee: string;
    noCache: string;
  };
  timeline: {
    title: string;
    description: string;
    empty: string;
    fieldTitle: string;
    fieldDueDate: string;
    fieldType: string;
    fieldAmount: string;
    fieldNotes: string;
    typeMilestone: string;
    typePayment: string;
    statusCompleted: string;
    statusPending: string;
    notesPlaceholder: string;
    itemSaved: string;
    remove: string;
    saveChanges: string;
    saving: string;
    addTitle: string;
    addButton: string;
    adding: string;
    newTitlePlaceholder: string;
    newNotesPlaceholder: string;
    optionalAmount: string;
    viewOnly: string;
    confirmDelete: string;
    toastMissingDetailsTitle: string;
    toastMissingDetailsDescription: string;
    toastInvalidAmountTitle: string;
    toastInvalidAmountDescription: string;
    toastUpdateTitle: string;
    toastUpdateDescription: string;
    toastUpdateErrorTitle: string;
    toastUpdateErrorDescription: string;
    toastAddTitle: string;
    toastAddDescription: string;
    toastAddErrorTitle: string;
    toastAddErrorDescription: string;
    toastDeleteTitle: string;
    toastDeleteDescription: string;
    toastDeleteErrorTitle: string;
    toastDeleteErrorDescription: string;
    toastStatusErrorTitle: string;
    toastStatusErrorDescription: string;
    dueNoDate: string;
    dueOverdue: (days: number) => string;
    dueIn: (days: number) => string;
  };
  collaborators: {
    title: string;
    description: string;
    youLabel: string;
    addedLabel: (date: string) => string;
    ownerLabel: string;
    roleEditor: string;
    roleViewer: string;
    remove: string;
    pendingTitle: string;
    pendingInvite: (role: string, date: string) => string;
    pendingLabel: string;
    inviteTitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    roleLabel: string;
    sendInvite: string;
    inviting: string;
    viewOnly: string;
    confirmRemove: string;
    toastMissingEmailTitle: string;
    toastMissingEmailDescription: string;
    toastInviteTitle: string;
    toastInviteDescription: string;
    toastInviteErrorTitle: string;
    toastInviteErrorDescription: string;
    toastRoleTitle: string;
    toastRoleDescription: string;
    toastRoleErrorTitle: string;
    toastRoleErrorDescription: string;
    toastRemoveTitle: string;
    toastRemoveDescription: string;
    toastRemoveErrorTitle: string;
    toastRemoveErrorDescription: string;
  };
};

const translations = {
  en: {
    common: {
      languageLabel: "Language",
      orLabel: "or",
      newLabel: "New",
      closeLabel: "Close",
      justNow: "Just now",
    },
    site: {
      description:
        "Smart travel planning with real-time budgets, visa guidance, and currency intelligence.",
    },
    navigation: {
      features: "Features",
      howItWorks: "How it works",
      pricing: "Pricing",
      faqs: "FAQs",
      signIn: "Sign in",
      createAccount: "Create free account",
      startPlanning: "Start planning free",
      exploreFeatures: "Explore features",
      home: "Home",
      dashboard: "Dashboard",
      trips: "Trips",
      budgetPlanner: "Budget Planner",
      visaChecker: "Visa Checker",
      community: "Community",
      notifications: "Notifications",
      moderation: "Moderation",
      admin: "Admin",
      settings: "Settings",
      help: "Help",
    },
    hero: {
      pill: "Smart travel planning, step-by-step",
      title: "Design unforgettable trips with real-time budgets and visa clarity",
      description:
        "SoleilRoute combines currency intelligence, visa automation, and collaborative itineraries so your journeys are organized, compliant, and within budget before you even pack.",
      highlightOne: "Visa-ready data for 190+ countries",
      highlightTwo: "Collaborative itineraries with budget control",
      trustTitle: "Why teams trust SoleilRoute",
      trustBullets: [
        "90% of travelers stay within budget using automated spend forecasts.",
        "Visa requirements refresh every 12 hours from Passport Index.",
        "Exchange rates tracked across 180+ currencies with alerts.",
      ],
      noCreditCard: "No credit card required. Cancel anytime.",
    },
    features: {
      heading: "Everything you need to orchestrate smarter trips",
      subheading:
        "Plan, budget, and execute itineraries with a single collaborative hub.",
      items: [
        {
          title: "Visa intelligence",
          description:
            "Instantly check visa requirements, processing times, fees, and embassy links for any destination.",
        },
        {
          title: "Budget automation",
          description:
            "Set spending caps, track payments, and visualize category spend with Recharts-powered dashboards.",
        },
        {
          title: "Timeline planning",
          description:
            "Keep itineraries organized with date-aware milestones and payment reminders tied to your trip schedule.",
        },
        {
          title: "Collaborative workspace",
          description:
            "Share itineraries, assign tasks, and receive updates with secure account-based access.",
        },
      ],
    },
    howItWorks: {
      heading: "Plan in three structured phases",
      subheading:
        "Map the perfect journey from idea to execution with a guided workflow.",
      steps: [
        {
          title: "Create your trip",
          body: "Add your destination, travel dates, budget, and citizenship. SoleilRoute syncs visa requirements and conversion rates in seconds.",
        },
        {
          title: "Allocate your budget",
          body: "Distribute funds across transport, accommodation, food, activities, visas, and extras. Track payments and outstanding items in one view.",
        },
        {
          title: "Stay compliant and informed",
          body: "Receive visa alerts, policy updates, and payment reminders. Export itineraries or share dashboards with stakeholders instantly.",
        },
      ],
      stepLabel: (step: number) => `Step ${step}`,
    },
    pricing: {
      heading: "Pricing that scales with your adventures",
      subheading: "Powerful tools with transparent pricing. Upgrade anytime.",
      popular: "Popular",
      plans: [
        {
          name: "Starter",
          price: "Free",
          description: "Perfect for curious travelers planning their next journey.",
          features: [
            "Up to 2 active trips",
            "Budget tracking with category limits",
            "Visa recommendations for top 20 destinations",
            "Email reminders for payments",
          ],
          cta: "Start for free",
        },
        {
          name: "Pro",
          price: "$12",
          period: "per month",
          description: "Advanced workflows for frequent travelers and teams.",
          features: [
            "Unlimited active trips",
            "Shared dashboards & collaborative editing",
            "Full visa intelligence with embassy links",
            "Currency triggers and expense approvals",
            "PDF exports and custom branding",
          ],
          cta: "Start 14-day trial",
        },
        {
          name: "Enterprise",
          price: "Custom",
          description: "Compliance and reporting for travel operations teams.",
          features: [
            "Dedicated success manager",
            "SAML SSO and role-based access control",
            "Finance integrations and policies",
            "Priority support and onboarding",
          ],
          cta: "Talk to sales",
        },
      ],
    },
    faqs: {
      heading: "Answers for curious travelers",
      subheading: "Everything you need to know before launching your next trip.",
      items: [
        {
          question: "Which countries are supported for visa checks?",
          answer:
            "We maintain visa guidance for 190+ destinations powered by Passport Index data and our own compliance team. Each result includes visa status, type, validity, costs, and direct embassy links.",
        },
        {
          question: "How accurate are the currency conversions?",
          answer:
            "Exchange rate updates run every 4 hours from ExchangeRate API. You can lock a conversion rate per trip and track spending in both the trip currency and your base currency.",
        },
        {
          question: "Can I invite my team or travel companions?",
          answer:
            "Yes. SoleilRoute includes secure sharing with role-based access. Invite viewers or co-planners, define permissions, and collaborate on itineraries, budgets, and visa documentation.",
        },
        {
          question: "Do you offer PDF exports or reports?",
          answer:
            "Pro plans include one-click PDF exports of itineraries, budget summaries, payment schedules, and visa requirements - perfect for handing to clients or saving offline.",
        },
      ],
    },
    footer: {
      product: "Product",
      resources: "Resources",
      company: "Company",
      links: {
        features: "Features",
        pricing: "Pricing",
        releaseNotes: "Release notes",
        documentation: "Documentation",
        support: "Support",
        blog: "Blog",
        about: "About",
        careers: "Careers",
        contact: "Contact",
      },
      legal: {
        privacy: "Privacy",
        terms: "Terms",
        status: "Status",
        rights: "All rights reserved.",
      },
    },
    auth: {
      login: {
        title: "Welcome back",
        subtitle: "Sign in to access your travel dashboards.",
        googleButton: "Continue with Google",
        divider: "or",
        noAccount: "Need an account?",
        createAccount: "Create one",
        submit: "Sign in",
        submitting: "Signing in...",
        emailLabel: "Email",
        passwordLabel: "Password",
        placeholderEmail: "you@example.com",
        placeholderPassword: "********",
        toast: {
          errorTitle: "Unable to sign in",
          errorDescription: "Please verify your credentials.",
          successTitle: "Welcome back",
          successDescription: "You are now signed in.",
        },
        validation: {
          email: "Enter a valid email address.",
          password: "Password must include at least 6 characters.",
        },
      },
      register: {
        title: "Join SoleilRoute",
        subtitle: "Manage visas, budgets, and itineraries in minutes.",
        googleButton: "Sign up with Google",
        divider: "or",
        haveAccount: "Already have an account?",
        signIn: "Sign in",
        submit: "Create account",
        submitting: "Creating account...",
        emailLabel: "Email",
        passwordLabel: "Password",
        confirmLabel: "Confirm password",
        placeholderEmail: "you@example.com",
        placeholderPassword: "********",
        placeholderConfirm: "********",
        toast: {
          errorTitle: "Unable to register",
          errorDescription: "Unexpected error. Please try again.",
        },
        validation: {
          email: "Enter a valid email address.",
          password: "Password must be at least 8 characters long.",
          confirm: "Passwords do not match.",
        },
      },
    },
    dashboard: {
      headerTitle: "Dashboard",
      headerSubtitle:
        "Monitor your upcoming trips, budgets, and visa requirements.",
      signedInAs: "Signed in as",
      accountSettings: "Account settings",
      themeLight: "Switch to light mode",
      themeDark: "Switch to dark mode",
      help: "Help",
      signOut: "Sign out",
      home: "Home",
      workspaceTitle: "Workspace",
      needHelp: "Need help?",
    },
    settings: {
      title: "Account settings",
      subtitle: "Update your profile details, password, and active sessions.",
      profileTitle: "Profile",
      passwordTitle: "Password",
      sessionsTitle: "Sessions",
    },
    profileForm: {
      emailLabel: "Email",
      displayNameLabel: "Display name",
      avatarLabel: "Avatar",
      avatarAlt: "Profile avatar",
      avatarPlaceholder: "No avatar",
      save: "Save changes",
      saving: "Saving...",
      toastErrorTitle: "Unable to update email",
      toastErrorDescription: "Please try again.",
      toastSuccessTitle: "Profile updated",
      toastSuccessDescription: "Your email address has been saved.",
      validationEmail: "Enter a valid email address.",
      validationDisplayName: "Display name must be at least 2 characters.",
    },
    passwordForm: {
      currentLabel: "Current password",
      newLabel: "New password",
      confirmLabel: "Confirm new password",
      save: "Update password",
      saving: "Saving...",
      toastErrorTitle: "Unable to update password",
      toastErrorDescription: "Please try again.",
      toastSuccessTitle: "Password updated",
      toastSuccessDescription:
        "Use the new password the next time you sign in.",
      validationCurrent: "Enter your current password.",
      validationNew: "Password must be at least 8 characters.",
      validationConfirm: "Passwords do not match.",
    },
    sessionsForm: {
      activeLabel: "Active sessions",
      revoke: "Sign out other sessions",
      revoking: "Revoking...",
      toastErrorTitle: "Unable to revoke sessions",
      toastErrorDescription: "Please try again.",
      toastSuccessTitle: "Sessions revoked",
      toastSuccessDescription: "Signed out from other devices.",
    },
    notifications: {
      menuTitle: "Notifications",
      markAllRead: "Mark all read",
      loading: "Loading notifications...",
      empty: "No notifications yet.",
      viewAll: "View all notifications",
      viewDetails: "View details",
      newBadge: "New",
      historyTitle: "Notifications",
      historySubtitle:
        "Review updates, filter by type, and manage how you receive alerts.",
      pendingInvitationsTitle: "Pending invitations",
      pendingInvitationsSubtitle:
        "Accept or decline trip invites before they appear in your dashboard.",
      preferencesTitle: "Notification preferences",
      searchPlaceholder: "Search notifications",
      statusPlaceholder: "Status",
      statusAll: "All statuses",
      statusUnread: "Unread",
      statusRead: "Read",
      typePlaceholder: "Type",
      typeAll: "All types",
      typeSuccess: "Success",
      typeWarning: "Warning",
      typeInfo: "Info",
      refresh: "Refresh",
      refreshing: "Refreshing...",
      noMatches: "No notifications match your filters.",
      markRead: "Mark read",
      invitationEmpty: "No pending trip invitations right now.",
      invitationRoleEditor: "Editor",
      invitationRoleViewer: "Viewer",
      invitationDecline: "Decline",
      invitationAccept: "Accept",
      tripFallback: "Trip",
      unknownDestination: "Unknown destination",
      invitedByFallback: "teammate",
      invitedBy: (name: string, date: string) => `Invited by ${name} - ${date}`,
    },
    community: {
      title: "Community feed",
      subtitle: "Share places, map pins, and tips with fellow travelers.",
      createTitle: "Share something new",
      createSubtitle: "Posts are reviewed by moderators before they go live.",
      fields: {
        tag: "Tag",
        text: "Your story",
        mapUrl: "Map link",
        image: "Photo",
      },
      placeholders: {
        tag: "Select a tag",
        text: "Tell the community what you discovered...",
        mapUrl: "Paste a Google Maps or OpenStreetMap link",
      },
      tabs: {
        feed: "Community feed",
        mine: "My posts",
        saved: "Saved",
      },
      tags: {
        place: "Place",
        map_point: "Map point",
        landmark: "Landmark",
        other: "Other",
      },
      status: {
        pending: "Pending review",
        approved: "Approved",
        rejected: "Rejected",
      },
      publish: "Submit for review",
      posting: "Submitting...",
      refresh: "Refresh",
      loading: "Loading community posts...",
      emptyFeed: "No posts yet. Be the first to share.",
      emptyMine: "You have not submitted any posts yet.",
      emptySaved: "No saved posts yet.",
      viewMap: "Open map",
      rejectionReason: "Reason",
      mediaHint: "Add a photo or a map link before publishing.",
      mediaImageHint: "Upload a photo (JPG/PNG/WebP/GIF). Max 10 MB.",
      mediaMapHint: "Add a map link to share a pin or route.",
      detailsTitle: "Post details",
      noMap: "No map link shared.",
      unknownAuthor: "Traveler",
      profile: {
        title: "Traveler profile",
        subtitle: "Posts shared by this traveler.",
        postsTitle: "Posts",
        postsEmpty: "No posts yet.",
      },
      toastSubmittedTitle: "Post submitted",
      toastSubmittedDescription:
        "Thanks! Your post is awaiting moderator approval.",
      toastErrorTitle: "Unable to submit post",
      toastErrorDescription: "Please try again.",
      comments: {
        title: "Comments",
        placeholder: "Write a comment...",
        reply: "Reply",
        submit: "Post comment",
        submitting: "Posting...",
        empty: "No comments yet.",
        loading: "Loading comments...",
        toastSuccessTitle: "Comment posted",
        toastSuccessDescription: "Your comment is now visible.",
        toastErrorTitle: "Unable to post comment",
        toastErrorDescription: "Please try again.",
      },
      actions: {
        edit: "Edit post",
        delete: "Delete post",
        like: "Like",
        savePost: "Save",
        save: "Save changes",
        cancel: "Cancel",
        saving: "Saving...",
        confirmDelete: "Delete this post? This action cannot be undone.",
        toastUpdatedTitle: "Post updated",
        toastUpdatedDescription: "The post changes have been saved.",
        toastDeletedTitle: "Post deleted",
        toastDeletedDescription: "The post has been removed.",
      },
      validation: {
        tagRequiredTitle: "Select a tag",
        tagRequiredDescription: "Choose what you want to share.",
        textRequiredTitle: "Add a description",
        textRequiredDescription: "Write at least 10 characters.",
        textProhibitedTitle: "Content not allowed",
        textProhibitedDescription: "Please remove offensive language.",
        mediaRequiredTitle: "Add a photo or map link",
        mediaRequiredDescription: "Attach a photo or share a map link.",
        mapInvalidTitle: "Map link invalid",
        mapInvalidDescription: "Use a valid Google Maps or OSM link.",
        imageSizeTitle: "Image is too large",
        imageSizeDescription: "Max file size is 10 MB.",
      },
    },
    moderation: {
      title: "Moderation queue",
      subtitle: "Review community submissions and approve or reject posts.",
      loading: "Loading moderation queue...",
      empty: "No posts waiting for review.",
      approve: "Approve",
      reject: "Reject",
      reasonPlaceholder: "Optional rejection reason",
      toastApprovedTitle: "Post approved",
      toastApprovedDescription: "The post is now live in the community feed.",
      toastRejectedTitle: "Post rejected",
      toastRejectedDescription: "The author has been notified.",
      toastErrorTitle: "Unable to update post",
      toastErrorDescription: "Please try again.",
    },
    admin: {
      title: "Admin panel",
      subtitle: "Assign moderators and manage community permissions.",
      loading: "Loading users...",
      empty: "No users found.",
      refresh: "Refresh",
      searchPlaceholder: "Search by email",
      adminLabel: "Admin (full access)",
      moderatorLabel: "Moderator access",
      toastUpdatedTitle: "Moderator updated",
      toastUpdatedDescription: "User permissions have been saved.",
      toastErrorTitle: "Unable to update user",
      toastErrorDescription: "Please try again.",
    },
    onboarding: {
      stepLabel: (current: number, total: number) => `Step ${current} of ${total}`,
      next: "Next",
      back: "Back",
      done: "Finish",
      skip: "Skip tour",
      loadingHint: "Loading this step. If it takes too long, click Next.",
      steps: {
        welcome: {
          title: "Welcome to SoleilRoute",
          body:
            "Let's walk through the core tools so you can plan your first trip with confidence.",
        },
        planTrip: {
          title: "Create your first trip",
          body: "Use Quick Actions to set dates, destination, and budget in a few clicks.",
        },
        trips: {
          title: "Manage trips",
          body: "All active trips live here with statuses, travelers, and progress.",
        },
        budget: {
          title: "Plan the budget",
          body: "Compare budget tiers and keep spending caps aligned to each trip.",
        },
        visa: {
          title: "Check visa requirements",
          body: "Search visa rules by citizenship and destination, then save the result.",
        },
        notifications: {
          title: "Stay updated",
          body: "Get alerts about visa changes, payments, and collaborator activity.",
        },
        settings: {
          title: "Profile & preferences",
          body: "Update your account, theme, and notification preferences anytime.",
        },
      },
    },
    help: {
      title: "Help & support",
      subtitle: "Find quick answers, troubleshoot issues, or reach out to the team.",
      quickHelpTitle: "Quick help",
      quickHelpBody: "Check the FAQ below for the most common questions and fixes.",
      accountSettingsCta: "Account settings",
      contactSupportTitle: "Contact support",
      contactSupportBody:
        "Send us a message and we will get back to you within one business day.",
      systemStatusTitle: "System status",
      systemStatusBody: "All services are operational.",
      statusButton: "Status page",
      faqTitle: "Troubleshooting FAQ",
      faqs: [
        {
          question: "How do I update my account details?",
          answer:
            "Open Account settings from the profile menu. You can update your email, password, and revoke other sessions.",
        },
        {
          question: "Why is my visa status marked as unknown?",
          answer:
            "We only show cached data when available. Open the trip visa page to set the status manually or wait for coverage updates.",
        },
        {
          question: "How do I reset budgets after changing totals?",
          answer:
            "Budget items are editable per trip. Use the budget editor to update amounts or remove categories that no longer apply.",
        },
        {
          question: "How do I log out everywhere?",
          answer:
            "Go to Account settings and select \"Sign out other sessions\" to revoke all other active devices.",
        },
      ],
    },
    supportDialog: {
      triggerButton: "Email support",
      title: "Contact support",
      description: "Share the details and we will reach out by email.",
      emailLabel: "Your email",
      emailPlaceholder: "you@example.com",
      subjectLabel: "Subject",
      subjectPlaceholder: "Issue with trip budgets",
      messageLabel: "Message",
      messagePlaceholder: "Describe the problem or request...",
      cancel: "Cancel",
      send: "Send message",
      sending: "Sending...",
      toastErrorTitle: "Unable to send message",
      toastErrorDescription: "Please try again.",
      toastSuccessTitle: "Message sent",
      toastSuccessDescription: "Support will get back to you soon.",
      validationEmail: "Enter a valid email address.",
      validationSubject: "Subject should be at least 3 characters.",
      validationMessage: "Message should be at least 10 characters.",
    },
    notificationPreferences: {
      emailTitle: "Email notifications",
      emailBody: "Receive important updates by email.",
      inAppTitle: "In-app notifications",
      inAppBody: "Show updates in the notification menu.",
      save: "Save preferences",
      saving: "Saving...",
      toastSuccessTitle: "Preferences updated",
      toastSuccessDescription: "Your notification settings have been saved.",
      toastErrorTitle: "Update failed",
      toastErrorDescription: "We could not save your preferences.",
    },
    dashboardOverview: {
      stats: {
        totalBudgetLabel: "Total budget",
        totalBudgetHelper: "Across all active trips",
        activeTripsLabel: "Active trips",
        activeTripsHelper: "Trips created in SoleilRoute",
        paidInvoicesLabel: "Paid invoices",
        paidInvoicesHelper: "Marked as paid across categories",
        outstandingLabel: "Outstanding",
        outstandingHelper: "Remaining amount to allocate",
        upcomingTripsLabel: "Upcoming trips",
        upcomingTripsHelper: "Starting within 30 days",
        overBudgetLabel: "Over budget",
        overBudgetHelper: "Planned above total budget",
      },
    },
    quickActions: {
      title: "Quick actions",
      dialogTitle: "Plan new trip",
      dialogDescription:
        "Fill in the travel details and we will compute your initial budget split and visa guidance.",
      actions: {
        planTripTitle: "Plan new trip",
        planTripDescription:
          "Create an itinerary with budget categories and visa checks.",
        reviewBudgetsTitle: "Review budgets",
        reviewBudgetsDescription:
          "Plan a budget range per destination and travel style.",
        checkVisaTitle: "Check visa requirements",
        checkVisaDescription:
          "Verify visa rules before booking your next adventure.",
      },
    },
    tripForm: {
      submitDefault: "Create trip",
      submitting: "Creating trip...",
      createSuccessTitle: "Trip created",
      createSuccessDescription:
        "We generated an initial budget split and visa checklist.",
      createErrorTitle: "Something went wrong",
      createErrorDescription:
        "We could not save this trip. Please try again.",
      fields: {
        nameLabel: "Trip name",
        citizenshipLabel: "Citizenship",
        destinationCountryLabel: "Destination country",
        destinationCityLabel: "Destination city",
        startDateLabel: "Start date",
        endDateLabel: "End date",
        totalBudgetLabel: "Total budget",
        travelStyleLabel: "Travel style",
        currencyLabel: "Trip currency",
        baseCurrencyLabel: "Base currency",
        notesLabel: "Notes",
      },
      placeholders: {
        name: "Summer in Tokyo",
        destinationCountry: "Japan",
        destinationCity: "Tokyo",
        notes:
          "Visa types to explore, must-see activities, or key reminders...",
        selectCitizenship: "Select citizenship",
        searchCountries: "Search countries",
        currency: "Currency",
        baseCurrency: "Base currency",
        travelStyle: "Select style",
      },
      autoSplitMessage: (count: number, categories: string) =>
        `We will automatically split your budget across ${count} categories: ${categories}. Adjust allocations anytime within the trip dashboard.`,
      validation: {
        nameMin: "Trip name should be at least 3 characters.",
        destinationCountryRequired: "Destination country is required.",
        destinationCityRequired: "Destination city is required.",
        startDateInvalid: "Please provide a valid start date.",
        startDateRequired: "Start date is required.",
        endDateInvalid: "Please provide a valid end date.",
        endDateRequired: "End date is required.",
        totalBudgetInvalid: "Total budget must be a number.",
        totalBudgetPositive: "Budget must be greater than zero.",
        currencyLength: "Currency must be a 3-letter ISO code.",
        citizenshipRequired: "Please enter your citizenship.",
        baseCurrencyLength: "Base currency must be a 3-letter ISO code.",
        travelStyleRequired: "Travel style is required.",
        endDateAfterStart: "End date should be after the start date.",
      },
    },
    tripDetailsEditor: {
      trigger: "Edit trip",
      title: "Edit trip",
      description:
        "Update key details. Budget items stay as-is unless you edit them below.",
      cancel: "Cancel",
      save: "Save changes",
      saving: "Saving...",
      toastSuccessTitle: "Trip updated",
      toastSuccessDescription: "Your trip details have been refreshed.",
      toastErrorTitle: "Update failed",
      toastErrorDescription: "We could not save your changes.",
    },
    tripList: {
      emptyTitle: "No trips yet",
      emptyDescription:
        "Create your first itinerary to unlock budget analytics and visa guidance.",
      openTrip: "Open trip",
      manageBudget: "Manage budget",
      visaChecklist: "Visa checklist",
      deleteTrip: "Delete trip",
      deleting: "Deleting...",
      confirmDelete: "Delete this trip? All budget items will be removed.",
      sharedLabel: (role: string) => `Shared (${role})`,
      budgetProgressLabel: "Budget progress",
      budgetProgressSummary: (percent: number) =>
        `${percent}% of total budget marked as paid.`,
      toastDeleteTitle: "Trip deleted",
      toastDeleteDescription: "The trip has been removed.",
      toastDeleteErrorTitle: "Unable to delete trip",
      toastDeleteErrorDescription: "Please try again later.",
    },
    tripsView: {
      pageDescription:
        "Every itinerary you plan lives here. Open a trip to refine budgets and visa tasks.",
      searchPlaceholder: "Search trips, cities, or countries",
      statusPlaceholder: "Visa status",
      statusAll: "All visa statuses",
      sortPlaceholder: "Sort by",
      sortOptions: {
        upcoming: "Start date (soonest)",
        latest: "Start date (latest)",
        ending: "End date (soonest)",
        name: "Name A-Z",
        visa_status: "Visa status priority",
        budget_high: "Budget (high to low)",
        budget_low: "Budget (low to high)",
      },
      resetFilters: "Reset filters",
    },
    tripOverview: {
      backToTrips: "Back to trips",
      sharedEditor: "Shared (Editor)",
      sharedViewer: "Shared (Viewer)",
      detailsTitle: "Trip details",
      detailLabels: {
        dates: "Dates",
        destination: "Destination",
        citizenship: "Citizenship",
        totalBudget: "Total budget",
        spentPaid: "Spent (marked paid)",
        visaStatus: "Visa status",
        baseCurrency: "Base currency",
      },
      notesTitle: "Notes",
      notesEmpty: "No notes added yet.",
      ownerFallback: "owner",
      collaboratorUnknown: "unknown",
    },
    tripBudgetPage: {
      backToOverview: "Trip overview",
      title: "Budget breakdown",
    },
    tripBudget: {
      progressTitle: "Budget progress",
      paidSoFar: "Paid so far",
      progressSummary: (percent: number, planned: string) =>
        `${percent}% of total budget marked paid. Planned spend: ${planned}.`,
    },
    budget: {
      categories: {
        transport: "Transport",
        accommodation: "Accommodation",
        food: "Food",
        activities: "Activities",
        visa: "Visa",
        other: "Other",
      },
    },
    budgetChart: {
      title: "Budget overview",
      description: "Track planned versus paid expenses for each category.",
      plannedLabel: "Planned",
      paidLabel: "Paid",
    },
    budgetItems: {
      title: "Budget items",
      summaryPlanned: "Planned",
      summaryPaid: "Paid",
      summaryRemaining: "Remaining",
      summaryOverBudget: "Over budget",
      summaryOutstanding: "outstanding",
      noItems: "No budget items yet. Add your first expense below.",
      categoryLabel: "Category",
      descriptionLabel: "Description",
      amountLabel: "Amount",
      paidLabel: "Paid",
      savedLabel: "Saved",
      remove: "Remove",
      saveChanges: "Save changes",
      saving: "Saving...",
      addTitle: "Add a budget item",
      addButton: "Add item",
      adding: "Adding...",
      newDescriptionPlaceholder: "Taxi to airport, accommodation fee",
      editDescriptionPlaceholder: "Hotel deposit, rail pass, museum tickets",
      viewOnly: "You have view-only access to this trip.",
      confirmDelete: "Delete this budget item? This cannot be undone.",
      toastInvalidAmountTitle: "Invalid amount",
      toastInvalidAmountDescription:
        "Amount must be a number greater than zero.",
      toastSaveTitle: "Budget updated",
      toastSaveDescription: "Changes saved successfully.",
      toastSaveErrorTitle: "Update failed",
      toastSaveErrorDescription: "We could not save your changes.",
      toastToggleErrorTitle: "Unable to update",
      toastToggleErrorDescription: "We could not update the paid status.",
      toastAddTitle: "Budget item added",
      toastAddDescription: "The new entry is now in your list.",
      toastAddErrorTitle: "Unable to add item",
      toastAddErrorDescription: "Please try again in a moment.",
      toastDeleteTitle: "Budget item removed",
      toastDeleteDescription: "The item has been deleted.",
      toastDeleteErrorTitle: "Unable to delete",
      toastDeleteErrorDescription: "Please try again later.",
    },
    budgetCaps: {
      title: "Spending caps",
      description:
        "Set per-category limits to keep planned expenses within scope.",
      plannedLabel: "Planned",
      capLabel: "Cap",
      noCap: "No cap",
      overBy: "Over by",
      capInputLabel: "Cap",
      saveCaps: "Save caps",
      saving: "Saving...",
      viewOnly: "You have view-only access to this trip.",
      toastSuccessTitle: "Spending caps saved",
      toastSuccessDescription: "Category limits updated successfully.",
      toastErrorTitle: "Unable to save caps",
      toastErrorDescription: "Please try again in a moment.",
    },
    budgetPlanner: {
      title: "Budget planner",
      description:
        "Estimate daily costs per person and plan a balanced split by category.",
      destinationLabel: "Destination country",
      destinationPlaceholder: "Select a country",
      destinationSearchPlaceholder: "Search countries",
      travelStyleLabel: "Travel style",
      travelStylePlaceholder: "Select style",
      tripLengthLabel: "Trip length (days)",
      travelersLabel: "Travelers",
      dailyEstimateTitle: "Daily estimate",
      dailyEstimateNote: (currency: string) =>
        `Per person, per day in ${currency}.`,
      totalEstimateTitle: "Total estimate",
      totalEstimateNote: (days: number, travelers: number) =>
        `${days} days, ${travelers} traveler${travelers > 1 ? "s" : ""}.`,
      categorySplitTitle: "Category split",
      highlightsTitle: "Highlights",
      notesTitle: "Notes",
      notesFallback: "Adjust estimates for seasonality.",
      estimatesFootnote: "Estimates exclude flights and travel insurance.",
      tierTitle: "Tier comparison",
      tierDescription: "Compare budget levels for the same destination.",
      tierSelected: "Selected",
      tierPerDay: "Per day",
      tierPerTrip: "Trip total",
      tierBadgesTitle: "Travel style",
      tiers: {
        budget: {
          label: "Budget",
          description: "Essentials and simple stays.",
        },
        mid: {
          label: "Mid-range",
          description: "Balanced comfort and activities.",
        },
        luxury: {
          label: "Luxury",
          description: "Premium stays and experiences.",
        },
      },
      noMatches: "No matches found.",
    },
    visa: {
      statuses: {
        unknown: "Unknown",
        required: "Visa required",
        in_progress: "In progress",
        approved: "Approved",
        not_required: "Not required",
      },
    },
    visaChecker: {
      title: "Visa requirements",
      description:
        "Confirm visa obligations before you book flights or hotels.",
      citizenshipLabel: "Citizenship",
      destinationLabel: "Destination country",
      citizenshipSearchPlaceholder: "Search countries",
      destinationSearchPlaceholder: "Search destinations",
      destinationPlaceholder: "Select destination",
      noMatches: "No matches found.",
      noDestinations: "No destinations available.",
      checkButton: "Check requirements",
      checking: "Checking...",
      addToTrip: "Add to trip",
      createTripTitle: "Create a trip",
      createTripDescription:
        "We prefilled your citizenship and destination to get you started.",
      tripName: (destination: string) => `Trip to ${destination}`,
      toastMissingTitle: "Missing details",
      toastMissingDescription: "Select a citizenship and enter a destination.",
      toastErrorTitle: "Unable to check",
      toastErrorDescription: "We could not load visa requirements.",
      resultsNote:
        "Results combine Passport Index insights with SoleilRoute's compliance library. Add this guidance to your trip to receive ongoing updates.",
      emptyState:
        "We do not have cached data for this route yet. Add the trip to trigger a real-time lookup via Passport Index.",
      resultStatusRequired: "Visa required",
      resultStatusFree: "Visa-free entry available",
      badgeRequired: "Visa required",
      badgeNotRequired: "Visa not required",
      detailVisaType: "Visa type",
      detailValidity: "Validity",
      detailProcessing: "Processing time",
      detailCost: "Cost",
      noFee: "No fee",
      viewEmbassy: "View embassy guidance",
      lastCheckedLabel: "Last checked",
      sourceLabel: "Source",
      insightsTitle: "Travel insights",
      insightsCurrency: "Currency",
      insightsLanguages: "Languages",
      insightsTimezones: "Time zones",
      insightsCallingCodes: "Calling codes",
      insightsCapital: "Capital",
    },
    visaStatusEditor: {
      currentStatusLabel: "Current status",
      selectPlaceholder: "Select status",
      lastCheckedLabel: "Last checked",
      noChecks: "No recent visa checks recorded.",
      toastSuccessTitle: "Visa status updated",
      toastSuccessDescription: "Saved successfully.",
      toastErrorTitle: "Update failed",
      toastErrorDescription: "We could not update the visa status.",
    },
    tripVisaPage: {
      backToOverview: "Trip overview",
      title: "Visa checklist",
      subtitle: (citizenship: string, destination: string) =>
        `${citizenship} to ${destination}`,
      requirementsTitle: "Requirements",
      visaRequired: "Visa required",
      visaNotRequired: "Visa not required",
      detailValidity: "Validity",
      detailProcessing: "Processing time",
      detailCost: "Estimated cost",
      detailEmbassy: "Embassy link",
      embassyLink: "Visit embassy site",
      noFee: "No fee",
      noCache:
        "We do not have cached requirements for this route yet. Add the trip and we will retrieve details automatically once the integrations are connected.",
    },
    timeline: {
      title: "Timeline planner",
      description:
        "Track itinerary milestones and schedule payment reminders tied to your trip dates.",
      empty: "No timeline items yet. Add your first milestone below.",
      fieldTitle: "Title",
      fieldDueDate: "Due date",
      fieldType: "Type",
      fieldAmount: "Amount",
      fieldNotes: "Notes",
      typeMilestone: "Milestone",
      typePayment: "Payment reminder",
      statusCompleted: "Completed",
      statusPending: "Pending",
      notesPlaceholder: "Reminders, links, or tasks",
      itemSaved: "Saved",
      remove: "Remove",
      saveChanges: "Save changes",
      saving: "Saving...",
      addTitle: "Add a timeline item",
      addButton: "Add item",
      adding: "Adding...",
      newTitlePlaceholder: "Book flights, hotel deposit, museum tickets",
      newNotesPlaceholder: "Add a short reminder or checklist item.",
      optionalAmount: "Optional",
      viewOnly: "You have view-only access to this trip.",
      confirmDelete: "Delete this timeline item? This cannot be undone.",
      toastMissingDetailsTitle: "Missing details",
      toastMissingDetailsDescription:
        "Add a title and due date before saving.",
      toastInvalidAmountTitle: "Invalid amount",
      toastInvalidAmountDescription:
        "Amount must be a number greater than zero.",
      toastUpdateTitle: "Timeline updated",
      toastUpdateDescription: "Changes saved successfully.",
      toastUpdateErrorTitle: "Update failed",
      toastUpdateErrorDescription: "We could not save your changes.",
      toastAddTitle: "Timeline item added",
      toastAddDescription: "The new reminder is now in your list.",
      toastAddErrorTitle: "Unable to add item",
      toastAddErrorDescription: "Please try again in a moment.",
      toastDeleteTitle: "Timeline item removed",
      toastDeleteDescription: "The reminder has been deleted.",
      toastDeleteErrorTitle: "Unable to delete",
      toastDeleteErrorDescription: "Please try again later.",
      toastStatusErrorTitle: "Unable to update",
      toastStatusErrorDescription: "We could not update the status.",
      dueNoDate: "No date",
      dueOverdue: (days: number) => `Overdue by ${days}d`,
      dueIn: (days: number) => `Due in ${days}d`,
    },
    collaborators: {
      title: "Collaborative workspace",
      description:
        "Share this trip with companions or teammates and control editing permissions.",
      youLabel: "(You)",
      addedLabel: (date: string) => `Added ${date}`,
      ownerLabel: "Owner",
      roleEditor: "Editor",
      roleViewer: "Viewer",
      remove: "Remove",
      pendingTitle: "Pending invites",
      pendingInvite: (role: string, date: string) => `${role} invite - ${date}`,
      pendingLabel: "Awaiting response",
      inviteTitle: "Invite collaborator",
      emailLabel: "Email",
      emailPlaceholder: "teammate@example.com",
      roleLabel: "Role",
      sendInvite: "Send invite",
      inviting: "Inviting...",
      viewOnly: "Only the trip owner can manage collaborators.",
      confirmRemove:
        "Remove this collaborator? They will lose access to the trip.",
      toastMissingEmailTitle: "Missing email",
      toastMissingEmailDescription: "Enter an email address to invite.",
      toastInviteTitle: "Invite sent",
      toastInviteDescription: "Access starts once they accept.",
      toastInviteErrorTitle: "Unable to send invite",
      toastInviteErrorDescription: "Check the email and try again.",
      toastRoleTitle: "Role updated",
      toastRoleDescription: "Permissions have been refreshed.",
      toastRoleErrorTitle: "Unable to update role",
      toastRoleErrorDescription: "Please try again.",
      toastRemoveTitle: "Collaborator removed",
      toastRemoveDescription: "Access has been revoked.",
      toastRemoveErrorTitle: "Unable to remove collaborator",
      toastRemoveErrorDescription: "Please try again.",
    },
  },
  ru: {
    common: {
      languageLabel: "Язык",
      orLabel: "или",
      newLabel: "Новое",
      closeLabel: "Закрыть",
      justNow: "Только что",
    },
    site: {
      description:
        "Умное планирование путешествий с бюджетами в реальном времени, визовой информацией и валютной аналитикой.",
    },
    navigation: {
      features: "Функции",
      howItWorks: "Как это работает",
      pricing: "Тарифы",
      faqs: "FAQ",
      signIn: "Войти",
      createAccount: "Создать аккаунт",
      startPlanning: "Начать бесплатно",
      exploreFeatures: "Посмотреть функции",
      home: "Главная",
      dashboard: "Дашборд",
      trips: "Поездки",
      budgetPlanner: "Планировщик бюджета",
      visaChecker: "Проверка визы",
      community: "Сообщество",
      moderation: "Модерация",
      admin: "Админ",
      notifications: "Уведомления",
      settings: "Настройки",
      help: "Помощь",
    },
    hero: {
      pill: "Умное планирование поездок шаг за шагом",
      title:
        "Создавайте незабываемые поездки с бюджетами в реальном времени и ясностью по визам",
      description:
        "SoleilRoute объединяет валютную аналитику, автоматизацию виз и совместные маршруты, чтобы ваши поездки были организованы, соответствовали требованиям и укладывались в бюджет еще до сборов.",
      highlightOne: "Данные по визам для 190+ стран",
      highlightTwo: "Совместные маршруты с контролем бюджета",
      trustTitle: "Почему командам доверяют SoleilRoute",
      trustBullets: [
        "90% путешественников остаются в бюджете благодаря прогнозам расходов.",
        "Требования по визам обновляются каждые 12 часов из Passport Index.",
        "Курсы валют отслеживаются по 180+ валютам с уведомлениями.",
      ],
      noCreditCard: "Карта не требуется. Отменить можно в любой момент.",
    },
    features: {
      heading: "Все, что нужно для умных поездок",
      subheading:
        "Планируйте, бюджетируйте и реализуйте маршруты в едином совместном хабе.",
      items: [
        {
          title: "Визовая аналитика",
          description:
            "Мгновенно проверяйте визовые требования, сроки, сборы и ссылки на посольства для любого направления.",
        },
        {
          title: "Автоматизация бюджета",
          description:
            "Устанавливайте лимиты, отслеживайте платежи и визуализируйте категории расходов с дашбордами на Recharts.",
        },
        {
          title: "Планирование таймлайна",
          description:
            "Держите маршруты организованными с датированными этапами и напоминаниями о платежах.",
        },
        {
          title: "Совместное пространство",
          description:
            "Делитесь маршрутами, назначайте задачи и получайте обновления с безопасным доступом.",
        },
      ],
    },
    howItWorks: {
      heading: "План в три структурированных фазы",
      subheading:
        "Составьте идеальное путешествие от идеи до исполнения с понятным процессом.",
      steps: [
        {
          title: "Создайте поездку",
          body: "Добавьте направление, даты, бюджет и гражданство. SoleilRoute синхронизирует визовые требования и курсы обмена за секунды.",
        },
        {
          title: "Распределите бюджет",
          body: "Разделите средства между транспортом, проживанием, питанием, активностями, визами и дополнительными расходами. Отслеживайте платежи и долги в одном окне.",
        },
        {
          title: "Соблюдайте требования и будьте в курсе",
          body: "Получайте визовые оповещения, обновления правил и напоминания о платежах. Экспортируйте маршруты или делитесь дашбордами мгновенно.",
        },
      ],
      stepLabel: (step: number) => `Шаг ${step}`,
    },
    pricing: {
      heading: "Тарифы, которые растут вместе с вашими приключениями",
      subheading:
        "Мощные инструменты с прозрачной ценой. Повышайте тариф в любой момент.",
      popular: "Популярный",
      plans: [
        {
          name: "Стартовый",
          price: "Бесплатно",
          description:
            "Идеально для любознательных путешественников, планирующих следующий маршрут.",
          features: [
            "До 2 активных поездок",
            "Контроль бюджета с лимитами по категориям",
            "Рекомендации по визам для топ-20 направлений",
            "Email-напоминания о платежах",
          ],
          cta: "Начать бесплатно",
        },
        {
          name: "Pro",
          price: "$12",
          period: "в месяц",
          description: "Продвинутые процессы для частых путешественников и команд.",
          features: [
            "Неограниченное число активных поездок",
            "Общие дашборды и совместное редактирование",
            "Полная визовая аналитика со ссылками на посольства",
            "Триггеры валют и согласование расходов",
            "PDF-отчеты и кастомный брендинг",
          ],
          cta: "Начать 14-дневный пробный период",
        },
        {
          name: "Enterprise",
          price: "Индивидуально",
          description: "Соответствие требованиям и отчетность для тревел-команд.",
          features: [
            "Выделенный менеджер успеха",
            "SAML SSO и ролевой доступ",
            "Финансовые интеграции и политики",
            "Приоритетная поддержка и онбординг",
          ],
          cta: "Связаться с отделом продаж",
        },
      ],
    },
    faqs: {
      heading: "Ответы для любознательных путешественников",
      subheading: "Все, что нужно знать перед стартом следующей поездки.",
      items: [
        {
          question: "Какие страны поддерживаются для проверки виз?",
          answer:
            "Мы поддерживаем визовую информацию для 190+ направлений на базе данных Passport Index и нашей команды по соблюдению требований. Каждый результат включает статус, тип, срок действия, стоимость и прямые ссылки на посольства.",
        },
        {
          question: "Насколько точны конвертации валют?",
          answer:
            "Обновления курсов выполняются каждые 4 часа через ExchangeRate API. Можно зафиксировать курс для поездки и отслеживать расходы в валюте поездки и в базовой валюте.",
        },
        {
          question: "Можно ли приглашать команду или попутчиков?",
          answer:
            "Да. SoleilRoute предоставляет безопасный доступ с ролями. Приглашайте зрителей или соорганизаторов, задавайте права и совместно работайте с маршрутами, бюджетами и визовыми документами.",
        },
        {
          question: "Есть ли экспорт PDF или отчеты?",
          answer:
            "Тариф Pro включает экспорт PDF маршрутов, сводок бюджета, расписания платежей и визовых требований - удобно для клиентов или офлайн-хранения.",
        },
      ],
    },
    footer: {
      product: "Продукт",
      resources: "Ресурсы",
      company: "Компания",
      links: {
        features: "Функции",
        pricing: "Тарифы",
        releaseNotes: "Обновления",
        documentation: "Документация",
        support: "Поддержка",
        blog: "Блог",
        about: "О нас",
        careers: "Вакансии",
        contact: "Контакты",
      },
      legal: {
        privacy: "Конфиденциальность",
        terms: "Условия",
        status: "Статус",
        rights: "Все права защищены.",
      },
    },
    auth: {
      login: {
        title: "С возвращением",
        subtitle: "Войдите, чтобы открыть свои дашборды путешествий.",
        googleButton: "Продолжить с Google",
        divider: "или",
        noAccount: "Нет аккаунта?",
        createAccount: "Создать",
        submit: "Войти",
        submitting: "Входим...",
        emailLabel: "Эл. почта",
        passwordLabel: "Пароль",
        placeholderEmail: "you@example.com",
        placeholderPassword: "********",
        toast: {
          errorTitle: "Не удалось войти",
          errorDescription: "Проверьте данные для входа.",
          successTitle: "С возвращением",
          successDescription: "Вы вошли в систему.",
        },
        validation: {
          email: "Введите корректный email.",
          password: "Пароль должен содержать минимум 6 символов.",
        },
      },
      register: {
        title: "Присоединяйтесь к SoleilRoute",
        subtitle: "Управляйте визами, бюджетами и маршрутами за минуты.",
        googleButton: "Зарегистрироваться через Google",
        divider: "или",
        haveAccount: "Уже есть аккаунт?",
        signIn: "Войти",
        submit: "Создать аккаунт",
        submitting: "Создаем аккаунт...",
        emailLabel: "Эл. почта",
        passwordLabel: "Пароль",
        confirmLabel: "Подтвердите пароль",
        placeholderEmail: "you@example.com",
        placeholderPassword: "********",
        placeholderConfirm: "********",
        toast: {
          errorTitle: "Не удалось зарегистрироваться",
          errorDescription: "Непредвиденная ошибка. Попробуйте еще раз.",
        },
        validation: {
          email: "Введите корректный email.",
          password: "Пароль должен быть не короче 8 символов.",
          confirm: "Пароли не совпадают.",
        },
      },
    },
    dashboard: {
      headerTitle: "Дашборд",
      headerSubtitle:
        "Следите за предстоящими поездками, бюджетами и визовыми требованиями.",
      signedInAs: "Вход выполнен как",
      accountSettings: "Настройки аккаунта",
      themeLight: "Переключить на светлую тему",
      themeDark: "Переключить на темную тему",
      help: "Помощь",
      signOut: "Выйти",
      home: "Главная",
      workspaceTitle: "Рабочее пространство",
      needHelp: "Нужна помощь?",
    },
    settings: {
      title: "Настройки аккаунта",
      subtitle: "Обновите профиль, пароль и активные сессии.",
      profileTitle: "Профиль",
      passwordTitle: "Пароль",
      sessionsTitle: "Сессии",
    },
    profileForm: {
      emailLabel: "Эл. почта",
      displayNameLabel: "Отображаемое имя",
      avatarLabel: "Аватар",
      avatarAlt: "Аватар профиля",
      avatarPlaceholder: "Без аватара",
      save: "Сохранить изменения",
      saving: "Сохраняем...",
      toastErrorTitle: "Не удалось обновить email",
      toastErrorDescription: "Пожалуйста, попробуйте еще раз.",
      toastSuccessTitle: "Профиль обновлен",
      toastSuccessDescription: "Ваш email сохранен.",
      validationEmail: "Введите корректный email.",
      validationDisplayName: "Имя должно быть не короче 2 символов.",
    },
    passwordForm: {
      currentLabel: "Текущий пароль",
      newLabel: "Новый пароль",
      confirmLabel: "Подтвердите новый пароль",
      save: "Обновить пароль",
      saving: "Сохраняем...",
      toastErrorTitle: "Не удалось обновить пароль",
      toastErrorDescription: "Пожалуйста, попробуйте еще раз.",
      toastSuccessTitle: "Пароль обновлен",
      toastSuccessDescription:
        "Используйте новый пароль при следующем входе.",
      validationCurrent: "Введите текущий пароль.",
      validationNew: "Пароль должен быть не короче 8 символов.",
      validationConfirm: "Пароли не совпадают.",
    },
    sessionsForm: {
      activeLabel: "Активные сессии",
      revoke: "Выйти из других сессий",
      revoking: "Отзываем...",
      toastErrorTitle: "Не удалось отозвать сессии",
      toastErrorDescription: "Пожалуйста, попробуйте еще раз.",
      toastSuccessTitle: "Сессии отозваны",
      toastSuccessDescription: "Вы вышли с других устройств.",
    },
    notifications: {
      menuTitle: "Уведомления",
      markAllRead: "Отметить все как прочитанные",
      loading: "Загрузка уведомлений...",
      empty: "Пока нет уведомлений.",
      viewAll: "Посмотреть все уведомления",
      viewDetails: "Подробнее",
      newBadge: "Новое",
      historyTitle: "Уведомления",
      historySubtitle:
        "Просматривайте обновления, фильтруйте по типу и управляйте получением.",
      pendingInvitationsTitle: "Приглашения в ожидании",
      pendingInvitationsSubtitle:
        "Примите или отклоните приглашения, прежде чем они появятся в дашборде.",
      preferencesTitle: "Настройки уведомлений",
      searchPlaceholder: "Поиск уведомлений",
      statusPlaceholder: "Статус",
      statusAll: "Все статусы",
      statusUnread: "Непрочитанные",
      statusRead: "Прочитанные",
      typePlaceholder: "Тип",
      typeAll: "Все типы",
      typeSuccess: "Успех",
      typeWarning: "Предупреждение",
      typeInfo: "Инфо",
      refresh: "Обновить",
      refreshing: "Обновление...",
      noMatches: "Нет уведомлений, подходящих под фильтры.",
      markRead: "Отметить как прочитанное",
      invitationEmpty: "Нет ожидающих приглашений.",
      invitationRoleEditor: "Редактор",
      invitationRoleViewer: "Просмотр",
      invitationDecline: "Отклонить",
      invitationAccept: "Принять",
      tripFallback: "Поездка",
      unknownDestination: "Неизвестное направление",
      invitedByFallback: "участник команды",
      invitedBy: (name: string, date: string) => `Пригласил(а) ${name} - ${date}`,
    },
    community: {
      title: "Лента сообщества",
      subtitle:
        "Делитесь местами, точками на карте и советами с другими путешественниками.",
      createTitle: "Поделитесь новым",
      createSubtitle: "Посты проходят проверку модераторов перед публикацией.",
      fields: {
        tag: "Тег",
        text: "Описание",
        mapUrl: "Ссылка на карту",
        image: "Фото",
      },
      placeholders: {
        tag: "Выберите тег",
        text: "Расскажите о месте или маршруте...",
        mapUrl: "Вставьте ссылку на Google Maps или OSM",
      },
      tabs: {
        feed: "Лента",
        mine: "Мои посты",
        saved: "Сохраненные",
      },
      tags: {
        place: "Место",
        map_point: "Точка на карте",
        landmark: "Достопримечательность",
        other: "Другое",
      },
      status: {
        pending: "На проверке",
        approved: "Одобрено",
        rejected: "Отклонено",
      },
      publish: "Отправить на проверку",
      posting: "Отправляем...",
      refresh: "Обновить",
      loading: "Загружаем посты...",
      emptyFeed: "Постов пока нет. Будьте первыми.",
      emptyMine: "У вас пока нет отправленных постов.",
      emptySaved: "Сохраненных постов пока нет.",
      viewMap: "Открыть карту",
      rejectionReason: "Причина",
      mediaHint: "Добавьте фото или ссылку на карту перед публикацией.",
      mediaImageHint: "Загрузите фото (JPG/PNG/WebP/GIF). Максимум 10 МБ.",
      mediaMapHint: "Добавьте ссылку на карту для точки или маршрута.",
      detailsTitle: "Детали поста",
      noMap: "Ссылка на карту не указана.",
      unknownAuthor: "Путешественник",
      profile: {
        title: "Профиль путешественника",
        subtitle: "Посты этого путешественника.",
        postsTitle: "Посты",
        postsEmpty: "Постов пока нет.",
      },
      toastSubmittedTitle: "Пост отправлен",
      toastSubmittedDescription: "Пост отправлен на модерацию.",
      toastErrorTitle: "Не удалось отправить пост",
      toastErrorDescription: "Попробуйте еще раз.",
      comments: {
        title: "Комментарии",
        placeholder: "Написать комментарий...",
        reply: "Ответить",
        submit: "Отправить",
        submitting: "Отправляем...",
        empty: "Комментариев пока нет.",
        loading: "Загружаем комментарии...",
        toastSuccessTitle: "Комментарий добавлен",
        toastSuccessDescription: "Комментарий опубликован.",
        toastErrorTitle: "Не удалось отправить комментарий",
        toastErrorDescription: "Попробуйте еще раз.",
      },
      actions: {
        edit: "Редактировать пост",
        delete: "Удалить пост",
        like: "Нравится",
        savePost: "Сохранить",
        save: "Сохранить изменения",
        cancel: "Отмена",
        saving: "Сохраняем...",
        confirmDelete: "Удалить этот пост? Действие невозможно отменить.",
        toastUpdatedTitle: "Пост обновлен",
        toastUpdatedDescription: "Изменения сохранены.",
        toastDeletedTitle: "Пост удален",
        toastDeletedDescription: "Пост удален.",
      },
      validation: {
        tagRequiredTitle: "Выберите тег",
        tagRequiredDescription: "Укажите, чем вы хотите поделиться.",
        textRequiredTitle: "Добавьте описание",
        textRequiredDescription: "Минимум 10 символов.",
        textProhibitedTitle: "Запрещенный текст",
        textProhibitedDescription: "Удалите запрещенные слова.",
        mediaRequiredTitle: "Нужно фото или ссылка",
        mediaRequiredDescription: "Прикрепите фото или ссылку на карту.",
        mapInvalidTitle: "Ссылка не подходит",
        mapInvalidDescription: "Используйте ссылку на Google Maps или OSM.",
        imageSizeTitle: "Слишком большой файл",
        imageSizeDescription: "Максимум 10 МБ.",
      },
    },
    moderation: {
      title: "Модерация",
      subtitle: "Проверяйте посты и принимайте решения.",
      loading: "Загружаем очередь...",
      empty: "Постов на проверке нет.",
      approve: "Одобрить",
      reject: "Отклонить",
      reasonPlaceholder: "Причина (необязательно)",
      toastApprovedTitle: "Пост одобрен",
      toastApprovedDescription: "Пост опубликован.",
      toastRejectedTitle: "Пост отклонен",
      toastRejectedDescription: "Автору отправлено уведомление.",
      toastErrorTitle: "Не удалось обновить пост",
      toastErrorDescription: "Попробуйте еще раз.",
    },
    admin: {
      title: "Админ-панель",
      subtitle: "Управляйте модераторами и правами.",
      loading: "Загружаем пользователей...",
      empty: "Пользователи не найдены.",
      refresh: "Обновить",
      searchPlaceholder: "Поиск по email",
      adminLabel: "Админ (полный доступ)",
      moderatorLabel: "Модератор",
      toastUpdatedTitle: "Модератор обновлен",
      toastUpdatedDescription: "Права сохранены.",
      toastErrorTitle: "Не удалось обновить",
      toastErrorDescription: "Попробуйте еще раз.",
    },
    onboarding: {
      stepLabel: (current: number, total: number) => `Шаг ${current} из ${total}`,
      next: "Далее",
      back: "Назад",
      done: "Готово",
      skip: "Пропустить",
      loadingHint: "Загружаем этот шаг. Если долго, нажмите \"Далее\".",
      steps: {
        welcome: {
          title: "Добро пожаловать в SoleilRoute",
          body:
            "Покажем ключевые инструменты, чтобы вы уверенно спланировали первую поездку.",
        },
        planTrip: {
          title: "Создайте первую поездку",
          body: "В Quick Actions задайте даты, направление и бюджет за пару кликов.",
        },
        trips: {
          title: "Управляйте поездками",
          body: "Здесь все активные поездки со статусами, участниками и прогрессом.",
        },
        budget: {
          title: "Планируйте бюджет",
          body: "Сравнивайте уровни бюджета и задавайте лимиты для поездок.",
        },
        visa: {
          title: "Проверьте визу",
          body:
            "Ищите визовые правила по гражданству и стране назначения, а потом сохраняйте результат.",
        },
        notifications: {
          title: "Будьте в курсе",
          body: "Получайте уведомления о визах, платежах и активности команды.",
        },
        settings: {
          title: "Профиль и настройки",
          body: "Меняйте данные аккаунта, тему и уведомления в любое время.",
        },
      },
    },
    help: {
      title: "Помощь и поддержка",
      subtitle: "Найдите быстрые ответы, устраните проблемы или свяжитесь с командой.",
      quickHelpTitle: "Быстрая помощь",
      quickHelpBody: "Посмотрите FAQ ниже с самыми частыми вопросами и решениями.",
      accountSettingsCta: "Настройки аккаунта",
      contactSupportTitle: "Связаться с поддержкой",
      contactSupportBody:
        "Напишите нам, и мы ответим в течение одного рабочего дня.",
      systemStatusTitle: "Статус системы",
      systemStatusBody: "Все сервисы работают.",
      statusButton: "Страница статуса",
      faqTitle: "FAQ по устранению проблем",
      faqs: [
        {
          question: "Как обновить данные аккаунта?",
          answer:
            "Откройте настройки аккаунта в меню профиля. Там можно изменить email, пароль и завершить другие сессии.",
        },
        {
          question: "Почему статус визы отмечен как неизвестный?",
          answer:
            "Мы показываем кэшированные данные, когда они доступны. Откройте страницу визы поездки, чтобы задать статус вручную, или дождитесь обновлений покрытия.",
        },
        {
          question: "Как сбросить бюджеты после изменения сумм?",
          answer:
            "Бюджетные позиции редактируются в каждой поездке. Используйте редактор бюджета, чтобы обновить суммы или удалить категории.",
        },
        {
          question: "Как выйти из всех устройств?",
          answer:
            "Перейдите в настройки аккаунта и выберите \"Выйти из других сессий\", чтобы отозвать все активные устройства.",
        },
      ],
    },
    supportDialog: {
      triggerButton: "Написать в поддержку",
      title: "Связаться с поддержкой",
      description: "Опишите детали, и мы ответим по email.",
      emailLabel: "Ваш email",
      emailPlaceholder: "you@example.com",
      subjectLabel: "Тема",
      subjectPlaceholder: "Проблема с бюджетами поездки",
      messageLabel: "Сообщение",
      messagePlaceholder: "Опишите проблему или запрос...",
      cancel: "Отмена",
      send: "Отправить",
      sending: "Отправка...",
      toastErrorTitle: "Не удалось отправить сообщение",
      toastErrorDescription: "Пожалуйста, попробуйте еще раз.",
      toastSuccessTitle: "Сообщение отправлено",
      toastSuccessDescription: "Поддержка скоро ответит.",
      validationEmail: "Введите корректный email.",
      validationSubject: "Тема должна быть не короче 3 символов.",
      validationMessage: "Сообщение должно быть не короче 10 символов.",
    },
    notificationPreferences: {
      emailTitle: "Email-уведомления",
      emailBody: "Получайте важные обновления по email.",
      inAppTitle: "Уведомления в приложении",
      inAppBody: "Показывать обновления в меню уведомлений.",
      save: "Сохранить настройки",
      saving: "Сохраняем...",
      toastSuccessTitle: "Настройки обновлены",
      toastSuccessDescription: "Ваши настройки уведомлений сохранены.",
      toastErrorTitle: "Не удалось обновить",
      toastErrorDescription: "Мы не смогли сохранить настройки.",
    },
    dashboardOverview: {
      stats: {
        totalBudgetLabel: "Общий бюджет",
        totalBudgetHelper: "По всем активным поездкам",
        activeTripsLabel: "Активные поездки",
        activeTripsHelper: "Поездки, созданные в SoleilRoute",
        paidInvoicesLabel: "Оплачено",
        paidInvoicesHelper: "Отмечено как оплачено по категориям",
        outstandingLabel: "Остаток",
        outstandingHelper: "Осталось распределить",
        upcomingTripsLabel: "Предстоящие поездки",
        upcomingTripsHelper: "Стартуют в ближайшие 30 дней",
        overBudgetLabel: "Перерасход",
        overBudgetHelper: "План выше общего бюджета",
      },
    },
    quickActions: {
      title: "Быстрые действия",
      dialogTitle: "Новая поездка",
      dialogDescription:
        "Заполните детали поездки, и мы рассчитаем стартовый бюджет и визовые требования.",
      actions: {
        planTripTitle: "Новая поездка",
        planTripDescription:
          "Создайте маршрут с категориями бюджета и проверкой визы.",
        reviewBudgetsTitle: "План бюджета",
        reviewBudgetsDescription:
          "Оцените бюджет по направлениям и стилю поездки.",
        checkVisaTitle: "Проверить визу",
        checkVisaDescription:
          "Проверьте визовые требования перед бронированием.",
      },
    },
    tripForm: {
      submitDefault: "Создать поездку",
      submitting: "Создаем поездку...",
      createSuccessTitle: "Поездка создана",
      createSuccessDescription: "Мы подготовили начальный бюджет и список виз.",
      createErrorTitle: "Что-то пошло не так",
      createErrorDescription:
        "Не удалось сохранить поездку. Попробуйте еще раз.",
      fields: {
        nameLabel: "Название поездки",
        citizenshipLabel: "Гражданство",
        destinationCountryLabel: "Страна назначения",
        destinationCityLabel: "Город назначения",
        startDateLabel: "Дата начала",
        endDateLabel: "Дата окончания",
        totalBudgetLabel: "Общий бюджет",
        travelStyleLabel: "Стиль поездки",
        currencyLabel: "Валюта поездки",
        baseCurrencyLabel: "Базовая валюта",
        notesLabel: "Заметки",
      },
      placeholders: {
        name: "Лето в Токио",
        destinationCountry: "Япония",
        destinationCity: "Токио",
        notes: "Типы виз, ключевые места или важные напоминания...",
        selectCitizenship: "Выберите гражданство",
        searchCountries: "Поиск стран",
        currency: "Валюта",
        baseCurrency: "Базовая валюта",
        travelStyle: "Выберите стиль",
      },
      autoSplitMessage: (count: number, categories: string) =>
        `Мы автоматически распределим бюджет по ${count} категориям: ${categories}. Изменяйте распределение в дашборде поездки.`,
      validation: {
        nameMin: "Название поездки должно быть не короче 3 символов.",
        destinationCountryRequired: "Страна назначения обязательна.",
        destinationCityRequired: "Город назначения обязателен.",
        startDateInvalid: "Введите корректную дату начала.",
        startDateRequired: "Дата начала обязательна.",
        endDateInvalid: "Введите корректную дату окончания.",
        endDateRequired: "Дата окончания обязательна.",
        totalBudgetInvalid: "Бюджет должен быть числом.",
        totalBudgetPositive: "Бюджет должен быть больше нуля.",
        currencyLength: "Валюта должна быть 3-буквенным ISO кодом.",
        citizenshipRequired: "Введите гражданство.",
        baseCurrencyLength: "Базовая валюта должна быть 3-буквенным ISO кодом.",
        travelStyleRequired: "Стиль поездки обязателен.",
        endDateAfterStart: "Дата окончания должна быть после даты начала.",
      },
    },
    tripDetailsEditor: {
      trigger: "Редактировать поездку",
      title: "Редактировать поездку",
      description:
        "Обновите ключевые данные. Бюджетные позиции сохраняются, пока вы их не измените.",
      cancel: "Отмена",
      save: "Сохранить",
      saving: "Сохраняем...",
      toastSuccessTitle: "Поездка обновлена",
      toastSuccessDescription: "Данные поездки обновлены.",
      toastErrorTitle: "Не удалось сохранить",
      toastErrorDescription: "Не удалось сохранить изменения.",
    },
    tripList: {
      emptyTitle: "Пока нет поездок",
      emptyDescription:
        "Создайте первую поездку, чтобы открыть аналитику бюджета и виз.",
      openTrip: "Открыть поездку",
      manageBudget: "Управлять бюджетом",
      visaChecklist: "Визовый чеклист",
      deleteTrip: "Удалить поездку",
      deleting: "Удаляем...",
      confirmDelete:
        "Удалить эту поездку? Все бюджетные позиции будут удалены.",
      sharedLabel: (role: string) => `Совместно (${role})`,
      budgetProgressLabel: "Прогресс бюджета",
      budgetProgressSummary: (percent: number) =>
        `${percent}% бюджета отмечено как оплаченное.`,
      toastDeleteTitle: "Поездка удалена",
      toastDeleteDescription: "Поездка была удалена.",
      toastDeleteErrorTitle: "Не удалось удалить поездку",
      toastDeleteErrorDescription: "Пожалуйста, попробуйте позже.",
    },
    tripsView: {
      pageDescription:
        "Все ваши маршруты здесь. Откройте поездку, чтобы уточнить бюджет и задачи по визе.",
      searchPlaceholder: "Поиск по поездкам, городам или странам",
      statusPlaceholder: "Статус визы",
      statusAll: "Все статусы визы",
      sortPlaceholder: "Сортировать",
      sortOptions: {
        upcoming: "Дата начала (скоро)",
        latest: "Дата начала (позже)",
        ending: "Дата окончания (скоро)",
        name: "Название А-Я",
        visa_status: "Приоритет статуса визы",
        budget_high: "Бюджет (сначала больше)",
        budget_low: "Бюджет (сначала меньше)",
      },
      resetFilters: "Сбросить фильтры",
    },
    tripOverview: {
      backToTrips: "Назад к поездкам",
      sharedEditor: "Совместно (Редактор)",
      sharedViewer: "Совместно (Просмотр)",
      detailsTitle: "Детали поездки",
      detailLabels: {
        dates: "Даты",
        destination: "Направление",
        citizenship: "Гражданство",
        totalBudget: "Общий бюджет",
        spentPaid: "Потрачено (оплачено)",
        visaStatus: "Статус визы",
        baseCurrency: "Базовая валюта",
      },
      notesTitle: "Заметки",
      notesEmpty: "Заметок пока нет.",
      ownerFallback: "владелец",
      collaboratorUnknown: "неизвестно",
    },
    tripBudgetPage: {
      backToOverview: "Обзор поездки",
      title: "Разбивка бюджета",
    },
    tripBudget: {
      progressTitle: "Прогресс бюджета",
      paidSoFar: "Оплачено",
      progressSummary: (percent: number, planned: string) =>
        `${percent}% бюджета отмечено как оплачено. Планируемые траты: ${planned}.`,
    },
    budget: {
      categories: {
        transport: "Транспорт",
        accommodation: "Проживание",
        food: "Питание",
        activities: "Активности",
        visa: "Виза",
        other: "Другое",
      },
    },
    budgetChart: {
      title: "Обзор бюджета",
      description:
        "Сравнивайте запланированные и оплаченные расходы по категориям.",
      plannedLabel: "Запланировано",
      paidLabel: "Оплачено",
    },
    budgetItems: {
      title: "Бюджетные позиции",
      summaryPlanned: "Запланировано",
      summaryPaid: "Оплачено",
      summaryRemaining: "Осталось",
      summaryOverBudget: "Перерасход",
      summaryOutstanding: "к оплате",
      noItems: "Пока нет позиций бюджета. Добавьте первую запись ниже.",
      categoryLabel: "Категория",
      descriptionLabel: "Описание",
      amountLabel: "Сумма",
      paidLabel: "Оплачено",
      savedLabel: "Сохранено",
      remove: "Удалить",
      saveChanges: "Сохранить",
      saving: "Сохраняем...",
      addTitle: "Добавить позицию",
      addButton: "Добавить",
      adding: "Добавляем...",
      newDescriptionPlaceholder: "Такси в аэропорт, проживание",
      editDescriptionPlaceholder:
        "Депозит за отель, проездной, билеты в музей",
      viewOnly: "У вас доступ только для просмотра.",
      confirmDelete: "Удалить эту позицию бюджета? Отменить нельзя.",
      toastInvalidAmountTitle: "Неверная сумма",
      toastInvalidAmountDescription: "Сумма должна быть больше нуля.",
      toastSaveTitle: "Бюджет обновлен",
      toastSaveDescription: "Изменения сохранены.",
      toastSaveErrorTitle: "Не удалось сохранить",
      toastSaveErrorDescription: "Не удалось сохранить изменения.",
      toastToggleErrorTitle: "Не удалось обновить",
      toastToggleErrorDescription: "Не удалось обновить статус оплаты.",
      toastAddTitle: "Позиция добавлена",
      toastAddDescription: "Новая запись добавлена в список.",
      toastAddErrorTitle: "Не удалось добавить",
      toastAddErrorDescription: "Пожалуйста, попробуйте еще раз.",
      toastDeleteTitle: "Позиция удалена",
      toastDeleteDescription: "Запись удалена.",
      toastDeleteErrorTitle: "Не удалось удалить",
      toastDeleteErrorDescription: "Пожалуйста, попробуйте позже.",
    },
    budgetCaps: {
      title: "Лимиты расходов",
      description:
        "Установите лимиты по категориям, чтобы держать расходы в рамках.",
      plannedLabel: "Запланировано",
      capLabel: "Лимит",
      noCap: "Без лимита",
      overBy: "Превышение",
      capInputLabel: "Лимит",
      saveCaps: "Сохранить лимиты",
      saving: "Сохраняем...",
      viewOnly: "У вас доступ только для просмотра.",
      toastSuccessTitle: "Лимиты сохранены",
      toastSuccessDescription: "Лимиты по категориям обновлены.",
      toastErrorTitle: "Не удалось сохранить лимиты",
      toastErrorDescription: "Пожалуйста, попробуйте еще раз.",
    },
    budgetPlanner: {
      title: "Планировщик бюджета",
      description:
        "Оцените дневные расходы на человека и распределите бюджет по категориям.",
      destinationLabel: "Страна назначения",
      destinationPlaceholder: "Выберите страну",
      destinationSearchPlaceholder: "Поиск стран",
      travelStyleLabel: "Стиль поездки",
      travelStylePlaceholder: "Выберите стиль",
      tripLengthLabel: "Длительность (дней)",
      travelersLabel: "Путешественники",
      dailyEstimateTitle: "Дневная оценка",
      dailyEstimateNote: (currency: string) =>
        `На человека в день, в валюте ${currency}.`,
      totalEstimateTitle: "Общая оценка",
      totalEstimateNote: (days: number, travelers: number) =>
        `${days} дней, ${travelers} человек.`,
      categorySplitTitle: "Распределение по категориям",
      highlightsTitle: "Что посмотреть",
      notesTitle: "Заметки",
      notesFallback: "Учитывайте сезонность.",
      estimatesFootnote: "Оценки без учета перелетов и страховки.",
      tierTitle: "Сравнение уровней",
      tierDescription: "Сравните уровни бюджета для выбранного направления.",
      tierSelected: "Выбрано",
      tierPerDay: "В день",
      tierPerTrip: "Итого",
      tierBadgesTitle: "Стиль поездки",
      tiers: {
        budget: {
          label: "Эконом",
          description: "Базовые расходы и простое размещение.",
        },
        mid: {
          label: "Средний",
          description: "Комфорт и активности в балансе.",
        },
        luxury: {
          label: "Премиум",
          description: "Лучшие отели и впечатления.",
        },
      },
      noMatches: "Совпадений нет.",
    },
    visa: {
      statuses: {
        unknown: "Неизвестно",
        required: "Виза требуется",
        in_progress: "В процессе",
        approved: "Одобрено",
        not_required: "Не требуется",
      },
    },
    visaChecker: {
      title: "Визовые требования",
      description: "Проверьте визовые требования до бронирования.",
      citizenshipLabel: "Гражданство",
      destinationLabel: "Страна назначения",
      citizenshipSearchPlaceholder: "Поиск стран",
      destinationSearchPlaceholder: "Поиск направлений",
      destinationPlaceholder: "Выберите направление",
      noMatches: "Совпадений нет.",
      noDestinations: "Нет доступных направлений.",
      checkButton: "Проверить требования",
      checking: "Проверяем...",
      addToTrip: "Добавить в поездку",
      createTripTitle: "Создать поездку",
      createTripDescription:
        "Мы заполнили гражданство и направление для старта.",
      tripName: (destination: string) => `Поездка в ${destination}`,
      toastMissingTitle: "Не хватает данных",
      toastMissingDescription: "Выберите гражданство и направление.",
      toastErrorTitle: "Не удалось проверить",
      toastErrorDescription: "Не удалось загрузить визовые требования.",
      resultsNote:
        "Результаты объединяют Passport Index и базу SoleilRoute. Добавьте в поездку, чтобы получать обновления.",
      emptyState:
        "Пока нет данных по этому направлению. Добавьте поездку, чтобы запустить проверку через Passport Index.",
      resultStatusRequired: "Виза требуется",
      resultStatusFree: "Въезд без визы",
      badgeRequired: "Виза требуется",
      badgeNotRequired: "Виза не требуется",
      detailVisaType: "Тип визы",
      detailValidity: "Срок действия",
      detailProcessing: "Срок рассмотрения",
      detailCost: "Стоимость",
      noFee: "Без сбора",
      viewEmbassy: "Сайт посольства",
      lastCheckedLabel: "Проверено",
      sourceLabel: "Источник",
      insightsTitle: "Информация о стране",
      insightsCurrency: "Валюта",
      insightsLanguages: "Языки",
      insightsTimezones: "Часовые пояса",
      insightsCallingCodes: "Телефонные коды",
      insightsCapital: "Столица",
    },
    visaStatusEditor: {
      currentStatusLabel: "Текущий статус",
      selectPlaceholder: "Выберите статус",
      lastCheckedLabel: "Проверено",
      noChecks: "Нет недавних проверок визы.",
      toastSuccessTitle: "Статус визы обновлен",
      toastSuccessDescription: "Сохранено.",
      toastErrorTitle: "Не удалось обновить",
      toastErrorDescription: "Не удалось обновить статус визы.",
    },
    tripVisaPage: {
      backToOverview: "Обзор поездки",
      title: "Визовый чеклист",
      subtitle: (citizenship: string, destination: string) =>
        `из ${citizenship} в ${destination}`,
      requirementsTitle: "Требования",
      visaRequired: "Виза требуется",
      visaNotRequired: "Виза не требуется",
      detailValidity: "Срок действия",
      detailProcessing: "Срок рассмотрения",
      detailCost: "Оценочная стоимость",
      detailEmbassy: "Ссылка на посольство",
      embassyLink: "Перейти на сайт",
      noFee: "Без сбора",
      noCache:
        "Пока нет данных по этому направлению. Добавьте поездку, и мы получим детали, когда интеграции будут подключены.",
    },
    timeline: {
      title: "Планировщик сроков",
      description:
        "Отмечайте ключевые этапы и напоминания о платежах по датам поездки.",
      empty: "Пока нет пунктов. Добавьте первый этап ниже.",
      fieldTitle: "Название",
      fieldDueDate: "Срок",
      fieldType: "Тип",
      fieldAmount: "Сумма",
      fieldNotes: "Заметки",
      typeMilestone: "Этап",
      typePayment: "Напоминание о платеже",
      statusCompleted: "Выполнено",
      statusPending: "В ожидании",
      notesPlaceholder: "Напоминания, ссылки или задачи",
      itemSaved: "Сохранено",
      remove: "Удалить",
      saveChanges: "Сохранить",
      saving: "Сохраняем...",
      addTitle: "Добавить пункт",
      addButton: "Добавить",
      adding: "Добавляем...",
      newTitlePlaceholder: "Билеты, депозит отеля, музейные билеты",
      newNotesPlaceholder: "Добавьте короткое напоминание или список.",
      optionalAmount: "Необязательно",
      viewOnly: "У вас доступ только для просмотра.",
      confirmDelete: "Удалить этот пункт? Отменить нельзя.",
      toastMissingDetailsTitle: "Не хватает данных",
      toastMissingDetailsDescription:
        "Добавьте название и дату перед сохранением.",
      toastInvalidAmountTitle: "Неверная сумма",
      toastInvalidAmountDescription: "Сумма должна быть больше нуля.",
      toastUpdateTitle: "Таймлайн обновлен",
      toastUpdateDescription: "Изменения сохранены.",
      toastUpdateErrorTitle: "Не удалось сохранить",
      toastUpdateErrorDescription: "Не удалось сохранить изменения.",
      toastAddTitle: "Пункт добавлен",
      toastAddDescription: "Новый пункт добавлен в список.",
      toastAddErrorTitle: "Не удалось добавить",
      toastAddErrorDescription: "Пожалуйста, попробуйте еще раз.",
      toastDeleteTitle: "Пункт удален",
      toastDeleteDescription: "Пункт удален.",
      toastDeleteErrorTitle: "Не удалось удалить",
      toastDeleteErrorDescription: "Пожалуйста, попробуйте позже.",
      toastStatusErrorTitle: "Не удалось обновить",
      toastStatusErrorDescription: "Не удалось обновить статус.",
      dueNoDate: "Нет даты",
      dueOverdue: (days: number) => `Просрочено на ${days}д`,
      dueIn: (days: number) => `Срок через ${days}д`,
    },
    collaborators: {
      title: "Совместная работа",
      description:
        "Поделитесь поездкой с участниками и управляйте правами доступа.",
      youLabel: "(Вы)",
      addedLabel: (date: string) => `Добавлен ${date}`,
      ownerLabel: "Владелец",
      roleEditor: "Редактор",
      roleViewer: "Просмотр",
      remove: "Удалить",
      pendingTitle: "Ожидающие приглашения",
      pendingInvite: (role: string, date: string) =>
        `${role} приглашение - ${date}`,
      pendingLabel: "Ожидает ответа",
      inviteTitle: "Пригласить участника",
      emailLabel: "Email",
      emailPlaceholder: "teammate@example.com",
      roleLabel: "Роль",
      sendInvite: "Отправить приглашение",
      inviting: "Отправляем...",
      viewOnly: "Только владелец может управлять участниками.",
      confirmRemove:
        "Удалить участника? Он потеряет доступ к поездке.",
      toastMissingEmailTitle: "Не указан email",
      toastMissingEmailDescription: "Введите email для приглашения.",
      toastInviteTitle: "Приглашение отправлено",
      toastInviteDescription: "Доступ появится после подтверждения.",
      toastInviteErrorTitle: "Не удалось отправить",
      toastInviteErrorDescription: "Проверьте email и попробуйте снова.",
      toastRoleTitle: "Роль обновлена",
      toastRoleDescription: "Права обновлены.",
      toastRoleErrorTitle: "Не удалось обновить роль",
      toastRoleErrorDescription: "Пожалуйста, попробуйте еще раз.",
      toastRemoveTitle: "Участник удален",
      toastRemoveDescription: "Доступ отозван.",
      toastRemoveErrorTitle: "Не удалось удалить участника",
      toastRemoveErrorDescription: "Пожалуйста, попробуйте позже.",
    },
  },
  fr: {
    common: {
      languageLabel: "Langue",
      orLabel: "ou",
      newLabel: "Nouveau",
      closeLabel: "Fermer",
      justNow: "A l'instant",
    },
    site: {
      description:
        "Planification de voyage intelligente avec budgets en temps reel, guide visa et intelligence des devises.",
    },
    navigation: {
      features: "Fonctionnalites",
      howItWorks: "Comment ca marche",
      pricing: "Tarifs",
      faqs: "FAQ",
      signIn: "Se connecter",
      createAccount: "Creer un compte gratuit",
      startPlanning: "Commencer gratuitement",
      exploreFeatures: "Decouvrir les fonctionnalites",
      home: "Accueil",
      dashboard: "Tableau de bord",
      trips: "Voyages",
      budgetPlanner: "Planificateur de budget",
      visaChecker: "Verification visa",
      community: "Communaute",
      moderation: "Moderation",
      admin: "Admin",
      notifications: "Notifications",
      settings: "Parametres",
      help: "Aide",
    },
    hero: {
      pill: "Planification de voyage intelligente, etape par etape",
      title:
        "Concevez des voyages inoubliables avec des budgets en temps reel et une clarte sur les visas",
      description:
        "SoleilRoute combine l'intelligence monetaire, l'automatisation des visas et des itineraires collaboratifs pour que vos voyages soient organises, conformes et dans le budget avant meme de faire vos valises.",
      highlightOne: "Donnees pretes pour les visas dans 190+ pays",
      highlightTwo: "Itineraires collaboratifs avec controle du budget",
      trustTitle: "Pourquoi les equipes font confiance a SoleilRoute",
      trustBullets: [
        "90 % des voyageurs restent dans leur budget grace aux previsions de depenses automatisees.",
        "Les exigences de visa se mettent a jour toutes les 12 heures via Passport Index.",
        "Taux de change suivis sur 180+ devises avec alertes.",
      ],
      noCreditCard: "Aucune carte bancaire requise. Annulable a tout moment.",
    },
    features: {
      heading: "Tout ce dont vous avez besoin pour orchestrer des voyages plus intelligents",
      subheading:
        "Planifiez, budgetisez et executez les itineraires avec un seul hub collaboratif.",
      items: [
        {
          title: "Intelligence visa",
          description:
            "Verifiez instantanement les exigences de visa, delais, frais et liens d'ambassades pour toute destination.",
        },
        {
          title: "Automatisation du budget",
          description:
            "Fixez des plafonds, suivez les paiements et visualisez les depenses par categorie avec des tableaux Recharts.",
        },
        {
          title: "Planification chronologique",
          description:
            "Gardez les itineraires organises avec des jalons dates et des rappels de paiement.",
        },
        {
          title: "Espace collaboratif",
          description:
            "Partagez les itineraires, assignez des taches et recevez des mises a jour avec un acces securise.",
        },
      ],
    },
    howItWorks: {
      heading: "Planifiez en trois phases structurees",
      subheading:
        "Cartographiez le voyage parfait de l'idee a l'execution avec un workflow guide.",
      steps: [
        {
          title: "Creez votre voyage",
          body: "Ajoutez votre destination, dates de voyage, budget et citoyennete. SoleilRoute synchronise les exigences de visa et les taux de conversion en quelques secondes.",
        },
        {
          title: "Repartissez votre budget",
          body: "Distribuez les fonds entre transport, hebergement, nourriture, activites, visas et extras. Suivez les paiements et les elements en attente dans une seule vue.",
        },
        {
          title: "Restez conforme et informe",
          body: "Recevez des alertes de visa, des mises a jour de politiques et des rappels de paiement. Exportez les itineraires ou partagez les tableaux de bord instantanement.",
        },
      ],
      stepLabel: (step: number) => `Etape ${step}`,
    },
    pricing: {
      heading: "Des tarifs qui evoluent avec vos aventures",
      subheading:
        "Des outils puissants avec une tarification transparente. Passez a niveau a tout moment.",
      popular: "Populaire",
      plans: [
        {
          name: "Starter",
          price: "Gratuit",
          description:
            "Parfait pour les voyageurs curieux qui planifient leur prochain voyage.",
          features: [
            "Jusqu'a 2 voyages actifs",
            "Suivi du budget avec des limites par categorie",
            "Recommandations de visa pour les 20 meilleures destinations",
            "Rappels email pour les paiements",
          ],
          cta: "Commencer gratuitement",
        },
        {
          name: "Pro",
          price: "$12",
          period: "par mois",
          description:
            "Workflows avances pour les voyageurs frequents et les equipes.",
          features: [
            "Voyages actifs illimites",
            "Tableaux de bord partages et edition collaborative",
            "Intelligence visa complete avec liens d'ambassades",
            "Declencheurs de devise et validations de depenses",
            "Exports PDF et branding personnalise",
          ],
          cta: "Commencer l'essai de 14 jours",
        },
        {
          name: "Enterprise",
          price: "Sur mesure",
          description: "Conformite et reporting pour les equipes operationnelles.",
          features: [
            "Responsable succes dedie",
            "SAML SSO et controle d'acces par role",
            "Integrations financieres et politiques",
            "Support prioritaire et onboarding",
          ],
          cta: "Contacter les ventes",
        },
      ],
    },
    faqs: {
      heading: "Reponses pour les voyageurs curieux",
      subheading:
        "Tout ce que vous devez savoir avant de lancer votre prochain voyage.",
      items: [
        {
          question: "Quels pays sont pris en charge pour la verification des visas ?",
          answer:
            "Nous maintenons des informations de visa pour 190+ destinations basees sur Passport Index et notre equipe de conformite. Chaque resultat inclut le statut, le type, la validite, les couts et des liens d'ambassades.",
        },
        {
          question: "Quelle est la precision des conversions de devises ?",
          answer:
            "Les mises a jour des taux ont lieu toutes les 4 heures via ExchangeRate API. Vous pouvez verrouiller un taux par voyage et suivre les depenses dans la devise du voyage et votre devise de base.",
        },
        {
          question: "Puis-je inviter mon equipe ou mes compagnons de voyage ?",
          answer:
            "Oui. SoleilRoute offre un partage securise avec acces par role. Invitez des lecteurs ou co-planificateurs, definissez les permissions et collaborez sur itineraires, budgets et documents de visa.",
        },
        {
          question: "Proposez-vous des exports PDF ou des rapports ?",
          answer:
            "Les plans Pro incluent des exports PDF en un clic des itineraires, resumes de budget, echeances de paiement et exigences de visa.",
        },
      ],
    },
    footer: {
      product: "Produit",
      resources: "Ressources",
      company: "Entreprise",
      links: {
        features: "Fonctionnalites",
        pricing: "Tarifs",
        releaseNotes: "Notes de version",
        documentation: "Documentation",
        support: "Support",
        blog: "Blog",
        about: "A propos",
        careers: "Carrieres",
        contact: "Contact",
      },
      legal: {
        privacy: "Confidentialite",
        terms: "Conditions",
        status: "Statut",
        rights: "Tous droits reserves.",
      },
    },
    auth: {
      login: {
        title: "Bon retour",
        subtitle: "Connectez-vous pour acceder a vos tableaux de bord de voyage.",
        googleButton: "Continuer avec Google",
        divider: "ou",
        noAccount: "Pas de compte ?",
        createAccount: "Creer un compte",
        submit: "Se connecter",
        submitting: "Connexion...",
        emailLabel: "Email",
        passwordLabel: "Mot de passe",
        placeholderEmail: "you@example.com",
        placeholderPassword: "********",
        toast: {
          errorTitle: "Impossible de se connecter",
          errorDescription: "Veuillez verifier vos identifiants.",
          successTitle: "Bon retour",
          successDescription: "Vous etes maintenant connecte.",
        },
        validation: {
          email: "Entrez une adresse email valide.",
          password: "Le mot de passe doit contenir au moins 6 caracteres.",
        },
      },
      register: {
        title: "Rejoignez SoleilRoute",
        subtitle: "Gerez visas, budgets et itineraires en quelques minutes.",
        googleButton: "S'inscrire avec Google",
        divider: "ou",
        haveAccount: "Vous avez deja un compte ?",
        signIn: "Se connecter",
        submit: "Creer un compte",
        submitting: "Creation du compte...",
        emailLabel: "Email",
        passwordLabel: "Mot de passe",
        confirmLabel: "Confirmer le mot de passe",
        placeholderEmail: "you@example.com",
        placeholderPassword: "********",
        placeholderConfirm: "********",
        toast: {
          errorTitle: "Impossible de s'inscrire",
          errorDescription: "Erreur inattendue. Veuillez reessayer.",
        },
        validation: {
          email: "Entrez une adresse email valide.",
          password: "Le mot de passe doit comporter au moins 8 caracteres.",
          confirm: "Les mots de passe ne correspondent pas.",
        },
      },
    },
    dashboard: {
      headerTitle: "Tableau de bord",
      headerSubtitle:
        "Suivez vos voyages a venir, budgets et exigences de visa.",
      signedInAs: "Connecte en tant que",
      accountSettings: "Parametres du compte",
      themeLight: "Passer en mode clair",
      themeDark: "Passer en mode sombre",
      help: "Aide",
      signOut: "Se deconnecter",
      home: "Accueil",
      workspaceTitle: "Espace de travail",
      needHelp: "Besoin d'aide ?",
    },
    settings: {
      title: "Parametres du compte",
      subtitle: "Mettez a jour votre profil, mot de passe et sessions actives.",
      profileTitle: "Profil",
      passwordTitle: "Mot de passe",
      sessionsTitle: "Sessions",
    },
    profileForm: {
      emailLabel: "Email",
      displayNameLabel: "Nom",
      avatarLabel: "Avatar",
      avatarAlt: "Avatar du profil",
      avatarPlaceholder: "Pas d'avatar",
      save: "Enregistrer les modifications",
      saving: "Enregistrement...",
      toastErrorTitle: "Impossible de mettre a jour l'email",
      toastErrorDescription: "Veuillez reessayer.",
      toastSuccessTitle: "Profil mis a jour",
      toastSuccessDescription: "Votre adresse email a ete enregistree.",
      validationEmail: "Entrez une adresse email valide.",
      validationDisplayName: "Le nom doit comporter au moins 2 caracteres.",
    },
    passwordForm: {
      currentLabel: "Mot de passe actuel",
      newLabel: "Nouveau mot de passe",
      confirmLabel: "Confirmer le nouveau mot de passe",
      save: "Mettre a jour le mot de passe",
      saving: "Enregistrement...",
      toastErrorTitle: "Impossible de mettre a jour le mot de passe",
      toastErrorDescription: "Veuillez reessayer.",
      toastSuccessTitle: "Mot de passe mis a jour",
      toastSuccessDescription:
        "Utilisez le nouveau mot de passe lors de la prochaine connexion.",
      validationCurrent: "Entrez votre mot de passe actuel.",
      validationNew: "Le mot de passe doit comporter au moins 8 caracteres.",
      validationConfirm: "Les mots de passe ne correspondent pas.",
    },
    sessionsForm: {
      activeLabel: "Sessions actives",
      revoke: "Se deconnecter des autres sessions",
      revoking: "Revocation...",
      toastErrorTitle: "Impossible de revoquer les sessions",
      toastErrorDescription: "Veuillez reessayer.",
      toastSuccessTitle: "Sessions revoquees",
      toastSuccessDescription: "Deconnexion des autres appareils.",
    },
    notifications: {
      menuTitle: "Notifications",
      markAllRead: "Tout marquer comme lu",
      loading: "Chargement des notifications...",
      empty: "Aucune notification pour le moment.",
      viewAll: "Voir toutes les notifications",
      viewDetails: "Voir les details",
      newBadge: "Nouveau",
      historyTitle: "Notifications",
      historySubtitle:
        "Consultez les mises a jour, filtrez par type et gerez la reception des alertes.",
      pendingInvitationsTitle: "Invitations en attente",
      pendingInvitationsSubtitle:
        "Acceptez ou refusez les invitations avant qu'elles n'apparaissent dans votre tableau de bord.",
      preferencesTitle: "Preferences de notification",
      searchPlaceholder: "Rechercher des notifications",
      statusPlaceholder: "Statut",
      statusAll: "Tous les statuts",
      statusUnread: "Non lues",
      statusRead: "Lues",
      typePlaceholder: "Type",
      typeAll: "Tous les types",
      typeSuccess: "Succes",
      typeWarning: "Avertissement",
      typeInfo: "Info",
      refresh: "Actualiser",
      refreshing: "Actualisation...",
      noMatches: "Aucune notification ne correspond a vos filtres.",
      markRead: "Marquer comme lu",
      invitationEmpty: "Aucune invitation de voyage en attente.",
      invitationRoleEditor: "Editeur",
      invitationRoleViewer: "Lecteur",
      invitationDecline: "Refuser",
      invitationAccept: "Accepter",
      tripFallback: "Voyage",
      unknownDestination: "Destination inconnue",
      invitedByFallback: "collaborateur",
      invitedBy: (name: string, date: string) => `Invite par ${name} - ${date}`,
    },
    community: {
      title: "Fil de communaute",
      subtitle: "Partagez des lieux, des points et des astuces.",
      createTitle: "Partager quelque chose",
      createSubtitle: "Les posts sont verifies avant publication.",
      fields: {
        tag: "Tag",
        text: "Votre message",
        mapUrl: "Lien carte",
        image: "Photo",
      },
      placeholders: {
        tag: "Choisir un tag",
        text: "Partagez votre decouverte...",
        mapUrl: "Lien Google Maps ou OSM",
      },
      tabs: {
        feed: "Fil",
        mine: "Mes posts",
        saved: "Enregistres",
      },
      tags: {
        place: "Lieu",
        map_point: "Point carte",
        landmark: "Monument",
        other: "Autre",
      },
      status: {
        pending: "En attente",
        approved: "Approuve",
        rejected: "Refuse",
      },
      publish: "Envoyer",
      posting: "Envoi...",
      refresh: "Actualiser",
      loading: "Chargement des posts...",
      emptyFeed: "Aucun post pour le moment.",
      emptyMine: "Aucun post soumis.",
      emptySaved: "Aucun post enregistre.",
      viewMap: "Ouvrir la carte",
      rejectionReason: "Raison",
      mediaHint: "Ajoutez une photo ou un lien carte.",
      mediaImageHint: "Photo (JPG/PNG/WebP/GIF), 10 MB max.",
      mediaMapHint: "Lien carte pour un point ou itineraire.",
      detailsTitle: "Details du post",
      noMap: "Aucun lien de carte.",
      unknownAuthor: "Voyageur",
      profile: {
        title: "Profil du voyageur",
        subtitle: "Publications partagees par ce voyageur.",
        postsTitle: "Publications",
        postsEmpty: "Pas encore de publications.",
      },
      toastSubmittedTitle: "Post envoye",
      toastSubmittedDescription: "Votre post est en attente.",
      toastErrorTitle: "Impossible d'envoyer",
      toastErrorDescription: "Veuillez reessayer.",
      comments: {
        title: "Commentaires",
        placeholder: "Ecrire un commentaire...",
        reply: "Repondre",
        submit: "Publier",
        submitting: "Envoi...",
        empty: "Pas encore de commentaires.",
        loading: "Chargement des commentaires...",
        toastSuccessTitle: "Commentaire publie",
        toastSuccessDescription: "Votre commentaire est visible.",
        toastErrorTitle: "Impossible d'envoyer",
        toastErrorDescription: "Veuillez reessayer.",
      },
      actions: {
        edit: "Modifier le post",
        delete: "Supprimer le post",
        like: "J'aime",
        savePost: "Enregistrer",
        save: "Enregistrer",
        cancel: "Annuler",
        saving: "Enregistrement...",
        confirmDelete: "Supprimer ce post ? Action irreversible.",
        toastUpdatedTitle: "Post mis a jour",
        toastUpdatedDescription: "Modifications enregistrees.",
        toastDeletedTitle: "Post supprime",
        toastDeletedDescription: "Le post a ete supprime.",
      },
      validation: {
        tagRequiredTitle: "Choisir un tag",
        tagRequiredDescription: "Indiquez le type de partage.",
        textRequiredTitle: "Ajoutez une description",
        textRequiredDescription: "Minimum 10 caracteres.",
        textProhibitedTitle: "Texte interdit",
        textProhibitedDescription: "Supprimez les mots offensants.",
        mediaRequiredTitle: "Photo ou lien requis",
        mediaRequiredDescription: "Ajoutez une photo ou un lien carte.",
        mapInvalidTitle: "Lien invalide",
        mapInvalidDescription: "Utilisez Google Maps ou OSM.",
        imageSizeTitle: "Image trop grande",
        imageSizeDescription: "Taille max 10 MB.",
      },
    },
    moderation: {
      title: "Moderation",
      subtitle: "Validez ou refusez les posts.",
      loading: "Chargement de la moderation...",
      empty: "Aucun post en attente.",
      approve: "Approuver",
      reject: "Refuser",
      reasonPlaceholder: "Raison (optionnel)",
      toastApprovedTitle: "Post approuve",
      toastApprovedDescription: "Le post est publie.",
      toastRejectedTitle: "Post refuse",
      toastRejectedDescription: "Auteur notifie.",
      toastErrorTitle: "Erreur",
      toastErrorDescription: "Veuillez reessayer.",
    },
    admin: {
      title: "Admin",
      subtitle: "Gestion des moderateurs.",
      loading: "Chargement des utilisateurs...",
      empty: "Aucun utilisateur.",
      refresh: "Actualiser",
      searchPlaceholder: "Recherche par email",
      adminLabel: "Admin",
      moderatorLabel: "Moderateur",
      toastUpdatedTitle: "Moderateur mis a jour",
      toastUpdatedDescription: "Permissions enregistrees.",
      toastErrorTitle: "Erreur",
      toastErrorDescription: "Veuillez reessayer.",
    },
    onboarding: {
      stepLabel: (current: number, total: number) => `Etape ${current} sur ${total}`,
      next: "Suivant",
      back: "Retour",
      done: "Terminer",
      skip: "Ignorer",
      loadingHint:
        "Chargement de cette etape. Si cela prend trop longtemps, cliquez sur \"Suivant\".",
      steps: {
        welcome: {
          title: "Bienvenue sur SoleilRoute",
          body:
            "Nous allons parcourir les outils essentiels pour planifier votre premier voyage.",
        },
        planTrip: {
          title: "Creez votre premier voyage",
          body:
            "Utilisez Actions rapides pour definir dates, destination et budget en quelques clics.",
        },
        trips: {
          title: "Gerez vos voyages",
          body:
            "Tous les voyages actifs sont ici avec statuts, voyageurs et progression.",
        },
        budget: {
          title: "Planifiez le budget",
          body:
            "Comparez les niveaux de budget et fixez des plafonds par voyage.",
        },
        visa: {
          title: "Verifiez les visas",
          body:
            "Recherchez les regles de visa par nationalite et destination, puis enregistrez le resultat.",
        },
        notifications: {
          title: "Restez informe",
          body:
            "Recevez des alertes sur les visas, paiements et activite des collaborateurs.",
        },
        settings: {
          title: "Profil et preferences",
          body:
            "Mettez a jour votre compte, le theme et les notifications a tout moment.",
        },
      },
    },
    help: {
      title: "Aide et support",
      subtitle:
        "Trouvez des reponses rapides, depannez ou contactez l'equipe.",
      quickHelpTitle: "Aide rapide",
      quickHelpBody:
        "Consultez la FAQ ci-dessous pour les questions et solutions les plus courantes.",
      accountSettingsCta: "Parametres du compte",
      contactSupportTitle: "Contacter le support",
      contactSupportBody:
        "Envoyez-nous un message et nous vous repondrons sous un jour ouvre.",
      systemStatusTitle: "Statut du systeme",
      systemStatusBody: "Tous les services sont operationnels.",
      statusButton: "Page de statut",
      faqTitle: "FAQ de depannage",
      faqs: [
        {
          question: "Comment mettre a jour mes informations de compte ?",
          answer:
            "Ouvrez les parametres du compte depuis le menu profil. Vous pouvez modifier votre email, votre mot de passe et revoquer d'autres sessions.",
        },
        {
          question: "Pourquoi mon statut de visa est-il inconnu ?",
          answer:
            "Nous affichons uniquement les donnees en cache lorsqu'elles sont disponibles. Ouvrez la page visa du voyage pour definir le statut manuellement ou attendez les mises a jour.",
        },
        {
          question: "Comment reinitialiser les budgets apres modification des totaux ?",
          answer:
            "Les postes budgetaires sont modifiables par voyage. Utilisez l'editeur de budget pour ajuster les montants ou supprimer les categories inutiles.",
        },
        {
          question: "Comment me deconnecter de partout ?",
          answer:
            "Allez dans les parametres du compte et choisissez \"Se deconnecter des autres sessions\" pour revoquer les autres appareils.",
        },
      ],
    },
    supportDialog: {
      triggerButton: "Support par email",
      title: "Contacter le support",
      description: "Partagez les details et nous vous contacterons par email.",
      emailLabel: "Votre email",
      emailPlaceholder: "you@example.com",
      subjectLabel: "Sujet",
      subjectPlaceholder: "Probleme avec les budgets de voyage",
      messageLabel: "Message",
      messagePlaceholder: "Decrivez le probleme ou la demande...",
      cancel: "Annuler",
      send: "Envoyer",
      sending: "Envoi...",
      toastErrorTitle: "Impossible d'envoyer le message",
      toastErrorDescription: "Veuillez reessayer.",
      toastSuccessTitle: "Message envoye",
      toastSuccessDescription: "Le support vous recontactera bientot.",
      validationEmail: "Entrez une adresse email valide.",
      validationSubject: "Le sujet doit contenir au moins 3 caracteres.",
      validationMessage: "Le message doit contenir au moins 10 caracteres.",
    },
    notificationPreferences: {
      emailTitle: "Notifications par email",
      emailBody: "Recevez les mises a jour importantes par email.",
      inAppTitle: "Notifications dans l'application",
      inAppBody: "Afficher les mises a jour dans le menu des notifications.",
      save: "Enregistrer les preferences",
      saving: "Enregistrement...",
      toastSuccessTitle: "Preferences mises a jour",
      toastSuccessDescription: "Vos parametres de notification ont ete enregistres.",
      toastErrorTitle: "Echec de la mise a jour",
      toastErrorDescription: "Impossible d'enregistrer vos preferences.",
    },
    dashboardOverview: {
      stats: {
        totalBudgetLabel: "Budget total",
        totalBudgetHelper: "Sur tous les voyages actifs",
        activeTripsLabel: "Voyages actifs",
        activeTripsHelper: "Voyages crees dans SoleilRoute",
        paidInvoicesLabel: "Factures payees",
        paidInvoicesHelper: "Marquees comme payees par categorie",
        outstandingLabel: "Restant",
        outstandingHelper: "Montant restant a allouer",
        upcomingTripsLabel: "Voyages a venir",
        upcomingTripsHelper: "Debut dans les 30 jours",
        overBudgetLabel: "Depassement",
        overBudgetHelper: "Planifie au-dessus du budget total",
      },
    },
    quickActions: {
      title: "Actions rapides",
      dialogTitle: "Planifier un voyage",
      dialogDescription:
        "Renseignez les details du voyage et nous calculerons la repartition initiale du budget et des visas.",
      actions: {
        planTripTitle: "Planifier un voyage",
        planTripDescription:
          "Creez un itineraire avec categories budget et controles de visa.",
        reviewBudgetsTitle: "Revoir les budgets",
        reviewBudgetsDescription:
          "Planifiez un budget par destination et style de voyage.",
        checkVisaTitle: "Verifier les visas",
        checkVisaDescription:
          "Verifiez les exigences avant de reserver.",
      },
    },
    tripForm: {
      submitDefault: "Creer un voyage",
      submitting: "Creation...",
      createSuccessTitle: "Voyage cree",
      createSuccessDescription:
        "Nous avons genere un budget initial et une checklist visa.",
      createErrorTitle: "Une erreur est survenue",
      createErrorDescription:
        "Impossible d'enregistrer ce voyage. Reessayez.",
      fields: {
        nameLabel: "Nom du voyage",
        citizenshipLabel: "Citoyennete",
        destinationCountryLabel: "Pays de destination",
        destinationCityLabel: "Ville de destination",
        startDateLabel: "Date de debut",
        endDateLabel: "Date de fin",
        totalBudgetLabel: "Budget total",
        travelStyleLabel: "Style de voyage",
        currencyLabel: "Devise du voyage",
        baseCurrencyLabel: "Devise de base",
        notesLabel: "Notes",
      },
      placeholders: {
        name: "Ete a Tokyo",
        destinationCountry: "Japon",
        destinationCity: "Tokyo",
        notes: "Types de visa, activites a voir, ou rappels...",
        selectCitizenship: "Selectionner la citoyennete",
        searchCountries: "Rechercher des pays",
        currency: "Devise",
        baseCurrency: "Devise de base",
        travelStyle: "Selectionner un style",
      },
      autoSplitMessage: (count: number, categories: string) =>
        `Nous repartissons automatiquement le budget sur ${count} categories: ${categories}. Modifiez la repartition dans le tableau de bord du voyage.`,
      validation: {
        nameMin: "Le nom du voyage doit contenir au moins 3 caracteres.",
        destinationCountryRequired: "Le pays de destination est requis.",
        destinationCityRequired: "La ville de destination est requise.",
        startDateInvalid: "Veuillez saisir une date de debut valide.",
        startDateRequired: "La date de debut est requise.",
        endDateInvalid: "Veuillez saisir une date de fin valide.",
        endDateRequired: "La date de fin est requise.",
        totalBudgetInvalid: "Le budget total doit etre un nombre.",
        totalBudgetPositive: "Le budget doit etre superieur a zero.",
        currencyLength: "La devise doit etre un code ISO de 3 lettres.",
        citizenshipRequired: "Veuillez saisir votre citoyennete.",
        baseCurrencyLength:
          "La devise de base doit etre un code ISO de 3 lettres.",
        travelStyleRequired: "Le style de voyage est requis.",
        endDateAfterStart: "La date de fin doit etre apres la date de debut.",
      },
    },
    tripDetailsEditor: {
      trigger: "Modifier le voyage",
      title: "Modifier le voyage",
      description:
        "Mettez a jour les details. Les postes budget restent tant que vous ne les modifiez pas.",
      cancel: "Annuler",
      save: "Enregistrer",
      saving: "Enregistrement...",
      toastSuccessTitle: "Voyage mis a jour",
      toastSuccessDescription: "Les details du voyage ont ete mis a jour.",
      toastErrorTitle: "Echec de la mise a jour",
      toastErrorDescription: "Impossible d'enregistrer vos modifications.",
    },
    tripList: {
      emptyTitle: "Aucun voyage pour le moment",
      emptyDescription:
        "Creez votre premier itineraire pour activer budget et visas.",
      openTrip: "Ouvrir le voyage",
      manageBudget: "Gerer le budget",
      visaChecklist: "Checklist visa",
      deleteTrip: "Supprimer le voyage",
      deleting: "Suppression...",
      confirmDelete:
        "Supprimer ce voyage ? Tous les postes budget seront supprimes.",
      sharedLabel: (role: string) => `Partage (${role})`,
      budgetProgressLabel: "Progression du budget",
      budgetProgressSummary: (percent: number) =>
        `${percent}% du budget marque comme paye.`,
      toastDeleteTitle: "Voyage supprime",
      toastDeleteDescription: "Le voyage a ete supprime.",
      toastDeleteErrorTitle: "Impossible de supprimer le voyage",
      toastDeleteErrorDescription: "Veuillez reessayer plus tard.",
    },
    tripsView: {
      pageDescription:
        "Tous vos itineraires sont ici. Ouvrez un voyage pour ajuster budgets et visas.",
      searchPlaceholder: "Rechercher voyages, villes ou pays",
      statusPlaceholder: "Statut visa",
      statusAll: "Tous les statuts visa",
      sortPlaceholder: "Trier par",
      sortOptions: {
        upcoming: "Date de debut (plus proche)",
        latest: "Date de debut (plus lointaine)",
        ending: "Date de fin (plus proche)",
        name: "Nom A-Z",
        visa_status: "Priorite statut visa",
        budget_high: "Budget (du plus eleve)",
        budget_low: "Budget (du plus bas)",
      },
      resetFilters: "Reinitialiser les filtres",
    },
    tripOverview: {
      backToTrips: "Retour aux voyages",
      sharedEditor: "Partage (Editeur)",
      sharedViewer: "Partage (Lecteur)",
      detailsTitle: "Details du voyage",
      detailLabels: {
        dates: "Dates",
        destination: "Destination",
        citizenship: "Citoyennete",
        totalBudget: "Budget total",
        spentPaid: "Depense (paye)",
        visaStatus: "Statut visa",
        baseCurrency: "Devise de base",
      },
      notesTitle: "Notes",
      notesEmpty: "Aucune note pour le moment.",
      ownerFallback: "proprietaire",
      collaboratorUnknown: "inconnu",
    },
    tripBudgetPage: {
      backToOverview: "Apercu du voyage",
      title: "Detail du budget",
    },
    tripBudget: {
      progressTitle: "Progression du budget",
      paidSoFar: "Paye a ce jour",
      progressSummary: (percent: number, planned: string) =>
        `${percent}% du budget marque paye. Depense prevue: ${planned}.`,
    },
    budget: {
      categories: {
        transport: "Transport",
        accommodation: "Hebergement",
        food: "Repas",
        activities: "Activites",
        visa: "Visa",
        other: "Autres",
      },
    },
    budgetChart: {
      title: "Apercu du budget",
      description:
        "Suivez les depenses planifiees et payees par categorie.",
      plannedLabel: "Planifie",
      paidLabel: "Paye",
    },
    budgetItems: {
      title: "Postes budget",
      summaryPlanned: "Planifie",
      summaryPaid: "Paye",
      summaryRemaining: "Restant",
      summaryOverBudget: "Depassement",
      summaryOutstanding: "restant",
      noItems: "Aucun poste budget. Ajoutez votre premiere depense.",
      categoryLabel: "Categorie",
      descriptionLabel: "Description",
      amountLabel: "Montant",
      paidLabel: "Paye",
      savedLabel: "Enregistre",
      remove: "Supprimer",
      saveChanges: "Enregistrer",
      saving: "Enregistrement...",
      addTitle: "Ajouter un poste budget",
      addButton: "Ajouter",
      adding: "Ajout...",
      newDescriptionPlaceholder: "Taxi a l'aeroport, hebergement",
      editDescriptionPlaceholder: "Acompte hotel, pass rail, billets musee",
      viewOnly: "Vous avez un acces en lecture seule.",
      confirmDelete: "Supprimer ce poste budget ? Action irreversible.",
      toastInvalidAmountTitle: "Montant invalide",
      toastInvalidAmountDescription:
        "Le montant doit etre superieur a zero.",
      toastSaveTitle: "Budget mis a jour",
      toastSaveDescription: "Modifications enregistrees.",
      toastSaveErrorTitle: "Echec de l'enregistrement",
      toastSaveErrorDescription: "Impossible d'enregistrer vos modifications.",
      toastToggleErrorTitle: "Impossible de mettre a jour",
      toastToggleErrorDescription:
        "Impossible de mettre a jour le statut paye.",
      toastAddTitle: "Poste ajoute",
      toastAddDescription: "La nouvelle entree est ajoutee.",
      toastAddErrorTitle: "Impossible d'ajouter",
      toastAddErrorDescription: "Veuillez reessayer.",
      toastDeleteTitle: "Poste supprime",
      toastDeleteDescription: "Le poste a ete supprime.",
      toastDeleteErrorTitle: "Impossible de supprimer",
      toastDeleteErrorDescription: "Veuillez reessayer plus tard.",
    },
    budgetCaps: {
      title: "Plafonds de depense",
      description:
        "Fixez des plafonds par categorie pour rester dans le budget.",
      plannedLabel: "Planifie",
      capLabel: "Plafond",
      noCap: "Aucun plafond",
      overBy: "Depassement",
      capInputLabel: "Plafond",
      saveCaps: "Enregistrer les plafonds",
      saving: "Enregistrement...",
      viewOnly: "Vous avez un acces en lecture seule.",
      toastSuccessTitle: "Plafonds enregistres",
      toastSuccessDescription:
        "Les plafonds par categorie ont ete mis a jour.",
      toastErrorTitle: "Impossible d'enregistrer",
      toastErrorDescription: "Veuillez reessayer.",
    },
    budgetPlanner: {
      title: "Planificateur de budget",
      description:
        "Estimez les couts journaliers par personne et repartissez par categorie.",
      destinationLabel: "Pays de destination",
      destinationPlaceholder: "Selectionner un pays",
      destinationSearchPlaceholder: "Rechercher des pays",
      travelStyleLabel: "Style de voyage",
      travelStylePlaceholder: "Selectionner un style",
      tripLengthLabel: "Duree (jours)",
      travelersLabel: "Voyageurs",
      dailyEstimateTitle: "Estimation journaliere",
      dailyEstimateNote: (currency: string) =>
        `Par personne, par jour, en ${currency}.`,
      totalEstimateTitle: "Estimation totale",
      totalEstimateNote: (days: number, travelers: number) =>
        `${days} jours, ${travelers} voyageur${travelers > 1 ? "s" : ""}.`,
      categorySplitTitle: "Repartition par categorie",
      highlightsTitle: "Points forts",
      notesTitle: "Notes",
      notesFallback: "Ajustez selon la saison.",
      estimatesFootnote: "Estimations hors vols et assurance voyage.",
      tierTitle: "Comparaison des niveaux",
      tierDescription:
        "Comparez les niveaux de budget pour la meme destination.",
      tierSelected: "Selectionne",
      tierPerDay: "Par jour",
      tierPerTrip: "Total voyage",
      tierBadgesTitle: "Style de voyage",
      tiers: {
        budget: {
          label: "Economique",
          description: "Essentiels et sejours simples.",
        },
        mid: {
          label: "Intermediaire",
          description: "Confort et activites equilibres.",
        },
        luxury: {
          label: "Luxe",
          description: "Sejours premium et experiences.",
        },
      },
      noMatches: "Aucune correspondance.",
    },
    visa: {
      statuses: {
        unknown: "Inconnu",
        required: "Visa requis",
        in_progress: "En cours",
        approved: "Approuve",
        not_required: "Pas requis",
      },
    },
    visaChecker: {
      title: "Exigences visa",
      description: "Confirmez les obligations visa avant de reserver.",
      citizenshipLabel: "Citoyennete",
      destinationLabel: "Pays de destination",
      citizenshipSearchPlaceholder: "Rechercher des pays",
      destinationSearchPlaceholder: "Rechercher des destinations",
      destinationPlaceholder: "Selectionner une destination",
      noMatches: "Aucune correspondance.",
      noDestinations: "Aucune destination disponible.",
      checkButton: "Verifier les exigences",
      checking: "Verification...",
      addToTrip: "Ajouter au voyage",
      createTripTitle: "Creer un voyage",
      createTripDescription:
        "Nous avons pre-rempli citoyennete et destination.",
      tripName: (destination: string) => `Voyage a ${destination}`,
      toastMissingTitle: "Informations manquantes",
      toastMissingDescription:
        "Selectionnez une citoyennete et une destination.",
      toastErrorTitle: "Impossible de verifier",
      toastErrorDescription:
        "Nous n'avons pas pu charger les exigences visa.",
      resultsNote:
        "Les resultats combinent Passport Index et la base SoleilRoute. Ajoutez au voyage pour recevoir des mises a jour.",
      emptyState:
        "Aucune donnee en cache pour cette route. Ajoutez le voyage pour lancer une verification via Passport Index.",
      resultStatusRequired: "Visa requis",
      resultStatusFree: "Entree sans visa disponible",
      badgeRequired: "Visa requis",
      badgeNotRequired: "Visa non requis",
      detailVisaType: "Type de visa",
      detailValidity: "Validite",
      detailProcessing: "Delai de traitement",
      detailCost: "Cout",
      noFee: "Aucun frais",
      viewEmbassy: "Voir les infos ambassade",
      lastCheckedLabel: "Derniere verification",
      sourceLabel: "Source",
      insightsTitle: "Infos voyage",
      insightsCurrency: "Devise",
      insightsLanguages: "Langues",
      insightsTimezones: "Fuseaux horaires",
      insightsCallingCodes: "Indicatifs",
      insightsCapital: "Capitale",
    },
    visaStatusEditor: {
      currentStatusLabel: "Statut actuel",
      selectPlaceholder: "Selectionner un statut",
      lastCheckedLabel: "Derniere verification",
      noChecks: "Aucune verification recente.",
      toastSuccessTitle: "Statut visa mis a jour",
      toastSuccessDescription: "Enregistre.",
      toastErrorTitle: "Echec de la mise a jour",
      toastErrorDescription:
        "Impossible de mettre a jour le statut visa.",
    },
    tripVisaPage: {
      backToOverview: "Apercu du voyage",
      title: "Checklist visa",
      subtitle: (citizenship: string, destination: string) =>
        `${citizenship} vers ${destination}`,
      requirementsTitle: "Exigences",
      visaRequired: "Visa requis",
      visaNotRequired: "Visa non requis",
      detailValidity: "Validite",
      detailProcessing: "Delai de traitement",
      detailCost: "Cout estime",
      detailEmbassy: "Lien ambassade",
      embassyLink: "Visiter le site",
      noFee: "Aucun frais",
      noCache:
        "Aucune exigence en cache pour cette route. Ajoutez le voyage et nous recupererons les details des que les integrations seront connectees.",
    },
    timeline: {
      title: "Planificateur chronologique",
      description:
        "Suivez les jalons et rappels de paiement lies aux dates du voyage.",
      empty:
        "Aucun element pour le moment. Ajoutez le premier jalon ci-dessous.",
      fieldTitle: "Titre",
      fieldDueDate: "Echeance",
      fieldType: "Type",
      fieldAmount: "Montant",
      fieldNotes: "Notes",
      typeMilestone: "Jalon",
      typePayment: "Rappel de paiement",
      statusCompleted: "Termine",
      statusPending: "En attente",
      notesPlaceholder: "Rappels, liens ou taches",
      itemSaved: "Enregistre",
      remove: "Supprimer",
      saveChanges: "Enregistrer",
      saving: "Enregistrement...",
      addTitle: "Ajouter un element",
      addButton: "Ajouter",
      adding: "Ajout...",
      newTitlePlaceholder: "Billets, depot hotel, billets musee",
      newNotesPlaceholder: "Ajoutez un rappel ou une checklist.",
      optionalAmount: "Optionnel",
      viewOnly: "Vous avez un acces en lecture seule.",
      confirmDelete: "Supprimer cet element ? Action irreversible.",
      toastMissingDetailsTitle: "Informations manquantes",
      toastMissingDetailsDescription:
        "Ajoutez un titre et une date avant de sauvegarder.",
      toastInvalidAmountTitle: "Montant invalide",
      toastInvalidAmountDescription:
        "Le montant doit etre superieur a zero.",
      toastUpdateTitle: "Chronologie mise a jour",
      toastUpdateDescription: "Modifications enregistrees.",
      toastUpdateErrorTitle: "Echec de la mise a jour",
      toastUpdateErrorDescription: "Impossible d'enregistrer vos modifications.",
      toastAddTitle: "Element ajoute",
      toastAddDescription: "Le rappel a ete ajoute.",
      toastAddErrorTitle: "Impossible d'ajouter",
      toastAddErrorDescription: "Veuillez reessayer.",
      toastDeleteTitle: "Element supprime",
      toastDeleteDescription: "Le rappel a ete supprime.",
      toastDeleteErrorTitle: "Impossible de supprimer",
      toastDeleteErrorDescription: "Veuillez reessayer plus tard.",
      toastStatusErrorTitle: "Impossible de mettre a jour",
      toastStatusErrorDescription: "Impossible de mettre a jour le statut.",
      dueNoDate: "Aucune date",
      dueOverdue: (days: number) => `En retard de ${days}j`,
      dueIn: (days: number) => `Echeance dans ${days}j`,
    },
    collaborators: {
      title: "Espace collaboratif",
      description: "Partagez ce voyage et gerez les autorisations.",
      youLabel: "(Vous)",
      addedLabel: (date: string) => `Ajoute ${date}`,
      ownerLabel: "Proprietaire",
      roleEditor: "Editeur",
      roleViewer: "Lecteur",
      remove: "Supprimer",
      pendingTitle: "Invitations en attente",
      pendingInvite: (role: string, date: string) =>
        `${role} invitation - ${date}`,
      pendingLabel: "En attente de reponse",
      inviteTitle: "Inviter un collaborateur",
      emailLabel: "Email",
      emailPlaceholder: "teammate@example.com",
      roleLabel: "Role",
      sendInvite: "Envoyer l'invitation",
      inviting: "Envoi...",
      viewOnly: "Seul le proprietaire peut gerer les collaborateurs.",
      confirmRemove:
        "Supprimer ce collaborateur ? Il perdra l'acces au voyage.",
      toastMissingEmailTitle: "Email manquant",
      toastMissingEmailDescription: "Entrez un email pour inviter.",
      toastInviteTitle: "Invitation envoyee",
      toastInviteDescription: "L'acces commencera apres acceptation.",
      toastInviteErrorTitle: "Impossible d'envoyer",
      toastInviteErrorDescription: "Verifiez l'email et reessayez.",
      toastRoleTitle: "Role mis a jour",
      toastRoleDescription: "Autorisations mises a jour.",
      toastRoleErrorTitle: "Impossible de mettre a jour le role",
      toastRoleErrorDescription: "Veuillez reessayer.",
      toastRemoveTitle: "Collaborateur supprime",
      toastRemoveDescription: "Acces revoque.",
      toastRemoveErrorTitle: "Impossible de supprimer",
      toastRemoveErrorDescription: "Veuillez reessayer plus tard.",
    },
  },
  de: {
    common: {
      languageLabel: "Sprache",
      orLabel: "oder",
      newLabel: "Neu",
      closeLabel: "Schliessen",
      justNow: "Gerade eben",
    },
    site: {
      description:
        "Intelligente Reiseplanung mit Echtzeit-Budgets, Visa-Hinweisen und Waehrungswissen.",
    },
    navigation: {
      features: "Funktionen",
      howItWorks: "So funktioniert es",
      pricing: "Preise",
      faqs: "FAQ",
      signIn: "Anmelden",
      createAccount: "Kostenloses Konto erstellen",
      startPlanning: "Kostenlos starten",
      exploreFeatures: "Funktionen entdecken",
      home: "Startseite",
      dashboard: "Dashboard",
      trips: "Reisen",
      budgetPlanner: "Budgetplaner",
      visaChecker: "Visum-Check",
      community: "Community",
      moderation: "Moderation",
      admin: "Admin",
      notifications: "Benachrichtigungen",
      settings: "Einstellungen",
      help: "Hilfe",
    },
    hero: {
      pill: "Intelligente Reiseplanung, Schritt fuer Schritt",
      title:
        "Gestalten Sie unvergessliche Reisen mit Echtzeit-Budgets und Visa-Klarheit",
      description:
        "SoleilRoute kombiniert Waehrungsintelligenz, Visa-Automatisierung und kollaborative Reiserouten, damit Ihre Reisen organisiert, konform und im Budget sind, bevor Sie ueberhaupt packen.",
      highlightOne: "Visa-Daten fuer 190+ Laender",
      highlightTwo: "Kollaborative Reiserouten mit Budgetkontrolle",
      trustTitle: "Warum Teams SoleilRoute vertrauen",
      trustBullets: [
        "90 % der Reisenden bleiben dank automatisierter Ausgabenprognosen im Budget.",
        "Visa-Anforderungen werden alle 12 Stunden aus Passport Index aktualisiert.",
        "Wechselkurse werden fuer 180+ Waehrungen mit Alerts ueberwacht.",
      ],
      noCreditCard: "Keine Kreditkarte erforderlich. Jederzeit kuendbar.",
    },
    features: {
      heading: "Alles, was du brauchst, um smartere Reisen zu orchestrieren",
      subheading:
        "Plane, budgetiere und fuehre Reiserouten mit einem einzigen kollaborativen Hub aus.",
      items: [
        {
          title: "Visa-Intelligenz",
          description:
            "Pruefe sofort Visa-Anforderungen, Bearbeitungszeiten, Gebuehren und Botschaftslinks fuer jedes Ziel.",
        },
        {
          title: "Budgetautomatisierung",
          description:
            "Lege Ausgabenlimits fest, verfolge Zahlungen und visualisiere Kategorien mit Recharts-Dashboards.",
        },
        {
          title: "Zeitplanung",
          description:
            "Halte Reiserouten organisiert mit datumsbezogenen Meilensteinen und Zahlungserinnerungen.",
        },
        {
          title: "Kollaborativer Workspace",
          description:
            "Teile Reiserouten, weise Aufgaben zu und erhalte Updates mit sicherem Zugriff.",
        },
      ],
    },
    howItWorks: {
      heading: "Plane in drei strukturierten Phasen",
      subheading:
        "Erstelle die perfekte Reise von der Idee bis zur Umsetzung mit einem gefuehrten Workflow.",
      steps: [
        {
          title: "Erstelle deine Reise",
          body: "Fuege Ziel, Reisedaten, Budget und Staatsbuergerschaft hinzu. SoleilRoute synchronisiert Visa-Anforderungen und Wechselkurse in Sekunden.",
        },
        {
          title: "Verteile dein Budget",
          body: "Verteile Mittel auf Transport, Unterkunft, Essen, Aktivitaeten, Visa und Extras. Verfolge Zahlungen und offene Punkte in einer Ansicht.",
        },
        {
          title: "Bleib konform und informiert",
          body: "Erhalte Visa-Warnungen, Richtlinien-Updates und Zahlungserinnerungen. Exportiere Reiserouten oder teile Dashboards sofort.",
        },
      ],
      stepLabel: (step: number) => `Schritt ${step}`,
    },
    pricing: {
      heading: "Preise, die mit deinen Abenteuern skalieren",
      subheading:
        "Leistungsstarke Tools mit transparenter Preisgestaltung. Jederzeit upgraden.",
      popular: "Beliebt",
      plans: [
        {
          name: "Starter",
          price: "Kostenlos",
          description:
            "Perfekt fuer neugierige Reisende, die ihre naechste Reise planen.",
          features: [
            "Bis zu 2 aktive Reisen",
            "Budget-Tracking mit Kategorienlimits",
            "Visa-Empfehlungen fuer Top-20-Ziele",
            "E-Mail-Erinnerungen fuer Zahlungen",
          ],
          cta: "Kostenlos starten",
        },
        {
          name: "Pro",
          price: "$12",
          period: "pro Monat",
          description: "Fortgeschrittene Workflows fuer Vielreisende und Teams.",
          features: [
            "Unbegrenzte aktive Reisen",
            "Geteilte Dashboards und kollaborative Bearbeitung",
            "Vollstaendige Visa-Intelligenz mit Botschaftslinks",
            "Waehrungs-Trigger und Ausgabenfreigaben",
            "PDF-Exporte und individuelles Branding",
          ],
          cta: "14-taegige Testversion starten",
        },
        {
          name: "Enterprise",
          price: "Individuell",
          description: "Compliance und Reporting fuer Reise-Operations-Teams.",
          features: [
            "Dedizierter Customer-Success-Manager",
            "SAML SSO und rollenbasierte Zugriffskontrolle",
            "Finanzintegrationen und Richtlinien",
            "Priorisierter Support und Onboarding",
          ],
          cta: "Vertrieb kontaktieren",
        },
      ],
    },
    faqs: {
      heading: "Antworten fuer neugierige Reisende",
      subheading:
        "Alles, was du wissen musst, bevor du deine naechste Reise startest.",
      items: [
        {
          question: "Welche Laender werden fuer Visa-Checks unterstuetzt?",
          answer:
            "Wir pflegen Visa-Infos fuer 190+ Ziele auf Basis von Passport Index und unserem Compliance-Team. Jedes Ergebnis enthaelt Status, Typ, Gueltigkeit, Kosten und Botschaftslinks.",
        },
        {
          question: "Wie genau sind die Waehrungsumrechnungen?",
          answer:
            "Wechselkurse werden alle 4 Stunden ueber ExchangeRate API aktualisiert. Du kannst einen Kurs pro Reise fixieren und Ausgaben in Reise- und Basiswaehrung verfolgen.",
        },
        {
          question: "Kann ich mein Team oder Reisebegleiter einladen?",
          answer:
            "Ja. SoleilRoute bietet sicheres Teilen mit rollenbasiertem Zugriff. Lade Viewer oder Co-Planer ein, definiere Berechtigungen und arbeite gemeinsam an Routen, Budgets und Visa-Dokumenten.",
        },
        {
          question: "Bietet ihr PDF-Exporte oder Berichte an?",
          answer:
            "Pro-Plaene enthalten PDF-Exporte fuer Routen, Budgetzusammenfassungen, Zahlungsplaene und Visa-Anforderungen.",
        },
      ],
    },
    footer: {
      product: "Produkt",
      resources: "Ressourcen",
      company: "Unternehmen",
      links: {
        features: "Funktionen",
        pricing: "Preise",
        releaseNotes: "Versionshinweise",
        documentation: "Dokumentation",
        support: "Support",
        blog: "Blog",
        about: "Ueber uns",
        careers: "Karriere",
        contact: "Kontakt",
      },
      legal: {
        privacy: "Datenschutz",
        terms: "Bedingungen",
        status: "Status",
        rights: "Alle Rechte vorbehalten.",
      },
    },
    auth: {
      login: {
        title: "Willkommen zurueck",
        subtitle: "Melde dich an, um auf deine Reise-Dashboards zuzugreifen.",
        googleButton: "Mit Google fortfahren",
        divider: "oder",
        noAccount: "Noch kein Konto?",
        createAccount: "Konto erstellen",
        submit: "Anmelden",
        submitting: "Anmeldung...",
        emailLabel: "E-Mail",
        passwordLabel: "Passwort",
        placeholderEmail: "you@example.com",
        placeholderPassword: "********",
        toast: {
          errorTitle: "Anmeldung fehlgeschlagen",
          errorDescription: "Bitte ueberpruefe deine Zugangsdaten.",
          successTitle: "Willkommen zurueck",
          successDescription: "Du bist jetzt angemeldet.",
        },
        validation: {
          email: "Gib eine gueltige E-Mail-Adresse ein.",
          password: "Das Passwort muss mindestens 6 Zeichen enthalten.",
        },
      },
      register: {
        title: "Tritt SoleilRoute bei",
        subtitle: "Verwalte Visa, Budgets und Routen in wenigen Minuten.",
        googleButton: "Mit Google registrieren",
        divider: "oder",
        haveAccount: "Schon ein Konto?",
        signIn: "Anmelden",
        submit: "Konto erstellen",
        submitting: "Konto wird erstellt...",
        emailLabel: "E-Mail",
        passwordLabel: "Passwort",
        confirmLabel: "Passwort bestaetigen",
        placeholderEmail: "you@example.com",
        placeholderPassword: "********",
        placeholderConfirm: "********",
        toast: {
          errorTitle: "Registrierung fehlgeschlagen",
          errorDescription: "Unerwarteter Fehler. Bitte versuche es erneut.",
        },
        validation: {
          email: "Gib eine gueltige E-Mail-Adresse ein.",
          password: "Das Passwort muss mindestens 8 Zeichen lang sein.",
          confirm: "Die Passwoerter stimmen nicht ueberein.",
        },
      },
    },
    dashboard: {
      headerTitle: "Dashboard",
      headerSubtitle:
        "Behalte deine kommenden Reisen, Budgets und Visa-Anforderungen im Blick.",
      signedInAs: "Angemeldet als",
      accountSettings: "Kontoeinstellungen",
      themeLight: "Zum hellen Modus wechseln",
      themeDark: "Zum dunklen Modus wechseln",
      help: "Hilfe",
      signOut: "Abmelden",
      home: "Startseite",
      workspaceTitle: "Arbeitsbereich",
      needHelp: "Brauchst du Hilfe?",
    },
    settings: {
      title: "Kontoeinstellungen",
      subtitle: "Aktualisiere Profil, Passwort und aktive Sitzungen.",
      profileTitle: "Profil",
      passwordTitle: "Passwort",
      sessionsTitle: "Sitzungen",
    },
    profileForm: {
      emailLabel: "E-Mail",
      displayNameLabel: "Anzeigename",
      avatarLabel: "Avatar",
      avatarAlt: "Profil-Avatar",
      avatarPlaceholder: "Kein Avatar",
      save: "Aenderungen speichern",
      saving: "Speichern...",
      toastErrorTitle: "Email konnte nicht aktualisiert werden",
      toastErrorDescription: "Bitte versuche es erneut.",
      toastSuccessTitle: "Profil aktualisiert",
      toastSuccessDescription: "Deine Email-Adresse wurde gespeichert.",
      validationEmail: "Gib eine gueltige E-Mail-Adresse ein.",
      validationDisplayName: "Anzeigename mindestens 2 Zeichen.",
    },
    passwordForm: {
      currentLabel: "Aktuelles Passwort",
      newLabel: "Neues Passwort",
      confirmLabel: "Neues Passwort bestaetigen",
      save: "Passwort aktualisieren",
      saving: "Speichern...",
      toastErrorTitle: "Passwort konnte nicht aktualisiert werden",
      toastErrorDescription: "Bitte versuche es erneut.",
      toastSuccessTitle: "Passwort aktualisiert",
      toastSuccessDescription:
        "Verwende das neue Passwort bei der naechsten Anmeldung.",
      validationCurrent: "Gib dein aktuelles Passwort ein.",
      validationNew: "Das Passwort muss mindestens 8 Zeichen lang sein.",
      validationConfirm: "Die Passwoerter stimmen nicht ueberein.",
    },
    sessionsForm: {
      activeLabel: "Aktive Sitzungen",
      revoke: "Andere Sitzungen abmelden",
      revoking: "Widerrufen...",
      toastErrorTitle: "Sitzungen konnten nicht widerrufen werden",
      toastErrorDescription: "Bitte versuche es erneut.",
      toastSuccessTitle: "Sitzungen widerrufen",
      toastSuccessDescription: "Von anderen Geraeten abgemeldet.",
    },
    notifications: {
      menuTitle: "Benachrichtigungen",
      markAllRead: "Alle als gelesen markieren",
      loading: "Benachrichtigungen werden geladen...",
      empty: "Noch keine Benachrichtigungen.",
      viewAll: "Alle Benachrichtigungen anzeigen",
      viewDetails: "Details ansehen",
      newBadge: "Neu",
      historyTitle: "Benachrichtigungen",
      historySubtitle:
        "Aktualisierungen pruefen, nach Typ filtern und Benachrichtigungen verwalten.",
      pendingInvitationsTitle: "Ausstehende Einladungen",
      pendingInvitationsSubtitle:
        "Akzeptiere oder lehne Einladungen ab, bevor sie im Dashboard erscheinen.",
      preferencesTitle: "Benachrichtigungseinstellungen",
      searchPlaceholder: "Benachrichtigungen suchen",
      statusPlaceholder: "Status",
      statusAll: "Alle Status",
      statusUnread: "Ungelesen",
      statusRead: "Gelesen",
      typePlaceholder: "Typ",
      typeAll: "Alle Typen",
      typeSuccess: "Erfolg",
      typeWarning: "Warnung",
      typeInfo: "Info",
      refresh: "Aktualisieren",
      refreshing: "Wird aktualisiert...",
      noMatches: "Keine Benachrichtigungen entsprechen deinen Filtern.",
      markRead: "Als gelesen markieren",
      invitationEmpty: "Derzeit keine ausstehenden Reiseeinladungen.",
      invitationRoleEditor: "Bearbeiter",
      invitationRoleViewer: "Betrachter",
      invitationDecline: "Ablehnen",
      invitationAccept: "Annehmen",
      tripFallback: "Reise",
      unknownDestination: "Unbekanntes Ziel",
      invitedByFallback: "Teammitglied",
      invitedBy: (name: string, date: string) => `Eingeladen von ${name} - ${date}`,
    },
    community: {
      title: "Community Feed",
      subtitle: "Teile Orte, Pins und Tipps mit anderen Reisenden.",
      createTitle: "Teile etwas Neues",
      createSubtitle: "Posts werden vor der Freigabe gepruft.",
      fields: {
        tag: "Tag",
        text: "Dein Beitrag",
        mapUrl: "Kartenlink",
        image: "Foto",
      },
      placeholders: {
        tag: "Tag auswahlen",
        text: "Teile deine Entdeckung...",
        mapUrl: "Google Maps oder OSM Link",
      },
      tabs: {
        feed: "Feed",
        mine: "Meine Posts",
        saved: "Gespeichert",
      },
      tags: {
        place: "Ort",
        map_point: "Kartenpunkt",
        landmark: "Sehenswurdigkeit",
        other: "Sonstiges",
      },
      status: {
        pending: "In Prufung",
        approved: "Freigegeben",
        rejected: "Abgelehnt",
      },
      publish: "Einreichen",
      posting: "Senden...",
      refresh: "Aktualisieren",
      loading: "Lade Posts...",
      emptyFeed: "Noch keine Posts.",
      emptyMine: "Keine eigenen Posts.",
      emptySaved: "Noch keine gespeicherten Posts.",
      viewMap: "Karte offnen",
      rejectionReason: "Grund",
      mediaHint: "Foto oder Kartenlink hinzufugen.",
      mediaImageHint: "Foto (JPG/PNG/WebP/GIF), max 10 MB.",
      mediaMapHint: "Kartenlink fur Punkt oder Route.",
      detailsTitle: "Beitragsdetails",
      noMap: "Kein Kartenlink.",
      unknownAuthor: "Reisender",
      profile: {
        title: "Reiseprofil",
        subtitle: "Beitraege dieses Reisenden.",
        postsTitle: "Beitraege",
        postsEmpty: "Noch keine Beitraege.",
      },
      toastSubmittedTitle: "Post eingereicht",
      toastSubmittedDescription: "Der Beitrag wartet auf Freigabe.",
      toastErrorTitle: "Fehler beim Senden",
      toastErrorDescription: "Bitte erneut versuchen.",
      comments: {
        title: "Kommentare",
        placeholder: "Kommentar schreiben...",
        reply: "Antworten",
        submit: "Posten",
        submitting: "Sende...",
        empty: "Noch keine Kommentare.",
        loading: "Kommentare werden geladen...",
        toastSuccessTitle: "Kommentar gepostet",
        toastSuccessDescription: "Dein Kommentar ist sichtbar.",
        toastErrorTitle: "Kommentar fehlgeschlagen",
        toastErrorDescription: "Bitte erneut versuchen.",
      },
      actions: {
        edit: "Beitrag bearbeiten",
        delete: "Beitrag loeschen",
        like: "Gefaellt mir",
        savePost: "Speichern",
        save: "Speichern",
        cancel: "Abbrechen",
        saving: "Speichern...",
        confirmDelete: "Diesen Beitrag loeschen? Nicht rueckgaengig.",
        toastUpdatedTitle: "Beitrag aktualisiert",
        toastUpdatedDescription: "Aenderungen gespeichert.",
        toastDeletedTitle: "Beitrag geloescht",
        toastDeletedDescription: "Beitrag wurde entfernt.",
      },
      validation: {
        tagRequiredTitle: "Tag auswahlen",
        tagRequiredDescription: "Wahle, was du teilst.",
        textRequiredTitle: "Beschreibung fehlt",
        textRequiredDescription: "Mindestens 10 Zeichen.",
        textProhibitedTitle: "Unzulassiger Text",
        textProhibitedDescription: "Bitte anstossige Worte entfernen.",
        mediaRequiredTitle: "Foto oder Link",
        mediaRequiredDescription: "Foto oder Kartenlink hinzufugen.",
        mapInvalidTitle: "Ungultiger Link",
        mapInvalidDescription: "Google Maps oder OSM verwenden.",
        imageSizeTitle: "Bild zu gross",
        imageSizeDescription: "Max 10 MB.",
      },
    },
    moderation: {
      title: "Moderation",
      subtitle: "Beitrage prufen und freigeben.",
      loading: "Moderation wird geladen...",
      empty: "Keine Beitrage zur Prufung.",
      approve: "Freigeben",
      reject: "Ablehnen",
      reasonPlaceholder: "Grund (optional)",
      toastApprovedTitle: "Beitrag freigegeben",
      toastApprovedDescription: "Der Beitrag ist jetzt sichtbar.",
      toastRejectedTitle: "Beitrag abgelehnt",
      toastRejectedDescription: "Autor wurde informiert.",
      toastErrorTitle: "Fehler",
      toastErrorDescription: "Bitte erneut versuchen.",
    },
    admin: {
      title: "Admin",
      subtitle: "Moderatoren verwalten.",
      loading: "Lade Benutzer...",
      empty: "Keine Benutzer gefunden.",
      refresh: "Aktualisieren",
      searchPlaceholder: "Suche nach Email",
      adminLabel: "Admin",
      moderatorLabel: "Moderator",
      toastUpdatedTitle: "Moderator aktualisiert",
      toastUpdatedDescription: "Berechtigungen gespeichert.",
      toastErrorTitle: "Fehler",
      toastErrorDescription: "Bitte erneut versuchen.",
    },
    onboarding: {
      stepLabel: (current: number, total: number) => `Schritt ${current} von ${total}`,
      next: "Weiter",
      back: "Zuruck",
      done: "Fertig",
      skip: "Uberspringen",
      loadingHint:
        "Dieser Schritt wird geladen. Wenn es zu lange dauert, klicke auf \"Weiter\".",
      steps: {
        welcome: {
          title: "Willkommen bei SoleilRoute",
          body:
            "Wir zeigen dir die wichtigsten Funktionen, damit du deine erste Reise sicher planst.",
        },
        planTrip: {
          title: "Erstelle deine erste Reise",
          body:
            "Nutze Schnellaktionen, um Daten, Ziel und Budget in wenigen Klicks festzulegen.",
        },
        trips: {
          title: "Reisen verwalten",
          body:
            "Hier findest du alle aktiven Reisen mit Status, Teilnehmenden und Fortschritt.",
        },
        budget: {
          title: "Budget planen",
          body:
            "Vergleiche Budgetstufen und lege Ausgabenlimits pro Reise fest.",
        },
        visa: {
          title: "Visa prüfen",
          body:
            "Suche Visaregeln nach Staatsangehorigkeit und Ziel und speichere das Ergebnis.",
        },
        notifications: {
          title: "Immer auf dem Laufenden",
          body:
            "Erhalte Updates zu Visa, Zahlungen und Teamaktivitat.",
        },
        settings: {
          title: "Profil und Einstellungen",
          body:
            "Passe dein Konto, das Design und Benachrichtigungen jederzeit an.",
        },
      },
    },
    help: {
      title: "Hilfe und Support",
      subtitle:
        "Finde schnelle Antworten, behebe Probleme oder kontaktiere das Team.",
      quickHelpTitle: "Schnelle Hilfe",
      quickHelpBody:
        "Sieh dir die FAQ unten fuer die haeufigsten Fragen und Loesungen an.",
      accountSettingsCta: "Kontoeinstellungen",
      contactSupportTitle: "Support kontaktieren",
      contactSupportBody:
        "Sende uns eine Nachricht und wir melden uns innerhalb eines Werktags.",
      systemStatusTitle: "Systemstatus",
      systemStatusBody: "Alle Dienste sind betriebsbereit.",
      statusButton: "Statusseite",
      faqTitle: "FAQ zur Fehlerbehebung",
      faqs: [
        {
          question: "Wie aktualisiere ich meine Kontodaten?",
          answer:
            "Oeffne die Kontoeinstellungen im Profilmenue. Du kannst Email, Passwort und andere Sitzungen widerrufen.",
        },
        {
          question: "Warum ist mein Visa-Status unbekannt?",
          answer:
            "Wir zeigen nur zwischengespeicherte Daten an, wenn verfuegbar. Oeffne die Visa-Seite der Reise, um den Status manuell zu setzen.",
        },
        {
          question: "Wie setze ich Budgets nach Aenderungen zurueck?",
          answer:
            "Budgetposten sind pro Reise editierbar. Nutze den Budget-Editor, um Betraege zu aktualisieren oder Kategorien zu entfernen.",
        },
        {
          question: "Wie melde ich mich ueberall ab?",
          answer:
            "Gehe zu den Kontoeinstellungen und waehle \"Andere Sitzungen abmelden\", um alle anderen Geraete zu widerrufen.",
        },
      ],
    },
    supportDialog: {
      triggerButton: "Support per Email",
      title: "Support kontaktieren",
      description: "Teile die Details und wir melden uns per Email.",
      emailLabel: "Deine Email",
      emailPlaceholder: "you@example.com",
      subjectLabel: "Betreff",
      subjectPlaceholder: "Problem mit Reisebudgets",
      messageLabel: "Nachricht",
      messagePlaceholder: "Beschreibe das Problem oder die Anfrage...",
      cancel: "Abbrechen",
      send: "Nachricht senden",
      sending: "Senden...",
      toastErrorTitle: "Nachricht konnte nicht gesendet werden",
      toastErrorDescription: "Bitte versuche es erneut.",
      toastSuccessTitle: "Nachricht gesendet",
      toastSuccessDescription: "Der Support meldet sich bald.",
      validationEmail: "Gib eine gueltige Email-Adresse ein.",
      validationSubject: "Der Betreff sollte mindestens 3 Zeichen haben.",
      validationMessage: "Die Nachricht sollte mindestens 10 Zeichen haben.",
    },
    notificationPreferences: {
      emailTitle: "Email-Benachrichtigungen",
      emailBody: "Erhalte wichtige Updates per Email.",
      inAppTitle: "In-App-Benachrichtigungen",
      inAppBody: "Zeige Updates im Benachrichtigungsmenue.",
      save: "Einstellungen speichern",
      saving: "Speichern...",
      toastSuccessTitle: "Einstellungen aktualisiert",
      toastSuccessDescription: "Deine Benachrichtigungseinstellungen wurden gespeichert.",
      toastErrorTitle: "Aktualisierung fehlgeschlagen",
      toastErrorDescription: "Wir konnten deine Einstellungen nicht speichern.",
    },
    dashboardOverview: {
      stats: {
        totalBudgetLabel: "Gesamtbudget",
        totalBudgetHelper: "Ueber alle aktiven Reisen",
        activeTripsLabel: "Aktive Reisen",
        activeTripsHelper: "Reisen, die in SoleilRoute erstellt wurden",
        paidInvoicesLabel: "Bezahlt",
        paidInvoicesHelper: "Als bezahlt markiert in allen Kategorien",
        outstandingLabel: "Offen",
        outstandingHelper: "Verbleibender Betrag zur Verteilung",
        upcomingTripsLabel: "Bevorstehende Reisen",
        upcomingTripsHelper: "Start in den naechsten 30 Tagen",
        overBudgetLabel: "Ueber Budget",
        overBudgetHelper: "Geplant ueber dem Gesamtbudget",
      },
    },
    quickActions: {
      title: "Schnellaktionen",
      dialogTitle: "Neue Reise planen",
      dialogDescription:
        "Gib die Reisedetails ein und wir berechnen die erste Budgetaufteilung und Visa-Hinweise.",
      actions: {
        planTripTitle: "Neue Reise planen",
        planTripDescription:
          "Erstelle eine Reiseroute mit Budgetkategorien und Visa-Check.",
        reviewBudgetsTitle: "Budgets pruefen",
        reviewBudgetsDescription: "Plane ein Budget je Ziel und Reisestil.",
        checkVisaTitle: "Visa pruefen",
        checkVisaDescription:
          "Pruefe Visaregeln vor der Buchung.",
      },
    },
    tripForm: {
      submitDefault: "Reise erstellen",
      submitting: "Reise wird erstellt...",
      createSuccessTitle: "Reise erstellt",
      createSuccessDescription:
        "Wir haben eine erste Budgetaufteilung und Visa-Checkliste erstellt.",
      createErrorTitle: "Etwas ist schiefgelaufen",
      createErrorDescription:
        "Reise konnte nicht gespeichert werden. Bitte erneut versuchen.",
      fields: {
        nameLabel: "Reisename",
        citizenshipLabel: "Staatsangehoerigkeit",
        destinationCountryLabel: "Zielland",
        destinationCityLabel: "Zielstadt",
        startDateLabel: "Startdatum",
        endDateLabel: "Enddatum",
        totalBudgetLabel: "Gesamtbudget",
        travelStyleLabel: "Reisestil",
        currencyLabel: "Reisewaehrung",
        baseCurrencyLabel: "Basiswaehrung",
        notesLabel: "Notizen",
      },
      placeholders: {
        name: "Sommer in Tokio",
        destinationCountry: "Japan",
        destinationCity: "Tokio",
        notes: "Visaarten, Must-sees oder Erinnerungen...",
        selectCitizenship: "Staatsangehoerigkeit waehlen",
        searchCountries: "Laender suchen",
        currency: "Waehrung",
        baseCurrency: "Basiswaehrung",
        travelStyle: "Stil auswaehlen",
      },
      autoSplitMessage: (count: number, categories: string) =>
        `Wir teilen dein Budget automatisch auf ${count} Kategorien auf: ${categories}. Du kannst die Aufteilung im Reise-Dashboard anpassen.`,
      validation: {
        nameMin: "Der Reisename muss mindestens 3 Zeichen haben.",
        destinationCountryRequired: "Zielland ist erforderlich.",
        destinationCityRequired: "Zielstadt ist erforderlich.",
        startDateInvalid: "Bitte ein gueltiges Startdatum angeben.",
        startDateRequired: "Startdatum ist erforderlich.",
        endDateInvalid: "Bitte ein gueltiges Enddatum angeben.",
        endDateRequired: "Enddatum ist erforderlich.",
        totalBudgetInvalid: "Gesamtbudget muss eine Zahl sein.",
        totalBudgetPositive: "Budget muss groesser als null sein.",
        currencyLength: "Waehrung muss ein 3-stelliger ISO-Code sein.",
        citizenshipRequired: "Bitte Staatsangehoerigkeit angeben.",
        baseCurrencyLength:
          "Basiswaehrung muss ein 3-stelliger ISO-Code sein.",
        travelStyleRequired: "Reisestil ist erforderlich.",
        endDateAfterStart: "Enddatum muss nach dem Startdatum liegen.",
      },
    },
    tripDetailsEditor: {
      trigger: "Reise bearbeiten",
      title: "Reise bearbeiten",
      description:
        "Aktualisiere die Details. Budgetposten bleiben, bis du sie unten aenderst.",
      cancel: "Abbrechen",
      save: "Speichern",
      saving: "Speichern...",
      toastSuccessTitle: "Reise aktualisiert",
      toastSuccessDescription: "Reisedetails wurden aktualisiert.",
      toastErrorTitle: "Aktualisierung fehlgeschlagen",
      toastErrorDescription: "Aenderungen konnten nicht gespeichert werden.",
    },
    tripList: {
      emptyTitle: "Noch keine Reisen",
      emptyDescription:
        "Erstelle deine erste Reise, um Budget-Analysen und Visa-Hinweise zu sehen.",
      openTrip: "Reise oeffnen",
      manageBudget: "Budget verwalten",
      visaChecklist: "Visa-Checkliste",
      deleteTrip: "Reise loeschen",
      deleting: "Loeschen...",
      confirmDelete:
        "Diese Reise loeschen? Alle Budgetposten werden entfernt.",
      sharedLabel: (role: string) => `Geteilt (${role})`,
      budgetProgressLabel: "Budgetfortschritt",
      budgetProgressSummary: (percent: number) =>
        `${percent}% des Budgets als bezahlt markiert.`,
      toastDeleteTitle: "Reise geloescht",
      toastDeleteDescription: "Die Reise wurde entfernt.",
      toastDeleteErrorTitle: "Reise konnte nicht geloescht werden",
      toastDeleteErrorDescription: "Bitte spaeter erneut versuchen.",
    },
    tripsView: {
      pageDescription:
        "Alle deine Reisen sind hier. Oeffne eine Reise, um Budget und Visa zu bearbeiten.",
      searchPlaceholder: "Reisen, Staedte oder Laender suchen",
      statusPlaceholder: "Visa-Status",
      statusAll: "Alle Visa-Status",
      sortPlaceholder: "Sortieren nach",
      sortOptions: {
        upcoming: "Startdatum (frueh)",
        latest: "Startdatum (spaet)",
        ending: "Enddatum (frueh)",
        name: "Name A-Z",
        visa_status: "Visa-Status Prioritaet",
        budget_high: "Budget (hoch zu niedrig)",
        budget_low: "Budget (niedrig zu hoch)",
      },
      resetFilters: "Filter zuruecksetzen",
    },
    tripOverview: {
      backToTrips: "Zurueck zu Reisen",
      sharedEditor: "Geteilt (Editor)",
      sharedViewer: "Geteilt (Betrachter)",
      detailsTitle: "Reisedetails",
      detailLabels: {
        dates: "Daten",
        destination: "Ziel",
        citizenship: "Staatsangehoerigkeit",
        totalBudget: "Gesamtbudget",
        spentPaid: "Ausgegeben (bezahlt)",
        visaStatus: "Visa-Status",
        baseCurrency: "Basiswaehrung",
      },
      notesTitle: "Notizen",
      notesEmpty: "Noch keine Notizen.",
      ownerFallback: "Eigentuemer",
      collaboratorUnknown: "unbekannt",
    },
    tripBudgetPage: {
      backToOverview: "Reiseuebersicht",
      title: "Budgetaufteilung",
    },
    tripBudget: {
      progressTitle: "Budgetfortschritt",
      paidSoFar: "Bisher bezahlt",
      progressSummary: (percent: number, planned: string) =>
        `${percent}% des Budgets als bezahlt markiert. Geplante Ausgaben: ${planned}.`,
    },
    budget: {
      categories: {
        transport: "Transport",
        accommodation: "Unterkunft",
        food: "Verpflegung",
        activities: "Aktivitaeten",
        visa: "Visum",
        other: "Sonstiges",
      },
    },
    budgetChart: {
      title: "Budgetuebersicht",
      description:
        "Vergleiche geplante und bezahlte Ausgaben je Kategorie.",
      plannedLabel: "Geplant",
      paidLabel: "Bezahlt",
    },
    budgetItems: {
      title: "Budgetposten",
      summaryPlanned: "Geplant",
      summaryPaid: "Bezahlt",
      summaryRemaining: "Rest",
      summaryOverBudget: "Ueber Budget",
      summaryOutstanding: "offen",
      noItems: "Noch keine Budgetposten. Fuege deine erste Ausgabe hinzu.",
      categoryLabel: "Kategorie",
      descriptionLabel: "Beschreibung",
      amountLabel: "Betrag",
      paidLabel: "Bezahlt",
      savedLabel: "Gespeichert",
      remove: "Entfernen",
      saveChanges: "Speichern",
      saving: "Speichern...",
      addTitle: "Budgetposten hinzufuegen",
      addButton: "Hinzufuegen",
      adding: "Hinzufuegen...",
      newDescriptionPlaceholder: "Taxi zum Flughafen, Unterkunft",
      editDescriptionPlaceholder:
        "Hotelanzahlung, Bahnpass, Museumstickets",
      viewOnly: "Du hast nur Lesezugriff auf diese Reise.",
      confirmDelete:
        "Diesen Budgetposten loeschen? Dies kann nicht rueckgaengig gemacht werden.",
      toastInvalidAmountTitle: "Ungueltiger Betrag",
      toastInvalidAmountDescription: "Betrag muss groesser als null sein.",
      toastSaveTitle: "Budget aktualisiert",
      toastSaveDescription: "Aenderungen gespeichert.",
      toastSaveErrorTitle: "Aktualisierung fehlgeschlagen",
      toastSaveErrorDescription: "Aenderungen konnten nicht gespeichert werden.",
      toastToggleErrorTitle: "Aktualisierung nicht moeglich",
      toastToggleErrorDescription: "Status konnte nicht aktualisiert werden.",
      toastAddTitle: "Budgetposten hinzugefuegt",
      toastAddDescription: "Der neue Eintrag ist jetzt in der Liste.",
      toastAddErrorTitle: "Hinzufuegen fehlgeschlagen",
      toastAddErrorDescription: "Bitte spaeter erneut versuchen.",
      toastDeleteTitle: "Budgetposten entfernt",
      toastDeleteDescription: "Der Eintrag wurde geloescht.",
      toastDeleteErrorTitle: "Loeschen fehlgeschlagen",
      toastDeleteErrorDescription: "Bitte spaeter erneut versuchen.",
    },
    budgetCaps: {
      title: "Ausgabenlimits",
      description:
        "Lege Limits pro Kategorie fest, um im Rahmen zu bleiben.",
      plannedLabel: "Geplant",
      capLabel: "Limit",
      noCap: "Kein Limit",
      overBy: "Ueber",
      capInputLabel: "Limit",
      saveCaps: "Limits speichern",
      saving: "Speichern...",
      viewOnly: "Du hast nur Lesezugriff auf diese Reise.",
      toastSuccessTitle: "Limits gespeichert",
      toastSuccessDescription: "Kategorie-Limits wurden aktualisiert.",
      toastErrorTitle: "Speichern fehlgeschlagen",
      toastErrorDescription: "Bitte spaeter erneut versuchen.",
    },
    budgetPlanner: {
      title: "Budgetplaner",
      description:
        "Schaetze Tageskosten pro Person und verteile das Budget nach Kategorien.",
      destinationLabel: "Zielland",
      destinationPlaceholder: "Land auswaehlen",
      destinationSearchPlaceholder: "Laender suchen",
      travelStyleLabel: "Reisestil",
      travelStylePlaceholder: "Stil auswaehlen",
      tripLengthLabel: "Reisedauer (Tage)",
      travelersLabel: "Reisende",
      dailyEstimateTitle: "Tageskosten",
      dailyEstimateNote: (currency: string) =>
        `Pro Person, pro Tag in ${currency}.`,
      totalEstimateTitle: "Gesamtschaetzung",
      totalEstimateNote: (days: number, travelers: number) =>
        `${days} Tage, ${travelers} Reisende.`,
      categorySplitTitle: "Aufteilung nach Kategorien",
      highlightsTitle: "Highlights",
      notesTitle: "Notizen",
      notesFallback: "Passe Schaetzungen an die Saison an.",
      estimatesFootnote: "Schaetzungen ohne Fluege und Reiseversicherung.",
      tierTitle: "Vergleich der Stufen",
      tierDescription: "Vergleiche Budgetstufen fuer dasselbe Ziel.",
      tierSelected: "Ausgewaehlt",
      tierPerDay: "Pro Tag",
      tierPerTrip: "Gesamt",
      tierBadgesTitle: "Reisestil",
      tiers: {
        budget: {
          label: "Budget",
          description: "Basisbedarf und einfache Unterkuenfte.",
        },
        mid: {
          label: "Mittel",
          description: "Ausgewogener Komfort und Aktivitaeten.",
        },
        luxury: {
          label: "Luxus",
          description: "Premium-Unterkuenfte und Erlebnisse.",
        },
      },
      noMatches: "Keine Treffer gefunden.",
    },
    visa: {
      statuses: {
        unknown: "Unbekannt",
        required: "Visum erforderlich",
        in_progress: "In Bearbeitung",
        approved: "Genehmigt",
        not_required: "Nicht erforderlich",
      },
    },
    visaChecker: {
      title: "Visa-Anforderungen",
      description: "Bestaetige Visa-Pflichten vor der Buchung.",
      citizenshipLabel: "Staatsangehoerigkeit",
      destinationLabel: "Zielland",
      citizenshipSearchPlaceholder: "Laender suchen",
      destinationSearchPlaceholder: "Ziele suchen",
      destinationPlaceholder: "Ziel auswaehlen",
      noMatches: "Keine Treffer gefunden.",
      noDestinations: "Keine Ziele verfuegbar.",
      checkButton: "Anforderungen pruefen",
      checking: "Pruefen...",
      addToTrip: "Zur Reise hinzufuegen",
      createTripTitle: "Reise erstellen",
      createTripDescription:
        "Wir haben Staatsangehoerigkeit und Ziel vorausgefuellt.",
      tripName: (destination: string) => `Reise nach ${destination}`,
      toastMissingTitle: "Fehlende Angaben",
      toastMissingDescription: "Waehle Staatsangehoerigkeit und Ziel.",
      toastErrorTitle: "Pruefung fehlgeschlagen",
      toastErrorDescription:
        "Visa-Anforderungen konnten nicht geladen werden.",
      resultsNote:
        "Ergebnisse kombinieren Passport Index und die SoleilRoute Bibliothek. Fuege zur Reise hinzu, um Updates zu erhalten.",
      emptyState:
        "Keine zwischengespeicherten Daten fuer diese Route. Fuege die Reise hinzu, um eine Echtzeitpruefung ueber Passport Index zu starten.",
      resultStatusRequired: "Visum erforderlich",
      resultStatusFree: "Visumfreie Einreise moeglich",
      badgeRequired: "Visum erforderlich",
      badgeNotRequired: "Visum nicht erforderlich",
      detailVisaType: "Visa-Typ",
      detailValidity: "Gueltigkeit",
      detailProcessing: "Bearbeitungszeit",
      detailCost: "Kosten",
      noFee: "Keine Gebuehr",
      viewEmbassy: "Botschaftsinfo ansehen",
      lastCheckedLabel: "Zuletzt geprueft",
      sourceLabel: "Quelle",
      insightsTitle: "Reiseinfos",
      insightsCurrency: "Waehrung",
      insightsLanguages: "Sprachen",
      insightsTimezones: "Zeitzonen",
      insightsCallingCodes: "Ländervorwahlen",
      insightsCapital: "Hauptstadt",
    },
    visaStatusEditor: {
      currentStatusLabel: "Aktueller Status",
      selectPlaceholder: "Status waehlen",
      lastCheckedLabel: "Zuletzt geprueft",
      noChecks: "Keine aktuellen Visa-Pruefungen.",
      toastSuccessTitle: "Visa-Status aktualisiert",
      toastSuccessDescription: "Gespeichert.",
      toastErrorTitle: "Aktualisierung fehlgeschlagen",
      toastErrorDescription: "Visa-Status konnte nicht aktualisiert werden.",
    },
    tripVisaPage: {
      backToOverview: "Reiseuebersicht",
      title: "Visa-Checkliste",
      subtitle: (citizenship: string, destination: string) =>
        `${citizenship} nach ${destination}`,
      requirementsTitle: "Anforderungen",
      visaRequired: "Visum erforderlich",
      visaNotRequired: "Visum nicht erforderlich",
      detailValidity: "Gueltigkeit",
      detailProcessing: "Bearbeitungszeit",
      detailCost: "Geschaetzte Kosten",
      detailEmbassy: "Botschaftslink",
      embassyLink: "Botschaftsseite besuchen",
      noFee: "Keine Gebuehr",
      noCache:
        "Keine zwischengespeicherten Anforderungen fuer diese Route. Fuege die Reise hinzu, damit wir Details abrufen, sobald die Integrationen verbunden sind.",
    },
    timeline: {
      title: "Zeitplan",
      description:
        "Verfolge Meilensteine und Zahlungsreminder mit Reisedaten.",
      empty: "Noch keine Eintraege. Fuege unten den ersten Meilenstein hinzu.",
      fieldTitle: "Titel",
      fieldDueDate: "Faelligkeit",
      fieldType: "Typ",
      fieldAmount: "Betrag",
      fieldNotes: "Notizen",
      typeMilestone: "Meilenstein",
      typePayment: "Zahlungserinnerung",
      statusCompleted: "Erledigt",
      statusPending: "Offen",
      notesPlaceholder: "Erinnerungen, Links oder Aufgaben",
      itemSaved: "Gespeichert",
      remove: "Entfernen",
      saveChanges: "Speichern",
      saving: "Speichern...",
      addTitle: "Eintrag hinzufuegen",
      addButton: "Hinzufuegen",
      adding: "Hinzufuegen...",
      newTitlePlaceholder: "Flug buchen, Hotelanzahlung, Museumstickets",
      newNotesPlaceholder: "Kurze Erinnerung oder Checkliste hinzufuegen.",
      optionalAmount: "Optional",
      viewOnly: "Du hast nur Lesezugriff auf diese Reise.",
      confirmDelete:
        "Diesen Eintrag loeschen? Dies kann nicht rueckgaengig gemacht werden.",
      toastMissingDetailsTitle: "Fehlende Angaben",
      toastMissingDetailsDescription: "Fuege einen Titel und ein Datum hinzu.",
      toastInvalidAmountTitle: "Ungueltiger Betrag",
      toastInvalidAmountDescription: "Betrag muss groesser als null sein.",
      toastUpdateTitle: "Zeitplan aktualisiert",
      toastUpdateDescription: "Aenderungen gespeichert.",
      toastUpdateErrorTitle: "Aktualisierung fehlgeschlagen",
      toastUpdateErrorDescription: "Aenderungen konnten nicht gespeichert werden.",
      toastAddTitle: "Eintrag hinzugefuegt",
      toastAddDescription: "Der neue Eintrag ist jetzt in der Liste.",
      toastAddErrorTitle: "Hinzufuegen fehlgeschlagen",
      toastAddErrorDescription: "Bitte spaeter erneut versuchen.",
      toastDeleteTitle: "Eintrag entfernt",
      toastDeleteDescription: "Der Eintrag wurde geloescht.",
      toastDeleteErrorTitle: "Loeschen fehlgeschlagen",
      toastDeleteErrorDescription: "Bitte spaeter erneut versuchen.",
      toastStatusErrorTitle: "Aktualisierung nicht moeglich",
      toastStatusErrorDescription: "Status konnte nicht aktualisiert werden.",
      dueNoDate: "Kein Datum",
      dueOverdue: (days: number) => `Ueberfaellig um ${days}t`,
      dueIn: (days: number) => `Faellig in ${days}t`,
    },
    collaborators: {
      title: "Kollaborativer Bereich",
      description: "Teile diese Reise und verwalte Berechtigungen.",
      youLabel: "(Du)",
      addedLabel: (date: string) => `Hinzugefuegt ${date}`,
      ownerLabel: "Eigentuemer",
      roleEditor: "Editor",
      roleViewer: "Betrachter",
      remove: "Entfernen",
      pendingTitle: "Ausstehende Einladungen",
      pendingInvite: (role: string, date: string) =>
        `${role} Einladung - ${date}`,
      pendingLabel: "Wartet auf Antwort",
      inviteTitle: "Mitarbeiter einladen",
      emailLabel: "Email",
      emailPlaceholder: "teammate@example.com",
      roleLabel: "Rolle",
      sendInvite: "Einladung senden",
      inviting: "Sende...",
      viewOnly: "Nur der Eigentuemer kann Mitwirkende verwalten.",
      confirmRemove:
        "Mitarbeiter entfernen? Zugriff geht verloren.",
      toastMissingEmailTitle: "Email fehlt",
      toastMissingEmailDescription: "Gib eine Email-Adresse ein.",
      toastInviteTitle: "Einladung gesendet",
      toastInviteDescription: "Zugriff startet nach Annahme.",
      toastInviteErrorTitle: "Senden fehlgeschlagen",
      toastInviteErrorDescription: "Email pruefen und erneut versuchen.",
      toastRoleTitle: "Rolle aktualisiert",
      toastRoleDescription: "Berechtigungen aktualisiert.",
      toastRoleErrorTitle: "Rolle konnte nicht aktualisiert werden",
      toastRoleErrorDescription: "Bitte erneut versuchen.",
      toastRemoveTitle: "Mitwirkender entfernt",
      toastRemoveDescription: "Zugriff wurde entzogen.",
      toastRemoveErrorTitle: "Entfernen fehlgeschlagen",
      toastRemoveErrorDescription: "Bitte spaeter erneut versuchen.",
    },
  },
  es: {
    common: {
      languageLabel: "Idioma",
      orLabel: "o",
      newLabel: "Nuevo",
      closeLabel: "Cerrar",
      justNow: "Ahora mismo",
    },
    site: {
      description:
        "Planificacion de viajes inteligente con presupuestos en tiempo real, guia de visados e inteligencia de divisas.",
    },
    navigation: {
      features: "Funciones",
      howItWorks: "Como funciona",
      pricing: "Precios",
      faqs: "Preguntas frecuentes",
      signIn: "Iniciar sesion",
      createAccount: "Crear cuenta gratis",
      startPlanning: "Empezar gratis",
      exploreFeatures: "Ver funciones",
      home: "Inicio",
      dashboard: "Panel",
      trips: "Viajes",
      budgetPlanner: "Planificador de presupuesto",
      visaChecker: "Verificador de visado",
      community: "Comunidad",
      moderation: "Moderacion",
      admin: "Admin",
      notifications: "Notificaciones",
      settings: "Configuracion",
      help: "Ayuda",
    },
    hero: {
      pill: "Planificacion de viajes inteligente, paso a paso",
      title:
        "Disena viajes inolvidables con presupuestos en tiempo real y claridad de visados",
      description:
        "SoleilRoute combina inteligencia de divisas, automatizacion de visados e itinerarios colaborativos para que tus viajes esten organizados, cumplan requisitos y esten dentro del presupuesto antes de hacer la maleta.",
      highlightOne: "Datos de visado para mas de 190 paises",
      highlightTwo: "Itinerarios colaborativos con control de presupuesto",
      trustTitle: "Por que los equipos confian en SoleilRoute",
      trustBullets: [
        "El 90 % de los viajeros se mantiene dentro del presupuesto gracias a previsiones automaticas.",
        "Los requisitos de visado se actualizan cada 12 horas desde Passport Index.",
        "Tipos de cambio seguidos en mas de 180 divisas con alertas.",
      ],
      noCreditCard: "No se requiere tarjeta. Cancela cuando quieras.",
    },
    features: {
      heading: "Todo lo que necesitas para orquestar viajes mas inteligentes",
      subheading:
        "Planifica, presupuesta y ejecuta itinerarios con un unico hub colaborativo.",
      items: [
        {
          title: "Inteligencia de visados",
          description:
            "Comprueba al instante requisitos de visado, tiempos, tasas y enlaces a embajadas para cualquier destino.",
        },
        {
          title: "Automatizacion de presupuesto",
          description:
            "Establece topes de gasto, controla pagos y visualiza categorias con paneles de Recharts.",
        },
        {
          title: "Planificacion de linea de tiempo",
          description:
            "Mantiene los itinerarios organizados con hitos con fecha y recordatorios de pago.",
        },
        {
          title: "Espacio colaborativo",
          description:
            "Comparte itinerarios, asigna tareas y recibe actualizaciones con acceso seguro.",
        },
      ],
    },
    howItWorks: {
      heading: "Planifica en tres fases estructuradas",
      subheading:
        "Traza el viaje perfecto desde la idea hasta la ejecucion con un flujo guiado.",
      steps: [
        {
          title: "Crea tu viaje",
          body: "Agrega destino, fechas, presupuesto y ciudadania. SoleilRoute sincroniza requisitos de visado y tipos de cambio en segundos.",
        },
        {
          title: "Asigna tu presupuesto",
          body: "Distribuye fondos entre transporte, alojamiento, comida, actividades, visados y extras. Controla pagos y pendientes en una sola vista.",
        },
        {
          title: "Cumple y mantente informado",
          body: "Recibe alertas de visado, actualizaciones de politicas y recordatorios de pago. Exporta itinerarios o comparte paneles al instante.",
        },
      ],
      stepLabel: (step: number) => `Paso ${step}`,
    },
    pricing: {
      heading: "Precios que crecen con tus aventuras",
      subheading:
        "Herramientas potentes con precios transparentes. Mejora cuando quieras.",
      popular: "Popular",
      plans: [
        {
          name: "Inicial",
          price: "Gratis",
          description:
            "Perfecto para viajeros curiosos que planifican su proximo viaje.",
          features: [
            "Hasta 2 viajes activos",
            "Seguimiento de presupuesto con limites por categoria",
            "Recomendaciones de visado para los 20 mejores destinos",
            "Recordatorios por email de pagos",
          ],
          cta: "Empezar gratis",
        },
        {
          name: "Pro",
          price: "$12",
          period: "al mes",
          description:
            "Flujos avanzados para viajeros frecuentes y equipos.",
          features: [
            "Viajes activos ilimitados",
            "Paneles compartidos y edicion colaborativa",
            "Inteligencia completa de visados con enlaces a embajadas",
            "Alertas de divisas y aprobaciones de gastos",
            "Exportaciones PDF y branding personalizado",
          ],
          cta: "Iniciar prueba de 14 dias",
        },
        {
          name: "Empresa",
          price: "Personalizado",
          description:
            "Cumplimiento y reportes para equipos de operaciones de viaje.",
          features: [
            "Manager de exito dedicado",
            "SAML SSO y control de acceso por roles",
            "Integraciones financieras y politicas",
            "Soporte prioritario y onboarding",
          ],
          cta: "Hablar con ventas",
        },
      ],
    },
    faqs: {
      heading: "Respuestas para viajeros curiosos",
      subheading:
        "Todo lo que necesitas saber antes de lanzar tu proximo viaje.",
      items: [
        {
          question: "Que paises estan soportados para la revision de visados?",
          answer:
            "Mantenemos informacion de visados para mas de 190 destinos con datos de Passport Index y nuestro equipo de cumplimiento. Cada resultado incluye estado, tipo, validez, costos y enlaces a embajadas.",
        },
        {
          question: "Que tan precisas son las conversiones de divisas?",
          answer:
            "Las actualizaciones de tipo de cambio se realizan cada 4 horas desde ExchangeRate API. Puedes bloquear un tipo por viaje y controlar el gasto en la divisa del viaje y tu divisa base.",
        },
        {
          question: "Puedo invitar a mi equipo o companeros de viaje?",
          answer:
            "Si. SoleilRoute incluye comparticion segura con acceso por roles. Invita lectores o co-planificadores, define permisos y colabora en itinerarios, presupuestos y documentos de visado.",
        },
        {
          question: "Ofrecen exportaciones PDF o reportes?",
          answer:
            "Los planes Pro incluyen exportaciones PDF de itinerarios, resumenes de presupuesto, cronogramas de pago y requisitos de visado.",
        },
      ],
    },
    footer: {
      product: "Producto",
      resources: "Recursos",
      company: "Empresa",
      links: {
        features: "Funciones",
        pricing: "Precios",
        releaseNotes: "Notas de version",
        documentation: "Documentacion",
        support: "Soporte",
        blog: "Blog",
        about: "Acerca de",
        careers: "Carreras",
        contact: "Contacto",
      },
      legal: {
        privacy: "Privacidad",
        terms: "Terminos",
        status: "Estado",
        rights: "Todos los derechos reservados.",
      },
    },
    auth: {
      login: {
        title: "Bienvenido de nuevo",
        subtitle: "Inicia sesion para acceder a tus paneles de viaje.",
        googleButton: "Continuar con Google",
        divider: "o",
        noAccount: "Necesitas una cuenta?",
        createAccount: "Crear una",
        submit: "Iniciar sesion",
        submitting: "Iniciando sesion...",
        emailLabel: "Email",
        passwordLabel: "Contrasena",
        placeholderEmail: "you@example.com",
        placeholderPassword: "********",
        toast: {
          errorTitle: "No se pudo iniciar sesion",
          errorDescription: "Verifica tus credenciales.",
          successTitle: "Bienvenido de nuevo",
          successDescription: "Has iniciado sesion.",
        },
        validation: {
          email: "Introduce un email valido.",
          password: "La contrasena debe tener al menos 6 caracteres.",
        },
      },
      register: {
        title: "Unete a SoleilRoute",
        subtitle: "Gestiona visados, presupuestos e itinerarios en minutos.",
        googleButton: "Registrarse con Google",
        divider: "o",
        haveAccount: "Ya tienes una cuenta?",
        signIn: "Iniciar sesion",
        submit: "Crear cuenta",
        submitting: "Creando cuenta...",
        emailLabel: "Email",
        passwordLabel: "Contrasena",
        confirmLabel: "Confirmar contrasena",
        placeholderEmail: "you@example.com",
        placeholderPassword: "********",
        placeholderConfirm: "********",
        toast: {
          errorTitle: "No se pudo registrar",
          errorDescription: "Error inesperado. Intentalo de nuevo.",
        },
        validation: {
          email: "Introduce un email valido.",
          password: "La contrasena debe tener al menos 8 caracteres.",
          confirm: "Las contrasenas no coinciden.",
        },
      },
    },
    dashboard: {
      headerTitle: "Panel",
      headerSubtitle:
        "Supervisa tus proximos viajes, presupuestos y requisitos de visado.",
      signedInAs: "Conectado como",
      accountSettings: "Configuracion de la cuenta",
      themeLight: "Cambiar a modo claro",
      themeDark: "Cambiar a modo oscuro",
      help: "Ayuda",
      signOut: "Cerrar sesion",
      home: "Inicio",
      workspaceTitle: "Espacio de trabajo",
      needHelp: "Necesitas ayuda?",
    },
    settings: {
      title: "Configuracion de la cuenta",
      subtitle: "Actualiza tu perfil, contrasena y sesiones activas.",
      profileTitle: "Perfil",
      passwordTitle: "Contrasena",
      sessionsTitle: "Sesiones",
    },
    profileForm: {
      emailLabel: "Email",
      displayNameLabel: "Nombre visible",
      avatarLabel: "Avatar",
      avatarAlt: "Avatar del perfil",
      avatarPlaceholder: "Sin avatar",
      save: "Guardar cambios",
      saving: "Guardando...",
      toastErrorTitle: "No se pudo actualizar el email",
      toastErrorDescription: "Intentalo de nuevo.",
      toastSuccessTitle: "Perfil actualizado",
      toastSuccessDescription: "Tu direccion de email ha sido guardada.",
      validationEmail: "Introduce un email valido.",
      validationDisplayName: "El nombre debe tener al menos 2 caracteres.",
    },
    passwordForm: {
      currentLabel: "Contrasena actual",
      newLabel: "Nueva contrasena",
      confirmLabel: "Confirmar nueva contrasena",
      save: "Actualizar contrasena",
      saving: "Guardando...",
      toastErrorTitle: "No se pudo actualizar la contrasena",
      toastErrorDescription: "Intentalo de nuevo.",
      toastSuccessTitle: "Contrasena actualizada",
      toastSuccessDescription:
        "Usa la nueva contrasena la proxima vez que inicies sesion.",
      validationCurrent: "Introduce tu contrasena actual.",
      validationNew: "La contrasena debe tener al menos 8 caracteres.",
      validationConfirm: "Las contrasenas no coinciden.",
    },
    sessionsForm: {
      activeLabel: "Sesiones activas",
      revoke: "Cerrar otras sesiones",
      revoking: "Cerrando...",
      toastErrorTitle: "No se pudieron revocar las sesiones",
      toastErrorDescription: "Intentalo de nuevo.",
      toastSuccessTitle: "Sesiones revocadas",
      toastSuccessDescription: "Cerraste sesion en otros dispositivos.",
    },
    notifications: {
      menuTitle: "Notificaciones",
      markAllRead: "Marcar todo como leido",
      loading: "Cargando notificaciones...",
      empty: "Aun no hay notificaciones.",
      viewAll: "Ver todas las notificaciones",
      viewDetails: "Ver detalles",
      newBadge: "Nuevo",
      historyTitle: "Notificaciones",
      historySubtitle:
        "Revisa actualizaciones, filtra por tipo y gestiona como recibes alertas.",
      pendingInvitationsTitle: "Invitaciones pendientes",
      pendingInvitationsSubtitle:
        "Acepta o rechaza invitaciones antes de que aparezcan en tu panel.",
      preferencesTitle: "Preferencias de notificacion",
      searchPlaceholder: "Buscar notificaciones",
      statusPlaceholder: "Estado",
      statusAll: "Todos los estados",
      statusUnread: "No leidas",
      statusRead: "Leidas",
      typePlaceholder: "Tipo",
      typeAll: "Todos los tipos",
      typeSuccess: "Exito",
      typeWarning: "Advertencia",
      typeInfo: "Info",
      refresh: "Actualizar",
      refreshing: "Actualizando...",
      noMatches: "No hay notificaciones que coincidan con tus filtros.",
      markRead: "Marcar como leido",
      invitationEmpty: "No hay invitaciones pendientes.",
      invitationRoleEditor: "Editor",
      invitationRoleViewer: "Lector",
      invitationDecline: "Rechazar",
      invitationAccept: "Aceptar",
      tripFallback: "Viaje",
      unknownDestination: "Destino desconocido",
      invitedByFallback: "companero",
      invitedBy: (name: string, date: string) => `Invitado por ${name} - ${date}`,
    },
    community: {
      title: "Comunidad",
      subtitle: "Comparte lugares, puntos y consejos.",
      createTitle: "Comparte algo nuevo",
      createSubtitle: "Los posts se revisan antes de publicar.",
      fields: {
        tag: "Etiqueta",
        text: "Tu mensaje",
        mapUrl: "Enlace del mapa",
        image: "Foto",
      },
      placeholders: {
        tag: "Elige etiqueta",
        text: "Comparte tu descubrimiento...",
        mapUrl: "Enlace Google Maps u OSM",
      },
      tabs: {
        feed: "Comunidad",
        mine: "Mis posts",
        saved: "Guardados",
      },
      tags: {
        place: "Lugar",
        map_point: "Punto",
        landmark: "Atraccion",
        other: "Otro",
      },
      status: {
        pending: "En revision",
        approved: "Aprobado",
        rejected: "Rechazado",
      },
      publish: "Enviar",
      posting: "Enviando...",
      refresh: "Actualizar",
      loading: "Cargando posts...",
      emptyFeed: "Aun no hay posts.",
      emptyMine: "No has enviado posts.",
      emptySaved: "No hay posts guardados.",
      viewMap: "Abrir mapa",
      rejectionReason: "Motivo",
      mediaHint: "Agrega foto o enlace del mapa.",
      mediaImageHint: "Foto (JPG/PNG/WebP/GIF), max 10 MB.",
      mediaMapHint: "Enlace del mapa para punto o ruta.",
      detailsTitle: "Detalles del post",
      noMap: "Sin enlace del mapa.",
      unknownAuthor: "Viajero",
      profile: {
        title: "Perfil del viajero",
        subtitle: "Publicaciones compartidas por este viajero.",
        postsTitle: "Publicaciones",
        postsEmpty: "Aun no hay publicaciones.",
      },
      toastSubmittedTitle: "Post enviado",
      toastSubmittedDescription: "Tu post esta en revision.",
      toastErrorTitle: "No se pudo enviar",
      toastErrorDescription: "Intenta de nuevo.",
      comments: {
        title: "Comentarios",
        placeholder: "Escribe un comentario...",
        reply: "Responder",
        submit: "Publicar",
        submitting: "Publicando...",
        empty: "Sin comentarios.",
        loading: "Cargando comentarios...",
        toastSuccessTitle: "Comentario publicado",
        toastSuccessDescription: "Tu comentario esta visible.",
        toastErrorTitle: "No se pudo comentar",
        toastErrorDescription: "Intenta de nuevo.",
      },
      actions: {
        edit: "Editar post",
        delete: "Eliminar post",
        like: "Me gusta",
        savePost: "Guardar",
        save: "Guardar cambios",
        cancel: "Cancelar",
        saving: "Guardando...",
        confirmDelete: "Eliminar este post? No se puede deshacer.",
        toastUpdatedTitle: "Post actualizado",
        toastUpdatedDescription: "Cambios guardados.",
        toastDeletedTitle: "Post eliminado",
        toastDeletedDescription: "El post fue eliminado.",
      },
      validation: {
        tagRequiredTitle: "Elige etiqueta",
        tagRequiredDescription: "Indica que quieres compartir.",
        textRequiredTitle: "Agrega descripcion",
        textRequiredDescription: "Minimo 10 caracteres.",
        textProhibitedTitle: "Contenido prohibido",
        textProhibitedDescription: "Quita palabras ofensivas.",
        mediaRequiredTitle: "Foto o enlace",
        mediaRequiredDescription: "Agrega foto o enlace del mapa.",
        mapInvalidTitle: "Enlace invalido",
        mapInvalidDescription: "Usa Google Maps u OSM.",
        imageSizeTitle: "Imagen demasiado grande",
        imageSizeDescription: "Max 10 MB.",
      },
    },
    moderation: {
      title: "Moderacion",
      subtitle: "Aprueba o rechaza posts.",
      loading: "Cargando moderacion...",
      empty: "No hay posts pendientes.",
      approve: "Aprobar",
      reject: "Rechazar",
      reasonPlaceholder: "Motivo (opcional)",
      toastApprovedTitle: "Post aprobado",
      toastApprovedDescription: "El post ya esta visible.",
      toastRejectedTitle: "Post rechazado",
      toastRejectedDescription: "Autor notificado.",
      toastErrorTitle: "Error",
      toastErrorDescription: "Intenta de nuevo.",
    },
    admin: {
      title: "Admin",
      subtitle: "Gestion de moderadores.",
      loading: "Cargando usuarios...",
      empty: "No hay usuarios.",
      refresh: "Actualizar",
      searchPlaceholder: "Buscar por email",
      adminLabel: "Admin",
      moderatorLabel: "Moderador",
      toastUpdatedTitle: "Moderador actualizado",
      toastUpdatedDescription: "Permisos guardados.",
      toastErrorTitle: "Error",
      toastErrorDescription: "Intenta de nuevo.",
    },
    onboarding: {
      stepLabel: (current: number, total: number) => `Paso ${current} de ${total}`,
      next: "Siguiente",
      back: "Atras",
      done: "Listo",
      skip: "Omitir",
      loadingHint:
        "Cargando este paso. Si tarda demasiado, haz clic en \"Siguiente\".",
      steps: {
        welcome: {
          title: "Bienvenido a SoleilRoute",
          body:
            "Vamos a recorrer las funciones clave para planificar tu primer viaje.",
        },
        planTrip: {
          title: "Crea tu primer viaje",
          body:
            "Usa Acciones rapidas para definir fechas, destino y presupuesto en pocos clics.",
        },
        trips: {
          title: "Gestiona viajes",
          body:
            "Aqui estan todos los viajes activos con estados, viajeros y progreso.",
        },
        budget: {
          title: "Planifica el presupuesto",
          body:
            "Compara niveles de presupuesto y fija limites por viaje.",
        },
        visa: {
          title: "Revisa visados",
          body:
            "Busca requisitos de visa por ciudadania y destino, y guarda el resultado.",
        },
        notifications: {
          title: "Mantente informado",
          body:
            "Recibe alertas sobre visados, pagos y actividad del equipo.",
        },
        settings: {
          title: "Perfil y preferencias",
          body:
            "Actualiza tu cuenta, tema y notificaciones cuando quieras.",
        },
      },
    },
    help: {
      title: "Ayuda y soporte",
      subtitle:
        "Encuentra respuestas rapidas, resuelve problemas o contacta al equipo.",
      quickHelpTitle: "Ayuda rapida",
      quickHelpBody:
        "Consulta las FAQ abajo para las preguntas y soluciones mas comunes.",
      accountSettingsCta: "Configuracion de la cuenta",
      contactSupportTitle: "Contactar soporte",
      contactSupportBody:
        "Envianos un mensaje y responderemos en un dia habil.",
      systemStatusTitle: "Estado del sistema",
      systemStatusBody: "Todos los servicios estan operativos.",
      statusButton: "Pagina de estado",
      faqTitle: "FAQ de solucion de problemas",
      faqs: [
        {
          question: "Como actualizo mis datos de cuenta?",
          answer:
            "Abre la configuracion de la cuenta desde el menu de perfil. Puedes actualizar email, contrasena y revocar otras sesiones.",
        },
        {
          question: "Por que mi estado de visado aparece como desconocido?",
          answer:
            "Solo mostramos datos en cache cuando estan disponibles. Abre la pagina de visados del viaje para definir el estado manualmente.",
        },
        {
          question: "Como reinicio presupuestos tras cambiar totales?",
          answer:
            "Los items de presupuesto son editables por viaje. Usa el editor de presupuesto para actualizar montos o eliminar categorias.",
        },
        {
          question: "Como cierro sesion en todos lados?",
          answer:
            "Ve a configuracion de la cuenta y selecciona \"Cerrar otras sesiones\" para revocar otros dispositivos.",
        },
      ],
    },
    supportDialog: {
      triggerButton: "Soporte por email",
      title: "Contactar soporte",
      description: "Comparte los detalles y te responderemos por email.",
      emailLabel: "Tu email",
      emailPlaceholder: "you@example.com",
      subjectLabel: "Asunto",
      subjectPlaceholder: "Problema con presupuestos de viaje",
      messageLabel: "Mensaje",
      messagePlaceholder: "Describe el problema o la solicitud...",
      cancel: "Cancelar",
      send: "Enviar mensaje",
      sending: "Enviando...",
      toastErrorTitle: "No se pudo enviar el mensaje",
      toastErrorDescription: "Intentalo de nuevo.",
      toastSuccessTitle: "Mensaje enviado",
      toastSuccessDescription: "Soporte se pondra en contacto pronto.",
      validationEmail: "Introduce un email valido.",
      validationSubject: "El asunto debe tener al menos 3 caracteres.",
      validationMessage: "El mensaje debe tener al menos 10 caracteres.",
    },
    notificationPreferences: {
      emailTitle: "Notificaciones por email",
      emailBody: "Recibe actualizaciones importantes por email.",
      inAppTitle: "Notificaciones en la app",
      inAppBody: "Mostrar actualizaciones en el menu de notificaciones.",
      save: "Guardar preferencias",
      saving: "Guardando...",
      toastSuccessTitle: "Preferencias actualizadas",
      toastSuccessDescription: "Tus ajustes de notificacion se han guardado.",
      toastErrorTitle: "Actualizacion fallida",
      toastErrorDescription: "No pudimos guardar tus preferencias.",
    },
    dashboardOverview: {
      stats: {
        totalBudgetLabel: "Presupuesto total",
        totalBudgetHelper: "En todos los viajes activos",
        activeTripsLabel: "Viajes activos",
        activeTripsHelper: "Viajes creados en SoleilRoute",
        paidInvoicesLabel: "Pagado",
        paidInvoicesHelper: "Marcado como pagado por categoria",
        outstandingLabel: "Pendiente",
        outstandingHelper: "Monto restante por asignar",
        upcomingTripsLabel: "Viajes proximos",
        upcomingTripsHelper: "Comienzan en 30 dias",
        overBudgetLabel: "Sobre presupuesto",
        overBudgetHelper: "Planificado por encima del total",
      },
    },
    quickActions: {
      title: "Acciones rapidas",
      dialogTitle: "Planear nuevo viaje",
      dialogDescription:
        "Completa los detalles y calcularemos el presupuesto inicial y requisitos de visa.",
      actions: {
        planTripTitle: "Planear nuevo viaje",
        planTripDescription:
          "Crea un itinerario con categorias de presupuesto y visados.",
        reviewBudgetsTitle: "Revisar presupuestos",
        reviewBudgetsDescription:
          "Planifica un rango de presupuesto por destino y estilo.",
        checkVisaTitle: "Verificar visado",
        checkVisaDescription:
          "Comprueba requisitos antes de reservar.",
      },
    },
    tripForm: {
      submitDefault: "Crear viaje",
      submitting: "Creando viaje...",
      createSuccessTitle: "Viaje creado",
      createSuccessDescription:
        "Generamos un presupuesto inicial y checklist de visado.",
      createErrorTitle: "Algo salio mal",
      createErrorDescription:
        "No pudimos guardar este viaje. Intentalo de nuevo.",
      fields: {
        nameLabel: "Nombre del viaje",
        citizenshipLabel: "Ciudadania",
        destinationCountryLabel: "Pais de destino",
        destinationCityLabel: "Ciudad de destino",
        startDateLabel: "Fecha de inicio",
        endDateLabel: "Fecha de fin",
        totalBudgetLabel: "Presupuesto total",
        travelStyleLabel: "Estilo de viaje",
        currencyLabel: "Moneda del viaje",
        baseCurrencyLabel: "Moneda base",
        notesLabel: "Notas",
      },
      placeholders: {
        name: "Verano en Tokio",
        destinationCountry: "Japon",
        destinationCity: "Tokio",
        notes: "Tipos de visado, actividades clave o recordatorios...",
        selectCitizenship: "Selecciona ciudadania",
        searchCountries: "Buscar paises",
        currency: "Moneda",
        baseCurrency: "Moneda base",
        travelStyle: "Selecciona estilo",
      },
      autoSplitMessage: (count: number, categories: string) =>
        `Dividimos tu presupuesto automaticamente en ${count} categorias: ${categories}. Puedes ajustar la asignacion en el panel del viaje.`,
      validation: {
        nameMin: "El nombre del viaje debe tener al menos 3 caracteres.",
        destinationCountryRequired: "El pais de destino es obligatorio.",
        destinationCityRequired: "La ciudad de destino es obligatoria.",
        startDateInvalid: "Introduce una fecha de inicio valida.",
        startDateRequired: "La fecha de inicio es obligatoria.",
        endDateInvalid: "Introduce una fecha de fin valida.",
        endDateRequired: "La fecha de fin es obligatoria.",
        totalBudgetInvalid: "El presupuesto total debe ser un numero.",
        totalBudgetPositive: "El presupuesto debe ser mayor que cero.",
        currencyLength: "La moneda debe ser un codigo ISO de 3 letras.",
        citizenshipRequired: "Introduce tu ciudadania.",
        baseCurrencyLength:
          "La moneda base debe ser un codigo ISO de 3 letras.",
        travelStyleRequired: "El estilo de viaje es obligatorio.",
        endDateAfterStart: "La fecha de fin debe ser posterior a la de inicio.",
      },
    },
    tripDetailsEditor: {
      trigger: "Editar viaje",
      title: "Editar viaje",
      description:
        "Actualiza los detalles. Los items de presupuesto se mantienen hasta que los edites.",
      cancel: "Cancelar",
      save: "Guardar",
      saving: "Guardando...",
      toastSuccessTitle: "Viaje actualizado",
      toastSuccessDescription: "Los detalles del viaje se actualizaron.",
      toastErrorTitle: "Actualizacion fallida",
      toastErrorDescription: "No pudimos guardar los cambios.",
    },
    tripList: {
      emptyTitle: "Aun no hay viajes",
      emptyDescription:
        "Crea tu primer itinerario para activar presupuesto y visados.",
      openTrip: "Abrir viaje",
      manageBudget: "Gestionar presupuesto",
      visaChecklist: "Checklist de visado",
      deleteTrip: "Eliminar viaje",
      deleting: "Eliminando...",
      confirmDelete:
        "Eliminar este viaje? Se eliminaran todos los items de presupuesto.",
      sharedLabel: (role: string) => `Compartido (${role})`,
      budgetProgressLabel: "Progreso del presupuesto",
      budgetProgressSummary: (percent: number) =>
        `${percent}% del presupuesto marcado como pagado.`,
      toastDeleteTitle: "Viaje eliminado",
      toastDeleteDescription: "El viaje se elimino.",
      toastDeleteErrorTitle: "No se pudo eliminar el viaje",
      toastDeleteErrorDescription: "Intentalo mas tarde.",
    },
    tripsView: {
      pageDescription:
        "Todos tus itinerarios estan aqui. Abre un viaje para ajustar presupuesto y visados.",
      searchPlaceholder: "Buscar viajes, ciudades o paises",
      statusPlaceholder: "Estado de visado",
      statusAll: "Todos los estados de visado",
      sortPlaceholder: "Ordenar por",
      sortOptions: {
        upcoming: "Fecha de inicio (proxima)",
        latest: "Fecha de inicio (mas tarde)",
        ending: "Fecha de fin (proxima)",
        name: "Nombre A-Z",
        visa_status: "Prioridad de estado de visado",
        budget_high: "Presupuesto (alto a bajo)",
        budget_low: "Presupuesto (bajo a alto)",
      },
      resetFilters: "Restablecer filtros",
    },
    tripOverview: {
      backToTrips: "Volver a viajes",
      sharedEditor: "Compartido (Editor)",
      sharedViewer: "Compartido (Lector)",
      detailsTitle: "Detalles del viaje",
      detailLabels: {
        dates: "Fechas",
        destination: "Destino",
        citizenship: "Ciudadania",
        totalBudget: "Presupuesto total",
        spentPaid: "Gastado (pagado)",
        visaStatus: "Estado de visado",
        baseCurrency: "Moneda base",
      },
      notesTitle: "Notas",
      notesEmpty: "Aun no hay notas.",
      ownerFallback: "propietario",
      collaboratorUnknown: "desconocido",
    },
    tripBudgetPage: {
      backToOverview: "Resumen del viaje",
      title: "Detalle del presupuesto",
    },
    tripBudget: {
      progressTitle: "Progreso del presupuesto",
      paidSoFar: "Pagado hasta ahora",
      progressSummary: (percent: number, planned: string) =>
        `${percent}% del presupuesto marcado como pagado. Gasto planificado: ${planned}.`,
    },
    budget: {
      categories: {
        transport: "Transporte",
        accommodation: "Alojamiento",
        food: "Comida",
        activities: "Actividades",
        visa: "Visa",
        other: "Otros",
      },
    },
    budgetChart: {
      title: "Resumen del presupuesto",
      description:
        "Compara gastos planificados y pagados por categoria.",
      plannedLabel: "Planificado",
      paidLabel: "Pagado",
    },
    budgetItems: {
      title: "Items de presupuesto",
      summaryPlanned: "Planificado",
      summaryPaid: "Pagado",
      summaryRemaining: "Restante",
      summaryOverBudget: "Sobre presupuesto",
      summaryOutstanding: "pendiente",
      noItems: "Aun no hay items de presupuesto. Agrega el primero abajo.",
      categoryLabel: "Categoria",
      descriptionLabel: "Descripcion",
      amountLabel: "Monto",
      paidLabel: "Pagado",
      savedLabel: "Guardado",
      remove: "Eliminar",
      saveChanges: "Guardar cambios",
      saving: "Guardando...",
      addTitle: "Agregar item de presupuesto",
      addButton: "Agregar",
      adding: "Agregando...",
      newDescriptionPlaceholder: "Taxi al aeropuerto, alojamiento",
      editDescriptionPlaceholder: "Deposito de hotel, pase de tren, entradas",
      viewOnly: "Solo tienes acceso de lectura a este viaje.",
      confirmDelete: "Eliminar este item de presupuesto? No se puede deshacer.",
      toastInvalidAmountTitle: "Monto invalido",
      toastInvalidAmountDescription: "El monto debe ser mayor que cero.",
      toastSaveTitle: "Presupuesto actualizado",
      toastSaveDescription: "Cambios guardados.",
      toastSaveErrorTitle: "No se pudo actualizar",
      toastSaveErrorDescription: "No pudimos guardar los cambios.",
      toastToggleErrorTitle: "No se pudo actualizar",
      toastToggleErrorDescription: "No pudimos actualizar el estado de pago.",
      toastAddTitle: "Item agregado",
      toastAddDescription: "La nueva entrada ya esta en la lista.",
      toastAddErrorTitle: "No se pudo agregar",
      toastAddErrorDescription: "Intentalo de nuevo.",
      toastDeleteTitle: "Item eliminado",
      toastDeleteDescription: "El item se elimino.",
      toastDeleteErrorTitle: "No se pudo eliminar",
      toastDeleteErrorDescription: "Intentalo mas tarde.",
    },
    budgetCaps: {
      title: "Topes de gasto",
      description:
        "Define limites por categoria para mantener el presupuesto.",
      plannedLabel: "Planificado",
      capLabel: "Tope",
      noCap: "Sin tope",
      overBy: "Exceso",
      capInputLabel: "Tope",
      saveCaps: "Guardar topes",
      saving: "Guardando...",
      viewOnly: "Solo tienes acceso de lectura a este viaje.",
      toastSuccessTitle: "Topes guardados",
      toastSuccessDescription: "Los limites por categoria se actualizaron.",
      toastErrorTitle: "Error al guardar",
      toastErrorDescription: "Intentalo de nuevo.",
    },
    budgetPlanner: {
      title: "Planificador de presupuesto",
      description:
        "Estima costos diarios por persona y reparte por categoria.",
      destinationLabel: "Pais de destino",
      destinationPlaceholder: "Selecciona un pais",
      destinationSearchPlaceholder: "Buscar paises",
      travelStyleLabel: "Estilo de viaje",
      travelStylePlaceholder: "Selecciona estilo",
      tripLengthLabel: "Duracion (dias)",
      travelersLabel: "Viajeros",
      dailyEstimateTitle: "Estimacion diaria",
      dailyEstimateNote: (currency: string) =>
        `Por persona, por dia, en ${currency}.`,
      totalEstimateTitle: "Estimacion total",
      totalEstimateNote: (days: number, travelers: number) =>
        `${days} dias, ${travelers} viajero${travelers > 1 ? "s" : ""}.`,
      categorySplitTitle: "Division por categoria",
      highlightsTitle: "Destacados",
      notesTitle: "Notas",
      notesFallback: "Ajusta por estacionalidad.",
      estimatesFootnote: "Estimaciones sin vuelos ni seguro de viaje.",
      tierTitle: "Comparacion de niveles",
      tierDescription:
        "Compara niveles de presupuesto para el mismo destino.",
      tierSelected: "Seleccionado",
      tierPerDay: "Por dia",
      tierPerTrip: "Total del viaje",
      tierBadgesTitle: "Estilo de viaje",
      tiers: {
        budget: {
          label: "Economico",
          description: "Basico y alojamientos sencillos.",
        },
        mid: {
          label: "Medio",
          description: "Comodidad y actividades balanceadas.",
        },
        luxury: {
          label: "Lujo",
          description: "Estancias premium y experiencias.",
        },
      },
      noMatches: "No hay coincidencias.",
    },
    visa: {
      statuses: {
        unknown: "Desconocido",
        required: "Se requiere visa",
        in_progress: "En proceso",
        approved: "Aprobado",
        not_required: "No se requiere",
      },
    },
    visaChecker: {
      title: "Requisitos de visa",
      description: "Confirma requisitos antes de reservar.",
      citizenshipLabel: "Ciudadania",
      destinationLabel: "Pais de destino",
      citizenshipSearchPlaceholder: "Buscar paises",
      destinationSearchPlaceholder: "Buscar destinos",
      destinationPlaceholder: "Selecciona destino",
      noMatches: "No hay coincidencias.",
      noDestinations: "No hay destinos disponibles.",
      checkButton: "Verificar requisitos",
      checking: "Verificando...",
      addToTrip: "Agregar al viaje",
      createTripTitle: "Crear un viaje",
      createTripDescription:
        "Prellenamos ciudadania y destino para empezar.",
      tripName: (destination: string) => `Viaje a ${destination}`,
      toastMissingTitle: "Faltan datos",
      toastMissingDescription: "Selecciona ciudadania y destino.",
      toastErrorTitle: "No se pudo verificar",
      toastErrorDescription: "No pudimos cargar requisitos de visa.",
      resultsNote:
        "Los resultados combinan Passport Index y la biblioteca de SoleilRoute. Agrega al viaje para recibir actualizaciones.",
      emptyState:
        "No hay datos en cache para esta ruta. Agrega el viaje para activar la consulta en tiempo real con Passport Index.",
      resultStatusRequired: "Se requiere visa",
      resultStatusFree: "Entrada sin visa disponible",
      badgeRequired: "Se requiere visa",
      badgeNotRequired: "Visa no requerida",
      detailVisaType: "Tipo de visa",
      detailValidity: "Validez",
      detailProcessing: "Tiempo de procesamiento",
      detailCost: "Costo",
      noFee: "Sin tarifa",
      viewEmbassy: "Ver info de embajada",
      lastCheckedLabel: "Ultima revision",
      sourceLabel: "Fuente",
      insightsTitle: "Info del pais",
      insightsCurrency: "Moneda",
      insightsLanguages: "Idiomas",
      insightsTimezones: "Zonas horarias",
      insightsCallingCodes: "Codigos de llamada",
      insightsCapital: "Capital",
    },
    visaStatusEditor: {
      currentStatusLabel: "Estado actual",
      selectPlaceholder: "Selecciona estado",
      lastCheckedLabel: "Ultima revision",
      noChecks: "No hay revisiones recientes.",
      toastSuccessTitle: "Estado de visa actualizado",
      toastSuccessDescription: "Guardado.",
      toastErrorTitle: "No se pudo actualizar",
      toastErrorDescription: "No pudimos actualizar el estado de visa.",
    },
    tripVisaPage: {
      backToOverview: "Resumen del viaje",
      title: "Checklist de visa",
      subtitle: (citizenship: string, destination: string) =>
        `${citizenship} a ${destination}`,
      requirementsTitle: "Requisitos",
      visaRequired: "Se requiere visa",
      visaNotRequired: "No se requiere visa",
      detailValidity: "Validez",
      detailProcessing: "Tiempo de procesamiento",
      detailCost: "Costo estimado",
      detailEmbassy: "Enlace de embajada",
      embassyLink: "Visitar sitio",
      noFee: "Sin tarifa",
      noCache:
        "No tenemos requisitos en cache para esta ruta. Agrega el viaje y obtendremos los detalles cuando las integraciones esten conectadas.",
    },
    timeline: {
      title: "Planificador de tiempos",
      description:
        "Sigue hitos y recordatorios de pago ligados a las fechas.",
      empty: "Aun no hay elementos. Agrega el primero abajo.",
      fieldTitle: "Titulo",
      fieldDueDate: "Fecha limite",
      fieldType: "Tipo",
      fieldAmount: "Monto",
      fieldNotes: "Notas",
      typeMilestone: "Hito",
      typePayment: "Recordatorio de pago",
      statusCompleted: "Completado",
      statusPending: "Pendiente",
      notesPlaceholder: "Recordatorios, enlaces o tareas",
      itemSaved: "Guardado",
      remove: "Eliminar",
      saveChanges: "Guardar cambios",
      saving: "Guardando...",
      addTitle: "Agregar elemento",
      addButton: "Agregar",
      adding: "Agregando...",
      newTitlePlaceholder: "Reservar vuelos, deposito de hotel, entradas",
      newNotesPlaceholder: "Agrega un recordatorio o checklist.",
      optionalAmount: "Opcional",
      viewOnly: "Solo tienes acceso de lectura a este viaje.",
      confirmDelete: "Eliminar este elemento? No se puede deshacer.",
      toastMissingDetailsTitle: "Faltan datos",
      toastMissingDetailsDescription:
        "Agrega un titulo y una fecha antes de guardar.",
      toastInvalidAmountTitle: "Monto invalido",
      toastInvalidAmountDescription: "El monto debe ser mayor que cero.",
      toastUpdateTitle: "Linea de tiempo actualizada",
      toastUpdateDescription: "Cambios guardados.",
      toastUpdateErrorTitle: "No se pudo actualizar",
      toastUpdateErrorDescription: "No pudimos guardar los cambios.",
      toastAddTitle: "Elemento agregado",
      toastAddDescription: "El nuevo recordatorio ya esta en la lista.",
      toastAddErrorTitle: "No se pudo agregar",
      toastAddErrorDescription: "Intentalo de nuevo.",
      toastDeleteTitle: "Elemento eliminado",
      toastDeleteDescription: "El recordatorio fue eliminado.",
      toastDeleteErrorTitle: "No se pudo eliminar",
      toastDeleteErrorDescription: "Intentalo mas tarde.",
      toastStatusErrorTitle: "No se pudo actualizar",
      toastStatusErrorDescription: "No pudimos actualizar el estado.",
      dueNoDate: "Sin fecha",
      dueOverdue: (days: number) => `Atrasado ${days}d`,
      dueIn: (days: number) => `Vence en ${days}d`,
    },
    collaborators: {
      title: "Espacio colaborativo",
      description: "Comparte este viaje y gestiona permisos.",
      youLabel: "(Tu)",
      addedLabel: (date: string) => `Agregado ${date}`,
      ownerLabel: "Propietario",
      roleEditor: "Editor",
      roleViewer: "Lector",
      remove: "Eliminar",
      pendingTitle: "Invitaciones pendientes",
      pendingInvite: (role: string, date: string) =>
        `${role} invitacion - ${date}`,
      pendingLabel: "En espera de respuesta",
      inviteTitle: "Invitar colaborador",
      emailLabel: "Email",
      emailPlaceholder: "teammate@example.com",
      roleLabel: "Rol",
      sendInvite: "Enviar invitacion",
      inviting: "Enviando...",
      viewOnly: "Solo el propietario puede gestionar colaboradores.",
      confirmRemove:
        "Eliminar este colaborador? Perdera acceso al viaje.",
      toastMissingEmailTitle: "Falta email",
      toastMissingEmailDescription: "Introduce un email para invitar.",
      toastInviteTitle: "Invitacion enviada",
      toastInviteDescription: "El acceso inicia cuando acepten.",
      toastInviteErrorTitle: "No se pudo enviar",
      toastInviteErrorDescription: "Verifica el email y reintenta.",
      toastRoleTitle: "Rol actualizado",
      toastRoleDescription: "Permisos actualizados.",
      toastRoleErrorTitle: "No se pudo actualizar el rol",
      toastRoleErrorDescription: "Intentalo de nuevo.",
      toastRemoveTitle: "Colaborador eliminado",
      toastRemoveDescription: "Acceso revocado.",
      toastRemoveErrorTitle: "No se pudo eliminar",
      toastRemoveErrorDescription: "Intentalo mas tarde.",
    },
  },
} satisfies Record<Locale, Translations>;

export function resolveLocale(value?: string | null): Locale {
  if (value && locales.includes(value as Locale)) {
    return value as Locale;
  }
  return defaultLocale;
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations[defaultLocale];
}
