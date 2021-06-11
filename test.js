
var cat = {
    name: 'Tom',
    getName: function(nameSen){
        console.log(`${nameSen}, My name is ${this.name}`);
    }
}

var dog = {
    name: 'Dog'
}

var myFunc = cat.getName.bind(dog);
myFunc('Khánh');
