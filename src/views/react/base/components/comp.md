import {Alert} from 'antd'

* 组件，从概念上类似于 JavaScript 函数。它接受任意的入参（即 “props”），并返回用于描述页面展示内容的 React 元素。

<Alert
    message="注意： 组件名称必须以大写字母开头。"
    description="React 会将以小写字母开头的组件视为原生 DOM 标签。"
    type="warning"
    showIcon
/>


```jsx live=true noInline=true

const Demo = () => {

  return (
    <div>Demo</div>
  )
}

render (
  <Demo />
)

```

* React中创建组件分为两种方式（class, function）
* 最初16.8以前创建组件的方式都是class，因为函数组件没有自己的状态，通常函数组件都是作为UI组件被使用（修改UI通过Props）。
* class组件的状态挂载在this上
* 注意: class上定义的函数默认this并没有指向当前组件需要手动绑定this

```jsx render=true noInline=true

function Demo(props) {
    // 当前组件没有自身状态， props进行渲染
    return (
        <Button type="primary" onClick={() => props.clear()}>{props.count || 0}</Button>
    )
}

class ClassComponent extends React.Component {
    state = {
        count: 0,
        timer: null
    }

    // 即将弃用 组件即将渲染 16采用fiber架构后这个生命周期处于调和阶段，这个阶段的可以中断，也就是会执行多次这个生命周期
    /*
        react16 以后做了很大的改变，对 diff 算法进行了重写，从总体看，主要是把一次计算，改变为多次计算，在浏览器有高级任务时，暂停计算。
    */
    // UNSAFE_componentWillMount(){}
    // UNSAFE_componentWillUpdate(nextProps, nextState){}

    static getDerivedStateFromError(error) {
        // 当组件发生错误的时候调用 可以在这里处理错误逻辑一般用于错误页面展示
    }

    // 只有props改变的时候会调用 获取从props传入的值一般用于赋值state 16.8以后替换componentWillReceiveProps生命周期
    static getDerivedStateFromProps(props, state) {
        console.log('getDerivedStateFromProps');
        return {}
    }

    // constructor() {
    //     // 第三种  构造函数绑定this
    //     this.clear = this.clear.bind(this)
    // }

    // 在最近一次渲染输出（提交到 DOM 节点）之前调用。它使得组件能在发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）。此生命周期方法的任何返回值将作为参数传递给 componentDidUpdate()。 替换 componentWillUpdate
    getSnapshotBeforeUpdate(prevProps, prevState) {
        console.log('getSnapshotBeforeUpdate');
         return {}
    }

    componentDidMount() {
        console.log('componentDidMount');
        this.timer = setInterval(() => {
            this.setState({
                count: this.state.count + 1
            })
        }, 1000)
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        console.log('componentDidUpdate');
    }

    componentWillUnmount() {
        console.log('componentWillUnmount');
        clearInterval(this.timer);
    }

    clear() {
        console.log(this); // 当前this指向的事Demo组件 需要手动绑定this
        // 1. clear={this.clear.bind(this)}
        clearInterval(this.timer);
    }

    // 2.使用箭头函数
    // clear = () => {
    //     clearInterval(this.timer);
    // }

    render() {
        return (
            <Demo count={this.state.count} clear={this.clear.bind(this)}/>
        )
    }
}

render(
    <ClassComponent/>
)

```

* 自16.8React新增Hooks特性之后函数组件随着成为主流（函数组件也可以通过hooks管理自己内部状态）。
```jsx render=true noInline=true

const HooksA = () => {
    
    const [message, setMessage] = useState('hello')

    return (
        <Button onClick={() => setMessage("world")} type="primary">{message}</Button>
    )
}

render(
    <HooksA />
)

```

* 组件修改state只能通过setState这个方法去修改，不能直接去修改
* State的更新是异步的, 出于性能考虑，React 可能会把多个 setState() 调用合并成一个调用。
* 注意：由于props和state的更新可能会异步进行， 所以不要依赖他们的值进行更新。
* State的更新会被合并，React会把修改的state进行合并然后统一更新，所以当修改多次同一属性可能只会更新一次UI。
```jsx render=true noInline=true
class Demo extends React.Component {

    state = {
        count: 0
    }

    handleChangeCount = () => {
        // 更新对象被合并 （类似于 {...{{count: this.state.count +1}, {count: this.state.count +1}, {count: this.state.count +1}}}） 
        // 所以最终只会修改一次
        this.setState({count: this.state.count + 1})
        this.setState({count: this.state.count + 1})
        this.setState({count: this.state.count + 1})
    }

    render() {
        return <Button onClick={this.handleChangeCount} type="primary">{this.state.count}</Button>
    }
}

render(
    <Demo />
)

```

* class纯组件PureComponent 
    * 由于每次react渲染都会更新UI但是有些组件的state和props并没有发生改变所以它是不需要进行渲染
    * react组件是否渲染需要开发者通过shouldComponentUpdate这个生命周期进行判断,默认情况下是只要state或者props更新就会重新渲染组件
    * 通过PureComponent组件就会对props进行浅比较，当props没有发生改变的时候不需要更新组件
    * 函数组件可以通过memo实现相同效果
```jsx live=true noInline=true

// child1只要父组件更新它也会更新
class Child1 extends Component {

    render() {
        console.log('child1, render');
        return (
            <div>child1</div>
        )
    }
}

// child2使用了PureComponent对传入props进行了浅比较， 它没有依赖props自身状态也没发生变化 所以不会重新进行渲染
class Child2 extends PureComponent {
    render() {
        console.log('child2, render');
        return (
            <div>child2</div>
        )
    }
}

const Child3 = memo(() => {
    console.log('child3, render');
     return (
        <div>child3</div>
    )
})

class Demo extends Component {

    state = {
        message: "hello"
    }

    shouldComponentUpdate(nextProps, nextState) {
        // 当返回了false那就无论如何也不会对UI进行更新
        return false
    }

    handleChangeMessage = () => {
        this.setState({
            message: "world"
        }, () => {
            alert(this.state.message)
        })
    }

    render() {
        
        const {message} = this.state

        return (
            <>
                <Button type="primary" onClick={this.handleChangeMessage}>{message}</Button>
                <Child1 />
                <Child2 />
                <Child3 />
            </>
        )
    }
}

render( 
    <Demo/>
)

```