function Dog() {
    this.age = 11;
    this.color = "black";
    this.dogName = "Ralph"; //Using this.dogName instead of .name
    return this;
}

Dog.prototype.name = function (name) {
    this.dogName = name;
    return this;
}
Dog.prototype.ciao = function () {
    alert("ciao");
}

function main__() {
    const myNewDog = new Dog();
    myNewDog.name("Cassidy"); //Dog { age: 11, color: 'black', dogName: 'Cassidy' }

    console.log(myNewDog);
}

(function() {
    main__();
})()
