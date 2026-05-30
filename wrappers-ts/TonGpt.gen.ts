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
 > }
 */
export interface TonGptJob {
    readonly $: 'TonGptJob'
    user: c.Address
    hidden: TonGptHidden
    generated: uint8
    replyBody: c.Cell
}

export const TonGptJob = {
    create(args: {
        user: c.Address
        hidden: TonGptHidden
        generated: uint8
        replyBody: c.Cell
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
        }
    },
    store(self: TonGptJob, b: c.Builder): void {
        b.storeAddress(self.user);
        TonGptHidden.store(self.hidden, b);
        b.storeUint(self.generated, 8);
        b.storeRef(self.replyBody);
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
    static CodeCell = c.Cell.fromBase64('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EgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AGADAOBAemAGYEAlIH/PYEA64EAmIB0gQDVgf6ugf6pgGoiAfqB/w+B/xyBANeBAS6AEoGLylYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYANA4BpgQHogHqAJSMB/oH/JIEApYEAw4EA2IH+TYB2gQCRgf8/gQHEgQG/gNmBAOSBoOlWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUkAfgQNBAj8AGADgOAJYEBlIEAw4EA3oH/Q4EAnYEAm4H+2YEAoIEBJoH+nIEA8YBBgC6AS4H+PoG151YkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMJQH8CxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYAPA4EAnoH+uIBDgLmB/2aBARiAyYEAwIDBgf60gEqAeIEBBIEAnIH+/oEBhYGfDFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkJgH+ERRWJBEUViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYAQA36BARmA83mB/V+B/qiAHIEBsIH/IoCtgf9Zgf7mgPeAcYAOgf8eggd0SFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFCcB/FYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYARA4AjgLCB/seB/zuAYoH/XoEBdoATgf9Ggf6XgPeB/w2BAnWB/xSB/2iBAPWCB1WvViQRFFYkERRWJBEUViQRFCgB/FYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQ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gf82gQFqgQDHgQGtgQEogHWB/waB/vKCB2yNViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFwB/lYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ABgC0DgQIMgf9UgFV/gBOB/0GAP4EArYCMgf39gf6rgQF6gI+B/kyBAYyB/wKBp7dWJBEUViQRFFYkERRWJBEUViQRFFYkERRdAfxWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AGALgOBAT54gf73gQCGgQGjgQC7gKOB/yGB/umBALyB/tCB/lSBAX2BASeBAOyB/yqCB39MViReAfoRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ABgC8DgIOAFIH+rIDZgLKB/ryB/32BAimB/vuAV4H/E18B/oEBjoH/GIH/SIEAg4H+hIHIYFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYAwA4EA44BHgM6B/mtgAfyAyIH/JoH/aIH/EoCSgQDggF2B/tuAwoDogQC0gf48gbXnViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDRhAfgQI/ABgDEDe4EAo4EBO4B2gQHSgQGugQDQgNJ3gQGOgf5rgEmBAZGAGHiBAJyBNr5WJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUDBETDAsREgsKEREKYgH8CREQCRCPEH5VZhBWEEUQNBAj8AGAMgOB/xCBATGAk4H+KYH+coEBPoEBV4DKgG6B/r6B/1WB/vqB/1uB/oWBAQ+AiIGD8FYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUYwH8ViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYAzA4AfgFGAroH/d4CSgf8dgQEcgf9vgQCdgf7pgQDGgQFAgQIdgC2B/3WBAKyAvlYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkZAH+ERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYA0A4EBaYCkeoAagQDvgHqBAOyBAKKBAOiBAPOAhYBPgf9pgQDigf6BgQDGgbMcViQRFFYkERRWJBEUViQRFFYkERRWJGUB/hEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ABgDUDgQFKgf93gCNxgf5vgQF6gQCwgf6egf78gGSBAWWB/3+BAOGAH4ECGIH+5IHIK1YkERRmAfxWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYA2A4EB6oH/WIBkgOOAhIH/ZIDxgPOBAKSAsYH/aICDgK9nAfyB/pKBAUCBAhqBt7hWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AGAN4H+SIDrgQCigKWBAeiBAOFoAf6BAViB/3GB/uEmEK2BAMSBAM2B/36A5oA4gQEigRTSViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ABaQH+gDgDgQCFgf8vgwaANIEBJoDwgNKBAT2AmIEB34H+2YCHgf9egMCAv4EApoIHZy9WJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUDBETDAsREgsKEREKCREQCWoB/hCPEH5VZhBWEEUQNBAj8AGAOQOAQ3CBANKB/3SAbYH/K4H/PIH+joEA64DWgQCGgQCjgF6B/mCBAPqAsoEik1YkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRrAfwMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYA6A4EA64A2gQCJgf9Vgf76gG2BATyBAZOASIEB9oEA94EBTYBRgQFZgf8ngQDMgY3/ViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRsAf5WJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ABgDsDgQGvgGKB/pOBAPeBANmBAVqAFIEBV4EA6oH++YH/f4EAl4ECW4EAr4Dwgf9ngTPBViQRFFYkERRWJBEUViQRFFYkERRWJBEUbQH+ViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ABgDwDgQEOgQDRgf3DgNiB/tGAL4COgDOASoEBKYH/GYEBHIH+S4EA+IAqgQD6ggd0l1YkERRWJG4B+hEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYA9A4H/fIH/LIEA+4H/HIH+Y4EBLIEAzYEBnYDwgf7lgQCObwH+gQGbgQCIgf90gQDlgf8nggd13VYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYA+A4EBIIEAoIH/OXAB/IH/M4EAjoAdgBKBATyBAVWBAQqBANOAyICfgQFJgMOAx4FbxFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRXEB+BA0ECPwAYA/A4AhgQE0gf84gQCcgQGogf8CgICAYoH/QYCXgf9OgQGMgQC5gQEmgf8pgf9ugcZSViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwxyAf4LERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ABgEADgQHbgQDdgQC5gf9lgf9Ggf7NgIGB/02B/vCB/2aAJ4H/a4H+6IH9qIEBi4H/bYIHd8tWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkcwH+ERRWJBEUViQRFFYkERRWJBEUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AGAQQOB/3KB/2eAwYEAk4A7gf9dgH+BAKyB/g+B/rSBAJKAk4AngIqBAaqAroHDRVYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJHQB/BEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYBCA4A+gM2B/2yBAISB/zyB/z6BAQWB/uKBALF4gEOB/t6B/vqBAMGAcYEAwIH6H1YkERRWJBEUViQRFHUB/FYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYBDA3iB/0KBAJd+gf6qgf9SgGuB/v2B/2qB/32AXoAMgf94gMuArYH/Q3YB/oGz0VYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYBEgHOB/3AgEDaAeIEBgIH+zoBhgf8JgGyBAOB3AfyB/1OBAZSAlYH+LYEBE4B0gZ/2ViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ABgEUDgI6BANmBANx4Af6B/0GB/uaBAZuB/s2B/y+B/pmBAI6AJoEAwIH+4IH+u4CSgMSB/CxWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUDBETDAsREgsKEREKCREQCRCPEH5VZhBWeQH4EEUQNBAj8AGARgOAP4CUgQDFgQEFgOeB/26AaoH/HoB5gf8Ygf8agf8zgHGBAOqBAJuBAPiBB/1WJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUDBETDHoB/AsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AGARwOAnYAzgQDegEyB/w6BAc+BANGBASSB/vWBAUKASoH/Q4EAkXqBAViB/zGBsthWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJHsB/hEUViQRFFYkERRWJBEUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AGASAOBAeyBASOAnoCEgKeBAJeB/zGBAgaB/wuB/dyAhYEBFoH/OIB6gf7+gf89gctjViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERR8AfxWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ABgEkDgQGUgQDPgf5sgB6BAamB/qOAmIDUgQCwgf7igGaBALeAD4EAu4EA24BVgeWCViQRFFYkERRWJBEUViR9AfwRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ABgEoDgDqBARmA6IH/SoEBOIEA6IH/S4H/D4BZgB+AU4MHgf8sgQEwgLmBAV5+AfyBkApWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AGASwOAhnOBARuB/wSBAY2BAQiBAPWBAMyB/1R/AfyAm4B/gC2BAdaBATiA6IH/JoE0S1YkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYBMA4ECb4DvgLSAAf6B/3OAsIH+8YA/gf87gQCTgKWANYB+gf5VgNeAaYEBbYFKT1YkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0gQH+ECPwAYBNA4EBH4D6gHCAL4DagQH2gQCRgf2DgKeB/3CBAMSB/tGAyYCCgf92gQDbgUWMViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCoIB/AkREAkQjxB+VWYQVhBFEDQQI/ABgE4DgFuA3oEA2YB6gECBAaeB/v6BAT+AyIDmgPaBASuA44EBaoApgJ2BMjJWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJIMB/hEUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AGATwOBApeBAKOAPoDigf9egQGLgOSAkYEAw4EBJoCHgQEGgHSA04EAjIEBwoHWVlYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViSEAfwRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYBQgPaBANGAvYH/IyIQWHCAsIBXgQDxgQHOgCmBAXCB/ziB/p+B/3SBAOqBA5xWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViSFAf4RFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AGAUQOBAUF9gGeA14H/dIH/ZYH/R4EB0oEAvIH+dIH+2oH/cIEBh4EAmICLgf9hgZwCViQRFFYkERRWJBEUhgH+ViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ABgFIDgQENgQGfgPaAGIDxgf7/gQDbgf74gGmB/nSAMoH/OYDFgGqAK4H/DYcB/oCwViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ABgFMDgHKB/z2At3eB/0qAjIEAiYB3gf48gf2JgM+IAf6BAPWB/1uB/piAtoAagcFWViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ABgFQDgQEMgQEQgQDbgf9jiQH+gQCLgf8od4EA/YEBEYH+7YAQgL2AmIEA0YC8gf5igZbWViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI4oB/vABgFUDgQEagQINgOuAn4DygNqBAN+B/nqB/rCB/3qBAK2BAJGB/3uAmYH+ZYEA/oHUKFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQqLAf4JERAJEI8QflVmEFYQRRA0ECPwAYBWA4EAg4DFgM2AqIH+H4ALgf9XgQJHgQC+gI6B/2GB/tWBAOCB/tmBAOmBALCB3XJWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkjAH+ERRWJBEUDBETDAsREgsKEREKCREQ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/3WBAKGAPoECVoEBIoH/GoH/I4AMgf86gQC0gQCmgf41gVPaViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAmbAfwQjxB+VWYQVhBFEDQQI/ABgGQDgJeBAaGBAM6Aw4H/BoBZgH+BAOyBANGBAJaBAKyA6IEBQoEAi4H+14CsgeIkViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViScAf4RFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ABgGUDgf8kgQDcgFSB/2+BAPCA44BEgJSB/kGBAW2AjoEBxYH+FYDwgQEHgIaBkWRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYknQH+ERRWJBEUViQRFFYkERRWJBEUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AGAZgOB/1qBAU+AToEA/YCXgNWBAVaB/siB/xeAwIH/KoCsgQHIgf8ZgQDygf84gRqTViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFJ4B/lYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ABgGcDgQC2gQDDgQDAgHGAFYCFgf92gQGmgDGANoEApIH+e4EBC4EA2IH/WIEA+4ERvFYkERRWJBEUViSfAf4RFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYBoA4H/DYA0gQDKgD+AoIH+G4AjgQFpgf5JgCSB/n6A34EA0YCvgQGCoAH+gQEFgUH/ViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ABgGkDgLCB/ymA2IBTgf5ggf9ygOKBAlaA26EB/IBRgGCBATmB/1mAroChdYEAx1YkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYBqgKaADIH+vSEQR6IB/oCOgf9ygQEOgQE2gO6BAX2B/0KB/1mAMYEAwIH/K4BbgacPViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDSjAfwQI/ABgGsDgBiB/tOB/uSAtYH+joEAwoA2gf6Ugf79gMKB/0R0gISBAWyAn4H/WoHrSFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQqkAfwJERAJEI8QflVmEFYQRRA0ECPwAYBsA4EAtIH/XoCFgf9NgCaAIYH/foH/NYEBD4EBq4Bwgf7IgFaBAUmAm4EAjIETs1YkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViSlAf4RFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYBtA4Dhgf6Vgf8PgMGBAjWBAKuAQYCggf9Dgf8xgf8OgQEngf9Jgf8jgQEugOiBq7pWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUpgH8ViQRFFYkERRWJBEUViQRFFYkERRWJBEUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AGAbgOB/1CB/xmAc3WBAIKBAISBAKKAV3OB/xyAO4H+RoA2gO+B/0OAToEar1YkERRWJBEUViQRFFYkERRWJBEUViQRFFYkpwH+ERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYBvA4BKgNmB/v6AkH+BAaaAGoBsgQHYgIiBASiBAIKBAO6B/kGA7YH+7IEo81YkERRWJBEUViQRFKgB/lYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERQMERMMCxESCwoREQoJERAJEI8QflVmEFYQRRA0ECPwAYBwA4BSgf6Mgf6Xgf9IgFSBAaGB/rSBAqGA1oEAwYH/EYH/PIEBs4DugFipAfyBALeCAWIqViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ABgHEDgNmB/ueBAOiBAISBAMiBAIOB/32qAfyBAOaBAPKBAKCB/kCBAWiAs4CcgQIGgJ2BacpWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AGAcgOrAf6AmIH93YBFgNyBANmBAMyAC4CXgQFWgQG3gLuA4YH/cIH+44CigFyCANgoViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFAwREwwLERILChERCgkREAkQjxB+rAH4VWYQVhBFEDQQI/ABgHMDgf7SgQDGgHmB/z+B/qOBAL+Al4H+zYEA5nyBAQ6BANKBAPmAXoECSICOgS2mViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFK0B/AwREwwLERILChERCgkREAkQjxB+VWYQVhBFEDQQI/ABgHQDgf9Agf9cgf9XgBSB/1SBAa2AGYD4gBCBAKGBARyBATKB/tWBAR6BAX2BALGBexRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFFYkERRWJBEUViQRFK4B/FYkERRWJBEUViQRFFYkERRWJBEUDBETDAsREgsKEREKCREQCRCPEH5VZhBWEEUQNBAj8AGAdQOB/v+B/vyB/teB/1yAIIEBlniBAUuA+oH/TYH/UIC+gGiB/w+BAPWB/o2B1FJWJBEUViQRFFYkERRWJBEUViQRFFYk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');

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
