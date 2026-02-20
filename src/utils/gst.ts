type GSTInput = {
  amount: number;
  rate: number; // 0 | 5 | 12 | 18 | 28
  companyState?: string;
  companyGSTIN?: string;
  partyState?: string;
  partyGSTIN?: string;
};

export function computeGST({
  amount,
  rate,
  companyState,
  companyGSTIN,
  partyState,
  partyGSTIN,
}: GSTInput) {
  // If rate is 0, then no tax.
  if (rate === 0) {
    return {
      type: "NONE",
      tax: 0,
      total: amount,
      breakup: null,
    };
  }

  const taxAmount = (amount * rate) / 100;

  // If states are present and same, Intra-state (CGST + SGST)
  // We use case-insensitive comparison for safety
  const isIntraState =
    companyState &&
    partyState &&
    companyState.toLowerCase() === partyState.toLowerCase();

  if (isIntraState) {
    const half = taxAmount / 2;

    return {
      type: "CGST_SGST",
      tax: taxAmount,
      total: amount + taxAmount,
      breakup: {
        cgst: { rate: rate / 2, amount: half },
        sgst: { rate: rate / 2, amount: half },
      },
    };
  }

  // Default to IGST (Inter-state)
  return {
    type: "IGST",
    tax: taxAmount,
    total: amount + taxAmount,
    breakup: {
      igst: { rate, amount: taxAmount },
    },
  };
}
