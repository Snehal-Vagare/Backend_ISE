// "AI" module: simple, explainable machine learning (no external API).
// 1) Linear regression -> forecast future revenue
// 2) Statistics (mean, std-dev, z-score) -> detect unusual months
// 3) Rule-based text generation -> business insights

function linearRegression(values) {
  const n = values.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  values.forEach((y, x) => {
    sumX += x; sumY += y; sumXY += x * y; sumXX += x * x;
  });
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

function nextMonth(ym) {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m, 1); // m is 1-based, so this is the next month
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function forecastRevenue(monthly, count = 3) {
  const revenues = monthly.map((m) => m.revenue);
  const { slope, intercept } = linearRegression(revenues);
  const result = [];
  let month = monthly[monthly.length - 1].month;
  for (let i = 0; i < count; i++) {
    month = nextMonth(month);
    const x = revenues.length + i;
    result.push({ month, forecast: Math.round(intercept + slope * x) });
  }
  return { forecast: result, slope };
}

function generateInsights(monthly, slope) {
  const insights = [];
  const last = monthly[monthly.length - 1];
  const prev = monthly[monthly.length - 2];

  // Month-over-month growth
  if (prev) {
    const growth = ((last.revenue - prev.revenue) / prev.revenue) * 100;
    insights.push({
      type: growth >= 0 ? "positive" : "warning",
      text: `Revenue ${growth >= 0 ? "grew" : "dropped"} ${Math.abs(growth).toFixed(1)}% in ${last.month} compared to ${prev.month}.`,
    });
  }

  // Overall trend from regression slope
  insights.push({
    type: slope > 0 ? "positive" : "warning",
    text: `The overall trend is ${slope > 0 ? "upward" : "downward"}: revenue changes by about ${Math.round(slope)} per month.`,
  });

  // Profit margin
  const margin = ((last.revenue - last.expenses) / last.revenue) * 100;
  insights.push({
    type: margin >= 30 ? "positive" : "warning",
    text: `Profit margin in ${last.month} is ${margin.toFixed(1)}%. ${margin >= 30 ? "Healthy margin." : "Consider reducing expenses."}`,
  });

  // Best month
  const best = monthly.reduce((a, b) => (b.revenue > a.revenue ? b : a));
  insights.push({ type: "info", text: `Best month so far: ${best.month} with revenue ${best.revenue}.` });

  // Anomaly detection with z-score
  const revs = monthly.map((m) => m.revenue);
  const mean = revs.reduce((a, b) => a + b, 0) / revs.length;
  const std = Math.sqrt(revs.reduce((a, b) => a + (b - mean) ** 2, 0) / revs.length);
  monthly.forEach((m) => {
    const z = (m.revenue - mean) / (std || 1);
    if (Math.abs(z) > 1.5) {
      insights.push({
        type: "warning",
        text: `Unusual revenue detected in ${m.month} (${z > 0 ? "much higher" : "much lower"} than normal).`,
      });
    }
  });

  return insights;
}

module.exports = { forecastRevenue, generateInsights };
