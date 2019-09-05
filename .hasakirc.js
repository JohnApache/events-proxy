module.exports = {
    parseExclude: [

    ],
    parseInclude: [],
    ignore: [],
    question: [
        {
            type: 'input',
            message: '请输入作者名称',
            name: 'author',
            filter(input) {
                return input || '';
            },
            validate(input) {
                return input && input.length > 0;
            }
        },
        {
            type: 'input',
            message: '请输入描述',
            name: 'description',
            filter(input) {
                return input || '';
            },
            validate(input) {
                return input && input.length > 0;
            }
        },
        {
            type: 'confirm',
            message: 'use store?',
            name: 'useStore',
            default: true,
        },
        {
            type: 'list',
            message: 'use redux or mobx?',
            name: 'store',
            when(answer) {
                return answer.useStore
            },
            choices() {
                return [
                    'redux',
                    'mobx'
                ]
            }
        },
        {
            type: 'confirm',
            message: 'use typescript?',
            name: 'useTs',
            default: true,
        },
        {
            type: 'confirm',
            message: 'use eslint?',
            name: 'useEslint',
            default: true,
        },
    ],
    screener(answers) {
        const {
            useTs,
            store,
            useEslint,
        } = answers;
        const include = [];
        const exclude = [];
        
        if(useEslint) {
            include.push(new RegExp('eslintConfig'));
        }else {
            exclude.push(new RegExp('eslintConfig'));
        }

        if(useTs) {
            include.push(new RegExp('tsconfig.js'));
        }else {
            exclude.push(new RegExp('tsconfig.js'));
        }

        if(store === 'mobx') {
            include.push(new RegExp('mobxStore'));
            exclude.push(new RegExp('reduxStore'));
        }else if(store === 'redux'){
            include.push(new RegExp('reduxStore'));
            exclude.push(new RegExp('mobxStore'));
        }else {
            exclude.push(new RegExp('mobxStore'));
            exclude.push(new RegExp('reduxStore'));
        }
    }
}