
# AutoPass 🔐

> A modern, secure, and customizable password generator for the web.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

**AutoPass** is a robust client-side web application designed to generate strong, unpredictable passwords instantly. Whether you need a completely random string or a password based on a memorable hint, AutoPass provides a secure and user-friendly interface to keep your accounts safe.

## ✨ Features

- **Dual Generation Modes**
  - **🎲 Random Mode**: Generate cryptographically secure random passwords with full customizability.
  - **💡 Hint-Based Mode**: Transform your memorable phrases (e.g., "summer2024") into complex, secure passwords by appending randomized characters while keeping the hint prefix intact.

- **Fully Customizable**
  - Toggle Uppercase, Numbers, and Symbols to meet specific site requirements.
  - Adjustable length slider (4-64 characters).

- **Real-time Analysis**
  - Visual strength meter with color-coded feedback (Weak, Fair, Good, Strong).
  - Instant updates as you modify settings.

- **Secure History Management**
  - Local browser storage keeps your history private.
  - One-click **Copy to Clipboard**.
  - **Download History** as `.txt` file for safe keeping.
  - Clear history option for privacy.

- **Privacy First**
  - All password generation happens 100% client-side in your browser.
  - No data is ever sent to an external server.

## 🚀 Getting Started

### Prerequisites

All you need is a modern web browser. To run the development server locally, you can use [Node.js](https://nodejs.org/) (optional).

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/AtakanKaracaDaglar/AutoPass.git
   cd AutoPass
   ```

2. **Run locally**
   - **Option A (Node.js)**:
     ```bash
     npx http-server -p 8080 -o
     ```
   - **Option B (Simple)**:
     Just open the `index.html` file in your browser!

## 🛠️ Usage Guide

1. **Select Mode**: Use the toggle buttons to switch between **Random** and **Hint-Based** modes.
2. **Configure**: Adjust the length slider and select character types (Uppercase, Numbers, Symbols).
3. **Generate**: Click the **Generate Password** button (or press the ⚡ icon).
4. **Manage**: 
   - Use the **Copy** button to copy the current password.
   - Check the **History** section below to view previously generated passwords.
   - Download or Clear your history as needed.

## 💻 Tech Stack

- **HTML5**: Semantic and accessible structure.
- **CSS3**: Modern styling with CSS Variables and Flexbox/Grid layouts.
- **JavaScript (ES6+)**: Core application logic using the Web Crypto API for secure randomness.
- **LocalStorage**: Persistent client-side history storage.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.
