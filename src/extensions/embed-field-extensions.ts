declare global {
    interface Array<T> {
        filterValueByRegEx(regEx: RegExp): string[];
    }
}

if (!Array.prototype.filterValueByRegEx)
    Array.prototype.filterValueByRegEx = function (regEx: RegExp) {
        return this.map((field) => field.value)
            .join()
            .split(/\r?\n/)
            .filter((s) => s.match(regEx));
    };

export {};
