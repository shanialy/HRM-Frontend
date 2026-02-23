"use client";

import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useEffect } from "react";
import { hydrateAuth } from "../redux/slices/authSlice";

function AuthHydration() {
    useEffect(() => {
        store.dispatch(hydrateAuth());
    }, []);

    return null;
}

export default function ReduxProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Provider store={store}>
            <AuthHydration />
            {children}
        </Provider>
    );
}
