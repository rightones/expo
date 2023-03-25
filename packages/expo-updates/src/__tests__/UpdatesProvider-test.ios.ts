import { renderHook } from '@testing-library/react-native';

import type { Manifest } from '../Updates.types';
import { useUpdates } from '../UpdatesProvider';
import { availableUpdateFromManifest } from '../UpdatesProvider.utils';

jest.mock('../ExpoUpdates', () => {
  return {
    channel: 'main',
    updateId: '0000-1111',
  };
});

describe('Updates provider and hook tests', () => {
  it('useUpdates gets current info', () => {
    const { result } = renderHook(() => useUpdates());
    const { extraPropertiesFromManifest } = result.current;
    expect(extraPropertiesFromManifest).not.toBeUndefined();
    const { updatesInfo } = result.current;
    expect(updatesInfo.currentlyRunning.channel).toEqual('main');
    expect(updatesInfo.currentlyRunning.updateId).toEqual('0000-1111');
  });

  it('availableUpdateFromManifest', () => {
    const mockDate = new Date();
    const manifest: Manifest = {
      id: '0000-2222',
      createdAt: mockDate.toISOString(),
      runtimeVersion: '1.0.0',
      launchAsset: {
        url: 'testUrl',
      },
      assets: [],
      metadata: {},
    };
    const result = availableUpdateFromManifest(manifest);
    expect(result?.updateId).toEqual('0000-2222');
    expect(result?.createdAt).toEqual(mockDate);
    expect(result?.manifest).toEqual(manifest);
  });
});
