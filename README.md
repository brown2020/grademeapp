# GRADE.ME - AI-Powered Essay Grading Platform

Welcome to **GRADE.ME**, an AI-powered essay grading platform that provides instant feedback and personalized recommendations to help users improve their writing skills. GRADE.ME leverages state-of-the-art language models to evaluate and grade essays, providing insights to enhance writing quality.

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Firebase Configuration](#firebase-configuration)
- [Stripe Integration](#stripe-integration)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About the Project

GRADE.ME is an innovative platform that uses AI to grade essays, helping users improve their writing skills by providing instant, detailed feedback. The platform is designed for students, educators, and writers looking to refine their writing quality.

## Features

- **AI-Powered Grading**: Instantly grade essays using the OpenAI GPT-4 model via Vercel AI SDK and server actions.
- **Personalized Feedback**: Get a letter grade and a detailed explanation of your essay's strengths and areas for improvement.
- **User Profile Management**: Manage user profiles with Firebase Authentication and Firestore.
- **Credit-Based Grading System**: Users can earn and spend credits to grade their essays.
- **Payment Integration**: Integrated with Stripe for secure payments and credit purchasing.
- **History Management**: Track and review the history of submitted essays and grades.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase Firestore, Firebase Authentication, Firebase Storage
- **AI Integration**: Vercel AI SDK (`@ai-sdk/openai`) with Server Actions for OpenAI API calls
- **State Management**: Zustand
- **Payment Processing**: Stripe
- **Utilities**: `react-hot-toast` for notifications, `react-spinners` for loading indicators, `lodash` for utility functions

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (version 6 or higher)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/brown2020/grademeapp.git
   cd grademeapp
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory of the project and add the following environment variables based on the `.env.example` provided:

   ```sh
   # Firebase Server Config
   FIREBASE_TYPE=service_account
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY_ID=your_private_key_id
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_CLIENT_ID=your_client_id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_CERTS_URL=your_client_cert_url
   FIREBASE_UNIVERSE_DOMAIN=googleapis.com

   # Firebase Client Config
   NEXT_PUBLIC_FIREBASE_APIKEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTHDOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECTID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGEBUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APPID=your_firebase_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENTID=your_firebase_measurement_id

   # OpenAI and Other API Keys
   OPENAI_API_KEY=your_openai_api_key
   FIREWORKS_API_KEY=your_fireworks_api_key

   # Cookie Configuration
   NEXT_PUBLIC_COOKIE_NAME=grademeAuthToken

   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PRODUCT_NAME=grademe_demo_credits
   NEXT_PUBLIC_CREDITS_PER_GRADING=100
   NEXT_PUBLIC_STRIPE_KEY=your_stripe_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

### Environment Variables

- **Firebase Server Config**: Required for server-side Firebase operations.
- **Firebase Client Config**: Required to initialize Firebase on the client side.
- **OpenAI and Fireworks API Keys**: Required for AI-based grading functionality and other API integrations.
- **Stripe Configuration**: Required for handling payments through Stripe.
- **Cookie Configuration**: Manages authentication tokens.

### Running the Application

- **Development Mode:**

  ```sh
  npm run dev
  ```

- **Production Mode:**

  ```sh
  npm run build
  npm start
  ```

## Usage

- **Sign In/Sign Up**: Use the built-in authentication component to log in or create an account.
- **Submit Essays**: Paste your essay into the input field and click the "Grade" button to receive feedback.
- **View History**: Check your grading history to review past essays and feedback.
- **Manage Profile**: Update your user profile, including your credits and personal information.
- **Purchase Credits**: Use the integrated Stripe payment system to purchase additional credits.

## Firebase Configuration

1. **Firebase Authentication**: Used for user sign-in and registration.
2. **Firestore Database**: Stores user profiles, essay summaries, and payment records.
3. **Firebase Storage**: Handles file uploads (if any, such as profile pictures).

Ensure your Firebase project is set up correctly, and all necessary credentials are added to the `.env.local` file.

## Stripe Integration

The `GRADE.ME` application integrates Stripe for secure payment processing. This allows users to purchase credits that they can use for grading essays.

### How Stripe is Used in This Project

1. **Creating Payment Intents:**

   - The `createPaymentIntent` function in `paymentActions.ts` is used to create a payment intent using the Stripe API. This function takes an `amount` (in subunits like cents) and returns a `client_secret` needed to confirm the payment on the client side.
   - The payment intent is created with metadata that includes a product description (`NEXT_PUBLIC_STRIPE_PRODUCT_NAME`).

2. **Validating Payment Intents:**

   - The `validatePaymentIntent` function in `paymentActions.ts` retrieves a payment intent by its ID from Stripe and checks its status. If the payment is successful (`status === "succeeded"`), it returns the payment details.

3. **Client-side Payment Flow:**

   - The **Payment Checkout Page** component uses Stripe's `useStripe` and `useElements` hooks from `@stripe/react-stripe-js` to handle the client-side payment flow.
   - A new payment intent is created on component mount using the `createPaymentIntent` server action.
   - When the user submits the form, the `stripe.confirmPayment` method is called to complete the payment.

4. **Payment Success Handling:**
   - The **Payment Success Page** component handles post-payment success operations:
     - Validates the payment intent using the `validatePaymentIntent` server action.
     - Checks if the payment has already been processed to prevent duplicate credit additions.
     - Adds credits to the user profile using `useProfileStore` once the payment is validated.

### Setting Up Stripe

1. **Install Stripe and Stripe React Components:**

   ```sh
   npm install stripe @stripe/react-stripe-js
   ```

2. **Add Environment Variables:**

   Make sure to include the following environment variables in your `.env.local` file:

   ```sh
   NEXT_PUBLIC_STRIPE_PRODUCT_NAME=grademe_demo_credits
   NEXT_PUBLIC_STRIPE_KEY=your_stripe_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

   - `NEXT_PUBLIC_STRIPE_PRODUCT_NAME`: The name of the product being sold (e.g., credits).
   - `NEXT_PUBLIC_STRIPE_KEY`: Your Stripe public key for client-side integration.
   - `STRIPE_SECRET_KEY`: Your Stripe secret key for server-side actions.

3. **Configuring Server Actions:**

   - **`createPaymentIntent`**: Initializes the payment by creating a payment intent using the Stripe secret key. It returns a client secret for confirming the payment.
   - **`validatePaymentIntent`**: Verifies the payment's status and confirms whether it was successful.

4. **Client-Side Components:**
   - **Payment Checkout Page**: Handles the client-side payment form and interacts with the Stripe API to confirm payments.
   - **Payment Success Page**: Manages post-payment validation and updates the user's credits based on successful transactions.

## Contributing

Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request.

1. **Fork the Project**
2. **Create a Branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit Your Changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

- **GitHub**: [brown2020](https://github.com/brown2020)
- **Email**: [info@ignitechannel.com](mailto:info@ignitechannel.com)
