// Type definitions for react-ga 2.4
// Project: https://github.com/react-ga/react-ga
// Definitions by: Tim Aldridge <https://github.com/telshin>
//                 Philip Karpiak <https://github.com/eswat>
//                 Jerry Reptak <https://github.com/jetfault>
// Definitions: https://github.com/react-ga/react-ga

import * as React from 'react';

/* tslint:disable no-any */

/**
 * Events are user interactions with content that can be measured independently from
 * a web page or a screen load. Downloads, mobile ad clicks, gadgets, Flash elements,
 * AJAX embedded elements, and video plays are all examples of actions you might want
 * to measure as Events.
 * @see https://developers.google.com/analytics/devguides/collection/analyticsjs/events
 */
export interface EventArgs {
  /** Typically the object that was interacted with (e.g. 'Video') */
  category: string;
  /** The type of interaction (e.g. 'play') */
  action: string;
  /** Useful for categorizing events (e.g. 'Fall Campaign') */
  label?: string;
  /** A numeric value associated with the event (e.g. 42) */
  value?: number;
  /** Specifies that a hit be considered non-interactive. */
  nonInteraction?: boolean;
  /**
   * This specifies the transport mechanism with which hits will be sent.
   * The options are 'beacon', 'xhr', or 'image'. By default, analytics.js
   * will try to figure out the best method based on the hit size and browser
   * capabilities. If you specify 'beacon' and the user's browser does not support
   * the `navigator.sendBeacon` method, it will fall back to 'image' or 'xhr'
   * depending on hit size.
   */
  transport?: 'beacon' | 'xhr' | 'image';
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
  storage?: string;
  storeGac?: boolean;
  cookieFlags?: string;
}

export interface InitializeOptions {
  debug?: boolean;
  gaAddress?: string;
  testMode?: boolean;
  titleCase?: boolean;
  gaOptions?: GaOptions;
  alwaysSendToDefaultTracker?: boolean;
  standardImplementation?: boolean;
  /** Optional. Defaults to `true`. Enables redacting a email as the string that in "Event Category" and "Event Action". */
  redactEmail?: boolean;
  useExistingGa?: boolean;
}

export type Tracker = {
  trackingId: string;
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
  require(name: string, options?: any, trackerName?: string): void;
  execute(
    pluginName: string,
    action: string,
    actionTypeOrPayload: string | any,
    payload?: any
  ): void;
}

export interface TestModeAPI {
  calls: any[][];
  ga: (...args: any[]) => any;
  resetCalls: Function;
}

export interface OutboundLinkArgs {
  label: string;
}

export interface OutboundLinkProps {
  eventLabel: string;
  to: string;
  target?: string;
  onClick?: Function;
  trackerNames?: TrackerNames;
}

export function initialize(
  trackingCode: string,
  options?: InitializeOptions
): void;
export function initialize(
  trackers: Tracker[],
  options?: InitializeOptions
): void;
export function addTrackers(trackingCode: string): void;
export function addTrackers(trackers: Tracker[]): void;
export function ga(): (...args: any[]) => void;
export function ga(...args: any[]): void;
export function resetCalls(): void;
export function set(
  fieldsObject: FieldsObject,
  trackerNames?: TrackerNames
): void;
export function send(
  fieldsObject: FieldsObject,
  trackerNames?: TrackerNames
): void;
export function pageview(
  path: string,
  trackerNames?: TrackerNames,
  title?: string
): void;
export function modalview(name: string, trackerNames?: TrackerNames): void;
export function timing(args: TimingArgs, trackerNames?: TrackerNames): void;
export function event(args: EventArgs, trackerNames?: TrackerNames): void;
export function exception(
  fieldsObject: FieldsObject,
  trackerNames?: TrackerNames
): void;
export const plugin: Plugin;
export const testModeAPI: TestModeAPI;
export function outboundLink(
  args: OutboundLinkArgs,
  hitCallback: () => void,
  trackerNames?: TrackerNames
): void;
export const OutboundLink: React.ComponentClass<
  OutboundLinkProps & React.HTMLProps<HTMLAnchorElement>
>;
