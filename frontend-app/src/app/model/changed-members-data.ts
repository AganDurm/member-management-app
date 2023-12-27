export class ChangedMembersData {
    valueToUpdate: string;
    userId: number;

    constructor(valueToUpdate: string, userId: number) {
        this.valueToUpdate = valueToUpdate;
        this.userId = userId;
    }
}
