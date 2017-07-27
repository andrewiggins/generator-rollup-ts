class Base {
  public greet(): void {
    // tslint:disable:no-console
    console.log("Hello World!");
  }
}

class Child extends Base {}

let c = new Child();
c.greet();
