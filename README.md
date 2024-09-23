# My_rotten_tomatoes

## C - Code & Go - Server Side Rendering

My_rotten_tomatoes is a web application that allows users to view summaries, rate, and comment on movies. Built with NextJS, it offers a seamless server-side rendering experience.

## Table of Contents

- [How It Works](#how-it-works)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## How It Works

- **Anonymous Users**: Can view movie summaries without registration.
- **Registered Users**: Can rate and comment on movies after creating an account.
- **Search Functionality**: Users can search for specific movies using the search bar.
- **Filtering**: Movies can be filtered by genre and date.

## Features

1. Movie browsing
2. User registration and authentication
3. Movie rating and commenting
4. Search and filter functionality
5. User profile management
6. Favorite movie list

## Architecture

### Main Components

1. **Header**
   - Home button
   - "Rotten tomatoes" title (links to home)
   - Login/Logout button
   - Register button

2. **Main Page**
   - Displays all movies with rates and summaries
   - Search bar with genre and date filters

3. **Movie Details Page**
   - Accessed via "Watch and rate" button
   - Displays selected movie details
   - Allows rating and commenting (for logged-in users)
   - Option to add to favorites

4. **User Authentication**
   - Register page for new users
   - Login functionality
   - Welcome message upon successful login

5. **User Profile**
   - Ability to modify email and password

## Tech Stack

- **Framework**: NextJS
- **Server-Side Rendering**: Implemented for improved performance and SEO
- **Database**: MongoDB
- **API**: themoviedb

## Getting Started

1. Clone the repository

   ```
   git clone https://github.com/EpitechCodingAcademyPromo2024/C-COD-270-COT-2-3-c2cod270p0-martin.dohou.git
   ```

2. Install dependencies
   ```
   cd C-COD-270-COT-2-3-c2cod270p0-martin.dohou/next-movie/src/app
   npm install
   ```

3. Set up environment variables (create a `.env.local` file)

4. Run the development server
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
