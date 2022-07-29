import { useState } from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { NotificationTemplateCreateViewModel } from "./createViewModel";
import {
  CancelButton,
  ErrorText,
  Field,
  FieldGroup,
  Form,
  FormAction,
  FormMessage,
  Label,
  SaveButton,
  Select,
  TextArea,
  TextInput,
} from "components/widgets/forms";
import Spinner from "components/widgets/spinner";
import useServices from "lib/services/provider";
import useMyReportTypes from "lib/hooks/reportTypes/myReportTypes";
import useStateTransitions from "lib/hooks/stateTransitions";

const NotificationTemplateCreate = () => {
  const router = useRouter();
  const services = useServices();
  const [viewModel] = useState(
    () =>
      new NotificationTemplateCreateViewModel(
        services.notificationTemplateService
      )
  );

  const reportTypes = useMyReportTypes();
  const { transitionLoading, stateTransitions } = useStateTransitions(
    viewModel.reportTypeId
  );
  const isSubmitting = viewModel.isSubmitting;
  const errors = viewModel.fieldErrors;

  return (
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
            disabled={isSubmitting}
          />
          <ErrorText>{errors.name}</ErrorText>
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
            value={viewModel.reportTypeId}
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
        <Field $size="half">
          <Label htmlFor="titleTemplate">Title Template</Label>
          <TextInput
            id="titleTemplate"
            type="text"
            placeholder="Title Template"
            onChange={evt => (viewModel.titleTemplate = evt.target.value)}
            disabled={isSubmitting}
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
          />
          <ErrorText>{errors.bodyTemplate}</ErrorText>
        </Field>
      </FieldGroup>
      {viewModel.submitError.length > 0 && (
        <FormMessage>{viewModel.submitError}</FormMessage>
      )}
      <FormAction>
        <SaveButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : "บันทึก"}
        </SaveButton>
        <CancelButton type="button" onClick={() => router.back()}>
          Cancel
        </CancelButton>
      </FormAction>
    </Form>
  );
};

export default observer(NotificationTemplateCreate);