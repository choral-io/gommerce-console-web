import { Form, Link, NavLink, Outlet, useLocation } from "@remix-run/react";
import { clsx } from "clsx";
import { createLucideIcon, LucideChevronDown, LucideHouse, LucideLogIn, LucideLogOut, LucideUser } from "lucide-react";
import { useEffect } from "react";
import { useAuthorize } from "~/secure";
import { useHandleData } from "~/utils/hooks";

// https://tabler.io/icons/icon/lock-access
const LucideLockAccess = createLucideIcon("LockAccess", [
    ["path", { d: "M4 8v-2a2 2 0 0 1 2 -2h2", key: "p1" }],
    ["path", { d: "M4 16v2a2 2 0 0 0 2 2h2", key: "p2" }],
    ["path", { d: "M16 4h2a2 2 0 0 1 2 2v2", key: "p3" }],
    ["path", { d: "M16 20h2a2 2 0 0 0 2 -2v-2", key: "p4" }],
    ["path", { d: "M8 11m0 1a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1z", key: "p5" }],
    ["path", { d: "M10 11v-2a2 2 0 1 1 4 0v2", key: "p6" }],
]);

// https://tabler.io/icons/icon/shopping-cart-cog
const LucideShoppingCartCog = createLucideIcon("ShoppingCartCog", [
    ["path", { d: "M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0", key: "p1" }],
    ["path", { d: "M12 17h-6v-14h-2", key: "p2" }],
    ["path", { d: "M6 5l14 1l-.79 5.526m-3.21 1.474h-10", key: "p3" }],
    ["path", { d: "M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0", key: "p4" }],
    ["path", { d: "M19.001 15.5v1.5", key: "p5" }],
    ["path", { d: "M19.001 21v1.5", key: "p6" }],
    ["path", { d: "M22.032 17.25l-1.299 .75", key: "p7" }],
    ["path", { d: "M17.27 20l-1.3 .75", key: "p8" }],
    ["path", { d: "M15.97 17.25l1.3 .75", key: "p9" }],
    ["path", { d: "M20.733 20l1.3 .75", key: "p10" }],
]);

// https://tabler.io/icons/icon/user-scan
const LucideUserScan = createLucideIcon("UserScan", [
    ["path", { d: "M10 9a2 2 0 1 0 4 0a2 2 0 0 0 -4 0", key: "p1" }],
    ["path", { d: "M4 8v-2a2 2 0 0 1 2 -2h2", key: "p2" }],
    ["path", { d: "M4 16v2a2 2 0 0 0 2 2h2", key: "p3" }],
    ["path", { d: "M16 4h2a2 2 0 0 1 2 2v2", key: "p4" }],
    ["path", { d: "M16 20h2a2 2 0 0 0 2 -2v-2", key: "p5" }],
    ["path", { d: "M8 16a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2", key: "p6" }],
]);

export interface LayoutOptions {
    useSidebar?: boolean;
}

export default function Layout(_: { context?: unknown }) {
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
            <div className="navbar bg-base-100 border-b-base-200 sticky top-0 border-b backdrop-blur">
                <div className="navbar-start">
                    <Link to="/" className="btn btn-ghost text-xl">
                        <span className="uppercase">Gommerce</span>
                    </Link>
                </div>
                <div className="navbar-center"></div>
                <div className="navbar-end">
                    <NavLink to={"/login"} className={clsx("btn btn-ghost", { hidden: !!user })}>
                        <LucideLogIn size="1em" />
                        Login
                    </NavLink>
                    <div id="user-dropdown" className={clsx("dropdown dropdown-end", { hidden: !user })}>
                        <div tabIndex={0} role="button" className="btn btn-ghost">
                            <LucideUser size="1em" />
                            {user?.attributes["profile.display_name"] ?? "Anonymous"}
                            <LucideChevronDown size="1em" />
                        </div>
                        <ul
                            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                            tabIndex={0}
                            className="menu dropdown-content rounded-box bg-base-100 dark:bg-base-300 bg-opacity-95 mt-4 w-52 shadow-md"
                        >
                            <li>
                                <NavLink to={"/profile"}>
                                    <LucideUserScan size="1em" />
                                    Profile
                                </NavLink>
                            </li>
                            <li>
                                <Form action="/logout" method="post" className="hidden">
                                    <input id="navbar-logout-submit" type="submit" />
                                </Form>
                                <label
                                    htmlFor="navbar-logout-submit"
                                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                                    role="button"
                                >
                                    <LucideLogOut size="1em" />
                                    Logout
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            {handleData?.layout?.useSidebar !== false ? (
                <div>
                    <aside className="fixed top-16 bottom-0 hidden w-72 overflow-auto md:block">
                        <div className="p-4">
                            <ul className="menu rounded-box w-full">
                                <li>
                                    <NavLink to="/" className="flex items-center gap-2">
                                        <LucideHouse size="1em" />
                                        Home
                                    </NavLink>
                                </li>
                                <li>
                                    <span className="menu-title flex items-center gap-2 select-none">
                                        <LucideUser size="1em" />
                                        User
                                    </span>
                                    <ul>
                                        <li>
                                            <NavLink to="/profile">Profile</NavLink>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <span className="menu-title flex items-center gap-2 select-none">
                                        <LucideLockAccess size="1em" />
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
                                    <span className="menu-title flex items-center gap-2 select-none">
                                        <LucideShoppingCartCog size="1em" /> SKU
                                    </span>
                                    <ul></ul>
                                </li>
                            </ul>
                        </div>
                    </aside>
                    <main className="p-4 md:ml-72">
                        <Outlet />
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
