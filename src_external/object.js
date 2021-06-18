//== everything can be an object in JS

let person = {
    name: "nhat",
    age: "20",
    set setName(name) {
        this.name = name;
    },
    setAge: (age) => { this.age = age}
};
// add new method
person.new_method = (x) => x;

// add new property
person.new_property = 'new property';
console.log(person.new_method('new method'));
console.log(person.new_property);

// check isFunction
for(let x in person) {
    if((typeof person[x]) == 'function')
    console.log(person[x]("function"));
}

// function
person.setAge(25);

// set method is considered as a property of obj
person.setName = "van ngoc";
console.log(person.age);
console.log(person.name);

// object constructor
function Human(name, age) {
    this.name = name;
    this.age = age;
}
let human = new Human('nhat', '20');
console.log(human);
// just add in human (object), not added in Human (constructor)
human.money = 3000;
human.setMoney = (money) => {human.money = money};
human.setMoney(100);
let human_copy = new Human('phap', 17);
console.log(human);
console.log(human_copy)

Human.prototype.money = 300;
let human_pro = new Human('nghi', 200);
console.log(human_pro.money);
console.log(12 % 5);