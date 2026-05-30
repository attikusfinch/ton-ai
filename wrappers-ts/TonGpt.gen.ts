// AUTO-GENERATED, do not edit
// It's a TypeScript wrapper for a TonGpt contract in Tolk.
/* eslint-disable */

import * as c from '@ton/core';
import { beginCell, ContractProvider, Sender, SendMode } from '@ton/core';

// ————————————————————————————————————————————
//   predefined types and functions
//

type StoreCallback<T> = (obj: T, b: c.Builder) => void
type LoadCallback<T> = (s: c.Slice) => T

export type CellRef<T> = {
    ref: T
}

function makeCellFrom<T>(self: T, storeFn_T: StoreCallback<T>): c.Cell {
    let b = beginCell();
    storeFn_T(self, b);
    return b.endCell();
}

function loadAndCheckPrefix32(s: c.Slice, expected: number, structName: string): void {
    let prefix = s.loadUint(32);
    if (prefix !== expected) {
        throw new Error(`Incorrect prefix for '${structName}': expected 0x${expected.toString(16).padStart(8, '0')}, got 0x${prefix.toString(16).padStart(8, '0')}`);
    }
}

function lookupPrefix(s: c.Slice, expected: number, prefixLen: number): boolean {
    return s.remainingBits >= prefixLen && s.preloadUint(prefixLen) === expected;
}

function throwNonePrefixMatch(fieldPath: string): never {
    throw new Error(`Incorrect prefix for '${fieldPath}': none of variants matched`);
}

function storeCellRef<T>(cell: CellRef<T>, b: c.Builder, storeFn_T: StoreCallback<T>): void {
    let b_ref = c.beginCell();
    storeFn_T(cell.ref, b_ref);
    b.storeRef(b_ref.endCell());
}

function loadCellRef<T>(s: c.Slice, loadFn_T: LoadCallback<T>): CellRef<T> {
    let s_ref = s.loadRef().beginParse();
    return { ref: loadFn_T(s_ref) };
}

function storeTolkNullable<T>(v: T | null, b: c.Builder, storeFn_T: StoreCallback<T>): void {
    if (v === null) {
        b.storeUint(0, 1);
    } else {
        b.storeUint(1, 1);
        storeFn_T(v, b);
    }
}

function createDictionaryValue<V>(loadFn_V: LoadCallback<V>, storeFn_V: StoreCallback<V>): c.DictionaryValue<V> {
    return {
        serialize(self: V, b: c.Builder) {
            storeFn_V(self, b);
        },
        parse(s: c.Slice): V {
            const value = loadFn_V(s);
            s.endParse();
            return value;
        }
    }
}

// ————————————————————————————————————————————
//   parse get methods result from a TVM stack
//

class StackReader {
    constructor(private tuple: c.TupleItem[]) {
    }

    static fromGetMethod(expectedN: number, getMethodResult: { stack: c.TupleReader }): StackReader {
        let tuple = [] as c.TupleItem[];
        while (getMethodResult.stack.remaining) {
            tuple.push(getMethodResult.stack.pop());
        }
        if (tuple.length !== expectedN) {
            throw new Error(`expected ${expectedN} stack width, got ${tuple.length}`);
        }
        return new StackReader(tuple);
    }

    private popExpecting<ItemT>(itemType: string): ItemT {
        const item = this.tuple.shift();
        if (item?.type === itemType) {
            return item as ItemT;
        }
        throw new Error(`not '${itemType}' on a stack`);
    }

    private popCellLike(): c.Cell {
        const item = this.tuple.shift();
        if (item && (item.type === 'cell' || item.type === 'slice' || item.type === 'builder')) {
            return item.cell;
        }
        throw new Error(`not cell/slice on a stack`);
    }

    readBigInt(): bigint {
        return this.popExpecting<c.TupleItemInt>('int').value;
    }

    readBoolean(): boolean {
        return this.popExpecting<c.TupleItemInt>('int').value !== 0n;
    }

    readCell(): c.Cell {
        return this.popCellLike();
    }

    readSlice(): c.Slice {
        return this.popCellLike().beginParse();
    }
}

// ————————————————————————————————————————————
//   auto-generated serializers to/from cells
//

type coins = bigint

type int16 = bigint
type int32 = bigint

type uint8 = bigint
type uint16 = bigint
type uint32 = bigint

/**
 > struct TonGptVector {
 >     v0: int16
 >     v1: int16
 >     v2: int16
 >     v3: int16
 >     v4: int16
 >     v5: int16
 >     v6: int16
 >     v7: int16
 >     v8: int16
 >     v9: int16
 >     v10: int16
 >     v11: int16
 >     v12: int16
 >     v13: int16
 >     v14: int16
 >     v15: int16
 > }
 */
export interface TonGptVector {
    readonly $: 'TonGptVector'
    v0: int16
    v1: int16
    v2: int16
    v3: int16
    v4: int16
    v5: int16
    v6: int16
    v7: int16
    v8: int16
    v9: int16
    v10: int16
    v11: int16
    v12: int16
    v13: int16
    v14: int16
    v15: int16
}

