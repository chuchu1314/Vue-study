
export default class Dep {
    constructor() {
        this.subs = new Set()
    }
    addSub() {
       Dep.target && this.subs.add(Dep.target)
    }
    notify() {
        if(!this.subs.size) return
        this.subs.forEach(watcher => watcher.update())
    }
}
Dep.target = undefined