export class Orders {
    id: number | null;
    name: string;
    kat1: number;
    kat2: number;
    kat3: number;
    kat4: number;
    kat4platinum: number;
    kat4hunderts: number;

    constructor(name: string, kat1: number, kat2: number, kat3: number, kat4: number, kat4platinum: number, kat4hunderts: number) {
        this.id = null;
        this.name = name;
        this.kat1 = kat1;
        this.kat2 = kat2;
        this.kat3 = kat3;
        this.kat4 = kat4;
        this.kat4platinum = kat4platinum;
        this.kat4hunderts = kat4hunderts;
    }
}
