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
    ]
}