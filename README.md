# 🏥 Fizyoterapist Ezgi Acem - Official Website

A modern, high-performance professional portfolio and blog website for **Physiotherapist Ezgi Acem**, built with **Astro** and **TailwindCSS**, empowered by **PocketBase** as a headless CMS.

This project is designed to provide a holistic, visually soothing, and informative digital presence for pediatric physiotherapy services.

![Project Banner](public/favicon.svg)

## 🚀 Features

- **⚡ Blazing Fast Performance**: Built with [Astro](https://astro.build)'s zero-JS-by-default architecture for optimal speed and SEO.
- **🎨 Modern & Holistic Design**: Custom aesthetics using **TailwindCSS**, featuring glassmorphism, smooth animations, and a warm, pastel color palette (Orange/Teal/Cream) to reflect a therapeutic environment.
- **📝 Dynamic Blog System**: Integrated with **PocketBase** to manage and serve educational content and articles dynamically.
- **🧩 Specializations Showcase**: Interactive grid layout showcasing core expertise areas like *Pediatric Physiotherapy*, *Sensory Integration*, and *Neuromotor Development*.
- **💌 Contact & Appointment**: Functional contact form collecting inquiries directly into the secure backend.
- **⚖️ Legal Compliance**: Dedicated, structured pages for **KVKK** (Data Protection), **Terms of Use**, and **Cookie Policies**.
- **📱 Fully Responsive**: Optimized experience across all devices, from mobile phones to high-resolution desktops.

## 🛠️ Tech Stack

- **Frontend Framework**: [Astro v4](https://astro.build/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Backend / CMS**: [PocketBase](https://pocketbase.io/) (Self-hosted Go-based backend)
- **Language**: TypeScript
- **Deployment**: Static Site Generation (SSG) / Hybrid

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** (v18 or higher)
- **PocketBase** executable (placed in the root directory or installed globally)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/fztezgiacem.git
    cd fztezgiacem
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory with your credentials:
    ```env
    PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
    ADMIN_EMAIL=admin@example.com
    ADMIN_PASSWORD=securepassword
    PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
    ```

4.  **Start Backend**
    Run the PocketBase server:
    ```bash
    ./pocketbase serve
    ```

5.  **Start Frontend**
    Run the Astro development server:
    ```bash
    npm run dev
    ```
    The site will be available at `http://localhost:4321`.

## 📂 Project Structure

```text
/
├── public/              # Static assets (images, icons, fonts)
├── src/
│   ├── components/      # Reusable UI components (Footer, Navbar, etc.)
│   ├── layouts/         # Base layouts (BaseLayout.astro)
│   ├── lib/             # Utilities (PocketBase client, helper functions)
│   ├── pages/           # Application routes & Views
│   │   ├── admin/       # Custom Admin dashboard routes
│   │   ├── blog/        # Blog listing and detail pages
│   │   ├── yasal/       # Legal pages (KVKK, Terms, Cookies)
│   │   └── index.astro  # Homepage
│   └── styles/          # Global styles (Tailwind directives)
├── scripts/             # Automation scripts (Seeding, Image Uploads)
├── pocketbase.exe       # Backend executable
└── astro.config.mjs     # Astro configuration
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

All rights reserved. Designed and developed for **Fizyoterapist Ezgi Acem**.
