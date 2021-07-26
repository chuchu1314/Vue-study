import Dep from './dep.js'

function isObject(obj) {
    return typeof obj === 'object' && obj !== null
}
export function toRef(val) {
    const obj = isObject(val) ? val : { value : val }
    return reactive(obj)
}
export default function reactive(obj) {
    const dep = new Dep()
    const result = new Proxy(obj, {
        get(target, key) {
            dep.addSub()
            return Reflect.get(target,key)
        },
        set(target, key, value) {
            Reflect.set(target,key,value)
            dep.notify()
            return true
        },
        getPrototypeOf(target) {
            return target
        }
    })
    return result
}
