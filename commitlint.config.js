module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // Ensure the commit type is always one of the specified types
        'type-enum': [
            2,
            'always',
            [
                'feat',      // New feature
                'fix',       // Bug fix
                'improve',   // Code improvement
                'refactor',  // Code refactoring
                'docs',      // Documentation changes
                'chore',     // Other changes that don't affect the code (e.g., updating dependencies)
                'style',     // Code style changes (e.g., whitespace changes, formatting)
                'test',      // Adding or modifying tests
                'revert',    // Reverting a previous commit
                'ci',        // Changes to CI/CD configuration
                'build',     // Build system changes
            ],
        ],
        // Ensure the commit type is always in lower case
        'type-case': [2, 'always', 'lower-case'],
        // Ensure the commit type is never empty
        'type-empty': [2, 'never'],
        // Ensure the commit scope is never empty
        'scope-empty': [2, 'never'],
        // Ensure the commit subject is never empty
        'subject-empty': [2, 'never'],
        // Ensure the commit subject does not end with a full stop
        'subject-full-stop': [2, 'never', '.'],
        // Ensure the commit message header does not exceed the specified length
        'header-max-length': [2, 'always', 72],
    },
};
