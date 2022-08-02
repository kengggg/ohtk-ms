import { useRouter } from "next/router";
import React, { FC, useCallback, useRef, useState } from "react";
import {
  DocumentTextIcon,
  CubeIcon,
  UserIcon,
  TemplateIcon,
  VariableIcon,
  BellIcon,
  LogoutIcon,
  DocumentReportIcon,
  AnnotationIcon,
  LightBulbIcon,
  CollectionIcon,
  UserCircleIcon,
  SpeakerphoneIcon,
} from "@heroicons/react/outline";
import useStore from "lib/store";
import CollapsIcon from "components/layout/CollapsIcon";
import { observer } from "mobx-react";
import { Menu } from "./menu";
import getConfig from "next/config";
import UserMenu from "./userMenu";
const { publicRuntimeConfig } = getConfig();

const iconClassName = "h-5 w-5 text-gray-300";

const style: Record<string, string | Record<string, string>> = {
  mobilePosition: {
    left: "left-0 ",
    right: "right-0 md:left-0",
  },
  close: `duration-700 ease-out hidden transition-all`,
  default: `flex flex-col absolute z-40 top-0 md:static md:block md:left-auto md:top-auto h-screen  shrink-0 bg-slate-800 p-4`,
  open: `duration-200 ease-in transition-all`,
  collapsed: `md:w-16 w-16 p-2`,
  expanded: `md:w-[250px] w-64 overflow-y-scroll md:overflow-y-auto no-scrollbar md:translate-x-0 transform transition-all duration-200 ease-in-out translate-x-0`,
};
const Sidebar: FC<{ mobilePosition: string }> = ({ mobilePosition }) => {
  const sidebar = useRef(null);
  const router = useRouter();
  const pathname = router.asPath;
  const store = useStore();
  const [isCollapsible, setIsCollapsible] = useState(false);

  const toggleCollapse = useCallback(() => {
    store.toggleCollapseMenu();
  }, [store]);

  const onMouseEnter = () => {
    setIsCollapsible(true);
  };

  const onMouseOver = () => {
    setIsCollapsible(false);
  };

  const onLogout = () => {
    store.signOut();
  };

  return (
    <div>
      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`${style.default} ${
          (style.mobilePosition as Record<string, string>)[mobilePosition]
        }
        ${store.menu.open ? style.open : style.close} ${
          store.menu.collapsed ? style.collapsed : style.expanded
        }`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseOver}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2 relative">
          {isCollapsible && (
            <button
              className={`p-2 rounded bg-light-lighter absolute -right-2 top-4" ${
                store.menu.collapsed ? "rotate-180" : ""
              } `}
              onClick={toggleCollapse}
            >
              <CollapsIcon />
            </button>
          )}
          <div className="flex w-full items-center justify-center sticky mt-8 top-0 z-10">
            <img src="/logo.png" width={120} alt="Open surveillance" />
          </div>
        </div>
        {/* Links */}
        <div className="space-y-8">
          <div>
            <h3
              className={`text-xs uppercase text-slate-500 font-semibold pl-3 ${
                store.menu.collapsed ? "hidden" : ""
              }`}
            >
              <span className="md:sidebar-expanded:block 2xl:block">Pages</span>
            </h3>
            <ul className="mt-3">
              <Menu
                href="/"
                pathname={pathname}
                label="Dashboard"
                collapsed={store.menu.collapsed}
                icon={
                  <TemplateIcon className={`${iconClassName} -rotate-90`} />
                }
              />
              <Menu
                href="/reports/"
                pathname={pathname}
                label="Reports"
                collapsed={store.menu.collapsed}
                icon={<DocumentReportIcon className={iconClassName} />}
              />

              <Menu
                href="/cases"
                pathname={pathname}
                label="Cases"
                collapsed={store.menu.collapsed}
                icon={<DocumentTextIcon className={iconClassName} />}
              />
            </ul>
          </div>

          <div>
            <h3
              className={`
                text-xs uppercase text-slate-500 font-semibold pl-3 ${
                  store.menu.collapsed ? "hidden" : ""
                }`}
            >
              <span className="md:sidebar-expanded:block 2xl:block">
                Settings
              </span>
            </h3>
            <ul className="mt-3">
              <Menu
                href="/admin/authorities/"
                pathname={pathname}
                label="Authorities"
                collapsed={store.menu.collapsed}
                icon={<CubeIcon className={iconClassName} />}
              />
              <Menu
                href="/admin/users/"
                pathname={pathname}
                label="Users"
                collapsed={store.menu.collapsed}
                icon={<UserIcon className={iconClassName} />}
              />
              <Menu
                href="/admin/report_categories/"
                pathname={pathname}
                label="Category"
                collapsed={store.menu.collapsed}
                icon={<CollectionIcon className={iconClassName} />}
              />
              <Menu
                href="/admin/report_types/"
                pathname={pathname}
                label="Report types"
                collapsed={store.menu.collapsed}
                icon={<DocumentReportIcon className={iconClassName} />}
              />
              <Menu
                href="/admin/invitation_codes/"
                pathname={pathname}
                label="Invitation codes"
                collapsed={store.menu.collapsed}
                icon={<AnnotationIcon className={iconClassName} />}
              />

              <Menu
                href="/admin/case_definitions"
                pathname={pathname}
                label="Case Definition"
                collapsed={store.menu.collapsed}
                icon={<VariableIcon className={iconClassName} />}
              />

              <Menu
                href="/admin/state_definitions"
                pathname={pathname}
                label="State Definition"
                collapsed={store.menu.collapsed}
                icon={<LightBulbIcon className={iconClassName} />}
              />
              <Menu
                href="/admin/notification_templates"
                pathname={pathname}
                label="Notification Template"
                collapsed={store.menu.collapsed}
                icon={<TemplateIcon className={iconClassName} />}
              />
              <Menu
                href="/admin/notifications"
                pathname={pathname}
                label="Notification"
                collapsed={store.menu.collapsed}
                icon={<BellIcon className={iconClassName} />}
              />
              <Menu
                href="/admin/reporter_notifications"
                pathname={pathname}
                label="Reporter notification"
                collapsed={store.menu.collapsed}
                icon={<SpeakerphoneIcon className={iconClassName} />}
              />
            </ul>
          </div>
          <div>
            <h3
              className={`
                text-xs uppercase text-slate-500 font-semibold pl-3 ${
                  store.menu.collapsed ? "hidden" : ""
                }`}
            >
              <span className="md:sidebar-expanded:block 2xl:block"></span>
            </h3>
            <ul className="mt-3">
              <div className="flex items-center">
                <div className="w-12 h-12 sm:w-12 sm:h-12">
                  {store.me?.avatarUrl ? (
                    <img
                      src={`${publicRuntimeConfig.serverUrl}/${store.me?.avatarUrl}`}
                      alt={`${store.me?.username}'s avatar`}
                      className="shadow-md rounded-full w-full h-full align-middle border-2"
                    />
                  ) : (
                    <div className="rounded-full max-w-full h-12 w-12 align-middle border-2 flex justify-center items-center bg-gray-200 p-4"></div>
                  )}
                </div>
                <UserMenu className="ml-2 text-white" />
              </div>
              <Menu
                href="/admin/profile/"
                pathname={pathname}
                label="Profile"
                collapsed={store.menu.collapsed}
                icon={<UserCircleIcon className={iconClassName} />}
              />

              <Menu
                href="/admin/logout/"
                pathname={pathname}
                label="Logout"
                collapsed={store.menu.collapsed}
                onClick={onLogout}
                icon={<LogoutIcon className={iconClassName} />}
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(Sidebar);
