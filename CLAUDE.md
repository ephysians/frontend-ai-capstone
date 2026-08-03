# CLAUDE.md

## Project

Frontend AI Engineering Capstone

## Stack

- Node.js
- JavaScript
- Git
- VS Code

## Conventions

- Use Conventional Commits.
- Write clear and maintainable code.
- Prefer reusable functions.
- Explain complex logic with comments.
- Keep README updated.

## Conventions (added from FE-03 drill)
- Guard `module.exports` so scripts work in both Node (tests) and the browser — don't assume `module` exists globally.
- Forms validate on blur AND on submit, never submit-only.
- Every field's error state drives the submit button's disabled state, computed live, not just checked once at submit time.