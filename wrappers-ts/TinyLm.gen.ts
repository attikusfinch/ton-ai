// AUTO-GENERATED, do not edit
// It's a TypeScript wrapper for a TinyLm contract in Tolk.
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

type uint8 = bigint
type uint16 = bigint
type uint32 = bigint
type uint256 = bigint

/**
 > struct Storage {
 >     owner: address
 >     modelVersion: uint32
 >     vocabSize: uint16
 >     maxContext: uint8
 >     maxGenerate: uint8
 >     tokenBytes: map<uint16, cell>
 >     transitions: map<uint16, TransitionRow>
 >     neuralState: Cell<NeuralState>
 >     knownReplies: map<uint256, cell>
 >     isPaused: bool
 > }
 */
export interface Storage {
    readonly $: 'Storage'
    owner: c.Address
    modelVersion: uint32
    vocabSize: uint16
    maxContext: uint8
    maxGenerate: uint8
    tokenBytes: c.Dictionary<uint16, c.Cell>
    transitions: c.Dictionary<uint16, TransitionRow>
    neuralState: CellRef<NeuralState>
    knownReplies: c.Dictionary<uint256, c.Cell>
    isPaused: boolean
}

export const Storage = {
    create(args: {
        owner: c.Address
        modelVersion: uint32
        vocabSize: uint16
        maxContext: uint8
        maxGenerate: uint8
        tokenBytes: c.Dictionary<uint16, c.Cell>
        transitions: c.Dictionary<uint16, TransitionRow>
        neuralState: CellRef<NeuralState>
        knownReplies: c.Dictionary<uint256, c.Cell>
        isPaused: boolean
    }): Storage {
        return {
            $: 'Storage',
            ...args
        }
    },
    fromSlice(s: c.Slice): Storage {
        return {
            $: 'Storage',
            owner: s.loadAddress(),
            modelVersion: s.loadUintBig(32),
            vocabSize: s.loadUintBig(16),
            maxContext: s.loadUintBig(8),
            maxGenerate: s.loadUintBig(8),
            tokenBytes: c.Dictionary.load<uint16, c.Cell>(c.Dictionary.Keys.BigUint(16), c.Dictionary.Values.Cell(), s),
            transitions: c.Dictionary.load<uint16, TransitionRow>(c.Dictionary.Keys.BigUint(16), createDictionaryValue<TransitionRow>(TransitionRow.fromSlice, TransitionRow.store), s),
            neuralState: loadCellRef<NeuralState>(s, NeuralState.fromSlice),
            knownReplies: c.Dictionary.load<uint256, c.Cell>(c.Dictionary.Keys.BigUint(256), c.Dictionary.Values.Cell(), s),
            isPaused: s.loadBoolean(),
        }
    },
    store(self: Storage, b: c.Builder): void {
        b.storeAddress(self.owner);
        b.storeUint(self.modelVersion, 32);
        b.storeUint(self.vocabSize, 16);
        b.storeUint(self.maxContext, 8);
        b.storeUint(self.maxGenerate, 8);
        b.storeDict<uint16, c.Cell>(self.tokenBytes, c.Dictionary.Keys.BigUint(16), c.Dictionary.Values.Cell());
        b.storeDict<uint16, TransitionRow>(self.transitions, c.Dictionary.Keys.BigUint(16), createDictionaryValue<TransitionRow>(TransitionRow.fromSlice, TransitionRow.store));
        storeCellRef<NeuralState>(self.neuralState, b, NeuralState.store);
        b.storeDict<uint256, c.Cell>(self.knownReplies, c.Dictionary.Keys.BigUint(256), c.Dictionary.Values.Cell());
        b.storeBit(self.isPaused);
    },
    toCell(self: Storage): c.Cell {
        return makeCellFrom<Storage>(self, Storage.store);
    }
}

/**
 > struct TransitionRow {
 >     nextToken: uint16
 >     score: int16
 > }
 */
export interface TransitionRow {
    readonly $: 'TransitionRow'
    nextToken: uint16
    score: int16
}

export const TransitionRow = {
    create(args: {
        nextToken: uint16
        score: int16
    }): TransitionRow {
        return {
            $: 'TransitionRow',
            ...args
        }
    },
    fromSlice(s: c.Slice): TransitionRow {
        return {
            $: 'TransitionRow',
            nextToken: s.loadUintBig(16),
            score: s.loadIntBig(16),
        }
    },
    store(self: TransitionRow, b: c.Builder): void {
        b.storeUint(self.nextToken, 16);
        b.storeInt(self.score, 16);
    },
    toCell(self: TransitionRow): c.Cell {
        return makeCellFrom<TransitionRow>(self, TransitionRow.store);
    }
}

