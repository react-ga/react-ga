// Type definitions for react-ga 2.4
// Project: https://github.com/react-ga/react-ga
// Definitions by: Tim Aldridge <https://github.com/telshin>
//                 Philip Karpiak <https://github.com/eswat>
//                 Jerry Reptak <https://github.com/jetfault>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import * as React from 'react';

/* tslint:disable no-any */

export interface EventArgs {
    category: string;
    action: string;
    label?: string;
    value?: number;
    nonInteraction?: boolean;
    transport?: string;
}

export interface GaOptions {
    name?: string;
    clientId?: string;
    sampleRate?: number;
    siteSpeedSampleRate?: number;
    alwaysSendReferrer?: boolean;
    allowAnchor?: boolean;
    cookieName?: string;
    cookieDomain?: string;
    cookieExpires?: number;
    legacyCookieDomain?: string;
    legacyHistoryImport?: boolean;
    allowLinker?: boolean;
    userId?: string;
}

export interface InitializeOptions {
    debug?: boolean;
    gaAddress?: string;
    testMode?: boolean;
    titleCase?: boolean;
    gaOptions?: GaOptions;
    alwaysSendToDefaultTracker?: boolean;
}

export type Tracker = {
    trackingId: string,
} & InitializeOptions;

export type TrackerNames = string[];

export interface FieldsObject {
    [i: string]: any;
}

export interface TimingArgs {
    category: string;
    variable: string;
    value: number;
    label?: string;
}

export interface Plugin {
    require(name: string, options?: any): void;
    execute(pluginName: string, action: string, actionTypeOrPayload: string|any, payload?: any): void;
}

export interface TestModeAPI {
  calls: any[][];
  ga: (...args: any[]) => any;
}

export interface OutboundLinkArgs {
    label: string;
}

export interface OutboundLinkProps {
    eventLabel: string;
    to: string;
    target?: string;
    onClick?: Function;
}

export function initialize(trackingCode: string, options?: InitializeOptions): void;
export function initialize(trackers: Tracker[], options?: InitializeOptions): void;
export function ga(): any;
export function set(fieldsObject: FieldsObject, trackerNames?: TrackerNames): void;
export function send(fieldsObject: FieldsObject, trackerNames?: TrackerNames): void;
export function pageview(path: string, trackerNames?: TrackerNames, title?: string): void;
export function modalview(name: string, trackerNames?: TrackerNames): void;
export function timing(args: TimingArgs, trackerNames?: TrackerNames): void;
export function event(args: EventArgs, trackerNames?: TrackerNames): void;
export function exception(fieldsObject: FieldsObject, trackerNames?: TrackerNames): void;
export const plugin: Plugin;
export const testModeAPI: TestModeAPI;
export function outboundLink(args: OutboundLinkArgs, hitCallback: () => void, trackerNames?: TrackerNames): void;
export const OutboundLink : React.ComponentClass<OutboundLinkProps & React.HTMLProps<HTMLAnchorElement>>;
