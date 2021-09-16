import { Message } from "discord.js";

export class DateService {
    /** https://expertcodeblog.wordpress.com/2018/03/12/typescript-how-to-compare-two-dates/
     * Compares two Date objects and returns e number value that represents
     * the result:
     * 0 if the two dates are equal.
     * 1 if the first date is greater than second.
     * -1 if the first date is less than second.
     * @param date1 First date object to compare.
     * @param date2 Second date object to compare.
     */
    static compareDates(date1: Date, date2: Date): number {
        // With Date object we can compare dates them using the >, <, <= or >=.
        // The ==, !=, ===, and !== operators require to use date.getTime(),
        // so we need to create a new instance of Date with 'new Date()'
        let d1 = new Date(date1);
        let d2 = new Date(date2);

        // Check if the dates are equal
        let same = d1.getTime() === d2.getTime();
        if (same) return 0;

        // Check if the first is greater than second
        if (d1 > d2) return 1;

        // Check if the first is less than second
        if (d1 < d2) return -1;
        else return 1;
    }

    static getDateFromMessage(msg: Message, asObject?: boolean): string {
        return msg.embeds[0].fields[0].value.split("[")[1].split("]")[0];
    }

    static getDateFromMessageAsObject(msg: Message): Date {
        return new Date(Number(msg.embeds[0].fields[0].value.split(":")[6]) * 1000);
    }
}
