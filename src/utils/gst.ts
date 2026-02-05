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
  if (!companyGSTIN || !partyGSTIN || rate === 0) {
    return {
      type: "NONE",
      tax: 0,
      total: amount,
      breakup: null,
    };
  }

  const taxAmount = (amount * rate) / 100;

  if (companyState === partyState) {
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

  return {
    type: "IGST",
    tax: taxAmount,
    total: amount + taxAmount,
    breakup: {
      igst: { rate, amount: taxAmount },
    },
  };
}
