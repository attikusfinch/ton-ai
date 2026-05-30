// AUTO-GENERATED, do not edit
// It's a TypeScript wrapper for a CraftGptMonoProbe contract in Tolk.
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

type int32 = bigint

type uint32 = bigint

/**
 > struct CraftProbeStorage {
 >     owner: address
 >     lastScore: int32
 > }
 */
export interface CraftProbeStorage {
    readonly $: 'CraftProbeStorage'
    owner: c.Address
    lastScore: int32
}

export const CraftProbeStorage = {
    create(args: {
        owner: c.Address
        lastScore: int32
    }): CraftProbeStorage {
        return {
            $: 'CraftProbeStorage',
            ...args
        }
    },
    fromSlice(s: c.Slice): CraftProbeStorage {
        return {
            $: 'CraftProbeStorage',
            owner: s.loadAddress(),
            lastScore: s.loadIntBig(32),
        }
    },
    store(self: CraftProbeStorage, b: c.Builder): void {
        b.storeAddress(self.owner);
        b.storeInt(self.lastScore, 32);
    },
    toCell(self: CraftProbeStorage): c.Cell {
        return makeCellFrom<CraftProbeStorage>(self, CraftProbeStorage.store);
    }
}

/**
 > struct CraftProbeConfig {
 >     owner: address
 >     lastScore: int32
 >     fullTokenWeightedContribs: uint32
 > }
 */
export interface CraftProbeConfig {
    readonly $: 'CraftProbeConfig'
    owner: c.Address
    lastScore: int32
    fullTokenWeightedContribs: uint32
}

export const CraftProbeConfig = {
    create(args: {
        owner: c.Address
        lastScore: int32
        fullTokenWeightedContribs: uint32
    }): CraftProbeConfig {
        return {
            $: 'CraftProbeConfig',
            ...args
        }
    },
    fromSlice(s: c.Slice): CraftProbeConfig {
        return {
            $: 'CraftProbeConfig',
            owner: s.loadAddress(),
            lastScore: s.loadIntBig(32),
            fullTokenWeightedContribs: s.loadUintBig(32),
        }
    },
    store(self: CraftProbeConfig, b: c.Builder): void {
        b.storeAddress(self.owner);
        b.storeInt(self.lastScore, 32);
        b.storeUint(self.fullTokenWeightedContribs, 32);
    },
    toCell(self: CraftProbeConfig): c.Cell {
        return makeCellFrom<CraftProbeConfig>(self, CraftProbeConfig.store);
    }
}

/**
 > type CraftProbeMessage = RunCraftProbe
 */
export type CraftProbeMessage = RunCraftProbe

export const CraftProbeMessage = {
    fromSlice(s: c.Slice): CraftProbeMessage {
        return RunCraftProbe.fromSlice(s);
    },
    store(self: CraftProbeMessage, b: c.Builder): void {
        RunCraftProbe.store(self, b);
    },
    toCell(self: CraftProbeMessage): c.Cell {
        return makeCellFrom<CraftProbeMessage>(self, CraftProbeMessage.store);
    }
}

/**
 > struct (0x43505242) RunCraftProbe {
 >     weightedContribs: uint32
 > }
 */
export interface RunCraftProbe {
    readonly $: 'RunCraftProbe'
    weightedContribs: uint32
}

export const RunCraftProbe = {
    PREFIX: 0x43505242,

    create(args: {
        weightedContribs: uint32
    }): RunCraftProbe {
        return {
            $: 'RunCraftProbe',
            ...args
        }
    },
    fromSlice(s: c.Slice): RunCraftProbe {
        loadAndCheckPrefix32(s, 0x43505242, 'RunCraftProbe');
        return {
            $: 'RunCraftProbe',
            weightedContribs: s.loadUintBig(32),
        }
    },
    store(self: RunCraftProbe, b: c.Builder): void {
        b.storeUint(0x43505242, 32);
        b.storeUint(self.weightedContribs, 32);
    },
    toCell(self: RunCraftProbe): c.Cell {
        return makeCellFrom<RunCraftProbe>(self, RunCraftProbe.store);
    }
}

// ————————————————————————————————————————————
//    class CraftGptMonoProbe
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

export class CraftGptMonoProbe implements c.Contract {
    static CodeCell = c.Cell.fromBase64('te6ccgEBBgEAxwABFP8A9KQT9LzyyAsBAgFiAgMAxtD4kZEw4CDXLCIagpIUjkgx7UTQAdcLHwH6SDBwIJNTE7mOKSGnH6YHgQEBqQimgCKnEaYDgQEBqQimgKghoAGAYakIpwOgqTgXAaQB6DEyyPpSyh/J7VTgMIIA//4BxwDy9AIBIAQFAG2+/0uBBJqYlcxxSQ04/TA8CAgNSEU0ARU4jTAcCAgNSEU0BUENAAwDDUhFOB0FScC4DSAPQ2EMAB+8k29qJofSRrhQ/BBCMoAE');

    static Errors = {
        'CraftProbeErrors.InvalidMessage': 65534,
    }

    readonly address: c.Address
    readonly init: { code: c.Cell, data: c.Cell } | undefined

    protected constructor(address: c.Address, init?: { code: c.Cell, data: c.Cell }) {
        this.address = address;
        this.init = init;
    }

    static fromAddress(address: c.Address) {
        return new CraftGptMonoProbe(address);
    }

    static fromStorage(emptyStorage: {
        owner: c.Address
        lastScore: int32
    }, deployedOptions?: DeployedAddrOptions) {
        const initialState = {
            code: deployedOptions?.overrideContractCode ?? CraftGptMonoProbe.CodeCell,
            data: CraftProbeStorage.toCell(CraftProbeStorage.create(emptyStorage)),
        };
        const address = calculateDeployedAddress(initialState.code, initialState.data, deployedOptions ?? {});
        return new CraftGptMonoProbe(address, initialState);
    }

    static createCellOfCraftProbeMessage(body: CraftProbeMessage) {
        return CraftProbeMessage.toCell(body);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, msgValue: coins, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: c.Cell.EMPTY,
            ...extraOptions
        });
    }

    async sendCraftProbeMessage(provider: ContractProvider, via: Sender, msgValue: coins, body: CraftProbeMessage, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: CraftProbeMessage.toCell(body),
            ...extraOptions
        });
    }

    async getConfig(provider: ContractProvider): Promise<CraftProbeConfig> {
        const r = StackReader.fromGetMethod(3, await provider.get('config', []));
        return ({
            $: 'CraftProbeConfig',
            owner: r.readSlice().loadAddress(),
            lastScore: r.readBigInt(),
            fullTokenWeightedContribs: r.readBigInt(),
        });
    }

    async getEstimate(provider: ContractProvider, weightedContribs: uint32): Promise<int32> {
        const r = StackReader.fromGetMethod(1, await provider.get('estimate', [
            { type: 'int', value: weightedContribs },
        ]));
        return r.readBigInt();
    }
}
