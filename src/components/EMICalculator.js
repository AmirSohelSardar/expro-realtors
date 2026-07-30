"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";

function formatINR(n) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export default function EMICalculator({ price }) {
  const [loanAmount, setLoanAmount] = useState(Math.round((price || 1000000) * 0.8));
  const [downPayment, setDownPayment] = useState(Math.round((price || 1000000) * 0.2));
  const [tenureYears, setTenureYears] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);

  const principal = Math.max(0, loanAmount);

  const { emi, totalInterest, totalPayment } = useMemo(() => {
    const monthlyRate = interestRate / 12 / 100;
    const months = tenureYears * 12;
    if (principal <= 0 || monthlyRate <= 0 || months <= 0) {
      return { emi: 0, totalInterest: 0, totalPayment: 0 };
    }
    const factor = Math.pow(1 + monthlyRate, months);
    const monthlyEmi = (principal * monthlyRate * factor) / (factor - 1);
    const total = monthlyEmi * months;
    return {
      emi: monthlyEmi,
      totalInterest: total - principal,
      totalPayment: total,
    };
  }, [principal, tenureYears, interestRate]);

  return (
    <div className="mt-10 overflow-hidden rounded-sm border border-ink-800/10">
      <div className="bg-ink-950 px-5 py-4 text-center sm:px-6">
        <p className="flex items-center justify-center gap-2 font-display text-lg italic text-paper-50">
          <Calculator size={18} className="text-brass-400" />
          EMI Calculator
        </p>
        <p className="mt-1 text-xs text-paper-100/60">Estimate your monthly loan payment for this property</p>
      </div>

      <div className="grid gap-6 bg-paper-50 p-5 sm:grid-cols-2 sm:p-6">
        <div>
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Loan Amount</label>
            <span className="font-mono text-sm font-semibold text-ink-950">{formatINR(loanAmount)}</span>
          </div>
          <input
            type="range"
            min={100000}
            max={Math.max(price || 10000000, 10000000)}
            step={50000}
            value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))}
            className="mt-3 w-full accent-brass-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Down Payment</label>
            <span className="font-mono text-sm font-semibold text-ink-950">{formatINR(downPayment)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(price || 10000000, 10000000)}
            step={50000}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="mt-3 w-full accent-brass-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Loan Tenure</label>
            <span className="font-mono text-sm font-semibold text-ink-950">{tenureYears} Year(s)</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="mt-3 w-full accent-brass-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Interest Rate</label>
            <span className="font-mono text-sm font-semibold text-ink-950">{interestRate}%</span>
          </div>
          <input
            type="range"
            min={5}
            max={16}
            step={0.05}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="mt-3 w-full accent-brass-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-ink-800/10 border-t border-ink-800/10 bg-paper-100/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="p-5 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-800/50">Monthly EMI</p>
          <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-brass-600">{formatINR(emi)}</p>
        </div>
        <div className="p-5 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-800/50">Total Interest</p>
          <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-ink-950">{formatINR(totalInterest)}</p>
        </div>
        <div className="p-5 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink-800/50">Total Payment</p>
          <p className="mt-1 font-mono text-xl font-semibold tabular-nums text-ink-950">{formatINR(totalPayment)}</p>
        </div>
      </div>

      <p className="bg-paper-50 px-5 py-3 text-center text-[11px] text-ink-800/40 sm:px-6">
        This is an estimate for informational purposes only and does not constitute a loan offer.
      </p>
    </div>
  );
}