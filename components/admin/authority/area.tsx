import { useState } from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import {
  AreaFieldNoSSR,
  Field,
  FieldGroup,
  Form,
  FormAction,
  FormMessage,
  MaskingLoader,
  SaveButton,
} from "components/widgets/forms";
import useServices from "lib/services/provider";
import { AuthorityAreaViewModel } from "components/admin/authority/areaViewModel";
import Spinner from "components/widgets/spinner";
import { toJS } from "mobx";

const AuthorityArea = () => {
  const router = useRouter();
  const services = useServices();
  const [viewModel] = useState(
    () =>
      new AuthorityAreaViewModel(
        router.query.id as string,
        services.authorityService
      )
  );

  return (
    <MaskingLoader loading={viewModel.isLoading}>
      <Form
        onSubmit={async evt => {
          evt.preventDefault();
          await viewModel.save();
        }}
      >
        <FieldGroup>
          <Field $size="full">
            <AreaFieldNoSSR
              value={toJS(viewModel.data)}
              onChange={data => (viewModel.data = data)}
            />
          </Field>
        </FieldGroup>
        {viewModel.submitError.length > 0 && (
          <FormMessage>{viewModel.submitError}</FormMessage>
        )}
        <FormAction>
          <SaveButton type="submit" disabled={viewModel.isSubmitting}>
            {viewModel.isSubmitting ? <Spinner /> : "Save"}
          </SaveButton>
        </FormAction>
      </Form>
    </MaskingLoader>
  );
};

export default observer(AuthorityArea);