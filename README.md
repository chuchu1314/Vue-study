
# Vue2 数据响应式原理

::: tip
Object.defineProperty()的作用, getter、setter函数的用法
:::
<!-- more -->
## 实现响应式数据
- 在一个对象上新增属性或修改现有属性，返回此对象。
- ```Object.defineProperty(obj, prop, descriptor)```: obj（要修改的对象），prop（要修改或新增的key），descriptor(要修改或新增的属性描述)
```js
    const obj = {}
    Object.defineProperty(obj, 'value', {
        value: 1,
        writable: false // 设置value属性的值不可改变
    })
    obj.value = 2 // 并不会起作用
    console.log(obj.value) // 1

```
- 那么如何根据Object.defineProperty设置一个响应式对象
```js
let obj = {
    test: 1
}
const key = 'test'
let val = obj.test
Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get: function () {
        console.log(`获取${key}的值`)
        return val
    },
    set: function (value) {
        console.log(`设置${key}的值为：${value}`)
        val = value
    }
})
obj.test = 12
// > 设置test的值为：12
console.log(obj.test)
// > 获取test的值
// > 12

```
```js
// reactive.js
// 简单封装一下
function isObject(obj) {
    return typeof obj === 'object' && obj !== null
}

function defineReactive(obj, key,cb) {
    let val = obj[key]
    const dep = new Dep()

    Object.defineProperty(obj, key, {
        get() {
            return val
        },
        set(newVal) {
            val = newVal
            cb()
        }
    })

    if (isObject(val)) {
        reactive(val)
    }
}
function reactive(obj,cb) {
    if (isObject(obj)) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key,cb)
        })
    }
    return obj
}
```
- 试一试更新视图
```html
<div id="app"></div>
<!-- reactive.js 上面的封装内容 -->
<script src="./reactive.js"></script>
<script>
    const obj = {
        test: 'hello'
    }
    reactive(obj,() => {
        document.getElementById('app').innerHTML = obj.test
    })
    obj.test = 'hello world'

</script>
```

## 实现Watcher
- 第一步实现了简单的响应式更新视图，但是还有很多的问题，如果obj的其他属性更新，任然会触发回调，那么就需要obj的属性更新，对应的回调才会触发，也就是依赖收集。
```js
// dep.js
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
```
```js
// watch.js
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
```
```js
// index.js 测试
import reactive from './reactive.js'
import Watcher , {watch} from './watch.js'

const obj = {
    test: 'hello',
    msg: 'something'
}
reactive(obj)
watch(
    () => obj.test,
    (newVal, oldVal) => {
        console.log(newVal,oldVal)
        document.getElementById('app').innerHTML = obj.test
    }
)
new Watcher(
    () => obj.msg,
    (newVal, oldVal) => {
        console.log(newVal,oldVal)
    }
)
obj.test = 'test' // 输出：test hello，并修改了app的innerHtml为test
obj.msg = '123' // 输出：123 something
window.obj = obj // 挂载到window上，方便在控制台直接修改obj

```

## 实现Computer
- 第二步实现了响应式数据的监听，其中有个取巧的方法就是在getter中dep.addSub() 方法中因为Set数据类型的唯一性，避免了多次触发getter时，添加多个回调在subs中。
- 第三部尝试实现一个computer 计算属性。
```js
// computer.js
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

```