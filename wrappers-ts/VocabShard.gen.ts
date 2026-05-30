// AUTO-GENERATED, do not edit
// It's a TypeScript wrapper for a VocabShard contract in Tolk.
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
 > struct ShardedHidden {
 >     h0: int16
 >     h1: int16
 >     h2: int16
 >     h3: int16
 > }
 */
export interface ShardedHidden {
    readonly $: 'ShardedHidden'
    h0: int16
    h1: int16
    h2: int16
    h3: int16
}

export const ShardedHidden = {
    create(args: {
        h0: int16
        h1: int16
        h2: int16
        h3: int16
    }): ShardedHidden {
        return {
            $: 'ShardedHidden',
            ...args
        }
    },
    fromSlice(s: c.Slice): ShardedHidden {
        return {
            $: 'ShardedHidden',
            h0: s.loadIntBig(16),
            h1: s.loadIntBig(16),
            h2: s.loadIntBig(16),
            h3: s.loadIntBig(16),
        }
    },
    store(self: ShardedHidden, b: c.Builder): void {
        b.storeInt(self.h0, 16);
        b.storeInt(self.h1, 16);
        b.storeInt(self.h2, 16);
        b.storeInt(self.h3, 16);
    },
    toCell(self: ShardedHidden): c.Cell {
        return makeCellFrom<ShardedHidden>(self, ShardedHidden.store);
    }
}

/**
 > struct ShardHead {
 >     w0: int16
 >     w1: int16
 >     w2: int16
 >     w3: int16
 >     bias: int16
 > }
 */
export interface ShardHead {
    readonly $: 'ShardHead'
    w0: int16
    w1: int16
    w2: int16
    w3: int16
    bias: int16
}

export const ShardHead = {
    create(args: {
        w0: int16
        w1: int16
        w2: int16
        w3: int16
        bias: int16
    }): ShardHead {
        return {
            $: 'ShardHead',
            ...args
        }
    },
    fromSlice(s: c.Slice): ShardHead {
        return {
            $: 'ShardHead',
            w0: s.loadIntBig(16),
            w1: s.loadIntBig(16),
            w2: s.loadIntBig(16),
            w3: s.loadIntBig(16),
            bias: s.loadIntBig(16),
        }
    },
    store(self: ShardHead, b: c.Builder): void {
        b.storeInt(self.w0, 16);
        b.storeInt(self.w1, 16);
        b.storeInt(self.w2, 16);
        b.storeInt(self.w3, 16);
        b.storeInt(self.bias, 16);
    },
    toCell(self: ShardHead): c.Cell {
        return makeCellFrom<ShardHead>(self, ShardHead.store);
    }
}

/**
 > struct VocabShardPage {
 >     token0: uint16
 >     head0: ShardHead
 >     token1: uint16
 >     head1: ShardHead
 > }
 */
export interface VocabShardPage {
    readonly $: 'VocabShardPage'
    token0: uint16
    head0: ShardHead
    token1: uint16
    head1: ShardHead
}

export const VocabShardPage = {
    create(args: {
        token0: uint16
        head0: ShardHead
        token1: uint16
        head1: ShardHead
    }): VocabShardPage {
        return {
            $: 'VocabShardPage',
            ...args
        }
    },
    fromSlice(s: c.Slice): VocabShardPage {
        return {
            $: 'VocabShardPage',
            token0: s.loadUintBig(16),
            head0: ShardHead.fromSlice(s),
            token1: s.loadUintBig(16),
            head1: ShardHead.fromSlice(s),
        }
    },
    store(self: VocabShardPage, b: c.Builder): void {
        b.storeUint(self.token0, 16);
        ShardHead.store(self.head0, b);
        b.storeUint(self.token1, 16);
        ShardHead.store(self.head1, b);
    },
    toCell(self: VocabShardPage): c.Cell {
        return makeCellFrom<VocabShardPage>(self, VocabShardPage.store);
    }
}

/**
 > struct VocabShardStorage {
 >     owner: address
 >     coordinator: address
 >     shardId: uint8
 >     page: Cell<VocabShardPage>
 >     isPaused: bool
 > }
 */
export interface VocabShardStorage {
    readonly $: 'VocabShardStorage'
    owner: c.Address
    coordinator: c.Address
    shardId: uint8
    page: CellRef<VocabShardPage>
    isPaused: boolean
}

export const VocabShardStorage = {
    create(args: {
        owner: c.Address
        coordinator: c.Address
        shardId: uint8
        page: CellRef<VocabShardPage>
        isPaused: boolean
    }): VocabShardStorage {
        return {
            $: 'VocabShardStorage',
            ...args
        }
    },
    fromSlice(s: c.Slice): VocabShardStorage {
        return {
            $: 'VocabShardStorage',
            owner: s.loadAddress(),
            coordinator: s.loadAddress(),
            shardId: s.loadUintBig(8),
            page: loadCellRef<VocabShardPage>(s, VocabShardPage.fromSlice),
            isPaused: s.loadBoolean(),
        }
    },
    store(self: VocabShardStorage, b: c.Builder): void {
        b.storeAddress(self.owner);
        b.storeAddress(self.coordinator);
        b.storeUint(self.shardId, 8);
        storeCellRef<VocabShardPage>(self.page, b, VocabShardPage.store);
        b.storeBit(self.isPaused);
    },
    toCell(self: VocabShardStorage): c.Cell {
        return makeCellFrom<VocabShardStorage>(self, VocabShardStorage.store);
    }
}

