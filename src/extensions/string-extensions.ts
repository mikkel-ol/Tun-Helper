import { ClassColorPair } from "../types/ClassColorPair";
import RoleMapping from "../types/RoleMapping";

declare global {
    interface Array<T> {
        getNames(): string[];
        getNamesAndColors(): ClassColorPair[];
    }
}

if (!Array.prototype.getNames)
    Array.prototype.getNames = function () {
        return this.map((field) => field.split("**")).map((arr) => arr[1]);
    };

if (!Array.prototype.getNamesAndColors)
    Array.prototype.getNamesAndColors = function () {
        return this.map((field) => field.split("**")).map(
            (arr: string[]) => ({ color: RoleMapping.get(arr[0].split(":")[1]), name: arr[1] } as ClassColorPair)
        );
    };

export {};
