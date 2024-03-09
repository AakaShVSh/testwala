export const setLocalStorage = (key,user) => {
    localStorage.setItem(key,JSON.stringify(user));
}

export const getLocalStorage = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

export const deleteLocalStorage = (key) => {
    localStorage.removeItem(key);
}