export const TonGptVector = {
    create(args: {
        v0: int16
        v1: int16
        v2: int16
        v3: int16
        v4: int16
        v5: int16
        v6: int16
        v7: int16
        v8: int16
        v9: int16
        v10: int16
        v11: int16
        v12: int16
        v13: int16
        v14: int16
        v15: int16
    }): TonGptVector {
        return {
            $: 'TonGptVector',
            ...args
        }
    },
    fromSlice(s: c.Slice): TonGptVector {
        return {
            $: 'TonGptVector',
            v0: s.loadIntBig(16),
            v1: s.loadIntBig(16),
            v2: s.loadIntBig(16),
            v3: s.loadIntBig(16),
            v4: s.loadIntBig(16),
            v5: s.loadIntBig(16),
            v6: s.loadIntBig(16),
            v7: s.loadIntBig(16),
            v8: s.loadIntBig(16),
            v9: s.loadIntBig(16),
            v10: s.loadIntBig(16),
            v11: s.loadIntBig(16),
            v12: s.loadIntBig(16),
            v13: s.loadIntBig(16),
            v14: s.loadIntBig(16),
            v15: s.loadIntBig(16),
        }
    },
    store(self: TonGptVector, b: c.Builder): void {
        b.storeInt(self.v0, 16);
        b.storeInt(self.v1, 16);
        b.storeInt(self.v2, 16);
        b.storeInt(self.v3, 16);
        b.storeInt(self.v4, 16);
        b.storeInt(self.v5, 16);
        b.storeInt(self.v6, 16);
        b.storeInt(self.v7, 16);
        b.storeInt(self.v8, 16);
        b.storeInt(self.v9, 16);
        b.storeInt(self.v10, 16);
        b.storeInt(self.v11, 16);
        b.storeInt(self.v12, 16);
        b.storeInt(self.v13, 16);
        b.storeInt(self.v14, 16);
        b.storeInt(self.v15, 16);
    },
    toCell(self: TonGptVector): c.Cell {
        return makeCellFrom<TonGptVector>(self, TonGptVector.store);
    }
}

/**
 > struct TonGptHidden {
 >     h0: int16
 >     h1: int16
 >     h2: int16
 >     h3: int16
 >     h4: int16
 >     h5: int16
 >     h6: int16
 >     h7: int16
 >     h8: int16
 >     h9: int16
 >     h10: int16
 >     h11: int16
 >     h12: int16
 >     h13: int16
 >     h14: int16
 >     h15: int16
 > }
 */
export interface TonGptHidden {
    readonly $: 'TonGptHidden'
    h0: int16
    h1: int16
    h2: int16
    h3: int16
    h4: int16
    h5: int16
    h6: int16
    h7: int16
    h8: int16
    h9: int16
    h10: int16
    h11: int16
    h12: int16
    h13: int16
    h14: int16
    h15: int16
}

export const TonGptHidden = {
    create(args: {
        h0: int16
        h1: int16
        h2: int16
        h3: int16
        h4: int16
        h5: int16
        h6: int16
        h7: int16
        h8: int16
        h9: int16
        h10: int16
        h11: int16
        h12: int16
        h13: int16
        h14: int16
        h15: int16
    }): TonGptHidden {
        return {
            $: 'TonGptHidden',
            ...args
        }
    },
    fromSlice(s: c.Slice): TonGptHidden {
        return {
            $: 'TonGptHidden',
            h0: s.loadIntBig(16),
            h1: s.loadIntBig(16),
            h2: s.loadIntBig(16),
            h3: s.loadIntBig(16),
            h4: s.loadIntBig(16),
            h5: s.loadIntBig(16),
            h6: s.loadIntBig(16),
            h7: s.loadIntBig(16),
            h8: s.loadIntBig(16),
            h9: s.loadIntBig(16),
            h10: s.loadIntBig(16),
            h11: s.loadIntBig(16),
            h12: s.loadIntBig(16),
            h13: s.loadIntBig(16),
            h14: s.loadIntBig(16),
            h15: s.loadIntBig(16),
        }
    },
    store(self: TonGptHidden, b: c.Builder): void {
        b.storeInt(self.h0, 16);
        b.storeInt(self.h1, 16);
        b.storeInt(self.h2, 16);
        b.storeInt(self.h3, 16);
        b.storeInt(self.h4, 16);
        b.storeInt(self.h5, 16);
        b.storeInt(self.h6, 16);
        b.storeInt(self.h7, 16);
        b.storeInt(self.h8, 16);
        b.storeInt(self.h9, 16);
        b.storeInt(self.h10, 16);
        b.storeInt(self.h11, 16);
        b.storeInt(self.h12, 16);
        b.storeInt(self.h13, 16);
        b.storeInt(self.h14, 16);
        b.storeInt(self.h15, 16);
    },
    toCell(self: TonGptHidden): c.Cell {
        return makeCellFrom<TonGptHidden>(self, TonGptHidden.store);
    }
}

/**
 > struct TonGptHead {
 >     w0: int16
 >     w1: int16
 >     w2: int16
 >     w3: int16
 >     w4: int16
 >     w5: int16
 >     w6: int16
 >     w7: int16
 >     w8: int16
 >     w9: int16
 >     w10: int16
 >     w11: int16
 >     w12: int16
 >     w13: int16
 >     w14: int16
 >     w15: int16
 >     bias: int32
 > }
 */
