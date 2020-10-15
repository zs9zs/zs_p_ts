/*-------------------------------------------------------- 一、基本类型 --------------------------------------------------------*/
let isDone: boolean = false // 布尔值
let decLiteran: number = 10 // 数字
let namestring: string = 'bob' // 字符串
let nametemplate: string = `bob, age: ${decLiteran}` // 模板字符串
let list: number[] = [1, 2, 3] // 数组1
let list2: Array<number> = [1, 2, 3] // 数组2

// 元组Tuple，表示一个已知元素数量和类型的数组
let xxxx: [string, number]
xxxx = ['hello', 10] // 元组Tuple，若访问一个越界元素：x[3] = 'world' => OK，x[3] = true => Error

// 枚举
enum Color {Red = 1, Green = 2, Blue}
let c: Color = Color.Green // 打印 c => 2
let d: string = Color[2] // 根据枚举的值得到它的名字，打印 d => 'Green'

// 任意类型any（Object类型的变量只允许你给它赋任意值，但是不能够在它上面调用任意的方法，即使他真的有这些方法）
let notSure: any = 4

// void类型与any相反，表示没有任何类型
function warnUser(): void { // 当一个函数没有返回值时，通常会见到其返回值类型是void
  console.log("This is my warning message")
}
let unusable: void = undefined // 生命一个void类型的变量没什么大用，因为只能为它赋予undefined和null

// Null和Undefined
// 两者各自有自己的类型分别叫null和undefined，它们本身的类型用处不是很大
let u: undefined = undefined
let n: null = null
// 默认情况下null和undefined是所有类型的子类型。可以把他俩赋值给number类型的变量
// 如果指定了--strictNullChecks标记，null和undefined只能赋值给void和它们各自

// Never
// 表示那些永远不存在的值类型。如：抛出异常/没有返回值的函数表达式/箭头函数表达式的返回值类型
// 变量也可能是never类型，当它们被永不为真的类型保护所约束时
// never是任何类型的子类型，也可以赋值给任何类型；
// 然而，没有类型是never的子类型或可以赋值给never类型（除never本身外）。即使any也不可以赋值给never
function error (msg: string): never { // 返回never的函数必须存在无法到达的终点
  throw new Error(msg)
}
function fail (): never { // 推断的返回值类型为never
  return error('Something failed')
}
function infiniteLoop(): never { // 返回never的函数必须存在无法到达的终点
  while (true) {}
}

// Object
// 表示非原始类型，除number,string,boolean,symbol,null,undefined之外的类型
// 使用object类型，可更好的表示像Object.create这样的API
declare function create(o: object | null): void
create({prop: 0}) // OK
create(null) // OK  错误例： create(42) // Error

// 类型断言
let someValue: any = "this is a string"
let strLength: number = (<string>someValue).length
let strLength2: number = (someValue as string).length

/*-------------------------------------------------------- 二、变量声明 --------------------------------------------------------*/
/*-------------------------------------------------------- 三、接口 --------------------------------------------------------*/
// 1、必选属性
interface LabelledValue {
  label: string
}

// 2、可选属性
interface SquareConfig {
  color?: string;
  width?: number;
}
function creatreSquare(config: SquareConfig): {color: string; area: number} {
  let newSquare = {color: "width", area: 100}
  if (config.color) {
    newSquare.color = config.color
  }
  if (config.width) {
    newSquare.area = config.width * config.width
  }
  return newSquare
}
let mySquare = creatreSquare({color: "black"})

// 3、只读属性
interface Point {
  readonly x: number
  readonly y: number
}
// 通过赋值一个对象字面量来构造一个Point。赋值后，x和y再也不能被改变
let p1:Point = {x: 10, y: 20} // p1.x = 5 // error!
// ts 具有ReadonlyArray<T>类型，与Array<T>相似，只是把所有可变方法去掉了，因此可以确保数组创建后再也不能被修改
let a: number[] = [1, 2, 3, 4]
let ro: ReadonlyArray<number> = a // ro[0] = 12 或 ro.push(5) 或 a = ro => error!
// a = ro 把整个ReadonlyArray赋值到一个普通数组也是不可以的，但是可以用类型断言重写
a = ro as number[]
// readonly和const使用选择：做为变量使用的话用const，做为属性使用readonly

