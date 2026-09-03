# KING DESIGNER API Documentation

## Overview

KING DESIGNER uses tRPC for type-safe API communication. The API is built on Express.js and provides real-time capabilities through polling and will support WebSockets in future versions.

## Authentication

All API requests require JWT authentication:

```typescript
Header: Authorization: Bearer <jwt_token>
```

## Base URL

```
http://localhost:3000/trpc
```

## API Endpoints

### Users

#### Get Current User
```
GET /trpc/user.me
```

**Response:**
```json
{
  "id": "user_123",
  "name": "Ahmed",
  "email": "ahmed@example.com",
  "publicId": "king_1234",
  "handle": "ahmed_design",
  "isVerified": true
}
```

#### Get User Profile
```
GET /trpc/user.getProfile?userId=user_123
```

#### Update Profile
```
POST /trpc/user.updateProfile
```

**Body:**
```json
{
  "name": "Ahmed",
  "bio": "Professional Designer",
  "specialization": "UI/UX",
  "level": "Expert"
}
```

### Posts (Portfolio)

#### Create Post
```
POST /trpc/post.create
```

**Body:**
```json
{
  "title": "Mobile App Design",
  "description": "Beautiful mobile app interface",
  "category": "UI Design",
  "isPrivate": false,
  "mediaIds": ["media_123", "media_456"]
}
```

#### Get Feed
```
GET /trpc/post.getFeed?limit=20&offset=0
```

#### Get Post Details
```
GET /trpc/post.getById?postId=post_123
```

#### Update Post
```
POST /trpc/post.update
```

#### Delete Post
```
POST /trpc/post.delete?postId=post_123
```

### Interactions

#### Like Post
```
POST /trpc/interaction.like
```

**Body:**
```json
{
  "postId": "post_123"
}
```

#### Unlike Post
```
POST /trpc/interaction.unlike?postId=post_123
```

#### Add Comment
```
POST /trpc/interaction.comment
```

**Body:**
```json
{
  "postId": "post_123",
  "content": "Great design!"
}
```

#### Reply to Comment
```
POST /trpc/interaction.reply
```

**Body:**
```json
{
  "commentId": "comment_123",
  "content": "Thank you!"
}
```

### Messages

#### Get Conversations
```
GET /trpc/message.getConversations
```

#### Get Messages
```
GET /trpc/message.getMessages?userId=user_123&limit=20
```

#### Send Message
```
POST /trpc/message.send
```

**Body:**
```json
{
  "recipientId": "user_123",
  "content": "Hello!",
  "type": "text"
}
```

#### Mark as Read
```
POST /trpc/message.markAsRead?conversationId=conv_123
```

### Follows

#### Follow User
```
POST /trpc/follow.follow?userId=user_123
```

#### Unfollow User
```
POST /trpc/follow.unfollow?userId=user_123
```

#### Get Followers
```
GET /trpc/follow.getFollowers?userId=user_123&limit=20
```

#### Get Following
```
GET /trpc/follow.getFollowing?userId=user_123&limit=20
```

### Notifications

#### Get Notifications
```
GET /trpc/notification.getList?limit=20
```

#### Mark as Read
```
POST /trpc/notification.markAsRead?notificationId=notif_123
```

#### Mark All as Read
```
POST /trpc/notification.markAllAsRead
```

### Search

#### Search Users
```
GET /trpc/search.users?query=ahmed&limit=10
```

#### Search Posts
```
GET /trpc/search.posts?query=design&limit=20
```

#### Search Hashtags
```
GET /trpc/search.hashtags?query=ui&limit=10
```

### Admin (requires admin role)

#### Get Analytics
```
GET /trpc/admin.analytics
```

#### Update User
```
POST /trpc/admin.updateUser
```

#### Delete Post
```
POST /trpc/admin.deletePost?postId=post_123
```

#### Manage Bans
```
POST /trpc/admin.banUser?userId=user_123
```

## Error Responses

All errors follow this format:

```json
{
  "code": "UNAUTHORIZED",
  "message": "You are not authenticated"
}
```

### Common Error Codes

- `UNAUTHORIZED` - Missing or invalid authentication
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `BAD_REQUEST` - Invalid request data
- `INTERNAL_SERVER_ERROR` - Server error
- `UNPROCESSABLE_CONTENT` - Validation error

## Rate Limiting

API requests are rate limited:
- **Public endpoints**: 100 requests/minute
- **Authenticated endpoints**: 1000 requests/minute
- **Admin endpoints**: 500 requests/minute

## Pagination

List endpoints support pagination:

```
GET /trpc/resource.list?limit=20&offset=0
```

**Parameters:**
- `limit`: Number of items (default: 20, max: 100)
- `offset`: Number of items to skip (default: 0)

## Sorting

Some list endpoints support sorting:

```
GET /trpc/resource.list?sortBy=createdAt&sortOrder=desc
```

## Filtering

List endpoints support filtering:

```
GET /trpc/post.list?category=ui&isPrivate=false
```

## Real-Time Updates

Currently uses polling. WebSocket support planned for v1.1.0.

Polling intervals:
- Messages: 2 seconds
- Notifications: 3 seconds
- Feed: 5 seconds
- Presence: 30 seconds

## File Upload

### Upload Profile Image
```
POST /trpc/upload.profileImage
Content-Type: multipart/form-data
```

**Response:**
```json
{
  "url": "https://s3.amazonaws.com/bucket/profile_123.jpg",
  "size": 102400
}
```

### Supported Formats
- Images: JPG, PNG, WebP (max 5MB)
- Videos: MP4, WebM (max 50MB)

## Webhooks (Planned)

Webhooks for external integrations (v2.0.0):
- `post.created`
- `post.liked`
- `comment.created`
- `user.followed`
- `message.sent`

## SDK Usage

### JavaScript/TypeScript

```typescript
import { trpc } from '@/lib/trpc';

// Get current user
const user = await trpc.user.me.query();

// Create post
const post = await trpc.post.create.mutate({
  title: 'My Design',
  description: 'Beautiful interface',
  category: 'UI Design'
});

// Subscribe to notifications (polling)
const { data: notifications } = await trpc.notification.getList.useQuery();
```

## Best Practices

1. **Always include error handling**
   ```typescript
   try {
     const user = await trpc.user.me.query();
   } catch (error) {
     console.error('Failed to fetch user:', error);
   }
   ```

2. **Use React Query for caching**
   ```typescript
   const { data: posts } = useQuery({
     queryKey: ['posts'],
     queryFn: () => trpc.post.getFeed.query(),
   });
   ```

3. **Debounce search queries**
   ```typescript
   const debouncedSearch = useDebouncedValue(searchTerm, 300);
   ```

4. **Handle loading and error states**
   ```typescript
   if (isLoading) return <Skeleton />;
   if (error) return <ErrorMessage />;
   return <Content data={data} />;
   ```

## Testing

```bash
# Run API tests
pnpm run test -- api

# Test specific endpoint
pnpm run test -- user.getProfile
```

---

For more details, check the server code in `server/` directory.
