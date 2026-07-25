# Project Decisions

## Authentication

Authentication is out of scope for this project and is therefore not implemented.

## Surveys

- Surveys follow a one-way lifecycle: Draft -> Published.
- Once a survey is published, it is considered final and cannot be edited.

## Questions

- Every survey must contain at least one question.
- Each question must contain at least two answer options.

## Answers

- A question can have up to six answer options.
- This limit is enforced in the frontend, not at the database level.

## Text Constraints

- Survey title: 4-80 characters
- Description: optional, up to 300 characters
- Question text: 4-120 characters
- Answer text: 1-80 characters

## Home Filters

- The Past and Active filters cannot both be disabled at the same time.
- If that happens, Active is automatically enabled.
- Active is preselected by default on initial load.

## Feature: Surveys Without an End Date

Rules:
- expires_at can be null
- Surveys without an end date are always treated as active
- Surveys without an end date are never shown in Ending soon
- Surveys without an end date are excluded from expiry calculations
