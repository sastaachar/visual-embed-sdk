import { AuthType, init, prefetch, SearchEmbed, EmbedEvent } from '../index';
import {
    executeAfterWait,
    getAllIframeEl,
    getDocumentBody,
    getRootEl,
    getRootEl2,
} from '../test/test-utils';

const thoughtSpotHost = 'tshost';

describe('Base TS Embed', () => {
    beforeAll(() => {
        init({
            thoughtSpotHost,
            authType: AuthType.None,
        });
    });

    beforeEach(() => {
        document.body.innerHTML = getDocumentBody();
    });

    test('Should show an alert when third party cookie access is blocked', (done) => {
        const tsEmbed = new SearchEmbed(getRootEl(), {});
        const iFrame: any = document.createElement('div');
        iFrame.contentWindow = null;
        tsEmbed.test_setIframe(iFrame);
        tsEmbed.render();

        window.postMessage(
            {
                __type: EmbedEvent.NoCookieAccess,
            },
            '*',
        );
        jest.spyOn(window, 'alert').mockImplementation(() => {
            expect(window.alert).toBeCalledWith(
                'Third party cookie access is blocked on this browser, please allow third party cookies for ThoughtSpot to work properly',
            );
            done();
        });
    });

    test('Should add the prefetch iframe when prefetch is called. Should remove it once init is called.', async () => {
        prefetch('https://10.87.90.95');
        await executeAfterWait(() => {
            expect(getAllIframeEl().length).toBe(1);
            const prefetchIframe = document.querySelectorAll('.prefetchIframe');
            expect(prefetchIframe.length).toBe(1);
        }, 100);
    });
});
