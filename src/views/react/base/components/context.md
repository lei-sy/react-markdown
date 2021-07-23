import {Alert} from 'antd'

* **在一个典型的 React 应用中，数据是通过 props 属性自上而下（由父及子）进行传递的但是如果有一些全局共享状态如果逐层传递就很复杂。Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props。**
```jsx render=true
class App extends Component {
    render() {
        return <Toolbar theme="primary" />;
    }
}

function Toolbar(props) {
  // Toolbar 组件接受一个额外的“theme”属性，然后传递给 ThemedButton 组件。
  // 如果应用中每一个单独的按钮都需要知道 theme 的值，这会是件很麻烦的事，
  // 因为必须将这个值层层传递所有组件。
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
}

class ThemedButton extends React.Component {
  render() {
    return <Button type={this.props.theme} >Context</Button>;
  }
}

render (
    <App />
)

```

* 使用Context就可以不必在组件之间层层传递
```jsx render=true

const ButtonContext = createContext('primary')

class App extends Component {
    render() {
        return <ButtonContext.Provider value="dashed">
        <Toolbar />
      </ButtonContext.Provider>;
    }
}

function Toolbar(props) {
  // Toolbar 组件接受一个额外的“theme”属性，然后传递给 ThemedButton 组件。
  // 如果应用中每一个单独的按钮都需要知道 theme 的值，这会是件很麻烦的事，
  // 因为必须将这个值层层传递所有组件。
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {

  static contextType = ButtonContext;

  render() {
    return <Button type={this.context} >Context</Button>;
  }
}

render (
    <App />
)

```

## React.createContext
  * 创建一个Context，当组件渲染订阅了Context对象中的属性，就会从距离组件自身最近的Provider获取Context值
  * **注意：将 undefined 传递给 Provider 的 value 时，消费组件的 defaultValue 不会生效。**

## Context.Provider
  * 每个Context对象都会返回一个组件，当被Provide包裹的组件所有的下层组件都会共享到Context对象中的值。
  * Provider组件接收一个value属性，向下传递给消费组件。Provider组件可以嵌套，值取最近。
  * 当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染。

<Alert
  message="注意"
  description="当Provider组件重新渲染的时候，它的所有下级组件都会重新渲染（因为每次重新渲染都会赋值一个新的对象）。为了避免不必要的渲染，可以将Provider的value属性保存到组件的State中"
  type="warning"
  showIcon
/>

```jsx
class App extends React.Component {
  render() {
    return (
      <MyContext.Provider value={{something: 'something'}}>
        <Toolbar />
      </MyContext.Provider>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {something: 'something'},
    };
  }

  render() {
    return (
      <MyContext.Provider value={this.state.value}>
        <Toolbar />
      </MyContext.Provider>
    );
  }
}

```

## Class.contextType
  * clss组件的静态属性,可以让组件就近消费Provider的值
  * 可以在任何生命周期中访问到它，包括 render 函数中。
  * 只能订阅单个context

## Context.Consumer(获取Provider的值)
  * 需要接收一个函数作为子元素，参数为最近Provider传入的value，然后返回一个组件

## Context.displayName
  * context 对象接受一个名为 displayName 的 property，类型为字符串。React DevTools 使用该字符串来确定 context 要显示的内容。

```jsx

const MyContext = React.createContext(/* some value */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" 在 DevTools 中
<MyContext.Consumer> // "MyDisplayName.Consumer" 在 DevTools 中

```