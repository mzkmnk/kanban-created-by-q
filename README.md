# Kanban Project Management Tool

A modern, responsive Kanban board application built with Next.js 15, React 19, TypeScript, and shadcn/ui.

## 🎯 Features

### Core Functionality
- **Kanban Board**: Three-column layout (To Do, In Progress, Done)
- **Task Management**: Create, edit, delete, and move tasks
- **Drag & Drop**: Intuitive task movement between columns
- **Task Details**: Title, description, priority, tags, and timestamps
- **Local Storage**: Automatic data persistence
- **Responsive Design**: Works on desktop and mobile devices

### UI/UX Features
- **Modern Design**: Built with shadcn/ui components
- **Priority Levels**: Visual priority indicators (Low, Medium, High)
- **Task Tags**: Categorize tasks with custom tags
- **Task Counters**: Real-time task count per column
- **Hover Effects**: Smooth animations and transitions
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Technology Stack

- **Framework**: Next.js 15.3.4 with App Router
- **Runtime**: React 19.0.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks + Local Storage
- **Build Tool**: Next.js built-in bundler

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Build the application**:
   ```bash
   npm run build
   ```

3. **Start the production server**:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

### Development (Optional)
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and Tailwind CSS
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   └── badge.tsx
│   └── kanban/            # Kanban-specific components
│       ├── KanbanBoard.tsx      # Main board component
│       ├── KanbanColumn.tsx     # Column component
│       ├── KanbanCard.tsx       # Task card component
│       ├── AddTaskDialog.tsx    # Task creation dialog
│       └── EditTaskDialog.tsx   # Task editing dialog
├── hooks/
│   └── useKanban.ts       # Kanban state management
├── types/
│   └── kanban.ts          # TypeScript type definitions
└── lib/
    └── utils.ts           # Utility functions
```

## 🎨 Component Architecture

### KanbanBoard
- Main container component
- Manages global state and dialogs
- Handles task operations (CRUD)
- Displays task statistics

### KanbanColumn
- Represents each column (To Do, In Progress, Done)
- Handles drag & drop events
- Shows task count and add button

### KanbanCard
- Individual task representation
- Displays task details and metadata
- Provides edit/delete actions
- Supports drag operations

### Task Dialogs
- **AddTaskDialog**: Create new tasks with validation
- **EditTaskDialog**: Edit existing tasks and delete functionality

## 🔧 Key Features Implementation

### State Management
- Custom `useKanban` hook for centralized state
- Local storage persistence
- Optimistic updates for smooth UX

### Drag & Drop
- Native HTML5 drag and drop API
- Visual feedback during drag operations
- Cross-column task movement

### Data Validation
- Form validation for task creation/editing
- TypeScript type safety
- Error handling and user feedback

### Responsive Design
- Mobile-first approach
- Flexible grid layout
- Touch-friendly interactions

## 📊 Task Data Structure

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}
```

## 🎯 Usage Guide

### Creating Tasks
1. Click the "+" button in any column header
2. Fill in task details (title is required)
3. Set priority level and add tags if needed
4. Click "Create Task"

### Managing Tasks
- **Edit**: Click the edit icon on any task card
- **Delete**: Use the delete button in the edit dialog
- **Move**: Drag tasks between columns to change status
- **Priority**: Visual indicators show task priority levels

### Data Persistence
- All data is automatically saved to browser local storage
- Data persists between browser sessions
- No server or database required

## 🔍 Build Verification

The application has been tested and verified to build successfully:

```bash
npm run build
# ✓ Compiled successfully
# ✓ Generating static pages (5/5)
# ✓ Build completed without errors
```

### Build Output
- **Route Size**: 26.4 kB for main page
- **First Load JS**: 127 kB total
- **Static Generation**: All pages pre-rendered
- **No Runtime Errors**: Clean build process

## 🎨 Design System

### Color Scheme
- **Primary**: Blue tones for main actions
- **Secondary**: Gray tones for secondary elements
- **Success**: Green for completed tasks
- **Warning**: Yellow for in-progress tasks
- **Error**: Red for high priority and delete actions

### Typography
- **Headings**: Semibold weights for hierarchy
- **Body**: Regular weight for readability
- **Labels**: Medium weight for form elements

### Spacing
- **Consistent**: 4px base unit system
- **Responsive**: Adaptive spacing for different screen sizes
- **Breathing Room**: Adequate whitespace for clarity

## 🚀 Performance Optimizations

- **Static Generation**: Pre-rendered pages for fast loading
- **Code Splitting**: Automatic chunk splitting by Next.js
- **Tree Shaking**: Unused code elimination
- **Optimized Images**: Next.js image optimization
- **CSS Purging**: Unused CSS removal by Tailwind

## 🔒 Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **JavaScript**: ES2017+ features
- **CSS**: Modern CSS Grid and Flexbox

## 📝 Development Notes

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Component Architecture**: Reusable and maintainable
- **Error Boundaries**: Graceful error handling

### Best Practices
- **DRY Principle**: No code duplication
- **Single Responsibility**: Each component has one purpose
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Optimized re-renders and state updates

## 🤝 Contributing

This project follows the Q Task Manager development guidelines:
- DRY principle adherence
- TypeScript strict mode
- Component-based architecture
- Comprehensive error handling

## 📄 License

MIT License - feel free to use this project for learning and development.

---

**Built with ❤️ using Next.js, React, TypeScript, and shadcn/ui**

*Last updated: 2025-06-24*
