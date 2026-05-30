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
    static CodeCell = c.Cell.fromBase64('te6ccgICAUUAAQAAmcgAAAEU/wD0pBP0vPLICwABAgFiAAIAAwICzAAhACICA3pgAAQABQA1rTb2omh9JGmP6YPpg+mH6hj6AOuFAECAegDAAa+vevaiaH0kaY/pg+mD6YfqegJrhQAEaAKII4gbKiOYE6oJEIX4AmRnyAAAAAEIiehqGOpo6HoCegJ6Ami4P82QqwvcyZBhgEi4cUV0D6+HtjjJ58J/b+TAAAYB/nAgcFRBE4EApYEAnoH/QoEA9IH+6IH+9IH/KIH/F4H++IH+6YBdgf7RgCGB/zyB/vuBAKGBa09WKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsABwH+ChERCgkREAkQjxB+VWYQVhBFEDQQI/ACcQOB/xiBAJuBATuAD4CLgf8ngDeB/xyBAKyB/wKBAViAdYH+oYH/bIDxgQCiggd5tVYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKQAIAf4RFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AJyA4H+q4Bsgf39gf9Qgf9mgwiBAUiBAWaAeoEAnICNdIEA2YH/XoEBAoEBDoH20lYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpAAkB/hEUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AJzA4H+qYEClIEAqoEApHiBAOiAtoCzgQC/gQCDgQDCgQDYgf52gf9RgI6AcoHDqlYpERRWKREUVikRFFYpERRWKREUVikACgH+ERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AJ0A4Brgf9ggQCZgEOAPoEAvIBsgf6DgOWB/2uB/kaBAVOA54AcgQEVgHiBD3dWKREUVikRFAALAfxWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACdYEBnoEBrIAhgf9UgQFvgQCbgQDsgQDQgQEcgQDYgQGbgQJugFUADAH+gD6BANcmERARExEQgSAYVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACdgOBAMKB/u6BASuARoEAggANAf6BAMCAlYH/AoEBAoH+XYAZgOyB/lqBAMmBAUqB/o+B8ANWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAjAA4B+PACdwOAJ3GA24EA0YBDgJaB/yCB/zqAaIH/HoEBwICagf4bgQD0gf8rgQCPggdtJ1YpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoADwH8CREQCRCPEH5VZhBWEEUQNBAj8AJ4gOyBAR6BAMmAkoH/GoEBGoEBsYBUJBCcgQCkgQDMgf8CgQEngNKBAhWBAI6B3kFWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpABAB/hEUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACeQOB/wuBAQ+BAP6B/vmBAOOB/ySA9IH/HYEA+oEAnoH/PIH+I4BPgQGLgf7QgQC6gfQ+VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikAEQH8ERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAnoDgQDAgCGB/2eAooH/boCtgQDzgQFCgQDVgO2B/2iBAdqB/yiA8IEAuIEBE4Gtv1YpERRWKREUVikRFFYpERRWKREUABIB/lYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKACwOAF4H9y4H/V4EA8YEA1YEAvoEA+4EAqoBEgFGBApeAlIH+8IEBt4EB+oH/MoIHJ3UAEwH+VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgAwDgGWB/cKAh4H/d4EBCoH/eYH+wYEBVIEBbIH/IgAUAf6BARKAzYDcgHiA6YH984EqYVYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoANgf6CgQFAgf9ygQDUABUB/oEBZ4H/dIH/KIBKgQCMgD2AeYH/G4EBRYC8gf9IJxEQERMREIGYA1YpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYAFgH4EEUQNBAj8AKADgOBAMCB/yiAnoEA54H/P4EAjYC2gIyBAUmBASiBAVqAzoECyYBdgEKBASKBVwhWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAAXAfwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgA+B/N2B/xeB/2aBAIGAd4BHgf8kgQGvgQCPgIohEL6BAQ2A6YEAzIH++YC6gbvZVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikAGAH+ERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoAQA4BGgQDHgQDlgDmBAQOBAiOB/3KBARyA7oEA/YEAzoH+tIEB/oEBFIEBdIH+joGHn1YpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKQAZAf4RFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAEQOAWIDMgHyAT4H+2YH+8oEA3IC5gQGJgO6BAJSB/g6BAYWAYIH/Q4H+oIH1RFYpERRWKREUVikRFFYpABoB/BEUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAEgOB/kaBAJGBAUeB/tSAOYH/K4EByYH+/YEAj4H/QoCkgQHjgQCXgIqA6QAbAf6AgYHbsFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoATA4EA+oBOgQC6gMuBAkmAeYDrgf79gQEZABwB/IH/OYAvgQHRgQHXdIEA/oCeggDVmFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoAUA4EAqYH/LgAdAfyB/wyB/1+Ad4EAtYAigf9LgweBAOGB/imB/n+BAUCBAXB4gQDdgbnOVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYAHgH8EFYQRRA0ECPwAoAVA4Dbgf6UgQEEgQCLgOmBAkCAOYH/TIEAkICWgQC+gCKAXoECAoEBYoEBeYG7YVYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMAB8B/AsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAFgOB/1aApoDFgQC6gK6B/uyB/vWAnYEA6ICRgf8Zgf5Agf8ngGeAyoEAgYIHeaFWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKQAgAf4RFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+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fIALgf9xgf6Cgf8Ugf87gGAiEIt/gPWBAIKBARKBAPWB/0WATIH/QoGPzVYpERRWKREUVikRFFYpERRWKQBHAfwRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAGQOAZIH+J4H/EoH/F4H/AYH/SYEBwoBagQEZgQC4gf8YgQCOgQC8gKWBAdSB/ygASAH+ggd+7VYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoAaA4H/fYEA/YEBjoEA+IA3gFGAD4DhgImA6wBJAfyB/wuBAdiBAWqA24EAgoH+foIHfItWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAGwOB/wGBAUQASgH+gf7tgLuB/xqA0IEBV3GBAI2B/vqAEYBwgf7qgf84gDaAuIHRCVYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRQBLAfoQNBAj8AKAHAOAb4EBB4EAr4BJgMyAKIH+4YCWgQFEgHeArIEAg4EBS4EB5IH+LoH/BYGGA1YpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwBMAfwKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAHYH+lICNgQCWgCWBAnuAe3mB/2WAs4EBAYEB4IECYoH/FiaB/08rERARExEQggdC2VYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQATQH8VikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAHoBpgQCrgf8KgLSBAR2AHYEBzIH/AYEArIBLgQJEgf8ngPApDhERDoH/UYH+14HU9lYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUAE4B/lYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAHwOB/syA54H/IIH+Z4H+4IH/NIAZgQEHgBCBAa2B/zeBAMB5gf9GgQF3gGCCB39JVikRFFYpERRWKREUVikATwH+ERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoAgA4EBP4H/RoApgJyB/rWBAJGB/1SBAQOB/v+BAZuAfYH+34BKgOqBASuAxwBQAf6B+utWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAIQOB/b6B/0+BAPSAIoH/KYC6gQDfgQCigH5yAFEB+oDMgf9jgQD4gISBANGB/tKB9RdWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAIgOAU4EAzIBfAFIB/IH/aICIgLeBAO+AUIDngf66gQGDgf4Rgf9dgQCngQCpgf6agcTDVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVgBTAfoQRRA0ECPwAoAjA4CvgKiB/1GAP4EAyoECVYH+pIEBdIEAwICZgf87gQDBgf8bgQD+gCqB/iSBiilWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDABUAfwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgCQDgQEngQCRgQD2gf6+gAyAeYB2gJ6AToH+/YEC5IDUgGiA+IH+GIBaggdjo1YpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQAVQH+VikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAJQOBAM2B/uKB/1qAUIH/fYEBUYH+94H/FoAwgQDUgOCBARWB/3uBATOBAYyB/tKBwdhWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFABWAf5WKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgCYDgf8bgf8egf77gQCKgBaA+IDcgO6AwoBsgf9Rgf8JgQErgJ6B/raB/i2BpxNWKREUVikRFFYpERRWKREUAFcB/lYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgCcDgf5dgIqBALOA64H/IIEA5YAZgDiAxIDRgf9/gQDQgf7Igf9Qgf92gIyBKQ8AWAH8VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgCgDgf7wgf40gDuB/nSBALmAjIDngQEVgQDzgQFQAFkB/oEAiIBIgf7Tgf8Pgf4qgQCjgewHVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgCmB/oGB/tyBAUcAWgH+IRBHgQEagIGBAN+B/2CAboH/J4H/PYEBeoH+OoEBBoEBq4EAtoIHBfpWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZgBbAfgQVhBFEDQQI/ACgCoDgf4Vgf4HgIKBAO2BAPWBAK6A1oAZgPqBAWaB/wKBAJCBAI6B/xeBAPGB/tuBqatWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUAFwB/AwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgCsDgf9Xgf92gQJCgf7jgQGIgf7fgQEOgf9qgGWB/ymBAVaB/02B/tSB/zCBAZOB/v6CB0p4VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFABdAfxWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoAsA4H/b4EAq4EA1oDGhQeB/sV7gf97gPGA7oH+qYH+uYEBgoDIgDuAUIIHL6xWKREUVikRFFYpERRWKREUVikRFFYpERQAXgH+VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgC0DgER1gJ6A84BkgQHneYH/e4DkgHKBANaB/l+BAbuB/1OB/tmB/qiCB3aUVikRFFYpERRWKQBfAfwRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoAuA4H/VoEBc4EBQYDYgf7WgFWB/0eDB4EBe4H/ZYD2gf8UgBOB/y4AYAH6gPeAFIFEV1YpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoAvA4H/HoH/RYH/boEA8oEBF4DSgDgAYQH8gQHngQGggQEQgf8Mgf9ogQF7gQCVgf6LgQDBga8VVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACAGIB+oAwA4H9RoEA2oEAwIH+QoCygG6B/w+BAieAeYBKgf7hgf7agQDDgQEjgOKBAOSBJWZWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKAGMB/gkREAkQjxB+VWYQVhBFEDQQI/ACgDEDgf2IgQDkgQDegKNwgQEGgf7TgQFRgMiBAQKBAk2B/vKB/vCAJ4EAq4EAvoGzwFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikAZAH+ERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAMgOB/3yAv4H+/oCCgQDBgf8ugf9PgQCygQEXgQFBgf4/gCeB/umBAbuBASKBAPOB4KJWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKQBlAf4RFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgDMDgf9pgQFLgf7zgJ6AQIDGgKuAf4CHgGeBAVmB/qCBAceBAUyB/1SB/siBJqdWKREUVikRFFYpERRWKREUVikRFFYpAGYB/hEUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgDSB/1mA4YH/W4H9uYH/BoEBLYBvIBCLgQCWgf7TgD+AeoH+r3iBAe6BAPGBgbZWKREUVikAZwH8ERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgDUDgKmBAjKBAg+BAUOB/y+B/0uBAIuBAQaBAftwgf9SgQGUAGgB/oEA3YEBeYBngCKBymhWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKANgOB/W+B/omBAYqB/WuB/1kAaQH+gQEvgQFNgf9PgQDmgf8/gQEigQCdgf69cYAzgGeCBxvtVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQIwBqAfzwAoA3A4H/SIAbgf80gf7cgNiAFYH/cYH+24H/YIH/RYH+0YEAvYB6gCGB/sSAfoHKRFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoAawH8CREQCRCPEH5VZhBWEEUQNBAj8AKAOAOBAUuAMIEBJICOgIWBASiA54BWgCSAroH/aIEBLoH/GoDmgf7zgf9Fgb21VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUAGwB/FYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoA5gf5Hgf8hgQCsgCSBAImB/wiB/z+BAOuAY4CrIxC+gQCGgQC7gf9ugf34gf60gYC6VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFABtAfxWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoA6A4EAzIDzgf9kgDeAtIH+/4A+gQCXgKGAh4EAqoEB0YEBe4AMgCaBAM2BBKJWKREUVikRFFYpERRWKREUVikRFFYpERQAbgH8VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgDsDgN+AN4EBIoEBeIECCIEBEoAkgQDNgQCxgQEHgf8Sgf6NgQG+gf9ygQCzgIOBCLdWKREUAG8B/FYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgDwDgf6ZgQDNgPKAJYAvgQHNgQG3gQD5fYEBw4H/GYEBhABwAfyBAUt2gQJCgE+CB3N4VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgD2B/gWB/0GBAIiAHYEBpCAAcQH+EGmAt4EBb4C4gGeAy4CtgQI1gf8FgQGzgCaBxnpWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAPgByAf4Dgf3NgECB/v+Aj4EBPIH/WIEBGYCTgC6B/wyAzIH+/oAWgCmBAYCB/qSBMBJWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPAHMB/BB+VWYQVhBFEDQQI/ACgD8Dgf9ggQD1gQCWgQDJgf7qgf8LgMyBAN+Ah4B6gQHOgCeB/smAPYH+0oCTgckFVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAB0AfwMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBAgf6zgf9ugQJBgf7Ogf7WgIMiEHqA6oEAt4EBYIECB4AQgf20gQEKgf6agDaCBym4VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQAdQH+VikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBBA4Aegf6Ggf9/gf8egQCugf9Ngf8lgQHTgHuBAIqB/ueAIoEAp4H/EIBFgICBO6NWKREUVikRFFYpERRWKREUVikRFFYpERRWKQB2Af4RFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgEIDgLGBAWWA4oCGgf7HgNWA+oEAs4AzgQC2gQC/gf5Zgf7QgCOB/w+BAOiB9ixWKREUVikRFFYpAHcB/BEUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgEMDd4EBrIH/cYA2gD6AoYH+vYEBKIEBM4CzgQIxgFWBALGAboEBXgB4Af6BAIiBp29WKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKARAOBAPuBARyBARuB/x2BAdmB/3mAVIDqAHkB/IH/UoEAoIDIgf8Rgf8mgB2A+YH+v4H8QFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBFA4H+pAB6AfyB/qyB/0qAEYCWgIWBAKyB/z6BAOKBALiAXoH+ZIH+bYEApIH+/oH9koE8gFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8AewH8EH5VZhBWEEUQNBAj8AKARgOAbYEAtIEBNIH+m4ECI4EA4IH/RoEBK4EAtoEBMYH+O4H9xYBUgQDXgf6wgOeCBxEEVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUAHwB/lYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBHA4H+Q4H+i4EAjIAUgBaBAaWBARKB/b6BAJV2gQC0gO2Ai4BBgQIWgf5cgaYUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQAfQH+VikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBIA4AzgQC+gI2B/cOBAPCBANqB/wmBAa2A0oAogQCbgf4tgQDrgLSAOoAngbTBVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAB+Af5WKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBJA4EAlIEA64H/DYEA6oEA9HqBAW6AgICqgQETgE6BAUyAvIEBJYAMgQDtge5AVikRFFYpERRWKREUAH8B/lYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBKA4CXgHmAqoH+noEA4oH/f4EAiIEBtIBegPGBAKWB/zOB/2SB/sKBAI8AgAH+gQGPgSAuVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgEsDgEyBAI6AUoH+LoH/OoEApIH/W4H/RwCBAfyA0oH/OYH/IIEA4YC0d4EBpoH+R4IHQTdWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKATAOBALUAggH+gQEFgf9KgQD5gQCPgQGOgOiBAYKAdIH/eoEAmIH/WIH/XoDggFqAKIH+YlYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QfgCDAfxVZhBWEEUQNBAj8AKATQOB/WKBANCB/ruBAJ+BAaSB/nqAIoEBnoEAy4EBLIH/X4EAoYH/RoC/gIqB/xGCAIQNVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikAhAH+ERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBOA4H+pIH/GoH/eIDGgf8xgCOBARuAfYDmgf9agCmB/lCB/yiAKIDQgQEpgUanVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKQCFAf4RFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBPgf9KgOyBAQqEB4EAuoH+wYDtgf81gf9igf9afiQQz4H+64H/S4EAnoH/DYIHaCtWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUAIYB/FYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgFADgf43gQDIgQFKgQCZgf9sgQCngQCLgQDTgf9/gQDOgQD9gf6SgQC2gQCogf8dgf6MgeT4VikRFACHAf5WKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBRgE+B/0CBAaSB/xGAs4EBpYBDgQEVgf87gQGtgQE7gf6UAIgB/oMIgQGqKQ8REg+B/2iBqDZWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAUgOB/zOBASqBAS6B/1IAiQH+gDeAv4H+ooH/YIC7gO+BAWuB/0uB/2KB/3aB/x2B/pyBu/9WKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNACKAfgQI/ACgFMDgf45gJuAYoH+poDvgf8Ngf9XgJmAOYAZgf9Tgf9JgQIJgQCQgf8Xgf7wgfNiVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILAIsB/goREQoJERAJEI8QflVmEFYQRRA0ECPwAoBUA4CRgf8agQDcgBeB/0SBAX2B/zCBAU+B/0iBAL6BAZCBAPuBAMiAaYH/aoH+jYHZxVYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQAjAH+VikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAVQOB/3KB/x2B/0yAwIDegQExgf8CgHOATIEAqYH+eoEBCoDXgQEpgf78gQENgZ95VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKQCNAf4RFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBWA4H+LHCBAMyAQYEBNoARgQGqgf9lgJ2AaoH+mIEBI4H/YIH/eYEBh4H/aoIHTF1WKREUVikRFFYpERRWKREUAI4B/FYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgFeAd4H9ZoEAu4H9XoBKgEGBASSBAKciEJyB/rqBAcmBAgyAEIEBFYEA1YEA7QCPAfqCBw57VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgFgDgDiB/x+BAUmB/xyBAjSAI4H9z4EAugCQAfyBAI6B/3OALIH+KIH/F4EA8oECBIH/S4IHYJZWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAWQMAkQH4gG2BAI+BAKGB/fSBAQeAW4H/e4EBAoC5gQCjgQFwgf9dgf7bgQFVgQG1gQEwgSFmVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgCSAfwJERAJEI8QflVmEFYQRRA0ECPwAoBaA4EAlIEA44EBaoEAmIEAm4EAmYB9gf8bgQEagf7LgKKB/y+AK4EAyoEBoIH+poIHXfRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikAkwH+ERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgFsDgBmBAZqA0IA8gBqBARKA1IBLgKeAzYH/AoEB6IDugf6wgQFggQCGgfa7VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFACUAf5WKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBcgFCBANCBAbiAGoEBXYH/JoAygQEFgEuBAMOBANIpEM+BANaB/0uBAeuB/daB5ohWKREUVikRFFYpERRWKREUVikRFFYpAJUB/BEUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgF0DgOpxgB+B/xiB/1qBAYeB/1WAz4EBFIBRgD2B/gmBAZWApYH+hIEArIHRkFYpERRWKQCWAf4RFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAXgOB/1KB/iOAcoBagLiB/qiBAQKBAO6BAOWAWYH+OIH+XYCXAJcB/IEBRIEA+oH+84IHc5dWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAXwOAFICxgf9OgEOAEIEA0ACYAfyBAI2AJYBigKKA8oH+KYEAwoH/N4ECAYH+EoIHSXJWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AIAmQH4gGADgQCqgByBAIiB/zaBAcyAIIH+n4EAhIH+d4EBa4CmgQGkgf8wgweArYCfgbAHVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgCaAf4JERAJEI8QflVmEFYQRRA0ECPwAoBhA4H/VYH9qIH/H4H/cIAhgQG3gQCsgf7tgL2AlIH/eIEAnYEAo4EAn4CRgf57ggdG2FYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUAJsB/FYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAYgOB/zSB/3yB/lCB/p+AaIH/M4EAj4EA7IEB5YEAwIH/WYH91oDMgf8Lgf7dgf6NgRH1VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKQCcAfwRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBjA4A4gf8agFOAw3SB/1yB/yCAZYCWgJSAG4H/BoEB6IH/VIBCgf6LgZyQVikRFFYpERRWKREUVikRFFYpERQAnQH+VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBkA4H+0YEBUIEBkoEAm4H/bIEBm4DlgIeAz3WBAQGA+oH/e4EBlYCkgf5pgQNNVikRFACeAf5WKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBlA4H9QoEBYIEBeoBDc4H++4H/DYEAzoEA54EA64DZgf89AJ8B/oH/SoBjgMyAYYG+glYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBmA4BLgQFfgCWBAISB/0yBAMcAoAH8gC+BALiAU4ECFIEBh4H/KoEAlIH/MoH/JYBZgbUlVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACAKEB+oBngf6Jgf7Tgf7Lgf6FgFeBAWOBAMeBAMWBATqAeoAngQF9gPmB/1+B/jErERARExEQgblkVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILAKIB/goREQoJERAJEI8QflVmEFYQRRA0ECPwAoBoA4Azgf7MgBKB/yeAZoCBgQEGgLOA5oH/TICRgf8NgBaB/2uB/oyB/e+CB2qoVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQAowH8VikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBpA4H/Q4H+aIH/TIH/IIH+2YH/LIEBTIEArX2B/xqB/tWBALKB/uaAfoH/dniCB0JyVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUAKQB/lYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBqA4EBxoH+k4MHgf2sgCmBAIiBAMCAFIH/CIEA2IEA0oEBAoEAlYEA6IH/Q4H+5YH8g1YpERRWKREUVikRFFYpERQApQH6VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAawOBAOKAJYEBAYH+1IBqgf8WgI6B/uWBAm2AGYEBf4Dmgf8ugQC9gf68gE4ApgH8ggdzz1YpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBsgf9ZgOmBAT0gEEeAWIEBFIEBVoDDgQGAAKcB+oH+8oDPgQC5gf4KgLKAGYEAjoHsM1YpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBtA4BmgQDUAKgB/oH/B4H/XIEBCoEBboH/PYEAxIEBeoDYgHyBAK6BAUeB/zyB/jJxgawAVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYAqQH8EFYQRRA0ECPwAoBuA4UHgQCRgf8JgKN/gf88gFuB/xSB/zaA4YEBFnSB/teALYDigQDQge6cVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILAKoB/goREQoJERAJEI8QflVmEFYQRRA0ECPwAoBvA4EAoYDDgIGB/vSBAWKB/kmB/1KA14H/e4DEgOiAWoBqgQDbgf7xgf5ggcFRVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQAqwH+VikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBwA4H+vIH+qXCBAMqAzoEAqYCcgQCHgf8ygf9GgQDvgCOBALh/gQDLgQEJgcLuVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFACsAf5WKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoBxA4CugG2BAPKB/1qADYEA14BGgf76gf9wgQE2gf5bgf7DgQCigQHDgK2B/f6BudJWKREUVikRFFYpERRWKREUVikRFFYpAK0B/hEUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgHIDgMmAu4ChgQCigQCpgf8pgQD5fIDtgQEggQC/gf8jgQKmgQFUgQElgEGBfz5WKREUVikArgH6ERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgHMDgQHXgf7Kgf9PgNWBATyBARiAKoA6gGWBARKB/vWBAWgArwH8gQDAgOyB/1KB/tCB2qdWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAdAOAVYH+moC+gf6kgQEUALAB/oH/d4CxgQCjgCKBALaB/uiB/jiB/jyBAI6BALuBAP6CBxUwVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQAsQH4ECPwAoB1A4EAzYDPgNSBAMmAPnKBAU+B/saBAM6BAcyBAO2BAd+BAOiAIIEAiYH+x4Eg0VYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwCyAf4KEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAdgOBALGB/rGAe4H/d4Atgf9Bgf9ngI+B/1OBAjKBAPiB/yWB/zOAwoDrgf6kgRUrVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpALMB/BEUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoB3A4H+v4EA2IH/A4Dfgf94gf7pgGWBAXqB/0mAN4H/IoH+94EA0oCgeYEAyoHqalYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAC0AfxWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAeIH+foH/HICHgCKBAWKBAMuB/fMhEIuAjoBjgESB/hyAdoBygKqAboGzUlYpERRWKREUVikRFFYpERRWKREUVikAtQH+ERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAeQOAf4H++YEBSYApgLaBATCBALF8gf84gf89gf98gf9KgHeA6IEAiYH/X4FiflYpERRWKQC2AfoRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKAegOB/0yB/26BAIeAl4AigQDbgf5SgQKLdoEB74EA7YEBlgC3Af6BANqB/yh9gQEagVeAVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgHsDgf9MgQDqgFSATIH/X4CnALgB/IEBLIH/BYBogf9Wgf9cgf72gf66gf9/gPqB/q2CB3KlVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQIwC5AfrwAoB8A4AOgOuAlYEBC4H+8oA7gByB/02BAIyBAKyBATmB/zSB/i2AjYEA3IBkgZfEVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgC6Af4JERAJEI8QflVmEFYQRRA0ECPwAoB9A4BNgf7OgQGVgf6YgH+B/y2AOoEA0IDDgf8Ngf7vgf7Qgf7rgD+AU4H+/4IHYupWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpALsB/hEUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgH4DgQC5gHGBAJaB/ul1gf72gQI9gf9bgQIkgf5Pgf9Bgf8IgHWB/1KB/uWBAKCCBw4EVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikAvAH+ERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoB/A4EBFIH+ioEAgoH/EoEAh4EBtIH+y4CHgQF8gQCjgf9Igf22gQEggQDWgQHMgBqCB1RZVikRFFYpERRWKREUVikRFAC9Af5WKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoMGA4EA8oH+VoDwgEaBAJmB/q+AoYDEgCCAM4H+9oEBjIEAz4EAnYEBJ4CfgRu7AL4B/FYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAgQOBAIWBAOeBAXOAu4EAyYH/X4H/KoH/JIEA2gC/AfqBAMaBAOuBAeiBAjGBAKCAIoATggc2JlYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAggOAwADAAf6BASaAdYCsgQCmgEOB/0iB/tOB/yyAooDtgBqBAZ6BAY+AE4EAlIHqblYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmAMEB/hBWEEUQNBAj8AKBAIMDgf47gf7cgf69gEaB/2WB/3SBAcKA8oCkgI2BAO+BAJiAYYBogf8kgf74gQiZVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwAwgH+CxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAhAOB/laBALaB/3OBAJaA1YCXgQFZgQCZgBuBATeBAbqB/1+ApYA5gQGIgDSBxZtWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKQDDAfwRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQCFA4EAy4H/TYEBDoEBBYDugQDOgf8UgIiAo4H/f4EBkYDFgQF5gQCfgQEHgKyB7FlWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikAxAH+ERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQCGA4H+zIB8cYEAioH/K4EA/IH+7ICLgLR4gQHRgQFAgQCIgHmASYAZgSYmVikRFFYpERRWKREUVikRFADFAfpWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAhwOB/s6BAKiAooEAsIDMgQDQgFaB/y2Ar4EA2YC2gf3YgNSBAPKB/teAJwDGAf6BGIpWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAIgDgf9UgQCNgPiAeYH+9IH/XIEAnoH/OICOAMcB/IBcgHCBATGAQIEBHIEA3oH/LIH4WlYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAiQOBARaAdgDIAfyAE4H+xYH+1oEBXIH/QoH/OoEAuoH/WYEBlYBOgQEdgf9kgD+B/0CB78ZWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH4AyQH+VWYQVhBFEDQQI/ACgQCKA4EAyoEBQ4A3gf6VgQGkgQHNgH+B/sCAO4EBG4DxgQErgf8Jgf7wgQFmgf7IgeRCVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFADKAf4MERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAiwOAO4EA14BfgQCwgIOAE4H+soEA2oEAoYEAgYECMYH/MoCpgIyBAISB/kmBk8tWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpAMsB/hEUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQCMA4H/cIB8gf7PgNuB/uOBAYeBANyBARuAQ4B1gQFJgf8lgQHogEF2gf45ggd5RlYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQAzAH8VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAI0DgISBAWCASIB0gLyAL4CBgIV1gFSAHYH/aYH++4EBMYECAYEBboGmUlYpERRWKREUVikRFFYpAM0B+hEUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAI4DgHyAXIH/OoH+toDGgNKBAPiA9oEAjYEBm4CWgQCxgf4WgQCvgQFSAM4B/oH+HIIHX9xWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAI8Dgf8LgFKB/qOAaYEBLYB2gQJHgGAAzwH+gQF2gE2B/z2BAStwgC+B/bGB/3CCB0jZVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQCQA4EAwADQAf6BAR6BAQmB/liA7IEBqIC2gf8lgf9ngQCZgOaB/tmBANaA5YEBVoCpgQYdVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+ANEB+FVmEFYQRRA0ECPwAoEAkQOAoICpgQH4gGOBAlmBApuAVoEBuoBugf3Lgf8xgQCTgDOA4IH/C4CKggdE+lYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQA0gH+DBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAJIDgf6Jgf9PgQDjgJOBAbSB/qaDB4EBPYC6gJ6BATCB/1iAY4EBrIAkgQG+gUxwVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKQDTAfwRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAkwOBAJyBAZKBAOKB/c+BAXGAioEBOYEA04Abgf7AgDGARYEA7oBKgQDCgf6vgR2PVikRFFYpERRWKREUVikRFFYpERRWKREUVikA1AH8ERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAlAOB/qiANoCQgf4FgQDagf92gQDWgf7ngMSBAPaAo4EBV4C6gf73gOqAcoHddFYpERRWKREUANUB/lYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAJUDgPiB/2+Am4B+gQGpgQD9gQJsgQGCgCKAIYCxgf4YgJqBAKAA1gH+gQCBgf5DggdEJVYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAlgOB/l6BAfSB/xyB/myBAMeARgDXAf6BAe+BAReAH4EA+oEBiYBYgCF1gf63gBGCB2u8VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQCXANgB+gOB/g6Ab4EAm4H/XIH/IoH/RoEAy4EBvIBaeoH/QIEBIIEBOYEBnoH/f4EAtYIHeUFWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKANkB/AkREAkQjxB+VWYQVhBFEDQQI/ACgQCYA4D3gDqBAOeBAUWBAcmBANGB/1aB/3WA7IC0gQFggQFkgHeBAa6B/vWAMIIHQNFWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFADaAfxWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQCZA4Cigf7Jgf6mgIaAU4EBHoEA63qB/yeBAN6AqYH+WoDegf8LgH+BAJKCB2YuVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikA2wH8ERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAmgOBANyBAc+B/wGB/reAmIAQgQDtgQCugQEagOGBAdJ8gf8QgQCxgf8kgf6lgRXZVikRFFYpERRWKREUVikRFFYpANwB/BEUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAmwOB/v+BAN6BARiB/wOBARyBATSAWYCBgK6BAI2Ak4H+u4EAh4EAkIEBu4ECHgDdAfyB521WKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAJwDgf3HgLmA9oEAsICkgQDGgf7egGOBAMUA3gH8gQE5gQDNgQGcgGaB/0+B/xqBAKGB/hFWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAJ0Dgf8qAN8B/IBNgLGAVICjgQEmgFiBAWuB/3+B/s2B/wGB/rWAJoCYgNGB/wmBnblWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZgDgAfoQVhBFEDQQI/ACgQCeA4EAhoDjgf89gEOBAVeB/3WAWYEAuYEBIYH/LoEA6YEBGIDwgf78gQGDgf7EgdfgVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFADhAfwMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAnwOB/2yBAKeB/3KAGIEBXoEBMIEAj4H/Q4DPgCqB/32BARSBAheAzoC1gf5UgbcQVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQA4gH8VikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAoAOAloH+ZoEBfoH+24ECFIH/d4H/LoEAtIEBX4ECHYAngQCSgQGAgECB/qOBALqByHlWKREUVikRFFYpERRWKREUVikRFFYpAOMB/hEUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQChA4H+yoH+0IH/J4H+wIEBRIH+3IH/PIEA5IDmgJyB/0mBASGB/16BAZWBAWyBATKBrYAA5AH8VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQCiA4BYgQDDgf9xdYH/LIEAnYAYgMCAhIEA5YCfAOUB+oEBVIEB5IEBNoEBTYEA9oIHTpVWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAKMDgf4Sgf8QAOYB/IH+0oH/YYH/QIH/ToALgf9bgICBAQ2AfYEBDoEBtIH/fYH/I4H+eIGSp1YpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QfgDnAfxVZhBWEEUQNBAj8AKBAKSBAKuAwoCjIxBHgQDHgf7hgJeBAWOAboECD4EBR4EBl4EBjoEAzIH/coH/WYHtU1YpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQA6AH8DBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAKUDgf3MgQDngKeAm4AYgK+B/reBAVqA6oBcgQKWgQC0gQCtgf9ugQELgA2BxA9WKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpAOkB/hEUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQCmA4EAh4EAm4H/a4D2gQFYgMKB/tSB/hGBAQ+AMoH/e4H+mIB7gQDpgQErgf8sge0DVikRFFYpERRWKREUVikRFFYpERRWKREUVikA6gH8ERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEApwOB/wiB/taB/uOBAKSB/22BAUyBAbiB/y6A9YEA74EAxoH/HoBBgJeA0YH/KoIHbm1WKREUAOsB+lYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQCoA4Bqgf7bgImBAQaB/taAWoH/PoDGgMOAwYBBgQG4AOwB+oEA+oB6gf83gf9zgd/WVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQCpA4H/LYH+uIDigf8dAO0B/IEBZ4H/IIEBHYChgCaAJYEAkIECU4EBIIH+xIEB5oB+ggCQT1YpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRQDuAfoQNBAj8AKBAKoDgf50gf57gf7vgCqALYEBAoEBJoEBI4H/WoH/ZoDVgQHngD6BAJuBAY2B/36BoTpWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDADvAfwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQCrA4CegQENgQFFgQDRgQH8gQGegQF1gMGB/x6AJYECh4H/OIH/SXyAooDGgUtIVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikA8AH+ERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEArAOBAQt2gCqA5oBPgQF4gQE0gf7lgQCGgQC1gEuB/raAsIDUgf7kgQD0gafhVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKQDxAf4RFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEArQOB/1SA4oH/J4BQgBmBAVWB/ymB/26B/2SBAQaBAO+ANoEA24H/X4H+9YEAqIG5I1YpERRWKREUVikRFFYpAPIB/hEUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAK4DgMeB/huB/qKB/kR6gQGbgQDmgf8dgQGcgCyBALGB/qSBAOGA9YB8gFYA8wH+ge1YVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQCvA4EAjYH+/4EBjYH+WIDhgESB/nuBAgaAugD0AfyAyIEAooEAgYH+KIAogQEagf8Iggdm6lYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAsAOB/o8A9QH+gQDYcIH+94A1gf9fgf8tgf9GgQCTgf9kgQDegQEBgf5mgG2EB4H+mYE0O1YpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QfgD2AfpVZhBWEEUQNBAj8AKBALEDgQEPgf7MgQDIgf8Mgf9wgBCB/uCAloEAn4CBgISBAUyBAT2AJIEA+oDrgb4iVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAD3Af4MERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAsoEAwYEA4YH+5IEAjYEBT4CJgBSASIATKRCtgf9VgQDPgf9qgPaBAiCB/veBvUNWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpAPgB/hEUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQCzA4ANgJCBANmB/siBAJCAkoBigQDzgf9Ggf9jgQKagQDQgQFbgf7ZgGGB/0eCBy/SVikRFFYpERRWKREUVikRFFYpERRWKREUVikA+QH8ERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAtAOB/3iA3IEBX4H/ZIH+IoH/A4Brgf6/gQIggQHggf8QgGeBAWGAWoH/UoEBiIIHU2BWKREUAPoB/FYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQC1A4Cqgf69cYCsgOWA2IC3gf8CgNSB/yOBAmeB/zWA0gD7AfqB/0iB/0WAsIHrOFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAtgOB/neBASqAqoH+xoEB/AD8Af6BAKuB/2Jzgf9zgQCZgK6B/zyBAUqB/1+B/vqB/xqBsCNWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAjAP0B+vACgQC3A4H9vYAWgKGB/1KBAIeApoEBT4BqgEqB/1WAOIA5gQI8gHCB/jSBAQGBwIdWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKAP4B/gkREAkQjxB+VWYQVhBFEDQQI/ACgQC4A4H+vICbgf8Tgf7pgQGvgQG/gCeB/kaAx4AjgKWB/y6BAP2BAQWAFIEBJIGZ8FYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikA/wH+ERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBALmB/q6BAX6A6oH+zIB4gQFKgQNpgf8mgNaAwYCWgf9qgQDfgNcpDxESD4CxgasYVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAEAAfxWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAugOB/aqBASaBAZKBAIyBAMaBAdWBAcSAf4H/PoEA8YH/PYEA44B7gQGJgCWB/nCBo0pWKREUVikRFFYpERRWKREUVikBAQH8ERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQC7A4EBhIH/OIEA84BUgf8JgNSAQIEA5oCqgQFVgf8hd4EAlHaAvIH+1YEif1YpAQIB/hEUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBALwDgQDTgQFggf8xgQDEgf9agGSB/ziAx4CDgMqB/3oBAwH6gQCrgQFngf9WgPKB/rGBbxdWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAL0Dgf8Igf7VgLUBBAH8gf4RgLaBAWqBAO6BAd+B/uyB/2+BAaKB/36BAXCBASWB/zCBANGCAIAyVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+AQUB/lVmEFYQRRA0ECPwAoEAvgOAoYH/VICEgQDQgf7IgFqBARGA6YDjgIWBAamBARCAnIH/YYH/S4BigZSsVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwBBgH8CxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAvwOB/w6BALeA+oH/GIASgf9ngJeBAIaBAQ+AZIEBaIECwoH+f4H/RIEBF4B3gafsVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUAQcB/FYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAwAOBAXKBAO2BAMKAtoEAnYECZoEBJIH/EIEBnoEA5YH/doH+8YEBaYBsgQFPgQDwggdJvlYpERRWKREUVikRFFYpERRWKREUVikRFAEIAfxWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAMEDgJyB/zOBAiaAqIEAuYEBeoH+zoEBiICpgQChgf5zgB2BAeGBAciBAKOBARuCB2JuVikBCQH6ERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAwgOBAR6B/tOAo4EA24EBjoBLgE+BAUiBAKWB/1sBCgH+gf92gKyB/puAM4B+gQC0gQfYVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQDDA4EBLIH+74EAnwELAfyAJYEA1oCegf9ugQFAgM2BAUiAmIH/dHmBAeGBAg6BAX+BvCJWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUBDAH8EDQQI/ACgQDEA4EBQYEAp4H/Y3+B/1eB/26AZoECWoEAqoCEgBiB/12B/vGBAgiB/sl2geysVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILAQ0B/AoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAxQOADoH/fYH/c4AegQDMgOOBALmAx3KB/l6B/r6B/aaA5IDygQEpgQDoggCYrlYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKQEOAfwRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAMYDgQIWgf83gf7Mgf9kgFuAcXOB/ueA9HZ0gMqAcoDqgBWBAc2BXc5WKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikBDwH8ERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQDHA4EBJoH/A4A3gQD9gf57gQGLgMiBAXaAUYCXgQCmgQF9gf9EgQFsgHKBAeeBdopWKREUVikRFFYpERRWKREUVikRFFYpARAB/hEUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQDIA4H+0YEBhoEA7oEBToEAnYD0gQDZgQFHgf9TgQITgf55gf8JgLaA3oH+v4DGgcD4VikBEQH8ERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAyYEBRYB2gFeB/ouADYH99IAkgGGB/06BAO2BAS4hARIB/hDPgf6MgQFBgNmBAI2BLPVWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAMoDgQEZgD+B/vSBALUBEwH8gf9fgDmBAkOBASOBAOOAiIH+ioH/BIEBJ4Ckgf72gOuCANtZVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFARQB/hA0ECPwAoEAywOB/26B/vuB/3OBAZyAKICLgQFmgBSBAVeAkoH+W4EAxIEBeYCugQDQgC+BJ8JWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsBFQH+ChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQDMA4H+iIBdgOV1gf6rgQFygf9mgMaBAOGB/sWB/iqB/2GAc4EBAYEBZIEAgoF1fVYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKQEWAf4RFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAM0Dgf5/gQE0gQIjgf7XgQCxgf9KgQGxgLCBANuBAWSBAKmBAaaB/xaA24EBUoH/NYFFKlYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUARcB/FYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAM4Dgf8ZgQEwgQDFgf9NgQETgQDcgK2AcIH/dIH/FIH+oIEArIH9uoBvgQCegQGHgcdAVikRFFYpERRWKQEYAfoRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEAzwOArIDcgQCwgf9Lgf5igf6mgf98gCaASoBygf56gQHlgNuAMQEZAfyBAWaAKoIA+d1WKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBANADgf9Lgf9OgDaAYIDagHSB/zkBGgH6gf69gf98gE+B/k+A14H+hIA8gMWAkYFihFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEA0QMBGwH+gQFYgf9XgQDsgG2AUoCUgH6B/xqAgoEBE4H+8IEAlIH+pICNgQFugf9rgSniVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjwEcAfwQflVmEFYQRRA0ECPwAoEA0gOBAYiAX4EA8oEAuIEAmYDkgQF9gLWB/3aB/1CAxoH+/IH+loEA6oDWgQCfgTJRVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikBHQH8ERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEA0wOB/xSB/yqBAQaB/xOBAKKAL3R5gQKwgf7KgDyBALeBAcaBAr2BANyBAh+CAhK2VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpAR4B/BEUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEA1IDRgf1fgQGEgPkjEFiB/z+B/1eB/tKBAJp/gf6zgf9/gf94gQEMgf8ugQC/gb5aVikRFFYpERRWKREUVikRFFYpERRWKQEfAf4RFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEA1QOBAMOB/2eBATmBAU6BALeAF4H/IoEA+ICDgOqB/tqAPYANgf8Jgf6dgQF3ggEGm1YpASAB/hEUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBANYDcYCndIAdgQDQgIeAbYH+vIC8gFWAxYCagf6AgM8BIQH8gf9xgQIqgSioVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQDXgQENgf4cgO+BAQuAGoH+vIBqASIB/oEAiYEBCYAcgQEagf4LgOKBAMKB/rIhERARExEQggC4H1YpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECMBIwH+8AKBANgDgMqB/sWBAOaDB4Angf9PgQHKgQE9gNyB/yiBARSARID5gKmB/wmB/vmCALr9VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgEkAfwJERAJEI8QflVmEFYQRRA0ECPwAoEA2QOBAMCB/lWAOYH+XoH/SIEBI4DSgQD+gOmBAZSB/wuBAIeB/0mB/tWBAf2BAWmBqqlWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikBJQH8ERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQDaA4Dygf9kgECADIEA2YH+QIECBYEBQoArgQEfgf9FgQEDgf5wgMiB/xWB/l6BeIZWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpASYB/hEUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQDbA4Azgf5DgCKBAIyBAK6A44EBZoEB3oH/FYEB0oH+UYEA7IEAvoEBFICfgQFCgewkVikRFFYpERRWKREUVikBJwH8ERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEA3AOAxIBngQHggLGBAUmB/iiBATmBAWyAzoEA+4Ckgf8vgQDkgf5hdIB/ASgB/oIArWpWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAN0DgQD2gf9AgQDCgOmBAKaB/1+B/sqB/ycBKQH+gNCB/2iBAIGB/rGB/yuB/tmBAiKBAQWCALCQVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQDeAwEqAfyB/ueBALSBAOeALoEBa4H+SoH+TIB/gQHhgf7mgf7HgQFqgf9+gBKAKHWCAMinVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkBKwH8EI8QflVmEFYQRRA0ECPwAoEA3wOBASKAT4Cugf5QgDKA84H/b4H/fIEBUoEAl4H+3YEBdoH/doBGgf50gQEZgVQ3VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUASwB/FYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEA4AOAe4EAlYEA+oClgNCAUIBEgQDIgQCrgEKB/q6AVoECI4H+w4ECp4EAxoE6d1YpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKQEtAf4RFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAOEDgQDRgQEGgQDagf96gQGwgQJ8gQDEgQGmgf8fgQJLgQE9gQGxgHGB/tKB/oOAmIFrNFYpERRWKREUVikRFFYpERRWKREUAS4B/FYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAOIDgf7ygQExgf7igCeBAQGAx4EBsIEA/YAkgLuB/tuB/leB/nKBAMWB/piArYFpbgEvAfpWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAOMDgQDkgf69gQCdgD6AGYEBFYECKoH/cIH+/QEwAfqBANCBANyBAgqB/oaBAXuB/tiAXoEue1YpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEA5AOASgExAf6BAIOBAP2Av4H++YBUgQElgI2B/zeAd4H+NICJgByBAOeAqYEBe4FSZFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmATIB/hBWEEUQNBAj8AKBAOUDgQFJgf93gf7UgKmAtoH+vYH/RIAmgQEUgQDBgf7CgOiB/neB/s6ALoAYgRFrVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwBMwH8CxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEA5gOB/lOB/zqB/miBAKyBAcOBAZmBAO6Al4EAloCcgN6BAKaB/ryBAMaBALSBAYmBT7dWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpATQB/BEUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQDnA4EBWIBzgKeBAIiAwoEAyoEArIECEIAvgQHQgLaA5IH+y4EA3YEBdoBBgcBbVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAE1AfxWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEA6AOBAI2BANeAgIEBYoH+cHiAKoBNgQFfgQCXgf6bgQD6gf4TgF2A9oH/cIHqQVYpERRWKREUVikBNgH8ERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAOkDgQH6gf6agQE+gf2fgQJZgQGIgQHHgQKGgQFsgGeAVIH/PoAPATcB/IBlgf8VgGmCASguVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACgQDqA4EBLoH/HoEB1YH+iIEBlQE4AfyAU4H/EYAbgQK2gQDygPOB/3qB/WmAjYEBHIEA24GL9VYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECMBOQH48AKBAOsDgFyBAMOAzYBFgQFUgf6ugf7AgQGUgf8Ygf66gQCMgf63gf9RgDh7gf9eggD06FYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwE6AfwKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAOwDgFqB/1CBAKyB/vyAKYEBeIH+54AOgQDfgQF+gf7mgPKB/ymB/2CB/tmAj4Ea0lYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQBOwH+VikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAO0DgQDNgDmB/2mB/3yAQIEAoH+BAUqB/xiAtYH+VIH+XoH+3IC6gMGAV4HwcFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAE8Af5WKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAO4DgKeB/0WB/n56gQGdgGqBAOCBAc+B/wKBATGBAJKBAcCB/iCAO4Ajgf5ugQ9WVikRFFYpERRWKREUVikRFFYpAT0B/hEUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEA7wOBATOBARyBASOB/raBAJ2B/s6BAMyBARiBAJSB/1CB/fGB/3WBAIaBAQmB/xABPgH+gOmAElYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEA8AOBAO6B/siB/lOB/xGB/0iBAdSBAU6AUwE/Af6A+oAZgf9Cgf8igf7lgQD6gwiBAK6BU69WKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AKBAPGAHYB1AUAB/IH+ZIH+14EBgoBDgf5JgFiAu4H/XCEQvnGB/hSBAYyAfIArgRXaVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVgFBAfwQRRA0ECPwAoEA8gOBAN2B/1yB/jCAcoEA7oEAgnSB/oSBAI2B/saBAUCAF4H+fYBMgLmB/32CAV6/VikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFAwREwwBQgH8CxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAoEA8wOB/3+B/YmBAYOB/r6AuIECH4EApYEAvoEBu4H+9X6B/yuBAQ6AOIH+q4EBL4IBLwNWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpERRWKREUVikRFFYpAUMBhhEUVikRFFYpERRWKREUVikRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ACMbORf5YgVhe6wwDikltw4w4BRAD2ERhWGFR2VPAFjmQCpFYVAVYVAVYVAVYVAVYVAVYVAVYVAVYVAVYVAVYVAVYVAVYVAVYVAVYVAVYVAVYVAREoVhVWFVYV8AeOIFcVVxVXFVcVVxVXFVcVVxVXFVcVVxVXFVcVVxVXFVcVlF8PW3DiljFXFxEWcOIBERcB');

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
