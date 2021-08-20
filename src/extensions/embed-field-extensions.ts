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
            .map((s) => (s.indexOf("Bench") === -1 ? s : s.substring(0, s.indexOf("Bench"))))
            .map((s) => (s.indexOf("Late") === -1 ? s : s.substring(0, s.indexOf("Late"))))
            .map((s) => (s.indexOf("Absence") === -1 ? s : s.substring(0, s.indexOf("Absence"))))
            .filter((s) => s.match(regEx));
    };

export {};
