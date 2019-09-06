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
            include.push({
                path: './eslintConfig'
            });
        }else {
            exclude.push({
                path: './eslintConfig'
            });
        }

        if(useTs) {
            include.push({
                path: './tsconfig.js'
            });
        }else {
            exclude.push({
                path: './tsconfig.js'
            });
        }

        if(store === 'mobx') {
            include.push({
                path: './mobxStore'
            });
            
            exclude.push({
                path: './reduxStore'
            });
        }else if(store === 'redux'){
            include.push({
                path: './reduxStore'
            });
            exclude.push({
                path: './mobxStore'
            });
        }else {
            exclude.push({
                path: './reduxStore'
            });
            exclude.push({
                path: './mobxStore'
            });
        }
        return {
            include,
            exclude
        }
    }
}