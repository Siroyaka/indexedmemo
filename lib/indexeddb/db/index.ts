import Dexie, { Table } from 'dexie';

export interface MemoData {
    id?: number,
    title: string,
    text: string
}

export class MemoDB extends Dexie {
    memo!: Table<MemoData>;

    constructor() {
        super('memoDB');
        this.version(1).stores({
            memo: '++id, title, text'
        })
    }
}

export const db = new MemoDB();