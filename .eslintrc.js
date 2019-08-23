module.exports = {
    "root": true,
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "globals": {
        "__dirname": true,
        "describe": true,
        "it": true
    },
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "dot-location": [
            "error",
            "property"
        ],
        "eqeqeq": [
            "error",
            "always"
        ],
        "no-else-return": [
            "error",
            { "allowElseIf": true }
        ],
        "comma-spacing": [
            "error",
            { "before": false, "after": true }
        ],
        "max-len": [
            "error",
            { 
                "code": 80,
                "ignoreComments": true,
                "ignoreUrls": true,
                "ignoreStrings": true
            }
        ],
        "multiline-comment-style": [
            "error",
            "starred-block"
        ],
        "semi-spacing": [
            "error",
            { 
                "before": false, 
                "after": true
             }
        ],
        "sort-vars": [
            "error",
        ],
        "semi-style": [
            "error",
             "last"
        ],
        "semi-style": ["error", "last"],
        "no-unused-vars": [
            "error",
            { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }
        ]
    }
};