import Cookies from 'js-cookie'

export const setCookies = (key,user) => {
 console.log("u",key,user);
   const f = Cookies.set(key, user, { expires: 1,secure:true})
   console.log(f,"f");
}

export const getCookies = (key) => {
    return Cookies.get(key);
}

export const deleteCookies = (key) => {
    Cookies.remove(key)
}