export interface TonGptHead {
    readonly $: 'TonGptHead'
    w0: int16
    w1: int16
    w2: int16
    w3: int16
    w4: int16
    w5: int16
    w6: int16
    w7: int16
    w8: int16
    w9: int16
    w10: int16
    w11: int16
    w12: int16
    w13: int16
    w14: int16
    w15: int16
    bias: int32
}

export const TonGptHead = {
    create(args: {
        w0: int16
        w1: int16
        w2: int16
        w3: int16
        w4: int16
        w5: int16
        w6: int16
        w7: int16
        w8: int16
        w9: int16
        w10: int16
        w11: int16
        w12: int16
        w13: int16
        w14: int16
        w15: int16
        bias: int32
    }): TonGptHead {
        return {
            $: 'TonGptHead',
            ...args
        }
    },
    fromSlice(s: c.Slice): TonGptHead {
        return {
            $: 'TonGptHead',
            w0: s.loadIntBig(16),
            w1: s.loadIntBig(16),
            w2: s.loadIntBig(16),
            w3: s.loadIntBig(16),
            w4: s.loadIntBig(16),
            w5: s.loadIntBig(16),
            w6: s.loadIntBig(16),
            w7: s.loadIntBig(16),
            w8: s.loadIntBig(16),
            w9: s.loadIntBig(16),
            w10: s.loadIntBig(16),
            w11: s.loadIntBig(16),
            w12: s.loadIntBig(16),
            w13: s.loadIntBig(16),
            w14: s.loadIntBig(16),
            w15: s.loadIntBig(16),
            bias: s.loadIntBig(32),
        }
    },
    store(self: TonGptHead, b: c.Builder): void {
        b.storeInt(self.w0, 16);
        b.storeInt(self.w1, 16);
        b.storeInt(self.w2, 16);
        b.storeInt(self.w3, 16);
        b.storeInt(self.w4, 16);
        b.storeInt(self.w5, 16);
        b.storeInt(self.w6, 16);
        b.storeInt(self.w7, 16);
        b.storeInt(self.w8, 16);
        b.storeInt(self.w9, 16);
        b.storeInt(self.w10, 16);
        b.storeInt(self.w11, 16);
        b.storeInt(self.w12, 16);
        b.storeInt(self.w13, 16);
        b.storeInt(self.w14, 16);
        b.storeInt(self.w15, 16);
        b.storeInt(self.bias, 32);
    },
    toCell(self: TonGptHead): c.Cell {
        return makeCellFrom<TonGptHead>(self, TonGptHead.store);
    }
}

/**
 > struct TonGptPromptEmbeddings {
 >     byteEmbeddings: map<uint8, TonGptVector>
 >     positionEmbeddings: map<uint8, TonGptVector>
 >     pairEmbeddings: map<uint16, TonGptVector>
 > }
 */
export interface TonGptPromptEmbeddings {
    readonly $: 'TonGptPromptEmbeddings'
    byteEmbeddings: c.Dictionary<uint8, TonGptVector>
    positionEmbeddings: c.Dictionary<uint8, TonGptVector>
    pairEmbeddings: c.Dictionary<uint16, TonGptVector>
}

export const TonGptPromptEmbeddings = {
    create(args: {
        byteEmbeddings: c.Dictionary<uint8, TonGptVector>
        positionEmbeddings: c.Dictionary<uint8, TonGptVector>
        pairEmbeddings: c.Dictionary<uint16, TonGptVector>
    }): TonGptPromptEmbeddings {
        return {
            $: 'TonGptPromptEmbeddings',
            ...args
        }
    },
    fromSlice(s: c.Slice): TonGptPromptEmbeddings {
        return {
            $: 'TonGptPromptEmbeddings',
            byteEmbeddings: c.Dictionary.load<uint8, TonGptVector>(c.Dictionary.Keys.BigUint(8), createDictionaryValue<TonGptVector>(TonGptVector.fromSlice, TonGptVector.store), s),
            positionEmbeddings: c.Dictionary.load<uint8, TonGptVector>(c.Dictionary.Keys.BigUint(8), createDictionaryValue<TonGptVector>(TonGptVector.fromSlice, TonGptVector.store), s),
            pairEmbeddings: c.Dictionary.load<uint16, TonGptVector>(c.Dictionary.Keys.BigUint(16), createDictionaryValue<TonGptVector>(TonGptVector.fromSlice, TonGptVector.store), s),
        }
    },
    store(self: TonGptPromptEmbeddings, b: c.Builder): void {
        b.storeDict<uint8, TonGptVector>(self.byteEmbeddings, c.Dictionary.Keys.BigUint(8), createDictionaryValue<TonGptVector>(TonGptVector.fromSlice, TonGptVector.store));
        b.storeDict<uint8, TonGptVector>(self.positionEmbeddings, c.Dictionary.Keys.BigUint(8), createDictionaryValue<TonGptVector>(TonGptVector.fromSlice, TonGptVector.store));
        b.storeDict<uint16, TonGptVector>(self.pairEmbeddings, c.Dictionary.Keys.BigUint(16), createDictionaryValue<TonGptVector>(TonGptVector.fromSlice, TonGptVector.store));
    },
    toCell(self: TonGptPromptEmbeddings): c.Cell {
        return makeCellFrom<TonGptPromptEmbeddings>(self, TonGptPromptEmbeddings.store);
    }
}

