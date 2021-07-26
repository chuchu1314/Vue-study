import reactive from '../reactive.js'
import Watcher , {watch} from '../watch.js'
import computer from '../computer.js'
const obj = {
    test: 'hello',
    msg: 'something'
}
reactive(obj)
console.log(obj)
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
const com_data = computer(() => {
    return obj.test + obj.msg
})
obj.test = 'test'
obj.msg = '123'
window.obj = obj
window.com_data = com_data
console.log('计算属性',com_data)