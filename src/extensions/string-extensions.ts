declare global {
    interface Array<T> {
        getNames(): string[];
    }
}

if (!Array.prototype.getNames)
    Array.prototype.getNames = function() {
        return this.map((field) => field.split("**")).map((arr) => arr[1]);
    }

export {};
