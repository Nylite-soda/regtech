
# Next.js Authentication System

This project implements a comprehensive authentication system using NextAuth.js with multiple authentication providers:

- Google OAuth
- Email/Password

## Features

- Multiple authentication methods
- Secure password handling
- Google OAuth integration
- Supabase database integration
- Row Level Security (RLS)
- Modern UI with tabs for different auth methods

## Prerequisites

- Node.js 18+ and pnpm
- Supabase account
- Google Cloud Console account
- SendGrid account

## Setup Instructions

1. Clone the repository:

```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

   - Copy `.env.local.example` to `.env.local`
   - Fill in all the required environment variables

4. Set up Supabase:

   - Create a new Supabase project
   - Run the migration script in `supabase/migrations/20240331_create_users.sql`
   - Get your project URL and service role key

5. Set up Google OAuth:

   - Go to Google Cloud Console
   - Create a new project
   - Enable the Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

6. Set up SendGrid:

   - Create a SendGrid account
   - Generate an API key

7. Run the development server:

```bash
pnpm dev
```

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
```

## Usage

1. Start the development server:

```bash
pnpm dev
```

2. Visit `http://localhost:3000/auth/signin`

3. Choose your preferred authentication method:
   - Email/Password
   - Google OAuth

## Security Considerations

- Passwords are hashed before storage
- Row Level Security (RLS) is enabled in Supabase
- Environment variables are used for sensitive data
- HTTPS is required in production

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
=======
# regtech
>>>>>>> 5529f316448bdcfa5100ed125ca85d0eff2483ab