/**
 > struct VocabShardConfig {
 >     owner: address
 >     coordinator: address
 >     shardId: uint8
 >     token0: uint16
 >     token1: uint16
 >     isPaused: bool
 > }
 */
export interface VocabShardConfig {
    readonly $: 'VocabShardConfig'
    owner: c.Address
    coordinator: c.Address
    shardId: uint8
    token0: uint16
    token1: uint16
    isPaused: boolean
}

export const VocabShardConfig = {
    create(args: {
        owner: c.Address
        coordinator: c.Address
        shardId: uint8
        token0: uint16
        token1: uint16
        isPaused: boolean
    }): VocabShardConfig {
        return {
            $: 'VocabShardConfig',
            ...args
        }
    },
    fromSlice(s: c.Slice): VocabShardConfig {
        return {
            $: 'VocabShardConfig',
            owner: s.loadAddress(),
            coordinator: s.loadAddress(),
            shardId: s.loadUintBig(8),
            token0: s.loadUintBig(16),
            token1: s.loadUintBig(16),
            isPaused: s.loadBoolean(),
        }
    },
    store(self: VocabShardConfig, b: c.Builder): void {
        b.storeAddress(self.owner);
        b.storeAddress(self.coordinator);
        b.storeUint(self.shardId, 8);
        b.storeUint(self.token0, 16);
        b.storeUint(self.token1, 16);
        b.storeBit(self.isPaused);
    },
    toCell(self: VocabShardConfig): c.Cell {
        return makeCellFrom<VocabShardConfig>(self, VocabShardConfig.store);
    }
}

/**
 > struct (0x52534c54) ShardResult {
 >     jobId: uint32
 >     round: uint8
 >     tokenId: uint16
 >     score: int32
 > }
 */
export interface ShardResult {
    readonly $: 'ShardResult'
    jobId: uint32
    round: uint8
    tokenId: uint16
    score: int32
}

export const ShardResult = {
    PREFIX: 0x52534c54,

    create(args: {
        jobId: uint32
        round: uint8
        tokenId: uint16
        score: int32
    }): ShardResult {
        return {
            $: 'ShardResult',
            ...args
        }
    },
    fromSlice(s: c.Slice): ShardResult {
        loadAndCheckPrefix32(s, 0x52534c54, 'ShardResult');
        return {
            $: 'ShardResult',
            jobId: s.loadUintBig(32),
            round: s.loadUintBig(8),
            tokenId: s.loadUintBig(16),
            score: s.loadIntBig(32),
        }
    },
    store(self: ShardResult, b: c.Builder): void {
        b.storeUint(0x52534c54, 32);
        b.storeUint(self.jobId, 32);
        b.storeUint(self.round, 8);
        b.storeUint(self.tokenId, 16);
        b.storeInt(self.score, 32);
    },
    toCell(self: ShardResult): c.Cell {
        return makeCellFrom<ShardResult>(self, ShardResult.store);
    }
}

/**
 > struct (0x434d5054) ShardCompute {
 >     jobId: uint32
 >     round: uint8
 >     hidden: ShardedHidden
 > }
 */
export interface ShardCompute {
    readonly $: 'ShardCompute'
    jobId: uint32
    round: uint8
    hidden: ShardedHidden
}

export const ShardCompute = {
    PREFIX: 0x434d5054,

    create(args: {
        jobId: uint32
        round: uint8
        hidden: ShardedHidden
    }): ShardCompute {
        return {
            $: 'ShardCompute',
            ...args
        }
    },
    fromSlice(s: c.Slice): ShardCompute {
        loadAndCheckPrefix32(s, 0x434d5054, 'ShardCompute');
        return {
            $: 'ShardCompute',
            jobId: s.loadUintBig(32),
            round: s.loadUintBig(8),
            hidden: ShardedHidden.fromSlice(s),
        }
    },
    store(self: ShardCompute, b: c.Builder): void {
        b.storeUint(0x434d5054, 32);
        b.storeUint(self.jobId, 32);
        b.storeUint(self.round, 8);
        ShardedHidden.store(self.hidden, b);
    },
    toCell(self: ShardCompute): c.Cell {
        return makeCellFrom<ShardCompute>(self, ShardCompute.store);
    }
}

/**
 > struct (0x56505345) SetVocabShardPaused {
 >     isPaused: bool
 > }
 */
export interface SetVocabShardPaused {
    readonly $: 'SetVocabShardPaused'
    isPaused: boolean
}