/**
 > struct NeuralEmbedding {
 >     e0: int16
 >     e1: int16
 >     e2: int16
 >     e3: int16
 > }
 */
export interface NeuralEmbedding {
    readonly $: 'NeuralEmbedding'
    e0: int16
    e1: int16
    e2: int16
    e3: int16
}

export const NeuralEmbedding = {
    create(args: {
        e0: int16
        e1: int16
        e2: int16
        e3: int16
    }): NeuralEmbedding {
        return {
            $: 'NeuralEmbedding',
            ...args
        }
    },
    fromSlice(s: c.Slice): NeuralEmbedding {
        return {
            $: 'NeuralEmbedding',
            e0: s.loadIntBig(16),
            e1: s.loadIntBig(16),
            e2: s.loadIntBig(16),
            e3: s.loadIntBig(16),
        }
    },
    store(self: NeuralEmbedding, b: c.Builder): void {
        b.storeInt(self.e0, 16);
        b.storeInt(self.e1, 16);
        b.storeInt(self.e2, 16);
        b.storeInt(self.e3, 16);
    },
    toCell(self: NeuralEmbedding): c.Cell {
        return makeCellFrom<NeuralEmbedding>(self, NeuralEmbedding.store);
    }
}

/**
 > struct NeuralHead {
 >     w0: int16
 >     w1: int16
 >     w2: int16
 >     w3: int16
 >     bias: int16
 > }
 */
export interface NeuralHead {
    readonly $: 'NeuralHead'
    w0: int16
    w1: int16
    w2: int16
    w3: int16
    bias: int16
}

export const NeuralHead = {
    create(args: {
        w0: int16
        w1: int16
        w2: int16
        w3: int16
        bias: int16
    }): NeuralHead {
        return {
            $: 'NeuralHead',
            ...args
        }
    },
    fromSlice(s: c.Slice): NeuralHead {
        return {
            $: 'NeuralHead',
            w0: s.loadIntBig(16),
            w1: s.loadIntBig(16),
            w2: s.loadIntBig(16),
            w3: s.loadIntBig(16),
            bias: s.loadIntBig(16),
        }
    },
    store(self: NeuralHead, b: c.Builder): void {
        b.storeInt(self.w0, 16);
        b.storeInt(self.w1, 16);
        b.storeInt(self.w2, 16);
        b.storeInt(self.w3, 16);
        b.storeInt(self.bias, 16);
    },
    toCell(self: NeuralHead): c.Cell {
        return makeCellFrom<NeuralHead>(self, NeuralHead.store);
    }
}

/**
 > struct NeuralStep {
 >     inputW0: int16
 >     inputW1: int16
 >     inputW2: int16
 >     inputW3: int16
 >     recurrentW0: int16
 >     recurrentW1: int16
 >     recurrentW2: int16
 >     recurrentW3: int16
 >     bias0: int16
 >     bias1: int16
 >     bias2: int16
 >     bias3: int16
 > }
 */
export interface NeuralStep {
    readonly $: 'NeuralStep'
    inputW0: int16
    inputW1: int16
    inputW2: int16
    inputW3: int16
    recurrentW0: int16
    recurrentW1: int16
    recurrentW2: int16
    recurrentW3: int16
    bias0: int16
    bias1: int16
    bias2: int16
    bias3: int16
}

