import {
  Form,
  FormError,
  FormField,
  FormInput,
  FormLabel,
  FormSubmit,
  useFormStore,
} from "ariakit/form/store";
import { Select, SelectItem } from "./select";
import "./style.css";

export default function Example() {
  const form = useFormStore({ defaultValues: { name: "", fruit: "" } });
  const fruitValue = form.useValue(form.names.fruit);

  form.useSubmit(() => {
    alert(JSON.stringify(form.getState().values));
  });

  return (
    <Form store={form} className="wrapper">
      <div className="field">
        <FormLabel name={form.names.name}>Name</FormLabel>
        <FormInput name={form.names.name} required placeholder="John Doe" />
        <FormError name={form.names.name} className="error" />
      </div>
      <div className="field">
        <FormLabel name={form.names.fruit}>Favorite fruit</FormLabel>
        <FormField
          as={Select}
          name={form.names.fruit}
          value={fruitValue}
          setValue={(value: string) => form.setValue(form.names.fruit, value)}
          touchOnBlur={false}
          onTouch={() => form.setFieldTouched(form.names.fruit, true)}
          required
        >
          <SelectItem value="">Select an item</SelectItem>
          <SelectItem value="Apple" />
          <SelectItem value="Banana" />
          <SelectItem value="Orange" />
        </FormField>
        <FormError name={form.names.fruit} className="error" />
      </div>
      <div className="buttons">
        <FormSubmit className="button">Submit</FormSubmit>
      </div>
    </Form>
  );
}
