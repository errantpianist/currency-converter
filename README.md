
# Currency Converter

Instantly convert currencies using up-to-date exchange rates from [floatrates](http://floatrates.com)

## Features
- Select base and target currencies
- Enter an amount (max 2 decimals)
- See conversion result, rounded to 2 decimals
- Cache prevents repeated API calls within a short time
- Responsive, accessible UI (Tailwind CSS v4)
- Robust validation and error handling
- Redux for state management
- Unit and integration tests (Vitest + React Testing Library)

## Setup
1. Install dependencies:
  ```sh
  npm install
  ```
2. Start the dev server:
  ```sh
  npm run dev
  ```

## Usage
- Select currencies and enter an amount
- Click Convert to see the result
- Continue typing to see the result update in real-time
- Errors and loading states are clearly indicated

## Testing
Run all tests:
```sh
npm test
```
Unit tests are in `src/__tests__`. Integration test is in `src/App.test.tsx`.

## Design Decisions
- Tailwind v4 for modern, responsive UI
- Accessibility: aria labels, live regions, keyboard navigation
- Redux for scalable state management