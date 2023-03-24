import { renderHook } from '@testing-library/react-native';

import { useUpdates } from '../UpdatesProvider';

it('useUpdates', () => {
  const { result } = renderHook(() => useUpdates());
  const { extraPropertiesFromManifest } = result.current;
  expect(extraPropertiesFromManifest).not.toBeUndefined();
});
