import reactive from '../reactive.js'
import Watcher , {watch} from '../watch.js'
import computer from '../computer.js'
const obj = {
    test: 'hello',
    msg: 'something'
}
const data = reactive(obj)
watch(
    () => data.test,
    (newVal, oldVal) => {
        document.getElementById('test').innerHTML = '响应式obj.test：' + newVal
    }
)
const com_data = computer(() => {
    return data.test + data.msg
})
new Watcher(
    () => data.test + data.msg,
    (newVal, oldVal) => {
        document.getElementById('com_data').innerHTML = '计算属性com_data：' + newVal
    }
)

data.test = 'hello'
data.msg = ' world !'
console.log('响应式数据data：', data)
window.data = data
console.log('计算属性com_data：', data)
window.com_data = com_data