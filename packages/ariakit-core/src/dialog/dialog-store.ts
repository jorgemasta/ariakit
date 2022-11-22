import {
  DisclosureState,
  DisclosureStore,
  DisclosureStoreProps,
  createDisclosureStore,
} from "../disclosure/disclosure-store";

export function createDialogStore(props: DialogStoreProps = {}): DialogStore {
  return createDisclosureStore(props);
}

export type DialogState = DisclosureState;

export type DialogStore = DisclosureStore;

export type DialogStoreProps = DisclosureStoreProps;
