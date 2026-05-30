// AUTO-GENERATED, do not edit
// It's a TypeScript wrapper for a ShardedLmCoordinator contract in Tolk.
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
 > struct ShardedJob {
 >     user: address
 >     hidden: ShardedHidden
 >     round: uint8
 >     generated: uint8
 >     replyBody: cell
 >     pending: uint8
 >     received: uint8
 >     bestToken: uint16
 >     bestScore: int32
 >     hasBest: bool
 > }
 */
export interface ShardedJob {
    readonly $: 'ShardedJob'
    user: c.Address
    hidden: ShardedHidden
    round: uint8
    generated: uint8
    replyBody: c.Cell
    pending: uint8
    received: uint8
    bestToken: uint16
    bestScore: int32
    hasBest: boolean
}

export const ShardedJob = {
    create(args: {
        user: c.Address
        hidden: ShardedHidden
        round: uint8
        generated: uint8
        replyBody: c.Cell
        pending: uint8
        received: uint8
        bestToken: uint16
        bestScore: int32
        hasBest: boolean
    }): ShardedJob {
        return {
            $: 'ShardedJob',
            ...args
        }
    },
    fromSlice(s: c.Slice): ShardedJob {
        return {
            $: 'ShardedJob',
            user: s.loadAddress(),
            hidden: ShardedHidden.fromSlice(s),
            round: s.loadUintBig(8),
            generated: s.loadUintBig(8),
            replyBody: s.loadRef(),
            pending: s.loadUintBig(8),
            received: s.loadUintBig(8),
            bestToken: s.loadUintBig(16),
            bestScore: s.loadIntBig(32),
            hasBest: s.loadBoolean(),
        }
    },
    store(self: ShardedJob, b: c.Builder): void {
        b.storeAddress(self.user);
        ShardedHidden.store(self.hidden, b);
        b.storeUint(self.round, 8);
        b.storeUint(self.generated, 8);
        b.storeRef(self.replyBody);
        b.storeUint(self.pending, 8);
        b.storeUint(self.received, 8);
        b.storeUint(self.bestToken, 16);
        b.storeInt(self.bestScore, 32);
        b.storeBit(self.hasBest);
    },
    toCell(self: ShardedJob): c.Cell {
        return makeCellFrom<ShardedJob>(self, ShardedJob.store);
    }
}

/**
 > struct CoordinatorShardPair {
 >     shard0: address
 >     shard1: address
 > }
 */
export interface CoordinatorShardPair {
    readonly $: 'CoordinatorShardPair'
    shard0: c.Address
    shard1: c.Address
}

export const CoordinatorShardPair = {
    create(args: {
        shard0: c.Address
        shard1: c.Address
    }): CoordinatorShardPair {
        return {
            $: 'CoordinatorShardPair',
            ...args
        }
    },
    fromSlice(s: c.Slice): CoordinatorShardPair {
        return {
            $: 'CoordinatorShardPair',
            shard0: s.loadAddress(),
            shard1: s.loadAddress(),
        }
    },
    store(self: CoordinatorShardPair, b: c.Builder): void {
        b.storeAddress(self.shard0);
        b.storeAddress(self.shard1);
    },
    toCell(self: CoordinatorShardPair): c.Cell {
        return makeCellFrom<CoordinatorShardPair>(self, CoordinatorShardPair.store);
    }
}

/**
 > struct CoordinatorShards {
 >     first: Cell<CoordinatorShardPair>
 >     second: Cell<CoordinatorShardPair>
 > }
 */
export interface CoordinatorShards {
    readonly $: 'CoordinatorShards'
    first: CellRef<CoordinatorShardPair>
    second: CellRef<CoordinatorShardPair>
}

export const CoordinatorShards = {
    create(args: {
        first: CellRef<CoordinatorShardPair>
        second: CellRef<CoordinatorShardPair>
    }): CoordinatorShards {
        return {
            $: 'CoordinatorShards',
            ...args
        }
    },
    fromSlice(s: c.Slice): CoordinatorShards {
        return {
            $: 'CoordinatorShards',
            first: loadCellRef<CoordinatorShardPair>(s, CoordinatorShardPair.fromSlice),
            second: loadCellRef<CoordinatorShardPair>(s, CoordinatorShardPair.fromSlice),
        }
    },
    store(self: CoordinatorShards, b: c.Builder): void {
        storeCellRef<CoordinatorShardPair>(self.first, b, CoordinatorShardPair.store);
        storeCellRef<CoordinatorShardPair>(self.second, b, CoordinatorShardPair.store);
    },
    toCell(self: CoordinatorShards): c.Cell {
        return makeCellFrom<CoordinatorShards>(self, CoordinatorShards.store);
    }
}

