import { SageEmbed, SageViewConfig } from './sage';
import { init } from '../index';
import { AuthType } from '../types';
import {
    executeAfterWait,
    expectUrlMatch,
    getDocumentBody,
    getIFrameSrc,
    getRootEl,
} from '../test/test-utils';

const defaultConfig: SageViewConfig = {
    showObjectResults: true,
    disableWorksheetChange: false,
    hideWorksheetSelector: true,
    showObjectSuggestions: false,
};

const thoughtSpotHost = 'tshost';

beforeAll(() => {
    init({
        thoughtSpotHost,
        authType: AuthType.None,
    });
    spyOn(window, 'alert');
});

describe('Sage  embed tests', () => {
    beforeEach(() => {
        document.body.innerHTML = getDocumentBody();
    });

    test('should render sage', async () => {
        const sageEmbed = new SageEmbed(getRootEl(), defaultConfig);
        sageEmbed.render();
        await executeAfterWait(() => {
            expectUrlMatch(
                getIFrameSrc(),
                `http://${thoughtSpotHost}/?embedApp=true&hideEurekaResults=false&isSageEmbed=true&disableWorksheetChange=false&hideWorksheetSelector=true&hideEurekaSuggestions=true&hideAction=%5B"reportError","save","pin","editACopy","saveAsView","updateTSL","editTSL","onDeleteAnswer","share"%5D#/embed/eureka`,
            );
        });
    });
    test('embed url include pre-seed dataSource and query', async () => {
        const sageEmbed = new SageEmbed(getRootEl(), {
            ...defaultConfig,
            dataSource: 'worksheet-id',
            searchOptions: {
                searchQuery: 'test-query',
            },
        });
        sageEmbed.render();
        await executeAfterWait(() => {
            expectUrlMatch(
                getIFrameSrc(),
                `http://${thoughtSpotHost}/?embedApp=true&hideEurekaResults=false&isSageEmbed=true&disableWorksheetChange=false&hideWorksheetSelector=true&hideEurekaSuggestions=true&hideAction=%5B"reportError","save","pin","editACopy","saveAsView","updateTSL","editTSL","onDeleteAnswer","share"%5D#/embed/eureka?worksheet=worksheet-id&query=test-query`,
            );
        });
    });
    test('embed url include pre-seed execute flag with query', async () => {
        const sageEmbed = new SageEmbed(getRootEl(), {
            ...defaultConfig,
            searchOptions: {
                searchQuery: 'test-query',
                executeSearch: true,
            },
        });
        sageEmbed.render();
        await executeAfterWait(() => {
            expectUrlMatch(
                getIFrameSrc(),
                `http://${thoughtSpotHost}/?embedApp=true&hideEurekaResults=false&isSageEmbed=true&disableWorksheetChange=false&hideWorksheetSelector=true&hideEurekaSuggestions=true&hideAction=%5B"reportError","save","pin","editACopy","saveAsView","updateTSL","editTSL","onDeleteAnswer","share"%5D#/embed/eureka?query=test-query&executeSearch=true`,
            );
        });
    });
});
