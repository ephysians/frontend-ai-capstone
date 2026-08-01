# Frontend AI Engineering Capstone

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-blue.svg)](https://nodejs.org/)

A professional, open-source repository dedicated to assignments, experiments, and advanced projects completed as part of the **Frontend AI Engineering** track. This project showcases the synergy between modern frontend development practices and state-of-the-art AI-assisted engineering workflows.

---

## 📖 Table of Contents

- [Overview](#overview)
- [Key Goals](#-key-goals)
- [Tech Stack & Tooling](#-tech-stack--tooling)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Development Workflow & Standards](#-development-workflow--standards)
  - [Conventional Commits](#conventional-commits)
  - [AI-Assisted Engineering](#ai-assisted-engineering)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## Overview

In the rapidly evolving landscape of web development, AI assistance is transforming how engineers architect, write, and maintain code. This repository serves as a portfolio of production-ready frontend applications and experiments that demonstrate:
1. **Best-in-class UI/UX design** powered by modern frontend architectures.
2. **Robust development guardrails**, ensuring linting, formatting, and strict typing.
3. **Leveraging AI collaboratively** to boost productivity, accelerate testing, and solve complex algorithms.

---

## 🎯 Key Goals

- **Master AI-Assisted Development:** Seamlessly integrate LLMs and prompt engineering into daily coding routines to produce higher quality software faster.
- **Enforce Rigorous Standards:** Standardize code formatting, static analysis, and commit guidelines.
- **Deliver Production-Ready Applications:** Build fully functional, responsive, and performance-optimized web apps.

---

## 🛠️ Tech Stack & Tooling

The workspace leverages a modern toolchain curated for high performance and rapid iteration:

- **Runtime & Package Management:** [Node.js](https://nodejs.org/) (v18+)
- **Version Control:** [Git](https://git-scm.com/) with strict branch naming and atomic commits.
- **Editor Ecosystem:** [VS Code](https://code.visualstudio.com/) configured with unified workspace settings, linting integrations, and key bindings.
- **AI-Assisted Orchestration:** Next-gen LLMs, agentic developer setups, and prompt-driven engineering workflows.

---

## 🚀 Getting Started

### Prerequisites

To build and run this project locally, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/flyrank/frontend-ai-capstone.git
   cd frontend-ai-capstone
   ```

2. **Install dependencies (when package.json is added):**
   ```bash
   npm install
   ```

3. **Start the development server:**
   *(Custom startup scripts will be documented here as projects are scaffolded.)*

---

## 🚦 Development Workflow & Standards

### Conventional Commits

We rigorously follow the [Conventional Commits specification](https://www.conventionalcommits.org/) for clean, readable, and automated changelogs. Commit messages must adhere to the following format:

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Common Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries

### AI-Assisted Engineering

We use AI not as a black box, but as an interactive peer programmer.
*   **Prompt Transparency:** Clear, semantic instructions and context boundaries.
*   **Validation:** All AI-generated code is verified against existing test suites, linters, and type checkers before commitment.
*   **Security & Safety:** Never expose secret keys, environment variables, or sensitive user data in prompts or commits.

---

## 📁 Project Structure

```text
frontend-ai-capstone/
├── .git/                  # Version control metadata
├── .gitignore             # Ignored files and folders
├── CLAUDE.md              # Project developer guidelines and conventions
├── LICENSE                # Open-source MIT License
└── README.md              # Project homepage (this file)
```

---

## 🤝 Contributing

Contributions are welcome! If you're looking to contribute:
1. **Fork** the repository.
2. Create a new branch (`feat/your-feature` or `fix/your-bug`).
3. Ensure all code adheres to our formatting rules and passes local tests.
4. Open a **Pull Request** with a detailed description of your changes.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
