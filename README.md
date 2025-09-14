# Foomatic Printer Database Lookup Site

A modern, fast, and responsive web application for browsing the comprehensive Foomatic printer database maintained by the OpenPrinting community. Built with Next.js and optimized for performance with lazy loading.

## Features

- **Lightning Fast Loading**: 95.2% reduction in initial page load time through lazy loading optimization
- **Comprehensive Database**: Access to 6,657+ printers with detailed driver information
- **Advanced Search**: Filter by manufacturer and search by model name
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Static Site Generation**: Fully compatible with GitHub Pages deployment

## Performance Optimization

This application implements a sophisticated lazy loading system:

- **Lightweight Index**: Initial page loads only essential printer metadata (1.1MB vs 23.9MB)
- **On-Demand Loading**: Full printer details are fetched only when needed
- **Individual Files**: Each printer's data is stored in separate JSON files for optimal caching
- **Loading States**: Smooth user experience with skeleton loaders and error handling

## Data Structure

- `printersMap.json`: Lightweight index with essential printer information
- `printers/{id}.json`: Individual printer files with complete driver details
- Automatic data splitting script for easy updates

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
