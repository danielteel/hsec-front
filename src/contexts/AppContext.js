import Cookies from 'js-cookie';
import { createContext, useContext, useState, useEffect } from 'react';

import { userLogin, userMe, userLogout, userLogoutEverywhere, userChangePassword, userForgotStart, userForgotEnd, userChangeEmailEnd, userChangeEmailStart, userChangeEmailStatus, userCreate, userVerifyEmail } from '../api/user';
import { manageUsers, manageUserRole, manageUserEmail } from '../api/manage';
import { camGetDetails, camAdd, camDelete, camUpdate } from '../api/cam';



function makeApiObject(setUserFn) {
    const checkForLogout = (passed, message, status) => {
        if (status === 401 && message.error === 'log in') {
            setUserFn(null);
        }
        return [passed, message];
    }
    return {
        userMe: async () => checkForLogout(...await userMe()),
        userLogin: async (email, password, remember) => await userLogin(email, password, remember),
        userLogout: async () => {
            const ret = await userLogout();
            Cookies.remove('hashcess', { domain: window.location.hostname });
            setUserFn(null);
            return ret;
        },
        userLogoutEverywhere: async () => {
            const ret = await userLogoutEverywhere();
            if (ret[0]){            
                setUserFn(null);
                Cookies.remove('hashcess', { domain: window.location.hostname });
            }
            return ret;
        },
        userChangePassword: async (oldPassword, newPassword) => checkForLogout(...await userChangePassword(oldPassword, newPassword)),
        userForgotStart: async (email) => await userForgotStart(email),
        userForgotEnd: async (email, newPassword, confirmCode) => await userForgotEnd(email, newPassword, confirmCode),
        userChangeEmailEnd: async (confirmCode) => checkForLogout(...await userChangeEmailEnd(confirmCode)),
        userChangeEmailStart: async (newEmail, password) => checkForLogout(...await userChangeEmailStart(newEmail, password)),
        userChangeEmailStatus: async () => checkForLogout(...await userChangeEmailStatus()),
        userCreate: async (email) => await userCreate(email),
        userVerifyEmail: async (email, password, confirmCode) => await userVerifyEmail(email, password, confirmCode),

        manageUsers: async (roleFilter) => checkForLogout(...await manageUsers(roleFilter)),
        manageUserRole: async (userId, newRole) => checkForLogout(...await manageUserRole(userId, newRole)),
        manageUserEmail: async (userId, newEmail) => checkForLogout(...await manageUserEmail(userId, newEmail)),

        camGetDetails: async () => checkForLogout(...await camGetDetails()),
        camAdd: async (obj) => checkForLogout(...await camAdd(obj)),
        camDelete: async (which) => checkForLogout(...await camDelete(which)),
        camUpdate: async (obj) => checkForLogout(...await camUpdate(obj)),
    };
}

const AppContext = createContext();

export function useAppContext() {
    return useContext(AppContext);
}

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [api] = useState(() => makeApiObject(setUser));
    const [startingUp, setStartingUp] = useState(true);

    useEffect(() => {
        async function loadUser() {
            const [passed, me] = await userMe();
            if (passed) {
                setUser(me);
            }
            setStartingUp(false);
        }
        loadUser();
    }, []);


    return (
        <AppContext.Provider value={{ api, user, setUser, startingUp }}>
            {children}
        </AppContext.Provider>
    );
}