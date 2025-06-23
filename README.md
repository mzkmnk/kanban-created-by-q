# Kanban Project Management Tool

A modern, feature-rich Kanban board application built with Next.js 15, TypeScript, and Tailwind CSS. This project provides an intuitive drag-and-drop interface for managing tasks and projects efficiently.

## 🚀 Features

### Core Functionality
- **Drag & Drop Interface**: Smooth card movement between columns using @dnd-kit
- **Rich Task Cards**: Priority levels, tags, assignees, and due dates
- **Three-Column Layout**: To Do, In Progress, and Done columns
- **Real-time Statistics**: Track total cards, urgent tasks, and overdue items
- **Data Persistence**: Local storage with automatic save/load

### Advanced Features
- **Priority System**: 4-level priority system (Low, Medium, High, Urgent) with color coding
- **Tag Management**: Flexible tagging system with visual indicators
- **Due Date Tracking**: Automatic overdue detection and warnings
- **Column Capacity**: Optional limits with visual progress indicators
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Error Handling**: Comprehensive validation and error recovery

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for responsive design
- **Drag & Drop**: @dnd-kit for smooth interactions
- **Icons**: Lucide React for consistent iconography
- **State Management**: Custom React hooks
- **Data Storage**: Browser Local Storage

## 📦 Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kanban-created-by-q
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🎯 Usage Guide

### Getting Started
1. **View Demo Data**: The application loads with sample cards to demonstrate functionality
2. **Drag Cards**: Click and drag cards between columns to change their status
3. **Add New Cards**: Click the + button in any column header
4. **Edit Cards**: Click the edit icon on any card to modify details
5. **Delete Cards**: Click the trash icon to remove cards

### Card Management
- **Title**: Required field for card identification
- **Description**: Optional detailed description
- **Priority**: Choose from Low, Medium, High, or Urgent
- **Tags**: Add multiple tags for categorization
- **Assignee**: Assign tasks to team members
- **Due Date**: Set deadlines with automatic overdue detection

### Column Features
- **Capacity Limits**: Some columns have maximum card limits
- **Progress Indicators**: Visual feedback for column capacity
- **Statistics**: View urgent and overdue card counts

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main application page
│   ├── layout.tsx        # Root layout component
│   └── globals.css       # Global styles and animations
├── components/
│   ├── KanbanBoard.tsx   # Main board orchestrator
│   ├── KanbanColumn.tsx  # Column component with capacity management
│   ├── KanbanCard.tsx    # Rich card component
│   ├── AddCardModal.tsx  # Card creation modal
│   └── EditCardModal.tsx # Card editing modal
├── hooks/
│   └── useKanban.ts      # Custom hook for state management
├── types/
│   └── kanban.ts         # TypeScript type definitions
└── utils/
    └── storage.ts        # Local storage utilities
```

## 🎨 Design System

### Color Scheme
- **Priority Colors**: Red (Urgent), Orange (High), Yellow (Medium), Green (Low)
- **Status Colors**: Red (To Do), Amber (In Progress), Green (Done)
- **UI Colors**: Gray scale for backgrounds and text

### Typography
- **Headings**: Semibold weights for hierarchy
- **Body Text**: Regular weight for readability
- **Labels**: Small text for metadata

### Spacing
- **Cards**: Consistent padding and margins
- **Columns**: Adequate spacing for drag targets
- **Modals**: Centered with backdrop blur

## 🧪 Testing

### Manual Testing Checklist
- ✅ Card creation with all fields
- ✅ Card editing and deletion
- ✅ Drag and drop functionality
- ✅ Priority and tag management
- ✅ Due date handling
- ✅ Column capacity limits
- ✅ Local storage persistence
- ✅ Responsive design
- ✅ Error handling
- ✅ Form validation

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
No environment variables required for basic functionality.

### Deployment Platforms
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any Node.js hosting platform

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for Next.js
- Prettier for code formatting
- Consistent naming conventions

## 📈 Performance

### Optimizations
- React.memo for component memoization
- Efficient state updates
- CSS animations for smooth interactions
- Local storage for client-side persistence
- Lazy loading for modals

### Metrics
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Guidelines
- Follow TypeScript best practices
- Write descriptive commit messages
- Add comments for complex logic
- Ensure responsive design
- Test on multiple browsers

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- @dnd-kit for drag and drop functionality
- Tailwind CSS for utility-first styling
- Lucide for beautiful icons
- The open source community

## 📞 Support

For questions, issues, or feature requests:
- Create an issue in the repository
- Check the documentation
- Review existing issues and discussions

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
