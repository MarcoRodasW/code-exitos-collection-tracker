# Setup Instructions

Follow these steps to set up the project locally:

## 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

## 2. Install Dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

## 3. Create a `.env.local` File

Create a file named `.env.local` in the root directory of the project and add the following environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://uqmtnbebjduxlghdonnv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxbXRuYmViamR1eGxnaGRvbm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzOTMyODgsImV4cCI6MjA0OTk2OTI4OH0.6RfphCvWoSA7CEFwNrEi_tejC560Hb85TowsVAqoglk
```

### Disclaimer:
These environment variables are valid for **5 days** and are provided for presentation purposes only.

## 4. Start the Development Server

Run the following command to start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000` by default.

---

## Technologies Used

- **NextJS**: React Framework.
- **RadixUI/ShadCN**: UI Library.
- **React Hook Forms**: Forms library.
- **Zod**: Schema validation.
