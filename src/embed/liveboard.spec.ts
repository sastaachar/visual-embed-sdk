import { LiveboardEmbed, LiveboardViewConfig } from './liveboard';
import { init } from '../index';
import { Action, AuthType, EmbedEvent, RuntimeFilterOp } from '../types';
import {
    executeAfterWait,
    getDocumentBody,
    getIFrameSrc,
    getRootEl,
} from '../test/test-utils';
import { version } from '../../package.json';

const defaultViewConfig = {
    frameParams: {
        width: 1280,
        height: 720,
    },
};
const liveboardId = 'eca215d4-0d2c-4a55-90e3-d81ef6848ae0';
const vizId = '6e73f724-660e-11eb-ae93-0242ac130002';
const thoughtSpotHost = 'tshost';
const defaultParams = `&hostAppUrl=local-host&viewPortHeight=768&viewPortWidth=1024&sdkVersion=${version}`;
const prefixParams = '&isLiveboardEmbed=true&isPinboardV2Enabled=false';

beforeAll(() => {
    init({
        thoughtSpotHost,
        authType: AuthType.None,
    });
});

describe('Liveboard/viz embed tests', () => {
    beforeEach(() => {
        document.body.innerHTML = getDocumentBody();
    });

    test('should render liveboard', async () => {
        const liveboardEmbed = new LiveboardEmbed(getRootEl(), {
            ...defaultViewConfig,
            liveboardId,
        } as LiveboardViewConfig);
        liveboardEmbed.render();
        await executeAfterWait(() => {
            expect(getIFrameSrc()).toBe(
                `http://${thoughtSpotHost}/?embedApp=true${defaultParams}${prefixParams}#/embed/viz/${liveboardId}`,
            );
        });
    });

    test('should set disabled actions', async () => {
        const liveboardEmbed = new LiveboardEmbed(getRootEl(), {
            disabledActions: [
                Action.DownloadAsCsv,
                Action.DownloadAsPdf,
                Action.DownloadAsXlsx,
            ],
            disabledActionReason: 'Action denied',
            ...defaultViewConfig,
            liveboardId,
        } as LiveboardViewConfig);
        liveboardEmbed.render();
        await executeAfterWait(() => {
            expect(getIFrameSrc()).toBe(
                `http://${thoughtSpotHost}/?embedApp=true${defaultParams}&disableAction=[%22${Action.DownloadAsCsv}%22,%22${Action.DownloadAsPdf}%22,%22${Action.DownloadAsXlsx}%22]&disableHint=Action%20denied${prefixParams}#/embed/viz/${liveboardId}`,
            );
        });
    });

    test('should set hidden actions', async () => {
        const liveboardEmbed = new LiveboardEmbed(getRootEl(), {
            hiddenActions: [
                Action.DownloadAsCsv,
                Action.DownloadAsPdf,
                Action.DownloadAsXlsx,
            ],
            ...defaultViewConfig,
            liveboardId,
        } as LiveboardViewConfig);
        liveboardEmbed.render();
        await executeAfterWait(() => {
            expect(getIFrameSrc()).toBe(
                `http://${thoughtSpotHost}/?embedApp=true${defaultParams}&hideAction=[%22${Action.DownloadAsCsv}%22,%22${Action.DownloadAsPdf}%22,%22${Action.DownloadAsXlsx}%22]${prefixParams}#/embed/viz/${liveboardId}`,
            );
        });
    });

    test('should set visible actions', async () => {
        const liveboardEmbed = new LiveboardEmbed(getRootEl(), {
            visibleActions: [
                Action.DownloadAsCsv,
                Action.DownloadAsPdf,
                Action.DownloadAsXlsx,
            ],
            ...defaultViewConfig,
            liveboardId,
        } as LiveboardViewConfig);
        liveboardEmbed.render();
        await executeAfterWait(() => {
            expect(getIFrameSrc()).toBe(
                `http://${thoughtSpotHost}/?embedApp=true${defaultParams}&visibleAction=[%22${Action.DownloadAsCsv}%22,%22${Action.DownloadAsPdf}%22,%22${Action.DownloadAsXlsx}%22]${prefixParams}#/embed/viz/${liveboardId}`,
            );
        });
    });

    test('should set visible actions as empty array', async () => {
        const liveboardEmbed = new LiveboardEmbed(getRootEl(), {
            visibleActions: [],
            ...defaultViewConfig,
            liveboardId,
        } as LiveboardViewConfig);
        liveboardEmbed.render();
        await executeAfterWait(() => {
            expect(getIFrameSrc()).toBe(
                `http://${thoughtSpotHost}/?embedApp=true${defaultParams}&visibleAction=[]${prefixParams}#/embed/viz/${liveboardId}`,
            );
        });
    });

    test('should enable viz transformations true', async () => {
        const liveboardEmbed = new LiveboardEmbed(getRootEl(), {
            enableVizTransformations: true,
            ...defaultViewConfig,
            liveboardId,
        } as LiveboardViewConfig);
        liveboardEmbed.render();
        await executeAfterWait(() => {
            expect(getIFrameSrc()).toBe(
                `http://${thoughtSpotHost}/?embedApp=true${defaultParams}&enableVizTransform=true${prefixParams}#/embed/viz/${liveboardId}`,
            );
        });
    });

    test('should disable viz transformations when enableVizTransformations false', async () => {
        const liveboardEmbed = new LiveboardEmbed(getRootEl(), {
            enableVizTransformations: false,
            ...defaultViewConfig,
            liveboardId,
        } as LiveboardViewConfig);
        liveboardEmbed.render();
        await executeAfterWait(() => {
            expect(getIFrameSrc()).toBe(
                `http://${thoughtSpotHost}/?embedApp=true${defaultParams}&enableVizTransform=false${prefixParams}#/embed/viz/${liveboardId}`,
            );
        });
    });

    test('should render viz', async () => {
        const liveboardEmbed = new LiveboardEmbed(getRootEl(), {
            ...defaultViewConfig,
            liveboardId,
            vizId,
        } as LiveboardViewConfig);
        liveboardEmbed.render();
        await executeAfterWait(() => {
            expect(getIFrameSrc()).toBe(
                `http://${thoughtSpotHost}/?embedApp=true${defaultParams}${prefixParams}#/embed/viz/${liveboardId}/${vizId}`,
            );
        });
    });

    test('should apply runtime filters', async () => {
        const liveboardEmbed = new LiveboardEmbed(getRootEl(), {
            ...defaultViewConfig,
            liveboardId,
            vizId,
            runtimeFilters: [
                {
                    columnName: 'sales',
                    operator: RuntimeFilterOp.EQ,
                    values: [1000],
                },
            ],
        } as LiveboardViewConfig);
        liveboardEmbed.render();
        await executeAfterWait(() => {
            expect(getIFrameSrc()).toBe(
                `http://${thoughtSpotHost}/?embedApp=true&col1=sales&op1=EQ&val1=1000${defaultParams}${prefixParams}#/embed/viz/${liveboardId}/${vizId}`,
            );
        });
    });

    test('should register event handler to adjust iframe height', async () => {
        const liveboardEmbed = new LiveboardEmbed(getRootEl(), {
            ...defaultViewConfig,
            fullHeight: true,
            liveboardId,
            vizId,
        } as LiveboardViewConfig);

        const onSpy = jest.spyOn(liveboardEmbed, 'on');
        liveboardEmbed.render();

        executeAfterWait(() => {
            expect(onSpy).toHaveBeenCalledWith(
                EmbedEvent.EmbedHeight,
                expect.anything(),
            );
        });
    });
    test('Should set the visible vizs', async () => {
        const liveboardEmbed = new LiveboardEmbed(getRootEl(), {
            ...defaultViewConfig,
            liveboardId,
            visibleVizs: ['abcd', 'pqrs'],
        } as LiveboardViewConfig);
        liveboardEmbed.render();
        await executeAfterWait(() => {
            expect(getIFrameSrc()).toBe(
                `http://${thoughtSpotHost}/?embedApp=true${defaultParams}&pinboardVisibleVizs=[%22abcd%22,%22pqrs%22]${prefixParams}#/embed/viz/${liveboardId}`,
            );
        });
    });
});