import { useEffect } from "react";
import { Form, Link, NavLink, useLocation, Outlet } from "@remix-run/react";
import { clsx } from "clsx";
import { useAuthorize } from "~/secure";
import {
    IconChevronDown,
    IconLogout,
    IconLogin,
    IconUser,
    IconUserScan,
    IconShoppingCartCog,
    IconLockAccess,
    IconHome,
} from "@tabler/icons-react";
import { useHandleData } from "~/utils/hooks";

export type LayoutOptions = {
    useSidebar?: boolean;
};

export default function Frame(props: { context?: unknown }) {
    const { user } = useAuthorize();
    const location = useLocation();
    const handleData = useHandleData<{ layout?: { useSidebar?: boolean } }>(-1);
    useEffect(() => {
        // close dropdowns when the location changes
        if (typeof window != "undefined" && document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }, [location]);
    return (
        <>
            <div className="navbar sticky top-0 border-b border-base-content/5 bg-base-100 bg-opacity-75 backdrop-blur">
                <div className="navbar-start">
                    <Link to="/" className="btn btn-ghost text-xl">
                        <span className="uppercase">Gommerce</span>
                    </Link>
                </div>
                <div className="navbar-center"></div>
                <div className="navbar-end">
                    <NavLink to={"/login"} className={clsx("btn btn-ghost", { hidden: !!user })}>
                        <IconLogin size="1em" />
                        Login
                    </NavLink>
                    <div id="user-dropdown" className={clsx("dropdown dropdown-end", { hidden: !user })}>
                        <div tabIndex={0} role="button" className="btn btn-ghost">
                            <IconUser size="1em" />
                            {user?.attributes["profile.display_name"] ?? "Anonymous"}
                            <IconChevronDown size="1em" />
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu dropdown-content w-52 rounded-box border border-base-content/5 bg-base-100 bg-opacity-95 shadow-2xl"
                        >
                            <li>
                                <NavLink to={"/profile"}>
                                    <IconUserScan size="1em" />
                                    Profile
                                </NavLink>
                            </li>
                            <li>
                                <Form action="/logout" method="post" className="hidden">
                                    <input id="navbar-logout-submit" type="submit" />
                                </Form>
                                <label htmlFor="navbar-logout-submit" role="button">
                                    <IconLogout size="1em" />
                                    Logout
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {handleData?.layout?.useSidebar !== false ? (
                <div>
                    <aside className="fixed bottom-0 top-16 hidden w-72 overflow-auto md:block">
                        <div className="p-4">
                            <ul className="menu w-full rounded-box">
                                <li>
                                    <NavLink to="/" className="flex items-center gap-2">
                                        <IconHome size="1em" />
                                        Home
                                    </NavLink>
                                </li>
                                <li>
                                    <span className="menu-title flex select-none items-center gap-2">
                                        <IconUser size="1em" />
                                        User
                                    </span>
                                    <ul>
                                        <li>
                                            <NavLink to="/profile">Profile</NavLink>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <span className="menu-title flex select-none items-center gap-2">
                                        <IconLockAccess size="1em" />
                                        IAM
                                    </span>
                                    <ul>
                                        <li>
                                            <NavLink to="/iam/users">Users</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/iam/roles">Roles</NavLink>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <span className="menu-title flex select-none items-center gap-2">
                                        <IconShoppingCartCog size="1em" /> SKU
                                    </span>
                                    <ul></ul>
                                </li>
                            </ul>
                        </div>
                    </aside>
                    <main className="md:ml-72">
                        <div className="p-4">
                            <Outlet />
                        </div>
                    </main>
                </div>
            ) : (
                <main>
                    <Outlet />
                </main>
            )}
        </>
    );
}