// 5、额外的属性检查
// 若上面mySquare创建时color写错为colo/colour，虽然colo/colour可能是无意义的，但在ts里，会认为这段代码可能存在bug
// 对象字面量会被特殊对待而且会经过额外属性检查，当将它们赋值给变量或做为参数传递的时候
// 如果要绕开这些检查
// 5.1、使用类型断言 let mySquare = createSquare({width:100,opacity:0.5} as SquareConfig)
// 5.2、最佳方法：添加一个字符串索引签名，前提是能够确定这个对象可能具有某些做为特殊用途使用的额外属性
interface SquareConfig2 {
  color?: string;
  width?: number;
  [propName: string]: any
}
// 5.3、将这个对象赋值给另一个变量，squareOptions不会经过额外属性检查
// let squareOptions = { colour: "red", width: 100 }；let mySquare = createSquare(squareOptions);

// 6、函数类型
// 接口表示函数类型，需要给接口定义一个调用签名。一个只有参数列表和返回值类型的函数定义。
// 函数的参数会逐个进行检查，要求对应位置上的参数类型是兼容的。如果不指定类型，ts的类型系统会推断出参数类型
interface SearchFunc {
  (source: string, subString: string): boolean
}
let mySearch: SearchFunc
mySearch = function (source: string, sub: string) { // 函数的参数名不需要与接口定义的名字相匹配
  let result = source.search(sub) // js search()方法检索字符串中指定的子字符串
  return result > -1
}

// 7、可索引的类型
// 与函数类型差不多，有一个索引签名，描述对象索引的类型，还有响应的索引返回值类型
// ts支持两种索引签名：字符串和数字。可同时使用两种类型的索引，但是数字的索引返回值必须是字符串索引返回值的子类型
// 因为当使用number索引时，js会将它转换成string然后去索引对象
interface StringArray { // 当用number去索引StringArray时会得到string类型的返回值
  [index: number]: string
}
let myArray: StringArray
myArray = ['Bob', "Fred"]
let myStr: string = myArray[0]
// 字符串索引签名能够描述dictionary模式，会确保所有属性与其返回值类型相匹配
// 字符串索引声明了obj.property和obj['property']两种形式都可以
// 将索引签名设置为只读，防止给索引赋值
interface ReadonlyStringArray {
  readonly [ndex: number]: string
}
let myReadonlyStringArray: ReadonlyStringArray = ['Alici', 'Bob'] // myReadonlyStringArray[2] = 'Mallory' => error!
// 8、类类型，实现接口
// 9、继承接口
// 10、混合类型
// 11、接口继承类
/*-------------------------------------------------------- 四、类 --------------------------------------------------------*/

/*-------------------------------------------------------- 五、函数 --------------------------------------------------------*/
// js 2种发方式定义函数
// function add (x, y) { return x + y }
// let myAdd = function (x, y) { return x + y }
// 函数类型包含两部分：参数类型和返回值类型
let myAdd = function(x: number, y: number): number { return x + y; };
let myAdd1: (x: number, y: number) => number = function(x: number, y: number): number {return x + y};
// 使用?实现可选参数，可选参数必须在必须参数后
// 必须参数后面的带默认初始化的参数都是可选的，如果默认参数在必须参数前，用户必须传入undefined值来获得默认值
function buildName(firstName = 'Will', lastName: string) { return firstName + ' ' + lastName }
let result1 = buildName( undefined, 'Adms')
// 剩余参数，会被当作个数不限的可选参数，可以一个都没有
function buildName1(firstName: string, ...restOfName: string[]) { return firstName + ' ' + restOfName.join(' ') }
let buildName2: (fname: string, ...rest: string[]) => string = buildName1

// this
// this的值在函数被调用的时候才会指定

/*-------------------------------------------------------- 六、泛型 --------------------------------------------------------*/
// 1、使用泛型来创建可重用的组件，一个组件可以支持多种类型的数据
function identity(arg: number): number { // 返回任何传入它的值
  return arg
}
// 使用类型变量T，使返回值的类型与传入参数的类型相同
// 类型变量T，捕获用户传入的类型，之后再次使用T当做返回值类型
function identity2<T>(arg: T): T {
  return arg
}
// 定义了泛型函数后，可以用两种方法使用
// 1.1、传入所有的参数，包含类型参数
let output = identity2<string>('myStr')
// 1.2、利用类型推论
let output2 = identity2('myStr')

