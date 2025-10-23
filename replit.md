# Roby Club Webapp - Daycare Management Dashboard

## Overview
Roby Club Webapp is a modern, full-stack daycare management dashboard designed for Robinson Clubs daycare staff. The application helps manage children throughout the day, track pickups, and notify parents via WhatsApp when it's time for pickup or if any issues occur.

**Status**: MVP Complete  
**Last Updated**: October 22, 2025

## Recent Changes
- **October 23, 2025**: Enhanced settings and improved UI/UX
  - Added editable message templates in settings for staff customization
  - Moved user login indicator from header to sidebar footer
  - Staff can now customize WhatsApp notification messages for Emergency, Child Wishes, and Pickup Time scenarios
  - Templates stored in database with fallback to default messages
  - Improved sidebar footer with user identification and logout button

- **October 22, 2025**: Initial MVP implementation completed
  - Implemented complete data model with Children and ActionLogs schemas
  - Built all frontend components with soft blue/pastel design system
  - Created responsive dashboard with sidebar navigation
  - Implemented child registration system with auto-generated daily IDs
  - Added action notification system with mock WhatsApp integration
  - Implemented pickup tracking and archival system
  - Added light/dark theme support
  - All UI components follow design_guidelines.md specifications

## Project Architecture

### Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Wouter (routing), TanStack Query (data fetching)
- **UI Library**: Shadcn UI components, Tailwind CSS
- **Backend**: Express.js, Node.js, TypeScript
- **Data Storage**: In-memory storage with daily reset (MemStorage)
- **State Management**: TanStack Query with optimistic updates
- **Styling**: Tailwind CSS with custom design tokens