/**
 > struct TonGptOutputWeights {
 >     tokenEmbeddings: map<uint16, TonGptVector>
 >     heads: map<uint16, TonGptHead>
 >     tokenBytes: map<uint16, cell>
 > }
 */
export interface TonGptOutputWeights {
    readonly $: 'TonGptOutputWeights'
    tokenEmbeddings: c.Dictionary<uint16, TonGptVector>
    heads: c.Dictionary<uint16, TonGptHead>
    tokenBytes: c.Dictionary<uint16, c.Cell>
}

export const TonGptOutputWeights = {
    create(args: {
        tokenEmbeddings: c.Dictionary<uint16, TonGptVector>
        heads: c.Dictionary<uint16, TonGptHead>
        tokenBytes: c.Dictionary<uint16, c.Cell>
    }): TonGptOutputWeights {
        return {
            $: 'TonGptOutputWeights',
            ...args
        }
    },
    fromSlice(s: c.Slice): TonGptOutputWeights {
        return {
            $: 'TonGptOutputWeights',
            tokenEmbeddings: c.Dictionary.load<uint16, TonGptVector>(c.Dictionary.Keys.BigUint(16), createDictionaryValue<TonGptVector>(TonGptVector.fromSlice, TonGptVector.store), s),
            heads: c.Dictionary.load<uint16, TonGptHead>(c.Dictionary.Keys.BigUint(16), createDictionaryValue<TonGptHead>(TonGptHead.fromSlice, TonGptHead.store), s),
            tokenBytes: c.Dictionary.load<uint16, c.Cell>(c.Dictionary.Keys.BigUint(16), c.Dictionary.Values.Cell(), s),
        }
    },
    store(self: TonGptOutputWeights, b: c.Builder): void {
        b.storeDict<uint16, TonGptVector>(self.tokenEmbeddings, c.Dictionary.Keys.BigUint(16), createDictionaryValue<TonGptVector>(TonGptVector.fromSlice, TonGptVector.store));
        b.storeDict<uint16, TonGptHead>(self.heads, c.Dictionary.Keys.BigUint(16), createDictionaryValue<TonGptHead>(TonGptHead.fromSlice, TonGptHead.store));
        b.storeDict<uint16, c.Cell>(self.tokenBytes, c.Dictionary.Keys.BigUint(16), c.Dictionary.Values.Cell());
    },
    toCell(self: TonGptOutputWeights): c.Cell {
        return makeCellFrom<TonGptOutputWeights>(self, TonGptOutputWeights.store);
    }
}

/**
 > struct TonGptModelStorage {
 >     prompt: Cell<TonGptPromptEmbeddings>
 >     output: Cell<TonGptOutputWeights>
 > }
 */
export interface TonGptModelStorage {
    readonly $: 'TonGptModelStorage'
    prompt: CellRef<TonGptPromptEmbeddings>
    output: CellRef<TonGptOutputWeights>
}

export const TonGptModelStorage = {
    create(args: {
        prompt: CellRef<TonGptPromptEmbeddings>
        output: CellRef<TonGptOutputWeights>
    }): TonGptModelStorage {
        return {
            $: 'TonGptModelStorage',
            ...args
        }
    },
    fromSlice(s: c.Slice): TonGptModelStorage {
        return {
            $: 'TonGptModelStorage',
            prompt: loadCellRef<TonGptPromptEmbeddings>(s, TonGptPromptEmbeddings.fromSlice),
            output: loadCellRef<TonGptOutputWeights>(s, TonGptOutputWeights.fromSlice),
        }
    },
    store(self: TonGptModelStorage, b: c.Builder): void {
        storeCellRef<TonGptPromptEmbeddings>(self.prompt, b, TonGptPromptEmbeddings.store);
        storeCellRef<TonGptOutputWeights>(self.output, b, TonGptOutputWeights.store);
    },
    toCell(self: TonGptModelStorage): c.Cell {
        return makeCellFrom<TonGptModelStorage>(self, TonGptModelStorage.store);
    }
}

/**
 > struct TonGptJob {
 >     user: address
 >     hidden: TonGptHidden
 >     generated: uint8
 >     replyBody: cell
 >     scanCursor: uint16
 >     bestToken: uint16
 >     bestScore: int32
 >     hasBest: bool
 > }
 */
export interface TonGptJob {
    readonly $: 'TonGptJob'
    user: c.Address
    hidden: TonGptHidden
    generated: uint8
    replyBody: c.Cell
    scanCursor: uint16
    bestToken: uint16
    bestScore: int32
    hasBest: boolean
}

