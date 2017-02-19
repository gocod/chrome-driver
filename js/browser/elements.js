"use strict";
const base_1 = require("./base");
class Elements extends base_1.Base {
    async element(selector, parent) {
        const using = 'css selector';
        let el;
        if (parent && typeof selector === 'string') {
            let parentElement = typeof parent === 'string' ? await this.webdriver.findElement({ using, value: parent }) : parent;
            el = await this.webdriver.findChildElement({ using, value: selector, id: parentElement.ELEMENT });
            el.using = [using, typeof parent === 'string' ? using : parent.using];
            el.value = [selector, typeof parent === 'string' ? parent : parent.value];
        }
        else if (typeof selector === 'string') {
            el = await this.webdriver.findElement({ using, value: selector });
            el.using = using;
            el.value = selector;
        }
        else if (!selector) {
            return this.webdriver.getActiveElement();
        }
        return el || selector;
    }
    async elements(selector, parent) {
        const using = 'css selector';
        let els;
        if (parent && typeof selector === 'string') {
            let parentElement = typeof parent === 'string' ? await this.webdriver.findElement({ using, value: parent }) : parent;
            els = await this.webdriver.findChildElements({ using, value: selector, id: parentElement.ELEMENT });
            els.forEach((el, i) => {
                el.index = i;
                el.using = [using, typeof parent === 'string' ? using : parent.using];
                el.value = [selector, typeof parent === 'string' ? parent : parent.value];
            });
        }
        else if (typeof selector === 'string') {
            els = await this.webdriver.findElements({ using, value: selector });
            els.forEach((el, i) => {
                el.index = i;
                el.using = using;
                el.value = selector;
            });
        }
        return els || (Array.isArray(selector) ? selector : [selector]);
    }
    async elementId(selector) {
        return (await this._.element(selector)).ELEMENT;
    }
}
exports.Elements = Elements;
