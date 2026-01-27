"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#6366F1", // COGS - indigo
  "#F97316", // Expenses - orange
  "#EF4444", // Write-downs - red
  "#10B981", // Net profit - green
];

export default function ProfitLossWheel({ summary }: any) {
  const data = [
    {
      name: "COGS",
      value: summary.cogs,
    },
    {
      name: "Operating Expenses",
      value: summary.expenses,
    },
    {
      name: "Inventory Write-downs",
      value: summary.inventoryWriteDowns,
    },
    {
      name: "Net Profit",
      value: Math.max(summary.netProfit, 0),
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-slate-700 uppercase mb-4">
        Profit Distribution
      </h3>

      <div className="h-72 w-full">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              formatter={(v: number) =>
                `₹${v.toLocaleString()}`
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xs text-slate-500">Total Sales</p>
        <p className="text-xl font-bold text-slate-900">
            ₹{summary.sales.toLocaleString()}
        </p>
      </div>


      {/* LEGEND */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {data.map((d, i) => (
          <div
            key={d.name}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[i] }}
              />
              <span className="text-slate-600">
                {d.name}
              </span>
            </div>

            <span className="font-medium text-slate-900">
              ₹{d.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
