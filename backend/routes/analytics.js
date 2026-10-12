const express = require("express");
const db = require("../db");
const { authenticate, authorize } = require("../middleware/auth");
const { forecastRevenue, generateInsights } = require("../utils/ai");

const router = express.Router();

// GET /api/analytics/summary  -> any logged-in user
router.get("/summary", authenticate, (req, res) => {
  const monthly = db.getSales().map((m) => ({ ...m, profit: m.revenue - m.expenses }));
  if (monthly.length < 3) return res.status(400).json({ message: "Need at least 3 months of data" });

  const { forecast, slope } = forecastRevenue(monthly, 3);
  const insights = generateInsights(monthly, slope);

  const totalRevenue = monthly.reduce((s, m) => s + m.revenue, 0);
  const totalProfit = monthly.reduce((s, m) => s + m.profit, 0);
  const last = monthly[monthly.length - 1];
  const prev = monthly[monthly.length - 2];

  res.json({
    kpis: {
      totalRevenue,
      totalProfit,
      customers: last.customers,
      growth: Number((((last.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1)),
    },
    monthly,
    forecast,
    insights,
  });
});

// POST /api/analytics/sales  -> ADMIN only
router.post("/sales", authenticate, authorize("admin"), (req, res) => {
  const { month, revenue, expenses, customers } = req.body;
  if (!/^\d{4}-\d{2}$/.test(month || "")) return res.status(400).json({ message: "Month must be YYYY-MM" });
  if ([revenue, expenses, customers].some((v) => v === "" || v === null || isNaN(Number(v)) || Number(v) < 0))
    return res.status(400).json({ message: "Revenue, expenses and customers must be positive numbers" });

  const sales = db.getSales();
  if (sales.find((s) => s.month === month)) return res.status(409).json({ message: "Month already exists" });

  sales.push({ month, revenue: Number(revenue), expenses: Number(expenses), customers: Number(customers) });
  sales.sort((a, b) => a.month.localeCompare(b.month));
  db.saveSales(sales);
  res.status(201).json({ message: "Sales record added" });
});

module.exports = router;