export const TonGptJob = {
    create(args: {
        user: c.Address
        hidden: TonGptHidden
        generated: uint8
        replyBody: c.Cell
        scanCursor: uint16
        bestToken: uint16
        bestScore: int32
        hasBest: boolean
    }): TonGptJob {
        return {
            $: 'TonGptJob',
            ...args
        }
    },
    fromSlice(s: c.Slice): TonGptJob {
        return {
            $: 'TonGptJob',
            user: s.loadAddress(),
            hidden: TonGptHidden.fromSlice(s),
            generated: s.loadUintBig(8),
            replyBody: s.loadRef(),
            scanCursor: s.loadUintBig(16),
            bestToken: s.loadUintBig(16),
            bestScore: s.loadIntBig(32),
            hasBest: s.loadBoolean(),
        }
    },
    store(self: TonGptJob, b: c.Builder): void {
        b.storeAddress(self.user);
        TonGptHidden.store(self.hidden, b);
        b.storeUint(self.generated, 8);
        b.storeRef(self.replyBody);
        b.storeUint(self.scanCursor, 16);
        b.storeUint(self.bestToken, 16);
        b.storeInt(self.bestScore, 32);
        b.storeBit(self.hasBest);
    },
    toCell(self: TonGptJob): c.Cell {
        return makeCellFrom<TonGptJob>(self, TonGptJob.store);
    }
}

/**
 > struct TonGptStorage {
 >     owner: address
 >     nextJobId: uint32
 >     maxContext: uint8
 >     maxGenerate: uint8
 >     eosToken: uint16
 >     candidateCount: uint16
 >     model: Cell<TonGptModelStorage>
 >     jobs: map<uint32, TonGptJob>
 >     isPaused: bool
 > }
 */
export interface TonGptStorage {
    readonly $: 'TonGptStorage'
    owner: c.Address
    nextJobId: uint32
    maxContext: uint8
    maxGenerate: uint8
    eosToken: uint16
    candidateCount: uint16
    model: CellRef<TonGptModelStorage>
    jobs: c.Dictionary<uint32, TonGptJob>
    isPaused: boolean
}

export const TonGptStorage = {
    create(args: {
        owner: c.Address
        nextJobId: uint32
        maxContext: uint8
        maxGenerate: uint8
        eosToken: uint16
        candidateCount: uint16
        model: CellRef<TonGptModelStorage>
        jobs: c.Dictionary<uint32, TonGptJob>
        isPaused: boolean
    }): TonGptStorage {
        return {
            $: 'TonGptStorage',
            ...args
        }
    },
    fromSlice(s: c.Slice): TonGptStorage {
        return {
            $: 'TonGptStorage',
            owner: s.loadAddress(),
            nextJobId: s.loadUintBig(32),
            maxContext: s.loadUintBig(8),
            maxGenerate: s.loadUintBig(8),
            eosToken: s.loadUintBig(16),
            candidateCount: s.loadUintBig(16),
            model: loadCellRef<TonGptModelStorage>(s, TonGptModelStorage.fromSlice),
            jobs: c.Dictionary.load<uint32, TonGptJob>(c.Dictionary.Keys.BigUint(32), createDictionaryValue<TonGptJob>(TonGptJob.fromSlice, TonGptJob.store), s),
            isPaused: s.loadBoolean(),
        }
    },
    store(self: TonGptStorage, b: c.Builder): void {
        b.storeAddress(self.owner);
        b.storeUint(self.nextJobId, 32);
        b.storeUint(self.maxContext, 8);
        b.storeUint(self.maxGenerate, 8);
        b.storeUint(self.eosToken, 16);
        b.storeUint(self.candidateCount, 16);
        storeCellRef<TonGptModelStorage>(self.model, b, TonGptModelStorage.store);
        b.storeDict<uint32, TonGptJob>(self.jobs, c.Dictionary.Keys.BigUint(32), createDictionaryValue<TonGptJob>(TonGptJob.fromSlice, TonGptJob.store));
        b.storeBit(self.isPaused);
    },
    toCell(self: TonGptStorage): c.Cell {
        return makeCellFrom<TonGptStorage>(self, TonGptStorage.store);
    }
}

/**
 > struct TonGptConfig {
 >     owner: address
 >     nextJobId: uint32
 >     maxContext: uint8
 >     maxGenerate: uint8
 >     eosToken: uint16
 >     candidateCount: uint16
 >     isPaused: bool
 > }
 */
export interface TonGptConfig {
    readonly $: 'TonGptConfig'
    owner: c.Address
    nextJobId: uint32
    maxContext: uint8
    maxGenerate: uint8
    eosToken: uint16
    candidateCount: uint16
    isPaused: boolean
}

export const TonGptConfig = {
    create(args: {
        owner: c.Address
        nextJobId: uint32
        maxContext: uint8
        maxGenerate: uint8
        eosToken: uint16
        candidateCount: uint16
        isPaused: boolean
    }): TonGptConfig {
        return {
            $: 'TonGptConfig',
            ...args
        }
    },
    fromSlice(s: c.Slice): TonGptConfig {
        return {
            $: 'TonGptConfig',
            owner: s.loadAddress(),
            nextJobId: s.loadUintBig(32),
            maxContext: s.loadUintBig(8),
            maxGenerate: s.loadUintBig(8),
            eosToken: s.loadUintBig(16),
            candidateCount: s.loadUintBig(16),
            isPaused: s.loadBoolean(),
        }
    },
    store(self: TonGptConfig, b: c.Builder): void {
        b.storeAddress(self.owner);
        b.storeUint(self.nextJobId, 32);
        b.storeUint(self.maxContext, 8);
        b.storeUint(self.maxGenerate, 8);
        b.storeUint(self.eosToken, 16);
        b.storeUint(self.candidateCount, 16);
        b.storeBit(self.isPaused);
    },
    toCell(self: TonGptConfig): c.Cell {
        return makeCellFrom<TonGptConfig>(self, TonGptConfig.store);
    }
}