/**
 > struct CoordinatorStorage {
 >     owner: address
 >     nextJobId: uint32
 >     maxContext: uint8
 >     maxGenerate: uint8
 >     shards: Cell<CoordinatorShards>
 >     tokenBytes: map<uint16, cell>
 >     embeddings: map<uint16, ShardedHidden>
 >     jobs: map<uint32, ShardedJob>
 >     isPaused: bool
 > }
 */
export interface CoordinatorStorage {
    readonly $: 'CoordinatorStorage'
    owner: c.Address
    nextJobId: uint32
    maxContext: uint8
    maxGenerate: uint8
    shards: CellRef<CoordinatorShards>
    tokenBytes: c.Dictionary<uint16, c.Cell>
    embeddings: c.Dictionary<uint16, ShardedHidden>
    jobs: c.Dictionary<uint32, ShardedJob>
    isPaused: boolean
}

export const CoordinatorStorage = {
    create(args: {
        owner: c.Address
        nextJobId: uint32
        maxContext: uint8
        maxGenerate: uint8
        shards: CellRef<CoordinatorShards>
        tokenBytes: c.Dictionary<uint16, c.Cell>
        embeddings: c.Dictionary<uint16, ShardedHidden>
        jobs: c.Dictionary<uint32, ShardedJob>
        isPaused: boolean
    }): CoordinatorStorage {
        return {
            $: 'CoordinatorStorage',
            ...args
        }
    },
    fromSlice(s: c.Slice): CoordinatorStorage {
        return {
            $: 'CoordinatorStorage',
            owner: s.loadAddress(),
            nextJobId: s.loadUintBig(32),
            maxContext: s.loadUintBig(8),
            maxGenerate: s.loadUintBig(8),
            shards: loadCellRef<CoordinatorShards>(s, CoordinatorShards.fromSlice),
            tokenBytes: c.Dictionary.load<uint16, c.Cell>(c.Dictionary.Keys.BigUint(16), c.Dictionary.Values.Cell(), s),
            embeddings: c.Dictionary.load<uint16, ShardedHidden>(c.Dictionary.Keys.BigUint(16), createDictionaryValue<ShardedHidden>(ShardedHidden.fromSlice, ShardedHidden.store), s),
            jobs: c.Dictionary.load<uint32, ShardedJob>(c.Dictionary.Keys.BigUint(32), createDictionaryValue<ShardedJob>(ShardedJob.fromSlice, ShardedJob.store), s),
            isPaused: s.loadBoolean(),
        }
    },
    store(self: CoordinatorStorage, b: c.Builder): void {
        b.storeAddress(self.owner);
        b.storeUint(self.nextJobId, 32);
        b.storeUint(self.maxContext, 8);
        b.storeUint(self.maxGenerate, 8);
        storeCellRef<CoordinatorShards>(self.shards, b, CoordinatorShards.store);
        b.storeDict<uint16, c.Cell>(self.tokenBytes, c.Dictionary.Keys.BigUint(16), c.Dictionary.Values.Cell());
        b.storeDict<uint16, ShardedHidden>(self.embeddings, c.Dictionary.Keys.BigUint(16), createDictionaryValue<ShardedHidden>(ShardedHidden.fromSlice, ShardedHidden.store));
        b.storeDict<uint32, ShardedJob>(self.jobs, c.Dictionary.Keys.BigUint(32), createDictionaryValue<ShardedJob>(ShardedJob.fromSlice, ShardedJob.store));
        b.storeBit(self.isPaused);
    },
    toCell(self: CoordinatorStorage): c.Cell {
        return makeCellFrom<CoordinatorStorage>(self, CoordinatorStorage.store);
    }
}

/**
 > struct ShardedCoordinatorConfig {
 >     owner: address
 >     nextJobId: uint32
 >     maxContext: uint8
 >     maxGenerate: uint8
 >     shard0: address
 >     shard1: address
 >     shard2: address
 >     shard3: address
 >     isPaused: bool
 > }
 */
export interface ShardedCoordinatorConfig {
    readonly $: 'ShardedCoordinatorConfig'
    owner: c.Address
    nextJobId: uint32
    maxContext: uint8
    maxGenerate: uint8
    shard0: c.Address
    shard1: c.Address
    shard2: c.Address
    shard3: c.Address
    isPaused: boolean
}

