# GRADE.ME - AI-Powered Essay Grading Platform

![Grade.me Logo](./assets/grade512.png)

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

   Create a `.env.local` file in the root directory of the project and add the following environment variables:

   ```sh
   NEXT_PUBLIC_FIREBASE_APIKEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTHDOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECTID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGEBUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APPID=your_firebase_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENTID=your_firebase_measurement_id
   NEXT_PUBLIC_STRIPE_PRODUCT_NAME=your_stripe_product_name
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_CREDITS_PER_GRADING=10
   ```

### Environment Variables

- **Firebase Configuration**: Required to initialize Firebase in the application.
- **Stripe Configuration**: Required for handling payments through Stripe.
- **Credits per Grading**: Defines the number of credits required for grading an essay.

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

1. **Payment Intent Creation**: Payments are processed through Stripe using payment intents.
2. **Validation**: Payment intents are validated to confirm successful payments.
3. **Credit System**: Credits are updated based on successful payments.

To enable Stripe payments, ensure you have the correct `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PRODUCT_NAME` in your environment variables.

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
