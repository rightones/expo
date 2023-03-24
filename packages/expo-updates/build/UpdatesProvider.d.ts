import type { Manifest } from './Updates.types';
import type { UpdatesInfo, UpdatesProviderDownloadEvent } from './UpdatesProvider.types';
export type UpdatesContextType = {
    updatesInfo: UpdatesInfo;
    setUpdatesInfo: (updates: UpdatesInfo) => void;
};
/**
 * Extracts any custom properties in the `extra` part of the Expo config.  The `eas` property
 * is excluded (reserved for Expo internal use).
 * @param manifest The manifest to check
 * @returns Object containing any properties found. If no extra properties found, returns an empty object.
 */
declare const extraPropertiesFromManifest: (manifest: Partial<Manifest>) => {
    [key: string]: any;
};
/**
 * Downloads and runs an update, if one is available. Provided to application code
 * from the [`useUpdates`](#useupdates) hook.
 */
declare const downloadAndRunUpdate: () => Promise<void>;
/**
 * Downloads an update, if one is available, using `Updates.fetchUpdateAsync()`.
 * @param downloadHandler Optional handler. If present, the handler will be called when download starts, and again when download completes (successfully or not).
 */
declare const downloadUpdate: (downloadHandler?: (event: UpdatesProviderDownloadEvent) => void) => void;
/**
 * Runs an update by calling `Updates.reloadAsync()`. This should not be called unless there is an available update
 * that has already been successfully downloaded using [`downloadUpdate()`](#downloadupdate).
 */
declare const runUpdate: () => void;
/**
 * Calls `Updates.checkForUpdateAsync()` and uses the passed in setter
 * to refresh the [`UpdatesInfo`](#updatesinfo). Provided to application code from
 * the [`useUpdates`](#useupdates) hook.
 */
declare let checkForUpdate: () => void;
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
declare const UpdatesProvider: (props: {
    children: any;
}) => JSX.Element;
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
declare const useUpdates: () => {
    updatesInfo: UpdatesInfo;
    checkForUpdate: typeof checkForUpdate;
    extraPropertiesFromManifest: typeof extraPropertiesFromManifest;
    downloadAndRunUpdate: typeof downloadAndRunUpdate;
    downloadUpdate: typeof downloadUpdate;
    runUpdate: typeof runUpdate;
};
export type { UpdatesInfo, CurrentlyRunningInfo, AvailableUpdateInfo, UpdatesProviderDownloadEvent, } from './UpdatesProvider.types';
export { UpdatesProviderDownloadEventType } from './UpdatesProvider.constants';
export { UpdatesProvider, useUpdates, checkForUpdate, extraPropertiesFromManifest, downloadAndRunUpdate, downloadUpdate, runUpdate, };
//# sourceMappingURL=UpdatesProvider.d.ts.map