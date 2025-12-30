# Next-Task

An educational modern To-Do List application built with Next.js 16, Prisma, and Tailwind CSS. This project demonstrates full-stack development practices, including authentication, database management, and interactive UI features like drag-and-drop.

## Features

- **Task Management**: Create, update, delete, and organize tasks.
- **Drag & Drop**: Reorder tasks intuitively using `@dnd-kit`.
- **Authentication**: Secure login and signup with **NextAuth.js** (Email/Password & OAuth providers).
- **Search & Filter**: Quickly find tasks with global search and state-based filtering (Active, Completed, All).
- **Responsive Design**: Fully responsive UI built with **Tailwind CSS**.
- **Dark Mode**: Native dark mode support using `next-themes`.

## Tech Stack

### Framework & Core
- **Next.js 16**: Using the latest App Router architecture.
- **TypeScript**: For type-safe development.
- **React 19**: Leveraging the latest React features.

### Styling & UI Components
- **Tailwind CSS**: Utility-first CSS framework.
- **Shadcn/UI**: Reusable components built on **Radix UI** primitives and **CVA**.
- **Lucide React**: Beautiful and consistent icons.

### State Management
- **Zustand**: Lightweight global client state management.

### Backend & Database
- **Prisma**: Next-generation Node.js and TypeScript ORM.
- **PostgreSQL**: Robust relational database.
- **NextAuth.js**: Complete authentication solution for Next.js.

### Validation
- **Zod**: TypeScript-first schema declaration and validation library.

## Getting Started

Follow these steps to set up the project locally:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd next-task
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add the necessary variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/next-task"
   NEXTAUTH_SECRET="your-super-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the Database:**
   Generate the Prisma client and push the schema to your database.
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

- `/app`: App Router pages and layouts.
- `/components`: Reusable UI components (TasksList, Header, etc.).
- `/lib`: Utility functions, Prisma client instance, and store logic.
- `/prisma`: Database schema and migrations.

---
*This is an educational project designed to learn and showcase modern full-stack web development techniques.*