// 2、使用泛型变量
// 想要打印arg的长度
function loggingIdentity<T>(arg: T): T{
  // console.log(arg.length) => Error：T 上不存在属性length。因为T代表的是任意类型，数字类型没有.length
  return arg
}
// 如果想操作T类型的数组而不直接是T，.length属性是应该存在的
function loggingIdentity2<T>(arg: T[]): T[]{
  console.log(arg.length)
  return arg
}

// 3、泛型类型
function identity3<T>(arg: T): T { return arg }
let myIdentity: <T>(arg: T) => T = identity3 // 函数声明
let myIdentity2: <U>(arg: U) => U =identity3 // 使用不同的泛型参数名
let myIdentity3: { <T>(arg: T): T } = identity3 // 使用带有调用签名的对象字面量来定义泛型函数
// 用对象字面量，实现泛型接口
interface GenericIdentityFn { <T>(arg: T): T }
let myIdentity4: GenericIdentityFn = identity3
// 把泛型参数当作整个接口的一个参数
interface GenericIdentityFn2<T> { (arg: T): T }
let myIdentity5: GenericIdentityFn2<number> = identity3

// 4、泛型类
// 泛型类指的是实例部分的类型，所以类的静态属性不能使用整个泛型类型
class GenericNumber<T> {
  zeroValue: T
  add: (x: T, y: T) => T
}
let myGenericNumber = new GenericNumber<number>() // 或者 let stringNumeric = new GenericNumber<string>()
myGenericNumber.zeroValue = 0 // 或者 stringNumeric.zeroValue = "";
myGenericNumber.add = function(x, y) { return x + y } // stringNumeric.add = function(x, y) { return x + y; };

// 5、无法创建泛型枚举和泛型命名空间

// 6、泛型约束
// 实现可以访问arg的length属性
// 定义一个接口来描述约束条件，创建一个包含.length属性的接口，使用这个接口和extends关键字来实现约束
interface Lengthwise { length: number }
function loggingIdentity3<T extends Lengthwise>(arg: T): T {
  // 现在我们知道他有.length属性，就不会报错
  // 但是不再适用于任意类型，loggingIdentity3(3) => Error， number不包含.length 属性
  // 需要传入符合约束类型的值，必须包含必须的属性 loggingIdentity3({length: 10, value: 3})
  console.log(arg.length)
  return arg
}
// 在泛型约束中使用类型参数
// 在泛型里使用类类型

/*-------------------------------------------------------- 七、枚举 --------------------------------------------------------*/

/*-------------------------------------------------------- 八、类型推论 --------------------------------------------------------*/

/*-------------------------------------------------------- 九、类型兼容性 --------------------------------------------------------*/

/*-------------------------------------------------------- 十、高级类型 --------------------------------------------------------*/
// 1、交叉类型，将多个类型合并为一个类型
function extend<T, U>(first: T, second: U): T & U{
  let result = <T & U>{}
  for (let id in first) {
    (<any>result)[id] = (<any>first)[id]
  }
  for (let id in second) {
    if (!result.hasOwnProperty(id)) {
        (<any>result)[id] = (<any>second)[id];
    }
  }
  return result
}
// 2、联合类型
function padLeft(value: string, padding: string | number) {
  if (typeof padding === 'number') {
    return Array(padding + 1).join(' ') + value
  }
  if (typeof padding === 'string') {
    return padding + value
  }
  throw new Error(`Expected string or number, got ${padding}`)
}
// 类型保护与区分类型
// 3、类型别名
// 给以i个类型起个新名字。类型别名有时和接口很像，但可作用于原始值，联合类型，元组以及其它任何需要手写的类型
type typeName = string
type typeNameResolver = () => string
type typeNameOrResolver = typeName | typeNameResolver
function typeGetName(n: typeNameOrResolver): typeName {
  if ( typeof n === 'string' ) { return n }
  else { return n() }
}
// 起别名不会新建一个类型，它创建了一个新名字来引用那个类型。给原始类型起名通常没申明用
// 类型别名也可以是泛型
type Container<T> = { value: T }
// 使用类型别名在属性里引用自己
type Tree<T> = {
  value: T
  left: Tree<T>
  right: Tree<T>
}
// 类型别名与交叉类型一起使用
type LinkedList<T> = T & { next: LinkedList<T> }
// 类型别名不能出现在声明右侧的任何地方 type Yikes = Array<Yikes> => Error

