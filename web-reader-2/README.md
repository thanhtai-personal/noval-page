# Web Reader

Web Reader is a web application designed to provide users with a seamless experience for discovering and reading stories. The application fetches story data from an API and displays it in an engaging format.

## Project Structure

The project is organized into the following main directories:

- **app**: Contains the main entry point for the application and client rendering logic.
  - `page.tsx`: The main entry point for the home page.
  - `HomePageClient.tsx`: Contains the client rendering logic for the home page.

- **components**: Contains reusable components used throughout the application.
  - **animations**: Contains animated components.
    - `Fire1.tsx`: Renders an animated fire graphic.
    - `FireLine.tsx`: Renders a line of animated fire graphics.
  - **common**: Contains common utility components.
    - `StoriesWithSkeletonLoading.tsx`: Displays stories with skeleton loading placeholders.
  - **story**: Contains components related to story display.
    - `StoryCard.tsx`: Displays individual story details.
    - `StoryCardSkeleton.tsx`: Provides a skeleton loading UI for the `StoryCard`.

- **types**: Contains TypeScript interfaces.
  - **interfaces**: Contains interface definitions.
    - `story.ts`: Defines the structure of a story object.

- **utils**: Contains utility functions and API configurations.
  - `api.ts`: Exports an instance of `ApiInstant` for making API calls.

## Getting Started

To get started with the Web Reader project, follow these steps:

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd web-reader
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Run the application:
   ```
   npm run dev
   ```

## Features

- Dynamic fetching of stories based on various sorting criteria (most recommended, most viewed, most liked, etc.).
- Animated components to enhance user experience.
- Responsive design for optimal viewing on different devices.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.