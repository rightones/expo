import React, { createContext, useContext, useState } from 'react';

import * as Updates from './Updates';
import type { Manifest } from './Updates.types';
import { useUpdateEvents } from './UpdatesHooks';
import { UpdatesProviderDownloadEventType, currentlyRunning } from './UpdatesProvider.constants';
import type { UpdatesInfo, UpdatesProviderDownloadEvent } from './UpdatesProvider.types';
import {
  availableUpdateFromManifest,
  checkAndReturnNewUpdatesInfo,
  delay,
  updatesFromEvent,
} from './UpdatesProvider.utils';

// Context that includes getter and setter for the updates info
type UpdatesContextType = {
  updatesInfo: UpdatesInfo;
  setUpdatesInfo: (updates: UpdatesInfo) => void;
};

// The context provided to the app
const UpdatesContext: React.Context<UpdatesContextType> = createContext({
  updatesInfo: {
    currentlyRunning,
  },
  setUpdatesInfo: (_) => {},
});

///////////// Exported functions /////////////

/**
 * Extracts any custom properties in the `extra` part of the Expo config.  The `eas` property
 * is excluded (reserved for Expo internal use).
 * @param manifest The manifest to check
 * @returns Object containing any properties found. If no extra properties found, returns an empty object.
 */
const extraPropertiesFromManifest: (manifest: Partial<Manifest>) => {
  [key: string]: any;
} = (manifest) => {
  const result: { [key: string]: any } = {};
  for (const key in manifest?.extra?.expoClient?.extra) {
    if (key !== 'eas') {
      result[key] = manifest?.extra?.expoClient?.extra[key];
    }
  }
  return result;
};

/**
 * Downloads and runs an update, if one is available. Provided to application code
 * from the [`useUpdates`](#useupdates) hook.
 */
const downloadAndRunUpdate: () => Promise<void> = async () => {
  await Updates.fetchUpdateAsync();
  await delay(2000);
  await Updates.reloadAsync();
};

/**
 * Downloads an update, if one is available, using `Updates.fetchUpdateAsync()`.
 * @param downloadHandler Optional handler. If present, the handler will be called when download starts, and again when download completes (successfully or not).
 */
const downloadUpdate: (downloadHandler?: (event: UpdatesProviderDownloadEvent) => void) => void = (
  downloadHandler
) => {
  downloadHandler &&
    downloadHandler({
      type: UpdatesProviderDownloadEventType.DOWNLOAD_START,
    });
  Updates.fetchUpdateAsync()
    .then(() => {
      downloadHandler &&
        downloadHandler({
          type: UpdatesProviderDownloadEventType.DOWNLOAD_COMPLETE,
        });
    })
    .catch((error: Error) => {
      downloadHandler &&
        downloadHandler({
          type: UpdatesProviderDownloadEventType.DOWNLOAD_ERROR,
          error,
        });
    });
};

/**
 * Runs an update by calling `Updates.reloadAsync()`. This should not be called unless there is an available update
 * that has already been successfully downloaded using [`downloadUpdate()`](#downloadupdate).
 */
const runUpdate = () => {
  Updates.reloadAsync();
};

/////// Provider and hook ///////////

/**
 * Calls `Updates.checkForUpdateAsync()` and uses the passed in setter
 * to refresh the [`UpdatesInfo`](#updatesinfo). Provided to application code from
 * the [`useUpdates`](#useupdates) hook.
 */
let checkForUpdate = () => {
  // This stub is replaced with the real implementation in the hook
};

/**
 * Provides the Updates React context. Includes an [`UpdateEvent`](#updateevent) listener
 * that will set the context automatically, if automatic updates are enabled and a new
 * update is available. This is required if application code uses the [`useUpdates`](#useupdates) hook.
 * @param props Context will be provided to `props.children`
 * @returns the provider.
 * @example
 * ```jsx App.tsx
 * import { UpdatesProvider } from 'expo-updates-provider';
 *
 * import UpdatesDemo from './src/UpdatesDemo';
 *
 * export default function App() {
 *   return (
 *     <UpdatesProvider>
 *       <UpdatesDemo />
 *     </UpdatesProvider>
 *   );
 * }
 * ```
 */
