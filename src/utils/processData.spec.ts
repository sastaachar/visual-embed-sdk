import { EmbedEvent } from '../types';
import { processData } from './processData';
import * as auth from '../auth';

describe('Unit test for process data', () => {
    const thoughtSpotHost = 'http://localhost';

    test('ProcessData', () => {
        const e = { type: EmbedEvent.CustomAction, data: {} };
        expect(processData(e.type, e, thoughtSpotHost)).toBe(e);
    });

    test('AuthInit', () => {
        const sessionInfo = {
            userGuid: '1234',
            mixpanelToken: 'abc123',
            isPublicUser: false,
        };
        const e = { type: EmbedEvent.AuthInit, data: sessionInfo };
        jest.spyOn(auth, 'initSession').mockReturnValue(null);
        expect(processData(e.type, e, '')).toEqual({
            type: e.type,
            data: {
                userGuid: sessionInfo.userGuid,
            },
        });
        expect(auth.initSession).toBeCalledWith(sessionInfo);
    });
});