export const ShardedCoordinatorConfig = {
    create(args: {
        owner: c.Address
        nextJobId: uint32
        maxContext: uint8
        maxGenerate: uint8
        shard0: c.Address
        shard1: c.Address
        shard2: c.Address
        shard3: c.Address
        isPaused: boolean
    }): ShardedCoordinatorConfig {
        return {
            $: 'ShardedCoordinatorConfig',
            ...args
        }
    },
    fromSlice(s: c.Slice): ShardedCoordinatorConfig {
        return {
            $: 'ShardedCoordinatorConfig',
            owner: s.loadAddress(),
            nextJobId: s.loadUintBig(32),
            maxContext: s.loadUintBig(8),
            maxGenerate: s.loadUintBig(8),
            shard0: s.loadAddress(),
            shard1: s.loadAddress(),
            shard2: s.loadAddress(),
            shard3: s.loadAddress(),
            isPaused: s.loadBoolean(),
        }
    },
    store(self: ShardedCoordinatorConfig, b: c.Builder): void {
        b.storeAddress(self.owner);
        b.storeUint(self.nextJobId, 32);
        b.storeUint(self.maxContext, 8);
        b.storeUint(self.maxGenerate, 8);
        b.storeAddress(self.shard0);
        b.storeAddress(self.shard1);
        b.storeAddress(self.shard2);
        b.storeAddress(self.shard3);
        b.storeBit(self.isPaused);
    },
    toCell(self: ShardedCoordinatorConfig): c.Cell {
        return makeCellFrom<ShardedCoordinatorConfig>(self, ShardedCoordinatorConfig.store);
    }
}

/**
 > struct (0x53485244) SetShards {
 >     shards: Cell<CoordinatorShards>
 > }
 */
export interface SetShards {
    readonly $: 'SetShards'
    shards: CellRef<CoordinatorShards>
}