export const SetVocabShardPaused = {
    PREFIX: 0x56505345,

    create(args: {
        isPaused: boolean
    }): SetVocabShardPaused {
        return {
            $: 'SetVocabShardPaused',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetVocabShardPaused {
        loadAndCheckPrefix32(s, 0x56505345, 'SetVocabShardPaused');
        return {
            $: 'SetVocabShardPaused',
            isPaused: s.loadBoolean(),
        }
    },
    store(self: SetVocabShardPaused, b: c.Builder): void {
        b.storeUint(0x56505345, 32);
        b.storeBit(self.isPaused);
    },
    toCell(self: SetVocabShardPaused): c.Cell {
        return makeCellFrom<SetVocabShardPaused>(self, SetVocabShardPaused.store);
    }
}

// ————————————————————————————————————————————
//    class VocabShard
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

export class VocabShard implements c.Contract {
    static CodeCell = c.Cell.fromBase64('te6ccgECCQEAAaAAART/APSkE/S88sgLAQIBYgIDAZjQ+JGRMOAg1ywiGmqCpOMC1ywisoKaLI4oMe1E0PpI+kjTB9dM+JIkxwXy4MgE1woAA8j6UhL6UssHEszKAMntVOAwggD//gHHAPL0BAIBWAcIAf4x7UTQ+kgx+kjTBzHU1woA8tDM+JIixwXy4MnQ0w/SD9IP0g/SD9IP0w/SD9IP0g/SD9IP0Q3TH9MH0g/SD9IP1woPUjAREKhSL6geoFLdqBygUtuoGqBQCKBQhahQg6gSoAeoFqBQZKgToFAHoFMCvJMyMxKSMDLiggiYloDIBQFEic8WFfpSUAT6AoIQUlNMVM8LihTLHxPLBxLLD8ofyXD7AAYAAUIAa7km3tRND6SPpI0wfU1woAAdDTD9IPMdIPMdIPMdIPMdIPMdMP0g8x0g8x0g8x0g8x0g8x0ViACruUOO1E0NdM0NMP0g/SD9IP0g/SD9MP0g/SD9IP0g/SD9FS+6hS6qgZoFLIqBegUqaoFaBQA6BQsqhQkqigBqgVoFA0qBOgoFMCvJJsIZIwMuJwUgITg=');

    static Errors = {
        'ShardedErrors.NotOwner': 200,
        'ShardedErrors.NotCoordinator': 201,
        'ShardedErrors.Paused': 204,
        'ShardedErrors.InvalidMessage': 65534,
    }

    readonly address: c.Address
    readonly init: { code: c.Cell, data: c.Cell } | undefined

    protected constructor(address: c.Address, init?: { code: c.Cell, data: c.Cell }) {
        this.address = address;
        this.init = init;
    }

    static fromAddress(address: c.Address) {
        return new VocabShard(address);
    }

    static fromStorage(emptyStorage: {
        owner: c.Address
        coordinator: c.Address
        shardId: uint8
        page: CellRef<VocabShardPage>
        isPaused: boolean
    }, deployedOptions?: DeployedAddrOptions) {
        const initialState = {
            code: deployedOptions?.overrideContractCode ?? VocabShard.CodeCell,
            data: VocabShardStorage.toCell(VocabShardStorage.create(emptyStorage)),
        };
        const address = calculateDeployedAddress(initialState.code, initialState.data, deployedOptions ?? {});
        return new VocabShard(address, initialState);
    }

    static createCellOfShardCompute(body: {
        jobId: uint32
        round: uint8
        hidden: ShardedHidden
    }) {
        return ShardCompute.toCell(ShardCompute.create(body));
    }

    static createCellOfSetVocabShardPaused(body: {
        isPaused: boolean
    }) {
        return SetVocabShardPaused.toCell(SetVocabShardPaused.create(body));
    }

    async sendDeploy(provider: ContractProvider, via: Sender, msgValue: coins, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: c.Cell.EMPTY,
            ...extraOptions
        });
    }

    async sendShardCompute(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        jobId: uint32
        round: uint8
        hidden: ShardedHidden
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: ShardCompute.toCell(ShardCompute.create(body)),
            ...extraOptions
        });
    }

    async sendSetVocabShardPaused(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        isPaused: boolean
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetVocabShardPaused.toCell(SetVocabShardPaused.create(body)),
            ...extraOptions
        });
    }

    async getConfig(provider: ContractProvider): Promise<VocabShardConfig> {
        const r = StackReader.fromGetMethod(6, await provider.get('config', []));
        return ({
            $: 'VocabShardConfig',
            owner: r.readSlice().loadAddress(),
            coordinator: r.readSlice().loadAddress(),
            shardId: r.readBigInt(),
            token0: r.readBigInt(),
            token1: r.readBigInt(),
            isPaused: r.readBoolean(),
        });
    }

    async getScore(provider: ContractProvider, hidden: ShardedHidden): Promise<ShardResult> {
        const r = StackReader.fromGetMethod(4, await provider.get('score', [
            { type: 'int', value: hidden.h0 },
            { type: 'int', value: hidden.h1 },
            { type: 'int', value: hidden.h2 },
            { type: 'int', value: hidden.h3 },
        ]));
        return ({
            $: 'ShardResult',
            jobId: r.readBigInt(),
            round: r.readBigInt(),
            tokenId: r.readBigInt(),
            score: r.readBigInt(),
        });
    }
}