/*-------------------------------------------------------- 十一、Symbols --------------------------------------------------------*/

/*-------------------------------------------------------- 十二、迭代器和生成器 --------------------------------------------------------*/

/*-------------------------------------------------------- 十三、模块 --------------------------------------------------------*/
// 模块在其自身的作用域里执行，而不是在全局作用域里。使用export导出，使用import导入
// 模块使用模块加载器去导入其它的模块。 在运行时，模块加载器的作用是在执行此模块代码前去查找并执行这个模块的所有依赖。 大家最熟知的JavaScript模块加载器是服务于Node.js的 CommonJS和服务于Web应用的Require.js。
// TypeScript与ECMAScript 2015一样，任何包含顶级import或者export的文件都被当成一个模块。相反地，如果一个文件不带有顶级的import或者export声明，那么它的内容被视为全局可见的（因此对模块也是可见的
// 1、导出声明
export interface StringValidator { isAcceptable(s: string): boolean }
export const numberRegexp = /^[0-9]+$/
export class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s)
  }
}

// 2、导出语句
class ZipCodeValidator2 implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s)
  }
}
export { ZipCodeValidator2 }
export { ZipCodeValidator2 as mainValidator }

// 3、重新导出
// 使用重新导出进行扩展一个模块的功能

// 4、导入
// import { ZipCodeValidator } from "./ZipCodeValidator";
// import { ZipCodeValidator as ZCV } from "./ZipCodeValidator";  对导入内容重命名
// import * as validator from "./ZipCodeValidator";  将整个模块导入到一个变量，并通过它来访问模块的导出部分

// 5、默认导出
// 每个模块都可以有一个default导出。 默认导出使用 default关键字标记；并且一个模块只能够有一个default导出。 需要使用一种特殊的导入形式来导入 default导出
// 类和函数声明可以直接被标记为默认导出。 标记为默认导出的类和函数的名字是可以省略的
// export default class ZipCodeValidator {
//   static numberRegexp = /^[0-9]+$/;
//   isAcceptable(s: string) {
//       return s.length === 5 && ZipCodeValidator.numberRegexp.test(s);
//   }
// }
// import validator from "./ZipCodeValidator";
// let myValidator = new validator();

// 6、export = 和 import = require()
// let numberRegexp = /^[0-9]+$/;
// class ZipCodeValidator {
//     isAcceptable(s: string) {
//         return s.length === 5 && numberRegexp.test(s);
//     }
// }
// export = ZipCodeValidator;
// import zip = require("./ZipCodeValidator");
// let validator = new zip();


/*-------------------------------------------------------- 十四、命名空间 --------------------------------------------------------*/
// '内部模块'称做'命名空间'，'外部模块'简称'模块'
// 任何使用module关键字来声明一个内部魔魁啊的地方都应该使用namespace关键字来替换
namespace Validation {
  export interface StringValidator {
      isAcceptable(s: string): boolean;
  }

  const lettersRegexp = /^[A-Za-z]+$/;
  const numberRegexp = /^[0-9]+$/;

  export class LettersOnlyValidator implements StringValidator {
      isAcceptable(s: string) {
          return lettersRegexp.test(s);
      }
  }

  export class ZipCodeValidator implements StringValidator {
      isAcceptable(s: string) {
          return s.length === 5 && numberRegexp.test(s);
      }
  }
}

/*-------------------------------------------------------- 十五、命名空间和模块 --------------------------------------------------------*/

/*-------------------------------------------------------- 十六、模块解析 --------------------------------------------------------*/

/*-------------------------------------------------------- 十七、声明合并 --------------------------------------------------------*/

/*-------------------------------------------------------- 十八、JSX --------------------------------------------------------*/

/*-------------------------------------------------------- 十九、装饰器 --------------------------------------------------------*/

/*-------------------------------------------------------- 二十、Mixins --------------------------------------------------------*/

/*-------------------------------------------------------- 二十一、三斜线指令 --------------------------------------------------------*/

/*-------------------------------------------------------- 二十二、 JavaScript文件类型检查 --------------------------------------------------------*/