export const NeuralStep = {
    create(args: {
        inputW0: int16
        inputW1: int16
        inputW2: int16
        inputW3: int16
        recurrentW0: int16
        recurrentW1: int16
        recurrentW2: int16
        recurrentW3: int16
        bias0: int16
        bias1: int16
        bias2: int16
        bias3: int16
    }): NeuralStep {
        return {
            $: 'NeuralStep',
            ...args
        }
    },
    fromSlice(s: c.Slice): NeuralStep {
        return {
            $: 'NeuralStep',
            inputW0: s.loadIntBig(16),
            inputW1: s.loadIntBig(16),
            inputW2: s.loadIntBig(16),
            inputW3: s.loadIntBig(16),
            recurrentW0: s.loadIntBig(16),
            recurrentW1: s.loadIntBig(16),
            recurrentW2: s.loadIntBig(16),
            recurrentW3: s.loadIntBig(16),
            bias0: s.loadIntBig(16),
            bias1: s.loadIntBig(16),
            bias2: s.loadIntBig(16),
            bias3: s.loadIntBig(16),
        }
    },
    store(self: NeuralStep, b: c.Builder): void {
        b.storeInt(self.inputW0, 16);
        b.storeInt(self.inputW1, 16);
        b.storeInt(self.inputW2, 16);
        b.storeInt(self.inputW3, 16);
        b.storeInt(self.recurrentW0, 16);
        b.storeInt(self.recurrentW1, 16);
        b.storeInt(self.recurrentW2, 16);
        b.storeInt(self.recurrentW3, 16);
        b.storeInt(self.bias0, 16);
        b.storeInt(self.bias1, 16);
        b.storeInt(self.bias2, 16);
        b.storeInt(self.bias3, 16);
    },
    toCell(self: NeuralStep): c.Cell {
        return makeCellFrom<NeuralStep>(self, NeuralStep.store);
    }
}

/**
 > struct NeuralState {
 >     embeddings: map<uint16, NeuralEmbedding>
 >     step: NeuralStep
 >     heads: map<uint16, NeuralHead>
 > }
 */
export interface NeuralState {
    readonly $: 'NeuralState'
    embeddings: c.Dictionary<uint16, NeuralEmbedding>
    step: NeuralStep
    heads: c.Dictionary<uint16, NeuralHead>
}

export const NeuralState = {
    create(args: {
        embeddings: c.Dictionary<uint16, NeuralEmbedding>
        step: NeuralStep
        heads: c.Dictionary<uint16, NeuralHead>
    }): NeuralState {
        return {
            $: 'NeuralState',
            ...args
        }
    },
    fromSlice(s: c.Slice): NeuralState {
        return {
            $: 'NeuralState',
            embeddings: c.Dictionary.load<uint16, NeuralEmbedding>(c.Dictionary.Keys.BigUint(16), createDictionaryValue<NeuralEmbedding>(NeuralEmbedding.fromSlice, NeuralEmbedding.store), s),
            step: NeuralStep.fromSlice(s),
            heads: c.Dictionary.load<uint16, NeuralHead>(c.Dictionary.Keys.BigUint(16), createDictionaryValue<NeuralHead>(NeuralHead.fromSlice, NeuralHead.store), s),
        }
    },
    store(self: NeuralState, b: c.Builder): void {
        b.storeDict<uint16, NeuralEmbedding>(self.embeddings, c.Dictionary.Keys.BigUint(16), createDictionaryValue<NeuralEmbedding>(NeuralEmbedding.fromSlice, NeuralEmbedding.store));
        NeuralStep.store(self.step, b);
        b.storeDict<uint16, NeuralHead>(self.heads, c.Dictionary.Keys.BigUint(16), createDictionaryValue<NeuralHead>(NeuralHead.fromSlice, NeuralHead.store));
    },
    toCell(self: NeuralState): c.Cell {
        return makeCellFrom<NeuralState>(self, NeuralState.store);
    }
}

/**
 > struct TinyLmConfig {
 >     owner: address
 >     modelVersion: uint32
 >     vocabSize: uint16
 >     maxContext: uint8
 >     maxGenerate: uint8
 >     isPaused: bool
 > }
 */
export interface TinyLmConfig {
    readonly $: 'TinyLmConfig'
    owner: c.Address
    modelVersion: uint32
    vocabSize: uint16
    maxContext: uint8
    maxGenerate: uint8
    isPaused: boolean
}

export const TinyLmConfig = {
    create(args: {
        owner: c.Address
        modelVersion: uint32
        vocabSize: uint16
        maxContext: uint8
        maxGenerate: uint8
        isPaused: boolean
    }): TinyLmConfig {
        return {
            $: 'TinyLmConfig',
            ...args
        }
    },
    fromSlice(s: c.Slice): TinyLmConfig {
        return {
            $: 'TinyLmConfig',
            owner: s.loadAddress(),
            modelVersion: s.loadUintBig(32),
            vocabSize: s.loadUintBig(16),
            maxContext: s.loadUintBig(8),
            maxGenerate: s.loadUintBig(8),
            isPaused: s.loadBoolean(),
        }
    },
    store(self: TinyLmConfig, b: c.Builder): void {
        b.storeAddress(self.owner);
        b.storeUint(self.modelVersion, 32);
        b.storeUint(self.vocabSize, 16);
        b.storeUint(self.maxContext, 8);
        b.storeUint(self.maxGenerate, 8);
        b.storeBit(self.isPaused);
    },
    toCell(self: TinyLmConfig): c.Cell {
        return makeCellFrom<TinyLmConfig>(self, TinyLmConfig.store);
    }
}