/**
 > struct (0x54475053) SetTonGptPaused {
 >     isPaused: bool
 > }
 */
export interface SetTonGptPaused {
    readonly $: 'SetTonGptPaused'
    isPaused: boolean
}

export const SetTonGptPaused = {
    PREFIX: 0x54475053,

    create(args: {
        isPaused: boolean
    }): SetTonGptPaused {
        return {
            $: 'SetTonGptPaused',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetTonGptPaused {
        loadAndCheckPrefix32(s, 0x54475053, 'SetTonGptPaused');
        return {
            $: 'SetTonGptPaused',
            isPaused: s.loadBoolean(),
        }
    },
    store(self: SetTonGptPaused, b: c.Builder): void {
        b.storeUint(0x54475053, 32);
        b.storeBit(self.isPaused);
    },
    toCell(self: SetTonGptPaused): c.Cell {
        return makeCellFrom<SetTonGptPaused>(self, SetTonGptPaused.store);
    }
}

/**
 > struct (0x54475744) WithdrawTonGpt {
 >     to: address
 >     amount: coins
 > }
 */
export interface WithdrawTonGpt {
    readonly $: 'WithdrawTonGpt'
    to: c.Address
    amount: coins
}

export const WithdrawTonGpt = {
    PREFIX: 0x54475744,

    create(args: {
        to: c.Address
        amount: coins
    }): WithdrawTonGpt {
        return {
            $: 'WithdrawTonGpt',
            ...args
        }
    },
    fromSlice(s: c.Slice): WithdrawTonGpt {
        loadAndCheckPrefix32(s, 0x54475744, 'WithdrawTonGpt');
        return {
            $: 'WithdrawTonGpt',
            to: s.loadAddress(),
            amount: s.loadCoins(),
        }
    },
    store(self: WithdrawTonGpt, b: c.Builder): void {
        b.storeUint(0x54475744, 32);
        b.storeAddress(self.to);
        b.storeCoins(self.amount);
    },
    toCell(self: WithdrawTonGpt): c.Cell {
        return makeCellFrom<WithdrawTonGpt>(self, WithdrawTonGpt.store);
    }
}

/**
 > struct (0x5447434e) ContinueTonGpt {
 >     jobId: uint32
 > }
 */
export interface ContinueTonGpt {
    readonly $: 'ContinueTonGpt'
    jobId: uint32
}

export const ContinueTonGpt = {
    PREFIX: 0x5447434e,

    create(args: {
        jobId: uint32
    }): ContinueTonGpt {
        return {
            $: 'ContinueTonGpt',
            ...args
        }
    },
    fromSlice(s: c.Slice): ContinueTonGpt {
        loadAndCheckPrefix32(s, 0x5447434e, 'ContinueTonGpt');
        return {
            $: 'ContinueTonGpt',
            jobId: s.loadUintBig(32),
        }
    },
    store(self: ContinueTonGpt, b: c.Builder): void {
        b.storeUint(0x5447434e, 32);
        b.storeUint(self.jobId, 32);
    },
    toCell(self: ContinueTonGpt): c.Cell {
        return makeCellFrom<ContinueTonGpt>(self, ContinueTonGpt.store);
    }
}

/**
 > struct (0x54475550) UploadTonGptPromptChunk {
 >     byteEmbeddings: map<uint8, TonGptVector>
 >     positionEmbeddings: map<uint8, TonGptVector>
 >     pairEmbeddings: map<uint16, TonGptVector>
 > }
 */
export interface UploadTonGptPromptChunk {
    readonly $: 'UploadTonGptPromptChunk'
    byteEmbeddings: c.Dictionary<uint8, TonGptVector>
    positionEmbeddings: c.Dictionary<uint8, TonGptVector>
    pairEmbeddings: c.Dictionary<uint16, TonGptVector>
}

export const UploadTonGptPromptChunk = {
    PREFIX: 0x54475550,

    create(args: {
        byteEmbeddings: c.Dictionary<uint8, TonGptVector>
        positionEmbeddings: c.Dictionary<uint8, TonGptVector>
        pairEmbeddings: c.Dictionary<uint16, TonGptVector>
    }): UploadTonGptPromptChunk {
        return {
            $: 'UploadTonGptPromptChunk',
            ...args
        }
    },
    fromSlice(s: c.Slice): UploadTonGptPromptChunk {
        loadAndCheckPrefix32(s, 0x54475550, 'UploadTonGptPromptChunk');
        return {
            $: 'UploadTonGptPromptChunk',
            byteEmbeddings: c.Dictionary.load<uint8, TonGptVector>(c.Dictionary.Keys.BigUint(8), createDictionaryValue<TonGptVector>(TonGptVector.fromSlice, TonGptVector.store), s),
            positionEmbeddings: c.Dictionary.load<uint8, TonGptVector>(c.Dictionary.Keys.BigUint(8), createDictionaryValue<TonGptVector>(TonGptVector.fromSlice, TonGptVector.store), s),
            pairEmbeddings: c.Dictionary.load<uint16, TonGptVector>(c.Dictionary.Keys.BigUint(16), createDictionaryValue<TonGptVector>(TonGptVector.fromSlice, TonGptVector.store), s),
        }
    },
    store(self: UploadTonGptPromptChunk, b: c.Builder): void {
        b.storeUint(0x54475550, 32);
        b.storeDict<uint8, TonGptVector>(self.byteEmbeddings, c.Dictionary.Keys.BigUint(8), createDictionaryValue<TonGptVector>(TonGptVector.fromSlice, TonGptVector.store));
        b.storeDict<uint8, TonGptVector>(self.positionEmbeddings, c.Dictionary.Keys.BigUint(8), createDictionaryValue<TonGptVector>(TonGptVector.fromSlice, TonGptVector.store));
        b.storeDict<uint16, TonGptVector>(self.pairEmbeddings, c.Dictionary.Keys.BigUint(16), createDictionaryValue<TonGptVector>(TonGptVector.fromSlice, TonGptVector.store));
    },
    toCell(self: UploadTonGptPromptChunk): c.Cell {
        return makeCellFrom<UploadTonGptPromptChunk>(self, UploadTonGptPromptChunk.store);
    }
}

/**
 > struct (0x5447554f) UploadTonGptOutputChunk {
 >     tokenEmbeddings: map<uint16, TonGptVector>
 >     heads: map<uint16, TonGptHead>
 >     tokenBytes: map<uint16, cell>
 > }
 */
export interface UploadTonGptOutputChunk {
    readonly $: 'UploadTonGptOutputChunk'
    tokenEmbeddings: c.Dictionary<uint16, TonGptVector>
    heads: c.Dictionary<uint16, TonGptHead>
    tokenBytes: c.Dictionary<uint16, c.Cell>
}

export const UploadTonGptOutputChunk = {
    PREFIX: 0x5447554f,

    create(args: {
        tokenEmbeddings: c.Dictionary<uint16, TonGptVector>
        heads: c.Dictionary<uint16, TonGptHead>
        tokenBytes: c.Dictionary<uint16, c.Cell>
    }): UploadTonGptOutputChunk {
        return {
            $: 'UploadTonGptOutputChunk',
            ...args
        }
    },
    fromSlice(s: c.Slice): UploadTonGptOutputChunk {
        loadAndCheckPrefix32(s, 0x5447554f, 'UploadTonGptOutputChunk');
        return {
            $: 'UploadTonGptOutputChunk',
            tokenEmbeddings: c.Dictionary.load<uint16, TonGptVector>(c.Dictionary.Keys.BigUint(16), createDictionaryValue<TonGptVector>(TonGptVector.fromSlice, TonGptVector.store), s),
            heads: c.Dictionary.load<uint16, TonGptHead>(c.Dictionary.Keys.BigUint(16), createDictionaryValue<TonGptHead>(TonGptHead.fromSlice, TonGptHead.store), s),
            tokenBytes: c.Dictionary.load<uint16, c.Cell>(c.Dictionary.Keys.BigUint(16), c.Dictionary.Values.Cell(), s),
        }
    },
    store(self: UploadTonGptOutputChunk, b: c.Builder): void {
        b.storeUint(0x5447554f, 32);
        b.storeDict<uint16, TonGptVector>(self.tokenEmbeddings, c.Dictionary.Keys.BigUint(16), createDictionaryValue<TonGptVector>(TonGptVector.fromSlice, TonGptVector.store));
        b.storeDict<uint16, TonGptHead>(self.heads, c.Dictionary.Keys.BigUint(16), createDictionaryValue<TonGptHead>(TonGptHead.fromSlice, TonGptHead.store));
        b.storeDict<uint16, c.Cell>(self.tokenBytes, c.Dictionary.Keys.BigUint(16), c.Dictionary.Values.Cell());
    },
    toCell(self: UploadTonGptOutputChunk): c.Cell {
        return makeCellFrom<UploadTonGptOutputChunk>(self, UploadTonGptOutputChunk.store);
    }
}

// ————————————————————————————————————————————
//    class TonGpt
//

interface ExtraSendOptions {
    bounce?: boolean                    // default: false
    sendMode?: SendMode                 // default: SendMode.PAY_GAS_SEPARATELY
    extraCurrencies?: c.ExtraCurrency   // default: empty dict
}

interface DeployedAddrOptions {
    workchain?: number                  // default: 0 (basechain)
    toShard?: { fixedPrefixLength: number; closeTo: c.Address }
    overrideContractCode?: c.Cell
}

function calculateDeployedAddress(code: c.Cell, data: c.Cell, options: DeployedAddrOptions): c.Address {
    const stateInitCell = beginCell().store(c.storeStateInit({
        code,
        data,
        splitDepth: options.toShard?.fixedPrefixLength,
        special: null,
        libraries: null,
    })).endCell();

    let addrHash = stateInitCell.hash();
    if (options.toShard) {
        const shardDepth = options.toShard.fixedPrefixLength;
        addrHash = beginCell()
            .storeBits(new c.BitString(options.toShard.closeTo.hash, 0, shardDepth))
            .storeBits(new c.BitString(stateInitCell.hash(), shardDepth, 256 - shardDepth))
            .endCell()
            .beginParse().loadBuffer(32);
    }

    return new c.Address(options.workchain ?? 0, addrHash);
}

export class TonGpt implements c.Contract {
    static CodeCell = c.Cell.fromBase64('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');

    static Errors = {
        'TonGptErrors.NotOwner': 300,
        'TonGptErrors.Paused': 301,
        'TonGptErrors.InvalidPrompt': 302,
        'TonGptErrors.InvalidMessage': 65534,
    }

    readonly address: c.Address
    readonly init: { code: c.Cell, data: c.Cell } | undefined

    protected constructor(address: c.Address, init?: { code: c.Cell, data: c.Cell }) {
        this.address = address;
        this.init = init;
    }

    static fromAddress(address: c.Address) {
        return new TonGpt(address);
    }

    static fromStorage(emptyStorage: {
        owner: c.Address
        nextJobId: uint32
        maxContext: uint8
        maxGenerate: uint8
        eosToken: uint16
        candidateCount: uint16
        model: CellRef<TonGptModelStorage>
        jobs: c.Dictionary<uint32, TonGptJob>
        isPaused: boolean
    }, deployedOptions?: DeployedAddrOptions) {
        const initialState = {
            code: deployedOptions?.overrideContractCode ?? TonGpt.CodeCell,
            data: TonGptStorage.toCell(TonGptStorage.create(emptyStorage)),
        };
        const address = calculateDeployedAddress(initialState.code, initialState.data, deployedOptions ?? {});
        return new TonGpt(address, initialState);
    }

    static createCellOfSetTonGptPaused(body: {
        isPaused: boolean
    }) {
        return SetTonGptPaused.toCell(SetTonGptPaused.create(body));
    }

    static createCellOfWithdrawTonGpt(body: {
        to: c.Address
        amount: coins
    }) {
        return WithdrawTonGpt.toCell(WithdrawTonGpt.create(body));
    }

    static createCellOfContinueTonGpt(body: {
        jobId: uint32
    }) {
        return ContinueTonGpt.toCell(ContinueTonGpt.create(body));
    }

    static createCellOfUploadTonGptPromptChunk(body: {
        byteEmbeddings: c.Dictionary<uint8, TonGptVector>
        positionEmbeddings: c.Dictionary<uint8, TonGptVector>
        pairEmbeddings: c.Dictionary<uint16, TonGptVector>
    }) {
        return UploadTonGptPromptChunk.toCell(UploadTonGptPromptChunk.create(body));
    }

    static createCellOfUploadTonGptOutputChunk(body: {
        tokenEmbeddings: c.Dictionary<uint16, TonGptVector>
        heads: c.Dictionary<uint16, TonGptHead>
        tokenBytes: c.Dictionary<uint16, c.Cell>
    }) {
        return UploadTonGptOutputChunk.toCell(UploadTonGptOutputChunk.create(body));
    }

    async sendDeploy(provider: ContractProvider, via: Sender, msgValue: coins, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: c.Cell.EMPTY,
            ...extraOptions
        });
    }

    async sendSetTonGptPaused(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        isPaused: boolean
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetTonGptPaused.toCell(SetTonGptPaused.create(body)),
            ...extraOptions
        });
    }

    async sendWithdrawTonGpt(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        to: c.Address
        amount: coins
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: WithdrawTonGpt.toCell(WithdrawTonGpt.create(body)),
            ...extraOptions
        });
    }

    async sendContinueTonGpt(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        jobId: uint32
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: ContinueTonGpt.toCell(ContinueTonGpt.create(body)),
            ...extraOptions
        });
    }

    async sendUploadTonGptPromptChunk(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        byteEmbeddings: c.Dictionary<uint8, TonGptVector>
        positionEmbeddings: c.Dictionary<uint8, TonGptVector>
        pairEmbeddings: c.Dictionary<uint16, TonGptVector>
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: UploadTonGptPromptChunk.toCell(UploadTonGptPromptChunk.create(body)),
            ...extraOptions
        });
    }

    async sendUploadTonGptOutputChunk(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        tokenEmbeddings: c.Dictionary<uint16, TonGptVector>
        heads: c.Dictionary<uint16, TonGptHead>
        tokenBytes: c.Dictionary<uint16, c.Cell>
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: UploadTonGptOutputChunk.toCell(UploadTonGptOutputChunk.create(body)),
            ...extraOptions
        });
    }

    async getConfig(provider: ContractProvider): Promise<TonGptConfig> {
        const r = StackReader.fromGetMethod(7, await provider.get('config', []));
        return ({
            $: 'TonGptConfig',
            owner: r.readSlice().loadAddress(),
            nextJobId: r.readBigInt(),
            maxContext: r.readBigInt(),
            maxGenerate: r.readBigInt(),
            eosToken: r.readBigInt(),
            candidateCount: r.readBigInt(),
            isPaused: r.readBoolean(),
        });
    }

    async getGenerate(provider: ContractProvider, body: c.Cell): Promise<c.Cell> {
        const r = StackReader.fromGetMethod(1, await provider.get('generate', [
            { type: 'cell', cell: body },
        ]));
        return r.readCell();
    }
}