### Design System
- **Color Palette**: Soft blue (#0EA5E9) and pastel accents
- **Typography**: Inter (sans), IBM Plex Mono (mono)
- **Spacing**: Consistent 6-8 unit spacing (p-6, gap-6, etc.)
- **Components**: Shadcn UI with custom color tokens
- **Theme**: Light/dark mode support with smooth transitions

### Key Features

#### 1. Child Registration
- Auto-generated daily ID (resets each day)
- Parent contact information (primary + optional secondary phone)
- Scheduled pickup time
- Real-time form validation
- Success/error toast notifications

#### 2. Active Children Dashboard
- Grid layout showing all active children
- Stats cards: Total Children, Upcoming Pickups, Today's Total
- Real-time updates when children are added/removed
- Visual indicators for children near pickup time (warning border)
- Beautiful empty state when no children registered

#### 3. Action Notifications
Four action types per child:
- **Emergency**: Critical notification to parents
- **Child Wishes Pickup**: Child requests to be picked up
- **Pickup Time Reached**: Scheduled time reminder
- **Mark as Picked Up**: Remove from active list

#### 4. WhatsApp Integration
- Mock webhook endpoint ready for n8n integration
- Logs notifications to console
- Action logging system tracks all notifications
- Preset message templates for each action type

#### 5. Archived View
- Shows children picked up today
- Maintains daily history until midnight reset
- Read-only cards with pickup status

#### 6. Settings Page
- Theme toggle (light/dark mode)
- n8n webhook configuration for WhatsApp integration
- **Editable message templates** - Staff can customize notification messages:
  - Emergency notifications
  - Child wishes pickup messages
  - Pickup time reminders
- Real-time template saving with validation
- Templates persist in database and apply immediately to new notifications

### Data Model

#### Children
```typescript
{
  id: string (UUID)
  name: string
  dailyId: number (auto-incremented, resets daily)
  parentPhone: string
  parentPhone2?: string
  pickupTime: string (HH:MM)
  status: "active" | "picked_up"
  registeredAt: Date
}
```

#### Action Logs
```typescript
{
  id: string (UUID)
  childId: string
  childName: string
  actionType: "emergency" | "child_wishes" | "pickup_time"
  parentPhone: string
  message: string
  timestamp: Date
}
```

### API Endpoints

**Children Management:**
- `GET /api/children` - Fetch all children
- `POST /api/children` - Register new child
- `GET /api/children/:id` - Get specific child
- `DELETE /api/children/:id` - Mark child as picked up

**Action Logging:**
- `POST /api/actions` - Create action log and send notification
- `GET /api/actions` - Fetch all action logs

**WhatsApp Integration:**
- `POST /api/whatsapp` - Mock webhook for WhatsApp notifications

### File Structure

```
client/
  src/
    components/
      app-sidebar.tsx          # Main navigation sidebar
      child-card.tsx           # Child information card with actions
      child-registration-form.tsx  # Registration form
      empty-state.tsx          # Empty state component
      stats-card.tsx           # Statistics display
      theme-provider.tsx       # Theme context provider
      theme-toggle.tsx         # Dark/light mode toggle
      ui/                      # Shadcn UI components
    pages/
      dashboard.tsx            # Main dashboard page
      archived.tsx             # Archived children page
      settings.tsx             # Settings page
      not-found.tsx            # 404 page
    App.tsx                    # Root component with routing
    index.css                  # Global styles and design tokens

server/
  routes.ts                    # API endpoint definitions
  storage.ts                   # In-memory storage implementation

shared/
  schema.ts                    # Shared TypeScript types and Zod schemas
```

### User Preferences
- Follows modern SaaS dashboard design patterns
- Emphasizes visual clarity and efficiency for daycare staff
- Generous touch targets for mobile use
- Consistent spacing and typography throughout
- Accessible color contrast ratios
- Smooth interactions and transitions

### Development Workflow

**Start Development:**
```bash
npm run dev
```

**Access Application:**
- Frontend/Backend: http://localhost:5000

**Key Development Notes:**
- Hot module replacement enabled for fast iteration
- TypeScript strict mode for type safety
- Zod validation on all API endpoints
- TanStack Query handles caching and revalidation
- Daily ID counter resets at midnight automatically
- In-memory storage clears daily (use database for production)

## Future Enhancements (Next Phase)

### High Priority
1. **Real n8n WhatsApp Integration**: Replace mock webhook with actual n8n connector
2. **Database Persistence**: Implement PostgreSQL with Drizzle ORM for production
3. **Authentication**: Add staff login system with role-based access
4. **Real-time Updates**: Implement WebSocket or Server-Sent Events for live dashboard updates

### Medium Priority
5. **Action History**: Comprehensive logging view with filters and search
6. ~~**Custom Message Templates**: Allow staff to edit notification messages~~ ✅ **COMPLETED (Oct 23, 2025)**
7. **Pickup Reminders**: Automatic notifications at scheduled pickup times
8. **Multi-day Archive**: Search and filter historical records beyond current day
9. **Export Reports**: Generate daily/weekly PDF reports of attendance

### Nice to Have
10. **Mobile App**: Native mobile companion app
11. **Photo Upload**: Add child profile photos
12. **Emergency Contacts**: Support multiple emergency contacts per child
13. **Notes System**: Staff notes for each child
14. **Analytics Dashboard**: Trends, peak hours, average stay duration

## Production Deployment Checklist

- [ ] Replace MemStorage with PostgreSQL database
- [ ] Set up n8n webhook for real WhatsApp messaging
- [ ] Implement proper authentication and authorization
- [ ] Add rate limiting on API endpoints
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure environment variables for production
- [ ] Set up database backups
- [ ] Add comprehensive logging
- [ ] Implement HTTPS/SSL
- [ ] Set up CI/CD pipeline
- [ ] Add automated tests (unit, integration, e2e)
- [ ] Review and update CORS policies
- [ ] Optimize build for production
- [ ] Set up analytics tracking

## Known Limitations (MVP)

1. **In-Memory Storage**: Data resets on server restart and daily at midnight
2. **Mock WhatsApp**: Notifications only logged to console, not sent
3. **No Authentication**: Anyone can access the dashboard
4. **No Multi-day History**: Archives only available for current day
5. **No Real-time Sync**: Manual refresh needed to see updates from other devices
6. **Single Location**: No support for multiple daycare locations

## Support & Maintenance

For questions or issues:
- Review design_guidelines.md for UI specifications
- Check console logs for debugging information
- Verify API endpoints return expected data structures
- Ensure daily ID counter resets are working correctly

---

**Built with ❤️ for Robinson Clubs Daycare Staff**