/**
 > struct TokenLookup {
 >     exists: bool
 >     tokenData: cell
 > }
 */
export interface TokenLookup {
    readonly $: 'TokenLookup'
    exists: boolean
    tokenData: c.Cell
}

export const TokenLookup = {
    create(args: {
        exists: boolean
        tokenData: c.Cell
    }): TokenLookup {
        return {
            $: 'TokenLookup',
            ...args
        }
    },
    fromSlice(s: c.Slice): TokenLookup {
        return {
            $: 'TokenLookup',
            exists: s.loadBoolean(),
            tokenData: s.loadRef(),
        }
    },
    store(self: TokenLookup, b: c.Builder): void {
        b.storeBit(self.exists);
        b.storeRef(self.tokenData);
    },
    toCell(self: TokenLookup): c.Cell {
        return makeCellFrom<TokenLookup>(self, TokenLookup.store);
    }
}

/**
 > struct TransitionLookup {
 >     exists: bool
 >     nextToken: uint16
 >     score: int16
 > }
 */
export interface TransitionLookup {
    readonly $: 'TransitionLookup'
    exists: boolean
    nextToken: uint16
    score: int16
}

export const TransitionLookup = {
    create(args: {
        exists: boolean
        nextToken: uint16
        score: int16
    }): TransitionLookup {
        return {
            $: 'TransitionLookup',
            ...args
        }
    },
    fromSlice(s: c.Slice): TransitionLookup {
        return {
            $: 'TransitionLookup',
            exists: s.loadBoolean(),
            nextToken: s.loadUintBig(16),
            score: s.loadIntBig(16),
        }
    },
    store(self: TransitionLookup, b: c.Builder): void {
        b.storeBit(self.exists);
        b.storeUint(self.nextToken, 16);
        b.storeInt(self.score, 16);
    },
    toCell(self: TransitionLookup): c.Cell {
        return makeCellFrom<TransitionLookup>(self, TransitionLookup.store);
    }
}

/**
 > struct NeuralEmbeddingLookup {
 >     exists: bool
 >     e0: int16
 >     e1: int16
 >     e2: int16
 >     e3: int16
 > }
 */
export interface NeuralEmbeddingLookup {
    readonly $: 'NeuralEmbeddingLookup'
    exists: boolean
    e0: int16
    e1: int16
    e2: int16
    e3: int16
}

export const NeuralEmbeddingLookup = {
    create(args: {
        exists: boolean
        e0: int16
        e1: int16
        e2: int16
        e3: int16
    }): NeuralEmbeddingLookup {
        return {
            $: 'NeuralEmbeddingLookup',
            ...args
        }
    },
    fromSlice(s: c.Slice): NeuralEmbeddingLookup {
        return {
            $: 'NeuralEmbeddingLookup',
            exists: s.loadBoolean(),
            e0: s.loadIntBig(16),
            e1: s.loadIntBig(16),
            e2: s.loadIntBig(16),
            e3: s.loadIntBig(16),
        }
    },
    store(self: NeuralEmbeddingLookup, b: c.Builder): void {
        b.storeBit(self.exists);
        b.storeInt(self.e0, 16);
        b.storeInt(self.e1, 16);
        b.storeInt(self.e2, 16);
        b.storeInt(self.e3, 16);
    },
    toCell(self: NeuralEmbeddingLookup): c.Cell {
        return makeCellFrom<NeuralEmbeddingLookup>(self, NeuralEmbeddingLookup.store);
    }
}

/**
 > struct NeuralHeadLookup {
 >     exists: bool
 >     w0: int16
 >     w1: int16
 >     w2: int16
 >     w3: int16
 >     bias: int16
 > }
 */
export interface NeuralHeadLookup {
    readonly $: 'NeuralHeadLookup'
    exists: boolean
    w0: int16
    w1: int16
    w2: int16
    w3: int16
    bias: int16
}

