import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ month: "", revenue: "", expenses: "", customers: "" });
  const [msg, setMsg] = useState({ text: "", error: false });

  const loadUsers = () => api("/users").then(setUsers).catch((e) => setMsg({ text: e.message, error: true }));
  useEffect(() => { loadUsers(); }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function addSales(e) {
    e.preventDefault();
    try {
      const res = await api("/analytics/sales", { method: "POST", body: form });
      setMsg({ text: res.message + " — check the Dashboard.", error: false });
      setForm({ month: "", revenue: "", expenses: "", customers: "" });
    } catch (err) {
      setMsg({ text: err.message, error: true });
    }
  }

  return (
    <>
      <h2>Admin Panel</h2>
      {msg.text && <p className={msg.error ? "error" : "success"}>{msg.text}</p>}

      <form className="card form" onSubmit={addSales}>
        <h3>Add Monthly Sales Data</h3>
        <input name="month" type="month" value={form.month} onChange={change} required />
        <input name="revenue" type="number" placeholder="Revenue" value={form.revenue} onChange={change} required />
        <input name="expenses" type="number" placeholder="Expenses" value={form.expenses} onChange={change} required />
        <input name="customers" type="number" placeholder="Customers" value={form.customers} onChange={change} required />
        <button type="submit">Add Record</button>
      </form>

      <div className="card">
        <h3>Registered Users</h3>
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
