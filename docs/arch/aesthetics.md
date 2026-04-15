# Aesthetics

## Typography
- Primary font: geist sans.
- Monospace for code/headings: geist mono.

## Case Sensitivity
- All ui labels, navigation, and headings must be lowercase (e.g., "about", "projects").

## Layout & Responsiveness
- Mobile-first approach.
- Horizontal split on desktop (left fixed nav/bio, right scrollable content).
- Top navigation bar on mobile.
- Max-width 2xl for content.
- Constraints: high contrast (#000000 and #ffffff). no drop shadows. no rounded corners (`rounded-none`).
- Borders: thin 1px lines (`border-slate-200`) for section dividers.

## Component Guidelines
1. Navigation: vertical list in sidebar (desktop), horizontal bar at top (mobile). [index, projects].
2. Project list: show title, date, description, and tags. link to full details page.
3. Post list: date (yyyy-mm-dd) followed by title. no thumbnails.
4. Animations: minimal subtle "fade-in" only via css or framer motion.
