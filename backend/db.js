// Simple JSON-file "database" so no DB installation is needed.
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const dir = path.join(__dirname, "data");
const usersFile = path.join(dir, "users.json");
const salesFile = path.join(dir, "sales.json");

const read = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const write = (f, d) => fs.writeFileSync(f, JSON.stringify(d, null, 2));

function init() {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  if (!fs.existsSync(usersFile)) {
    write(usersFile, [
      { id: 1, name: "Admin", email: "admin@demo.com", password: bcrypt.hashSync("admin123", 10), role: "admin" },
      { id: 2, name: "Analyst", email: "user@demo.com", password: bcrypt.hashSync("user123", 10), role: "user" },
    ]);
  }

  if (!fs.existsSync(salesFile)) {
    const revenue = [42000, 45000, 47000, 46000, 50000, 53000, 52000, 58000, 61000, 75000, 66000, 70000];
    const customers = [300, 310, 325, 330, 350, 365, 370, 395, 410, 450, 440, 465];
    const sales = revenue.map((r, i) => ({
      month: `2025-${String(i + 1).padStart(2, "0")}`,
      revenue: r,
      expenses: Math.round(r * 0.62),
      customers: customers[i],
    }));
    write(salesFile, sales);
  }
}

module.exports = {
  init,
  getUsers: () => read(usersFile),
  saveUsers: (u) => write(usersFile, u),
  getSales: () => read(salesFile),
  saveSales: (s) => write(salesFile, s),
};
