# Backend Server

## Architecture Decision: Direct Supabase Access

This backend does NOT include proxy routes for user authentication and profile management. Instead:

**Frontend → Supabase (Direct):**
- User authentication (register, login, logout) happens directly from frontend to Supabase
- Profile CRUD operations go directly from frontend to Supabase
- Row Level Security (RLS) policies enforce access control
- No backend intermediary needed for these operations

**Why This Approach:**
1. **Security**: RLS policies in Supabase automatically enforce user-level access control
2. **Simplicity**: Eliminates redundant backend routes that would require their own auth middleware
3. **Performance**: Direct client-to-Supabase connection is faster
4. **Best Practice**: This is the recommended Supabase architecture pattern

**Backend Purpose:**
The backend server is reserved for operations that require:
- Server-side AI processing (Gemini API for questionnaire generation)
- PDF generation (pdfkit for will documents)
- Email sending (SendGrid for document delivery)
- Admin operations requiring Service Role Key (e.g., dual-kill deletion in Phase 5)

## Current Endpoints

### Health Check
- `GET /api/health` - Server status check

### Configuration Check
- `GET /api/config/check` - Verify environment variables are set

## Future Endpoints (Phase 3+)

### AI & Questionnaire
- `POST /api/ai/compliance` - Generate jurisdiction compliance statement
- `POST /api/ai/questions` - Generate questionnaire questions
- `POST /api/ai/assess` - Assess user answers for will generation

### PDF Generation
- `POST /api/pdf/will` - Generate will PDF document
- `POST /api/pdf/assessment` - Generate legal assessment PDF

### Email Delivery
- `POST /api/email/send` - Send will documents via email

### Admin Operations
- `DELETE /api/admin/user/:userId` - Dual-kill deletion (admin only, requires auth)
