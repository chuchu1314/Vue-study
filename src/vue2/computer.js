import Watcher from "./watch.js"
import reactive from "./reactive.js"

export default function computer(getter) {
    const obj = {
        value: ''
    }
    reactive(obj)

    new Watcher(getter,(newVal,oldVal) => {
        obj.value = newVal
    })
    return obj
}