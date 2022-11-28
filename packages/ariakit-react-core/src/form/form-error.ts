import { useCallback, useContext, useRef } from "react";
import { StringLike } from "@ariakit/core/form/types";
import { invariant } from "@ariakit/core/utils/misc";
import {
  CollectionItemOptions,
  useCollectionItem,
} from "../collection/collection-item";
import { useForkRef, useId } from "../utils/hooks";
import {
  createElement,
  createHook,
  createMemoComponent,
} from "../utils/system";
import { As, Props } from "../utils/types";
import { FormContext } from "./form-context";
import { FormStore } from "./form-store";

/**
 * A component hook that returns props that can be passed to `Role` or any other
 * Ariakit component to render an element that displays an error message. The
 * `children` will be automatically set to the error message set on the store.
 * @see https://ariakit.org/components/form
 * @example
 * ```jsx
 * const store = useFormStore({ defaultValues: { email: "" } });
 * const props = useFormError({ store, name: store.names.email });
 *
 * store.useValidate(() => {
 *   if (!store.getValue(store.names.email)) {
 *     store.setError(store.names.email, "Email is required!");
 *   }
 * });
 *
 * <Form store={store}>
 *   <FormLabel name={store.names.email}>Email</FormLabel>
 *   <FormInput name={store.names.email} />
 *   <Role {...props} />
 * </Form>
 * ```
 */
export const useFormError = createHook<FormErrorOptions>(
  ({ store, name: nameProp, getItem: getItemProp, ...props }) => {
    const context = useContext(FormContext);
    store = store || context;

    invariant(
      store,
      process.env.NODE_ENV !== "production" &&
        "FormError must be wrapped in a Form component"
    );

    const id = useId(props.id);
    const ref = useRef<HTMLInputElement>(null);
    const name = `${nameProp}`;

    const getItem = useCallback<NonNullable<CollectionItemOptions["getItem"]>>(
      (item) => {
        const nextItem = { ...item, id: id || item.id, name, type: "error" };
        if (getItemProp) {
          return getItemProp(nextItem);
        }
        return nextItem;
      },
      [id, name, getItemProp]
    );

    const children = store.useState(() => {
      const error = store?.getError(name);
      if (error == null) return;
      if (!store?.getFieldTouched(name)) return;
      return error;
    });

    props = {
      id,
      role: "alert",
      children,
      ...props,
      ref: useForkRef(ref, props.ref),
    };

    props = useCollectionItem({ store, ...props, getItem });

    return props;
  }
);

/**
 * A component that renders an element that displays an error message. The
 * `children` will be automatically set to the error message set on the store.
 * @see https://ariakit.org/components/form
 * @example
 * ```jsx
 * const form = useFormStore({ defaultValues: { email: "" } });
 *
 * form.useValidate(() => {
 *   if (!form.values.email) {
 *     form.setError(form.names.email, "Email is required!");
 *   }
 * });
 *
 * <Form store={form}>
 *   <FormLabel name={form.names.email}>Email</FormLabel>
 *   <FormInput name={form.names.email} />
 *   <FormError name={form.names.email} />
 * </Form>
 * ```
 */
export const FormError = createMemoComponent<FormErrorOptions>((props) => {
  const htmlProps = useFormError(props);
  return createElement("div", htmlProps);
});

if (process.env.NODE_ENV !== "production") {
  FormError.displayName = "FormError";
}

export type FormErrorOptions<T extends As = "div"> = Omit<
  CollectionItemOptions<T>,
  "store"
> & {
  /**
   * Object returned by the `useFormStore` hook. If not provided, the parent
   * `Form` component's context will be used.
   */
  store?: FormStore;
  /**
   * Name of the field.
   */
  name: StringLike;
};

export type FormErrorProps<T extends As = "div"> = Props<FormErrorOptions<T>>;
