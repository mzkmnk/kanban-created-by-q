# Kanban Project Management Tool

A modern, responsive Kanban board built with Next.js 15, React 19, TypeScript, and shadcn/ui.

## 🎯 Features

- **Drag & Drop**: Intuitive task management with drag and drop functionality
- **Three Columns**: Organize tasks in To Do, In Progress, and Done columns
- **Task Management**: Create, edit, and delete tasks with detailed descriptions
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Local Storage**: Automatic data persistence using browser local storage
- **Modern UI**: Clean, accessible interface built with shadcn/ui components

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the production server
npm start
```

### Development

```bash
# Install dependencies
npm install

# Start development server (if needed)
npm run dev
```

**Note**: This project is optimized for production builds. The development server is not required for normal usage.

## 🏗️ Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and Tailwind CSS
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page component
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   └── kanban/              # Kanban-specific components
│       ├── KanbanBoard.tsx  # Main board component
│       ├── KanbanColumn.tsx # Column component
│       ├── KanbanCard.tsx   # Task card component
│       ├── AddTaskDialog.tsx # Add task dialog
│       └── EditTaskDialog.tsx # Edit task dialog
├── hooks/
│   └── useKanban.ts         # Kanban state management hook
├── types/
│   └── kanban.ts            # TypeScript type definitions
└── lib/
    └── utils.ts             # Utility functions
```

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) for consistent, accessible UI components:

- **Button**: Interactive buttons with multiple variants
- **Card**: Container components for tasks and columns
- **Dialog**: Modal dialogs for task creation and editing
- **Input/Textarea**: Form input components
- **Badge**: Status indicators
- **Select**: Dropdown selection components
- **Separator**: Visual dividers

## 🔧 Technical Details

### Technologies Used

- **Next.js 15.3.4**: React framework with App Router
- **React 19.0.0**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui**: Modern UI component library
- **@dnd-kit**: Drag and drop functionality
- **Lucide React**: Beautiful, customizable icons

### Key Features Implementation

#### Drag & Drop
- Uses `@dnd-kit` for smooth drag and drop interactions
- Supports moving tasks between columns
- Visual feedback during drag operations

#### State Management
- Custom `useKanban` hook for centralized state management
- Local storage integration for data persistence
- Optimistic updates for smooth user experience

#### Responsive Design
- Mobile-first approach with Tailwind CSS
- Adaptive layouts for different screen sizes
- Touch-friendly interactions

## 📱 Usage

### Adding Tasks
1. Click the "Add Task" button
2. Fill in the task title (required) and description (optional)
3. Click "Add Task" to create the task in the "To Do" column

### Managing Tasks
- **Move Tasks**: Drag and drop tasks between columns
- **Edit Tasks**: Click the pencil icon on any task card
- **Delete Tasks**: Click the trash icon or use the delete button in the edit dialog

### Task Information
- Each task displays title, description, status badge, and last updated time
- Tasks are automatically saved to local storage
- Task counts are shown in column headers

## 🔧 Build & Deployment

### Build Process

```bash
# Production build
npm run build

# Verify build output
ls -la .next/
```

### Build Output
- Static pages are pre-rendered for optimal performance
- All assets are optimized and minified
- TypeScript compilation and linting are verified

### Deployment Options
- **Vercel**: Optimal for Next.js applications
- **Netlify**: Static site deployment
- **Self-hosted**: Use `npm start` after building

## 🎯 Performance

- **First Load JS**: ~142 kB (optimized)
- **Static Generation**: All pages pre-rendered
- **Code Splitting**: Automatic chunk optimization
- **Tree Shaking**: Unused code elimination

## 🔒 Data Storage

- **Local Storage**: Tasks are automatically saved to browser local storage
- **Data Format**: JSON serialization with date handling
- **Error Handling**: Graceful fallbacks for storage failures

## 🚀 Future Enhancements

Potential improvements for future versions:

- **Backend Integration**: API integration for multi-user support
- **Real-time Collaboration**: WebSocket-based live updates
- **Advanced Filtering**: Search and filter tasks by various criteria
- **Task Categories**: Color-coded task categories
- **Due Dates**: Task deadline management
- **User Authentication**: Multi-user support with authentication
- **Export/Import**: Data backup and migration features

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure tests pass and build succeeds
5. Submit a pull request

---

**Built with ❤️ using Next.js, React, TypeScript, and shadcn/ui**
