import Dep from './dep.js'
export default class Watcher {
    constructor(getter, cb){
        this.getter = getter
        this.cb = cb
        this.value = undefined
        this.get()
    }
    get(){
        if(this.cb) {
            Dep.target = this
            this.value = this.getter()
            return this.value
        }
    }
    update(){
        const oldValue = this.value
        this.get()
        const newValue = this.value
        this.cb(newValue,oldValue)
    }

}
export function watch(getter,cb)  {
    new Watcher(getter,cb)
}