export const NeuralHeadLookup = {
    create(args: {
        exists: boolean
        w0: int16
        w1: int16
        w2: int16
        w3: int16
        bias: int16
    }): NeuralHeadLookup {
        return {
            $: 'NeuralHeadLookup',
            ...args
        }
    },
    fromSlice(s: c.Slice): NeuralHeadLookup {
        return {
            $: 'NeuralHeadLookup',
            exists: s.loadBoolean(),
            w0: s.loadIntBig(16),
            w1: s.loadIntBig(16),
            w2: s.loadIntBig(16),
            w3: s.loadIntBig(16),
            bias: s.loadIntBig(16),
        }
    },
    store(self: NeuralHeadLookup, b: c.Builder): void {
        b.storeBit(self.exists);
        b.storeInt(self.w0, 16);
        b.storeInt(self.w1, 16);
        b.storeInt(self.w2, 16);
        b.storeInt(self.w3, 16);
        b.storeInt(self.bias, 16);
    },
    toCell(self: NeuralHeadLookup): c.Cell {
        return makeCellFrom<NeuralHeadLookup>(self, NeuralHeadLookup.store);
    }
}

/**
 > struct (0x4d455441) SetModelMeta {
 >     modelVersion: uint32
 >     vocabSize: uint16
 >     maxContext: uint8
 >     maxGenerate: uint8
 > }
 */
export interface SetModelMeta {
    readonly $: 'SetModelMeta'
    modelVersion: uint32
    vocabSize: uint16
    maxContext: uint8
    maxGenerate: uint8
}

