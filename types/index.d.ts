// Type definitions for react-ga 2.1
// Project: https://github.com/react-ga/react-ga
// Definitions by: Tim Aldridge <https://github.com/telshin>, Philip Karpiak <https://github.com/eswat>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

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
}

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
  ga: (...any: any[]) => any;
}

export interface OutboundLinkArgs {
    label: string;
}

export interface OutboundLinkProps {
    eventLabel: string;
    to: string;
    target?: string,
    onClick?: Function
}

export function initialize(trackingCode: string, options?: InitializeOptions): void;
export function ga(): any;
export function set(fieldsObject: FieldsObject, trackerNames?: string[]): void;
export function send(fieldsObject: FieldsObject, trackerNames?: string[]): void;
export function pageview(path: string, trackerNames?: string[], title?: string): void;
export function modalview(name: string, trackerNames?: string[]): void;
export function timing(args: TimingArgs): void;
export function event(args: EventArgs, trackerNames?: string[]): void;
export function exception(fieldsObject: FieldsObject, trackerNames?: string[]): void;
export const plugin: Plugin;
export const testModeAPI: TestModeAPI;
export function outboundLink(args: OutboundLinkArgs, hitCallback: () => void): void;
export const OutboundLink : React.ComponentClass<OutboundLinkProps & React.HTMLProps<OutboundLinkProps>>;
