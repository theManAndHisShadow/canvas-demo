import { fractionToDecimal } from "../../../misc/helpers";

/**
 * An auxiliary class that determines the type of a function and extracts the coefficients of its monomials
 */
export class TinyMath {
    constructor(){
        /**
         * The Cake is LIE
         */
    }


    /**
     * Detects of function type.
     * @param {string} formula - function formula
     * @returns {string} - type of functon (linear, quadratic, etc)
     */
    detect(formula){
        // if function type is not detected - set false value
        let type = 'unknown';

        /**
         * Using regular expressions to determine type of function
         */
        if(/x\^3/g.test(formula)){
            type = "cubic";
        } else if(/x\^2/g.test(formula)){
            type = "quadratic";
        } else if(/e\^\{?\-?(\d+\/?\d+|0\.\d{1,})?x\}?/g.test(formula)) {
            type = 'exponential';
        } else if(/\/\d?x/g.test(formula)) {
            type = 'hyperbolic'
        } else {
            type = "linear";
        }

        return type;
    }


    /**
     * Parses functioяn monomial coefficients
     * @param {string} formula - function formula
     * @param {string} type - function type
     * @returns {object} - parsed coefficients object {a, b, c...}
     */
    parse(formula, type){
        let result = {};

        // devides formula into groups based on math operators
        const delimeter = new RegExp(`(?<!\{)([+-])+`, 'gm');
        let splitted = formula.split(delimeter);

        // internal helper function 
        // if monomial uses / symbol - wrap as fraction elem
        const normalizeNumber = (num) => {
            // remove helper brakets
            num = /(\{|\})/gm.test(num) ? num.replace(/(\{|\})/gm, '') : num;

            // normalize and return
            return /\//g.test(num) ? Number(fractionToDecimal(num).toFixed(5)) : num;
        }

        // It seems to me that this code needs refactoring
        if(type == 'linear') {
            let a = 0, b = 0;

            splitted.forEach((item, i) => {
                if (item.trim().length > 0 && !delimeter.test(item)) {
                    // detect sign of 'monomial'
                    let sign = i > 0 && splitted[i - 1] === '-' ? -1 : 1;

                    if (/x/.test(item)) {
                        // set minor monomial
                        a = (item.split('x')[0] || 1);
                        a = normalizeNumber(a) * sign; 
                    } else {
                        // set radical
                        b = normalizeNumber(item) * sign;
                    }
                }
            });

            result = {a, b}; 
        } else if(type == 'hyperbolic') {
            let a = 0, b = 0, c = 0;

            splitted.forEach((item, i) => {
                if (item.trim().length > 0 && !/[+-]/.test(item)) {
                    // detect sign of 'monomial'
                    let sign = i > 0 && splitted[i - 1] === '-' ? -1 : 1;

                    if (/\/\d{0,}x/.test(item)) {
                        // set major monomial numerator
                        a = Number((item.split('/')[0] || 1));

                        // set major monomial denumerator
                        b = (item.split('/')[1] || 1).replace('x', '')
                        b = (b == '' ? 1 : Number(b)) * sign;
                    } else {
                        // set radical
                        c = normalizeNumber(item) * sign;
                    }
                }
            });
            
            result = {a, b, c};
        } else if(type == 'quadratic') {
            let a = 0, b = 0, c = 0;

            splitted.forEach((item, i) => {
                // only for non-operator symbols and non-empty strings
                if (item.trim().length > 0 && !/[+-]/.test(item)) {
                    // detect sign of 'monomial'
                    let sign = i > 0 && splitted[i - 1] === '-' ? -1 : 1;

                    if (/x\^2/.test(item)) {
                        // set major monomial
                        a = (item.split('x')[0] || 1);
                        a = normalizeNumber(a) * sign;
                    } else if (/x/.test(item)) {
                        // set minor monomial
                        b = (item.split('x')[0] || 1);
                        b = normalizeNumber(b) * sign;
                    } else {
                        // set radical
                        c = normalizeNumber(item) * sign;
                    }
                }
            });

            result = {a, b, c};
        } else if(type == 'cubic') {
            let a = 0, b = 0, c = 0, d = 0;

            splitted.forEach((item, i) => {
                // only for non-operator symbols and non-empty strings
                if (item.trim().length > 0 && !/[+-]/.test(item)) {
                    // detect sign of 'monomial'
                    let sign = i > 0 && splitted[i - 1] === '-' ? -1 : 1;

                    if (/x\^3/.test(item)) {
                        // set major monomial
                        a = (item.split('x')[0] || 1);
                        a = normalizeNumber(a) * sign;
                    } else if (/x\^2/.test(item)) {
                        // set sub-major monomial
                        b = (item.split('x')[0] || 1);
                        b = normalizeNumber(b) * sign;
                    } else if (/x/.test(item)) {
                        // set minor monomial
                        c = (item.split('x')[0] || 1);
                        c = normalizeNumber(c) * sign;
                    } else {
                        // set radical
                        d = normalizeNumber(item) * sign;
                    }
                }
            });

            result = {a, b, c, d};
        } else if(type == 'exponential') {
            let a = 0, b = 0, c = 0;

            splitted.forEach((item, i) => {
                // only for non-operator symbols and non-empty strings
                if (item.trim().length > 0 && !delimeter.test(item)) {

                    // major monomial
                    if(/e\^\{?/g.test(item)){
                        // get a coeff sign
                        let sign_a = i > 0 && splitted[i - 1] === '-' ? -1 : 1;
                        a = (item.split('e')[0] || 1);
                        a = normalizeNumber(a) * sign_a;

                        // preparations
                        let raw_b = (item.split('e^')[1].split('x')[0].replace(/\{?/g, '') || 1);

                        // get b coeff sign
                        let sign_b = /\-/g.test(raw_b) === true ? -1 : 1;
                        b = typeof raw_b == 'string' ? raw_b.replace(/\-?/, '') : raw_b;
                        b = (normalizeNumber(b) || 1) * sign_b;

                    // radical
                    } else {
                        let sign = i > 0 && splitted[i - 1] === '-' ? -1 : 1;
                        c = normalizeNumber(item) * sign;
                    }
                }
            });

            result = {a, b, c}
        }

        return result;
    }
    

    /**
     * 
     * @param {string} type - type of function
     * @param {object} coeffs - coeffs object of function
     * @returns {object[]} - roots of functions, array may be empty
     */
    findRoots(type, coeffs){
        let roots = [];

        // linear function: ax + b = 0
        if(type == 'linear') {
            let y = 0;
            let x = (coeffs.b * -1) / coeffs.a;
            roots.push({x, y});

        // quadratic function: ax^2 + bx + c = 0
        } else if(type == 'quadratic') {
            const a = coeffs.a;
            const b = coeffs.b;
            const c = coeffs.c;

            // discriminant
            const discriminant = b**2 - 4 * a * c;

            if (discriminant > 0) {
                // Two real roots
                let x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
                let x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
                roots.push({x: x1, y: 0});
                roots.push({x: x2, y: 0});
            } else if (discriminant === 0) {
                // One real root
                let x = -b / (2 * a);
                roots.push({x, y: 0});
            } else {
                // Two complex roots
                let realPart = -b / (2 * a);
                let imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
                roots.push({x: realPart, y: imaginaryPart}); // root of the form x + iy
                roots.push({x: realPart, y: -imaginaryPart}); // root of the form x - iy
            }

        // Cubic function: ax^3 + bx^2 + cx + d = 0
        } else if(type == 'cubic') {
            const a = coeffs.a;
            const b = coeffs.b;
            const c = coeffs.c;
            const d = coeffs.d;

            // Reduction to canonical form: t^3 + pt + q = 0
            const p = (3 * a * c - b ** 2) / (3 * a ** 2);
            const q = (2 * b ** 3 - 9 * a * b * c + 27 * a ** 2 * d) / (27 * a ** 3);

            const discriminant = (q ** 2) / 4 + (p ** 3) / 27;

            if (discriminant > 0) {
                // One real root and two complex roots
                const u = Math.cbrt(-q / 2 + Math.sqrt(discriminant));
                const v = Math.cbrt(-q / 2 - Math.sqrt(discriminant));
                const x1 = u + v - b / (3 * a);
                roots.push({x: x1, y: 0});
            } else if (discriminant === 0) {
                // All roots are real and at least two of them are equal
                const u = Math.cbrt(-q / 2);
                const x1 = 2 * u - b / (3 * a);
                const x2 = -u - b / (3 * a);
                roots.push({x: x1, y: 0});
                roots.push({x: x2, y: 0});
            } else {
                // All three roots are real
                const r = Math.sqrt((p *-1) ** 3 / 27);
                const phi = Math.acos(-q / (2 * r));
                const x1 = 2 * Math.cbrt(r) * Math.cos(phi / 3) - b / (3 * a);
                const x2 = 2 * Math.cbrt(r) * Math.cos((phi + 2 * Math.PI) / 3) - b / (3 * a);
                const x3 = 2 * Math.cbrt(r) * Math.cos((phi + 4 * Math.PI) / 3) - b / (3 * a);
                roots.push({x: x1, y: 0});
                roots.push({x: x2, y: 0});
                roots.push({x: x3, y: 0});
            }

        // hyperbolic function: k/x = 0
        } else if(type == 'hyperbolic') {
            // no roots for hyperblic function :)
        } else if(type == 'exponential') {
            const {a, b, c} = coeffs;

            // Check if the exponential equation can have real solutions
            if (a !== 0 && -c / a > 0) {
                // Calculate the root using the natural logarithm
                let x = Math.log(-c / a) / b;
                roots.push({x: x, y: 0});
            } else {
                // No real roots possible
            }
        }

        return roots;
    }
}