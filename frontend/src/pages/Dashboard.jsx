import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { api } from "../api.js";

const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/analytics/summary").then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Loading analytics...</p>;

  const { kpis, monthly, forecast, insights } = data;

  // Combine real data + forecast into one array for the chart.
  // The last real point also gets a "forecast" value so the dotted line connects.
  const chartData = monthly.map((m, i) => ({
    month: m.month,
    revenue: m.revenue,
    forecast: i === monthly.length - 1 ? m.revenue : undefined,
  }));
  forecast.forEach((f) => chartData.push({ month: f.month, forecast: f.forecast }));

  return (
    <>
      <h2>Dashboard</h2>

      <div className="kpis">
        <div className="card kpi"><span>Total Revenue</span><b>{fmt(kpis.totalRevenue)}</b></div>
        <div className="card kpi"><span>Total Profit</span><b>{fmt(kpis.totalProfit)}</b></div>
        <div className="card kpi"><span>Customers (latest)</span><b>{kpis.customers}</b></div>
        <div className="card kpi">
          <span>Last Month Growth</span>
          <b className={kpis.growth >= 0 ? "green" : "red"}>{kpis.growth}%</b>
        </div>
      </div>

      <div className="card">
        <h3>Revenue Trend + AI Forecast (next 3 months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} name="Actual revenue" />
            <Line type="monotone" dataKey="forecast" stroke="#f97316" strokeWidth={2} strokeDasharray="6 4" name="AI forecast" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3>Profit by Month</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="profit" fill="#16a34a" name="Profit" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3>🤖 AI Insights</h3>
        <ul className="insights">
          {insights.map((i, idx) => (
            <li key={idx} className={i.type}>{i.text}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
