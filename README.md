# 🌿 Lush Living

**Bring Nature Closer to Home.**

Lush Living is a modern, responsive plant e-commerce storefront designed to make discovering and exploring plants, gardening essentials, pots, and planters a delightful experience.

The project includes a customer-facing shopping experience and an admin dashboard for managing the store. It is built with React, TypeScript, and Tailwind CSS, with browser LocalStorage used for demo data persistence.

---

## ✨ Features

### 🛍️ Customer Storefront

- Clean, modern, and responsive user interface.
- Homepage with an attractive hero section and featured products.
- Browse products by category.
- Product listing with search, filtering, and sorting.
- Detailed product pages.
- Shopping cart with quantity management.
- Automatic cart total calculation.
- Checkout experience with order confirmation.
- Login page with a consistent brand identity.

### ⚙️ Admin Dashboard

- Admin dashboard overview.
- Product management (Add, Edit, Delete).
- Category management.
- Inventory management.
- Orders management page.
- Customers management page.
- Store settings page.
- Consistent modal dialogs for Add/Edit operations.

### 🎨 UI & Experience

- Responsive layouts for different screen sizes.
- Reusable UI components.
- Lucide icons.
- Consistent green-themed visual identity.
- Smooth transitions and animations.
- User-friendly empty states.

---

## 🛠️ Tech Stack

| Technology      | Purpose                           |
| --------------- | --------------------------------- |
| React 19        | Frontend UI                       |
| TypeScript      | Type safety                       |
| Vite            | Development server and build tool |
| Tailwind CSS v4 | Styling                           |
| TanStack Router | File-based routing                |
| TanStack Query  | Data management                   |
| TanStack Table  | Table management                  |
| Zustand         | State management                  |
| React Hook Form | Form handling                     |
| Zod             | Form validation                   |
| shadcn/ui       | UI components                     |
| Lucide React    | Icons                             |

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── ui/
│   ├── header.tsx
│   └── footer.tsx
│
├── features/
│   ├── auth/
│   ├── cart/
│   ├── categories/
│   └── products/
│
├── lib/
│   └── storage/
│
└── routes/
    ├── admin/
    ├── login/
    ├── products/
    ├── cart/
    ├── checkout/
    └── index.tsx
```

---

## 🚀 Getting Started

Follow these steps to run Lush Living locally.

### Prerequisites

- Node.js
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/tamannaparween/Lush-Living.git
```

### 2. Navigate to the project directory

```bash
cd Lush-Living
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal to view the application.

---

## 📜 Available Scripts

| Command         | Description                   |
| --------------- | ----------------------------- |
| `npm run dev`   | Starts the development server |
| `npm run build` | Creates a production build    |
| `npm run lint`  | Runs ESLint checks            |

---

## 💾 Data Storage

Lush Living currently uses browser **LocalStorage** for demo data persistence.

- Product and category data are stored locally.
- Cart information is managed on the frontend.
- Checkout demonstrates a frontend order flow.
- No external database or backend API is required.

**Note:** This is a frontend demonstration project. It does not currently include a production backend, real payment gateway, or live order processing.

---

## 🌱 Project Goals

The main goals of Lush Living are to:

- Build a visually appealing plant shopping experience.
- Create a responsive and user-friendly storefront.
- Implement reusable and maintainable React components.
- Demonstrate product, category, and inventory management.
- Practice modern frontend development with TypeScript.

---

## 👩‍💻 Author

**Tamanna Parween**

GitHub: [@tamannaparween](https://github.com/tamannaparween)

---

## 📄 License

This project is created for learning and demonstration purposes.