const UpdatesProvider = (props: { children: any }) => {
  const [updatesInfo, setUpdatesInfo] = useState({
    currentlyRunning,
  });
  // Set up listener for events from automatic update requests
  // that happen on startup, and use events to refresh the updates info
  // context
  useUpdateEvents((event) => {
    setUpdatesInfo(updatesFromEvent(event));
  });
  return (
    <UpdatesContext.Provider value={{ updatesInfo, setUpdatesInfo }}>
      {props.children}
    </UpdatesContext.Provider>
  );
};

/**
 * Hook that obtains the Updates info structure and functions.
 * Requires that application code be inside an [`UpdatesProvider`](#updatesprovider).
 * @returns the [`UpdatesInfo`](#updatesinfo) structure and associated methods. When using the provider, only these methods should be used.
 * @example
 * ```jsx UpdatesDemo.tsx
 * import { StatusBar } from 'expo-status-bar';
 * import React from 'react';
 * import { Pressable, Text, View } from 'react-native';
 * import { useUpdates } from 'expo-updates-provider';
 *
 * export default function UpdatesDemo() {
 *   const { updatesInfo, checkForUpdate, downloadAndRunUpdate } = useUpdates();
 *
 *   const { currentlyRunning, updateAvailable } = updatesInfo;
 *
 *   // If true, we show the button to download and run the update
 *   const showDownloadButton = updateAvailable !== undefined;
 *
 *   // Show whether or not we are running embedded code or an update
 *   const runTypeMessage = updatesInfo.currentlyRunning.isEmbeddedLaunch
 *     ? 'This app is running from built-in code'
 *     : 'This app is running an update';
 *
 *   return (
 *     <View style={styles.container}>
 *       <Text style={styles.headerText}>Updates Demo</Text>
 *       <Text>{runTypeMessage}</Text>
 *       <Button pressHandler={checkForUpdate} text="Check manually for updates" />
 *       {showDownloadButton ? (
 *         <Button pressHandler={downloadAndRunUpdate} text="Download and run update" />
 *       ) : null}
 *       <StatusBar style="auto" />
 *     </View>
 *   );
 * }
 */
const useUpdates = (): {
  updatesInfo: UpdatesInfo;
  checkForUpdate: typeof checkForUpdate;
  extraPropertiesFromManifest: typeof extraPropertiesFromManifest;
  downloadAndRunUpdate: typeof downloadAndRunUpdate;
  downloadUpdate: typeof downloadUpdate;
  runUpdate: typeof runUpdate;
} => {
  // Get updates info value and setter from provider
  const { updatesInfo, setUpdatesInfo } = useContext(UpdatesContext);

  // Create the implementation of checkForUpdate()
  checkForUpdate = () => {
    checkAndReturnNewUpdatesInfo().then((result) => setUpdatesInfo(result));
  };
  // Return the updates info and the user facing functions
  return {
    updatesInfo,
    checkForUpdate,
    extraPropertiesFromManifest,
    downloadAndRunUpdate,
    downloadUpdate,
    runUpdate,
  };
};

// Export types
export type {
  UpdatesInfo,
  CurrentlyRunningInfo,
  AvailableUpdateInfo,
  UpdatesProviderDownloadEvent,
} from './UpdatesProvider.types';

// Export constants
export { UpdatesProviderDownloadEventType } from './UpdatesProvider.constants';

// Export methods
export {
  UpdatesProvider,
  useUpdates,
  availableUpdateFromManifest,
  checkForUpdate,
  extraPropertiesFromManifest,
  downloadAndRunUpdate,
  downloadUpdate,
  runUpdate,
};
