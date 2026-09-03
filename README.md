# 👑 KING DESIGNER

A modern, full-featured Arabic social design portfolio platform with RTL support, real-time messaging, and professional portfolio management.

## 🎨 Features

- **User Profiles**: Complete user profiles with cover images, bio, specialization, and verification status
- **Portfolio Management**: Create, edit, and showcase design works with media support
- **Social Interactions**: Likes, comments, replies, and sharing with real-time updates
- **Messaging**: Private conversations with real-time presence and read receipts
- **Notifications**: Real-time notifications for follows, likes, comments, and messages
- **Admin Panel**: Comprehensive admin dashboard for content and user management
- **Search**: Advanced search by publicId, name, handle, and hashtags
- **AWS S3 Integration**: Secure media storage for profile images, portfolios, and messages
- **Responsive Design**: Full support for desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, TailwindCSS 4, Vite 7
- **Backend**: Express.js, Node.js, tRPC
- **Database**: MySQL with Drizzle ORM
- **Storage**: AWS S3
- **UI Components**: Radix UI
- **State Management**: TanStack Query, React Hook Form
- **Testing**: Vitest

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 10.4.1+
- MySQL Database
- AWS S3 Credentials

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env
# Edit .env with your database and AWS credentials

# Run database migrations
pnpm run db:push

# Start development server
pnpm run dev
```

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run check` - Type checking with TypeScript
- `pnpm run format` - Format code with Prettier
- `pnpm run test` - Run tests with Vitest
- `pnpm run db:push` - Run database migrations

## 📁 Project Structure

```
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── styles/           # Global styles
│   │   └── types/            # TypeScript types
│   └── public/               # Static assets
├── server/                    # Backend Express server
│   ├── _core/                # Core server logic
│   ├── db/                   # Database schema and migrations
│   ├── api/                  # API routes and handlers
│   └── middleware/           # Custom middleware
├── shared/                    # Shared types and utilities
└── attached_assets/          # Brand assets (logos, images)
```

## 🔧 Environment Variables

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/king_designer

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your_bucket_name
AWS_S3_REGION=us-east-1

# Authentication
JWT_SECRET=your_jwt_secret

# Server
PORT=3000
NODE_ENV=development
```

## 🔐 Security

- Password hashing with industry-standard algorithms
- JWT-based authentication
- CORS protection
- Input validation and sanitization
- Server-side permission checks
- Audit trails for sensitive operations

## 📝 Database Schema

Key tables:
- `users` - User accounts with profiles
- `profiles` - Extended user profile information
- `posts` - Portfolio items and works
- `post_media` - Media attachments for posts
- `interactions` - Likes, comments, and replies
- `follows` - User follow relationships
- `messages` - Private messages
- `notifications` - User notifications
- `blocks` - User blocking relationships

## 🧪 Testing

```bash
# Run all tests
pnpm run test

# Run tests in watch mode
pnpm run test --watch

# Generate coverage report
pnpm run test --coverage
```

## 📦 Deployment

1. Build the project:
```bash
pnpm run build
```

2. Start the server:
```bash
pnpm run start
```

The application will be available at `http://localhost:3000`

## 🎯 Roadmap

- [ ] AI Personal Assistant with conversation history
- [ ] Advanced image generation with watermark support
- [ ] Browser notifications via Notification API
- [ ] Profile verification request workflow
- [ ] Enhanced admin tools for payments and rewards
- [ ] PRO/VIP subscription tiers

## 📄 License

MIT License - see LICENSE file for details

## 👥 Contributors

- Design & Development Team

## 📞 Support

For support and inquiries, please contact the development team or open an issue on GitHub.

---

**Built with ❤️ for designers and creators**
