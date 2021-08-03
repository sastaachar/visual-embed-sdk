import * as processDataInstance from './processData';
import * as answerServiceInstance from './answerService';
import * as auth from '../auth';
import { EmbedEvent, OperationType } from '../types';

describe('Unit test for process data', () => {
    const thoughtSpotHost = 'http://localhost';
    test('processDataInstance, when operation is GetChartWithData', () => {
        const processChartData = {
            data: {
                session: 'session',
                query: 'query',
                operation: OperationType.GetChartWithData,
            },
        };
        jest.spyOn(
            answerServiceInstance,
            'getAnswerServiceInstance',
        ).mockImplementation(async () => ({}));
        expect(
            processDataInstance.processCustomAction(
                processChartData,
                thoughtSpotHost,
            ),
        ).toStrictEqual(processChartData);
    });

    test('ProcessData, when Action is CustomAction', async () => {
        const processedData = { type: EmbedEvent.CustomAction };
        jest.spyOn(
            processDataInstance,
            'processCustomAction',
        ).mockImplementation(async () => ({}));
        expect(
            processDataInstance.processData(EmbedEvent.CustomAction, processedData, thoughtSpotHost),
        ).toStrictEqual(processedData);
    });

    test('ProcessData, when Action is non CustomAction', () => {
        const processedData = { type: EmbedEvent.Data };
        jest.spyOn(
            processDataInstance,
            'processCustomAction',
        ).mockImplementation(async () => ({}));
        jest.spyOn(
            answerServiceInstance,
            'getAnswerServiceInstance',
        ).mockImplementation(async () => ({}));
        processDataInstance.processData(EmbedEvent.Data, processedData, thoughtSpotHost);
        expect(processDataInstance.processCustomAction).not.toBeCalled();
    });

    test('AuthInit', () => {
        const sessionInfo = {
            userGuid: '1234',
            mixpanelToken: 'abc123',
            isPublicUser: false,
        };
        const e = { type: EmbedEvent.AuthInit, data: sessionInfo };
        jest.spyOn(auth, 'initSession').mockReturnValue(null);
        expect(processDataInstance.processData(e.type, e, '')).toEqual({
            type: e.type,
            data: {
                userGuid: sessionInfo.userGuid,
            },
        });
        expect(auth.initSession).toBeCalledWith(sessionInfo);
    });
});
