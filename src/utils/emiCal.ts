export function calculateEMI({
  principal,
  annualRate,
  tenureMonths,
}: {
  principal: number;
  annualRate: number;
  tenureMonths: number;
}) {
  if (!principal || !tenureMonths) {
    return { emi: 0, totalPayable: 0, totalInterest: 0 };
  }

  const monthlyRate = annualRate / 12 / 100;

  let emi = 0;
  if (monthlyRate === 0) {
    emi = principal / tenureMonths;
  } else {
    emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  }

  const totalPayable = emi * tenureMonths;
  const totalInterest = totalPayable - principal;

  return {
    emi: Math.round(emi),
    totalPayable: Math.round(totalPayable),
    totalInterest: Math.round(totalInterest),
  };
}
