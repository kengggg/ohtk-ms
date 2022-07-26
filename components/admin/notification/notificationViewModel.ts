import { BaseFormViewModel } from "lib/baseFormViewModel";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { INotificationService, Notification } from "lib/services/notification";

export class NotificationViewModel extends BaseFormViewModel {
  notificationService: INotificationService;

  _data: Notification[] = [];
  _activeTabIndex: number = 0;
  _reportTypeId: string = "";

  constructor(notificationService: INotificationService) {
    super();
    makeObservable(this, {
      _data: observable,
      data: computed,
      _activeTabIndex: observable,
      activeTabIndex: computed,
      _reportTypeId: observable,
      reportTypeId: computed,
      save: action,
      setValue: action,
      validate: action,
    });
    this.notificationService = notificationService;
  }

  public get data(): Notification[] {
    return this._data;
  }
  public set data(value: Notification[]) {
    this._data = value;
  }

  public get activeTabIndex(): number {
    return this._activeTabIndex;
  }
  public set activeTabIndex(value: number) {
    this._activeTabIndex = value;
  }

  public get reportTypeId(): string {
    return this._reportTypeId;
  }
  public set reportTypeId(value: string) {
    this._reportTypeId = value;
  }

  setValue(item: Notification, value: string) {
    item.to = value;
  }

  async fetch(reportTypeId: string): Promise<void> {
    this.reportTypeId = reportTypeId;
    const result = await this.notificationService.fetchNotifications(
      this.reportTypeId
    );
    runInAction(() => {
      this.data = result || [];
    });
  }

  public async save(item: Notification): Promise<boolean> {
    this.isSubmitting = true;
    item.isSubmitting = undefined;
    item.submitError = "";
    item.success = undefined;
    item.fieldErrors = {};

    if (this.validate(item)) {
      item.isSubmitting = true;
      var result = await this.notificationService.upsertAuthorityNotification(
        this.reportTypeId,
        item.notificationTemplateId,
        item.to!
      );
      runInAction(() => {
        item.success = result.success;
        if (!result.success) {
          if (result.message) {
            item.submitError = result.message;
          }
          if (result.fields) {
            item.fieldErrors = result.fields;
          }
        }
        item.isSubmitting = false;
      });
      return result.success;
    }
    this.isSubmitting = false;
    return false;
  }

  validate(item: Notification): boolean {
    let isValid = true;
    if (!item.to) {
      isValid = false;
      item.fieldErrors = { to: "this field is required" };
    }

    return isValid;
  }
}
