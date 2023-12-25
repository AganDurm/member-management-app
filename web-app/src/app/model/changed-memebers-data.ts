export class ChangedMemebersData {
    valueToUpdate: string;
    userId: string;

    constructor(valueToUpdate: string, userId: string) {
        this.valueToUpdate = valueToUpdate;
        this.userId = userId;
    }
}