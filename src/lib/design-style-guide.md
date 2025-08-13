# Design & Style Guide

## 1. Color Palette

The application uses a dark theme with blue accents as the primary color scheme.

### Primary Colors
- **Primary Blue**: `blue.500` - Main accent color
- **Secondary Blue**: `blue.400`, `blue.600` - Used for gradients and variations
- **Dark Background**: `slate.950` - Main background color
- **Surface Background**: `slate.900` - Card and panel backgrounds

### Semantic Colors
- **Success**: `green.400`, `green.500`
- **Warning**: `yellow.400`, `yellow.500`
- **Error**: `red.400`, `red.500`
- **Text**: `slate.200`, `slate.300`, `slate.400`, `slate.500`

### Glassmorphism Effect
- **Backdrop Filter**: `blur.xl`
- **Background Color**: `color-mix(in srgb, theme('colors.slate.950') 80%, transparent)`
- **Border**: `1px solid color-mix(in srgb, theme('colors.blue.500') 30%, transparent)`

## 2. Typography

### Font Family
- **Primary Font**: Inter (sans-serif)
- **Monospace Font**: Default monospace stack for code

### Font Sizes
- **Display**: 3xl, 4xl (Welcome headers)
- **Headings**: lg, xl, 2xl (Section titles)
- **Body**: base, lg (Paragraphs)
- **Captions**: sm, xs (Supporting text)

### Font Weights
- **Regular**: 400 (Body text)
- **Medium**: 500 (Labels, buttons)
- **Semibold**: 600 (Subheadings)
- **Bold**: 700 (Main headings)

## 3. Spacing System

The application uses a consistent spacing system based on Tailwind's default spacing scale.

### Common Spacing Values
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **base**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

### Layout Spacing
- **Page padding**: 6 (24px) horizontal, 8 (32px) vertical
- **Component spacing**: 5 (20px) for internal padding
- **Section spacing**: 10 (40px) vertical margin between sections

## 4. Component Styles

### Buttons
- **Primary Button**:
  - Gradient background: `from-blue-600 to-blue-700`
  - Hover state: `hover:from-blue-500 hover:to-blue-600`
  - Text: white
  - Padding: `px-6 py-3`
  - Border radius: `rounded-xl`
  - Effects: `button-hover` (scale transform), `glow-effect`

- **Icon Button**:
  - Base class: `icon-button`
  - Color: `text-slate-400`
  - Hover: `hover:text-blue-400`
  - Background: `hover:bg-slate-800/50`
  - Shape: rounded-lg
  - Size: `!p-2` (compact padding)

### Cards & Panels
- **Glass Panel**:
  - Glass effect: `glass-panel` class
  - Large variant: `glass-panel-lg` (larger border radius)
  - Padding: 5 (20px) or 6 (24px) for large
  - Glow effect: `glow-effect` (optional)

- **Message Container**:
  - Glass effect: `message-container` class
  - Padding: 5 (20px)
  - Used for chat messages

### Inputs
- **Textarea**:
  - Background: `bg-slate-900/50`
  - Border: `border border-blue-500/30`
  - Focus: `focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`
  - Shape: `rounded-xl`
  - Padding: `p-4`
  - Text: `text-slate-200`

### Tables
- **Table Container**:
  - Background: `bg-slate-900/50`
  - Border: `border border-blue-500/30`
  - Shape: `rounded-xl`
  - Overflow: `overflow-hidden`

- **Header Row**:
  - Background: `bg-gradient-to-r from-blue-600/20 to-blue-800/20`
  - Border: `border-b border-blue-500/30`
  - Text: `text-slate-200 font-semibold`
  - Padding: `px-6 py-4`

- **Body Rows**:
  - Border: `border-b border-slate-700/50`
  - Hover: `hover:bg-blue-500/10`
  - Text: `text-slate-200`
  - Padding: `px-6 py-4`

## 5. Interactive Elements

### Hover Effects
- **Chat Items**: `chat-hover` class
  - Background gradient on hover
  - Left border highlight
  - Subtle translation effect
  - Smooth transition

- **Buttons**: `button-hover` class
  - Scale transform on hover (1.05x)
  - Smooth transition

### Transitions
- **Duration**: `transition-all duration-300`
- **Timing**: `ease` (default easing)
- **Properties**: All properties that change

### Animations
- **Pulse Animation**: `pulse-animation` class
  - Used for status indicators
  - 2-second infinite loop
  - Opacity variation from 1 to 0.7

## 6. Layout Patterns

### Page Structure
- **Header**: Fixed at top with blur effect
- **Sidebar**: Fixed left panel (72px wide)
- **Main Content**: Flexible area with left margin to accommodate sidebar
- **Sections**: Max-width constrained with horizontal centering

### Responsive Design
- **Desktop First**: Base styles for large screens
- **Adaptive Elements**:
  - Alternative to navigation tabs on small screens
  - Flexible grid layouts
  - Responsive text sizing

## 7. Iconography

### Icon Library
- **Flowbite Svelte Icons**: Primary icon set
- **Sizes**: Match text sizes (w-4 h-4 for small, w-5 h-5 for medium, w-6 h-6 for large)
- **Colors**: Inherit parent text color or explicitly set

### Common Icons
- **Navigation**: ChevronDownOutline, ArrowRightAltSolid
- **Actions**: PaperPlaneSolid, CogSolid, PlusOutline
- **Media**: ImageSolid, MicrophoneSolid, UploadSolid
- **Data**: DatabaseSolid, ShareNodesSolid, DownloadSolid
- **Feedback**: ThumbsUpOutline, ThumbsDownOutline
- **UI**: SearchSolid, ClockSolid

## 9. Accessibility

### Color Contrast
- All text maintains minimum 4.5:1 contrast ratio
- Interactive elements have clear focus states
- Semantic colors are distinguishable for colorblind users

### Focus Management
- Focus rings for keyboard navigation
- ARIA labels for icon-only buttons
- Proper heading hierarchy

### Screen Reader Support
- Semantic HTML structure
- ARIA attributes for dynamic content
- Screen reader only text where needed (`sr-only`)

## 10. Code Standards

### CSS Class Organization
- Utility-first approach with Tailwind
- Custom classes for repeated patterns
- Consistent class ordering
- Responsive prefixes where needed

### Naming Conventions
- **CSS Classes**: Use kebab-case for custom class names
- **Component Files**: PascalCase with `.svelte` extension
- **Variables**: camelCase for JavaScript variables
- **Constants**: UPPER_SNAKE_CASE for constant values

## 11. Best Practices

### Performance
- Use appropriate image formats and sizes
- Implement proper loading states for asynchronous operations

### Maintainability
- Create reusable components for common UI patterns
- Use consistent class names and structure
- Document complex components with comments
- Follow the established color and spacing system

### Consistency
- Use the same button styles throughout the application
- Maintain consistent padding and margins
- Apply the same hover and focus effects
- Use standardized typography

## 12. Future Considerations

### Design System Evolution
- Consider creating a component library for shared components
- Establish design tokens for consistent values across the application
- Implement a theme switcher for light/dark mode preferences

### Accessibility Improvements
- Add keyboard navigation support for all interactive elements
- Implement proper focus management
- Ensure sufficient color contrast for all UI elements

### Responsive Enhancements
- Add more breakpoints for better device support
- Implement adaptive layouts for different screen sizes
- Optimize touch targets for mobile devices

---

This design and style guide should be referenced when creating new components or modifying existing ones to ensure visual consistency across the CoAgent SQL application.