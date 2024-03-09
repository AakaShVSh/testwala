import Cookies from 'js-cookie'

export const setCookies = (key,user) => {
 console.log("u",key,user);
    Cookies.set(key, user, { expires: 1},{httpOnly:true},{secure:true})
}

export const getCookies = (key) => {
    return Cookies.get(key);
}

export const deleteCookies = (key) => {
    Cookies.remove(key)
}