export const SetShards = {
    PREFIX: 0x53485244,

    create(args: {
        shards: CellRef<CoordinatorShards>
    }): SetShards {
        return {
            $: 'SetShards',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetShards {
        loadAndCheckPrefix32(s, 0x53485244, 'SetShards');
        return {
            $: 'SetShards',
            shards: loadCellRef<CoordinatorShards>(s, CoordinatorShards.fromSlice),
        }
    },
    store(self: SetShards, b: c.Builder): void {
        b.storeUint(0x53485244, 32);
        storeCellRef<CoordinatorShards>(self.shards, b, CoordinatorShards.store);
    },
    toCell(self: SetShards): c.Cell {
        return makeCellFrom<SetShards>(self, SetShards.store);
    }
}

/**
 > struct (0x53485053) SetCoordinatorPaused {
 >     isPaused: bool
 > }
 */
export interface SetCoordinatorPaused {
    readonly $: 'SetCoordinatorPaused'
    isPaused: boolean
}

export const SetCoordinatorPaused = {
    PREFIX: 0x53485053,

    create(args: {
        isPaused: boolean
    }): SetCoordinatorPaused {
        return {
            $: 'SetCoordinatorPaused',
            ...args
        }
    },
    fromSlice(s: c.Slice): SetCoordinatorPaused {
        loadAndCheckPrefix32(s, 0x53485053, 'SetCoordinatorPaused');
        return {
            $: 'SetCoordinatorPaused',
            isPaused: s.loadBoolean(),
        }
    },
    store(self: SetCoordinatorPaused, b: c.Builder): void {
        b.storeUint(0x53485053, 32);
        b.storeBit(self.isPaused);
    },
    toCell(self: SetCoordinatorPaused): c.Cell {
        return makeCellFrom<SetCoordinatorPaused>(self, SetCoordinatorPaused.store);
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

// ————————————————————————————————————————————
//    class ShardedLmCoordinator
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

export class ShardedLmCoordinator implements c.Contract {
    static CodeCell = c.Cell.fromBase64('te6ccgECGQEABsQAART/APSkE/S88sgLAQIBYgIDAgLOBAUCASAWFwIBIAYHAgEgDg8C8z4kZEw4CDXScIfmCDXCx/AAMMAkXDi4wIg1ywimkKSJI4pMe1E0PpI0x/TB9MH1DH4kiXHBfLgyAXXTATI+lITyx/LB8sHzM7J7VTg1ywimkKCnOMC1ywikppipI4QMdMf0wfTD9cKH/iSVTDwA+AwggD//gHHAPL0gCAkAbQQOF8IgBD0Dm+hkltt4cgC0FjOAdTR0CDXSyPPMVighAm8kjB/mCLPMqDCBMMA4pJbbeDPFsmAC/viS7UTQ+kjTH9MH0wfU9AT0BPQEINcKAPLQzArTHzEg10nCB/LgzSDXSasCJ7vy4M1wVHAAlSTXScIHjp4E0wchwFeRf5UhwHfDAOKaMQOBAKCggwi2COMOAwToNCqkyM+QAAAAAskOyPpSJM8KDyPPCg8izwoPJc8KD8+IAAIYCgByMe1E0PpI0x/TB9MH1PQE9AT0BfiSKMcF8uDICNcKAAfI+lIWyx8UywcSywfM9AD0ABL0AMoAye1UAf4ezIuAQAAAAAAAAATPFlQgtoAg9EMLyPpSHMsfGMsHFssHJM8UE/QA9AAW9AAXzsntVAXQ1NTRAdD6SPpI0QLQ+kj6SNGCCcnDgMjPhQgU+lJQA/oCghBDTVBUzwuKJc8LH8+EAiTPCg8nzwoPJs8KDyjPCg/JcPsAggnJw4DICwL+ic8WFPpSUAP6AoIQQ01QVM8LiiTPCx/PhAIjzwoPJs8KDyXPCg8nzwoPyXD7AIIJycOAyM+FCBP6Ulj6AoIQQ01QVM8LiiPPCx/PhAIizwoPJc8KDyTPCg8mzwoPyXD7AIIJycOAyM+FCBL6UgH6AoIQQ01QVM8LihLLH8+EAgwNAAFCABrKDxLKD8oPyg/JcPsAAD0EChfCIAQ9A5voZzSD9IP0g/SD9GBAIHgMG1tbW1wgAfM7UTQ+kjTH9MH0wfU9AT0BPQEINcKACXQ1NTRAdD6SPpI0QLQ+kj6SNFWElADxwWSMn+YVhFQA8cFwwDikjF/l1YQWMcFwwDikzA+f5UfxwXDAOLy4MpTwYAg9A7y4Mv6SNIP0g/SD9IP0wfTB9TTB9MH0w/SH9IA0YBAB4IIA//4RGSi6AREZAfL0VhezkX+WVhUhvMMA4pRbf1cWlFcVVxXipFMBvuMCVxcIyPpSF8oPFcoPE8oPyg/LB8sHzMsHHssHGssPGMofGcoAQJeAIPRDA8j6UhLLH8sHE8sHFMwS9AAS9AD0AM7J7VQRAv4wbEQ+P1R+21R9y1R9yy1WGvABIG6OzzAxOzs9G4Ag9FswBsj6UhXLHxPLB8sHzPQAFfQAFPQAFM7J7VQBjo4wiMjPkAAAAAIB0M8Wyd+CCJiWgMjPhQgT+lJY+gJxzwtqzMlw+wDgP6RULbBUa7BUa7BUa7BSsBEY8AJWEyy+EhMAAj8B/pIwf5TAAMMA4o4/XwQ6OjxQq4Ag9FswBcj6UhTLHxLLB8sHzBX0ABX0ABP0ABLOye1UggiYloDIz4UIE/pSWPoCcc8LaszJcPsA4A+kBMj6UiPPCg8izwoPIc8KDy/PCg8kzwsHARESAcsHH8wcywdwzws4VCDkgCD0QwnI+lIUAf4Yyx8WywcUywcizxT0ABL0ABT0ABLOye1UAdDU1NEB0PpI+kjRAtD6SPpI0YIJycOAyM+FCBT6UlAD+gKCEENNUFTPC4oozwsfJM8LByXPCg8nzwoPKc8KDybPCg/JcPsAggnJw4DIz4UIFPpSUAP6AoIQQ01QVM8LiifPCx8jFQDuzwsHJM8KDybPCg8ozwoPJc8KD8lw+wCCCcnDgMjPhQgT+lJY+gKCEENNUFTPC4omzwsfIs8LByPPCg8lzwoPJ88KDyTPCg/JcPsAggnJw4DIz4UIEvpSAfoCghBDTVBUzwuKFcsfFMsHE8oPyg8Syg/KD8lw+wABpb4mp2omh9JBjpj5jrhYOA6GmPmJBrpOED+XBmkGuk1YEsXflwZrgqOABKkmuk4QPHTwJpg5DgK8i/ypDgO+GAcU0YgcCAUFBBhFsEcYcBgnQ2CkGABZvJNvaiaH0kaY/pg+mD6noA+gD6AOuFAADoampogOh9JH0kaIFofSR9JGiggkAO4hwEiRf5UhwGjDAOKRf5UhwCzDAOKYMQKmeIMItgiOVCHAVJF/lSHAdMMA4pgxAaZ4gwi2CI47IcA/mDEEphCDCLYIjiohwkCVIcFbwwCRcOKSMX+fIcJglQHBe8MAkjFw4sMA4pcEpIMItggE3gTiUETiWOJAEw==');

    static Errors = {
        'ShardedErrors.NotOwner': 200,
        'ShardedErrors.NotShard': 202,
        'ShardedErrors.JobNotFound': 203,
        'ShardedErrors.Paused': 204,
        'ShardedErrors.InvalidPrompt': 205,
        'ShardedErrors.InvalidMessage': 65534,
    }

    readonly address: c.Address
    readonly init: { code: c.Cell, data: c.Cell } | undefined

    protected constructor(address: c.Address, init?: { code: c.Cell, data: c.Cell }) {
        this.address = address;
        this.init = init;
    }

    static fromAddress(address: c.Address) {
        return new ShardedLmCoordinator(address);
    }

    static fromStorage(emptyStorage: {
        owner: c.Address
        nextJobId: uint32
        maxContext: uint8
        maxGenerate: uint8
        shards: CellRef<CoordinatorShards>
        tokenBytes: c.Dictionary<uint16, c.Cell>
        embeddings: c.Dictionary<uint16, ShardedHidden>
        jobs: c.Dictionary<uint32, ShardedJob>
        isPaused: boolean
    }, deployedOptions?: DeployedAddrOptions) {
        const initialState = {
            code: deployedOptions?.overrideContractCode ?? ShardedLmCoordinator.CodeCell,
            data: CoordinatorStorage.toCell(CoordinatorStorage.create(emptyStorage)),
        };
        const address = calculateDeployedAddress(initialState.code, initialState.data, deployedOptions ?? {});
        return new ShardedLmCoordinator(address, initialState);
    }

    static createCellOfSetShards(body: {
        shards: CellRef<CoordinatorShards>
    }) {
        return SetShards.toCell(SetShards.create(body));
    }

    static createCellOfSetCoordinatorPaused(body: {
        isPaused: boolean
    }) {
        return SetCoordinatorPaused.toCell(SetCoordinatorPaused.create(body));
    }

    static createCellOfShardResult(body: {
        jobId: uint32
        round: uint8
        tokenId: uint16
        score: int32
    }) {
        return ShardResult.toCell(ShardResult.create(body));
    }

    async sendDeploy(provider: ContractProvider, via: Sender, msgValue: coins, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: c.Cell.EMPTY,
            ...extraOptions
        });
    }

    async sendSetShards(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        shards: CellRef<CoordinatorShards>
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetShards.toCell(SetShards.create(body)),
            ...extraOptions
        });
    }

    async sendSetCoordinatorPaused(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        isPaused: boolean
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SetCoordinatorPaused.toCell(SetCoordinatorPaused.create(body)),
            ...extraOptions
        });
    }

    async sendShardResult(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        jobId: uint32
        round: uint8
        tokenId: uint16
        score: int32
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: ShardResult.toCell(ShardResult.create(body)),
            ...extraOptions
        });
    }

    async getConfig(provider: ContractProvider): Promise<ShardedCoordinatorConfig> {
        const r = StackReader.fromGetMethod(9, await provider.get('config', []));
        return ({
            $: 'ShardedCoordinatorConfig',
            owner: r.readSlice().loadAddress(),
            nextJobId: r.readBigInt(),
            maxContext: r.readBigInt(),
            maxGenerate: r.readBigInt(),
            shard0: r.readSlice().loadAddress(),
            shard1: r.readSlice().loadAddress(),
            shard2: r.readSlice().loadAddress(),
            shard3: r.readSlice().loadAddress(),
            isPaused: r.readBoolean(),
        });
    }

    async getEncode(provider: ContractProvider, body: c.Cell): Promise<ShardedHidden> {
        const r = StackReader.fromGetMethod(4, await provider.get('encode', [
            { type: 'cell', cell: body },
        ]));
        return ({
            $: 'ShardedHidden',
            h0: r.readBigInt(),
            h1: r.readBigInt(),
            h2: r.readBigInt(),
            h3: r.readBigInt(),
        });
    }
}
