import type { FormOption } from "./common";

export type BudgetRange = {
    id?: number;
    label: string;
    sublabel?: string;
    range?: string;
    value: string;
};

export type QuoteFormData = {
    id?: number;
    // Step 1
    title?: string;
    description?: string;
    stepLabel?: string;
    shopifyQuestion?: string;
    shopifyQuestionHint?: string;
    yesLabel?: string;
    noLabel?: string;
    shopifyLinkLabel?: string;
    shopifyLinkPlaceholder?: string;
    continueLabel?: string;
    storeWarning?: string;

    // Step 2
    step2Title?: string;
    step2Description?: string;
    step2Label?: string;
    budgetLabel?: string;
    budgetHint?: string;
    budgetRanges?: BudgetRange[];
    issuesLabel?: string;
    issuesHint?: string;
    issueOptions?: FormOption[];
    otherIssuesLabel?: string;
    otherIssuesPlaceholder?: string;
    issuesWarning?: string;
    budgetWarning?: string;
    selectionWarning?: string;
    estimateButtonLabel?: string;

    // Step 3
    resultTitle?: string;
    resultDescription?: string;
    step3Label?: string;
    estimateLabel?: string;
    basedOnLabel?: string;
    phoneLabel?: string;
    phonePlaceholder?: string;
    phoneWarning?: string;
    emailLabel?: string;
    emailPlaceholder?: string;
    bookCallButtonLabel?: string;
    submittingButtonLabel?: string;
    successTitle?: string;
    successDescription?: string;
    disclaimer?: string;
    closeButtonLabel?: string;
};
