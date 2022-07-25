import { BaseFormViewModel } from "lib/baseFormViewModel";
import {
  NotificationTemplate,
  INotificationTemplateService,
} from "lib/services/notificationTemplate";
import { SaveResult } from "lib/services/interface";
import { action, computed, makeObservable, observable } from "mobx";

export abstract class NotificationTemplateViewModel extends BaseFormViewModel {
  notificationTemplateService: INotificationTemplateService;

  _name: string = "";
  _reportTypeId: string = "";
  _stateTransitionId: number = 0;
  _titleTemplate: string = "";
  _bodyTemplate: string = "";

  constructor(notificationTemplateService: INotificationTemplateService) {
    super();
    makeObservable(this, {
      _name: observable,
      name: computed,
      _reportTypeId: observable,
      reportTypeId: computed,
      _stateTransitionId: observable,
      stateTransitionId: computed,
      _titleTemplate: observable,
      titleTemplate: computed,
      _bodyTemplate: observable,
      bodyTemplate: computed,
      save: action,
      validate: action,
    });
    this.notificationTemplateService = notificationTemplateService;
  }

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
    delete this.fieldErrors["name"];
    if (this.submitError.length > 0) {
      this.submitError = "";
    }
  }

  public get reportTypeId(): string {
    return this._reportTypeId;
  }
  public set reportTypeId(value: string) {
    this._reportTypeId = value;
    delete this.fieldErrors["reportTypeId"];
    if (this.submitError.length > 0) {
      this.submitError = "";
    }
  }

  public get stateTransitionId(): number {
    return this._stateTransitionId;
  }
  public set stateTransitionId(value: number) {
    this._stateTransitionId = value;
    delete this.fieldErrors["stateTransitionId"];
    if (this.submitError.length > 0) {
      this.submitError = "";
    }
  }

  public get titleTemplate(): string {
    return this._titleTemplate;
  }
  public set titleTemplate(value: string) {
    this._titleTemplate = value;
    delete this.fieldErrors["titleTemplate"];
    if (this.submitError.length > 0) {
      this.submitError = "";
    }
  }

  public get bodyTemplate() {
    return this._bodyTemplate;
  }

  public set bodyTemplate(value) {
    this._bodyTemplate = value;
    delete this.fieldErrors["bodyTemplate"];
    if (this.submitError.length > 0) {
      this.submitError = "";
    }
  }

  public abstract _save(): Promise<SaveResult<NotificationTemplate>>;

  public async save(): Promise<boolean> {
    this.isSubmitting = true;

    if (this.validate()) {
      var result = await this._save();

      this.isSubmitting = false;

      if (!result.success) {
        if (result.message) {
          this.submitError = result.message;
        }
        if (result.fields) {
          this.fieldErrors = result.fields;
        }
      }
      return result.success;
    }
    this.isSubmitting = false;
    return false;
  }

  validate(): boolean {
    let isValid = true;
    if (this.name.length === 0) {
      isValid = false;
      this.fieldErrors["name"] = "this field is required";
    }

    if (this.stateTransitionId === 0) {
      isValid = false;
      this.fieldErrors["stateTransitionId"] = "this field is required";
    }
    if (this.reportTypeId.length === 0) {
      isValid = false;
      this.fieldErrors["reportTypeId"] = "this field is required";
    }

    if (this.titleTemplate.length === 0) {
      isValid = false;
      this.fieldErrors["titleTemplate"] = "this field is required";
    }

    if (this.bodyTemplate.length === 0) {
      isValid = false;
      this.fieldErrors["bodyTemplate"] = "this field is required";
    }

    return isValid;
  }
}