export const SetModelMeta = {
    PREFIX: 0x4d455441,

    create(args: {
        modelVersion: uint32
        vocabSize: uint16
        maxContext: uint8
        maxGenerate: uint8
    }): SetModelMeta {
        return {
            $: 'SetModelMeta',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetModelMeta {
        loadAndCheckPrefix32(s, 0x4d455441, 'SetModelMeta');
        return {
            $: 'SetModelMeta',
            modelVersion: s.loadUintBig(32),
            vocabSize: s.loadUintBig(16),
            maxContext: s.loadUintBig(8),
            maxGenerate: s.loadUintBig(8),
        }
    },
    store(self: SetModelMeta, b: c.Builder): void {
        b.storeUint(0x4d455441, 32);
        b.storeUint(self.modelVersion, 32);
        b.storeUint(self.vocabSize, 16);
        b.storeUint(self.maxContext, 8);
        b.storeUint(self.maxGenerate, 8);
    },
    toCell(self: SetModelMeta): c.Cell {
        return makeCellFrom<SetModelMeta>(self, SetModelMeta.store);
    }
}

/**
 > struct (0x544f4b4e) SetToken {
 >     tokenId: uint16
 >     tokenData: cell
 > }
 */
export interface SetToken {
    readonly $: 'SetToken'
    tokenId: uint16
    tokenData: c.Cell
}

export const SetToken = {
    PREFIX: 0x544f4b4e,

    create(args: {
        tokenId: uint16
        tokenData: c.Cell
    }): SetToken {
        return {
            $: 'SetToken',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetToken {
        loadAndCheckPrefix32(s, 0x544f4b4e, 'SetToken');
        return {
            $: 'SetToken',
            tokenId: s.loadUintBig(16),
            tokenData: s.loadRef(),
        }
    },
    store(self: SetToken, b: c.Builder): void {
        b.storeUint(0x544f4b4e, 32);
        b.storeUint(self.tokenId, 16);
        b.storeRef(self.tokenData);
    },
    toCell(self: SetToken): c.Cell {
        return makeCellFrom<SetToken>(self, SetToken.store);
    }
}

/**
 > struct (0x5452414e) SetTransition {
 >     previousToken: uint16
 >     nextToken: uint16
 >     score: int16
 > }
 */
export interface SetTransition {
    readonly $: 'SetTransition'
    previousToken: uint16
    nextToken: uint16
    score: int16
}

export const SetTransition = {
    PREFIX: 0x5452414e,

    create(args: {
        previousToken: uint16
        nextToken: uint16
        score: int16
    }): SetTransition {
        return {
            $: 'SetTransition',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetTransition {
        loadAndCheckPrefix32(s, 0x5452414e, 'SetTransition');
        return {
            $: 'SetTransition',
            previousToken: s.loadUintBig(16),
            nextToken: s.loadUintBig(16),
            score: s.loadIntBig(16),
        }
    },
    store(self: SetTransition, b: c.Builder): void {
        b.storeUint(0x5452414e, 32);
        b.storeUint(self.previousToken, 16);
        b.storeUint(self.nextToken, 16);
        b.storeInt(self.score, 16);
    },
    toCell(self: SetTransition): c.Cell {
        return makeCellFrom<SetTransition>(self, SetTransition.store);
    }
}

/**
 > struct (0x434c5254) ClearTransition {
 >     previousToken: uint16
 > }
 */
export interface ClearTransition {
    readonly $: 'ClearTransition'
    previousToken: uint16
}

export const ClearTransition = {
    PREFIX: 0x434c5254,

    create(args: {
        previousToken: uint16
    }): ClearTransition {
        return {
            $: 'ClearTransition',
            ...args
        }
    },
    fromSlice(s: c.Slice): ClearTransition {
        loadAndCheckPrefix32(s, 0x434c5254, 'ClearTransition');
        return {
            $: 'ClearTransition',
            previousToken: s.loadUintBig(16),
        }
    },
    store(self: ClearTransition, b: c.Builder): void {
        b.storeUint(0x434c5254, 32);
        b.storeUint(self.previousToken, 16);
    },
    toCell(self: ClearTransition): c.Cell {
        return makeCellFrom<ClearTransition>(self, ClearTransition.store);
    }
}

/**
 > struct (0x4b4e4f57) SetKnownReply {
 >     promptHash: uint256
 >     replyBody: cell
 > }
 */
export interface SetKnownReply {
    readonly $: 'SetKnownReply'
    promptHash: uint256
    replyBody: c.Cell
}

export const SetKnownReply = {
    PREFIX: 0x4b4e4f57,

    create(args: {
        promptHash: uint256
        replyBody: c.Cell
    }): SetKnownReply {
        return {
            $: 'SetKnownReply',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetKnownReply {
        loadAndCheckPrefix32(s, 0x4b4e4f57, 'SetKnownReply');
        return {
            $: 'SetKnownReply',
            promptHash: s.loadUintBig(256),
            replyBody: s.loadRef(),
        }
    },
    store(self: SetKnownReply, b: c.Builder): void {
        b.storeUint(0x4b4e4f57, 32);
        b.storeUint(self.promptHash, 256);
        b.storeRef(self.replyBody);
    },
    toCell(self: SetKnownReply): c.Cell {
        return makeCellFrom<SetKnownReply>(self, SetKnownReply.store);
    }
}

/**
 > struct (0x434c524b) ClearKnownReply {
 >     promptHash: uint256
 > }
 */
export interface ClearKnownReply {
    readonly $: 'ClearKnownReply'
    promptHash: uint256
}

export const ClearKnownReply = {
    PREFIX: 0x434c524b,

    create(args: {
        promptHash: uint256
    }): ClearKnownReply {
        return {
            $: 'ClearKnownReply',
            ...args
        }
    },
    fromSlice(s: c.Slice): ClearKnownReply {
        loadAndCheckPrefix32(s, 0x434c524b, 'ClearKnownReply');
        return {
            $: 'ClearKnownReply',
            promptHash: s.loadUintBig(256),
        }
    },
    store(self: ClearKnownReply, b: c.Builder): void {
        b.storeUint(0x434c524b, 32);
        b.storeUint(self.promptHash, 256);
    },
    toCell(self: ClearKnownReply): c.Cell {
        return makeCellFrom<ClearKnownReply>(self, ClearKnownReply.store);
    }
}

/**
 > struct (0x50415553) SetPaused {
 >     isPaused: bool
 > }
 */
export interface SetPaused {
    readonly $: 'SetPaused'
    isPaused: boolean
}

export const SetPaused = {
    PREFIX: 0x50415553,

    create(args: {
        isPaused: boolean
    }): SetPaused {
        return {
            $: 'SetPaused',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetPaused {
        loadAndCheckPrefix32(s, 0x50415553, 'SetPaused');
        return {
            $: 'SetPaused',
            isPaused: s.loadBoolean(),
        }
    },
    store(self: SetPaused, b: c.Builder): void {
        b.storeUint(0x50415553, 32);
        b.storeBit(self.isPaused);
    },
    toCell(self: SetPaused): c.Cell {
        return makeCellFrom<SetPaused>(self, SetPaused.store);
    }
}

/**
 > struct (0x57495448) Withdraw {
 >     to: address
 >     amount: coins
 > }
 */
export interface Withdraw {
    readonly $: 'Withdraw'
    to: c.Address
    amount: coins
}

export const Withdraw = {
    PREFIX: 0x57495448,

    create(args: {
        to: c.Address
        amount: coins
    }): Withdraw {
        return {
            $: 'Withdraw',
            ...args
        }
    },
    fromSlice(s: c.Slice): Withdraw {
        loadAndCheckPrefix32(s, 0x57495448, 'Withdraw');
        return {
            $: 'Withdraw',
            to: s.loadAddress(),
            amount: s.loadCoins(),
        }
    },
    store(self: Withdraw, b: c.Builder): void {
        b.storeUint(0x57495448, 32);
        b.storeAddress(self.to);
        b.storeCoins(self.amount);
    },
    toCell(self: Withdraw): c.Cell {
        return makeCellFrom<Withdraw>(self, Withdraw.store);
    }
}

// ————————————————————————————————————————————
//    class TinyLm
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

export class TinyLm implements c.Contract {
    static CodeCell = c.Cell.fromBase64('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');

    static Errors = {
        'Errors.NotOwner': 100,
        'Errors.Paused': 101,
        'Errors.InvalidToken': 102,
        'Errors.InvalidConfig': 103,
        'Errors.InvalidAmount': 104,
        'Errors.InvalidPrompt': 105,
        'Errors.InvalidMessage': 65535,
    }

    readonly address: c.Address
    readonly init: { code: c.Cell, data: c.Cell } | undefined

    protected constructor(address: c.Address, init?: { code: c.Cell, data: c.Cell }) {
        this.address = address;
        this.init = init;
    }

    static fromAddress(address: c.Address) {
        return new TinyLm(address);
    }

    static fromStorage(emptyStorage: {
        owner: c.Address
        modelVersion: uint32
        vocabSize: uint16
        maxContext: uint8
        maxGenerate: uint8
        tokenBytes: c.Dictionary<uint16, c.Cell>
        transitions: c.Dictionary<uint16, TransitionRow>
        neuralState: CellRef<NeuralState>
        knownReplies: c.Dictionary<uint256, c.Cell>
        isPaused: boolean
    }, deployedOptions?: DeployedAddrOptions) {
        const initialState = {
            code: deployedOptions?.overrideContractCode ?? TinyLm.CodeCell,
            data: Storage.toCell(Storage.create(emptyStorage)),
        };
        const address = calculateDeployedAddress(initialState.code, initialState.data, deployedOptions ?? {});
        return new TinyLm(address, initialState);
    }

    static createCellOfSetModelMeta(body: {
        modelVersion: uint32
        vocabSize: uint16
        maxContext: uint8
        maxGenerate: uint8
    }) {
        return SetModelMeta.toCell(SetModelMeta.create(body));
    }

    static createCellOfSetToken(body: {
        tokenId: uint16
        tokenData: c.Cell
    }) {
        return SetToken.toCell(SetToken.create(body));
    }

    static createCellOfSetTransition(body: {
        previousToken: uint16
        nextToken: uint16
        score: int16
    }) {
        return SetTransition.toCell(SetTransition.create(body));
    }

    static createCellOfClearTransition(body: {
        previousToken: uint16
    }) {
        return ClearTransition.toCell(ClearTransition.create(body));
    }

    static createCellOfSetKnownReply(body: {
        promptHash: uint256
        replyBody: c.Cell
    }) {
        return SetKnownReply.toCell(SetKnownReply.create(body));
    }

    static createCellOfClearKnownReply(body: {
        promptHash: uint256
    }) {
        return ClearKnownReply.toCell(ClearKnownReply.create(body));
    }

    static createCellOfSetPaused(body: {
        isPaused: boolean
    }) {
        return SetPaused.toCell(SetPaused.create(body));
    }

    static createCellOfWithdraw(body: {
        to: c.Address
        amount: coins
    }) {
        return Withdraw.toCell(Withdraw.create(body));
    }

    async sendDeploy(provider: ContractProvider, via: Sender, msgValue: coins, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: c.Cell.EMPTY,
            ...extraOptions
        });
    }

    async sendSetModelMeta(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        modelVersion: uint32
        vocabSize: uint16
        maxContext: uint8
        maxGenerate: uint8
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetModelMeta.toCell(SetModelMeta.create(body)),
            ...extraOptions
        });
    }

    async sendSetToken(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        tokenId: uint16
        tokenData: c.Cell
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetToken.toCell(SetToken.create(body)),
            ...extraOptions
        });
    }

    async sendSetTransition(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        previousToken: uint16
        nextToken: uint16
        score: int16
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetTransition.toCell(SetTransition.create(body)),
            ...extraOptions
        });
    }

    async sendClearTransition(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        previousToken: uint16
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: ClearTransition.toCell(ClearTransition.create(body)),
            ...extraOptions
        });
    }

    async sendSetKnownReply(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        promptHash: uint256
        replyBody: c.Cell
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetKnownReply.toCell(SetKnownReply.create(body)),
            ...extraOptions
        });
    }

    async sendClearKnownReply(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        promptHash: uint256
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: ClearKnownReply.toCell(ClearKnownReply.create(body)),
            ...extraOptions
        });
    }

    async sendSetPaused(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        isPaused: boolean
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetPaused.toCell(SetPaused.create(body)),
            ...extraOptions
        });
    }

    async sendWithdraw(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        to: c.Address
        amount: coins
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: Withdraw.toCell(Withdraw.create(body)),
            ...extraOptions
        });
    }

    async getOwner(provider: ContractProvider): Promise<c.Address> {
        const r = StackReader.fromGetMethod(1, await provider.get('owner', []));
        return r.readSlice().loadAddress();
    }

    async getConfig(provider: ContractProvider): Promise<TinyLmConfig> {
        const r = StackReader.fromGetMethod(6, await provider.get('config', []));
        return ({
            $: 'TinyLmConfig',
            owner: r.readSlice().loadAddress(),
            modelVersion: r.readBigInt(),
            vocabSize: r.readBigInt(),
            maxContext: r.readBigInt(),
            maxGenerate: r.readBigInt(),
            isPaused: r.readBoolean(),
        });
    }

    async getToken(provider: ContractProvider, tokenId: uint16): Promise<TokenLookup> {
        const r = StackReader.fromGetMethod(2, await provider.get('token', [
            { type: 'int', value: tokenId },
        ]));
        return ({
            $: 'TokenLookup',
            exists: r.readBoolean(),
            tokenData: r.readCell(),
        });
    }

    async getTransition(provider: ContractProvider, previousToken: uint16): Promise<TransitionLookup> {
        const r = StackReader.fromGetMethod(3, await provider.get('transition', [
            { type: 'int', value: previousToken },
        ]));
        return ({
            $: 'TransitionLookup',
            exists: r.readBoolean(),
            nextToken: r.readBigInt(),
            score: r.readBigInt(),
        });
    }

    async getNeuralEmbedding(provider: ContractProvider, tokenId: uint16): Promise<NeuralEmbeddingLookup> {
        const r = StackReader.fromGetMethod(5, await provider.get('neuralEmbedding', [
            { type: 'int', value: tokenId },
        ]));
        return ({
            $: 'NeuralEmbeddingLookup',
            exists: r.readBoolean(),
            e0: r.readBigInt(),
            e1: r.readBigInt(),
            e2: r.readBigInt(),
            e3: r.readBigInt(),
        });
    }

    async getNeuralHead(provider: ContractProvider, tokenId: uint16): Promise<NeuralHeadLookup> {
        const r = StackReader.fromGetMethod(6, await provider.get('neuralHead', [
            { type: 'int', value: tokenId },
        ]));
        return ({
            $: 'NeuralHeadLookup',
            exists: r.readBoolean(),
            w0: r.readBigInt(),
            w1: r.readBigInt(),
            w2: r.readBigInt(),
            w3: r.readBigInt(),
            bias: r.readBigInt(),
        });
    }

    async getNeuralPredictNext(provider: ContractProvider, previousToken: uint16): Promise<uint16> {
        const r = StackReader.fromGetMethod(1, await provider.get('neuralPredictNext', [
            { type: 'int', value: previousToken },
        ]));
        return r.readBigInt();
    }

    async getPredictNext(provider: ContractProvider, previousToken: uint16): Promise<uint16> {
        const r = StackReader.fromGetMethod(1, await provider.get('predictNext', [
            { type: 'int', value: previousToken },
        ]));
        return r.readBigInt();
    }
}
