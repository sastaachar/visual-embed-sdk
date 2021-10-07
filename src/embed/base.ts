/* eslint-disable import/no-mutable-exports */
/**
 * Copyright (c) 2021
 *
 * Base classes
 *
 * @summary Base classes
 * @author Ayon Ghosh <ayon.ghosh@thoughtspot.com>
 */
import { getThoughtSpotHost } from '../config';
import { EmbedConfig } from '../types';
import { authenticate } from '../auth';
import { uploadMixpanelEvent, MIXPANEL_EVENT } from '../mixpanel-service';

let config = {} as EmbedConfig;

export let authPromise: Promise<void>;

/**
 * Perform authentication on the ThoughtSpot app as applicable.
 */
export const handleAuth = (): void => {
    const authConfig = {
        ...config,
        thoughtSpotHost: getThoughtSpotHost(config),
    };
    authPromise = authenticate(authConfig);
};

export const getEmbedConfig = (): EmbedConfig => config;

export const getAuthPromise = (): Promise<void> => authPromise;

/**
 * Initialize the ThoughtSpot embed settings globally and perform
 * authentication if applicable.
 * @param embedConfig The configuration object containing ThoughtSpot host,
 * authentication mechanism and so on.
 */
export const init = (embedConfig: EmbedConfig): void => {
    config = embedConfig;
    handleAuth();

    uploadMixpanelEvent(MIXPANEL_EVENT.VISUAL_SDK_CALLED_INIT, {
        authType: config.authType,
        host: config.thoughtSpotHost,
    });
};

let renderQueue: Promise<any> = Promise.resolve();

/**
 * Renders functions in a queue, resolves to next function only after the callback next is called
 * @param fn The function being registered
 */
export const renderInQueue = (fn: (next?: (val?: any) => void) => void) => {
    const { queueMultiRenders = false } = config;
    if (queueMultiRenders) {
        renderQueue = renderQueue.then(() => new Promise((res) => fn(res)));
    } else {
        // Sending an empty function to keep it consistent with the above usage.
        fn(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
    }
};
