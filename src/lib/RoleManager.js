// src/lib/RoleManager.js

export const RoleManager = {
  // Hardcoded credentials for testing (only for development!)
  users: [
    {
      email: "admin@example.com",
      password: "Admin@123",
      role: "admin",
    },
    {
      email: "driver@example.com",
      password: "Driver@123",
      role: "driver",
    },
    {
      email: "operator@example.com",
      password: "Operator@123",
      role: "operator",
    },
  ],

  // Check credentials and return role if valid
  login(email, password) {
    const user = this.users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // store login info (optional)
      localStorage.setItem("role", user.role);
      localStorage.setItem("email", user.email);
      return user.role;
    } else {
      return null; // invalid creds
    }
  },

  // Get current role from localStorage
  getRole() {
    return localStorage.getItem("role");
  },

  // Clear session on logout
  logout() {
    localStorage.removeItem("role");
    localStorage.removeItem("email");
  },
};
