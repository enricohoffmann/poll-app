# Poll App

Poll App is an Angular application for creating, publishing, and answering surveys. The project focuses on a clear survey lifecycle, a strict set of validation rules, and a simple data model that keeps questions, answers, and votes connected.

## Overview

The application provides three main areas:

- A home view for browsing surveys and switching between active and past entries.
- A survey creation flow for building drafts with questions and answer options.
- A survey detail view for participating in published surveys and reviewing results.

The frontend is built with Angular 21 and uses modern standalone components and routing.

The application uses Supabase as its backend and persists surveys, questions, answers, and votes there.

## Key Rules

The behavior of the application is based on the decisions documented in the project notes:

- Authentication is intentionally out of scope.
- Surveys follow a one-way lifecycle: Draft -> Published.
- Once a survey is published, it is final and can no longer be edited.
- Every survey must contain at least one question.
- Every question must contain at least two answer options.
- A question can contain up to six answer options.
- The limit of six answers is enforced in the frontend, not in the database.

## Validation Rules

Text fields use these constraints:

- Survey title: 4-80 characters
- A word must not exceed 20 characters in length
- Description: optional, up to 300 characters
- Question text: 4-120 characters
- Answer text: 2-80 characters

## Survey Filtering

The home view supports active and past survey filters with the following behavior:

- Active and Past are now mutually exclusive filter modes.
- Only one mode can be selected at a time.
- Showing Active and Past surveys simultaneously is no longer supported.
- Active is selected by default on initial load.

## Surveys Without an End Date

Surveys may have no expiry date. In that case:

- `expires_at` can be null.
- Surveys without an end date are always treated as active.
- They never appear in the Ending soon list.
- They are excluded from expiry calculations.

## Data Model

The database schema is centered around five tables:

- `categories`: stores survey categories.
- `surveys`: stores survey metadata such as title, description, expiry date, publication state, and category.
- `questions`: stores the survey questions and their display order.
- `answers`: stores the answer options for each question.
- `votes`: stores the submitted answers and voter token information.

Vote results are loaded from Supabase and updated in real time when new votes are inserted, so the survey results view stays current without a manual refresh.

Relationships:

- `surveys.category_id -> categories.id`
- `questions.survey_id -> surveys.id`
- `answers.question_id -> questions.id`
- `votes.question_id -> questions.id`
- `votes.answer_id -> answers.id`

## Tech Stack

- Angular 21
- TypeScript
- RxJS
- Angular CDK (including Overlay/OverlayRef for custom dialog overlays)
- Supabase client

The app connects to a Supabase backend, and vote result updates are handled in real time through Supabase Realtime.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

The app will open automatically and run on `http://localhost:4200/`.

## Available Scripts

- `npm start` - starts the dev server and opens the browser
- `npm run build` - builds the application for production
- `npm run build:prod` - builds for deployment under `/poll-app/` and runs the post-build asset fix script
- `npm run watch` - builds in watch mode for local development
- `npm test` - runs the unit test suite

## Deployment (Developer Akademie Server)

Use this command for every deploy build:

```bash
npm run build:prod
```

What this command does:

- Runs Angular production build with `--base-href /poll-app/`
- Copies `public/assets` to `dist/poll-app/browser/assets`
- Rewrites compiled asset URLs from `/assets/...` to relative `assets/...`

Upload target:

- Upload the full content of `dist/poll-app/browser/` into the server folder `/poll-app/`
- Replace old files, especially `main-*.js`, `styles-*.css`, and `index.html`

Important for routing on this server:

- The app uses hash routing, so links should look like `/poll-app/#/home`
- This avoids server-side rewrite requirements for client routes

## Project Structure

The source code is organized into feature areas, shared components, services, models, and interfaces. Notable folders include:

- `src/app/features` for page-level survey flows
- `src/app/shared/components` for reusable UI components
- `src/app/services` for application logic and data handling
- `src/app/interfaces` and `src/app/models` for typed domain structures
- `docs` for the database schema and project decisions

## Development Notes

This repository was generated with Angular CLI, but the README reflects the actual product behavior instead of the default scaffold text. For the latest implementation rules, refer to the files in `docs`.

## About This Project

This project was developed as part of a training program at the Developer Akademie.

Learn more about the academy here: [Developer Akademie](https://developerakademie.com/)
