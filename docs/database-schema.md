# Database Schema

## categories

| Column | Type |
|----------|----------|
| id | int8 |
| name | text |

## surveys

| Column | Type |
|----------|----------|
| id | int8 |
| title | text |
| description | text |
| expires_at | date |
| category_id | int8 |
| is_published | bool |
| created_at | timestamptz |

Relationship:
- category_id → categories.id

## questions

| Column | Type |
|----------|----------|
| id | int8 |
| survey_id | int8 |
| text | text |
| allow_multiple_answers | bool |
| sort_order | int8 |

Relationship:
- survey_id → surveys.id

## answers

| Column | Type |
|----------|----------|
| id | int8 |
| question_id | int8 |
| text | text |
| sort_order | int8 |

Relationship:
- question_id → questions.id

## votes

| Column | Type |
|----------|----------|
| id | int8 |
| question_id | int8 |
| answer_id | int8 |
| voter_token | string |
| created_at | string |

Relationship:
- question_id → questions.id
- answer_id → answers.id