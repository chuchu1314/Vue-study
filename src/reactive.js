import Dep from './dep.js'
import Watch from './watch.js'

function isObject(obj) {
    return typeof obj === 'object' && obj !== null
}

function defineReactive(obj, key) {
    // 利用闭包的特性，使其在setter和getter方法中能够访问val、dep 
    let val = obj[key]
    const dep = new Dep()

    Object.defineProperty(obj, key, {
        get() {
            dep.addSub()
            return val
        },
        set(newVal) {
            val = newVal
            dep.notify()
        }
    })

    if (isObject(val)) {
        reactive(val)
    }
}

// 将对象定义为响应式
export default function reactive(obj) {
    if (isObject(obj)) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key)
        })
    }
    return obj
}
