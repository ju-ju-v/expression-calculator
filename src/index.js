function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    let strToRPN = function (str) {
        let result = [];
        let stack = [];
        let number = '';

        push_number = function () {
            if (number != '') {
                result.push(number);
            }
            number = '';
        }

        push_minor_operator = function () {
            let last = stack.pop();

            if (last === undefined) {
                stack.push(symb);
            }
            else if (last === '(') {
                stack.push(last);
                stack.push(symb);
            }
            else {
                result.push(last);
                push_minor_operator();
            }
        }

        push_major_operator = function () {
            let last = stack.pop();

            if (last === undefined) {
                stack.push(symb);
            }
            else if (last == '(' || last == '+' || last == '-') {
                stack.push(last);
                stack.push(symb);
            }
            else {
                result.push(last);
                stack.push(symb);
            }
        }

        stack_to_result = function (until_bracket = false) {
            while (stack.length > 0) {
                let operator = stack.pop();
                if (until_bracket) {
                    if (operator === '(') break;
                    if (stack.length === 0) {
                        throw "ExpressionError: Brackets must be paired";
                        return false;
                    }
                }
                else {
                    if (operator === '(') {
                        throw "ExpressionError: Brackets must be paired";
                        return false;
                    }
                }

                result.push(operator);
            }
        }

        for (i = 0; i < expr.length; i++) {
            symb = expr[i]
            switch (symb) {
                case ' ':
                    push_number();
                    break;
                case '(':
                    stack.push(symb);
                    push_number();
                    break;
                case ')':
                    stack_to_result(true);
                    push_number();
                    break;
                case '+': case '-':
                    push_minor_operator(symb);
                    push_number();
                    break;

                case '*': case '/':
                    push_major_operator(symb);
                    push_number();
                    break;

                default:
                    number += symb;
                    if (i == expr.length - 1) {
                        push_number();
                    }
                    break;
            }
        }
        stack_to_result(false);

        return result;
    }

    let RNPToNumber = function (rnp = Array()) {

        const operators = {
            '+': (x, y) => x + y,
            '-': (x, y) => x - y,
            '*': (x, y) => x * y,
            '/': (x, y) => {

                if (y === 0) {
                    throw "TypeError: Division by zero.";
                    return false;
                }
                return x / y;

            }
        };

        let stack = [];
        rnp.forEach((token) => {
            if (token in operators) {
                let [y, x] = [stack.pop(), stack.pop()];
                stack.push(operators[token](x, y));
            }
            else {
                stack.push(parseFloat(token));
            }
        });

        return stack.pop();
    }

    let rnp = strToRPN(expr);
    return RNPToNumber(rnp);

}

module.exports = {
    expressionCalculator
}