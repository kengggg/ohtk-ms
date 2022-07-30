import { useState } from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { NotificationTemplateUpdateViewModel } from "./updateViewModel";
import {
  CancelButton,
  ErrorText,
  Field,
  FieldGroup,
  Form,
  FormAction,
  FormMessage,
  Label,
  MaskingLoader,
  Radio,
  SaveButton,
  Select,
  TextArea,
  TextInput,
} from "components/widgets/forms";
import Spinner from "components/widgets/spinner";
import useServices from "lib/services/provider";
import useStateTransitions from "lib/hooks/stateTransitions";
import { CasesNotificationTemplateTypeChoices } from "lib/generated/graphql";
import useReportTypes from "lib/hooks/reportTypes";

const NotificationTemplateUpdate = () => {
  const router = useRouter();
  const services = useServices();
  const [viewModel] = useState(
    () =>
      new NotificationTemplateUpdateViewModel(
        router.query.id as string,
        services.notificationTemplateService
      )
  );

  const reportTypes = useReportTypes();
  const { transitionLoading, stateTransitions } = useStateTransitions(
    viewModel.reportTypeId
  );
  const isSubmitting = viewModel.isSubmitting;
  const errors = viewModel.fieldErrors;

  return (
    <MaskingLoader loading={viewModel.isLoading}>
      <Form
        onSubmit={async evt => {
          evt.preventDefault();
          if (await viewModel.save()) {
            router.back();
          }
        }}
      >
        <FieldGroup>
          <Field $size="half">
            <Label htmlFor="name">Name</Label>
            <TextInput
              id="name"
              type="text"
              placeholder="Name"
              onChange={evt => (viewModel.name = evt.target.value)}
              disabled={viewModel.isSubmitting}
              defaultValue={viewModel.name}
            />
            <ErrorText>{viewModel.fieldErrors.name}</ErrorText>
          </Field>
          <Field $size="half">
            <Label htmlFor="reportType">Report Type</Label>
            <Select
              id="reportType"
              onChange={evt => {
                viewModel.reportTypeId = evt.target.value;
                viewModel.stateTransitionId = 0;
              }}
              disabled={isSubmitting}
              defaultValue={viewModel.reportTypeId}
            >
              <option disabled value={""}>
                Select item ...
              </option>
              {reportTypes?.map(item => (
                <option key={`option-${item.id}`} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
            <ErrorText>{errors.reportTypeId}</ErrorText>
          </Field>
          <Field $size="half" className="flex space-x-8">
            <Radio
              id="type-1"
              label={"report"}
              name="type"
              checked={
                viewModel.type === CasesNotificationTemplateTypeChoices.Rep
              }
              value={CasesNotificationTemplateTypeChoices.Rep}
              disabled={false}
              onChange={evt => (viewModel.type = evt.target.value)}
            />
            <Radio
              id="type-2"
              name="type"
              label={"promote to case"}
              checked={
                viewModel.type === CasesNotificationTemplateTypeChoices.Ptc
              }
              value={CasesNotificationTemplateTypeChoices.Ptc}
              disabled={false}
              onChange={evt => (viewModel.type = evt.target.value)}
            />
            <Radio
              id="type-3"
              name="type"
              label={"case transistion"}
              checked={
                viewModel.type === CasesNotificationTemplateTypeChoices.Cas
              }
              value={CasesNotificationTemplateTypeChoices.Cas}
              disabled={false}
              onChange={evt => (viewModel.type = evt.target.value)}
            />
            <ErrorText>{errors.type}</ErrorText>
          </Field>
          <>
            {viewModel.type == CasesNotificationTemplateTypeChoices.Cas && (
              <Field $size="half">
                <Label htmlFor="transistion">Transistion</Label>
                <div className="relative">
                  {transitionLoading && (
                    <div className="flex absolute inset-y-0 right-5 items-center pl-3 pointer-events-none">
                      <Spinner />
                    </div>
                  )}
                  <Select
                    id="transistion"
                    onChange={evt => {
                      viewModel.stateTransitionId = +evt.target.value;
                    }}
                    disabled={isSubmitting || transitionLoading}
                    value={viewModel.stateTransitionId}
                  >
                    <option disabled value={0}>
                      Select item ...
                    </option>
                    {stateTransitions?.map(item => (
                      <option key={`option-${item.id}`} value={item.id}>
                        {item.fromStep.name} to {item.toStep.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <ErrorText>{errors.stateTransitionId}</ErrorText>
              </Field>
            )}
          </>
          <Field $size="half">
            <Label htmlFor="condition">Condition</Label>
            <TextArea
              id="condition"
              placeholder="Condition"
              rows={2}
              onChange={evt => (viewModel.condition = evt.target.value)}
              disabled={isSubmitting}
              defaultValue={viewModel.condition}
            />
            <ErrorText>{errors.condition}</ErrorText>
          </Field>
          <Field $size="half">
            <Label htmlFor="titleTemplate">Title Template</Label>
            <TextInput
              id="titleTemplate"
              type="text"
              placeholder="Title Template"
              onChange={evt => (viewModel.titleTemplate = evt.target.value)}
              disabled={isSubmitting}
              defaultValue={viewModel.titleTemplate}
            />
            <ErrorText>{errors.titleTemplate}</ErrorText>
          </Field>
          <Field $size="half">
            <Label htmlFor="bodyTemplate">Body Template</Label>
            <TextArea
              id="bodyTemplate"
              placeholder="Title Template"
              rows={5}
              onChange={evt => (viewModel.bodyTemplate = evt.target.value)}
              disabled={isSubmitting}
              defaultValue={viewModel.titleTemplate}
            />
            <ErrorText>{errors.bodyTemplate}</ErrorText>
          </Field>
        </FieldGroup>
        {viewModel.submitError.length > 0 && (
          <FormMessage>{viewModel.submitError}</FormMessage>
        )}
        <FormAction>
          <SaveButton type="submit" disabled={viewModel.isSubmitting}>
            {viewModel.isSubmitting ? <Spinner /> : "Save"}
          </SaveButton>
          <CancelButton type="button" onClick={() => router.back()}>
            Cancel
          </CancelButton>
        </FormAction>
      </Form>
    </MaskingLoader>
  );
};

export default observer(NotificationTemplateUpdate);
